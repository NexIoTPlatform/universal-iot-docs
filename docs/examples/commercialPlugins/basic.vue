<script setup lang="ts">
import { TkPageCard } from "vitepress-theme-teek";
import { ref, computed } from "vue";

// 插件数据
const plugins = ref([
  {
    id: 'imoulife',
    title: '乐橙/ImouLife',
    icon: '🎥',
    price: '¥定价中',
    category: '协议接入',
    description: '对接乐橙/ImouLife平台，支持设备直播、点播、云台控制与回放等常见能力',
    features: [
      '设备预览',
      '云台控制(PTZ)',
      '云存储回放',
      '推流/拉流URL生成',
    ],
    scenarios: ['视频监控看板', '设备联动视频', '售后远程查看'],
    badge: '增值服务',
    badgeColor: 'warning'
  },
  {
    id: 'ctaiot-access',
    title: '天翼物联接入',
    icon: '📡',
    price: '¥定价中',
    category: '协议接入',
    description: '支持无缝接入天翼AIOT，产品管理、设备管理都统一在nexiot下',
    features: [
      '无缝天翼AIOT接入',
      '统一产品管理',
      '统一设备管理',
      'NB-IoT设备支持',
      '5G设备支持',
      '电信运营商API集成'
    ],
    scenarios: ['电信运营商合作', 'NB-IoT项目', '5G物联网应用'],
    badge: '企业必备',
    badgeColor: 'primary'
  },
  {
    id: 'tcp-direct',
    title: 'TCP直连接入',
    icon: '🔌',
    price: '¥定价中',
    category: '协议接入',
    description: '支持自定义协议、Modbus等TCP通信方式，支持SNI TLS通配符域名接入、TCP集群、无限扩展节点',
    features: [
      '自定义协议支持',
      'Modbus TCP通信',
      'SNI TLS通配符域名',
      'TCP集群部署',
      '无限扩展节点',
      '高性能并发处理',
      '赠送小程序的能力'
    ],
    scenarios: ['工业设备接入', '传感器网络', '大规模TCP设备管理'],
    badge: '企业必备',
    badgeColor: 'success'
  },
  {
    id: 'custom-protocol',
    title: '定制需求接入',
    icon: '⚙️',
    price: '按工作量评估',
    category: '协议接入',
    description: '根据您的具体业务需求，定制开发专属协议接入方案，满足特殊场景的设备连接需求',
    features: [
      '专属协议开发',
      '定制化数据解析',
      '特殊设备适配',
      '个性化功能实现',
      '专业技术支持',
      '源码交付'
    ],
    scenarios: ['特殊工业设备', '私有协议接入', '定制化解决方案', '企业专属需求'],
    badge: '定制',
    badgeColor: 'info'
  }
  
]);

// 按分类分组
const pluginsByCategory = computed(() => {
  const grouped: Record<string, typeof plugins.value> = {};
  plugins.value.forEach(plugin => {
    if (!grouped[plugin.category]) {
      grouped[plugin.category] = [];
    }
    grouped[plugin.category].push(plugin);
  });
  return grouped;
});

// 获取徽章样式类
const getBadgeClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'success': 'badge-success',
    'primary': 'badge-primary', 
    'warning': 'badge-warning',
    'info': 'badge-info'
  };
  return colorMap[color] || 'badge-default';
};

// 二维码弹窗
const showWx = ref(false);
const openWx = () => (showWx.value = true);
const closeWx = () => (showWx.value = false);

// 授权版本数据
const licenses = ref([
  {
    id: 'license-standard',
    title: '商用授权',
    icon: '🧾',
    price: '¥定价中',
    description: '永久商用授权，拥有开源版本的全部功能，不限团队成员数量与部署节点。',
    features: [
      '永久授权，不限节点',
      '包含开源版全部功能',
      '允许商业使用与二次开发'
    ],
    badge: '推荐',
    badgeColor: 'success'
  },
  {
    id: 'license-out-of-box',
    title: '开箱版',
    icon: '📦',
    price: '¥定价中',
    description: '限时特价，不用折腾，直接可用。你提供服务器，我们帮忙部署和维护，开箱即用。',
    features: [
      '数据在自己手上',
      '专业部署与维护',
      '开箱即用，零配置',
      '如需源码管理可升级企业版'
    ],
    badge: '省心',
    badgeColor: 'info'
  },
  {
    id: 'license-enterprise',
    title: '企业版',
    icon: '🏢',
    price: '¥定价中',
    description: '1年商业代码仓库更新，包含平台所有功能和下方接入模块，适合中小团队与企业项目交付。',
    features: [
      '1年商业仓库更新（含优化 & Bug 修复）',
      '包含平台所有功能',
      '商业项目优先支持',
      '包含所有协议接入模块'
    ],
    badge: '企业',
    badgeColor: 'primary'
  },
  {
    id: 'license-flagship',
    title: '旗舰版',
    icon: '🚀',
    price: '¥定价中',
    description: '包含企业授权全部权限，配置独立专人维护与问题修复，适合大型企业与长期运维。',
    features: [
      '专属技术支持与问题修复',
      '项目实施与性能优化建议',
      '可定制交付方案',
      "可协助私有化部署"
    ],
    badge: '定制',
    badgeColor: 'warning'
  }
]);
</script>

<template>
  <div class="commercial-plugins">
  <!-- 授权版本模块（放到最前面） -->
  <div class="plugin-category">
      <h2>📦 授权版本</h2>
      <div class="plugin-grid">
        <TkPageCard
          v-for="item in licenses"
          :key="item.id"
          :title="item.title"
          class="plugin-card"
        >
          <template #title>
            <div class="plugin-header">
              <span class="plugin-icon">{{ item.icon }}</span>
              <span class="plugin-title">{{ item.title }}</span>
              <span :class="['plugin-badge', getBadgeClass(item.badgeColor)]">{{ item.badge }}</span>
            </div>
          </template>

          <div class="plugin-content">
            <div class="plugin-price">{{ item.price }}</div>
            <p class="plugin-description">{{ item.description }}</p>

            <div class="plugin-features">
              <h4>✨ 包含内容</h4>
              <ul>
                <li v-for="feature in item.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>

            <div class="plugin-actions">
              <button class="btn-primary" @click="openWx">点击扫码</button>
            </div>
          </div>
        </TkPageCard>
      </div>
    </div>
    <!-- 协议接入模块 -->
    <div class="plugin-category">
      <h2>🔌 协议接入模块</h2>
      <div class="plugin-grid">
        <TkPageCard 
          v-for="plugin in pluginsByCategory['协议接入']" 
          :key="plugin.id"
          :title="plugin.title"
          class="plugin-card"
        >
          <template #title>
            <div class="plugin-header">
              <span class="plugin-icon">{{ plugin.icon }}</span>
              <span class="plugin-title">{{ plugin.title }}</span>
              <span :class="['plugin-badge', getBadgeClass(plugin.badgeColor)]">
                {{ plugin.badge }}
              </span>
            </div>
          </template>
          
          <div class="plugin-content">
            <div class="plugin-price">{{ plugin.price }}</div>
            <p class="plugin-description">{{ plugin.description }}</p>
            
            <div class="plugin-features">
              <h4>✨ 核心功能</h4>
              <ul>
                <li v-for="feature in plugin.features" :key="feature">
                  {{ feature }}
                </li>
              </ul>
            </div>
            
            <div class="plugin-scenarios">
              <h4>🎯 适用场景</h4>
              <div class="scenario-tags">
                <span 
                  v-for="scenario in plugin.scenarios" 
                  :key="scenario"
                  class="scenario-tag"
                >
                  {{ scenario }}
                </span>
              </div>
            </div>
            
            <div class="plugin-actions">
              <button class="btn-primary" @click="openWx">点击扫码</button>
              <!-- <button class="btn-secondary">免费试用</button> -->
            </div>
          </div>
        </TkPageCard>
      </div>
    </div>

    <!-- 二维码弹窗（与当前页面同根） -->
    <div v-if="showWx" class="wx-modal" @click.self="closeWx">
      <div class="wx-modal__content">
        <img src="/wx.png" alt="微信二维码" />
        <p>扫码添加微信，备注：授权/咨询</p>
        <button class="wx-modal__close" @click="closeWx">关闭</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.commercial-plugins {
  margin: 1.25rem 0;
}

.plugin-category {
  margin-bottom: 2rem;
}

.plugin-category h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
  border-bottom: 2px solid var(--vp-c-brand);
  padding-bottom: 0.5rem;
}

.plugin-grid {
  display: grid;
  /* 更紧凑的间距，自动填满屏幕 */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.plugin-card {
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
}

.plugin-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
}

.plugin-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.plugin-icon {
  font-size: 1.5rem;
}

.plugin-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
}

.plugin-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.badge-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.badge-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.badge-info {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.plugin-content {
  padding: 0;
}

.plugin-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand);
  margin-bottom: 1rem;
  text-align: center;
}

.plugin-description {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.plugin-features h4,
.plugin-scenarios h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
}

.plugin-features ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.plugin-features li {
  padding: 0.5rem 0;
  color: var(--vp-c-text-2);
  position: relative;
  padding-left: 1.5rem;
}

.plugin-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--vp-c-brand);
  font-weight: bold;
}

.scenario-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.scenario-tag {
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: 16px;
  font-size: 0.85rem;
  border: 1px solid var(--vp-c-border);
}

.plugin-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--vp-c-brand), #2563eb);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--vp-c-brand);
  border: 1px solid var(--vp-c-brand);
}

.btn-secondary:hover {
  background: var(--vp-c-brand);
  color: white;
  transform: translateY(-2px);
}

/* 简易二维码弹窗 */
.wx-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.wx-modal__content {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 20px;
  width: min(90vw, 420px);
  text-align: center;
}
.wx-modal__content img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
.wx-modal__content p {
  margin: 12px 0 8px;
  color: var(--vp-c-text-2);
}
.wx-modal__close {
  margin-top: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-brand);
  background: transparent;
  color: var(--vp-c-brand);
  border-radius: 8px;
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .plugin-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .plugin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .plugin-actions {
    flex-direction: column;
  }
}
</style>
