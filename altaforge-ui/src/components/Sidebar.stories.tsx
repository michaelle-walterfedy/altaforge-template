import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DashboardIcon, GearIcon, BarChartIcon, IdCardIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { Box, Heading, Text } from "../themes";
import Sidebar from "./Sidebar";
import NavMenu, { type NavMenuItem } from "./NavMenu";
import NavSearch from "./NavSearch";

const DemoShell = ({ children }: { children: React.ReactNode }) => (
  <Box
    style={{
      width: 700,
      height: 350,
      background: "var(--color-background)",
      border: "1px solid var(--gray-4)",
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    {children}
  </Box>
);

const ContentPanel = ({ activeRoute }: { activeRoute: string }) => (
  <Box
    style={{
      flex: 1,
      minWidth: 0,
      padding: "var(--space-4)",
      borderLeft: "1px solid var(--gray-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
    }}
  >
    <Heading size="4">{activeRoute.split("/").pop()}</Heading>
    <Text size="2" color="gray">
      /{activeRoute}
    </Text>
  </Box>
);

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "centered",
    docs: {
      story: {
        inline: true,
        iframeHeight: 370,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false, description: "Content to render inside the sidebar (NavMenu, NavSearch, etc.)" },
    header: { control: false, description: "Header slot rendered next to the collapse toggle" },
    footer: { control: "text", description: "Footer text displayed at the bottom" },
    defaultExpanded: { control: "boolean", description: "Whether the sidebar starts expanded" },
    storageKey: { control: "text", description: "localStorage key to persist expand/collapse state" },
    expandedWidth: { control: "number", description: "Width in px when expanded (default 225)" },
    onExpandChange: { action: "onExpandChange", description: "Called when expand/collapse state changes" },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuItems: NavMenuItem[] = [
  {
    id: "dashboards",
    icon: <DashboardIcon />,
    label: "Dashboards",
    children: [
      { id: "dashboards/overview", icon: <DashboardIcon />, label: "Overview" },
      { id: "dashboards/analytics", icon: <DashboardIcon />, label: "Analytics" },
    ],
  },
  { id: "observability", icon: <BarChartIcon />, label: "Observability", rightIcon: <ExternalLinkIcon /> },
  { id: "reports", icon: <BarChartIcon />, label: "Reports", isDisabled: true },
  {
    id: "settings",
    icon: <GearIcon />,
    label: "Settings",
    children: [{ id: "settings/roles", icon: <IdCardIcon />, label: "Roles" }],
  },
];

// ── Default ──────────────────────────────────────────────────────

const DefaultDemo = () => {
  const [activeRoute, setActiveRoute] = useState("dashboards/overview");

  return (
    <DemoShell>
      <Box style={{ display: "flex", height: "100%" }}>
        <Sidebar
          header={
            <Text size="2" weight="bold">
              My App
            </Text>
          }
          footer="v1.2.0"
        >
          <NavMenu items={menuItems} activeRoute={activeRoute} onNavigate={setActiveRoute} />
        </Sidebar>
        <ContentPanel activeRoute={activeRoute} />
      </Box>
    </DemoShell>
  );
};

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: {
    docs: {
      source: {
        code: `<Sidebar header={<Text weight="bold">My App</Text>} footer="v1.2.0">
  <NavMenu items={menuItems} activeRoute={activeRoute} onNavigate={setActiveRoute} />
</Sidebar>`,
        language: "tsx",
      },
    },
  },
};

// ── Custom Width ─────────────────────────────────────────────────

const CustomWidthDemo = () => {
  const [activeRoute, setActiveRoute] = useState("dashboards/overview");

  return (
    <DemoShell>
      <Box style={{ display: "flex", height: "100%" }}>
        <Sidebar
          header={
            <Text size="2" weight="bold">
              Wide Sidebar
            </Text>
          }
          expandedWidth={300}
        >
          <NavMenu items={menuItems} activeRoute={activeRoute} onNavigate={setActiveRoute} />
        </Sidebar>
        <ContentPanel activeRoute={activeRoute} />
      </Box>
    </DemoShell>
  );
};

export const CustomWidth: Story = {
  render: () => <CustomWidthDemo />,
  parameters: {
    docs: {
      source: {
        code: `<Sidebar header={<Text weight="bold">Wide Sidebar</Text>} expandedWidth={300}>
  <NavMenu items={menuItems} activeRoute={activeRoute} onNavigate={setActiveRoute} />
</Sidebar>`,
        language: "tsx",
      },
    },
  },
};

// ── With Search ──────────────────────────────────────────────────

const WithSearchDemo = () => {
  const [activeRoute, setActiveRoute] = useState("dashboards/overview");
  const [search, setSearch] = useState("");

  const filtered = menuItems
    .map((item) => {
      if (item.children) {
        const kids = item.children.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()));
        if (kids.length > 0 || item.label.toLowerCase().includes(search.toLowerCase())) {
          return { ...item, children: kids.length > 0 ? kids : item.children };
        }
        return null;
      }
      return item.label.toLowerCase().includes(search.toLowerCase()) ? item : null;
    })
    .filter(Boolean) as NavMenuItem[];

  return (
    <DemoShell>
      <Box style={{ display: "flex", height: "100%" }}>
        <Sidebar
          header={
            <Text size="2" weight="bold">
              My App
            </Text>
          }
        >
          <NavSearch value={search} onChange={setSearch} />
          <NavMenu items={filtered} activeRoute={activeRoute} onNavigate={setActiveRoute} />
        </Sidebar>
        <ContentPanel activeRoute={activeRoute} />
      </Box>
    </DemoShell>
  );
};

export const WithSearch: Story = {
  render: () => <WithSearchDemo />,
  parameters: {
    docs: {
      source: {
        code: `<Sidebar header={<Text weight="bold">My App</Text>}>
  <NavSearch value={search} onChange={setSearch} />
  <NavMenu items={filteredItems} activeRoute={activeRoute} onNavigate={setActiveRoute} />
</Sidebar>`,
        language: "tsx",
      },
    },
  },
};
