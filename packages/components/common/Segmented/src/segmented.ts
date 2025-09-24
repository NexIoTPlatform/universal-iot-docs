import type { TkIconProps } from "@teek/components/common/Icon";

export type ModelType = string | number | object | boolean;

export interface SegmentedProps {
  options: SegmentedOption[];
  disabled?: boolean;
}

export interface SegmentedOption extends SegmentedBase {
  ariaLabel?: string;
}

export interface SegmentedItemProps extends SegmentedBase {
  disabled?: boolean;
}

export interface SegmentedBase {
  value: ModelType;
  label?: string;
  icon?: TkIconProps["icon"];
  title?: string;
  name?: string;
}
