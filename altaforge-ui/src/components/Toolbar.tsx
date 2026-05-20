import React from "react";
import { Separator } from "../themes";
import { ActionButtonContext, type ActionButtonProps } from "./ActionButton";
import styles from "./Toolbar.module.css";

export interface ToolbarProps {
  orientation?: "horizontal" | "vertical";
  size?: "1" | "2" | "3";
  variant?: "ghost" | "soft" | "outline" | "solid";
  color?: ActionButtonProps["color"];
  children: React.ReactNode;
  className?: string;
}

function ToolbarSeparator({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  const isVertical = orientation === "vertical";

  return (
    <Separator
      orientation={isVertical ? "horizontal" : "vertical"}
      size="1"
      className={`${styles.separator} ${isVertical ? styles.separatorVertical : styles.separatorHorizontal}`}
    />
  );
}

function ToolbarSpacer() {
  return <div className={styles.spacer} />;
}

function Toolbar({
  orientation = "horizontal",
  size = "2",
  variant = "soft",
  color,
  children,
  className,
}: ToolbarProps) {
  const classes = [styles.toolbar, orientation === "vertical" ? styles.vertical : styles.horizontal, className]
    .filter(Boolean)
    .join(" ");

  return (
    <ActionButtonContext.Provider value={{ size, variant, color }}>
      <div className={classes} role="toolbar" aria-orientation={orientation}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === ToolbarSeparator) {
            return React.cloneElement(child as React.ReactElement<{ orientation?: string }>, { orientation });
          }
          return child;
        })}
      </div>
    </ActionButtonContext.Provider>
  );
}

Toolbar.Separator = ToolbarSeparator;
Toolbar.Spacer = ToolbarSpacer;

export default Toolbar;
