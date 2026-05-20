import React, { useState, useCallback, useEffect } from "react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { ScrollArea, Box } from "../themes";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup";
import { useSidebarContext } from "./SidebarContext";
import styles from "./NavMenu.module.css";

export interface NavMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  isDisabled?: boolean;
  rightIcon?: React.ReactNode;
  href?: string;
  children?: NavMenuItem[];
}

export interface NavMenuProps {
  items?: NavMenuItem[];
  children?: React.ReactNode;
  isExpanded?: boolean;
  activeRoute?: string;
  defaultOpenGroups?: string[];
  storageKey?: string;
  maxHeight?: string;
  onNavigate?: (id: string) => void;
  onExpandChange?: (expanded: boolean) => void;
}

const NavMenu: React.FC<NavMenuProps> = ({
  items,
  children,
  isExpanded: isExpandedProp,
  activeRoute,
  defaultOpenGroups,
  storageKey,
  maxHeight,
  onNavigate,
  onExpandChange,
}) => {
  const sidebarCtx = useSidebarContext();
  const isExpanded = isExpandedProp ?? sidebarCtx?.isExpanded ?? true;

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
            return new Set<string>(parsed);
          }
        }
      } catch {
        // localStorage unavailable or parse failed
      }
    }
    if (defaultOpenGroups) return new Set(defaultOpenGroups);
    if (items) return new Set(items.filter((i) => i.children).map((i) => i.id));
    return new Set<string>();
  });

  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify([...openGroups]));
      } catch {
        // localStorage unavailable
      }
    }
  }, [openGroups, storageKey]);

  const toggleGroup = useCallback(
    (id: string) => {
      if (!isExpanded && onExpandChange) {
        onExpandChange(true);
        return;
      }
      setOpenGroups((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [isExpanded, onExpandChange],
  );

  const handleNavigate = useCallback(
    (id: string) => {
      if (!isExpanded && onExpandChange) {
        onExpandChange(true);
        return;
      }
      onNavigate?.(id);
    },
    [isExpanded, onExpandChange, onNavigate],
  );

  const isGroupActive = (item: NavMenuItem) => {
    if (!activeRoute || !item.children) return false;
    if (!openGroups.has(item.id) || !isExpanded) {
      return item.children.some((child) => activeRoute === child.id);
    }
    return false;
  };

  const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href);

  const resolveItem = (item: NavMenuItem, nested = false) => {
    const external = isExternal(item.href);
    return {
      rightIcon: item.rightIcon ?? (external ? <ExternalLinkIcon /> : undefined),
      onClick: external ? () => window.open(item.href, "_blank", "noopener,noreferrer") : () => handleNavigate(item.id),
      isNested: nested,
    };
  };

  const renderItems = () =>
    items?.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <NavGroup
            key={item.id}
            icon={item.icon}
            label={item.label}
            isExpanded={isExpanded}
            isOpen={openGroups.has(item.id)}
            isActive={isGroupActive(item)}
            isDisabled={item.isDisabled}
            onToggle={() => toggleGroup(item.id)}
          >
            {item.children.map((child) => {
              const { rightIcon, onClick, isNested } = resolveItem(child, true);
              return (
                <NavItem
                  key={child.id}
                  icon={child.icon}
                  label={child.label}
                  isExpanded={isExpanded}
                  isNested={isNested}
                  isActive={activeRoute === child.id}
                  isDisabled={child.isDisabled}
                  rightIcon={rightIcon}
                  onClick={onClick}
                />
              );
            })}
          </NavGroup>
        );
      }
      const { rightIcon, onClick } = resolveItem(item);
      return (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isExpanded={isExpanded}
          isActive={activeRoute === item.id}
          isDisabled={item.isDisabled}
          rightIcon={rightIcon}
          onClick={onClick}
        />
      );
    });

  const content = items ? renderItems() : children;

  return (
    <ScrollArea className={styles.navMenu} scrollbars="vertical" style={{ maxHeight: maxHeight || "100%" }}>
      <Box className={styles.content}>{content}</Box>
    </ScrollArea>
  );
};

export { NavItem, NavGroup };
export type { NavItemProps } from "./NavItem";
export type { NavGroupProps } from "./NavGroup";

export default NavMenu;
