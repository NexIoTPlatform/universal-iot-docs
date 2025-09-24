<script setup lang="ts">
import { TkVpContainer } from "vitepress-theme-teek";
</script>

<template>
  <TkVpContainer type="info" title="信息" text="这是一个信息容器" />
  <TkVpContainer type="tip" title="提示" text="这是一个提示容器" />
  <TkVpContainer type="warning" title="警告" text="这是一个警告容器" />
  <TkVpContainer type="danger" title="危险" text="这是一个危险容器" />

  <TkVpContainer>
    <template #title>提示</template>
    这是一个自定义插槽内容容器
  </TkVpContainer>
</template>
