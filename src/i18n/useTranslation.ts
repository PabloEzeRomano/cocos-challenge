import { useContext } from 'react';
import { I18nContext, TranslateFn } from './provider';

export function useTranslation(): { t: TranslateFn } {
  const t = useContext(I18nContext);
  return { t };
}
