<script lang="ts" setup>
import { TkMessage } from "vitepress-theme-teek";
import { h } from "vue";

const openDefault = () => {
  TkMessage("This is a message.");
};

const openPrimary = () => {
  TkMessage.primary("Oops, this is a primary message.");
};

const openSuccess = () => {
  TkMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const openWarning = () => {
  TkMessage({
    message: "Warning, this is a warning message.",
    type: "warning",
  });
};
const openError = () => {
  TkMessage.error("Oops, this is a error message.");
};

const openVn = () => {
  TkMessage({
    message: h("p", { style: "line-height: 1; font-size: 14px" }, [
      h("span", null, "Message can be "),
      h("i", { style: "color: teal" }, "VNode"),
    ]),
  });
};

const openPlain = () => {
  TkMessage({ message: "Congrats, this is a success message.", type: "success", plain: true });
};
</script>

<template>
  <div class="message-container">
    <button class="hover-color" @click="openPrimary">Primary</button>
    <button class="hover-color" @click="openSuccess">Success</button>
    <button class="hover-color" @click="openWarning">Warning</button>
    <button class="hover-color" @click="openDefault">Message</button>
    <button class="hover-color" @click="openError">Error</button>
    <button class="hover-color" @click="openVn">VNode</button>

    <button @click="openPlain">Plain Success</button>
  </div>
</template>

<style scoped>
.message-container {
  display: flex;
  gap: 20px;
}
</style>
