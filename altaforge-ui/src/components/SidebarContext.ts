import { createContext, useContext } from "react";

export interface SidebarContextValue {
  isExpanded: boolean;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebarContext(): SidebarContextValue | null {
  return useContext(SidebarContext);
}
