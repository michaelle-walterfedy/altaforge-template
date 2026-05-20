import React, { useContext, createContext } from "react";
import { IconButton, Tooltip } from "../themes";
import type { IconButtonProps } from "@radix-ui/themes";
import styles from "./ActionButton.module.css";

export interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip?: string;
  active?: boolean;
  disabled?: boolean;
  variant?: "ghost" | "soft" | "outline" | "solid";
  color?: IconButtonProps["color"];
  size?: "1" | "2" | "3";
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ActionButtonContextValue {
  size?: "1" | "2" | "3";
  variant?: "ghost" | "soft" | "outline" | "solid";
  color?: ActionButtonProps["color"];
}

export const ActionButtonContext = createContext<ActionButtonContextValue>({});

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  tooltip,
  active = false,
  disabled = false,
  variant,
  color,
  size,
  onClick,
  className,
  style,
}) => {
  const ctx = useContext(ActionButtonContext);
  const resolvedVariant = variant ?? ctx.variant ?? "ghost";
  const resolvedColor = color ?? ctx.color;
  const resolvedSize = size ?? ctx.size ?? "2";

  const classes = [styles.button, active ? styles.active : "", className].filter(Boolean).join(" ");

  const button = (
    <IconButton
      className={classes}
      variant={resolvedVariant}
      color={resolvedColor}
      size={resolvedSize}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {icon}
    </IconButton>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{button}</Tooltip>;
  }

  return button;
};

export default ActionButton;
