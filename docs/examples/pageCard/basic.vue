<script setup lang="ts">
import { TkPageCard } from "vitepress-theme-teek";

const list = ["name1", "name2", "name3", "name4"];
</script>

<template>
  <TkPageCard title="卡片">
    <ul>
      <li v-for="item in list" :key="item">{{ item }}</li>
    </ul>
  </TkPageCard>
</template>
