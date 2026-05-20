import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { IconButton } from "altaforge-ui/themes";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import styles from "./FilterIcon.module.css";

interface FilterIconProps {
  filters: string[];
}

const FilterIcon: React.FC<FilterIconProps> = ({ filters }) => {
  if (filters.length === 0) return null;

  const filterText = filters.join(", ");

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <IconButton variant="soft" size="1" className={styles.iconButton}>
            <MixerHorizontalIcon />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.tooltipContent} sideOffset={5}>
            <div className={styles.tooltipTitle}>Active Filters</div>
            <div className={styles.tooltipValue}>{filterText}</div>
            <Tooltip.Arrow className={styles.tooltipArrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default FilterIcon;
