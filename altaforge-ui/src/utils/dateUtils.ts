export interface DateRange {
  start: string;
  end: string;
}

export function createDateRange(days: number): DateRange {
  const today = new Date();
  const end = new Date(today);
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));

  const normalizedStart = normalizeDate(start);
  const normalizedEnd = normalizeDate(today);
  normalizedEnd.setHours(23, 59, 59, 999);

  return {
    start: normalizedStart.toISOString(),
    end: normalizedEnd.toISOString(),
  };
}

export function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function createSingleDayRange(date: Date): DateRange {
  const normalized = normalizeDate(date);
  const end = new Date(normalized);
  end.setHours(23, 59, 59, 999);
  return {
    start: normalized.toISOString(),
    end: end.toISOString(),
  };
}

export function formatDateForRange(date: Date, includeYear: boolean = false): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: includeYear ? "numeric" : undefined,
  });
}
