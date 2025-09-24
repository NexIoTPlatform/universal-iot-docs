<script setup lang="ts"></script>

<template>
  <button class="tk-button">primary</button>
</template>

<style lang="scss" scoped>
.tk-button {
  color: #ffffff;
  background-color: #395ae3;
  box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
  font-size: 14px;
  height: 32px;
  padding: 4px 15px;
  border-radius: 6px;
  outline: none;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  line-height: 1.5714285714285714;

  &:hover {
    background-color: #5a79f4;
  }
}
</style>
