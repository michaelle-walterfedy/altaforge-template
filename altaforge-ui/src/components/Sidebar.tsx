import React, { useState, useEffect, useCallback } from "react";
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton, Text } from "../themes";
import { SidebarContext } from "./SidebarContext";
import styles from "./Sidebar.module.css";

export interface SidebarProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  defaultExpanded?: boolean;
  storageKey?: string;
  expandedWidth?: number;
  onExpandChange?: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  header,
  footer,
  defaultExpanded = true,
  storageKey,
  expandedWidth = 225,
  onExpandChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "boolean") return parsed;
        }
      } catch {
        // localStorage unavailable or parse failed
      }
    }
    return defaultExpanded;
  });

  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(isExpanded));
      } catch {
        // localStorage unavailable
      }
    }
  }, [isExpanded, storageKey]);

  const toggle = useCallback(() => {
    const next = !isExpanded;
    setIsExpanded(next);
    onExpandChange?.(next);
  }, [isExpanded, onExpandChange]);

  return (
    <Box
      className={styles.sidebar}
      style={
        {
          width: isExpanded ? expandedWidth : "var(--space-8)",
          "--sidebar-expanded-width": `${expandedWidth}px`,
        } as React.CSSProperties
      }
    >
      <Flex direction="row" justify="end" align="center" className={styles.headerRow}>
        {header && (
          <Box
            className={`${styles.headerContent} ${isExpanded ? `${styles.headerContentExpanded} ${styles.fadeIn}` : styles.headerContentCollapsed}`}
            style={{ maxWidth: isExpanded ? expandedWidth - 48 : 0 }}
          >
            {header}
          </Box>
        )}
        <Box className={styles.togglePadding}>
          <IconButton
            variant="soft"
            color="gray"
            className={styles.toggleButton}
            size="2"
            onClick={toggle}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isExpanded}
            aria-controls="sidebar-content"
          >
            {isExpanded ? (
              <DoubleArrowLeftIcon className={styles.toggleIcon} />
            ) : (
              <DoubleArrowRightIcon className={styles.toggleIcon} />
            )}
          </IconButton>
        </Box>
      </Flex>

      <SidebarContext.Provider value={{ isExpanded }}>
        <Box id="sidebar-content" className={styles.mainContent}>
          {children}
        </Box>
      </SidebarContext.Provider>

      {footer && (
        <Box className={styles.footer}>
          <Text size="1" color="gray" className={`${styles.footerText} ${isExpanded ? styles.fadeIn : ""}`}>
            {footer}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
