/**
 * hex 颜色转 rgb 颜色
 *
 * @param str 颜色值字符串
 */
export const hexToRgb = (str: any) => {
  let hex: any = "";
  const reg = /^\#?[0-9A-Fa-f]{6}$/;

  if (!reg.test(str)) return console.error("[Teek Error] 输入错误的 hex");

  str = str.replace("#", "");
  hex = str.match(/../g);
  for (let i = 0; i < 3; i++) hex[i] = parseInt(hex[i], 16);

  return hex;
};

/**
 * rgb 颜色转 Hex 颜色
 *
 * @param r 代表红色
 * @param g 代表绿色
 * @param b 代表蓝色
 */
export const rgbToHex = (r: any, g: any, b: any) => {
  const reg = /^\d{1,3}$/;

  if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return console.error("[Teek Error] 输入错误的 rgb 颜色值");

  const hex = [r.toString(16), g.toString(16), b.toString(16)];
  for (let i = 0; i < 3; i++) if (hex[i].length === 1) hex[i] = `0${hex[i]}`;

  return `#${hex.join("")}`;
};

/**
 * 加深颜色值
 *
 * @param color 颜色值字符串
 * @param level 加深的程度，限 0-1 之间
 */
export const getDarkColor = (color: string, level: number) => {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;

  if (!reg.test(color)) return console.error("[Teek Error] 输入错误的 hex 颜色值");

  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));

  return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

/**
 * 变浅颜色值
 *
 * @param color 颜色值字符串
 * @param level 加深的程度，限 0-1 之间
 */
export const getLightColor = (color: string, level: number) => {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;

  if (!reg.test(color)) return console.error("[Teek Error] 输入错误的 hex 颜色值");

  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));

  return rgbToHex(rgb[0], rgb[1], rgb[2]);
};
