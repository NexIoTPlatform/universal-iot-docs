import type { InjectionKey } from "vue";
import type { Language } from "@teek/locale";
import { computed, inject, isRef, ref, Ref } from "vue";
import { zhCn } from "@teek/locale";
import { get } from "@teek/helper";

export type TranslatorOption = Record<string, string | number>;
// 支持从 provide 获取语言包
export const localeContextKey: InjectionKey<Ref<Language | undefined>> = Symbol("localeContextKey");

/**
 * 国际化功能
 *
 * @param localeOverrides 自定义语言包
 */
export const useLocale = (localeOverride?: Ref<Language | undefined>) => {
  // 支持传参或者使用 provide 注入的 locale
  const locale = localeOverride || inject(localeContextKey, ref());
  // 默认语言是 zhCn
  const finalLocale = computed(() => locale?.value || zhCn);
  const lang = computed(() => finalLocale.value.lang);
  const localeRef = isRef(finalLocale) ? finalLocale : ref(finalLocale);

  const translate = (path: string, option: TranslatorOption | undefined, locale: Language) => {
    return (get(locale, path, path) as string).replace(/\{(\w+)\}/g, (_, key) => `${option?.[key] ?? `{${key}}`}`);
  };

  return {
    lang,
    locale: localeRef,
    t: (path: string, option?: TranslatorOption) => {
      return translate(path, option, finalLocale.value);
    },
    translate,
  };
};
