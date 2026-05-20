import React from "react";
import { Tabs, Badge, Box } from "../themes";
import styles from "./TabPanel.module.css";

export interface TabPanelTab {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabPanelProps {
  tabs?: TabPanelTab[];
  activeTab?: string;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  wrap?: boolean;
  children?: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({
  tabs = [],
  activeTab,
  defaultTab,
  onTabChange,
  wrap = false,
  children,
}) => {
  const controlled = activeTab !== undefined;
  const childArray = React.Children.toArray(children);

  return (
    <Tabs.Root
      className={styles.tabPanel}
      value={controlled ? activeTab : undefined}
      defaultValue={controlled ? undefined : (defaultTab ?? tabs[0]?.id)}
      onValueChange={onTabChange}
    >
      <Tabs.List wrap={wrap ? "wrap" : undefined}>
        {tabs.map((tab) => (
          <Tabs.Trigger key={tab.id} value={tab.id} disabled={tab.disabled}>
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Badge color="indigo" size="1" ml="2">
                {tab.count}
              </Badge>
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab, i) => (
        <Tabs.Content key={tab.id} value={tab.id}>
          <Box pt="4">{childArray[i]}</Box>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default TabPanel;
