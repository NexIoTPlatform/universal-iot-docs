<script setup lang="ts">
import { TkAvatar } from "vitepress-theme-teek";
</script>

<template>
  <div class="avatar-container">
    <TkAvatar :size="50" text="Teeker" textColor="var(--vp-c-white)" bg-color="var(--vp-c-brand-1)" :textSize="20" />
    <TkAvatar size="large" shape="square" text="天客" :textSize="30" />
  </div>
</template>

<style lang="scss" scoped>
.avatar-container {
  display: flex;
  gap: 20px;
}
</style>
