export const brand = {
  name: "AltaForge",
  description: "AltaForge — The Future Is Agentic",

  radixTheme: {
    hasBackground: true,
    accentColor: "cyan",
    grayColor: "slate",
    radius: "medium",
    scaling: "100%",
    appearance: "light",
    panelBackground: "translucent",
  },
} as const;

export type BrandConfig = typeof brand;
