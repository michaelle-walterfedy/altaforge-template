import React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Box } from "../themes";
import NavItem from "./NavItem";
import { useSidebarContext } from "./SidebarContext";
import styles from "./NavGroup.module.css";

export interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  isExpanded?: boolean;
  isOpen?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  showGuideLines?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}

const NavGroup: React.FC<NavGroupProps> = ({
  icon,
  label,
  isExpanded: isExpandedProp,
  isOpen = false,
  isActive = false,
  isDisabled = false,
  showGuideLines = true,
  onToggle,
  children,
}) => {
  const sidebarCtx = useSidebarContext();
  const isExpanded = isExpandedProp ?? sidebarCtx?.isExpanded ?? false;

  return (
    <>
      <NavItem
        icon={icon}
        label={label}
        isExpanded={isExpanded}
        isActive={isActive}
        isDisabled={isDisabled}
        onClick={onToggle}
        rightIcon={<ChevronDownIcon className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />}
      />
      {isExpanded && isOpen && (
        <Box className={`${styles.childrenContainer} ${showGuideLines ? styles.guideLines : ""}`}>{children}</Box>
      )}
    </>
  );
};

export default NavGroup;
