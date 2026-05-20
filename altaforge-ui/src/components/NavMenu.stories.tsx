import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DashboardIcon, GearIcon, BarChartIcon, IdCardIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { Box, Button, Heading, Text } from "../themes";
import NavMenu, { type NavMenuItem } from "./NavMenu";
import NavGroup from "./NavGroup";
import NavItem from "./NavItem";

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

const meta = {
  title: "Components/NavMenu",
  component: NavMenu,
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
    items: { control: "object", description: "Array of NavMenuItem objects for config-driven mode" },
    children: { control: false, description: "NavGroup / NavItem elements for children-based mode" },
    isExpanded: { control: "boolean", description: "Whether the menu shows labels or icons only" },
    activeRoute: { control: "text", description: "ID of the currently active route" },
    defaultOpenGroups: { control: "object", description: "IDs of groups open by default" },
    storageKey: { control: "text", description: "localStorage key to persist open-group state" },
    maxHeight: { control: "text", description: "CSS max-height for the scroll area" },
    onNavigate: { action: "onNavigate", description: "Called with route ID when a leaf item is clicked" },
    onExpandChange: { action: "onExpandChange", description: "Called when a collapsed item is clicked" },
  },
} satisfies Meta<typeof NavMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const routeLabels: Record<string, string> = {
  "dashboards/overview": "Overview",
  "dashboards/analytics": "Analytics",
  observability: "Observability",
  "settings/roles": "Roles",
};

const ContentPanel = ({ activeRoute, log }: { activeRoute: string; log: string[] }) => (
  <Box
    style={{
      flex: 1,
      minWidth: 0,
      padding: "var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      borderLeft: "1px solid var(--gray-4)",
      overflow: "hidden",
    }}
  >
    <Heading size="4" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      {routeLabels[activeRoute] || activeRoute}
    </Heading>
    <Text size="2" color="gray" style={{ whiteSpace: "nowrap" }}>
      Route: /{activeRoute}
    </Text>
    <Box style={{ flex: 1, overflow: "auto", borderTop: "1px solid var(--gray-3)", paddingTop: "var(--space-2)" }}>
      <Text size="1" color="gray" weight="bold" style={{ display: "block", marginBottom: "var(--space-1)" }}>
        Event log
      </Text>
      {log.map((entry, i) => (
        <Text
          key={i}
          size="1"
          style={{ display: "block", fontFamily: "monospace", color: "var(--gray-9)", whiteSpace: "nowrap" }}
        >
          {entry}
        </Text>
      ))}
    </Box>
  </Box>
);

// ── Flat Menu (no nesting) ─────────────────────────────────────────

const flatItems: NavMenuItem[] = [
  { id: "dashboard", icon: <DashboardIcon />, label: "Dashboard" },
  { id: "analytics", icon: <BarChartIcon />, label: "Analytics" },
  { id: "contacts", icon: <IdCardIcon />, label: "Contacts" },
  { id: "settings", icon: <GearIcon />, label: "Settings" },
];

const FlatMenuDemo = () => {
  const [activeRoute, setActiveRoute] = useState("dashboard");

  return (
    <DemoShell>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box style={{ width: 225, flexShrink: 0, padding: "0 var(--space-2)" }}>
          <NavMenu items={flatItems} isExpanded activeRoute={activeRoute} onNavigate={setActiveRoute} />
        </Box>
        <Box
          style={{
            flex: 1,
            padding: "var(--space-4)",
            borderLeft: "1px solid var(--gray-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size="2" color="gray">
            /{activeRoute}
          </Text>
        </Box>
      </Box>
    </DemoShell>
  );
};

export const FlatMenu: Story = {
  render: () => <FlatMenuDemo />,
  parameters: {
    docs: {
      source: {
        code: `const items: NavMenuItem[] = [
  { id: "dashboard", icon: <DashboardIcon />, label: "Dashboard" },
  { id: "analytics", icon: <BarChartIcon />, label: "Analytics" },
  { id: "contacts", icon: <IdCardIcon />, label: "Contacts" },
  { id: "settings", icon: <GearIcon />, label: "Settings" },
];

const [activeRoute, setActiveRoute] = useState("dashboard");

<NavMenu
  items={items}
  isExpanded
  activeRoute={activeRoute}
  onNavigate={setActiveRoute}
/>`,
        language: "tsx",
      },
    },
  },
};

// ── Expand / Collapse ─────────────────────────────────────────────

const expandCollapseItems: NavMenuItem[] = [
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

const ExpandCollapseDemo = () => {
  const [activeRoute, setActiveRoute] = useState("dashboards/overview");
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <DemoShell>
      <Box style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          style={{
            padding: "var(--space-2)",
            borderBottom: "1px solid var(--gray-4)",
            display: "flex",
            gap: "var(--space-2)",
          }}
        >
          <Button size="1" variant={isExpanded ? "solid" : "soft"} onClick={() => setIsExpanded(true)}>
            Expand
          </Button>
          <Button size="1" variant={!isExpanded ? "solid" : "soft"} onClick={() => setIsExpanded(false)}>
            Collapse
          </Button>
        </Box>
        <Box style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Box
            style={{
              width: isExpanded ? 225 : "var(--space-8)",
              flexShrink: 0,
              transition: "width 0.3s ease-out",
              overflow: "hidden",
              padding: "0 var(--space-2)",
            }}
          >
            <NavMenu
              items={expandCollapseItems}
              isExpanded={isExpanded}
              activeRoute={activeRoute}
              onNavigate={setActiveRoute}
            />
          </Box>
          <Box
            style={{
              flex: 1,
              minWidth: 0,
              padding: "var(--space-4)",
              borderLeft: "1px solid var(--gray-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="2" color="gray">
              /{activeRoute}
            </Text>
          </Box>
        </Box>
      </Box>
    </DemoShell>
  );
};

export const ExpandCollapse: Story = {
  render: () => <ExpandCollapseDemo />,
  parameters: {
    docs: {
      source: {
        code: `const [isExpanded, setIsExpanded] = useState(true);
const [activeRoute, setActiveRoute] = useState("dashboards/overview");

<Button onClick={() => setIsExpanded(true)}>Expand</Button>
<Button onClick={() => setIsExpanded(false)}>Collapse</Button>

<NavMenu
  items={items}
  isExpanded={isExpanded}
  activeRoute={activeRoute}
  onNavigate={setActiveRoute}
/>`,
        language: "tsx",
      },
    },
  },
};

// ── Config-driven ──────────────────────────────────────────────────

const sidebarItems: NavMenuItem[] = [
  {
    id: "dashboards",
    icon: <DashboardIcon />,
    label: "Dashboards",
    children: [
      { id: "dashboards/overview", icon: <DashboardIcon />, label: "Overview" },
      { id: "dashboards/analytics", icon: <DashboardIcon />, label: "Analytics" },
    ],
  },
  {
    id: "observability",
    icon: <BarChartIcon />,
    label: "Observability",
    rightIcon: <ExternalLinkIcon />,
  },
  { id: "reports", icon: <BarChartIcon />, label: "Reports", isDisabled: true },
  {
    id: "settings",
    icon: <GearIcon />,
    label: "Settings",
    children: [{ id: "settings/roles", icon: <IdCardIcon />, label: "Roles" }],
  },
];

const ConfigDrivenDemo = () => {
  const [activeRoute, setActiveRoute] = useState("dashboards/overview");
  const [isExpanded, setIsExpanded] = useState(true);
  const [log, setLog] = useState<string[]>(["→ dashboards/overview"]);

  const handleNavigate = (id: string) => {
    setActiveRoute(id);
    setLog((prev) => [`→ ${id}`, ...prev].slice(0, 20));
  };

  return (
    <DemoShell>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box
          style={{
            width: isExpanded ? 225 : "var(--space-8)",
            flexShrink: 0,
            transition: "width 0.3s ease-out",
            overflow: "hidden",
          }}
        >
          <NavMenu
            items={sidebarItems}
            isExpanded={isExpanded}
            activeRoute={activeRoute}
            onNavigate={handleNavigate}
            onExpandChange={setIsExpanded}
          />
        </Box>
        <ContentPanel activeRoute={activeRoute} log={log} />
      </Box>
    </DemoShell>
  );
};

export const ConfigDriven: Story = {
  render: () => <ConfigDrivenDemo />,
  parameters: {
    docs: {
      source: {
        code: `const items: NavMenuItem[] = [
  {
    id: "dashboards",
    icon: <DashboardIcon />,
    label: "Dashboards",
    children: [
      { id: "dashboards/overview", icon: <DashboardIcon />, label: "Overview" },
      { id: "dashboards/analytics", icon: <DashboardIcon />, label: "Analytics" },
    ],
  },
  {
    id: "observability",
    icon: <BarChartIcon />,
    label: "Observability",
    rightIcon: <ExternalLinkIcon />,
  },
  {
    id: "settings",
    icon: <GearIcon />,
    label: "Settings",
    children: [
      { id: "settings/roles", icon: <IdCardIcon />, label: "Roles" },
    ],
  },
];

const [activeRoute, setActiveRoute] = useState("dashboards/overview");
const [isExpanded, setIsExpanded] = useState(true);

<NavMenu
  items={items}
  isExpanded={isExpanded}
  activeRoute={activeRoute}
  onNavigate={setActiveRoute}
  onExpandChange={setIsExpanded}
/>`,
        language: "tsx",
      },
    },
  },
};

// ── Children-based ─────────────────────────────────────────────────

const ChildrenBasedDemo = () => {
  const [activeRoute, setActiveRoute] = useState("dashboards/overview");
  const [isExpanded, setIsExpanded] = useState(true);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["dashboards", "settings"]));
  const [log, setLog] = useState<string[]>(["→ dashboards/overview"]);

  const toggle = (id: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setLog((prev) => [`toggle ${id}`, ...prev].slice(0, 20));
  };

  const nav = (id: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }
    setActiveRoute(id);
    setLog((prev) => [`→ ${id}`, ...prev].slice(0, 20));
  };

  return (
    <DemoShell>
      <Box style={{ display: "flex", height: "100%" }}>
        <Box
          style={{
            width: isExpanded ? 225 : "var(--space-8)",
            flexShrink: 0,
            transition: "width 0.3s ease-out",
            overflow: "hidden",
          }}
        >
          <NavMenu isExpanded={isExpanded} onExpandChange={setIsExpanded}>
            <NavGroup
              icon={<DashboardIcon />}
              label="Dashboards"
              isExpanded={isExpanded}
              isOpen={openGroups.has("dashboards")}
              onToggle={() => toggle("dashboards")}
            >
              <NavItem
                icon={<DashboardIcon />}
                label="Overview"
                isExpanded={isExpanded}
                isNested
                isActive={activeRoute === "dashboards/overview"}
                onClick={() => nav("dashboards/overview")}
              />
              <NavItem
                icon={<DashboardIcon />}
                label="Analytics"
                isExpanded={isExpanded}
                isNested
                isActive={activeRoute === "dashboards/analytics"}
                onClick={() => nav("dashboards/analytics")}
              />
            </NavGroup>
            <NavItem
              icon={<BarChartIcon />}
              label="Observability"
              isExpanded={isExpanded}
              rightIcon={<ExternalLinkIcon />}
              isActive={activeRoute === "observability"}
              onClick={() => nav("observability")}
            />
            <NavGroup
              icon={<GearIcon />}
              label="Settings"
              isExpanded={isExpanded}
              isOpen={openGroups.has("settings")}
              onToggle={() => toggle("settings")}
            >
              <NavItem
                icon={<IdCardIcon />}
                label="Roles"
                isExpanded={isExpanded}
                isNested
                isActive={activeRoute === "settings/roles"}
                onClick={() => nav("settings/roles")}
              />
            </NavGroup>
          </NavMenu>
        </Box>
        <ContentPanel activeRoute={activeRoute} log={log} />
      </Box>
    </DemoShell>
  );
};

export const ChildrenBased: Story = {
  render: () => <ChildrenBasedDemo />,
  parameters: {
    docs: {
      source: {
        code: `const [activeRoute, setActiveRoute] = useState("dashboards/overview");
const [isExpanded, setIsExpanded] = useState(true);
const [openGroups, setOpenGroups] = useState(new Set(["dashboards", "settings"]));

const toggle = (id: string) => {
  setOpenGroups((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
};

<NavMenu isExpanded={isExpanded} onExpandChange={setIsExpanded}>
  <NavGroup icon={<DashboardIcon />} label="Dashboards" isExpanded={isExpanded}
    isOpen={openGroups.has("dashboards")} onToggle={() => toggle("dashboards")}>
    <NavItem icon={<DashboardIcon />} label="Overview" isExpanded={isExpanded} isNested
      isActive={activeRoute === "dashboards/overview"}
      onClick={() => setActiveRoute("dashboards/overview")} />
    <NavItem icon={<DashboardIcon />} label="Analytics" isExpanded={isExpanded} isNested
      isActive={activeRoute === "dashboards/analytics"}
      onClick={() => setActiveRoute("dashboards/analytics")} />
  </NavGroup>
  <NavItem icon={<BarChartIcon />} label="Observability" isExpanded={isExpanded}
    rightIcon={<ExternalLinkIcon />} />
  <NavGroup icon={<GearIcon />} label="Settings" isExpanded={isExpanded}
    isOpen={openGroups.has("settings")} onToggle={() => toggle("settings")}>
    <NavItem icon={<IdCardIcon />} label="Roles" isExpanded={isExpanded} isNested
      isActive={activeRoute === "settings/roles"}
      onClick={() => setActiveRoute("settings/roles")} />
  </NavGroup>
</NavMenu>`,
        language: "tsx",
      },
    },
  },
};
