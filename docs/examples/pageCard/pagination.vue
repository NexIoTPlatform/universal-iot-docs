<script setup lang="ts">
import { TkPageCard } from "vitepress-theme-teek";
import { computed, ref } from "vue";

const pageNum = ref(1);
const limit = 4;

const list = ["name1", "name2", "name3", "name4", "name5", "name6", "name7", "name8"];

const currentList = computed(() => list.slice((pageNum.value - 1) * limit, pageNum.value * limit));

const itemRefs = ref<HTMLLIElement[]>([]);
</script>

<template>
  <div class="demo-home-card-container">
    <TkPageCard v-model="pageNum" title="分页功能" page :pageSize="limit" :total="list.length">
      <ul>
        <li v-for="item in currentList" :key="item">{{ item }}</li>
      </ul>
    </TkPageCard>

    <TkPageCard v-model="pageNum" title="分页和动画" page :pageSize="limit" :total="list.length">
      <template #default="{ transitionName }">
        <TransitionGroup :name="transitionName" tag="ul" mode="out-in">
          <li
            ref="itemRefs"
            v-for="(item, index) in currentList"
            :key="item"
            :style="`top: ${index * itemRefs?.[index]?.getBoundingClientRect().height || 0}px`"
          >
            {{ item }}
          </li>
        </TransitionGroup>
      </template>
    </TkPageCard>
  </div>
</template>

<style lang="scss" scoped>
.demo-home-card-container {
  display: flex;
  gap: 10px;

  ul {
    position: relative;

    li {
      margin-top: 0;
    }
  }
}
</style>
