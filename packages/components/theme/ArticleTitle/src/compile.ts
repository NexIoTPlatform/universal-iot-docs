import * as Vue from "vue";
import { defineComponent } from "vue";
import { compile } from "@vue/compiler-dom";

/**
 * 动态根据 template 字符串创建组件
 *
 * v-html 仅支持渲染原生 HTML，不支持渲染组件，该方法支持渲染组件，前提是组件已经全局注册，如 '<span>文章页</span> <Badge type="tip" text="v1.2.0" />'
 */
export const createDynamicComponent = (template: string) => {
  const { code } = compile(template);
  const render = new Function("Vue", code)(Vue);

  return defineComponent({ render });
};
