<script setup lang="ts">
import { ref } from "vue";

const showWx = ref(false);
const openWx = () => (showWx.value = true);
const closeWx = () => (showWx.value = false);
</script>

<template>
  <div class="wx-contact">
    <button class="contact-btn" @click="openWx">
      📞 扫码添加微信咨询
    </button>

    <!-- 二维码弹窗 -->
    <div v-if="showWx" class="wx-modal" @click.self="closeWx">
      <div class="wx-modal__content">
        <img src="/wx.png" alt="微信二维码" />
        <p>扫码添加微信，备注：授权/咨询</p>
        <button class="wx-modal__close" @click="closeWx">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wx-contact {
  text-align: center;
  margin: 2rem 0;
}

.contact-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--vp-c-brand), #2563eb);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* 二维码弹窗 */
.wx-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.wx-modal__content {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 20px;
  width: min(90vw, 420px);
  text-align: center;
}

.wx-modal__content img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.wx-modal__content p {
  margin: 12px 0 8px;
  color: var(--vp-c-text-2);
}

.wx-modal__close {
  margin-top: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-brand);
  background: transparent;
  color: var(--vp-c-brand);
  border-radius: 8px;
  cursor: pointer;
}

.wx-modal__close:hover {
  background: var(--vp-c-brand);
  color: white;
}
</style>
