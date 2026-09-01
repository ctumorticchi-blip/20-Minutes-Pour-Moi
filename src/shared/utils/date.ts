/** Date helpers. All "ISO date" strings here are plain `yyyy-mm-dd`, compared as local calendar days. */

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayIsoDate(): string {
  return toIsoDate(new Date());
}

export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

/** ISO weekday: 1 = Monday ... 7 = Sunday. */
export function isoWeekday(date: Date): number {
  const jsDay = date.getDay(); // 0 = Sunday
  return jsDay === 0 ? 7 : jsDay;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfIsoWeek(date: Date): Date {
  return addDays(date, -(isoWeekday(date) - 1));
}

/** Whole calendar days between two ISO dates (b - a), ignoring time of day. */
export function diffInDays(aIso: string, bIso: string): number {
  const a = parseIsoDate(aIso);
  const b = parseIsoDate(bIso);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}
