import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HomeIcon, GearIcon, BellIcon, PlusIcon, TrashIcon, PersonIcon } from "@radix-ui/react-icons";
import { Box, Flex, Text } from "../themes";
import ActionButton from "./ActionButton";

const meta = {
  title: "Components/ActionButton",
  component: ActionButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: { control: false, description: "Icon element to render" },
    tooltip: { control: "text", description: "Tooltip text on hover" },
    active: { control: "boolean", description: "Active/pressed state" },
    disabled: { control: "boolean", description: "Disabled state" },
    variant: { control: "select", options: ["ghost", "soft", "outline", "solid"], description: "Visual variant" },
    size: { control: "select", options: ["1", "2", "3"], description: "Button size" },
  },
  args: {
    icon: <GearIcon />,
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// -- Default ------------------------------------------------------------------

export const Default: Story = {
  args: {
    icon: <GearIcon />,
    tooltip: "Settings",
  },
};

// -- Variants -----------------------------------------------------------------

export const Variants: Story = {
  render: () => (
    <Flex direction="column" gap="4">
      {(["ghost", "soft", "outline", "solid"] as const).map((v) => (
        <Flex key={v} align="center" gap="3">
          <Text size="1" color="gray" style={{ width: 50 }}>
            {v}
          </Text>
          <Flex gap="1">
            <ActionButton icon={<HomeIcon />} variant={v} />
            <ActionButton icon={<GearIcon />} variant={v} active />
            <ActionButton icon={<BellIcon />} variant={v} />
            <ActionButton icon={<PersonIcon />} variant={v} disabled />
          </Flex>
        </Flex>
      ))}
    </Flex>
  ),
};

// -- Sizes --------------------------------------------------------------------

export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap="4">
      {(["1", "2", "3"] as const).map((s) => (
        <Flex key={s} align="center" gap="3">
          <Text size="1" color="gray" style={{ width: 50 }}>
            size {s}
          </Text>
          <Flex gap="1">
            <ActionButton icon={<HomeIcon />} size={s} variant="soft" />
            <ActionButton icon={<GearIcon />} size={s} variant="soft" active />
            <ActionButton icon={<BellIcon />} size={s} variant="soft" />
          </Flex>
        </Flex>
      ))}
    </Flex>
  ),
};

// -- Interactive toggle -------------------------------------------------------

const ToggleDemo = () => {
  const [activeId, setActiveId] = useState("home");

  const buttons = [
    { id: "home", icon: <HomeIcon />, label: "Home" },
    { id: "settings", icon: <GearIcon />, label: "Settings" },
    { id: "notifications", icon: <BellIcon />, label: "Notifications" },
    { id: "profile", icon: <PersonIcon />, label: "Profile" },
  ];

  return (
    <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-3)" }}>
      <Flex gap="1">
        {buttons.map((btn) => (
          <ActionButton
            key={btn.id}
            icon={btn.icon}
            tooltip={btn.label}
            variant="soft"
            active={activeId === btn.id}
            onClick={() => setActiveId(btn.id)}
          />
        ))}
      </Flex>
      <Text size="2" color="gray">
        Active: {activeId}
      </Text>
    </Box>
  );
};

export const Toggle: Story = {
  render: () => <ToggleDemo />,
};

// -- Standalone usage ---------------------------------------------------------

export const Standalone: Story = {
  render: () => (
    <Flex gap="3" align="center">
      <ActionButton icon={<PlusIcon />} variant="solid" tooltip="Create new" />
      <ActionButton icon={<TrashIcon />} variant="outline" tooltip="Delete" />
      <ActionButton icon={<GearIcon />} tooltip="Settings" />
    </Flex>
  ),
};
