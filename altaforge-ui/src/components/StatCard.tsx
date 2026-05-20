import React, { useRef, useEffect, useState } from "react";
import { Box, Heading, Text, Card, Badge } from "../themes";
import FilterIcon from "./FilterIcon";
import styles from "./StatCard.module.css";

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  data?: number[];
  size?: "1" | "2" | "3" | "4";
  filters?: string[];
}

const SPARKLINE_HEIGHT_MULTIPLIER = 0.65;

const getSparklinePadding = (size: "1" | "2" | "3" | "4"): string => {
  const paddingMap = {
    "1": "var(--space-2)",
    "2": "var(--space-3)",
    "3": "var(--space-4)",
    "4": "var(--space-5)",
  };
  return paddingMap[size];
};

const createSmoothPath = (points: Array<{ x: number; y: number }>): string => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const prev = i > 0 ? points[i - 1] : current;
    const afterNext = i < points.length - 2 ? points[i + 2] : next;

    const cp1x = current.x + (next.x - prev.x) / 6;
    const cp1y = current.y + (next.y - prev.y) / 6;
    const cp2x = next.x - (afterNext.x - current.x) / 6;
    const cp2y = next.y - (afterNext.y - current.y) / 6;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
  }

  return path;
};

const generateSVG = (data: number[], width: number, height: number): string => {
  if (!data || data.length === 0) return "";

  const padding = 3;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => ({
    x: padding + (index / (data.length - 1 || 1)) * chartWidth,
    y: padding + chartHeight - ((value - minValue) / range) * chartHeight,
  }));

  const pathData = createSmoothPath(points);
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  const bottomY = height - padding;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:var(--accent-9);stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:var(--accent-9);stop-opacity:0" />
        </linearGradient>
      </defs>
      <path d="${pathData} L ${lastX},${bottomY} L ${firstX},${bottomY} Z" 
            fill="url(#${gradientId})" />
      <path d="${pathData}"
            style="stroke:var(--accent-9);stroke-width:1;fill:none;stroke-linecap:round;stroke-linejoin:round" />
    </svg>
  `;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, change, data, size = "3", filters }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const sparklinePadding = getSparklinePadding(size);
  const valueHeadingSize = size === "1" ? "6" : size === "2" ? "7" : size === "3" ? "8" : "9";

  useEffect(() => {
    if (!data || !containerRef.current) {
      setSvgContent("");
      return;
    }

    const updateSVG = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerHeight = container.clientHeight;
      const width = 120;
      const height = containerHeight * SPARKLINE_HEIGHT_MULTIPLIER;
      setSvgContent(generateSVG(data, width, height));
    };

    updateSVG();

    const resizeObserver = new ResizeObserver(updateSVG);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [data]);

  return (
    <Card size={size} className={styles.card}>
      {filters && filters.length > 0 && <FilterIcon filters={filters} />}
      {data && (
        <Box
          ref={containerRef}
          className={styles.sparklineContainer}
          style={{
            top: sparklinePadding,
            right: sparklinePadding,
            bottom: sparklinePadding,
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}

      <Box>
        <Heading size="1" as="h2" weight="bold" className={styles.title} mb={size === "1" ? "1" : "2"}>
          {title}
        </Heading>
        <Box className={styles.valueRow}>
          <Heading size={valueHeadingSize as "5" | "6" | "7" | "8"} className={styles.valueHeading}>
            {value}
          </Heading>
          {change && (
            <Badge
              color={change.startsWith("+") ? undefined : "red"}
              size="1"
              className={change.startsWith("+") ? styles.badgePositive : styles.badgeNegative}
            >
              <Text size="1">{change}</Text>
            </Badge>
          )}
        </Box>
        {subtitle && (
          <Box mt={size === "1" || size === "2" ? "0" : "1"}>
            <Text size="1" as="div" color="gray">
              {subtitle}
            </Text>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default StatCard;
