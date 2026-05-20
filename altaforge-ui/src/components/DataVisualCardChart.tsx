import React from "react";
import {
  Chart as ChartComponent,
  ChartJS,
  ChartEvent,
  ActiveElement,
  ChartOptions,
  ChartData,
  ChartType,
} from "../charts";

interface ChartDatasetModifiable {
  borderWidth: number;
  borderColor: string;
}

type LegendLabelGenerator = (chart: ChartJS) => Array<{
  text: string;
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  hidden: boolean;
  index: number;
  datasetIndex: number;
  fontColor: string;
}>;

export const getStandardLegendConfig = (generateLabels?: LegendLabelGenerator) => ({
  display: true,
  position: "bottom" as const,
  align: "center" as const,
  labels: {
    usePointStyle: true,
    pointStyle: "circle" as const,
    boxWidth: 9,
    boxHeight: 9,
    padding: 12,
    font: { size: 12 },
    color: "#374151",
    fontColor: "#6b7280",
    ...(generateLabels && { generateLabels }),
  },
});

export type ExtendedChartType = ChartType | "stackedBar";

export interface ChartProps {
  type: ExtendedChartType;
  data: ChartData;
  options?: Partial<ChartOptions>;
  generateLegendLabels?: LegendLabelGenerator;
}

const getDefaultOptions = (
  chartType: ExtendedChartType,
  generateLegendLabels?: LegendLabelGenerator,
): Partial<ChartOptions> => {
  const actualChartType = chartType === "stackedBar" ? "bar" : chartType;
  const hasCartesianAxes = ["line", "bar", "scatter", "bubble"].includes(actualChartType);
  const isStacked = chartType === "stackedBar";

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    plugins: {
      legend: getStandardLegendConfig(generateLegendLabels),
      tooltip: {
        mode: "nearest",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderWidth: 0,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        boxPadding: 2,
        callbacks: {
          label: function (context: unknown) {
            const ctx = context as {
              dataset?: { label?: string };
              label?: string;
              parsed?: { y?: number; r?: number } | number;
              formattedValue?: string;
            };

            const datasetLabel = ctx.dataset?.label || "";

            if (ctx.label && (typeof ctx.parsed === "number" || ctx.formattedValue)) {
              const value = ctx.formattedValue ?? ctx.parsed;
              return datasetLabel ? `${datasetLabel}: ${value}` : String(value);
            }

            if (ctx.parsed && typeof ctx.parsed === "object" && "r" in ctx.parsed) {
              const value = ctx.parsed.r ?? "";
              return datasetLabel ? `${datasetLabel}: ${value}` : String(value);
            }

            const value = (ctx.parsed as { y?: number })?.y ?? "";
            return datasetLabel ? `${datasetLabel}: ${value}` : String(value);
          },
          labelColor: function (context: unknown) {
            const ctx = context as {
              dataset: { borderColor?: string | string[]; backgroundColor?: string | string[] };
              dataIndex?: number;
              label?: string;
            };

            const getColor = (colors: string | string[] | undefined): string => {
              if (!colors) return "#000";
              if (Array.isArray(colors)) {
                return colors[ctx.dataIndex ?? 0] || "#000";
              }
              return colors;
            };

            const isLineOrRadarChart = actualChartType === "line" || actualChartType === "radar";
            const color = isLineOrRadarChart
              ? getColor(ctx.dataset.borderColor) || getColor(ctx.dataset.backgroundColor)
              : ctx.label
                ? getColor(ctx.dataset.backgroundColor)
                : getColor(ctx.dataset.borderColor) || getColor(ctx.dataset.backgroundColor);

            return {
              borderColor: color,
              backgroundColor: color,
              borderWidth: 0,
            };
          },
        },
      },
    },
    onHover: (_event: ChartEvent, activeElements: ActiveElement[], chart: ChartJS) => {
      if (activeElements.length > 0 && chart.data.datasets.length > 0) {
        const typedDataset = chart.data.datasets[0] as unknown as ChartDatasetModifiable;
        if (typedDataset.borderWidth !== undefined) {
          typedDataset.borderWidth = 3.5;
          chart.update("none");
        }
      } else if (chart.data.datasets.length > 0) {
        const typedDataset = chart.data.datasets[0] as unknown as ChartDatasetModifiable;
        if (typedDataset.borderWidth !== undefined) {
          typedDataset.borderWidth = 2.5;
          chart.update("none");
        }
      }
    },
    ...(hasCartesianAxes && {
      scales: {
        x: {
          ...(isStacked && { stacked: true }),
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
            color: "#9ca3af",
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ...(isStacked && { stacked: true }),
          ticks: {
            font: {
              size: 11,
            },
            color: "#9ca3af",
          },
          grid: {
            color: "rgba(243, 244, 246, 1)",
          },
          border: {
            display: false,
          },
        },
      },
    }),
  };
};

const Chart: React.FC<ChartProps> = ({ type, data, options = {}, generateLegendLabels }) => {
  const actualChartType = type === "stackedBar" ? "bar" : type;
  const defaultOptions = getDefaultOptions(type, generateLegendLabels);

  const isStacked = type === "stackedBar";

  const processedData: ChartData =
    isStacked && data?.datasets
      ? {
          ...data,
          datasets: data.datasets.map((dataset, index) => {
            if (index === data.datasets.length - 1) {
              return {
                ...dataset,
                borderRadius: {
                  topLeft: 4,
                  topRight: 4,
                  bottomLeft: 0,
                  bottomRight: 0,
                },
              } as typeof dataset;
            }
            return dataset;
          }),
        }
      : data;

  const mergedOptions: Partial<ChartOptions> = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins,
      legend: options.plugins?.legend ?? defaultOptions.plugins?.legend,
      tooltip: {
        ...defaultOptions.plugins?.tooltip,
        ...options.plugins?.tooltip,
        callbacks: {
          ...defaultOptions.plugins?.tooltip?.callbacks,
          ...options.plugins?.tooltip?.callbacks,
        },
      },
    },
  };

  return <ChartComponent type={actualChartType} data={processedData} options={mergedOptions} />;
};

export default Chart;
