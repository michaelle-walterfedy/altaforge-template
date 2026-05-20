import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  HomeIcon,
  GearIcon,
  BarChartIcon,
  PersonIcon,
  ArchiveIcon,
  PlusIcon,
  CopyIcon,
  TrashIcon,
  Share1Icon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Box, Text } from "../themes";
import Toolbar from "./Toolbar";
import ActionButton from "./ActionButton";

const meta = {
  title: "Components/Toolbar",
  component: Toolbar,
  parameters: {
    layout: "centered",
    docs: {
      story: { inline: true, iframeHeight: 400 },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"], description: "Layout direction" },
    size: { control: "select", options: ["1", "2", "3"], description: "Default button size" },
    variant: {
      control: "select",
      options: ["ghost", "soft", "outline", "solid"],
      description: "Default button variant",
    },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Vertical (AFCC PrimaryNav style) ──────────────────────────────

const VerticalDemo = () => {
  const [active, setActive] = useState("home");

  return (
    <Box
      className="demo-container"
      style={{
        display: "flex",
        width: 300,
        height: 400,
        border: "1px solid var(--gray-4)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          width: "var(--space-8)",
          flexShrink: 0,
          borderRight: "1px solid var(--gray-4)",
          background: "var(--color-background)",
        }}
      >
        <Toolbar orientation="vertical" size="2" variant="soft">
          <ActionButton
            icon={<HomeIcon />}
            tooltip="Home"
            active={active === "home"}
            onClick={() => setActive("home")}
          />
          <ActionButton
            icon={<ArchiveIcon />}
            tooltip="Archive"
            active={active === "archive"}
            onClick={() => setActive("archive")}
          />
          <ActionButton
            icon={<BarChartIcon />}
            tooltip="Analytics"
            active={active === "analytics"}
            onClick={() => setActive("analytics")}
          />
          <Toolbar.Separator />
          <ActionButton
            icon={<GearIcon />}
            tooltip="Settings"
            active={active === "settings"}
            onClick={() => setActive("settings")}
          />
          <Toolbar.Spacer />
          <ActionButton
            icon={<PersonIcon />}
            tooltip="Profile"
            active={active === "profile"}
            onClick={() => setActive("profile")}
          />
        </Toolbar>
      </Box>
      <Box style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Text size="2" color="gray">
          /{active}
        </Text>
      </Box>
    </Box>
  );
};

export const Vertical: Story = {
  render: () => <VerticalDemo />,
  parameters: {
    docs: {
      source: {
        code: `<Toolbar orientation="vertical" size="2" variant="soft">
  <ActionButton icon={<HomeIcon />} tooltip="Home" active />
  <ActionButton icon={<ArchiveIcon />} tooltip="Archive" />
  <ActionButton icon={<BarChartIcon />} tooltip="Analytics" />
  <Toolbar.Separator />
  <ActionButton icon={<GearIcon />} tooltip="Settings" />
  <Toolbar.Spacer />
  <ActionButton icon={<PersonIcon />} tooltip="Profile" />
</Toolbar>`,
        language: "tsx",
      },
    },
  },
};

// ── Horizontal (action bar) ───────────────────────────────────────

const HorizontalDemo = () => (
  <Box
    style={{
      width: 500,
      border: "1px solid var(--gray-4)",
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    <Box
      style={{
        borderBottom: "1px solid var(--gray-4)",
        padding: "var(--space-1) var(--space-2)",
        background: "var(--color-background)",
      }}
    >
      <Toolbar orientation="horizontal" size="1" variant="ghost">
        <ActionButton icon={<PlusIcon />} tooltip="New" />
        <ActionButton icon={<CopyIcon />} tooltip="Duplicate" />
        <ActionButton icon={<Share1Icon />} tooltip="Share" />
        <Toolbar.Separator />
        <ActionButton icon={<TrashIcon />} tooltip="Delete" />
        <Toolbar.Spacer />
        <ActionButton icon={<MagnifyingGlassIcon />} tooltip="Search" />
        <ActionButton icon={<GearIcon />} tooltip="Settings" />
      </Toolbar>
    </Box>
    <Box style={{ padding: "var(--space-6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Text size="2" color="gray">
        Content area
      </Text>
    </Box>
  </Box>
);

export const Horizontal: Story = {
  render: () => <HorizontalDemo />,
  parameters: {
    docs: {
      source: {
        code: `<Toolbar orientation="horizontal" size="1" variant="ghost">
  <ActionButton icon={<PlusIcon />} tooltip="New" />
  <ActionButton icon={<CopyIcon />} tooltip="Duplicate" />
  <ActionButton icon={<Share1Icon />} tooltip="Share" />
  <Toolbar.Separator />
  <ActionButton icon={<TrashIcon />} tooltip="Delete" />
  <Toolbar.Spacer />
  <ActionButton icon={<MagnifyingGlassIcon />} tooltip="Search" />
  <ActionButton icon={<GearIcon />} tooltip="Settings" />
</Toolbar>`,
        language: "tsx",
      },
    },
  },
};

// ── Variants ──────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <Box style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {(["ghost", "soft", "outline", "solid"] as const).map((v) => (
        <Box key={v} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Text size="1" color="gray" style={{ width: 50 }}>
            {v}
          </Text>
          <Toolbar orientation="horizontal" size="2" variant={v}>
            <ActionButton icon={<HomeIcon />} />
            <ActionButton icon={<BarChartIcon />} active />
            <ActionButton icon={<GearIcon />} />
          </Toolbar>
        </Box>
      ))}
    </Box>
  ),
};

// ── Sizes ─────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <Box style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {(["1", "2", "3"] as const).map((s) => (
        <Box key={s} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Text size="1" color="gray" style={{ width: 50 }}>
            size {s}
          </Text>
          <Toolbar orientation="horizontal" size={s} variant="soft">
            <ActionButton icon={<HomeIcon />} />
            <ActionButton icon={<BarChartIcon />} active />
            <ActionButton icon={<GearIcon />} />
            <ActionButton icon={<PersonIcon />} />
          </Toolbar>
        </Box>
      ))}
    </Box>
  ),
};
