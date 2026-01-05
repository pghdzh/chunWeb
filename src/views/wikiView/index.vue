<template>
  <div class="camellia-wiki">
    <!-- 动态背景系统 -->
    <canvas ref="canvasEl" class="petal-canvas"></canvas>
    <div class="bg-gradient-overlay"></div>

    <!-- 背景轮播 -->
    <div class="bg-carousel">
      <img
        v-for="(src, idx) in randomFive"
        :key="idx"
        :src="src"
        class="carousel-img"
        :class="{ active: idx === currentIndex }"
      />
      <div class="carousel-overlay"></div>
    </div>

    <!-- 主容器 -->
    <div class="wiki-container">
      <!-- 头部区域 -->
      <header class="wiki-header">
        <div class="header-content">
          <div class="title-group">
            <h1 class="main-title">
              <span class="title-charm">命定之种</span>
              <span class="title-divider">·</span>
              <span class="title-main">椿 文本共享</span>
            </h1>
            <p class="subtitle">于此，凝听世界的血色注脚</p>
          </div>

          <div class="header-actions">
            <div class="search-wrapper">
              <svg
                class="search-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
              <input
                v-model="search"
                class="search-input"
                placeholder="搜索标题或标签..."
                @focus="onSearchFocus"
                @blur="onSearchBlur"
              />
            </div>

            <button class="create-btn" @click="openCreate">
              <svg class="btn-icon" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="currentColor"
                  d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                />
              </svg>
              新建词条
            </button>
          </div>
        </div>

        <div class="header-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-dot"></div>
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="wiki-content">
        <!-- 词条统计 -->
        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-value">{{ totalEntries }}</div>
            <div class="stat-label">词条总数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalLikes }}</div>
            <div class="stat-label">累计点赞</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ activeUsers }}</div>
            <div class="stat-label">活跃作者</div>
          </div>
        </div>

        <!-- 词条列表 -->
        <div v-if="filteredEntries.length === 0" class="empty-state">
          <div class="empty-icon">🌸</div>
          <p class="empty-text">没有找到匹配的词条</p>
          <p class="empty-hint">试试不同的关键词，或创建新词条</p>
        </div>

        <div v-else class="entries-grid">
          <div
            v-for="entry in filteredEntries"
            :key="entry.id"
            class="entry-card"
            @click="openDetail(entry)"
          >
            <div class="card-header">
              <div class="entry-tag">{{ entry.slug || "未分类" }}</div>
              <div class="entry-meta">
                <span class="meta-item">{{ formatTime(entry.updatedAt) }}</span>
              </div>
            </div>

            <div class="card-body">
              <h3 class="entry-title">{{ entry.title }}</h3>
              <p class="entry-preview">
                {{ truncateText(entry.content, 100) }}
              </p>
            </div>

            <div class="card-footer">
              <div class="author-info">
                <span class="author-avatar">🌸</span>
                <span class="author-name">{{ entry.author || "匿名" }}</span>
              </div>

              <div class="entry-actions">
                <button
                  class="like-btn"
                  :class="{ liked: isLiked(entry.id) }"
                  @click.stop="toggleLike(entry.id)"
                >
                  <svg
                    :class="['like-icon', { liked: isLiked(entry.id) }]"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path
                      v-if="isLiked(entry.id)"
                      fill="currentColor"
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                    <path
                      v-else
                      fill="currentColor"
                      d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                    />
                  </svg>
                  <span class="like-count">{{ entry.likes || 0 }}</span>
                </button>

                <div v-if="canEdit(entry.id)" class="edit-actions" @click.stop>
                  <button class="edit-btn" @click="openEdit(entry)">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path
                        fill="currentColor"
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </button>
                  <button class="delete-btn" @click="remove(entry.id)">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path
                        fill="currentColor"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="card-glow"></div>
          </div>
        </div>
      </main>
    </div>

    <!-- 创建/编辑模态框 -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ editing ? "编辑词条" : "新建词条" }}
            </h2>
            <button class="close-btn" @click="closeModal">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </button>
          </div>

          <div class="modal-content">
            <div class="form-group">
              <label class="form-label">标题</label>
              <input
                v-model="form.title"
                class="form-input"
                placeholder="输入词条标题..."
              />
            </div>

            <div class="form-group">
              <label class="form-label">标签</label>
              <input
                v-model="form.slug"
                class="form-input"
                placeholder="例如：彩蛋、考据、点位..."
              />
            </div>

            <div class="form-group">
              <label class="form-label">作者</label>
              <input
                v-model="form.author"
                class="form-input"
                placeholder="作者昵称（可选）"
              />
            </div>

            <div class="form-group">
              <label class="form-label">内容</label>
              <textarea
                v-model="form.content"
                class="form-textarea"
                rows="8"
                placeholder="在这里详细描述你的发现..."
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">取消</button>
            <button
              class="btn btn-primary"
              :disabled="!canSubmit"
              @click="submit"
            >
              {{ editing ? "保存更改" : "创建词条" }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 详情模态框 -->
    <transition name="modal-fade">
      <div
        v-if="detailEntry"
        class="modal-overlay"
        @click.self="detailEntry = null"
      >
        <div class="detail-modal">
          <div class="detail-header">
            <div class="detail-tag">{{ detailEntry.slug || "未分类" }}</div>
            <button class="close-btn" @click="detailEntry = null">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </button>
          </div>

          <div class="detail-content">
            <h2 class="detail-title">{{ detailEntry.title }}</h2>
            <div class="detail-meta">
              <span class="meta-author">
                <span class="meta-icon">🌸</span>
                {{ detailEntry.author || "匿名" }}
              </span>
              <span class="meta-date">
                <span class="meta-icon">📅</span>
                {{ formatTime(detailEntry.updatedAt) }}
              </span>
            </div>

            <div class="detail-body">
              {{ detailEntry.content }}
            </div>
          </div>

          <div class="detail-footer">
            <div class="detail-likes">
              <button
                class="detail-like-btn"
                :class="{ liked: isLiked(detailEntry.id) }"
                @click="toggleLike(detailEntry.id)"
              >
                <svg
                  :class="[
                    'detail-like-icon',
                    { liked: isLiked(detailEntry.id) },
                  ]"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                >
                  <path
                    v-if="isLiked(detailEntry.id)"
                    fill="currentColor"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                  <path
                    v-else
                    fill="currentColor"
                    d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                  />
                </svg>
                <span class="detail-like-count">{{
                  detailEntry.likes || 0
                }}</span>
              </button>
            </div>

            <div v-if="canEdit(detailEntry.id)" class="detail-actions">
              <button class="detail-edit-btn" @click="openEdit(detailEntry)">
                编辑
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import {
  getWikiList,
  createWiki,
  updateWiki,
  deleteWiki,
  likeWiki,
} from "@/api/modules/wiki";

// 颜色变量
const camelliaColors = {
  white: "#f8f5f2",
  cream: "#fff5f0",
  red: "#d32f2f",
  darkRed: "#8b0000",
  lightRed: "#ff6b6b",
  bloodCrimson: "#c62828",
  deepShadow: "#1a0f0f",
  veinPurple: "#6a1b9a",
  goldGlow: "#ffd54f",
  dangerGlow: "#ff1a1a",
};

// 本地存储键
const LS_MY_WIKI_IDS = "yuzuriha:wiki:my_ids";
const LS_LIKED_IDS = "yuzuriha:wiki:liked_ids";

// 数据状态
const entries = ref<any[]>([]);
const myWikiIds = ref<string[]>(
  JSON.parse(localStorage.getItem(LS_MY_WIKI_IDS) || "[]")
);
const likedIds = ref<string[]>(
  JSON.parse(localStorage.getItem(LS_LIKED_IDS) || "[]")
);

// UI状态
const showModal = ref(false);
const editing = ref(false);
const editingId = ref<string | number | null>(null);
const detailEntry = ref<any>(null);
const search = ref("");
const isSearchFocused = ref(false);

// 表单数据
const form = reactive({
  title: "",
  slug: "",
  author: "",
  content: "",
});

// Canvas粒子系统
const canvasEl = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number | null = null;
let particles: Array<{
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
}> = [];

// 背景轮播
const pcModules = import.meta.glob("@/assets/images1/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const mobileModules = import.meta.glob(
  "@/assets/images2/*.{jpg,png,jpeg,webp}",
  { eager: true }
);
const pcSrcs: string[] = Object.values(pcModules).map((m: any) => m.default);
const mobileSrcs: string[] = Object.values(mobileModules).map(
  (m: any) => m.default
);

const randomFive = ref<string[]>([]);
const currentIndex = ref(0);
let carouselTimer: number;

// 计算属性
const totalEntries = computed(() => entries.value.length);
const totalLikes = computed(() =>
  entries.value.reduce((sum, entry) => sum + (entry.likes || 0), 0)
);
const activeUsers = computed(() => {
  const authors = new Set(entries.value.map((e) => e.author).filter(Boolean));
  return authors.size;
});

const filteredEntries = computed(() => {
  const query = search.value.toLowerCase().trim();
  if (!query) return entries.value;

  return entries.value
    .filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.slug?.toLowerCase().includes(query) ||
        entry.author?.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query)
    )
    .sort((a, b) => (b.likes || 0) - (a.likes || 0));
});

const canSubmit = computed(() => form.title.trim() && form.content.trim());

// 方法
const markAsMine = (id: string | number) => {
  if (!myWikiIds.value.includes(String(id))) {
    myWikiIds.value.push(String(id));
    localStorage.setItem(LS_MY_WIKI_IDS, JSON.stringify(myWikiIds.value));
  }
};

const canEdit = (id: string | number) => myWikiIds.value.includes(String(id));

const isLiked = (id: string | number) => likedIds.value.includes(String(id));

const persistLikedIds = () => {
  localStorage.setItem(LS_LIKED_IDS, JSON.stringify(likedIds.value));
};

const formatTime = (timestamp: string | number | null | undefined) => {
  if (!timestamp) return "未知时间";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "未知时间";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// 数据操作
const loadEntries = async () => {
  try {
    const res: any = await getWikiList();
    entries.value = res.data.map((e: any) => ({
      ...e,
      createdAt: e.createdAt || e.created_at,
      updatedAt: e.updatedAt || e.updated_at,
    }));
  } catch (err) {
    console.error(err);
    ElMessage.error("加载词条失败");
  }
};
const openDetail = (entry) => {
  detailEntry.value = entry;
};
const openCreate = () => {
  editing.value = false;
  editingId.value = null;
  Object.assign(form, {
    title: "",
    slug: "",
    author: "",
    content: "",
  });
  showModal.value = true;
};

const openEdit = (entry: any) => {
  if (!canEdit(entry.id)) {
    ElMessage.warning("只有创建者可以编辑");
    return;
  }
  editing.value = true;
  editingId.value = entry.id;
  Object.assign(form, {
    title: entry.title,
    slug: entry.slug || "",
    author: entry.author || "",
    content: entry.content,
  });
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submit = async () => {
  if (!canSubmit.value) {
    ElMessage.warning("请填写标题和内容");
    return;
  }

  const payload = {
    title: form.title.trim(),
    author: form.author.trim() || "匿名",
    content: form.content.trim(),
    slug: form.slug.trim() || null,
  };

  try {
    if (editing.value && editingId.value) {
      await updateWiki(editingId.value, payload);
      ElMessage.success("编辑成功");
    } else {
      const res: any = await createWiki(payload);
      markAsMine(res.data.id);
      ElMessage.success("创建成功");
    }

    closeModal();
    loadEntries();
  } catch (err) {
    console.error(err);
    ElMessage.error("提交失败");
  }
};

const remove = async (id: string | number) => {
  if (!canEdit(id)) {
    ElMessage.warning("只有创建者可以删除");
    return;
  }

  if (!confirm("确认删除该词条？此操作不可撤销")) return;

  try {
    await deleteWiki(id);
    const index = myWikiIds.value.indexOf(String(id));
    if (index !== -1) myWikiIds.value.splice(index, 1);
    localStorage.setItem(LS_MY_WIKI_IDS, JSON.stringify(myWikiIds.value));

    if (detailEntry.value?.id === id) {
      detailEntry.value = null;
    }

    ElMessage.success("删除成功");
    loadEntries();
  } catch (err) {
    console.error(err);
    ElMessage.error("删除失败");
  }
};

const toggleLike = async (id: string | number) => {
  const entry = entries.value.find((e) => e.id === id);
  if (!entry) return;

  const idStr = String(id);
  const wasLiked = likedIds.value.includes(idStr);

  // 乐观更新
  if (wasLiked) {
    entry.likes = Math.max(0, (entry.likes || 0) - 1);
    likedIds.value = likedIds.value.filter((x) => x !== idStr);
  } else {
    entry.likes = (entry.likes || 0) + 1;
    likedIds.value.push(idStr);
  }

  if (detailEntry.value?.id === id) {
    detailEntry.value.likes = entry.likes;
  }

  persistLikedIds();

  try {
    const action = wasLiked ? "unlike" : "like";
    await likeWiki(id, action);
  } catch (err) {
    console.error("点赞失败", err);
    // 回滚
    if (wasLiked) {
      entry.likes = (entry.likes || 0) + 1;
      likedIds.value.push(idStr);
    } else {
      entry.likes = Math.max(0, (entry.likes || 0) - 1);
      likedIds.value = likedIds.value.filter((x) => x !== idStr);
    }
    persistLikedIds();
    ElMessage.error("操作失败，请重试");
  }
};

// Canvas粒子动画
const initCanvas = () => {
  const canvas = canvasEl.value;
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx?.scale(dpr, dpr);

  // 创建粒子
  particles = [];
  const particleCount = Math.min(30, Math.floor(rect.width / 25));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: Math.random() > 0.5 ? camelliaColors.lightRed : camelliaColors.red,
      alpha: Math.random() * 0.3 + 0.1,
    });
  }

  animateParticles();
};

const animateParticles = () => {
  if (!ctx || !canvasEl.value) return;

  const canvas = canvasEl.value;
  const rect = canvas.getBoundingClientRect();

  // 清除画布
  ctx.clearRect(0, 0, rect.width, rect.height);

  // 更新和绘制粒子
  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // 边界检查
    if (particle.x < 0 || particle.x > rect.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > rect.height) particle.speedY *= -1;

    // 绘制粒子
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.alpha;
    ctx.fill();
  });

  animationFrameId = requestAnimationFrame(animateParticles);
};

// 背景轮播
const pickImages = () => {
  const isMobile = window.innerWidth < 768;
  const all = isMobile ? mobileSrcs : pcSrcs;
  randomFive.value = shuffle(all).slice(0, 5);
};

const shuffle = <T>(arr: T[]): T[] => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 搜索相关
const onSearchFocus = () => {
  isSearchFocused.value = true;
};

const onSearchBlur = () => {
  isSearchFocused.value = false;
};

// 生命周期
onMounted(() => {
  loadEntries();
  pickImages();

  // 初始化Canvas
  setTimeout(initCanvas, 100);
  window.addEventListener("resize", initCanvas);

  // 轮播定时器
  carouselTimer = setInterval(() => {
    if (randomFive.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % randomFive.value.length;
    }
  }, 5000);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (carouselTimer) {
    clearInterval(carouselTimer);
  }
  window.removeEventListener("resize", initCanvas);
});
</script>

<style scoped lang="scss">
// 椿主题色变量
$camellia-white: #f8f5f2;
$camellia-cream: #fff5f0;
$camellia-red: #d32f2f;
$camellia-dark-red: #8b0000;
$camellia-light-red: #ff6b6b;
$blood-crimson: #c62828;
$deep-shadow: #1a0f0f;
$vein-purple: #6a1b9a;
$gold-glow: #ffd54f;
$danger-glow: #ff1a1a;

.camellia-wiki {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(
    135deg,
    $deep-shadow 0%,
    rgba($deep-shadow, 5%) 50%,
    $deep-shadow 100%
  );
  color: $camellia-white;
  font-family: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", system-ui,
    sans-serif;
  padding-top: 80px;
}

// 背景层
.petal-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.bg-gradient-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 30%,
      rgba($camellia-red, 0.15) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba($vein-purple, 0.1) 0%,
      transparent 40%
    ),
    linear-gradient(
      to bottom,
      rgba($deep-shadow, 0.9) 0%,
      rgba($deep-shadow, 0.7) 100%
    );
  z-index: 2;
}

.bg-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  .carousel-img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1.2s ease-in-out;
    filter: blur(8px) brightness(0.4) saturate(1.2) sepia(0.2)
      hue-rotate(330deg);

    &.active {
      opacity: 0.3;
    }
  }

  .carousel-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba($deep-shadow, 0.7) 0%,
      rgba($deep-shadow, 0.4) 50%,
      rgba($deep-shadow, 0.7) 100%
    );
  }
}

// 主容器
.wiki-container {
  position: relative;
  z-index: 3;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;

  @media (max-width: 768px) {
    padding: 16px;
  }
}

// 头部区域
.wiki-header {
  background: linear-gradient(
    135deg,
    rgba($deep-shadow, 0.8) 0%,
    rgba(rgba($deep-shadow, 2%), 0.9) 100%
  );
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid rgba($camellia-red, 0.1);
  box-shadow: 0 8px 32px rgba($camellia-red, 0.08),
    inset 0 1px 0 rgba($camellia-white, 0.05);

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: 20px;
    }
  }

  .title-group {
    flex: 1;

    .main-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.2;

      @media (max-width: 768px) {
        font-size: 24px;
        flex-wrap: wrap;
      }

      .title-charm {
        background: linear-gradient(
          135deg,
          $camellia-cream,
          $camellia-light-red
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .title-divider {
        color: $camellia-red;
        opacity: 0.6;
      }

      .title-main {
        color: $camellia-white;
      }
    }

    .subtitle {
      margin: 0;
      color: rgba($camellia-light-red, 0.8);
      font-size: 14px;
      font-weight: 300;
      letter-spacing: 0.5px;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    min-width: 200px;

    @media (max-width: 768px) {
      min-width: 0;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: $camellia-light-red;
      opacity: 0.6;
    }

    .search-input {
      width: 100%;
      padding: 12px 12px 12px 40px;
      background: rgba($deep-shadow, 0.6);
      border: 1px solid rgba($camellia-red, 0.15);
      border-radius: 12px;
      color: $camellia-white;
      font-size: 14px;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: $camellia-light-red;
        box-shadow: 0 0 0 3px rgba($camellia-red, 0.1);
      }

      &::placeholder {
        color: rgba($camellia-white, 0.4);
      }
    }
  }

  .create-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: linear-gradient(135deg, $camellia-red, $blood-crimson);
    color: $camellia-white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($camellia-red, 0.3),
        0 0 0 1px rgba($camellia-white, 0.1);
    }

    &:active {
      transform: translateY(0);
    }

    .btn-icon {
      flex-shrink: 0;
    }
  }

  .header-decoration {
    position: relative;
    height: 2px;
    margin-top: 20px;

    .decoration-line {
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($camellia-red, 0.3),
        transparent
      );
    }

    .decoration-dot {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: $camellia-red;
      border-radius: 50%;
      box-shadow: 0 0 12px $camellia-red;
    }
  }
}

// 统计区域
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  .stat-card {
    background: rgba($deep-shadow, 0.6);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    border: 1px solid rgba($camellia-red, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: rgba($camellia-red, 0.2);
      box-shadow: 0 8px 24px rgba($camellia-red, 0.1);
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(135deg, $camellia-light-red, $camellia-red);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }

    .stat-label {
      color: rgba($camellia-white, 0.7);
      font-size: 14px;
    }
  }
}

// 词条列表
.entries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.entry-card {
  background: linear-gradient(
    135deg,
    rgba($deep-shadow, 0.8) 0%,
    rgba(rgba($deep-shadow, 3%), 0.9) 100%
  );
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba($camellia-red, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba($camellia-red, 0.3);
    box-shadow: 0 12px 32px rgba($camellia-red, 0.15),
      inset 0 1px 0 rgba($camellia-white, 0.05);

    .card-glow {
      opacity: 0.3;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .entry-tag {
      padding: 4px 12px;
      background: rgba($camellia-red, 0.1);
      border: 1px solid rgba($camellia-red, 0.2);
      border-radius: 20px;
      color: $camellia-light-red;
      font-size: 12px;
      font-weight: 500;
    }

    .entry-meta {
      .meta-item {
        color: rgba($camellia-white, 0.5);
        font-size: 12px;
      }
    }
  }

  .card-body {
    margin-bottom: 20px;

    .entry-title {
      margin: 0 0 12px 0;
      font-size: 18px;
      font-weight: 600;
      color: $camellia-white;
      line-height: 1.4;
    }

    .entry-preview {
      margin: 0;
      color: rgba($camellia-white, 0.7);
      font-size: 14px;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid rgba($camellia-red, 0.1);

    .author-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .author-avatar {
        width: 24px;
        height: 24px;
        background: rgba($camellia-red, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }

      .author-name {
        color: rgba($camellia-white, 0.8);
        font-size: 13px;
      }
    }

    .entry-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .like-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: rgba($camellia-red, 0.1);
        border: 1px solid rgba($camellia-red, 0.2);
        border-radius: 20px;
        color: rgba($camellia-white, 0.8);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba($camellia-red, 0.2);
        }

        &.liked {
          background: rgba($camellia-red, 0.3);
          color: $camellia-light-red;

          .like-icon {
            color: $camellia-light-red;
          }
        }

        .like-icon {
          color: rgba($camellia-white, 0.6);
          transition: color 0.2s ease;
        }

        .like-count {
          font-weight: 500;
        }
      }

      .edit-actions {
        display: flex;
        gap: 4px;

        .edit-btn,
        .delete-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba($camellia-white, 0.05);
          border: 1px solid rgba($camellia-white, 0.1);
          border-radius: 8px;
          color: rgba($camellia-white, 0.6);
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: rgba($camellia-white, 0.1);
            color: $camellia-white;
          }
        }

        .delete-btn:hover {
          background: rgba($danger-glow, 0.2);
          color: $danger-glow;
          border-color: rgba($danger-glow, 0.3);
        }
      }
    }
  }

  .card-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 50% 0%,
      rgba($camellia-red, 0.1) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 80px 20px;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .empty-text {
    color: $camellia-white;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .empty-hint {
    color: rgba($camellia-white, 0.5);
    font-size: 14px;
  }
}

// 模态框
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($deep-shadow, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container,
.detail-modal {
  background: linear-gradient(
    135deg,
    rgba($deep-shadow, 0.95) 0%,
    rgba(rgba($deep-shadow, 5%), 0.98) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba($camellia-red, 0.2);
  box-shadow: 0 24px 48px rgba($camellia-red, 0.2),
    inset 0 1px 0 rgba($camellia-white, 0.05);

  .modal-header,
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid rgba($camellia-red, 0.1);

    .modal-title {
      margin: 0;
      color: $camellia-white;
      font-size: 20px;
      font-weight: 600;
    }

    .detail-tag {
      padding: 6px 16px;
      background: rgba($camellia-red, 0.15);
      border: 1px solid rgba($camellia-red, 0.3);
      border-radius: 20px;
      color: $camellia-light-red;
      font-size: 13px;
      font-weight: 500;
    }

    .close-btn {
      background: rgba($camellia-white, 0.05);
      border: 1px solid rgba($camellia-white, 0.1);
      border-radius: 10px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba($camellia-white, 0.6);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba($camellia-white, 0.1);
        color: $camellia-white;
      }
    }
  }

  .modal-content,
  .detail-content {
    padding: 24px;
  }

  .detail-title {
    margin: 0 0 16px 0;
    color: $camellia-white;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
  }

  .detail-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;

    .meta-author,
    .meta-date {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba($camellia-white, 0.6);
      font-size: 14px;

      .meta-icon {
        opacity: 0.8;
      }
    }
  }

  .detail-body {
    color: rgba($camellia-white, 0.9);
    line-height: 1.8;
    white-space: pre-wrap;
    font-size: 15px;
  }

  .form-group {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      color: rgba($camellia-white, 0.8);
      font-size: 14px;
      font-weight: 500;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 12px 16px;
      background: rgba($deep-shadow, 0.6);
      border: 1px solid rgba($camellia-red, 0.2);
      border-radius: 12px;
      color: $camellia-white;
      font-size: 14px;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: $camellia-light-red;
        box-shadow: 0 0 0 3px rgba($camellia-red, 0.1);
      }

      &::placeholder {
        color: rgba($camellia-white, 0.4);
      }
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
      line-height: 1.6;
    }
  }

  .modal-footer,
  .detail-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-top: 1px solid rgba($camellia-red, 0.1);

    .detail-likes {
      .detail-like-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: rgba($camellia-red, 0.15);
        border: 1px solid rgba($camellia-red, 0.3);
        border-radius: 12px;
        color: rgba($camellia-white, 0.8);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba($camellia-red, 0.25);
        }

        &.liked {
          background: rgba($camellia-red, 0.3);
          color: $camellia-light-red;

          .detail-like-icon {
            color: $camellia-light-red;
          }
        }

        .detail-like-icon {
          color: rgba($camellia-white, 0.6);
          transition: color 0.2s ease;
        }
      }
    }

    .detail-actions {
      .detail-edit-btn {
        padding: 10px 20px;
        background: rgba($camellia-white, 0.1);
        border: 1px solid rgba($camellia-white, 0.2);
        border-radius: 12px;
        color: $camellia-white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba($camellia-white, 0.2);
        }
      }
    }
  }

  .modal-footer {
    .btn {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;

      &-secondary {
        background: rgba($camellia-white, 0.1);
        border: 1px solid rgba($camellia-white, 0.2);
        color: $camellia-white;

        &:hover {
          background: rgba($camellia-white, 0.2);
        }
      }

      &-primary {
        background: linear-gradient(135deg, $camellia-red, $blood-crimson);
        color: $camellia-white;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba($camellia-red, 0.3);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}

// 动画
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;

  .modal-container,
  .detail-modal {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-container,
  .detail-modal {
    transform: translateY(20px) scale(0.98);
    opacity: 0;
  }
}

// 滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba($deep-shadow, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba($camellia-red, 0.4);
  border-radius: 4px;

  &:hover {
    background: rgba($camellia-red, 0.6);
  }
}
</style>