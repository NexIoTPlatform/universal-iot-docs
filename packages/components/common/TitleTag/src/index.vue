<script setup lang="ts" name="TitleTag">
import { useNamespace } from "@teek/composables";
import { TitleTagProps } from "./titleTag";

defineOptions({ name: "TitleTag" });

defineProps<TitleTagProps>();

const ns = useNamespace("title-tag");
</script>

<template>
  <span
    v-if="text || $slots.default"
    :class="[ns.b(), type && ns.m(type), position && ns.m(position), size && ns.m(size)]"
  >
    <slot>{{ text }}</slot>
  </span>
</template>
