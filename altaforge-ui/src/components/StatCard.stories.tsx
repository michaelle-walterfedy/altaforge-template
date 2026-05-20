import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "../themes";
import StatCard from "./StatCard";

const meta = {
  title: "Components/StatCard",
  component: StatCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title displayed at the top of the card",
    },
    value: {
      control: "text",
      description: "The main value displayed prominently",
    },
    subtitle: {
      control: "text",
      description: "Optional subtitle text displayed below the value",
    },
    change: {
      control: "text",
      description: "Optional change indicator (e.g., '+5.2%' or '-3.1%') displayed in a badge next to the value",
    },
    data: {
      control: "object",
      description: "Array of numbers used to generate the dynamic SVG chart",
    },
    size: {
      control: "select",
      options: ["1", "2", "3", "4"],
      description: "The size of the card",
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Grid columns="3" gap="4">
      <StatCard {...args} />
    </Grid>
  ),
  args: {
    title: "Total Returns",
    value: "328",
    subtitle: "Returns in pipeline during the timeframe.",
    change: "+5.2%",
    data: [65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95],
  },
};

export const WithNegativeChange: Story = {
  render: (args) => (
    <Grid columns="3" gap="4">
      <StatCard {...args} />
    </Grid>
  ),
  args: {
    title: "Active Users",
    value: "2,341",
    subtitle: "From last week",
    change: "-3.1%",
    data: [95, 90, 85, 75, 65, 40, 55, 56, 81, 80, 59, 65],
  },
};

export const Minimal: Story = {
  render: (args) => (
    <Grid columns="3" gap="4">
      <StatCard {...args} />
    </Grid>
  ),
  args: {
    title: "Orders",
    value: "1,234",
  },
};

export const WithDataOnly: Story = {
  render: (args) => (
    <Grid columns="3" gap="4">
      <StatCard {...args} />
    </Grid>
  ),
  args: {
    title: "Performance",
    value: "87%",
    data: [20, 35, 45, 55, 65, 70, 75, 80, 85, 87],
  },
};

export const WithoutData: Story = {
  render: (args) => (
    <Grid columns="3" gap="4">
      <StatCard {...args} />
    </Grid>
  ),
  args: {
    title: "Total Sales",
    value: "$12,345",
    subtitle: "This month",
    change: "+12.5%",
  },
};

export const GridLayout: Story = {
  args: { title: "Total Revenue", value: "$45,231" },
  render: () => (
    <Grid columns="3" gap="4">
      <StatCard
        title="Total Revenue"
        value="$45,231"
        subtitle="From last month"
        change="+5.2%"
        data={[65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95]}
      />
      <StatCard
        title="Active Users"
        value="2,341"
        subtitle="From last week"
        change="-3.1%"
        data={[95, 90, 85, 75, 65, 40, 55, 56, 81, 80, 59, 65]}
      />
      <StatCard title="Orders" value="1,234" data={[20, 35, 45, 55, 65, 70, 75, 80, 85, 87]} />
    </Grid>
  ),
};

export const Sizes: Story = {
  args: { title: "Small Card", value: "$12,345" },
  render: () => (
    <Grid columns="1" gap="4">
      <StatCard
        size="1"
        title="Small Card"
        value="$12,345"
        subtitle="Size 1"
        change="+5.2%"
        data={[65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95]}
      />
      <StatCard
        size="2"
        title="Medium Card"
        value="$45,231"
        subtitle="Size 2"
        change="+5.2%"
        data={[65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95]}
      />
      <StatCard
        size="3"
        title="Large Card"
        value="$98,765"
        subtitle="Size 3 (default)"
        change="+5.2%"
        data={[65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95]}
      />
      <StatCard
        size="4"
        title="Extra Large Card"
        value="$1,234"
        subtitle="Size 4"
        change="+5.2%"
        data={[65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95]}
      />
    </Grid>
  ),
};

export const BasicWithFilters: Story = {
  render: (args) => (
    <Grid columns="3" gap="4">
      <StatCard {...args} />
    </Grid>
  ),
  args: {
    title: "Total Returns",
    value: "328",
    subtitle: "Returns in pipeline during the timeframe.",
    change: "+5.2%",
    data: [65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 95],
    filters: ["Company 1"],
  },
};
