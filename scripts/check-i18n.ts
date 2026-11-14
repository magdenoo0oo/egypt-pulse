/**
 * Checks every locale dictionary against the Arabic source: same keys, same {placeholders}.
 *   tsx scripts/check-i18n.ts          -> all locales
 *   tsx scripts/check-i18n.ts fr de    -> only these
 */
import { LOCALES } from "../src/i18n/config";
import { ar } from "../src/i18n/messages/ar";

const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
const wanted = process.argv.slice(2);
let bad = 0;

async function main() {
for (const l of LOCALES) {
  if (l === "ar" || (wanted.length && !wanted.includes(l))) continue;
  let dict: Record<string, string>;
  try {
    dict = (await import(`../src/i18n/messages/${l}.ts`))[l];
  } catch (e) {
    console.log(`${l}: missing or broken file (${(e as Error).message.split("\n")[0]})`);
    bad++;
    continue;
  }
  const problems: string[] = [];
  for (const k of Object.keys(ar)) {
    const v = dict[k];
    if (typeof v !== "string" || !v.trim()) problems.push(`missing ${k}`);
    else if (ph(v) !== ph((ar as Record<string, string>)[k])) problems.push(`placeholders differ in ${k}: ${ph(v)} vs ${ph((ar as Record<string, string>)[k])}`);
    else if (/[؀-ۿ]/.test(v) && k !== "brand") problems.push(`Arabic letters left in ${k}`);
  }
  for (const k of Object.keys(dict)) if (!(k in ar)) problems.push(`extra key ${k}`);
  if (problems.length) { bad += problems.length; console.log(`${l}: ${problems.length} problems\n  ` + problems.slice(0, 15).join("\n  ")); }
  else console.log(`${l}: ok (${Object.keys(ar).length} keys)`);
}
}

main().then(() => process.exit(bad ? 1 : 0));
