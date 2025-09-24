<script setup lang="ts">
import { TkPageCard, TkMessage } from "vitepress-theme-teek";

const list = ["name1", "name2", "name3", "name4"];

const handleClick = () => {
  TkMessage.info("点击了卡片标题");
};
</script>

<template>
  <div class="demo-home-card-container">
    <TkPageCard title="点击我" :titleClick="handleClick">
      <ul>
        <li v-for="item in list" :key="item">{{ item }}</li>
      </ul>
    </TkPageCard>

    <TkPageCard title="点击我跳转" titleLink="http://vp.teek.top">
      <ul>
        <li v-for="item in list" :key="item">{{ item }}</li>
      </ul>
    </TkPageCard>
  </div>
</template>

<style lang="scss" scoped>
.demo-home-card-container {
  display: flex;
  gap: 10px;
}
</style>
