<script setup lang="ts" name="VpContainer">
import { computed, useSlots } from "vue";
import type { VpContainerProps } from "./vpContainer";
import { useNamespace } from "@teek/composables";

defineOptions({ name: "VpContainer" });

const ns = useNamespace("vp-container");

const { type = "tip", title, text = "" } = defineProps<VpContainerProps>();

const slots = useSlots();

const hasTitle = computed(() => title || slots.title);
const hasText = computed(() => text || slots.default);
</script>

<template>
  <div v-if="hasTitle || hasText" :class="[ns.b(), 'vp-doc']">
    <div :class="[type, 'custom-block', { 'no-title': !title }]">
      <div v-if="hasTitle" class="custom-block-title">
        <slot name="title">
          <span v-html="title" />
        </slot>
      </div>

      <p v-if="hasText">
        <slot>
          <span v-html="text" />
        </slot>
      </p>
    </div>
  </div>
</template>
