import type { Locale } from '@core/enums/locale.enum';

/** A value that must exist in every supported language. */
export type Localized<T> = Readonly<Record<Locale, T>>;
