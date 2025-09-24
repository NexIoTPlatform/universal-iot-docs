import type MarkdownIt from "markdown-it";
import container from "markdown-it-container";

const type = "video";

const videoPlugin = (md: MarkdownIt) => {
  md.use(container, type, {});

  md.renderer.rules[`container_${type}_open`] = (tokens, idx) => {
    const containerToken = tokens[idx];
    const info = containerToken.info.trim().slice(type.length).trim();

    const contentToken = tokens[idx + 2];
    const content = contentToken.content.trim() || "";
    const video = info ? videoMap[info] : { src: () => content, title: "Custom video player" };

    // 隐藏源内容
    contentToken.type = "";
    contentToken.tag = "";
    contentToken.hidden = true;

    return `<div class="${`${type}-container`}">
      <iframe
        class="video-iframe"
        loading="lazy"
        src="${video.src(content)}"
        title="${video.title}"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;"
        allowfullscreen="true"
      />
    `;
  };
};

const videoMap: Record<string, { src: (id: string) => string; title: string }> = {
  bilibili: {
    src: (id: string) => `https://player.bilibili.com/player.html?bvid=${id}&autoplay=0`,
    title: "Bilibili video player",
  },
  tencent: {
    src: (id: string) => `https://v.qq.com/txp/iframe/player.html?vid=${id}`,
    title: "Tencent Video player",
  },
  youku: {
    src: (id: string) => `https://player.youku.com/embed/${id}`,
    title: "Youku video player",
  },
  youtube: {
    src: (id: string) => `https://www.youtube-nocookie.com/embed/${id}`,
    title: "YouTube video player",
  },
  vimeo: {
    src: (id: string) => `https://player.vimeo.com/video/${id}`,
    title: "Vimeo video player",
  },
  xigua: {
    src: (id: string) => `https://www.ixigua.com/iframe/${id}`,
    title: "XiGua video player",
  },
};

export default videoPlugin;
