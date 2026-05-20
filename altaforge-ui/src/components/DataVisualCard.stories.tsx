import type { Meta, StoryObj } from "@storybook/react";
import { ChartJS, registerables } from "../charts";
import DataVisualCard, { DEFAULT_CHART_COLORS_MONOCHROME as DEFAULT_CHART_COLORS } from "./DataVisualCard";

ChartJS.register(...registerables);

const meta = {
  title: "Components/DataVisualCard",
  component: DataVisualCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title displayed at the top of the card",
    },
    description: {
      control: "text",
      description: "The description displayed below the title",
    },
    chartType: {
      control: "select",
      options: ["line", "bar", "stackedBar", "pie", "doughnut", "polarArea", "radar", "scatter", "bubble"],
      description: "The type of chart to render",
    },
  },
} satisfies Meta<typeof DataVisualCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LineChart: Story = {
  args: {
    title: "Sales Performance",
    description: "Monthly revenue over the past year",
    chartType: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Revenue",
          data: [65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95],
          borderColor: DEFAULT_CHART_COLORS[0],
          backgroundColor: `${DEFAULT_CHART_COLORS[0]}26`,
          borderWidth: 2.5,
          pointRadius: 5,
          pointHoverRadius: 6,
          pointBackgroundColor: DEFAULT_CHART_COLORS[0],
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          tension: 0,
          fill: true,
        },
      ],
    },
  },
};

export const BarChart: Story = {
  args: {
    title: "Revenue by Month",
    description: "Monthly revenue breakdown",
    chartType: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Revenue",
          data: [65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95],
          backgroundColor: DEFAULT_CHART_COLORS[0],
          borderColor: DEFAULT_CHART_COLORS[0],
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    },
  },
};

export const MultiSeriesBarChart: Story = {
  args: {
    title: "Revenue vs Expenses",
    description: "Monthly comparison",
    chartType: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Revenue",
          data: [65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95],
          backgroundColor: DEFAULT_CHART_COLORS[0],
          borderColor: DEFAULT_CHART_COLORS[0],
          borderWidth: 0,
          borderRadius: 4,
        },
        {
          label: "Expenses",
          data: [45, 49, 60, 71, 46, 45, 30, 55, 65, 75, 80, 85],
          backgroundColor: DEFAULT_CHART_COLORS[1],
          borderColor: DEFAULT_CHART_COLORS[1],
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    },
  },
};

export const StackedBarChart: Story = {
  args: {
    title: "Revenue Breakdown",
    description: "Stacked monthly revenue by category",
    chartType: "stackedBar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Product A",
          data: [20, 25, 30, 28, 22, 24, 18, 26, 28, 30, 32, 35],
          backgroundColor: DEFAULT_CHART_COLORS[0],
          borderColor: DEFAULT_CHART_COLORS[0],
        },
        {
          label: "Product B",
          data: [25, 20, 22, 28, 24, 20, 15, 22, 25, 28, 30, 32],
          backgroundColor: DEFAULT_CHART_COLORS[1],
          borderColor: DEFAULT_CHART_COLORS[1],
        },
        {
          label: "Product C",
          data: [20, 14, 28, 25, 10, 11, 7, 17, 22, 27, 28, 28],
          backgroundColor: DEFAULT_CHART_COLORS[2],
          borderColor: DEFAULT_CHART_COLORS[2],
        },
      ],
    },
  },
};

export const PieChart: Story = {
  args: {
    title: "Revenue Distribution",
    description: "Breakdown by category",
    chartType: "pie",
    data: {
      labels: ["Revenue", "Expenses", "Profit", "Taxes"],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: [
            DEFAULT_CHART_COLORS[0],
            DEFAULT_CHART_COLORS[1],
            DEFAULT_CHART_COLORS[2],
            DEFAULT_CHART_COLORS[3],
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
  },
};

export const DoughnutChart: Story = {
  args: {
    title: "Market Share",
    description: "Distribution across segments",
    chartType: "doughnut",
    data: {
      labels: ["Revenue", "Expenses", "Profit", "Taxes"],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: [
            DEFAULT_CHART_COLORS[0],
            DEFAULT_CHART_COLORS[1],
            DEFAULT_CHART_COLORS[2],
            DEFAULT_CHART_COLORS[3],
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
  },
};

export const RadarChart: Story = {
  args: {
    title: "Performance Metrics",
    description: "Multi-dimensional analysis",
    chartType: "radar",
    data: {
      labels: ["Revenue", "Expenses", "Profit", "Growth", "Efficiency", "Customer Satisfaction"],
      datasets: [
        {
          label: "Q1 2024",
          data: [65, 45, 55, 70, 60, 75],
          borderColor: DEFAULT_CHART_COLORS[0],
          backgroundColor: `${DEFAULT_CHART_COLORS[0]}33`,
          borderWidth: 2.5,
          pointRadius: 5,
          pointHoverRadius: 6,
          pointBackgroundColor: DEFAULT_CHART_COLORS[0],
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
      ],
    },
  },
};

export const ScatterChart: Story = {
  args: {
    title: "Sales vs Marketing",
    description: "Correlation analysis",
    chartType: "scatter",
    data: {
      datasets: [
        {
          label: "Sales vs Marketing",
          data: [
            { x: 10, y: 20 },
            { x: 15, y: 30 },
            { x: 20, y: 35 },
            { x: 25, y: 45 },
            { x: 30, y: 50 },
            { x: 35, y: 60 },
            { x: 40, y: 65 },
            { x: 45, y: 75 },
            { x: 50, y: 80 },
            { x: 55, y: 90 },
          ],
          backgroundColor: DEFAULT_CHART_COLORS[0],
          borderColor: DEFAULT_CHART_COLORS[0],
        },
      ],
    },
  },
};

export const BubbleChart: Story = {
  args: {
    title: "Product Performance",
    description: "Multi-dimensional product analysis",
    chartType: "bubble",
    data: {
      datasets: [
        {
          label: "Product Performance",
          data: [
            { x: 20, y: 30, r: 15 },
            { x: 40, y: 50, r: 20 },
            { x: 30, y: 40, r: 10 },
            { x: 50, y: 60, r: 25 },
            { x: 60, y: 70, r: 30 },
            { x: 35, y: 45, r: 18 },
            { x: 45, y: 55, r: 22 },
            { x: 55, y: 65, r: 28 },
          ],
          backgroundColor: DEFAULT_CHART_COLORS[0],
          borderColor: DEFAULT_CHART_COLORS[0],
        },
      ],
    },
  },
};

export const WithFilters: Story = {
  args: {
    title: "Sales Performance",
    description: "Monthly revenue over the past year",
    chartType: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Revenue",
          data: [65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95],
          borderColor: DEFAULT_CHART_COLORS[0],
          backgroundColor: DEFAULT_CHART_COLORS[0],
        },
        {
          label: "Expenses",
          data: [45, 49, 60, 71, 46, 45, 30, 55, 65, 75, 80, 85],
          borderColor: DEFAULT_CHART_COLORS[2],
          backgroundColor: DEFAULT_CHART_COLORS[2],
        },
      ],
    },
    filters: ["Revenue", "Expenses"],
  },
};
