import { useNamespace } from "@teek/composables";

export const ns = useNamespace("theme-enhance");

export const transitionName = ns.joinNamespace("theme-enhance-slide");
export const pageMaxWidthVar = ns.cssVarName("page-max-width");
export const docMaxWidthVar = ns.cssVarName("doc-max-width");

export const layoutModeStorageKey = ns.storageKey("layoutMode");
export const pageMaxWidthSlideStorageKey = ns.storageKey("pageMaxWidthSlide");
export const docMaxWidthSlideStorageKey = ns.storageKey("docMaxWidthSlide");
export const themeColorStorageKey = ns.storageKey("themeColor");
export const themeBgColorStorageKey = ns.storageKey("themeBgColor");
export const spotlightStorageKey = ns.storageKey("spotlight");
export const spotlightStyleStorageKey = ns.storageKey("spotlightStyle");
