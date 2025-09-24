import type { Component, InjectionKey } from "vue";
import type { CommentProvider } from "@teek/config";

export const giscusContext: InjectionKey<(options: CommentProvider["giscus"]) => Component | null> = Symbol("giscus");
