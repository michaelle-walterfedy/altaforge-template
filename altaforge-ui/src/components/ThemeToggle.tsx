import React, { useState } from "react";
import { IconButton } from "../themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import styles from "./ThemeToggle.module.css";

export interface ThemeToggleProps {
  appearance?: "light" | "dark";
  onAppearanceChange?: (appearance: "light" | "dark") => void;
  size?: "1" | "2" | "3";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ appearance, onAppearanceChange, size = "2" }) => {
  const [internalAppearance, setInternalAppearance] = useState<"light" | "dark">("light");
  const controlled = appearance !== undefined;
  const current = controlled ? appearance : internalAppearance;

  const handleClick = () => {
    const next = current === "light" ? "dark" : "light";
    if (!controlled) {
      setInternalAppearance(next);
    }
    onAppearanceChange?.(next);
  };

  return (
    <IconButton
      variant="ghost"
      size={size}
      aria-label={current === "light" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={handleClick}
      className={styles.toggleButton}
    >
      <span className={`${styles.icon} ${current === "dark" ? styles.rotated : ""}`}>
        {current === "light" ? <MoonIcon /> : <SunIcon />}
      </span>
    </IconButton>
  );
};

export default ThemeToggle;
