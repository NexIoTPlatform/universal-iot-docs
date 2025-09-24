<script setup lang="ts" name="HomeMyCardScreen">
import type { Blogger } from "@teek/config";
import { withBase } from "vitepress";
import { useNamespace, useLocale, useMediaQuery } from "@teek/composables";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";

defineOptions({ name: "HomeMyCardScreen" });

const ns = useNamespace("my-screen");
const { t } = useLocale();

const { getTeekConfigRef } = useTeekConfig();

const blogger = getTeekConfigRef<Required<Blogger>>("blogger", {});

const isShow = useMediaQuery("(max-width: 960px)");
</script>

<template>
  <template v-if="isShow && blogger.name && blogger.avatar && blogger.slogan">
    <slot name="teek-home-card-my-screen-before" />

    <slot name="teek-home-card-my-screen">
      <div :class="ns.b()">
        <div :class="ns.e('avatar')">
          <img v-if="blogger.avatar" :src="withBase(blogger.avatar)" :alt="t('tk.myCard.avatarAlt')" />
        </div>

        <div :class="ns.e('blogger')" :aria-label="t('tk.myCard.bloggerLabel')">
          <h3 class="name">{{ blogger.name }}</h3>
          <span class="slogan">{{ blogger.slogan }}</span>
        </div>
      </div>
    </slot>

    <slot name="teek-home-card-my-screen-after" />
  </template>
</template>
