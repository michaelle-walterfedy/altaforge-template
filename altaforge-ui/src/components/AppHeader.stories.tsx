import type { Meta, StoryObj } from "@storybook/react";
import { GearIcon, BellIcon, MoonIcon, PersonIcon } from "@radix-ui/react-icons";
import { Flex, Text } from "../themes";
import AppHeader from "./AppHeader";
import ActionButton from "./ActionButton";

const AltaForgeLogo = () => (
  <svg viewBox="0 0 200 140" height={28} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M197.999 25V41.6387H107.318V25H197.999Z" fill="url(#hdr0)" />
    <path d="M164.722 65.7646V82.4033H107.318V65.7646H164.722Z" fill="url(#hdr1)" />
    <path
      d="M90.6807 25V115.681H74.042V41.6387H41.5967C27.8128 41.6387 16.6387 52.8128 16.6387 66.5967V99.042H56.9873V115.681H12.4785C5.58685 115.681 0.000252289 110.094 0 103.202V66.5967C4.82446e-07 43.6235 18.6235 25 41.5967 25H90.6807Z"
      fill="#0797B9"
    />
    <defs>
      <linearGradient id="hdr0" x1="107.318" y1="33.7353" x2="197.999" y2="33.7353" gradientUnits="userSpaceOnUse">
        <stop offset="0.389422" stopColor="#0797B9" />
        <stop offset="1" stopColor="white" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="hdr1" x1="107.318" y1="74.4999" x2="164.722" y2="74.4999" gradientUnits="userSpaceOnUse">
        <stop offset="0.389422" stopColor="#0797B9" />
        <stop offset="1" stopColor="white" stopOpacity="0.4" />
      </linearGradient>
    </defs>
  </svg>
);

const meta = {
  title: "Components/AppHeader",
  component: AppHeader,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ paddingBottom: 40 }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    left: { control: false, description: "Content rendered on the left" },
    center: { control: false, description: "Content rendered in the center" },
    right: { control: false, description: "Content rendered on the right" },
    bordered: { control: "boolean", description: "Show bottom border (default true)" },
    className: { control: "text", description: "Optional additional CSS class" },
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// -- Default ------------------------------------------------------------------

export const Default: Story = {
  args: {
    left: (
      <Flex align="center" gap="3">
        <AltaForgeLogo />
        <Text size="3" weight="bold">
          AltaForge
        </Text>
      </Flex>
    ),
    center: (
      <Text size="2" color="gray">
        Control Centre
      </Text>
    ),
    right: (
      <Flex gap="1">
        <ActionButton icon={<BellIcon />} tooltip="Notifications" />
        <ActionButton icon={<GearIcon />} tooltip="Settings" />
      </Flex>
    ),
  },
};

// -- WithActions --------------------------------------------------------------

export const WithActions: Story = {
  args: {
    left: (
      <Flex align="center" gap="3">
        <AltaForgeLogo />
        <Text size="3" weight="bold">
          AltaForge
        </Text>
      </Flex>
    ),
    right: (
      <Flex gap="1" align="center">
        <ActionButton icon={<BellIcon />} tooltip="Notifications" />
        <ActionButton icon={<GearIcon />} tooltip="Settings" />
        <ActionButton icon={<PersonIcon />} variant="soft" tooltip="Profile" />
      </Flex>
    ),
  },
};

// -- NoBorder -----------------------------------------------------------------

export const NoBorder: Story = {
  args: {
    left: (
      <Flex align="center" gap="3">
        <AltaForgeLogo />
        <Text size="3" weight="bold">
          AltaForge
        </Text>
      </Flex>
    ),
    center: (
      <Text size="2" color="gray">
        No border header
      </Text>
    ),
    bordered: false,
  },
};

// -- KitchenSink --------------------------------------------------------------

export const KitchenSink: Story = {
  args: {
    left: (
      <Flex align="center" gap="3">
        <AltaForgeLogo />
        <Text size="3" weight="bold">
          AltaForge
        </Text>
      </Flex>
    ),
    center: (
      <Text size="2" color="gray">
        Dashboard / Projects / Overview
      </Text>
    ),
    right: (
      <Flex gap="1" align="center">
        <ActionButton icon={<MoonIcon />} tooltip="Toggle theme" />
        <ActionButton icon={<PersonIcon />} variant="soft" tooltip="Profile" />
      </Flex>
    ),
  },
};
