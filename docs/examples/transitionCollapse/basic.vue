<script setup lang="ts">
import { TkTransitionCollapse } from "vitepress-theme-teek";
import { ref } from "vue";

const visible = ref(false);
</script>

<template>
  <button @click="visible = !visible" style="margin-bottom: 10px">点击我切换</button>

  <TkTransitionCollapse>
    <div v-show="visible">使用折叠动画组件</div>
  </TkTransitionCollapse>
</template>
