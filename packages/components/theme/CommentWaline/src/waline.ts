import type { InjectionKey } from "vue";
import { CommentProvider } from "@teek/config";

export interface WalineInstance {
  el: HTMLElement | null;
  update: (newOptions?: any) => void;
  destroy: () => void;
}

export const walineContext: InjectionKey<
  (el: string | HTMLElement | null, options: CommentProvider["waline"]) => WalineInstance | null
> = Symbol("waline");
