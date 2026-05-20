import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Box, Text } from "../themes";
import TabPanel, { type TabPanelTab } from "./TabPanel";

const meta = {
  title: "Components/TabPanel",
  component: TabPanel,
  parameters: {
    layout: "padded",
    docs: {
      story: {
        inline: true,
        iframeHeight: 250,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    tabs: { control: "object", description: "Array of tab definitions" },
    activeTab: { control: "text", description: "Controlled active tab ID" },
    defaultTab: { control: "text", description: "Default active tab ID (uncontrolled)" },
    onTabChange: { action: "onTabChange", description: "Called with tab ID when switched" },
    wrap: { control: "boolean", description: "Wrap tabs to multiple lines on narrow screens" },
    children: { control: false, description: "Tab content panels — one child per tab, in order" },
  },
} satisfies Meta<typeof TabPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ──────────────────────────────────────────────────────

const tabs: TabPanelTab[] = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

const DefaultDemo = () => (
  <TabPanel tabs={tabs} defaultTab="overview">
    <Text>Overview content goes here.</Text>
    <Text>Analytics charts and data.</Text>
    <Text>Settings and configuration.</Text>
  </TabPanel>
);

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: {
    docs: {
      source: {
        code: `const tabs = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

<TabPanel tabs={tabs} defaultTab="overview">
  <Text>Overview content goes here.</Text>
  <Text>Analytics charts and data.</Text>
  <Text>Settings and configuration.</Text>
</TabPanel>`,
        language: "tsx",
      },
    },
  },
};

// ── With Counts ──────────────────────────────────────────────────

const WithCountsDemo = () => {
  const [items] = useState({ agents: 12, tools: 5, dashboards: 3 });

  return (
    <TabPanel
      tabs={[
        { id: "agents", label: "Agents", count: items.agents },
        { id: "tools", label: "Tools", count: items.tools },
        { id: "dashboards", label: "Dashboards", count: items.dashboards },
      ]}
      defaultTab="agents"
    >
      <Box>
        <Text weight="bold" style={{ display: "block", marginBottom: "var(--space-2)" }}>
          Agents
        </Text>
        <Text size="2" color="gray">
          {items.agents} agents configured
        </Text>
      </Box>
      <Box>
        <Text weight="bold" style={{ display: "block", marginBottom: "var(--space-2)" }}>
          Tools
        </Text>
        <Text size="2" color="gray">
          {items.tools} tools available
        </Text>
      </Box>
      <Box>
        <Text weight="bold" style={{ display: "block", marginBottom: "var(--space-2)" }}>
          Dashboards
        </Text>
        <Text size="2" color="gray">
          {items.dashboards} dashboards created
        </Text>
      </Box>
    </TabPanel>
  );
};

export const WithCounts: Story = {
  render: () => <WithCountsDemo />,
  parameters: {
    docs: {
      source: {
        code: `<TabPanel
  tabs={[
    { id: "agents", label: "Agents", count: agents.length },
    { id: "tools", label: "Tools", count: tools.length },
    { id: "dashboards", label: "Dashboards", count: dashboards.length },
  ]}
  defaultTab="agents"
>
  <AgentsContent />
  <ToolsContent />
  <DashboardsContent />
</TabPanel>`,
        language: "tsx",
      },
    },
  },
};

// ── Controlled ───────────────────────────────────────────────────

const ControlledDemo = () => {
  const [activeTab, setActiveTab] = useState("voice");
  const [log, setLog] = useState<string[]>(["→ voice"]);

  const handleChange = (tabId: string) => {
    setActiveTab(tabId);
    setLog((prev) => [`→ ${tabId}`, ...prev].slice(0, 10));
  };

  return (
    <Box style={{ display: "flex", gap: "var(--space-4)" }}>
      <Box style={{ flex: 1 }}>
        <TabPanel
          tabs={[
            { id: "voice", label: "Voice Agent" },
            { id: "email", label: "Email Agent" },
            { id: "escalations", label: "Escalations" },
          ]}
          activeTab={activeTab}
          onTabChange={handleChange}
        >
          <Text>Voice agent configuration and monitoring.</Text>
          <Text>Email agent templates and history.</Text>
          <Text>Escalation rules and queue.</Text>
        </TabPanel>
      </Box>
      <Box
        style={{
          width: 180,
          padding: "var(--space-3)",
          borderLeft: "1px solid var(--gray-4)",
          overflow: "auto",
        }}
      >
        <Text size="1" color="gray" weight="bold" style={{ display: "block", marginBottom: "var(--space-1)" }}>
          Event log
        </Text>
        {log.map((entry, i) => (
          <Text key={i} size="1" style={{ display: "block", fontFamily: "monospace", color: "var(--gray-9)" }}>
            {entry}
          </Text>
        ))}
      </Box>
    </Box>
  );
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: {
      source: {
        code: `const [activeTab, setActiveTab] = useState("voice");

<TabPanel
  tabs={[
    { id: "voice", label: "Voice Agent" },
    { id: "email", label: "Email Agent" },
    { id: "escalations", label: "Escalations" },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  <VoiceAgentView />
  <EmailAgentView />
  <EscalationsView />
</TabPanel>`,
        language: "tsx",
      },
    },
  },
};

// ── With Disabled Tab ────────────────────────────────────────────

const DisabledDemo = () => (
  <TabPanel
    tabs={[
      { id: "apps", label: "Applications" },
      { id: "agents", label: "Agents" },
      { id: "tools", label: "Tools", disabled: true },
    ]}
    defaultTab="apps"
  >
    <Text>Application cards and management.</Text>
    <Text>Agent configuration and monitoring.</Text>
    <Text>Tool access is restricted.</Text>
  </TabPanel>
);

export const WithDisabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: {
      source: {
        code: `<TabPanel
  tabs={[
    { id: "apps", label: "Applications" },
    { id: "agents", label: "Agents" },
    { id: "tools", label: "Tools", disabled: true },
  ]}
  defaultTab="apps"
>
  <ApplicationsContent />
  <AgentsContent />
  <ToolsContent />
</TabPanel>`,
        language: "tsx",
      },
    },
  },
};
