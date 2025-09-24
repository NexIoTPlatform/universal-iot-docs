<script setup lang="ts">
import { TkSegmented } from "vitepress-theme-teek";
import { ref } from "vue";

const selected = ref("ep:cpu");

const options = [
  { value: "ep:coordinate", icon: "ep:coordinate" },
  { value: "ep:copy", icon: "ep:copy-document" },
  { value: "ep:cpu", icon: "ep:cpu" },
  { value: "ep:credit-card", icon: "ep:credit-card" },
  { value: "ep:crop", icon: "ep:crop" },
  { value: "ep:d-arrow-left", icon: "ep:d-arrow-left" },
  { value: "ep:d-arrow-right", icon: "ep:d-arrow-right" },
];
</script>

<template>
  <TkSegmented v-model="selected" :options />
</template>
