import React from "react";
import { Button } from "../themes";
import { useSidebarContext } from "./SidebarContext";
import styles from "./NavItem.module.css";

export interface NavItemProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  ariaLabel?: string;
  isExpanded?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  isNested?: boolean;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  ariaLabel,
  isExpanded: isExpandedProp,
  isActive = false,
  isDisabled = false,
  isNested = false,
  rightIcon,
  onClick,
}) => {
  const sidebarCtx = useSidebarContext();
  const isExpanded = isExpandedProp ?? sidebarCtx?.isExpanded ?? false;

  return (
    <Button
      disabled={isDisabled}
      variant="soft"
      size="2"
      aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
      className={`${styles.navItem} ${isActive ? styles.active : ""} ${isNested ? styles.nested : ""}`}
      onClick={onClick}
    >
      <span
        className={`${styles.icon} ${isNested && isExpanded ? styles.animateIn : ""} ${isNested ? styles.iconHidden : ""}`}
      >
        {icon}
      </span>
      <span
        className={`${styles.label} ${isExpanded ? styles.animateIn : ""}`}
        style={{ left: isExpanded ? "var(--space-6)" : 0 }}
      >
        {label}
      </span>
      {rightIcon && <span className={`${styles.rightIcon} ${isExpanded ? styles.animateIn : ""}`}>{rightIcon}</span>}
    </Button>
  );
};

export default NavItem;
