import { ref } from "vue";
import { isClient } from "@teek/helper";
import { useScopeDispose } from "./useScopeDispose";

export interface BusuanziData {
  site_pv: number;
  page_pv: number;
  site_uv: number;
}

const callBsz = (url = "//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback"): Promise<BusuanziData> => {
  const jsonpCallback = "BusuanziCallback_" + Math.floor(1099511627776 * Math.random());
  url = url.replace("=BusuanziCallback", "=" + jsonpCallback);

  const scriptDom = document.createElement("script") as HTMLScriptElement;
  scriptDom.type = "text/javascript";
  scriptDom.defer = true;
  scriptDom.src = url;
  document.body.appendChild(scriptDom);

  let response: BusuanziData;

  (window as any)[jsonpCallback] = (data: BusuanziData) => (response = data);

  return new Promise((resolve, reject) => {
    scriptDom.onload = () => {
      resolve(response);
      setTimeout(() => {
        document.body.removeChild(scriptDom);
      }, 10);
    };
    scriptDom.onerror = () => reject("Error Loading " + url);
  });
};

export interface UseBuSuanZiOptions {
  /**
   * 不蒜子统计接口地址
   */
  url?: string;
  /**
   * 如果请求不蒜子接口失败，是否重试，类型 boolean
   *
   * @default false
   */
  tryRequest?: boolean;
  /**
   * 重试次数，仅当 tryRequest 为 true 时有效
   *
   * @default 5
   */
  tryCount?: number;
  /**
   * 重试间隔时间，单位毫秒，仅当 tryRequest 为 true 时有效
   *
   * @default 2000
   */
  tryIterationTime?: number;
}

/**
 * 使用不蒜子统计网站访问量
 *
 * @param immediate 是否初始化请求，即自动执行一次 request
 * @param options 配置项
 */
export const useBuSuanZi = (immediate = false, options: UseBuSuanZiOptions = {}) => {
  const { url, tryRequest = false, tryCount = 5, tryIterationTime = 2000 } = options;
  const sitePv = ref(0);
  const siteUv = ref(0);
  const pagePv = ref(0);
  const isGet = ref<boolean | null>(null);

  const request = () => {
    if (!isClient) return;
    // 防止重复调用
    if (isGet.value === false) return;
    isGet.value = false;

    // 调用不蒜子接口
    callBsz(url).then(data => {
      sitePv.value = data.site_pv || 9999;
      siteUv.value = data.site_uv || 9999;
      pagePv.value = data.page_pv || 9999;
      isGet.value = true;
    });
  };

  // 第一次调用
  if (immediate) request();

  if (tryRequest) {
    let i = 0;

    const clearTimer = (timer: ReturnType<typeof setInterval> | null) => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    // 重试
    const timer = setInterval(() => {
      if (isGet.value) return clearTimer(timer);

      request();

      i += tryIterationTime;
      if (i > tryIterationTime * tryCount) clearTimer(timer);
    }, tryIterationTime);

    useScopeDispose(() => clearTimer(timer));
  }

  return { sitePv, siteUv, pagePv, isGet, request };
};

export type UseBuSuanZiReturn = ReturnType<typeof useBuSuanZi>;
