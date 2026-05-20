import React, { useState, useMemo, useRef, useCallback } from "react";
import { CheckIcon, ChevronDownIcon, Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Text, Badge, Button, Popover, ScrollArea, Separator, TextField, IconButton } from "../themes";
import styles from "./ItemDropdown.module.css";

export interface ItemDropdownItem {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
  tag?: string;
  tagColor?: "cyan" | "blue" | "green" | "orange" | "red" | "purple" | "gray";
}

export interface ItemDropdownProps {
  items?: ItemDropdownItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  title?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  triggerIcon?: React.ReactNode;
  width?: number;
}

const ItemDropdown: React.FC<ItemDropdownProps> = ({
  items = [],
  selectedId,
  onSelect,
  title,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  triggerIcon,
  width = 360,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = useMemo(() => items.find((i) => i.id === selectedId) ?? null, [items, selectedId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.tag?.toLowerCase().includes(q),
    );
  }, [items, search]);

  const handleListKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const count = filtered.length;
      if (count === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = focusedIndex < count - 1 ? focusedIndex + 1 : 0;
        setFocusedIndex(next);
        itemRefs.current[next]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = focusedIndex > 0 ? focusedIndex - 1 : count - 1;
        setFocusedIndex(prev);
        itemRefs.current[prev]?.focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < count) {
          onSelect?.(filtered[focusedIndex].id);
          setOpen(false);
        }
      }
    },
    [filtered, focusedIndex, onSelect],
  );

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setFocusedIndex(-1);
      }}
    >
      <Popover.Trigger>
        <Button
          variant="outline"
          color="gray"
          size="2"
          disabled={items.length === 0}
          radius="large"
          className={styles.triggerButton}
        >
          {(triggerIcon || selected?.icon) && (
            <span className={styles.triggerIconWrap}>{triggerIcon || selected?.icon}</span>
          )}
          <Text size="1" weight="medium">
            {selected ? selected.name : placeholder}
          </Text>
          <ChevronDownIcon className={styles.chevronIcon} />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="end"
        sideOffset={4}
        collisionPadding={16}
        className={styles.popoverContent}
        style={{ width }}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const idx = filtered.findIndex((i) => i.id === selectedId);
          const target = idx >= 0 ? idx : 0;
          setFocusedIndex(target);
          requestAnimationFrame(() => itemRefs.current[target]?.focus());
        }}
      >
        {(title || items.length > 5) && (
          <>
            <Box className={styles.headerSection}>
              {title && (
                <Box className={styles.titleRow}>
                  <Text size="3" weight="bold">
                    {title}
                  </Text>
                  <Text size="1" color="gray">
                    {items.length}
                  </Text>
                </Box>
              )}
              {items.length > 5 && (
                <TextField.Root
                  size="1"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={styles.searchField}
                >
                  <TextField.Slot side="left">
                    <MagnifyingGlassIcon className={styles.searchIcon} />
                  </TextField.Slot>
                  <TextField.Slot>
                    {search && (
                      <IconButton
                        size="1"
                        variant="ghost"
                        color="gray"
                        onClick={() => setSearch("")}
                        className={styles.clearButton}
                      >
                        <Cross2Icon height="14" width="14" />
                      </IconButton>
                    )}
                  </TextField.Slot>
                </TextField.Root>
              )}
            </Box>
            <Separator size="4" className={styles.separator} />
          </>
        )}

        <Box className={styles.listSection}>
          <ScrollArea size="1" scrollbars="vertical" className={styles.scrollArea}>
            <Box role="listbox" aria-label={title || "Select an item"} onKeyDown={handleListKeyDown}>
              {filtered.map((item, index) => {
                const isSelected = selectedId === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={focusedIndex === index ? 0 : -1}
                    onClick={() => {
                      onSelect?.(item.id);
                      setOpen(false);
                    }}
                    className={isSelected ? styles.itemButtonSelected : styles.itemButton}
                  >
                    {item.icon && (
                      <Box className={isSelected ? styles.itemIconBoxSelected : styles.itemIconBox}>{item.icon}</Box>
                    )}
                    <Box className={styles.itemTextBox}>
                      <Text size="2" weight="bold" className={styles.itemName}>
                        {item.name}
                      </Text>
                      {item.description && (
                        <Text size="1" color="gray" className={styles.itemDescription}>
                          {item.description}
                        </Text>
                      )}
                    </Box>
                    {item.tag && (
                      <Badge
                        size="1"
                        color={item.tagColor ?? "cyan"}
                        variant="soft"
                        radius="full"
                        className={styles.itemTag}
                      >
                        {item.tag}
                      </Badge>
                    )}
                    {isSelected && <CheckIcon className={styles.checkIndicator} />}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <Text size="1" color="gray" className={styles.emptyText}>
                  No items found
                </Text>
              )}
            </Box>
          </ScrollArea>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ItemDropdown;
