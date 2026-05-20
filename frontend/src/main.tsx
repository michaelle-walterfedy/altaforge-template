import "altaforge-ui/themes/styles.css";
import "altaforge-ui/components/styles.css";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { brand } from "@/config/brand";
import { Theme } from "altaforge-ui/themes";

const themeProps = {
  accentColor: brand.radixTheme?.accentColor || "cyan",
  grayColor: brand.radixTheme?.grayColor || "slate",
  radius: brand.radixTheme?.radius || "medium",
  scaling: brand.radixTheme?.scaling || "100%",
  appearance: brand.radixTheme?.appearance || "light",
  panelBackground: brand.radixTheme?.panelBackground || "translucent",
} as const;

createRoot(document.getElementById("root")!).render(
  <Theme {...themeProps}>
    <App />
  </Theme>,
);
