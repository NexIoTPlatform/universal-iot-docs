import type { Component, Ref } from "vue";
import type { TkIconProps } from "@teek/components/common/Icon";
import type { Private } from "@teek/config";
import { useNamespace } from "@teek/composables";
import { isClient } from "@teek/helper";

/**
 * 获取登录状态的存储键
 */
export const getLoginStorageKey = () => {
  if (!isClient) return { siteLoginKey: "", pagesLoginKey: "", pageLoginKey: "", realmLoginKey: "" };

  const ns = useNamespace();

  const siteLoginKey = ns.storageKey("private", "site", window.location.hostname);
  const pagesLoginKey = ns.storageKey("private", "pages", window.location.hostname);
  const pageLoginKey = ns.storageKey("private", "page", window.location.hostname);
  const realmLoginKey = ns.storageKey("private", "realm", window.location.hostname);

  return { siteLoginKey, pagesLoginKey, pageLoginKey, realmLoginKey };
};

// 跳转到登录页时 url 可携带的参数
export const loginUrlKeyMap = {
  realm: "realm",
  toPath: "toPath",
  verifyMode: "verifyMode",
};

// 支持的认证级别
export const verifyModeMap = {
  site: "site",
  pages: "pages",
  page: "page",
  realm: "realm",
};

// 私密认证配置的默认值，重置用到
export const defaultPrivateConfig: Private = {
  enabled: false,
  expire: "1d",
  session: false,
  siteLogin: false,
  site: [],
  pages: [],
  realm: {},
};

export type LoginForm = {
  [key in "username" | "password" | "verifyCode"]: LoginFormItem;
};

export interface LoginFormItem {
  model: string;
  focusModel: boolean;
  errorModel: boolean;
  icon: TkIconProps["icon"];
  placeholder: string;
  type: string;
  append?: Component;
  appendModel?: string | Ref<string>;
}
