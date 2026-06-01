import React, { createContext, useMemo } from 'react';
import { usePreferencesStore, Locale } from '../store/preferences';
import es from './locales/es.json';
import en from './locales/en.json';

type Translations = typeof es;

const dictionaries: Record<Locale, Translations> = { es, en };

function getNestedValue(obj: unknown, path: string): string {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj) as string ?? path;
}

export type TranslateFn = (key: string) => string;

export const I18nContext = createContext<TranslateFn>((key) => key);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = usePreferencesStore((s) => s.locale);

  const t = useMemo<TranslateFn>(
    () => (key: string) => getNestedValue(dictionaries[locale], key),
    [locale]
  );

  return (
    <I18nContext.Provider value={t}>
      {children}
    </I18nContext.Provider>
  );
}
