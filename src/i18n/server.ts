import { locale as rootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, href as mkHref, type Locale } from "./config";
import { makeFormat } from "./format";
import { loadMessages, makeT } from "./messages";

/** Locale, translator, formatters and link helper for any Server Component (no prop drilling). */
export async function getI18n() {
  const l = await rootLocale();
  if (!hasLocale(l)) notFound();
  const messages = await loadMessages(l);
  return { locale: l as Locale, t: makeT(messages), f: makeFormat(l), messages, href: (p: string) => mkHref(l, p) };
}
export type I18n = Awaited<ReturnType<typeof getI18n>>;
