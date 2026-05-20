import React, { useState, useEffect } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { IconButton } from "../themes";
import styles from "./AppShell.module.css";

export interface AppShellProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AppShell: React.FC<AppShellProps> = ({ header, sidebar, children, className }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = () => {
      if (!mql.matches) setSidebarOpen(false);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div className={`${styles.shell}${className ? ` ${className}` : ""}`}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>
        {sidebar && (
          <>
            <IconButton
              className={styles.menuButton}
              variant="ghost"
              color="gray"
              size="2"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <HamburgerMenuIcon />
            </IconButton>
            <div
              className={`${styles.backdrop}${sidebarOpen ? ` ${styles.backdropVisible}` : ""}`}
              onClick={() => setSidebarOpen(false)}
              role="presentation"
            />
            <div className={`${styles.sidebar}${sidebarOpen ? ` ${styles.sidebarOpen}` : ""}`}>{sidebar}</div>
          </>
        )}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
