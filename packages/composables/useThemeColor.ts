import { useData } from "vitepress";
import { getLightColor, getDarkColor, isClient, isFunction } from "@teek/helper";
import { computed, MaybeRef, shallowRef, toValue, watch } from "vue";

const vpIndigo1 = "--vp-c-indigo-1";
const vpIndigo2 = "--vp-c-indigo-2";
const vpIndigo3 = "--vp-c-indigo-3";
const vpIndigoSoft = "--vp-c-indigo-soft";
const vpBg = "--vp-c-bg";
const vpBgAlt = "--vp-c-bg-alt";
const vpBgSoft = "--vp-c-bg-soft";
const vpBgElv = "--vp-c-bg-elv";
const vpText1 = "--vp-c-text-1";
const vpText2 = "--vp-c-text-2";
const vpText3 = "--vp-c-text-3";

const tkBgColorElm = "--tk-bg-color-elm";
const tkBgColorMute = "--tk-bg-color-mute";

export const varNameList = {
  vpIndigo1,
  vpIndigo2,
  vpIndigo3,
  vpIndigoSoft,
  vpBg,
  vpBgAlt,
  vpBgSoft,
  vpBgElv,
  vpText1,
  vpText2,
  vpText3,
  tkBgColorElm,
  tkBgColorMute,
};

/**
 * 根据 color 计算其他 var 变量需要的颜色，并直接覆盖这些 var 变量的颜色
 *
 * @param color 主题色
 * @param ignoreList 无视的 var 变量，在覆盖颜色时可以指定哪些 var 变量不覆盖
 *
 * @returnParam start 开启计算逻辑（第一次已自动调用）
 * @returnParam stop 还原 var 变量本身的颜色，并取消 dark 的监听
 * @returnParam update 手动根据 color 再次计算并更新 var 变量
 * @returnParam clear 还原所有 var 变量
 */
export const useThemeColor = (color: MaybeRef<string>, ignoreList?: string[] | (() => string[] | undefined)) => {
  const { isDark } = useData();

  const ignoreListConst = isFunction(ignoreList) ? ignoreList() : ignoreList || [];

  const setStyleVar = (key: string, value: string) => {
    if (!isClient) return;
    document.documentElement.style.setProperty(key, value);
  };

  const removeStyleVar = (key: string) => {
    if (!isClient) return;
    document.documentElement.style.removeProperty(key);
  };

  // 主题色
  const colorComputed = computed(() => toValue(color));

  const clear = () => {
    Object.values(varNameList).forEach(key => {
      removeStyleVar(key);
    });
  };

  /**
   * 计算浅色模式的颜色
   */
  const switchLight = () => {
    if (!isClient) return;
    const primary = colorComputed.value;
    if (!primary) return;

    const lightVarMap = {
      [vpIndigo1]: primary,
      [vpIndigo2]: getLightColor(primary, 0.1)!,
      [vpIndigo3]: getLightColor(primary, 0.2)!,
      [vpIndigoSoft]: getLightColor(primary, 0.85)!,

      [vpBg]: getLightColor(primary, 0.96)!,
      [vpBgAlt]: getLightColor(primary, 0.93)!,
      [vpBgElv]: getLightColor(primary, 0.945)!,
      [vpBgSoft]: getLightColor(primary, 0.93)!,

      [vpText1]: getDarkColor(primary, 0.6)!,
      [vpText2]: getDarkColor(primary, 0.7)!,
      [vpText3]: getLightColor(primary, 0.6)!,

      [tkBgColorElm]: getLightColor(primary, 0.945)!,
      [tkBgColorMute]: getLightColor(primary, 0.91)!,
    };

    Object.keys(lightVarMap).forEach(key => {
      if (ignoreListConst?.includes(key)) return;
      setStyleVar(key, lightVarMap[key]);
    });
  };

  /**
   * 计算深色模式的颜色
   */
  const switchDark = () => {
    if (!isClient) return;
    const primary = colorComputed.value;
    if (!primary) return;

    const darkVarMap = {
      [vpIndigo1]: primary,
      [vpIndigo2]: getDarkColor(primary, 0.1)!,
      [vpIndigo3]: getDarkColor(primary, 0.2)!,
      [vpIndigoSoft]: getDarkColor(primary, 0.85)!,

      [vpBg]: getDarkColor(primary, 0.92)!,
      [vpBgAlt]: getDarkColor(primary, 0.94)!,
      [vpBgElv]: getDarkColor(primary, 0.92)!,
      [vpBgSoft]: getDarkColor(primary, 0.94)!,

      [vpText1]: getLightColor(primary, 0.9)!,

      [tkBgColorElm]: getDarkColor(primary, 0.92)!,
      [tkBgColorMute]: getDarkColor(primary, 0.91)!,
    };

    Object.keys(darkVarMap).forEach(key => {
      if (ignoreListConst?.includes(key)) return;
      setStyleVar(key, darkVarMap[key]);
    });
  };

  const isStop = shallowRef(false);
  let stopWatch: ReturnType<typeof watch> | null = null;

  const update = () => {
    if (isStop.value) return;
    clear();

    if (isDark.value) switchDark();
    else switchLight();
  };

  const start = () => {
    if (!isStop.value || !!stopWatch) return;
    isStop.value = false;

    update();

    stopWatch = watch(isDark, update, { flush: "post" });
  };

  const stop = () => {
    stopWatch?.();
    stopWatch = null;
    isStop.value = true;
    clear();
  };

  start();

  // 主题色变化时，重新计算颜色
  watch(colorComputed, update);

  return { start, stop, update, clear };
};
