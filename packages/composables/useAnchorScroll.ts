import { reactive, watch } from "vue";
import { useData } from "vitepress";
import { useEventListener } from "@teek/composables/useEventListener";
import { isClient } from "@teek/helper";
import { useMounted } from "@teek/composables/useMounted";

/**
 * 监听浏览器滚动，当滚动到锚点，自动在 URL 后面添加锚点信息
 */
export const useAnchorScroll = () => {
  const { theme } = useData();
  // 初始化当前锚点
  const currentAnchor = reactive({ id: "", top: -1 });

  /**
   * 定义计算当前锚点的方法
   */
  const calculateCurrentAnchor = () => {
    // 获取文档页面中所有的锚点元素
    const anchors = document.querySelectorAll(".content-container .main :is(h1, h2, h3, h4, h5, h6)");

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];

      // display 为 none 的元素不参与计算，跳过
      const computedStyle = window.getComputedStyle(anchor);
      if (computedStyle.display === "none") break;

      const rect = anchor.getBoundingClientRect();
      // 如果当前锚点距离顶部最近，且距离页面顶部小于等于 150，则将其设置为当前锚点
      if (rect.top <= 150 && anchor.id !== currentAnchor.id) {
        currentAnchor.id = anchor.id;
        currentAnchor.top = rect.top;
      }
    }
  };

  /**
   * 监听 window 对象的滚动事件
   */
  useMounted(() => {
    useEventListener(window, "scroll", calculateCurrentAnchor);
  });

  /**
   * 文档更新锚点的时候更新 url 中的 hash
   */
  const startWatch = () => {
    if (theme.value.anchorScroll === false) return;

    watch(
      () => currentAnchor.id,
      val => {
        if (!isClient || !val) return;
        window.history.replaceState(history.state || null, "", `#${val}`);
      }
    );
  };

  return { startWatch };
};
