import type { Locale } from "../config";
import type { ar } from "./ar";

export type Messages = Record<keyof typeof ar, string>;
export type Key = keyof Messages;

const loaders: Record<Locale, () => Promise<Messages>> = {
  ar: () => import("./ar").then((m) => m.ar),
  en: () => import("./en").then((m) => m.en),
  fr: () => import("./fr").then((m) => m.fr),
  es: () => import("./es").then((m) => m.es),
  de: () => import("./de").then((m) => m.de),
  tr: () => import("./tr").then((m) => m.tr),
  ru: () => import("./ru").then((m) => m.ru),
  zh: () => import("./zh").then((m) => m.zh),
  hi: () => import("./hi").then((m) => m.hi),
  pt: () => import("./pt").then((m) => m.pt),
  it: () => import("./it").then((m) => m.it),
};

export const loadMessages = (l: Locale) => loaders[l]();

export type T = (key: Key, vars?: Record<string, string | number>) => string;

export function makeT(messages: Messages): T {
  return (key, vars) => {
    const s = messages[key];
    return vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s;
  };
}
