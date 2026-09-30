import clsx, { type ClassValue } from 'clsx';

export const cn = (...v: ClassValue[]) => clsx(v);

export const EXPO = [0.16, 1, 0.3, 1] as const;
