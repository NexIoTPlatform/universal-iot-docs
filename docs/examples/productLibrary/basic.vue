<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TkPageCard } from 'vitepress-theme-teek'
import productsData from './products.json'

// 响应式数据
const selectedCategory = ref('all')
const searchKeyword = ref('')
const showProductDetail = ref(false)
const selectedProduct = ref<any>(null)
const activeNavItem = ref('product-library')

// 计算属性
const filteredProducts = computed(() => {
  let filtered = productsData.products

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(keyword) ||
      product.model.toLowerCase().includes(keyword) ||
      product.applicationScenarios.some(scenario => scenario.toLowerCase().includes(keyword))
    )
  }

  return filtered
})

const categories = computed(() => [
  { id: 'all', name: '全部产品', icon: '📦' },
  ...productsData.categories
])

// 方法
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const searchProducts = () => {
  // 搜索逻辑已在计算属性中实现
}

// 导航到产品详情页面
const navigateToProduct = (product: any, event?: Event) => {
  // 阻止事件冒泡
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  
  // 使用模态框显示产品详情，而不是跳转新页面
  viewProductDetail(product)
}

// 查看产品详情（保留原有功能）
const viewProductDetail = (product: any) => {
  // 确保只显示一个模态框
  if (showProductDetail.value) {
    return
  }
  
  selectedProduct.value = product
  showProductDetail.value = true
}

const closeProductDetail = () => {
  showProductDetail.value = false
  selectedProduct.value = null
}

// 锚点跳转功能
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

const getBadgeClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'success': 'badge-success',
    'primary': 'badge-primary',
    'warning': 'badge-warning',
    'info': 'badge-info'
  }
  return colorMap[color] || 'badge-default'
}

const formatPrice = (price: string) => {
  return price.replace('¥', '')
}

const getProtocolColor = (protocol: string) => {
  const colorMap: Record<string, string> = {
    'RS485': 'protocol-rs485',
    'LoRa': 'protocol-lora',
    'NB-IoT': 'protocol-nbiot',
    'WiFi': 'protocol-wifi',
    'Zigbee': 'protocol-zigbee',
    '4G': 'protocol-4g'
  }
  return colorMap[protocol] || 'protocol-default'
}

const handleDropdownClick = (item: any, dropdownItem: any) => {
  console.log('Navigate to:', dropdownItem.href)
}
</script>

<template>
  <div class="product-library">
    <!-- 产品库内容 -->
    <div class="library-content">
      <div class="library-header">
        <div class="header-title">
          <h1>🏭 产品库</h1>
          <p>精选物联网设备，满足各种应用场景需求</p>
        </div>
        
        <div class="search-section">
          <div class="search-box">
            <input 
              v-model="searchKeyword" 
              @input="searchProducts"
              type="text" 
              placeholder="搜索产品名称、型号或应用场景..."
              class="search-input"
            />
            <button class="search-btn">🔍</button>
          </div>
        </div>
      </div>

    <!-- 分类筛选 -->
    <div class="category-filter">
      <div class="filter-title">产品分类</div>
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-tab', { active: selectedCategory === category.id }]"
          @click="selectCategory(category.id)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- 产品网格 -->
    <div class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
        @click="navigateToProduct(product, $event)"
        @keydown.enter="navigateToProduct(product, $event)"
        tabindex="0"
        role="button"
        :aria-label="`查看${product.name}的详细信息`"
      >
        <!-- 产品图片区域 -->
        <div class="product-image-section">
          <img :src="product.mainImage" :alt="product.name" class="product-image" />
          
          <!-- 顶部徽章 -->
          <div class="product-badges">
            <div v-if="product.badge" :class="['product-badge', getBadgeClass(product.badgeColor)]">
              {{ product.badge }}
            </div>
            <div v-if="product.isNew && !product.badge" class="new-badge">NEW</div>
          </div>

          <!-- 产品名字标签 - 放在图片上层 -->
          <div class="product-name-overlay">
            {{ product.name }}
          </div>
        </div>

        <!-- 底部标签区域 - 一行显示 -->
        <div class="product-tags-section">
          <!-- 所有标签在一行显示 -->
          <div class="product-tags-row">
            <!-- 应用场景标签 - 显示2个 -->
            <span 
              v-for="scenario in product.applicationScenarios.slice(0, 2)" 
              :key="scenario"
              class="scenario-tag"
            >
              {{ scenario }}
            </span>

            <!-- 协议标签 - 显示2个 -->
            <span 
              v-for="protocol in product.communicationProtocols.slice(0, 2)" 
              :key="protocol"
              :class="['protocol-tag', getProtocolColor(protocol)]"
            >
              {{ protocol }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 产品详情弹窗 -->
    <div v-if="showProductDetail && selectedProduct" class="product-detail-modal" @click="closeProductDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedProduct.name }}</h2>
          <button class="close-btn" @click="closeProductDetail">×</button>
        </div>

        <div class="modal-body">
          <!-- 锚点导航 -->
          <div class="detail-nav">
            <a href="#" @click.prevent="scrollToSection('overview')" class="nav-link">产品概述</a>
            <a href="#" @click.prevent="scrollToSection('features')" class="nav-link">产品特点</a>
            <a href="#" @click.prevent="scrollToSection('specs')" class="nav-link">技术参数</a>
            <a href="#" @click.prevent="scrollToSection('applications')" class="nav-link">应用场景</a>
            <a href="#" @click.prevent="scrollToSection('protocols')" class="nav-link">通信协议</a>
          </div>

          <div class="detail-images">
            <div class="main-image">
              <img :src="selectedProduct.mainImage" :alt="selectedProduct.name" />
            </div>
            <div class="thumbnails">
              <img 
                v-for="(image, index) in selectedProduct.images" 
                :key="index"
                :src="image" 
                :alt="selectedProduct.name"
                class="thumbnail"
              />
            </div>
          </div>

          <div class="detail-info">
            <div class="detail-section" id="overview">
              <h3>### 产品概述</h3>
              <p>{{ selectedProduct.overview }}</p>
            </div>

            <div class="detail-section" id="features">
              <h3>### 产品特点</h3>
              <ul class="features-list">
                <li v-for="feature in selectedProduct.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>

            <div class="detail-section" id="specs">
              <h3>### 技术参数</h3>
              <div class="specs-table">
                <div v-for="(value, key) in selectedProduct.technicalSpecs" :key="key" class="spec-row">
                  <span class="spec-label">{{ key }}</span>
                  <span class="spec-value">{{ value }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section" id="applications">
              <h3>### 应用场景</h3>
              <div class="applications">
                <div v-for="app in selectedProduct.applications" :key="app.scenario" class="application-item">
                  <h4>{{ app.scenario }}</h4>
                  <p>{{ app.description }}</p>
                </div>
              </div>
            </div>

            <div class="detail-section" id="protocols">
              <h3>### 通信协议</h3>
              <div class="protocols">
                <span 
                  v-for="protocol in selectedProduct.communicationProtocols" 
                  :key="protocol"
                  :class="['protocol-tag', getProtocolColor(protocol)]"
                >
                  {{ protocol }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-library {
  padding: 0;
  max-width: 100%;
  margin: 0;
}

/* 顶部导航样式 */
.top-navigation {
  background: #1e3a8a;
  color: white;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 60px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.brand-icon {
  font-size: 1.5rem;
}

.brand-name {
  color: white;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-icon {
  font-size: 1rem;
}

.nav-text {
  font-weight: 500;
}

.nav-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-arrow {
  transform: rotate(180deg);
}

.nav-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
  border: 1px solid var(--vp-c-border);
}

.nav-item:hover .nav-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  padding: 0.75rem 1rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--vp-c-border);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.nav-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.library-content {
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.library-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.header-title p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.search-section {
  max-width: 400px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 25px;
  font-size: 0.9rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.search-btn {
  position: absolute;
  right: 0.3rem;
  padding: 0.5rem 0.8rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: var(--vp-c-brand-dark);
  transform: scale(1.05);
}

.category-filter {
  margin-bottom: 2rem;
}

.filter-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.category-tab:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.category-tab.active {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand);
  color: white;
}

.category-icon {
  font-size: 0.9rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.product-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 280px;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-card:focus {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.product-image-section {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.product-badges {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 2;
}

.product-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 600;
  color: white;
  text-align: center;
  min-width: 40px;
}

.badge-success { background: linear-gradient(135deg, #52c41a, #73d13d); }
.badge-primary { background: linear-gradient(135deg, #1890ff, #40a9ff); }
.badge-warning { background: linear-gradient(135deg, #faad14, #ffc53d); }
.badge-info { background: linear-gradient(135deg, #13c2c2, #36cfc9); }

.new-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 600;
  z-index: 2;
}

/* 产品名字叠加层 */
.product-name-overlay {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
}

/* 底部标签区域 */
.product-tags-section {
  padding: 0.75rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  justify-content: center;
  align-items: center;
}

.scenario-tag {
  padding: 0.2rem 0.5rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid var(--vp-c-border);
}



.protocol-tag {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  text-align: center;
  min-width: 50px;
}

.protocol-rs485 { background: linear-gradient(135deg, #722ed1, #9254de); }
.protocol-lora { background: linear-gradient(135deg, #13c2c2, #36cfc9); }
.protocol-nbiot { background: linear-gradient(135deg, #1890ff, #40a9ff); }
.protocol-wifi { background: linear-gradient(135deg, #52c41a, #73d13d); }
.protocol-zigbee { background: linear-gradient(135deg, #fa8c16, #ffa940); }
.protocol-4g { background: linear-gradient(135deg, #eb2f96, #f759ab); }
.protocol-default { background: linear-gradient(135deg, var(--vp-c-text-3), #d9d9d9); }


/* 产品详情弹窗样式 */
.product-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(8px);
  /* 确保只有一个模态框显示 */
  pointer-events: auto;
}

.modal-content {
  background: var(--vp-c-bg);
  border-radius: 16px;
  max-width: 1000px;
  max-height: 95vh;
  overflow-y: auto;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--vp-c-border);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.modal-header h2 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--vp-c-text-2);
  padding: 0.5rem;
}

.close-btn:hover {
  color: var(--vp-c-text-1);
}

.modal-body {
  padding: 2rem;
}

/* 锚点导航样式 */
.detail-nav {
  position: sticky;
  top: 0;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-border);
  padding: 1rem;
  margin-bottom: 1.5rem;
  z-index: 10;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-border);
}

.nav-link:hover {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand);
}

.nav-link:active {
  background: var(--vp-c-brand);
  color: white;
}

.detail-images {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.main-image {
  position: relative;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image:hover img {
  transform: scale(1.02);
}

.thumbnails {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.thumbnail {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumbnail:hover {
  border-color: var(--vp-c-brand);
  transform: scale(1.05);
}

.detail-info {
  display: grid;
  gap: 2rem;
}

.detail-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ff4d4f;
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #fff5f5, #ffe6e6);
  border-radius: 12px;
  border: 1px solid #ffccc7;
}

.detail-section {
  background: var(--vp-c-bg-soft);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
}

.detail-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--vp-c-brand);
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-section h3::before {
  content: "📋";
  font-size: 1.1rem;
}

.features-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.features-list li {
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border-left: 4px solid var(--vp-c-brand);
  position: relative;
  padding-left: 2rem;
  transition: all 0.3s ease;
}

.features-list li:hover {
  background: var(--vp-c-brand-soft);
  transform: translateX(4px);
}

.features-list li::before {
  content: "✓";
  position: absolute;
  left: 0.75rem;
  color: var(--vp-c-brand);
  font-weight: bold;
  font-size: 1.1rem;
}

.specs-table {
  display: grid;
  gap: 0.75rem;
}

.spec-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  transition: all 0.3s ease;
}

.spec-row:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.spec-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spec-label::before {
  content: "⚙️";
  font-size: 0.9rem;
}

.spec-value {
  color: var(--vp-c-text-2);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
}

.applications {
  display: grid;
  gap: 1rem;
}

.application-item {
  padding: 1.5rem;
  background: var(--vp-c-bg);
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  transition: all 0.3s ease;
}

.application-item:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.application-item h4 {
  margin: 0 0 0.75rem 0;
  color: var(--vp-c-text-1);
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.application-item h4::before {
  content: "🎯";
  font-size: 1rem;
}

.application-item p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.protocols {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.protocols .protocol-tag {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  min-width: 80px;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--vp-c-border);
  justify-content: flex-end;
}

.btn-primary, .btn-secondary, .btn-outline {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--vp-c-brand);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--vp-c-brand-dark);
}

.btn-secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
}

.btn-secondary:hover {
  background: var(--vp-c-bg);
}

.btn-outline {
  background: transparent;
  color: var(--vp-c-brand);
  border: 1px solid var(--vp-c-brand);
}

.btn-outline:hover {
  background: var(--vp-c-brand);
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    height: 50px;
  }
  
  .nav-brand {
    font-size: 1rem;
  }
  
  .nav-menu {
    display: none; /* 移动端隐藏导航菜单，可以添加汉堡菜单 */
  }
  
  .nav-actions {
    gap: 0.25rem;
  }
  
  .nav-action-btn {
    padding: 0.4rem;
    font-size: 0.9rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .category-tabs {
    justify-content: center;
  }
  
  .detail-images {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 1024px) {
  .nav-menu {
    gap: 0.25rem;
  }
  
  .nav-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
  
  .nav-text {
    display: none; /* 平板端只显示图标 */
  }
}
</style>
