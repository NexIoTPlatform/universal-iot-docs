<script setup lang="ts" name="Helper">
import { questionFilledIcon } from "@teek/static";
import { TkIcon } from "@teek/components/common/Icon";
import { TkPopover } from "@teek/components/common/Popover";
import { ns } from "../namespace";
import { ref, watch } from "vue";

defineOptions({ name: "Helper" });

defineProps<{ triggerEl?: HTMLDivElement }>();

const visible = defineModel({ default: false });

const popoverVisible = ref(visible.value);

watch(popoverVisible, newVal => {
  visible.value = newVal;
});
</script>

<template>
  <TkPopover :class="ns.e('helper')" v-model="popoverVisible" :trigger-el placement="left-start">
    <template #reference>
      <TkIcon :icon="questionFilledIcon" :size="16" />
    </template>
    <div :class="ns.e('helper__popup')">
      <slot />
    </div>
  </TkPopover>
</template>
