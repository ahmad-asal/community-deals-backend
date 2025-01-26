export type omitAndPartial<T, K extends keyof T> = Partial<Omit<T, K>>;
