import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Flex, Text } from "../themes";
import ThemeToggle from "./ThemeToggle";

const meta = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    appearance: {
      control: "select",
      options: ["light", "dark"],
      description: "Controlled appearance mode",
    },
    onAppearanceChange: { action: "onAppearanceChange", description: "Called with the new appearance when toggled" },
    size: {
      control: "select",
      options: ["1", "2", "3"],
      description: "Button size",
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// -- Default (uncontrolled, starts light) --------------------------------------

const DefaultDemo = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  return (
    <Flex align="center" gap="3">
      <ThemeToggle onAppearanceChange={setMode} />
      <Text size="2">Current mode: {mode}</Text>
    </Flex>
  );
};

export const Default: Story = {
  render: () => <DefaultDemo />,
};

// -- Dark (uncontrolled, starts dark via controlled prop for demo) -------------

const DarkDemo = () => {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  return (
    <Flex align="center" gap="3">
      <ThemeToggle appearance={mode} onAppearanceChange={setMode} />
      <Text size="2">Current mode: {mode}</Text>
    </Flex>
  );
};

export const Dark: Story = {
  render: () => <DarkDemo />,
};

// -- Controlled (with explicit state management) -------------------------------

const ControlledDemo = () => {
  const [appearance, setAppearance] = useState<"light" | "dark">("light");
  const [toggleCount, setToggleCount] = useState(0);

  const handleChange = (next: "light" | "dark") => {
    setAppearance(next);
    setToggleCount((c) => c + 1);
  };

  return (
    <Flex direction="column" gap="3">
      <Flex align="center" gap="3">
        <ThemeToggle appearance={appearance} onAppearanceChange={handleChange} />
        <Text size="2">Current mode: {appearance}</Text>
      </Flex>
      <Text size="1" color="gray">
        Toggled {toggleCount} time{toggleCount !== 1 ? "s" : ""}
      </Text>
    </Flex>
  );
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
