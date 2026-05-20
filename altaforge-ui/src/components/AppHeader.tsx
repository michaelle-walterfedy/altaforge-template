import React from "react";
import styles from "./AppHeader.module.css";

export interface AppHeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  bordered?: boolean;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ left, center, right, bordered = true, className }) => {
  return (
    <header className={`${styles.header} ${bordered ? styles.bordered : ""} ${className ?? ""}`}>
      <div className={styles.left}>{left}</div>
      <div className={styles.center}>{center}</div>
      <div className={styles.right}>{right}</div>
    </header>
  );
};

export default AppHeader;
