<script setup lang="ts"></script>

<template>
  <button class="tk-button">info</button>
</template>

<style lang="scss" scoped>
.tk-button {
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
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
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  line-height: 1.5714285714285714;
  color: rgba(0, 0, 0, 0.88);

  &:hover {
    color: #395ae3;
    border-color: #395ae3;
  }
}
</style>
