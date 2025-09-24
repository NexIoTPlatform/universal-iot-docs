<script setup lang="ts">
import { ref } from "vue";
import { TkVerifyCode, TkMessage } from "vitepress-theme-teek";

const verifyCode = ref("");
const imgCode = ref("");

const handleClick = () => {
  if (verifyCode.value !== imgCode.value) return TkMessage.error("请输入正确的验证码");
  TkMessage.success("验证成功");
};
</script>

<template>
  <TkVerifyCode v-model="imgCode" />

  <input type="text" v-model="verifyCode" />
  <button @click="handleClick">验证</button>
</template>

<style lang="scss" scoped>
input {
  padding: 1px 15px;
  border: 1px solid var(--vp-c-divider);
  transition: border 0.2s ease;
  border-radius: 4px;
  display: inline-flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  width: 100px;
  margin: 10px 20px 10px 0;
}
</style>
