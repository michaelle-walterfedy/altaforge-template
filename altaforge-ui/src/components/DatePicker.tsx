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
import { normalizeDate, formatDateForRange } from "../utils/dateUtils";
import { MONTH_NAMES, DAYS_OF_WEEK, getDaysInMonth } from "../utils/datePickerUtils";
import styles from "./DatePicker.module.css";

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const initialMonth = useMemo(() => {
    if (value) {
      const d = new Date(value);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date();
  }, []);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [open, setOpen] = useState(false);

  const today = useMemo(() => normalizeDate(new Date()), []);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [value]);

  const calendarDays = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  const displayText = useMemo(() => {
    if (!value) return "Select date...";
    const d = normalizeDate(new Date(value));
    return d.getTime() === today.getTime() ? "Today" : formatDateForRange(d, d.getFullYear() !== today.getFullYear());
  }, [value, today]);

  const handleDayClick = useCallback(
    (day: number | null) => {
      if (!day) return;
      const clicked = normalizeDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      if (clicked > today) return;
      onChange(clicked.toISOString());
      setOpen(false);
    },
    [currentMonth, onChange, today],
  );

  const isToday = useCallback(
    (day: number | null): boolean => {
      if (!day) return false;
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      return normalizeDate(date).getTime() === today.getTime();
    },
    [currentMonth, today],
  );

  const isDateSelected = useCallback(
    (day: number | null): boolean => {
      if (!day || !value) return false;
      const date = normalizeDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      return date.getTime() === normalizeDate(new Date(value)).getTime();
    },
    [currentMonth, value],
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
        const next = new Date(prev);
        next.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
        if (normalizeDate(next) > today) return prev;
        return next;
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
          const last = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
          newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), last);
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

      if (newDate && normalizeDate(newDate) <= today) {
        const ny = newDate.getFullYear();
        const nm = newDate.getMonth();
        const nd = newDate.getDate();
        if (nm !== currentMonth.getMonth() || ny !== currentMonth.getFullYear()) {
          setCurrentMonth(new Date(ny, nm, 1));
          setTimeout(() => {
            const el = document.querySelector(
              `button[data-day="${nd}"][data-month="${nm}"][data-year="${ny}"]`,
            ) as HTMLButtonElement;
            if (el && !el.disabled) {
              el.tabIndex = 0;
              el.focus();
            }
          }, 0);
        } else {
          const el = e.currentTarget.parentElement?.querySelector(
            `button[data-day="${nd}"][data-month="${nm}"][data-year="${ny}"]`,
          ) as HTMLButtonElement;
          if (el && !el.disabled) {
            el.tabIndex = 0;
            el.focus();
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
          highContrast
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`Date picker. Current: ${displayText}. Press Enter or Space to open.`}
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
        aria-label="Date picker"
        aria-modal="false"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className={styles.layout}>
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
              const hasSelected = calendarDays.some((d) => d.day && isDateSelected(d.day));
              const firstDay = 1;
              const firstDayDate = normalizeDate(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), firstDay),
              );
              const firstValid = firstDayDate <= today;

              return calendarDays.map((cell, idx) => {
                const day = cell.day;
                const selected = isDateSelected(day);
                const isTodayDay = isToday(day);
                const future = isDateInFuture(day);

                if (!day) {
                  return (
                    <div key={idx} className={`${styles.day} ${styles.empty}`} role="gridcell" aria-hidden="true" />
                  );
                }

                const date = cell.date ?? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const dateLabel = date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                let ariaLabel = dateLabel;
                if (selected) ariaLabel += ". Selected";
                if (isTodayDay) ariaLabel += ". Today";
                if (future) ariaLabel += ". Disabled, future date";

                const focusable = selected || (!hasSelected && firstValid && day === firstDay);

                return (
                  <Button
                    key={idx}
                    className={[styles.day, isTodayDay ? styles.today : "", selected ? styles.selected : ""]
                      .filter(Boolean)
                      .join(" ")}
                    disabled={future}
                    onClick={() => handleDayClick(day)}
                    onKeyDown={(e) => handleDayKeyDown(e, day)}
                    type="button"
                    role="gridcell"
                    aria-label={ariaLabel}
                    aria-selected={selected}
                    data-day={day}
                    data-month={currentMonth.getMonth()}
                    data-year={currentMonth.getFullYear()}
                    tabIndex={focusable ? 0 : -1}
                    size="1"
                  >
                    {day}
                  </Button>
                );
              });
            })()}
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default DatePicker;
