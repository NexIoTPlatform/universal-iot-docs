<script setup lang="ts" name="Segmented">
import type { SegmentedProps, ModelType } from "./segmented";
import { useNamespace } from "@teek/composables";
import SegmentedHorizontalItem from "./SegmentedItem.vue";

defineOptions({ name: "Segmented" });

const ns = useNamespace("segmented");

defineProps<SegmentedProps>();

const model = defineModel<ModelType>();
</script>

<template>
  <fieldset :class="ns.b()">
    <SegmentedHorizontalItem
      v-for="option in options"
      :key="option.name"
      v-model="model"
      v-bind="option"
      :disabled="disabled"
    />
  </fieldset>
</template>
