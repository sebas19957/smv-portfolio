export const LOCALES = ['en', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** BCP 47 tags used for `<html lang>`, `og:locale` and locale-aware casing. */
export const LOCALE_TAGS: Record<Locale, { lang: string; og: string }> = {
  en: { lang: 'en', og: 'en_US' },
  es: { lang: 'es', og: 'es_CO' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Resolves the locale of the current route, falling back to the default locale. */
export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Uppercases copy with the locale's casing rules (keeps accents such as "SOBRE MÍ"). */
export function toUpper(text: string, locale: Locale): string {
  return text.toLocaleUpperCase(LOCALE_TAGS[locale].lang);
}
