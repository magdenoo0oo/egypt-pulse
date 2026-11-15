/**
 * Second, independent trigger for the daily data job.
 *
 * GitHub can silently pause scheduled workflows (for example after 60 days without repo activity) and a paused
 * schedule cannot wake itself up. Vercel Cron calls this route once a day from different infrastructure; it makes sure
 * the workflow is enabled and dispatches a planner run (force=false). That run commits only if today's plan has a slot
 * due (scripts/plan.mjs), so dispatching is always safe and any external scheduler may call this route as often as hourly.
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
  // Names only, never values: tells the owner which variable this deployment cannot see.
  const missing = [["CRON_SECRET", secret], ["GITHUB_DISPATCH_TOKEN", token]].filter(([, v]) => !v).map(([k]) => k);
  if (!secret || !token) return Response.json({ configured: false, missing, note: "Set the missing variables on Vercel (Production) and redeploy to enable the revive job." });
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

    // Observability only: how long since the last data commit on main (public repo, so any token can read it).
    const commitsRes = await gh(`/commits?sha=main&per_page=50`);
    const commits = commitsRes.ok ? ((await commitsRes.json()) as { commit: { message: string; committer: { date: string } } }[]) : [];
    const lastData = commits.find((c) => c.commit.message.startsWith("data: "))?.commit.committer.date;
    const hoursAgo = lastData ? Math.round(((Date.now() - Date.parse(lastData)) / 3_600_000) * 10) / 10 : null;

    const dispatched =
      (await gh(`/actions/workflows/${WORKFLOW}/dispatches`, { method: "POST", body: JSON.stringify({ ref: "main", inputs: { force: "false" } }) })).status === 204;
    return Response.json({ ok: true, workflowState: wf.state, reenabled, lastDataCommitHoursAgo: hoursAgo, dispatched });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "unknown" }, { status: 502 });
  }
}
