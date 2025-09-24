<script lang="ts" setup>
import { TkPagination } from "vitepress-theme-teek";
</script>

<template>
  <div class="example-pagination-block">
    <div>较少的页数</div>
    <TkPagination layout="prev, pager, next" :total="50" />
  </div>
  <div class="example-pagination-block">
    <div>超过 7 页</div>
    <TkPagination layout="prev, pager, next" :total="1000" />
  </div>
  <div class="example-pagination-block">
    <div>带有背景色的分页</div>
    <TkPagination background layout="prev, pager, next" :total="1000" />
  </div>
</template>
