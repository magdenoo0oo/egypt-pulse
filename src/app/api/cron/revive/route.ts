/**
 * Second, independent trigger for the daily data job.
 *
 * GitHub can silently pause scheduled workflows (for example after 60 days without repo activity) and a paused
 * schedule cannot wake itself up. Vercel Cron calls this route once a day from different infrastructure; it makes sure
 * the workflow is enabled and starts a run if the last successful one is older than 8 hours.
 *
 * Needs three env vars on Vercel (see CLAUDE.md): CRON_SECRET, GITHUB_DISPATCH_TOKEN, optionally GITHUB_REPO.
 * Without them it does nothing and says so.
 */
import { connection } from "next/server";

const WORKFLOW = "daily.yml";

export async function GET(req: Request) {
  await connection(); // always run at request time: env vars and the auth header must never be frozen at build time
  const secret = process.env.CRON_SECRET;
  const token = process.env.GITHUB_DISPATCH_TOKEN;
  if (!secret || !token) return Response.json({ configured: false, note: "Set CRON_SECRET and GITHUB_DISPATCH_TOKEN to enable the revive job." });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "unauthorized" }, { status: 401 });

  const repo = process.env.GITHUB_REPO ?? "magdenoo0oo/egypt-pulse";
  const gh = (path: string, init?: RequestInit) =>
    fetch(`https://api.github.com/repos/${repo}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...init?.headers },
      signal: AbortSignal.timeout(15_000),
    });

  try {
    const wfRes = await gh(`/actions/workflows/${WORKFLOW}`);
    if (!wfRes.ok) return Response.json({ ok: false, step: "read workflow", status: wfRes.status }, { status: 502 });
    const wf = (await wfRes.json()) as { state: string };

    let reenabled = false;
    if (wf.state !== "active") reenabled = (await gh(`/actions/workflows/${WORKFLOW}/enable`, { method: "PUT" })).status === 204;

    const runsRes = await gh(`/actions/workflows/${WORKFLOW}/runs?per_page=1&status=success`);
    const runs = runsRes.ok ? ((await runsRes.json()) as { workflow_runs?: { created_at: string }[] }) : {};
    const last = runs.workflow_runs?.[0]?.created_at;
    const hoursAgo = last ? (Date.now() - Date.parse(last)) / 3_600_000 : null;

    let dispatched = false;
    if (hoursAgo === null || hoursAgo > 8) {
      dispatched = (await gh(`/actions/workflows/${WORKFLOW}/dispatches`, { method: "POST", body: JSON.stringify({ ref: "main" }) })).status === 204;
    }
    return Response.json({ ok: true, workflowState: wf.state, reenabled, lastSuccessHoursAgo: hoursAgo === null ? null : Math.round(hoursAgo * 10) / 10, dispatched });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "unknown" }, { status: 502 });
  }
}
