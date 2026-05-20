import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { userEvent, within, expect, waitFor } from "storybook/test";
import MultiSelect, { type MultiSelectOption } from "./MultiSelect";

const meta = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: "object",
      description: "Array of options to display",
    },
    value: {
      control: "object",
      description: "Array of selected values",
    },
    onChange: {
      action: "changed",
      description: "Callback when selection changes",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when no items are selected",
    },
    allOption: {
      control: "object",
      description: "Optional 'Select All' option",
    },
    defaultToAll: {
      control: "boolean",
      description: "Whether to default to all items selected",
    },
    minWidth: {
      control: "text",
      description: "Minimum width of the select button",
    },
    maxHeight: {
      control: "text",
      description: "Maximum height of the dropdown menu",
    },
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions: MultiSelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4" },
  { value: "option5", label: "Option 5" },
];

const MultiSelectWrapper = (args: Omit<React.ComponentProps<typeof MultiSelect>, "value" | "onChange">) => {
  const [value, setValue] = useState<string[]>([]);
  return <MultiSelect {...args} value={value} onChange={setValue} />;
};

const defaultControlArgs = { value: [], onChange: () => {} };

export const Basic: Story = {
  render: (args) => <MultiSelectWrapper {...args} />,
  args: {
    ...defaultControlArgs,
    options: basicOptions,
    placeholder: "Select options...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    // DropdownMenu renders in a Radix portal outside canvasElement
    const body = within(document.body);
    // Wait for Radix enter animation before asserting visibility
    await waitFor(() => expect(body.getByText("Option 1")).toBeVisible());
    await userEvent.click(body.getByText("Option 1"));
    // MultiSelect keeps the dropdown open after selection, so the canvas is aria-hidden
    await expect(canvas.getByRole("button", { hidden: true })).toHaveTextContent("Option 1");
    // Select a second option — button should show count
    await userEvent.click(body.getByText("Option 2"));
    await expect(canvas.getByRole("button", { hidden: true })).toHaveTextContent("2 selected");
  },
};

export const WithAllOption: Story = {
  render: (args) => <MultiSelectWrapper {...args} />,
  args: {
    ...defaultControlArgs,
    options: basicOptions,
    allOption: { value: "all", label: "All Options" },
    placeholder: "Select options...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole("menuitem", { name: /all options/i })).toBeVisible());
    // Select all via the "All Options" option
    await userEvent.click(body.getByRole("menuitem", { name: /all options/i }));
    // Dropdown stays open after selection — canvas is aria-hidden
    await expect(canvas.getByRole("button", { hidden: true })).toHaveTextContent("All Options");
    // Deselect all — use role to avoid matching the trigger button text too
    await userEvent.click(body.getByRole("menuitem", { name: /all options/i }));
    await expect(canvas.getByRole("button", { hidden: true })).toHaveTextContent("Select options...");
  },
};

export const DefaultToAll: Story = {
  render: (args) => <MultiSelectWrapper {...args} />,
  args: {
    ...defaultControlArgs,
    options: basicOptions,
    allOption: { value: "all", label: "All Options" },
    defaultToAll: true,
    placeholder: "Select options...",
  },
};

const manyOptions: MultiSelectOption[] = Array.from({ length: 20 }, (_, i) => ({
  value: `option${i + 1}`,
  label: `Option ${i + 1}`,
}));

export const ManyOptions: Story = {
  render: (args) => <MultiSelectWrapper {...args} />,
  args: {
    ...defaultControlArgs,
    options: manyOptions,
    allOption: { value: "all", label: "Select All" },
    placeholder: "Select options...",
    maxHeight: "240px",
  },
};

export const CustomWidth: Story = {
  render: (args) => <MultiSelectWrapper {...args} />,
  args: {
    ...defaultControlArgs,
    options: basicOptions,
    placeholder: "Select options...",
    minWidth: "300px",
  },
};
