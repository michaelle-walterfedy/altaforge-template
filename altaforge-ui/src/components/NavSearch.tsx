import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "../themes";
import { useSidebarContext } from "./SidebarContext";
import navItemStyles from "./NavItem.module.css";

export interface NavSearchProps {
  isExpanded?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const NavSearch: React.FC<NavSearchProps> = ({
  isExpanded: isExpandedProp,
  placeholder = "Search\u2026",
  value,
  onChange,
}) => {
  const sidebarCtx = useSidebarContext();
  const isExpanded = isExpandedProp ?? sidebarCtx?.isExpanded ?? false;

  return (
    <div className={navItemStyles.navItem} role="search">
      <span className={navItemStyles.icon}>
        <MagnifyingGlassIcon />
      </span>
      <span
        className={`${navItemStyles.label} ${isExpanded ? navItemStyles.animateIn : ""}`}
        style={{ left: isExpanded ? "var(--space-6)" : 0 }}
      >
        <TextField.Root
          size="1"
          placeholder={placeholder}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
          aria-label={placeholder}
        />
      </span>
    </div>
  );
};

export default NavSearch;
