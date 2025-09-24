<script setup lang="ts" name="Switch">
import { ns } from "../namespace";

const check = defineModel({ default: false });

const handleClick = () => {
  check.value = !check.value;
};
</script>

<template>
  <span :class="[ns.e('switch'), ns.is('checked', check)]" @click="handleClick">
    <div class="action"></div>
  </span>
</template>
