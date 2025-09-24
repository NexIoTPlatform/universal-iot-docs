import { computed, MaybeRefOrGetter, shallowRef, toValue, watchEffect } from "vue";
import { useMounted } from "./useMounted";
import { useEventListener } from "./useEventListener";

/**
 * 媒体查询
 *
 * @param query 媒体条件，如 (max-width: 768px)
 * @param match true：如果匹配成功返回 true，false：如果匹配成功返回 false
 */
export const useMediaQuery = (query: MaybeRefOrGetter<string>, match = true) => {
  const isSupported = shallowRef(false);

  useMounted(() => {
    isSupported.value = window && "matchMedia" in window && typeof window.matchMedia === "function";
  });

  const mediaQuery = shallowRef<MediaQueryList>();
  const matches = shallowRef(false);

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches;
  };

  watchEffect(() => {
    if (!isSupported.value) return;

    mediaQuery.value = window.matchMedia(toValue(query));
    matches.value = mediaQuery.value.matches;
  });

  useEventListener(mediaQuery, "change", handler, { passive: true });

  return computed(() => (match ? matches.value : !matches.value));
};
