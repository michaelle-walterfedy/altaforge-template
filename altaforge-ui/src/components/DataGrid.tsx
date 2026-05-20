import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColumnResizedEvent,
  FilterChangedEvent,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  SortChangedEvent,
} from "ag-grid-community";
import { ScrollArea, Flex } from "../themes";
import styles from "./DataGrid.module.css";

ModuleRegistry.registerModules([AllCommunityModule]);

function getHeaderHorizontalViewport(root: HTMLElement | null): HTMLElement | null {
  return root?.querySelector<HTMLElement>(".ag-header-viewport") ?? null;
}

/** With suppressHorizontalScroll, the bottom fake scrollbar may be absent; center viewport still scrolls. */
function getBodyHorizontalScrollTargets(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  const center = root.querySelector<HTMLElement>(".ag-center-cols-viewport");
  const bottom = root.querySelector<HTMLElement>(".ag-body-horizontal-scroll-viewport");
  const out: HTMLElement[] = [];
  if (center) out.push(center);
  if (bottom && bottom !== center) out.push(bottom);
  return out;
}

export interface DataGridHandle {
  clearFilters: () => void;
}

export type DataGridProps<TData> = Omit<AgGridReactProps<TData>, "headerHeight" | "domLayout"> & {
  headerHeight?: number;
  /** Accessible label applied to the grid region. */
  "aria-label"?: string;
  /** ID of an element that labels the grid region. */
  "aria-labelledby"?: string;
};

function DataGridInner<TData>(
  {
    headerHeight = 44,
    onGridReady,
    onSortChanged,
    onFilterChanged,
    onColumnResized,
    columnDefs,
    defaultColDef,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...bodyProps
  }: DataGridProps<TData>,
  ref: React.ForwardedRef<DataGridHandle>,
) {
  const headerApiRef = useRef<GridApi<TData> | null>(null);
  const bodyApiRef = useRef<GridApi<TData> | null>(null);
  const headerRootRef = useRef<HTMLDivElement | null>(null);
  const bodyRootRef = useRef<HTMLDivElement | null>(null);
  const gridsReadyRef = useRef({ header: false, body: false });
  const scrollSyncCleanupRef = useRef<(() => void) | null>(null);
  const syncingHorizontalScrollRef = useRef(false);

  const mergedDefaultColDef = useMemo<ColDef<TData>>(
    () => ({ ...defaultColDef, suppressMovable: true }),
    [defaultColDef],
  );

  useImperativeHandle(ref, () => ({
    clearFilters: () => {
      headerApiRef.current?.getColumns()?.forEach((col) => headerApiRef.current?.destroyFilter(col));
      bodyApiRef.current?.getColumns()?.forEach((col) => bodyApiRef.current?.destroyFilter(col));
    },
  }));

  const attachHorizontalScrollSync = useCallback((): boolean => {
    const headerVp = getHeaderHorizontalViewport(headerRootRef.current);
    const bodyTargets = getBodyHorizontalScrollTargets(bodyRootRef.current);
    if (!headerVp || bodyTargets.length === 0) return false;

    scrollSyncCleanupRef.current?.();
    scrollSyncCleanupRef.current = null;

    const syncHeaderToBody = () => {
      if (syncingHorizontalScrollRef.current) return;
      syncingHorizontalScrollRef.current = true;
      const left = headerVp.scrollLeft;
      for (const el of bodyTargets) {
        if (el.scrollLeft !== left) el.scrollLeft = left;
      }
      requestAnimationFrame(() => {
        syncingHorizontalScrollRef.current = false;
      });
    };

    const syncBodyToHeader = (event: Event) => {
      if (syncingHorizontalScrollRef.current) return;
      const source = event.target as HTMLElement;
      syncingHorizontalScrollRef.current = true;
      const left = source.scrollLeft;
      if (headerVp.scrollLeft !== left) headerVp.scrollLeft = left;
      for (const el of bodyTargets) {
        if (el !== source && el.scrollLeft !== left) el.scrollLeft = left;
      }
      requestAnimationFrame(() => {
        syncingHorizontalScrollRef.current = false;
      });
    };

    headerVp.addEventListener("scroll", syncHeaderToBody, { passive: true });
    for (const el of bodyTargets) {
      el.addEventListener("scroll", syncBodyToHeader, { passive: true });
    }

    scrollSyncCleanupRef.current = () => {
      headerVp.removeEventListener("scroll", syncHeaderToBody);
      for (const el of bodyTargets) {
        el.removeEventListener("scroll", syncBodyToHeader);
      }
    };
    return true;
  }, []);

  const tryAttachHorizontalScrollSync = useCallback(() => {
    if (!gridsReadyRef.current.header || !gridsReadyRef.current.body) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!attachHorizontalScrollSync()) {
          requestAnimationFrame(() => {
            attachHorizontalScrollSync();
          });
        }
      });
    });
  }, [attachHorizontalScrollSync]);

  useEffect(
    () => () => {
      scrollSyncCleanupRef.current?.();
      scrollSyncCleanupRef.current = null;
    },
    [],
  );

  const handleHeaderGridReady = useCallback(
    (event: GridReadyEvent<TData>) => {
      headerApiRef.current = event.api;
      gridsReadyRef.current.header = true;
      tryAttachHorizontalScrollSync();
    },
    [tryAttachHorizontalScrollSync],
  );

  const handleBodyGridReady = useCallback(
    (event: GridReadyEvent<TData>) => {
      bodyApiRef.current = event.api;
      gridsReadyRef.current.body = true;
      onGridReady?.(event);
      tryAttachHorizontalScrollSync();
    },
    [onGridReady, tryAttachHorizontalScrollSync],
  );

  const handleSortChanged = useCallback(
    (event: SortChangedEvent<TData>) => {
      const bodyApi = bodyApiRef.current;
      if (!bodyApi) {
        onSortChanged?.(event);
        return;
      }
      const sortState = event.api.getColumnState().map(({ colId, sort, sortIndex }) => ({ colId, sort, sortIndex }));
      bodyApi.applyColumnState({ state: sortState, defaultState: { sort: null } });
      bodyApi.refreshClientSideRowModel("sort");
      onSortChanged?.(event);
    },
    [onSortChanged],
  );

  const handleFilterChanged = useCallback(
    (event: FilterChangedEvent<TData>) => {
      const filterModel = headerApiRef.current?.getFilterModel();
      if (filterModel !== undefined) bodyApiRef.current?.setFilterModel(filterModel);
      onFilterChanged?.(event);
    },
    [onFilterChanged],
  );

  const handleColumnResized = useCallback(
    (event: ColumnResizedEvent<TData>) => {
      if (!event.finished) return;
      const widthState = headerApiRef.current?.getColumnState().map(({ colId, width }) => ({ colId, width }));
      if (widthState) bodyApiRef.current?.applyColumnState({ state: widthState });
      onColumnResized?.(event);
      tryAttachHorizontalScrollSync();
    },
    [onColumnResized, tryAttachHorizontalScrollSync],
  );

  const hasLabel = ariaLabel !== undefined || ariaLabelledBy !== undefined;

  return (
    <Flex
      direction="column"
      className={styles.wrapper}
      role={hasLabel ? "region" : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {/* Header-only grid — fixed height, sits outside the ScrollArea */}
      <div
        ref={headerRootRef}
        style={{ height: headerHeight, flexShrink: 0, boxShadow: "0 1px 0 var(--ag-border-color)" }}
      >
        <AgGridReact<TData>
          onGridReady={handleHeaderGridReady}
          columnDefs={columnDefs}
          defaultColDef={mergedDefaultColDef}
          rowData={[] as TData[]}
          headerHeight={headerHeight}
          popupParent={(document.querySelector(".radix-themes") as HTMLElement) ?? document.body}
          suppressNoRowsOverlay={true}
          suppressHorizontalScroll={true}
          onSortChanged={handleSortChanged}
          onFilterChanged={handleFilterChanged}
          onColumnResized={handleColumnResized}
          suppressCellFocus={false}
          suppressHeaderFocus={false}
          ensureDomOrder={true}
        />
      </div>

      {/* Body-only grid inside Radix ScrollArea */}
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, position: "relative" }}>
        <ScrollArea scrollbars="vertical" style={{ position: "absolute", inset: 0 }}>
          <div ref={bodyRootRef} className={styles.dataGridBody}>
            <AgGridReact<TData>
              {...bodyProps}
              onGridReady={handleBodyGridReady}
              columnDefs={columnDefs}
              defaultColDef={mergedDefaultColDef}
              headerHeight={0}
              domLayout="autoHeight"
              suppressHorizontalScroll={true}
              suppressCellFocus={true}
              suppressHeaderFocus={false}
              ensureDomOrder={true}
              tabIndex={-1}
              tabToNextCell={() => false}
            />
          </div>
        </ScrollArea>
      </div>
    </Flex>
  );
}

// Cast needed to preserve the generic type parameter through forwardRef
export const DataGrid = forwardRef(DataGridInner) as <TData>(
  props: DataGridProps<TData> & React.RefAttributes<DataGridHandle>,
) => React.ReactElement | null;
