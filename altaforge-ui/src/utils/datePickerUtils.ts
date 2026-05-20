import type { DateRange } from "./dateUtils";
import { createDateRange, normalizeDate, createSingleDayRange, formatDateForRange } from "./dateUtils";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export interface CalendarDay {
  day: number | null;
  date: Date | null;
}

export function getDaysInMonth(date: Date): CalendarDay[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: CalendarDay[] = Array(startingDayOfWeek)
    .fill(null)
    .map(() => ({ day: null, date: null }));

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      date: new Date(year, month, day),
    });
  }

  return days;
}

export type PresetType = "today" | "7days" | "30days" | "custom";

export interface DatePreset {
  type: PresetType;
  label: string;
  getRange: () => DateRange;
}

export const PRESETS: DatePreset[] = [
  {
    type: "today",
    label: "Today",
    getRange: () => createSingleDayRange(new Date()),
  },
  {
    type: "7days",
    label: "Last 7 days",
    getRange: () => createDateRange(7),
  },
  {
    type: "30days",
    label: "Last 30 days",
    getRange: () => createDateRange(30),
  },
];

export function detectPreset(range: DateRange): PresetType {
  if (!range.start || !range.end) {
    return "custom";
  }

  const start = normalizeDate(new Date(range.start));
  const end = normalizeDate(new Date(range.end));
  const today = normalizeDate(new Date());

  if (start.getTime() === today.getTime() && end.getTime() === today.getTime()) {
    return "today";
  }

  const sevenDaysAgo = normalizeDate(new Date(today));
  sevenDaysAgo.setDate(today.getDate() - 6);
  if (
    Math.abs(start.getTime() - sevenDaysAgo.getTime()) < 86400000 &&
    Math.abs(end.getTime() - today.getTime()) < 86400000
  ) {
    return "7days";
  }

  const thirtyDaysAgo = normalizeDate(new Date(today));
  thirtyDaysAgo.setDate(today.getDate() - 29);
  if (
    Math.abs(start.getTime() - thirtyDaysAgo.getTime()) < 86400000 &&
    Math.abs(end.getTime() - today.getTime()) < 86400000
  ) {
    return "30days";
  }

  return "custom";
}

export function getRangeDisplayText(range: DateRange): string {
  if (!range.start || !range.end) {
    return "-";
  }

  const start = normalizeDate(new Date(range.start));
  const end = normalizeDate(new Date(range.end));
  const today = normalizeDate(new Date());

  if (start.getTime() === today.getTime() && end.getTime() === today.getTime()) {
    return "Today";
  }

  const sevenDaysAgo = normalizeDate(new Date(today));
  sevenDaysAgo.setDate(today.getDate() - 6);
  if (start.getTime() === sevenDaysAgo.getTime() && end.getTime() === today.getTime()) {
    return "Last 7 days";
  }

  const thirtyDaysAgo = normalizeDate(new Date(today));
  thirtyDaysAgo.setDate(today.getDate() - 29);
  if (start.getTime() === thirtyDaysAgo.getTime() && end.getTime() === today.getTime()) {
    return "Last 30 days";
  }

  return start.getTime() === end.getTime()
    ? formatDateForRange(start, start.getFullYear() !== today.getFullYear())
    : `${formatDateForRange(start, start.getFullYear() !== today.getFullYear())} - ${formatDateForRange(end, end.getFullYear() !== today.getFullYear())}`;
}
