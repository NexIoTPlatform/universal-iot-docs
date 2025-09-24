import type { InjectionKey } from "vue";
import type { CommentProvider } from "@teek/config";

export const artalkContext: InjectionKey<(el: string | HTMLElement, options: CommentProvider["artalk"]) => any> =
  Symbol("artalk");
