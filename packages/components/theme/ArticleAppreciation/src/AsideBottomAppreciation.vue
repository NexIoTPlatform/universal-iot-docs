<script setup lang="ts" name="AsideBottomAppreciation">
import type { Appreciation } from "@teek/config";
import { computed } from "vue";
import { useNamespace, useLocale } from "@teek/composables";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";

defineOptions({ name: "AsideBottomAppreciation" });

const ns = useNamespace("article-appreciation");
const { t } = useLocale();

const { getTeekConfigRef } = useTeekConfig();

const appreciateConfig = getTeekConfigRef<Required<Appreciation<"aside-bottom">>>("appreciation", { position: "" });

const asideBottomOptions = computed(() => appreciateConfig.value.options || {});
</script>

<template>
  <div :class="[ns.b(), ns.m('aside-bottom')]" :aria-label="t('tk.articleAppreciation.label')">
    <span v-html="asideBottomOptions.title"></span>
    <div :class="ns.e('content')" v-html="asideBottomOptions.content" />
  </div>
</template>
