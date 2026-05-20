import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { CubeIcon, RocketIcon, LightningBoltIcon, GlobeIcon, ArchiveIcon } from "@radix-ui/react-icons";
import ItemDropdown, { type ItemDropdownItem } from "./ItemDropdown";

const meta = {
  title: "Components/ItemDropdown",
  component: ItemDropdown,
  parameters: {
    layout: "padded",
    docs: {
      story: {
        inline: true,
        iframeHeight: 120,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    items: { control: "object", description: "Array of dropdown items" },
    selectedId: { control: "text", description: "ID of the currently selected item" },
    onSelect: { action: "onSelect", description: "Called with item ID when selected" },
    title: { control: "text", description: "Popover header title" },
    placeholder: { control: "text", description: "Trigger button text when nothing is selected" },
    searchPlaceholder: { control: "text", description: "Search input placeholder (shown when >5 items)" },
    triggerIcon: { control: false, description: "Override icon shown in the trigger button" },
    width: { control: "number", description: "Popover width in px (default 360)" },
  },
} satisfies Meta<typeof ItemDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const orgItems: ItemDropdownItem[] = [
  {
    id: "venntax",
    name: "VennTax",
    description: "Tax Preparation",
    icon: <CubeIcon />,
    tag: "Tax & Accounting",
    tagColor: "cyan",
  },
  {
    id: "acme-corp",
    name: "Acme Corp",
    description: "Enterprise Solutions",
    icon: <RocketIcon />,
    tag: "Technology",
    tagColor: "blue",
  },
  {
    id: "bolt-energy",
    name: "Bolt Energy",
    description: "Renewable Infrastructure",
    icon: <LightningBoltIcon />,
    tag: "Energy",
    tagColor: "green",
  },
  {
    id: "global-media",
    name: "Global Media",
    description: "Content Distribution",
    icon: <GlobeIcon />,
  },
];

// ── Default ──────────────────────────────────────────────────────

const DefaultDemo = () => {
  const [selectedId, setSelectedId] = useState("venntax");

  return <ItemDropdown items={orgItems} selectedId={selectedId} onSelect={setSelectedId} title="Organizations" />;
};

export const Default: Story = {
  render: () => <DefaultDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    // Popover renders in a Radix portal outside canvasElement
    const body = within(document.body);
    // Wait for Radix enter animation before asserting visibility
    await waitFor(() => expect(body.getByText("Organizations")).toBeVisible());
    await userEvent.click(body.getByText("Acme Corp"));
    // Popover closes on selection, so canvas is no longer aria-hidden
    await expect(canvas.getByRole("button")).toHaveTextContent("Acme Corp");
  },
  parameters: {
    docs: {
      source: {
        code: `const items: ItemDropdownItem[] = [
  {
    id: "venntax",
    name: "VennTax",
    description: "Tax Preparation",
    icon: <CubeIcon />,
    tag: "Tax & Accounting",
    tagColor: "cyan",
  },
  // ...
];

<ItemDropdown
  items={items}
  selectedId={selectedId}
  onSelect={setSelectedId}
  title="Organizations"
/>`,
        language: "tsx",
      },
    },
  },
};

// ── With Search (many items) ─────────────────────────────────────

const manyItems: ItemDropdownItem[] = [
  ...orgItems,
  {
    id: "northern-trust",
    name: "Northern Trust",
    description: "Wealth Management",
    icon: <ArchiveIcon />,
    tag: "Finance",
    tagColor: "purple",
  },
  {
    id: "pinnacle-health",
    name: "Pinnacle Health",
    description: "Healthcare Analytics",
    icon: <CubeIcon />,
    tag: "Healthcare",
    tagColor: "red",
  },
  {
    id: "summit-logistics",
    name: "Summit Logistics",
    description: "Supply Chain",
    icon: <RocketIcon />,
    tag: "Logistics",
    tagColor: "orange",
  },
];

const WithSearchDemo = () => {
  const [selectedId, setSelectedId] = useState("venntax");

  return (
    <ItemDropdown
      items={manyItems}
      selectedId={selectedId}
      onSelect={setSelectedId}
      title="Organizations"
      searchPlaceholder="Search by organization name"
    />
  );
};

export const WithSearch: Story = {
  render: () => <WithSearchDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    const body = within(document.body);
    const searchInput = body.getByPlaceholderText("Search by organization name");
    await userEvent.type(searchInput, "Bolt");
    await expect(body.getByText("Bolt Energy")).toBeVisible();
    await expect(body.queryByText("Acme Corp")).not.toBeInTheDocument();
    await userEvent.click(body.getByText("Bolt Energy"));
    await expect(canvas.getByRole("button")).toHaveTextContent("Bolt Energy");
  },
  parameters: {
    docs: {
      source: {
        code: `<ItemDropdown
  items={manyItems}
  selectedId={selectedId}
  onSelect={setSelectedId}
  title="Organizations"
  searchPlaceholder="Search by organization name"
/>`,
        language: "tsx",
      },
    },
  },
};

// ── No Icons ─────────────────────────────────────────────────────

const simpleItems: ItemDropdownItem[] = [
  { id: "dev", name: "Development", tag: "Active", tagColor: "green" },
  { id: "staging", name: "Staging", tag: "Active", tagColor: "green" },
  { id: "prod", name: "Production", tag: "Live", tagColor: "red" },
];

const NoIconsDemo = () => {
  const [selectedId, setSelectedId] = useState("dev");

  return (
    <ItemDropdown
      items={simpleItems}
      selectedId={selectedId}
      onSelect={setSelectedId}
      placeholder="Select environment"
    />
  );
};

export const NoIcons: Story = {
  render: () => <NoIconsDemo />,

  parameters: {
    docs: {
      source: {
        code: `const items = [
  { id: "dev", name: "Development", tag: "Active", tagColor: "green" },
  { id: "staging", name: "Staging", tag: "Active", tagColor: "green" },
  { id: "prod", name: "Production", tag: "Live", tagColor: "red" },
];

<ItemDropdown
  items={items}
  selectedId={selectedId}
  onSelect={setSelectedId}
  placeholder="Select environment"
/>`,
        language: "tsx",
      },
    },
  },
};

// ── Stress Test (50 items) ───────────────────────────────────────

const iconSet = [CubeIcon, RocketIcon, LightningBoltIcon, GlobeIcon, ArchiveIcon];
const tagSet = ["Finance", "Technology", "Energy", "Healthcare", "Logistics", "Media", "Retail"];
const colorSet: ItemDropdownItem["tagColor"][] = ["cyan", "blue", "green", "orange", "red", "purple", "gray"];

const stressItems: ItemDropdownItem[] = Array.from({ length: 50 }, (_, i) => {
  const Icon = iconSet[i % iconSet.length];
  return {
    id: `org-${i + 1}`,
    name: `Organization ${i + 1}`,
    description: `Division ${String.fromCharCode(65 + (i % 26))} · ${Math.floor(Math.random() * 10) + 1} solutions`,
    icon: <Icon />,
    tag: tagSet[i % tagSet.length],
    tagColor: colorSet[i % colorSet.length],
  };
});

const StressTestDemo = () => {
  const [selectedId, setSelectedId] = useState("org-1");

  return (
    <ItemDropdown
      items={stressItems}
      selectedId={selectedId}
      onSelect={setSelectedId}
      title="Organizations"
      searchPlaceholder="Search organizations…"
    />
  );
};

export const StressTest: Story = {
  render: () => <StressTestDemo />,

  parameters: {
    docs: {
      source: {
        code: `<ItemDropdown
  items={fiftyItems}
  selectedId={selectedId}
  onSelect={setSelectedId}
  title="Organizations"
  subtitle="50 organizations available"
/>`,
        language: "tsx",
      },
    },
  },
};
