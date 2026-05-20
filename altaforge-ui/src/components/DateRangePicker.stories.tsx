import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import type { DateRange } from "../utils/dateUtils";
import { createDateRange, createSingleDayRange } from "../utils/dateUtils";

const meta = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "object",
      description: "The current date range value",
    },
    onChange: {
      action: "changed",
      description: "Callback when date range changes",
    },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const DateRangePickerWrapper = () => {
  const [value, setValue] = useState<DateRange>({ start: "", end: "" });
  return <DateRangePicker value={value} onChange={setValue} />;
};

const defaultArgs = { value: { start: "", end: "" } as DateRange, onChange: () => {} };

export const Basic: Story = {
  args: defaultArgs,
  render: () => <DateRangePickerWrapper />,
};

export const WithInitialValue: Story = {
  args: defaultArgs,
  render: () => {
    const [value, setValue] = useState<DateRange>(createDateRange(7));
    return <DateRangePicker value={value} onChange={setValue} />;
  },
};

export const TodaySelected: Story = {
  args: defaultArgs,
  render: () => {
    const [value, setValue] = useState<DateRange>(createSingleDayRange(new Date()));
    return <DateRangePicker value={value} onChange={setValue} />;
  },
};
