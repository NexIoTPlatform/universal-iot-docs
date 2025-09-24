<script setup lang="ts" name="Breadcrumb">
import type { BreadcrumbProps } from "./breadcrumb";
import { onMounted, provide, ref } from "vue";
import { useLocale } from "@teek/composables";
import { breadcrumbKey } from "./breadcrumb";
import { ns } from "./namespace";

defineOptions({ name: "Breadcrumb" });

const { t } = useLocale();

const { separator = "/" } = defineProps<BreadcrumbProps>();

const breadcrumb = ref<HTMLDivElement>();

provide(breadcrumbKey, { separator });

onMounted(() => {
  const items = breadcrumb.value?.querySelectorAll(`.${ns.e("item")}`);

  if (items?.length) {
    items[items.length - 1].setAttribute("aria-current", "page");
  }
});
</script>

<template>
  <div ref="breadcrumb" :class="ns.b()" role="navigation" :aria-label="t('tk.breadcrumb.label')">
    <slot />
  </div>
</template>
