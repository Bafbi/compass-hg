export const serviceEnum = ['RH', 'IT', 'FINANCE', 'ADMIN'] as const;
export type Service = typeof serviceEnum[number];

export const statusEnum = ['OPEN', 'CLOSED', 'PENDING'] as const;
export type Status = typeof statusEnum[number];

export function isEnumValue<T extends string>(enumArray: readonly T[], value: string): value is T {
  return enumArray.includes(value as T);
}