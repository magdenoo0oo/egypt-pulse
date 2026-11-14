"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import { href as mkHref } from "./config";
import { makeFormat, type Format } from "./format";
import { makeT, type Messages, type T } from "./messages";

type Ctx = { locale: Locale; t: T; f: Format; href: (p: string) => string };
const I18nContext = createContext<Ctx | null>(null);

/** Gives Client Components the locale and the small `c.*` slice of the dictionary. */
export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Partial<Messages>; children: ReactNode }) {
  const value = useMemo<Ctx>(
    () => ({ locale, t: makeT(messages as Messages), f: makeFormat(locale), href: (p) => mkHref(locale, p) }),
    [locale, messages],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const v = useContext(I18nContext);
  if (!v) throw new Error("useI18n outside I18nProvider");
  return v;
}
