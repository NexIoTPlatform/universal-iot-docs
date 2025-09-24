<script setup lang="ts">
import { TkSegmented } from "vitepress-theme-teek";
import { ref } from "vue";

const selected = ref("Mon");

const options = [
  { value: "Mon", label: "Mon" },
  { value: "Tue", label: "Tue" },
  { value: "Wed", label: "Wed" },
  { value: "Thu", label: "Thu" },
  { value: "Fri", label: "Fri" },
  { value: "Sat", label: "Sat" },
  { value: "Sun", label: "Sun" },
];
</script>

<template>
  <TkSegmented v-model="selected" :options />
</template>
