<script setup lang="ts" name="SegmentedItem">
import type { SegmentedItemProps, ModelType } from "./segmented";
import { useNamespace } from "@teek/composables";
import { TkIcon } from "@teek/components/common/Icon";

defineOptions({ name: "SegmentedItem" });

defineProps<SegmentedItemProps>();

const ns = useNamespace("segmented-item");

const model = defineModel<ModelType>();
</script>

<template>
  <label :class="[ns.b(), ns.is('active', model === value && !disabled), ns.is('disabled', disabled)]" :title :disabled>
    <input
      v-model="model"
      type="radio"
      :value
      :name
      :disabled
      :checked="model === value"
      :aria-checked="model === value"
      role="radio"
      style="display: none"
    />
    <span :class="ns.e('content')">
      <TkIcon v-if="icon" :icon aria-hidden="true" />
      <span v-if="label">{{ label }}</span>
    </span>
  </label>
</template>
