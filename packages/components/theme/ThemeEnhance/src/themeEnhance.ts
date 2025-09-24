export enum LayoutMode {
  FullWidth = "fullWidth",
  SidebarWidthAdjustableOnly = "sidebarWidthAdjustableOnly",
  BothWidthAdjustable = "bothWidthAdjustable",
  Original = "original",
}

export type LayoutModeVal = "fullWidth" | "sidebarWidthAdjustableOnly" | "bothWidthAdjustable" | "original";

export enum SpotlightStyle {
  Under = "under",
  Aside = "aside",
}

export enum ThemeColor {
  vpDefault = "vp-default",
  vpGreen = "vp-green",
  vpYellow = "vp-yellow",
  vpRed = "vp-red",
  epBlue = "ep-blue",
  epGreen = "ep-green",
  epYellow = "ep-yellow",
  epRed = "ep-red",
}

export const themeColorList = [
  ThemeColor.vpDefault,
  ThemeColor.vpGreen,
  ThemeColor.vpYellow,
  ThemeColor.vpRed,
  ThemeColor.epBlue,
  ThemeColor.epGreen,
  ThemeColor.epYellow,
  ThemeColor.epRed,
] as string[];

export const mobileMaxWidthMedia = "(max-width: 768px)";
export const activateMaxWidthSlideMedia = "(min-width: 1440px)";
export const touchMedia = "(pointer: coarse)";

export const layoutModeAttribute = "layout-mode";
export const themeColorAttribute = "theme-color";
