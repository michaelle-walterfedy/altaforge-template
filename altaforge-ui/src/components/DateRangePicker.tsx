import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Button,
  Text,
  IconButton,
  Popover,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../themes";
import type { DateRange } from "../utils/dateUtils";
import { normalizeDate, createSingleDayRange } from "../utils/dateUtils";
import {
  MONTH_NAMES,
  DAYS_OF_WEEK,
  getDaysInMonth,
  PRESETS,
  detectPreset,
  getRangeDisplayText,
  type PresetType,
} from "../utils/datePickerUtils";
import styles from "./DateRangePicker.module.css";

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>(value);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const today = useMemo(() => normalizeDate(new Date()), []);

  useEffect(() => {
    setSelectedRange(value);
  }, [value]);

  const isRangeCleared = useCallback((range: DateRange): boolean => {
    return !range.start || !range.end;
  }, []);

  const calendarDays = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);
  const activePreset = useMemo(() => detectPreset(selectedRange), [selectedRange]);
  const displayText = useMemo(() => {
    return getRangeDisplayText(selectedRange) || "Select date range...";
  }, [selectedRange]);

  const handlePresetSelect = useCallback(
    (preset: PresetType) => {
      if (preset === "custom") {
        const clearedRange: DateRange = { start: "", end: "" };
        setSelectedRange(clearedRange);
        setTempStartDate(null);
        return;
      }

      const presetConfig = PRESETS.find((p) => p.type === preset);
      if (!presetConfig) return;

      const newRange = presetConfig.getRange();
      setSelectedRange(newRange);
      onChange(newRange);
      setTempStartDate(null);

      const endDate = new Date(newRange.end);
      setCurrentMonth(new Date(endDate.getFullYear(), endDate.getMonth(), 1));
    },
    [onChange],
  );

  const handleDayClick = useCallback(
    (day: number | null) => {
      if (!day) return;

      const clickedDate = normalizeDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));

      if (clickedDate > today) {
        return;
      }

      if (!tempStartDate) {
        const newRange = createSingleDayRange(clickedDate);
        setSelectedRange(newRange);
        onChange(newRange);
        setTempStartDate(clickedDate);
      } else {
        const normalizedTemp = normalizeDate(tempStartDate);
        if (clickedDate.getTime() === normalizedTemp.getTime()) {
          setTempStartDate(null);
        } else {
          const start = clickedDate < tempStartDate ? clickedDate : tempStartDate;
          let end = clickedDate < tempStartDate ? tempStartDate : clickedDate;

          if (end > today) {
            end = new Date(today);
          }

          end.setHours(23, 59, 59, 999);
          const newRange: DateRange = {
            start: start.toISOString(),
            end: end.toISOString(),
          };
          setSelectedRange(newRange);
          onChange(newRange);
          setTempStartDate(null);
        }
      }
    },
    [currentMonth, tempStartDate, onChange, today],
  );

  const isToday = useCallback(
    (day: number | null): boolean => {
      if (!day) return false;
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      return normalizeDate(date).getTime() === today.getTime();
    },
    [currentMonth, today],
  );

  const isDateInRange = useCallback(
    (day: number | null): boolean => {
      if (!day) return false;
      if (isRangeCleared(selectedRange)) return false;
      const date = normalizeDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      const start = normalizeDate(new Date(selectedRange.start));
      const end = normalizeDate(new Date(selectedRange.end));
      return date >= start && date <= end;
    },
    [currentMonth, selectedRange, isRangeCleared],
  );

  const isDateSelected = useCallback(
    (day: number | null): boolean => {
      if (!day) return false;
      if (isRangeCleared(selectedRange)) return false;
      const date = normalizeDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      const start = normalizeDate(new Date(selectedRange.start));
      const end = normalizeDate(new Date(selectedRange.end));
      return date.getTime() === start.getTime() || date.getTime() === end.getTime();
    },
    [currentMonth, selectedRange, isRangeCleared],
  );

  const isDateInFuture = useCallback(
    (day: number | null): boolean => {
      if (!day) return false;
      const date = normalizeDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      return date > today;
    },
    [currentMonth, today],
  );

  const navigateMonth = useCallback(
    (direction: "prev" | "next") => {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));

        const normalizedNewMonth = normalizeDate(newMonth);
        if (normalizedNewMonth > today) {
          return prev;
        }

        return newMonth;
      });
    },
    [today],
  );

  const handleDayKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, day: number | null) => {
      if (!day) return;

      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      let newDate: Date | null = null;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() - 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() + 7);
          break;
        case "ArrowUp":
          e.preventDefault();
          newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() - 7);
          break;
        case "Home":
          e.preventDefault();
          newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
          break;
        case "End": {
          e.preventDefault();
          const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
          newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), lastDay);
          break;
        }
        case "PageUp":
          e.preventDefault();
          navigateMonth("prev");
          return;
        case "PageDown":
          e.preventDefault();
          navigateMonth("next");
          return;
        case "Enter":
        case " ":
          e.preventDefault();
          handleDayClick(day);
          return;
        default:
          return;
      }

      if (newDate) {
        const normalizedNewDate = normalizeDate(newDate);
        if (normalizedNewDate <= today) {
          const newDay = newDate.getDate();
          const newMonth = newDate.getMonth();
          const newYear = newDate.getFullYear();

          if (newMonth !== currentMonth.getMonth() || newYear !== currentMonth.getFullYear()) {
            setCurrentMonth(new Date(newYear, newMonth, 1));
            setTimeout(() => {
              const targetButton = document.querySelector(
                `button[data-day="${newDay}"][data-month="${newMonth}"][data-year="${newYear}"]`,
              ) as HTMLButtonElement;
              if (targetButton && !targetButton.disabled) {
                targetButton.tabIndex = 0;
                targetButton.focus();
              }
            }, 0);
            return;
          }

          const targetButton = e.currentTarget.parentElement?.querySelector(
            `button[data-day="${newDay}"][data-month="${newMonth}"][data-year="${newYear}"]`,
          ) as HTMLButtonElement;
          if (targetButton && !targetButton.disabled) {
            targetButton.tabIndex = 0;
            targetButton.focus();
          }
        }
      }
    },
    [currentMonth, today, navigateMonth, handleDayClick],
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button
          variant="outline"
          size="2"
          color="gray"
          highContrast={true}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`Date range picker. Current selection: ${displayText}. Press Enter or Space to open.`}
          className={styles.triggerButton}
        >
          <CalendarIcon className={styles.calendarIcon} />
          <Text size="2" className={styles.triggerText}>
            {displayText}
          </Text>
          <ChevronDownIcon className={styles.chevronIcon} />
        </Button>
      </Popover.Trigger>

      <Popover.Content
        className={styles.popover}
        side="bottom"
        align="end"
        sideOffset={8}
        role="dialog"
        aria-label="Date range picker"
        aria-modal="false"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className={styles.layout}>
          <div className={styles.calendarSection}>
            <div className={styles.header}>
              <IconButton
                color="gray"
                variant="ghost"
                size="1"
                onClick={() => navigateMonth("prev")}
                aria-label="Previous month"
              >
                <ChevronLeftIcon />
              </IconButton>
              <Text size="2" className="month-label" weight="bold" role="heading" aria-level={2}>
                {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              <IconButton
                color="gray"
                variant="ghost"
                size="1"
                onClick={() => navigateMonth("next")}
                aria-label="Next month"
                disabled={normalizeDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)) > today}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>

            <div
              className={styles.grid}
              role="grid"
              aria-label={`Calendar for ${MONTH_NAMES[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
            >
              {DAYS_OF_WEEK.map((day) => (
                <Text key={day} color="gray" className={styles.dayHeader} role="columnheader" aria-label={day}>
                  {day}
                </Text>
              ))}

              {(() => {
                const hasSelectedInMonth = calendarDays.some((day) => day.day && isDateSelected(day.day));

                const firstDayOfMonth = 1;
                const firstDayDate = normalizeDate(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth(), firstDayOfMonth),
                );
                const isFirstDayValid = firstDayDate <= today;

                return calendarDays.map((calendarDay, index) => {
                  const isSelected = isDateSelected(calendarDay.day);
                  const inRange = isDateInRange(calendarDay.day);
                  const isTodayDay = isToday(calendarDay.day);
                  const isFuture = isDateInFuture(calendarDay.day);

                  if (!calendarDay.day) {
                    return (
                      <div key={index} className={`${styles.day} ${styles.empty}`} role="gridcell" aria-hidden="true" />
                    );
                  }

                  const date =
                    calendarDay.date || new Date(currentMonth.getFullYear(), currentMonth.getMonth(), calendarDay.day);

                  const normalizedDate = normalizeDate(date);
                  let isRangeStart = false;
                  let isRangeEnd = false;
                  if (!isRangeCleared(selectedRange)) {
                    const normalizedStart = normalizeDate(new Date(selectedRange.start));
                    const normalizedEnd = normalizeDate(new Date(selectedRange.end));
                    isRangeStart = normalizedDate.getTime() === normalizedStart.getTime();
                    isRangeEnd = normalizedDate.getTime() === normalizedEnd.getTime();
                  }

                  const isFirstDayOfMonth = calendarDay.day === 1;
                  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                  const isLastDayOfMonth = calendarDay.day === lastDayOfMonth;

                  const dateLabel = date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  let ariaLabel = dateLabel;
                  if (isSelected && !isRangeCleared(selectedRange)) {
                    const normalizedStart = normalizeDate(new Date(selectedRange.start));
                    const normalizedDateForAria = normalizeDate(date);
                    ariaLabel +=
                      normalizedDateForAria.getTime() === normalizedStart.getTime()
                        ? ". Start date selected"
                        : ". End date selected";
                  }
                  if (inRange && !isSelected) {
                    ariaLabel += ". In selected range";
                  }
                  if (isTodayDay) {
                    ariaLabel += ". Today";
                  }
                  if (isFuture) {
                    ariaLabel += ". Disabled, future date";
                  }

                  const isFocusable =
                    isSelected || (!hasSelectedInMonth && isFirstDayValid && calendarDay.day === firstDayOfMonth);

                  return (
                    <Button
                      key={index}
                      className={[
                        styles.day,
                        isTodayDay ? styles.today : "",
                        isSelected ? styles.selected : "",
                        inRange ? styles.inRange : "",
                        isRangeStart ? styles.rangeStart : "",
                        isRangeEnd ? styles.rangeEnd : "",
                        isFirstDayOfMonth ? styles.monthStart : "",
                        isLastDayOfMonth ? styles.monthEnd : "",
                      ]
                        .filter((x) => x !== "")
                        .join(" ")}
                      disabled={isFuture}
                      onClick={() => handleDayClick(calendarDay.day)}
                      onKeyDown={(e) => handleDayKeyDown(e, calendarDay.day)}
                      type="button"
                      role="gridcell"
                      aria-label={ariaLabel}
                      aria-selected={isSelected}
                      data-day={calendarDay.day}
                      data-month={currentMonth.getMonth()}
                      data-year={currentMonth.getFullYear()}
                      tabIndex={isFocusable ? 0 : -1}
                      size="1"
                    >
                      {calendarDay.day}
                    </Button>
                  );
                });
              })()}
            </div>
          </div>

          <div className={styles.shortcutsSection} role="group" aria-label="Date range presets">
            {PRESETS.map((preset) => (
              <Button
                key={preset.type}
                variant="outline"
                color={activePreset === preset.type ? undefined : "gray"}
                size="2"
                onClick={() => handlePresetSelect(preset.type)}
                aria-pressed={activePreset === preset.type}
                aria-label={`Select ${preset.label} date range`}
                className={
                  activePreset === preset.type
                    ? `${styles.shortcutSelected} ${styles.shortcutButton}`
                    : styles.shortcutButton
                }
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant="outline"
              size="2"
              color={activePreset === "custom" ? undefined : "gray"}
              onClick={() => handlePresetSelect("custom")}
              aria-pressed={activePreset === "custom"}
              aria-label={
                tempStartDate
                  ? "Select end date for custom range"
                  : isRangeCleared(selectedRange)
                    ? "Select start date for custom range"
                    : "Select custom date range"
              }
              className={
                activePreset === "custom"
                  ? `${styles.shortcutSelected} ${styles.shortcutButton}`
                  : styles.shortcutButton
              }
            >
              {tempStartDate ? "Select end date..." : isRangeCleared(selectedRange) ? "Select start date..." : "Custom"}
            </Button>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default DateRangePicker;
