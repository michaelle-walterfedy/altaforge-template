import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef, useState } from "react";
import { ColDef, FilterChangedEvent, ICellRendererParams } from "ag-grid-community";
import { Badge, Button, Flex, Text } from "../themes";
import { DataGrid, DataGridHandle } from "./DataGrid";

// ---------------------------------------------------------------------------
// Shared story data types
// ---------------------------------------------------------------------------

type Project = {
  id: number;
  name: string;
  status: "Active" | "Pending" | "Completed" | "Failed";
  progress: number;
  assignee: string;
  createdAt: string;
};

const STATUS_COLORS: Record<Project["status"], React.ComponentProps<typeof Badge>["color"]> = {
  Active: "blue",
  Pending: "yellow",
  Completed: "green",
  Failed: "red",
};

function makeRows(count: number): Project[] {
  const statuses: Project["status"][] = ["Active", "Pending", "Completed", "Failed"];
  const assignees = ["Alice Chen", "Bob Martinez", "Carol Okafor", "Dan Liu", "Eva Rossi"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Project ${String(i + 1).padStart(3, "0")}`,
    status: statuses[i % statuses.length],
    progress: Math.round((((i * 37) % 91) + 10) / 10) * 10,
    assignee: assignees[i % assignees.length],
    createdAt: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));
}

const FEW_ROWS = makeRows(8);
const MANY_ROWS = makeRows(60);

// ---------------------------------------------------------------------------
// Cell renderers
// ---------------------------------------------------------------------------

const StatusCellRenderer: React.FC<ICellRendererParams<Project>> = ({ data }) => {
  if (!data) return null;
  return (
    <Flex align="center" height="100%">
      <Badge color={STATUS_COLORS[data.status]}>{data.status}</Badge>
    </Flex>
  );
};

const ProgressCellRenderer: React.FC<ICellRendererParams<Project>> = ({ data }) => {
  if (!data) return null;
  return (
    <Flex align="center" height="100%" style={{ width: "100%" }}>
      <div style={{ flex: 1, height: 6, background: "var(--gray-4)", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            width: `${data.progress}%`,
            height: "100%",
            background: "var(--accent-9)",
            borderRadius: 3,
          }}
        />
      </div>
      <Text size="1" color="gray" style={{ marginLeft: 8, flexShrink: 0, minWidth: 32 }}>
        {data.progress}%
      </Text>
    </Flex>
  );
};

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

const TEXT_COLUMNS: ColDef<Project>[] = [
  { headerName: "ID", field: "id", width: 70, filter: false },
  { headerName: "Project Name", field: "name", flex: 1, minWidth: 140 },
  { headerName: "Assignee", field: "assignee", flex: 1, minWidth: 140 },
  { headerName: "Created", field: "createdAt", width: 150, filter: false },
];

const FULL_COLUMNS: ColDef<Project>[] = [
  { headerName: "ID", field: "id", width: 70, sortable: true, filter: false },
  { headerName: "Project Name", field: "name", flex: 1, minWidth: 140, sortable: true, filter: true },
  {
    headerName: "Status",
    field: "status",
    width: 130,
    sortable: true,
    filter: true,
    cellRenderer: StatusCellRenderer,
  },
  {
    headerName: "Progress",
    field: "progress",
    width: 180,
    sortable: true,
    filter: false,
    cellRenderer: ProgressCellRenderer,
  },
  { headerName: "Assignee", field: "assignee", flex: 1, minWidth: 140, sortable: true, filter: true },
  { headerName: "Created", field: "createdAt", width: 150, filter: false },
];

// Unparameterised ColDef avoids NestedFieldPaths<Project> assignability errors when spread into typed grids.
const DEFAULT_COL_DEF: ColDef = {
  sortable: false,
  filter: false,
  resizable: false,
  suppressKeyboardEvent: ({ event }) => event.key === "Tab",
};

// ---------------------------------------------------------------------------
// Story wrapper — provides a flex container with a defined height
// ---------------------------------------------------------------------------

const StoryFrame: React.FC<{ height?: number; children: React.ReactNode }> = ({ height = 400, children }) => (
  <div style={{ height, display: "flex", flexDirection: "column" }}>{children}</div>
);

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Components/DataGrid",
  component: DataGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A scrollable data grid built on AG Grid. The header is pinned outside the scroll area so it remains visible as rows scroll. Sorting and filtering are driven from the header grid and mirrored to the body grid.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    rowData: { control: false },
    columnDefs: { control: false },
    headerHeight: {
      control: { type: "number", min: 32, max: 80, step: 4 },
      description: "Height of the fixed header row in pixels (default: 44)",
    },
    rowHeight: {
      control: { type: "number", min: 32, max: 80, step: 4 },
      description: "Height of each body row in pixels",
    },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Minimal setup — a few columns and rows, no sorting or filtering. */
export const Default: Story = {
  render: ({ headerHeight, rowHeight }) => (
    <StoryFrame>
      <DataGrid<Project>
        rowData={FEW_ROWS}
        columnDefs={TEXT_COLUMNS}
        defaultColDef={DEFAULT_COL_DEF}
        headerHeight={headerHeight}
        rowHeight={rowHeight ?? 56}
      />
    </StoryFrame>
  ),
};

/** 60 rows with vertical scrolling — the primary use case for this component. */
export const WithManyRows: Story = {
  render: ({ headerHeight, rowHeight }) => (
    <StoryFrame>
      <DataGrid<Project>
        rowData={MANY_ROWS}
        columnDefs={TEXT_COLUMNS}
        defaultColDef={DEFAULT_COL_DEF}
        headerHeight={headerHeight}
        rowHeight={rowHeight ?? 56}
      />
    </StoryFrame>
  ),
};

/**
 * Columns with `sortable: true` and `filter: true`. Click a header to sort; click the
 * filter icon to open the filter menu. Sorting and filtering both drive the pinned header
 * grid and are mirrored down to the scrollable body.
 */
export const WithSortingAndFiltering: Story = {
  render: ({ headerHeight, rowHeight }) => (
    <StoryFrame>
      <DataGrid<Project>
        rowData={MANY_ROWS}
        columnDefs={[
          { headerName: "Project Name", field: "name", flex: 1, minWidth: 140, sortable: true, filter: true },
          { headerName: "Assignee", field: "assignee", flex: 1, minWidth: 140, sortable: true, filter: true },
          { headerName: "Created", field: "createdAt", width: 150, sortable: true, filter: false },
        ]}
        defaultColDef={{ ...DEFAULT_COL_DEF, filterParams: { buttons: ["reset"] } } as ColDef}
        headerHeight={headerHeight}
        rowHeight={rowHeight ?? 56}
      />
    </StoryFrame>
  ),
};

/**
 * Custom cell renderers for status badges and a progress bar — mirrors the style
 * used in the AltaForge assessment documents and assessments table.
 */
export const WithCustomCells: Story = {
  render: ({ headerHeight, rowHeight }) => (
    <StoryFrame>
      <DataGrid<Project>
        rowData={FEW_ROWS}
        columnDefs={FULL_COLUMNS}
        defaultColDef={{ ...DEFAULT_COL_DEF, sortable: true } as ColDef}
        headerHeight={headerHeight}
        rowHeight={rowHeight ?? 56}
      />
    </StoryFrame>
  ),
};

/** Zero rows — verifies the empty state renders without errors. */
export const Empty: Story = {
  render: ({ headerHeight, rowHeight }) => (
    <StoryFrame>
      <DataGrid<Project>
        rowData={[]}
        columnDefs={TEXT_COLUMNS}
        defaultColDef={DEFAULT_COL_DEF}
        headerHeight={headerHeight}
        rowHeight={rowHeight ?? 56}
      />
    </StoryFrame>
  ),
};

/**
 * Demonstrates the `DataGridHandle` ref API. Apply a filter in the Project Name column,
 * then click "Clear Filters" to reset it programmatically.
 */
export const WithClearFilters: Story = {
  render: ({ headerHeight, rowHeight }) => {
    const ClearFiltersDemo = () => {
      const gridRef = useRef<DataGridHandle>(null);
      const [filterActive, setFilterActive] = useState(false);

      return (
        <Flex direction="column" gap="3" style={{ height: 400 }}>
          <Flex justify="end">
            <Button
              variant="soft"
              color={filterActive ? "cyan" : "gray"}
              size="2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                gridRef.current?.clearFilters();
                setFilterActive(false);
              }}
            >
              Clear Filters
            </Button>
          </Flex>
          <DataGrid<Project>
            ref={gridRef}
            rowData={MANY_ROWS}
            columnDefs={[
              { headerName: "Project Name", field: "name", flex: 1, minWidth: 140, sortable: true, filter: true },
              { headerName: "Status", field: "status", width: 130, sortable: true, filter: true },
              { headerName: "Assignee", field: "assignee", flex: 1, minWidth: 140, sortable: true, filter: true },
            ]}
            defaultColDef={{ ...DEFAULT_COL_DEF, filterParams: { buttons: ["reset"] } } as ColDef}
            headerHeight={headerHeight}
            rowHeight={rowHeight ?? 56}
            onFilterChanged={(event: FilterChangedEvent<Project>) =>
              setFilterActive(Object.keys(event.api.getFilterModel()).length > 0)
            }
          />
        </Flex>
      );
    };

    return <ClearFiltersDemo />;
  },
};
