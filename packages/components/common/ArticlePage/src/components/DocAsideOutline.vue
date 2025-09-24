<script setup lang="ts" name="DocAsideOutline">
import { onContentUpdated, useData } from "vitepress";
import { onMounted, ref, shallowRef } from "vue";
import { useNamespace } from "@teek/composables";
import { getHeaders, resolveTitle, useActiveAnchor } from "./outline";
import DocAsideOutlineItem from "./DocAsideOutlineItem.vue";

defineOptions({ name: "DocAsideOutline" });

const ns = useNamespace("aside-outline");
const { frontmatter, theme } = useData();

const headers = shallowRef<any[]>([]);

onContentUpdated(() => {
  headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline);
});

onMounted(() => {
  if (!headers.value?.length) headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline);
});

const container = ref();
const marker = ref();

useActiveAnchor(container, marker);
</script>

<template>
  <nav
    aria-labelledby="doc-outline-aria-label"
    :class="[ns.b(), { 'has-outline': headers.length > 0 }]"
    ref="container"
  >
    <div :class="ns.e('content')">
      <div :class="ns.m('marker')" ref="marker" />

      <div id="doc-outline-aria-label" aria-level="2" :class="ns.m('title')" role="heading">
        {{ resolveTitle(theme) }}
      </div>

      <DocAsideOutlineItem :headers="headers" :root="true" />
    </div>
  </nav>
</template>
