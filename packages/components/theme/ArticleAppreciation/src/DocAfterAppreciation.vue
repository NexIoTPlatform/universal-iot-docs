<script setup lang="ts" name="DocAfterAppreciation">
import type { Appreciation } from "@teek/config";
import { computed, ref, watch } from "vue";
import { useNamespace, useLocale } from "@teek/composables";
import { aliPayIcon, weChatPayIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";

defineOptions({ name: "DocAfterAppreciation" });

const ns = useNamespace("article-appreciation");
const { t } = useLocale();

const { getTeekConfigRef } = useTeekConfig();

const appreciateConfig = getTeekConfigRef<Required<Appreciation<"doc-after">>>("appreciation", { position: "" });

const docAfterOptions = computed(() => appreciateConfig.value.options || { expand: false });

const showContent = ref(docAfterOptions.value.expand);

const icon = computed(() => {
  const { icon } = docAfterOptions.value;
  if (icon === "aliPay") return aliPayIcon;
  if (icon === "weChatPay") return weChatPayIcon;

  return icon;
});

const toggleShowContent = () => {
  showContent.value = !showContent.value;
};

watch(
  () => docAfterOptions.value.expand,
  newValue => {
    showContent.value = newValue;
  }
);
</script>

<template>
  <div :class="[ns.b(), ns.m('doc-after')]" :aria-label="t('tk.articleAppreciation.label')">
    <div
      v-if="docAfterOptions.buttonHtml"
      v-html="docAfterOptions.buttonHtml"
      role="button"
      :aria-expanded="showContent"
      :aria-controls="`${ns.e('content')}`"
    />
    <button
      v-else-if="docAfterOptions.expandTitle || docAfterOptions.collapseTitle"
      :class="ns.e('button')"
      @click="toggleShowContent"
      :aria-expanded="showContent"
      :aria-controls="`${ns.e('content')}`"
      aria-live="polite"
    >
      <TkIcon v-if="icon" :class="ns.e('button__icon')" :icon="icon" :size="16" aria-hidden="true" />

      <span v-if="showContent" v-html="docAfterOptions.collapseTitle" />
      <span v-else v-html="docAfterOptions.expandTitle" />
    </button>

    <Transition :name="ns.joinNamespace('fade')">
      <div v-if="showContent" :class="ns.e('content')" :aria-label="t('tk.articleAppreciation.contentLabel')">
        <div :class="ns.e('content')" v-html="docAfterOptions.content" />
      </div>
    </Transition>
  </div>
</template>
