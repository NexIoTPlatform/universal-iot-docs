<script setup lang="ts" name="Notice">
import type { Notice } from "@teek/config";
import { computed, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";
import { useNamespace, useLocale, useMediaQuery, useVpRouter } from "@teek/composables";
import { isClient, isString } from "@teek/helper";
import { noticeIcon, closeIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";

defineOptions({ name: "Notice" });

const ns = useNamespace("notice");
const { t } = useLocale();
const { getTeekConfigRef } = useTeekConfig();
const vpRouter = useVpRouter();
const { localeIndex } = useData();

const noticeConfig = getTeekConfigRef<Required<Notice>>("notice", {
  noticeStyle: undefined,
  iconStyle: {},
  popoverStyle: {},
  title: t("tk.notice.title"),
  initOpen: true,
  duration: 0,
  mobileMinify: false,
  reopen: true,
  useStorage: true,
  twinkle: false,
  position: "top",
  noticeIcon,
  closeIcon,
  onAfterRouteChange: undefined,
});

const destroyNoticeIcon = ref(false);
const showNoticeIcon = computed(() => !showPopover.value && !destroyNoticeIcon.value);
const showPopover = ref(noticeConfig.value.initOpen);

watch(
  () => noticeConfig.value.initOpen,
  (newValue: boolean) => (showPopover.value = newValue)
);

// 公告样式
const styleObj = computed(() => {
  const { noticeStyle } = noticeConfig.value;
  if (!noticeStyle) return "";
  return noticeStyle.trim().startsWith(`.${ns.b()}`) ? noticeStyle : `.${ns.b()} { ${noticeStyle} }`;
});

// 公告标题
const noticeTitle = computed(() => {
  const { title } = noticeConfig.value;
  if (isString(title)) return title;
  return title(localeIndex.value);
});

const isMobile = useMediaQuery("(max-width: 768px)");
watch(
  () => noticeConfig.value.mobileMinify,
  val => {
    // 是否在移动端隐藏公告图标
    if (isMobile) destroyNoticeIcon.value = val;
  },
  { immediate: true }
);

let timer: ReturnType<typeof setTimeout> | null;

/**
 * 弹框定时自动关闭
 */
const closePopoverWhenTimeout = () => {
  const { duration } = noticeConfig.value;
  if (showPopover.value && duration > 0) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(handleClosePopover, duration);
  }
};

onMounted(() => {
  // 调用自定义的切换后回调
  vpRouter.bindAfterRouteChange(ns.joinNamespace("notice"), () =>
    noticeConfig.value.onAfterRouteChange?.(vpRouter.route, showNoticeIcon.value, showPopover.value)
  );
  closePopoverWhenTimeout();
});

/**
 * 如果公告弹框的 position 为 center，则当遮罩层出现时禁止滚动，即将滚动去掉
 *
 * @param action 对滚动条的行为
 */
const openOrDisableScroll = (action: "open" | "disable") => {
  if (!isClient) return;
  if (noticeConfig.value.position !== "center") return;

  const actions: Record<"open" | "disable", "add" | "remove"> = {
    open: "remove",
    disable: "add",
  };
  document.documentElement.classList[actions[action]]("disable-scroll");
};

// 记录公告弹框状态的缓存 Key
const storageKey = computed(() => ns.storageKey("notice", localeIndex.value, isClient ? window.location.hostname : ""));

if (noticeConfig.value.useStorage) {
  // 多语言切换后，读取新语言的缓存，更新公告弹框状态
  watch(
    localeIndex,
    () => {
      // 二次校验，因为 noticeConfig 是 computed，因此后面可能会变化
      if (!noticeConfig.value.useStorage) return;

      const oldValue = localStorage.getItem(storageKey.value);
      if (oldValue) {
        const isShowPopover = oldValue === "true";
        showPopover.value = isShowPopover;

        if (isShowPopover) openOrDisableScroll("disable");
      }
    },
    { immediate: true }
  );
}

/**
 * 打开公告弹窗
 */
const handleOpenPopover = () => {
  showPopover.value = true;
  storagePopoverState("true");
  closePopoverWhenTimeout();

  openOrDisableScroll("disable");
};

/**
 * 关闭公告弹窗
 */
const handleClosePopover = () => {
  showPopover.value = false;
  storagePopoverState("false");

  if (!noticeConfig.value.reopen) destroyNoticeIcon.value = true;

  if (timer) clearTimeout(timer);
  openOrDisableScroll("open");
};

/**
 * 缓存公告弹框状态
 * @param state 状态
 */
const storagePopoverState = (state: string) => {
  if (noticeConfig.value.useStorage) localStorage.setItem(storageKey.value, state);
};
</script>

<template>
  <div :class="[ns.b(), ns.joinNamespace('wallpaper-outside')]" :aria-label="t('tk.notice.label')">
    <component v-if="styleObj" :is="'style'">{{ styleObj }}</component>

    <!-- 公告图标 -->
    <div
      v-if="!destroyNoticeIcon"
      v-show="showNoticeIcon"
      :class="[ns.e('icon'), { twinkle: noticeConfig.twinkle }, 'flx']"
      :style="noticeConfig.iconStyle"
      @click="handleOpenPopover"
      role="button"
      :aria-label="t('tk.notice.openLabel')"
    >
      <TkIcon :icon="noticeConfig.noticeIcon" color="#ffffff" size="14px" aria-hidden="true" />
    </div>

    <!-- 公告弹窗 -->
    <div
      v-show="showPopover"
      :class="[ns.e('popover'), ns.is(noticeConfig.position)]"
      :style="noticeConfig.popoverStyle"
      role="dialog"
      :aria-modal="true"
      aria-labelledby="notice-title"
    >
      <slot name="header">
        <div :class="[ns.e('popover__header'), 'flx-justify-between']" :aria-label="t('tk.notice.headLabel')">
          <div class="flx-align-center">
            <TkIcon :icon="noticeConfig.noticeIcon" color="#ffffff" size="20px" aria-hidden="true" />
            <span id="notice-title" class="title sle">{{ noticeTitle }}</span>
          </div>
          <TkIcon
            :icon="noticeConfig.closeIcon"
            color="#ffffff"
            size="20px"
            :class="ns.joinNamespace('pointer')"
            @click="handleClosePopover"
            role="button"
            :aria-label="t('tk.notice.closeLabel')"
          />
        </div>
      </slot>

      <div :class="ns.e('popover__content')" :aria-label="t('tk.notice.contentLabel')">
        <slot name="teek-notice-content" />
      </div>
    </div>

    <!-- 遮罩层，与公告弹窗一起出现 -->
    <div v-show="showPopover && noticeConfig.position === 'center'" :class="ns.e('mask')" role="presentation" />
  </div>
</template>
