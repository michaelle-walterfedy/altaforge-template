import { DashboardIcon } from "@radix-ui/react-icons";
import type { NavMenuItem } from "altaforge-ui/components";

export const NAV_ITEMS: NavMenuItem[] = [
  { id: "/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
  // Add more nav items here as you build out your application.
  // Each id should match the route path defined in App.tsx.
  // Example:
  // { id: "/agents", icon: <GearIcon />, label: "Agents" },
];
