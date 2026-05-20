import React from "react";
import { Box, Text, Heading, Card } from "../themes";
import type { ChartData } from "../charts";
import DataVisualCardChart, { type ExtendedChartType } from "./DataVisualCardChart";
import FilterIcon from "./FilterIcon";
import styles from "./DataVisualCard.module.css";

export const DEFAULT_CHART_COLORS = ["#00A2C7", "#FFC53D", "#CE2C31", "#2B9A66", "#A144AF", "#8DA4EF", "#3A5BC7"];
export const DEFAULT_CHART_COLORS_MONOCHROME = [
  "#00A2C7",
  "#3DB9CF",
  "#7DCEDC",
  "#9DDDE7",
  "#CAF1F6",
  "#DEF7F9",
  "#0D3C48",
  "#107D98",
  "#0797B9",
];

export interface DataVisualCardProps {
  title?: string;
  description?: string;
  chartType: ExtendedChartType;
  data: ChartData;
  filters?: string[];
}

const DataVisualCard: React.FC<DataVisualCardProps> = ({ title, description, chartType, data, filters }) => {
  return (
    <Card size="3" className={styles.card}>
      {filters && filters.length > 0 && <FilterIcon filters={filters} />}
      {(title || description) && (
        <Box mb="4">
          {title && (
            <Heading size="3" weight="bold">
              {title}
            </Heading>
          )}
          {description && (
            <Text size="1" color="gray" mt="1">
              {description}
            </Text>
          )}
        </Box>
      )}

      <Box className={styles.chartContainer}>
        <DataVisualCardChart type={chartType} data={data} />
      </Box>
    </Card>
  );
};

export default DataVisualCard;
