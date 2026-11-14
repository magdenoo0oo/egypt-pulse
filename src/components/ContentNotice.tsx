import { hasNativeContent } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

/** Long-form text exists in Arabic and English only; say so on locales that fall back to English. */
export async function ContentNotice() {
  const { t, locale } = await getI18n();
  if (hasNativeContent(locale)) return null;
  return (
    <p lang="en" dir="ltr" className="mx-auto mt-4 max-w-page px-4 text-sm text-mute sm:px-6 xl:px-12">
      <span className="inline-block rounded-md border border-line bg-paper-2 px-3 py-1">{t("notice.content")}</span>
    </p>
  );
}
