import React, { useState, useRef, useEffect } from "react";
import { DropdownMenu, Text, Button, Flex, Box, ChevronDownIcon, ThickCheckIcon } from "../themes";
import styles from "./MultiSelect.module.css";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  allOption?: MultiSelectOption;
  defaultToAll?: boolean;
  minWidth?: string;
  maxHeight?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  allOption,
  defaultToAll = false,
  minWidth = "200px",
  maxHeight = "320px",
}) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const hasInteractedRef = useRef(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const regularOptions = allOption ? options.filter((o) => o.value !== allOption.value) : options;
  const allRegularValues = regularOptions.map((o) => o.value);
  const allOptions = allOption ? [allOption, ...regularOptions] : options;

  const isAllSelectedState = defaultToAll && allOption && value.length === 0 && !hasInteractedRef.current;
  const allSelected =
    isAllSelectedState || (allOption && regularOptions.length > 0 && allRegularValues.every((v) => value.includes(v)));
  const displayValue = isAllSelectedState ? allRegularValues : value;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setFocusedIndex(0);
    } else {
      setFocusedIndex(null);
    }
    if (
      !newOpen &&
      defaultToAll &&
      allOption &&
      value.length === 0 &&
      hasInteractedRef.current &&
      allRegularValues.length > 0
    ) {
      hasInteractedRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = index < allOptions.length - 1 ? index + 1 : 0;
      setFocusedIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = index > 0 ? index - 1 : allOptions.length - 1;
      setFocusedIndex(prevIndex);
      itemRefs.current[prevIndex]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle(allOptions[index].value);
    }
  };

  useEffect(() => {
    if (open && focusedIndex !== null && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [open, focusedIndex]);

  const handleToggle = (optionValue: string) => {
    hasInteractedRef.current = true;

    if (allOption && optionValue === allOption.value) {
      if (allSelected) {
        onChange([]);
      } else {
        if (defaultToAll) {
          onChange([]);
          hasInteractedRef.current = false;
        } else {
          onChange([...allRegularValues]);
        }
      }
    } else {
      const currentSelection = isAllSelectedState ? allRegularValues : value;
      const newValue = currentSelection.includes(optionValue)
        ? currentSelection.filter((v) => v !== optionValue)
        : [...currentSelection, optionValue];

      if (allOption && newValue.length === allRegularValues.length && defaultToAll) {
        onChange([]);
        hasInteractedRef.current = false;
      } else {
        onChange(newValue);
      }
    }
    setOpen(true);
  };

  const getDisplayText = () => {
    if (allOption && allSelected) {
      return allOption.label;
    }
    if (value.length === 1) {
      return options.find((o) => o.value === value[0])?.label || placeholder;
    }
    if (value.length === 0) {
      return placeholder;
    }
    return `${value.length} selected`;
  };

  const displayText = getDisplayText();

  return (
    <DropdownMenu.Root open={open} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger>
        <Button
          variant="outline"
          size="2"
          color="gray"
          highContrast={true}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Multi-select: ${displayText}`}
          className={styles.triggerButton}
          style={{ minWidth, width: minWidth }}
        >
          <Text size="2" className={styles.triggerText}>
            {displayText}
          </Text>
          <ChevronDownIcon className={styles.chevronIcon} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={5}
        aria-label="Select options"
        style={{ minWidth, maxHeight }}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {allOptions.map((option, index) => {
          const isAll = allOption && option.value === allOption.value;
          const isChecked = isAll ? allSelected : displayValue.includes(option.value);

          return (
            <DropdownMenu.Item
              key={option.value}
              className={styles.item}
              onSelect={(e) => {
                e.preventDefault();
                handleToggle(option.value);
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
            >
              <Flex align="center" gap="2">
                <Box className={styles.checkbox}>{isChecked && <ThickCheckIcon className={styles.checkIcon} />}</Box>
                <Text size="2">{option.label}</Text>
              </Flex>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MultiSelect;
