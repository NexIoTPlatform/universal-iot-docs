<script setup lang="ts" name="DocAsideOutlineItem">
import type { MenuItem } from "./outline";
import { useNamespace } from "@teek/composables";

defineOptions({ name: "DocAsideOutlineItem" });

defineProps<{ headers: MenuItem[]; root?: boolean }>();

const ns = useNamespace("aside-outline-item");

function onClick({ target: el }: Event) {
  const id = (el as HTMLAnchorElement).href!.split("#")[1];
  const heading = document.getElementById(decodeURIComponent(id));
  heading?.focus({ preventScroll: true });
}
</script>

<template>
  <ul :class="[ns.b(), root ? ns.is('root') : ns.is('nested')]">
    <li v-for="{ children, link, title } in headers" :key="link">
      <a :class="ns.m('link')" :href="link" @click="onClick" :title="title">{{ title }}</a>
      <template v-if="children?.length">
        <DocAsideOutlineItem :headers="children" />
      </template>
    </li>
  </ul>
</template>
