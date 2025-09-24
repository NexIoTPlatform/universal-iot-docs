<script setup lang="ts">
import { TkTitleTag } from "vitepress-theme-teek";
</script>

<template>
  <div class="tk-space">
    <TkTitleTag text="跟随主题色变换" />

    <div class="tk-space">
      <TkTitleTag text="Vitepress primary 类型" type="vp-primary" />
      <TkTitleTag text="Vitepress info 类型" type="vp-info" />
      <TkTitleTag text="Vitepress succuss 类型" type="vp-success" />
      <TkTitleTag text="Vitepress danger 类型" type="vp-danger" />
      <TkTitleTag text="Vitepress important 类型" type="vp-important" />
    </div>

    <div class="tk-space">
      <TkTitleTag text="ElementPlus primary 类型" type="ep-primary" />
      <TkTitleTag text="ElementPlus info 类型" type="ep-info" />
      <TkTitleTag text="ElementPlus succuss 类型" type="ep-success" />
      <TkTitleTag text="ElementPlus danger 类型" type="vp-danger" />
    </div>

    <div class="tk-space">
      <TkTitleTag text="large size" size="large" />
      <TkTitleTag text="default size" />
      <TkTitleTag text="small size" size="small" />
      <TkTitleTag text="mini size" size="mini" />
    </div>

    <div class="tk-space">
      <TkTitleTag text="left position，添加样式 margin-right: 4px" position="left" />
      <TkTitleTag text="right position，添加样式 margin-left: 4px" position="right" />
    </div>
  </div>
</template>

<style scoped>
.tk-space {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
