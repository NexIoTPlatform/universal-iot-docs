import { getCurrentScope, onScopeDispose } from "vue";

/**
 * 尝试在当前作用域的注销钩子里执行一个函数，如果在 Vue 组件使用，等于 onUnmounted 生命周期
 *
 * @param fn 回调函数
 */
export const useScopeDispose = (fn: () => void) => {
  if (!getCurrentScope()) return false;

  onScopeDispose(fn);
  return true;
};
