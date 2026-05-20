import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DatePicker from "./DatePicker";
import { normalizeDate } from "../utils/dateUtils";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "ISO date string or empty",
    },
    onChange: {
      action: "changed",
      description: "Callback when date changes",
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { value: "", onChange: () => {} },
  render: () => {
    const [value, setValue] = useState("");
    return <DatePicker value={value} onChange={setValue} />;
  },
};

export const TodaySelected: Story = {
  args: { value: "", onChange: () => {} },
  render: () => {
    const [value, setValue] = useState(normalizeDate(new Date()).toISOString());
    return <DatePicker value={value} onChange={setValue} />;
  },
};
