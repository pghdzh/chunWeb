<template>
  <div class="voice-library-container">
    <!-- 背景层 -->
    <div class="background-layer">
      <div class="bg-carousel">
        <transition-group name="bg-fade" tag="div" class="bg-layer">
          <img
            v-for="(src, idx) in activeImages"
            :key="`bg-${idx}-${isMobile ? 'm' : 'd'}`"
            :src="src"
            :class="['bg-img', { active: idx === currentIndex }]"
            alt=""
          />
        </transition-group>
      </div>

      <!-- 背景装饰元素 -->
      <div class="decorations">
        <div class="decoration petal-1"></div>
        <div class="decoration petal-2"></div>
        <div class="decoration petal-3"></div>
        <div class="decoration glow-1"></div>
        <div class="decoration glow-2"></div>
      </div>
    </div>

    <!-- 主内容 -->
    <main class="main-content">
      <!-- 头部 -->
      <header class="library-header">
        <div class="header-content">
          <div class="title-section">
            <div class="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="title-group">
              <h1 class="title">
                <span class="title-text">椿 · 语音馆</span>
                <span class="title-badge"
                  >{{ unlockedCount }}/{{ TOTAL_VOICES }}</span
                >
              </h1>
              <p class="subtitle">
                收集并播放已触发的语音彩蛋，静候每一朵花开的声音
              </p>
            </div>
          </div>

          <div class="stats-section">
            <div class="stat-item">
              <div class="stat-label">已解锁</div>
              <div class="stat-value">{{ unlockedCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">未解锁</div>
              <div class="stat-value">{{ TOTAL_VOICES - unlockedCount }}</div>
            </div>
          </div>
        </div>

        <div class="header-divider"></div>
      </header>

      <!-- 语音列表 -->
      <section class="voice-list-section">
        <div class="section-header">
          <h2 class="section-title">语音收藏</h2>
          <div class="filter-controls">
            <button
              class="filter-btn"
              :class="{ active: filter === 'all' }"
              @click="filter = 'all'"
            >
              全部
            </button>
            <button
              class="filter-btn"
              :class="{ active: filter === 'unlocked' }"
              @click="filter = 'unlocked'"
            >
              已解锁
            </button>
            <button
              class="filter-btn"
              :class="{ active: filter === 'locked' }"
              @click="filter = 'locked'"
            >
              未解锁
            </button>
          </div>
        </div>

        <div class="voice-list-container">
          <div class="voice-list" ref="listContainer">
            <transition-group name="voice-item">
              <div
                v-for="id in filteredVoiceIds"
                :key="id"
                class="voice-card"
                :class="{
                  'voice-card--unlocked': isUnlocked(id),
                  'voice-card--locked': !isUnlocked(id),
                  'voice-card--playing': id === currentId,
                  'voice-card--loading': id === currentId && isPlaying,
                }"
              >
                <div class="card-content">
                  <div class="card-left">
                    <div class="voice-index">
                      <div class="index-number">
                        {{ String(id).padStart(3, "0") }}
                      </div>
                      <div class="index-label">NO.</div>
                    </div>

                    <div class="voice-info">
                      <div class="voice-title">
                        语音 {{ String(id).padStart(3, "0") }}
                      </div>
                      <div class="voice-status">
                        <span
                          class="status-badge"
                          :class="isUnlocked(id) ? 'unlocked' : 'locked'"
                        >
                          {{ isUnlocked(id) ? "已解锁" : "未解锁" }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="card-right">
                    <div class="voice-actions">
                      <button
                        class="action-btn play-btn"
                        :disabled="!isUnlocked(id)"
                        @click="playEntry(id)"
                        :title="getPlayButtonTitle(id)"
                        :class="{ active: id === currentId && isPlaying }"
                      >
                        <span class="btn-icon">
                          <svg
                            v-if="!isUnlocked(id)"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 15.59L15.59 16L12 12.41L8.41 16L8 15.59L11.59 12L8 8.41L8.41 8L12 11.59L15.59 8L16 8.41L12.41 12L16 15.59Z"
                              fill="currentColor"
                            />
                          </svg>
                          <svg
                            v-else-if="id === currentId && isPlaying"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="6"
                              y="6"
                              width="4"
                              height="12"
                              rx="1"
                              fill="currentColor"
                            />
                            <rect
                              x="14"
                              y="6"
                              width="4"
                              height="12"
                              rx="1"
                              fill="currentColor"
                            />
                          </svg>
                          <svg
                            v-else
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                          </svg>
                        </span>
                      </button>

                      <a
                        v-if="isUnlocked(id)"
                        :href="voicePath(id)"
                        :download="`voice_${id}.mp3`"
                        class="action-btn download-btn"
                        title="下载语音"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 9H15V3H9V9H5L12 16L19 9Z"
                            fill="currentColor"
                          />
                          <path d="M5 18V20H19V18H5Z" fill="currentColor" />
                        </svg>
                      </a>
                      <div v-else class="action-placeholder"></div>
                    </div>

                    <!-- 播放进度 -->
                    <div
                      class="play-progress"
                      v-if="id === currentId && isPlaying"
                    >
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          :style="{
                            width: `${
                              (currentTime / currentDuration) * 100 || 0
                            }%`,
                          }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 播放波纹效果 -->
                <div
                  class="play-wave"
                  v-if="id === currentId && isPlaying"
                ></div>
              </div>
            </transition-group>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredVoiceIds.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
                />
                <path
                  d="M11 7H13V9H11V7ZM11 11H13V17H11V11Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 class="empty-title">暂无内容</h3>
            <p class="empty-description">
              {{
                filter === "unlocked"
                  ? "你还没有解锁任何语音"
                  : filter === "locked"
                  ? "所有语音都已解锁"
                  : "语音列表为空"
              }}
            </p>
          </div>
        </div>

        <!-- 播放控制栏 -->
        <div class="player-controls" v-if="currentId">
          <div class="player-info">
            <div class="player-title">
              正在播放：语音 {{ String(currentId).padStart(3, "0") }}
            </div>
            <div class="player-time">
              {{ formatTime(currentTime) }} / {{ formatTime(currentDuration) }}
            </div>
          </div>

          <div class="player-buttons">
            <button class="player-btn" @click="playEntry(currentId)">
              <svg
                v-if="isPlaying"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="6"
                  y="6"
                  width="4"
                  height="12"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="14"
                  y="6"
                  width="4"
                  height="12"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
              </svg>
            </button>
            <button class="player-btn stop-btn" @click="stopPlayback">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="6"
                  y="6"
                  width="12"
                  height="12"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div class="player-progress">
            <input
              type="range"
              :value="(currentTime / currentDuration) * 100 || 0"
              @input="seekAudio"
              class="progress-slider"
              :disabled="!currentAudio"
            />
          </div>
        </div>
      </section>

      <!-- 页脚 -->
      <footer class="library-footer">
        <div class="footer-content">
          <div class="footer-info">
            <p>提示：点击播放按钮可收听语音，已解锁的语音支持下载</p>
            <p class="footer-note">静待花开，倾听每一段被珍藏的时光</p>
          </div>
          <div class="footer-stats">
            已解锁 <span class="highlight">{{ unlockedCount }}</span> /
            {{ TOTAL_VOICES }} 段语音
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

/* ================== 配置 ================== */
const TOTAL_VOICES = 25;
const BG_INTERVAL_MS = 5000;
const MOBILE_BREAKPOINT = 768;

/* ========== 导入图片资源 ========== */
const modules: Record<string, any> = import.meta.glob(
  "@/assets/images1/*.{jpg,png,jpeg,webp}",
  { eager: true }
);
const allSrcs: string[] = Object.values(modules).map(
  (m: any) => m.default || m
);

const modules2: Record<string, any> = import.meta.glob(
  "@/assets/images2/*.{jpg,png,jpeg,webp}",
  { eager: true }
);
const allSrcs2: string[] = Object.values(modules2).map(
  (m: any) => m.default || m
);

/* 简单洗牌函数 */
function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* 随机取 5 张 */
const randomFive = ref<string[]>(
  shuffle(allSrcs).slice(0, Math.min(5, allSrcs.length))
);
const randomFive2 = ref<string[]>(
  shuffle(allSrcs2).slice(0, Math.min(5, allSrcs2.length))
);

/* 轮播索引 */
const currentIndex = ref(0);
let imgTimer: number | null = null;

/* ========== 设备判断 ========== */
const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT);
function handleResize() {
  const nowMobile = window.innerWidth < MOBILE_BREAKPOINT;
  if (nowMobile !== isMobile.value) {
    isMobile.value = nowMobile;
    currentIndex.value = 0;
  }
}

/* 当前显示的图片组 */
const activeImages = computed(() =>
  isMobile.value ? randomFive2.value : randomFive.value
);

/* ========== 语音列表与播放逻辑 ========== */
const unlockedSet = ref<Set<number>>(new Set<number>());
const filter = ref<"all" | "unlocked" | "locked">("all");

function loadUnlocked() {
  try {
    const raw = localStorage.getItem("triggeredVoices") || "[]";
    const arr = JSON.parse(raw);
    const s = new Set<number>();
    if (Array.isArray(arr)) {
      arr.forEach((v: any) => {
        const n = Number(v);
        if (!Number.isNaN(n)) s.add(n);
      });
    }
    unlockedSet.value = s;
  } catch (e) {
    console.warn("读取 triggeredVoices 失败", e);
    unlockedSet.value = new Set<number>();
  }
}

/* 计算已解锁数量 */
const unlockedCount = computed(() => unlockedSet.value.size);

/* 过滤后的语音ID */
const filteredVoiceIds = computed(() => {
  const allIds = Array.from({ length: TOTAL_VOICES }, (_, i) => i);

  if (filter.value === "all") {
    // 已解锁在前，未解锁在后
    const unlocked = Array.from(unlockedSet.value)
      .filter((n) => allIds.includes(n))
      .sort((a, b) => a - b);
    const locked = allIds.filter((id) => !unlockedSet.value.has(id));
    return [...unlocked, ...locked];
  } else if (filter.value === "unlocked") {
    return Array.from(unlockedSet.value)
      .filter((n) => allIds.includes(n))
      .sort((a, b) => a - b);
  } else {
    return allIds.filter((id) => !unlockedSet.value.has(id));
  }
});

/* audio 单例 */
let currentAudio: HTMLAudioElement | null = null;
const currentId = ref<number | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const currentDuration = ref(0);

function createAudio(src?: string) {
  destroyAudio();
  currentAudio = new Audio();
  currentAudio.preload = "auto";
  if (src) currentAudio.src = src;
  currentAudio.addEventListener("timeupdate", onTimeUpdate);
  currentAudio.addEventListener("loadedmetadata", onLoadedMeta);
  currentAudio.addEventListener("ended", onEnded);
  currentAudio.addEventListener("error", onAudioError);
}

function destroyAudio() {
  if (!currentAudio) return;
  try {
    currentAudio.pause();
    currentAudio.removeEventListener("timeupdate", onTimeUpdate);
    currentAudio.removeEventListener("loadedmetadata", onLoadedMeta);
    currentAudio.removeEventListener("ended", onEnded);
    currentAudio.removeEventListener("error", onAudioError);
    currentAudio.src = "";
  } catch (e) {}
  currentAudio = null;
  currentId.value = null;
  isPlaying.value = false;
}

function onTimeUpdate() {
  if (currentAudio) {
    currentTime.value = currentAudio.currentTime || 0;
    currentDuration.value = currentAudio.duration || 0;
  }
}

function onLoadedMeta() {
  if (currentAudio) currentDuration.value = currentAudio.duration || 0;
}

function onEnded() {
  isPlaying.value = false;
}

function onAudioError(e?: any) {
  console.error("音频播放错误", e);
  isPlaying.value = false;
}

function voicePath(id: number) {
  return `/voice/audio (${id}).mp3`;
}

function isUnlocked(id: number) {
  return unlockedSet.value.has(id);
}

function getPlayButtonTitle(id: number) {
  if (!isUnlocked(id)) return "尚未解锁";
  if (currentId.value === id && isPlaying.value) return "暂停";
  return "播放";
}

async function playEntry(id: number) {
  if (!isUnlocked(id)) return;

  // 同一条 -> 切换暂停/恢复
  if (currentId.value === id) {
    if (isPlaying.value) {
      currentAudio?.pause();
      isPlaying.value = false;
    } else {
      try {
        await currentAudio!.play();
        isPlaying.value = true;
      } catch (e) {
        console.warn("播放失败", e);
      }
    }
    return;
  }

  // 新条目
  currentId.value = id;
  createAudio(voicePath(id));
  try {
    await currentAudio!.play();
    isPlaying.value = true;
  } catch (e) {
    console.warn("播放被阻止或失败", e);
    isPlaying.value = false;
  }
}

function stopPlayback() {
  destroyAudio();
}

function seekAudio(event: Event) {
  if (!currentAudio) return;
  const target = event.target as HTMLInputElement;
  const value = parseFloat(target.value);
  const time = (value / 100) * currentAudio.duration;
  currentAudio.currentTime = time;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

/* ========== 背景轮播控制 ========== */
function startBgTimer() {
  stopBgTimer();
  imgTimer = window.setInterval(() => {
    const len = Math.max(1, activeImages.value.length);
    currentIndex.value = (currentIndex.value + 1) % len;
  }, BG_INTERVAL_MS);
}

function stopBgTimer() {
  if (imgTimer !== null) {
    clearInterval(imgTimer);
    imgTimer = null;
  }
}

/* 监听 storage 事件 */
function onStorage(e: StorageEvent) {
  if (e.key === "triggeredVoices") loadUnlocked();
}

/* 生命周期 */
onMounted(() => {
  loadUnlocked();
  window.addEventListener("storage", onStorage);
  window.addEventListener("resize", handleResize);

  // 初始化图片数组
  if (!randomFive.value.length && allSrcs.length)
    randomFive.value = shuffle(allSrcs).slice(0, Math.min(5, allSrcs.length));
  if (!randomFive2.value.length && allSrcs2.length)
    randomFive2.value = shuffle(allSrcs2).slice(
      0,
      Math.min(5, allSrcs2.length)
    );

  startBgTimer();
});

onBeforeUnmount(() => {
  window.removeEventListener("storage", onStorage);
  window.removeEventListener("resize", handleResize);
  stopBgTimer();
  destroyAudio();
});

/* 监听 activeImages 变化 */
watch(activeImages, () => {
  currentIndex.value = 0;
});
</script>

<style lang="scss" scoped>
// 椿的主题色系
$camellia-white: #f8f5f2;
$camellia-cream: #fff5f0;
$camellia-red: #d32f2f;
$camellia-dark-red: #8b0000;
$camellia-light-red: #ff6b6b;
$blood-crimson: #c62828;
$deep-shadow: #1a0f0f;
$vein-purple: #6a1b9a;
$gold-glow: #ffd54f;

// 辅助颜色
$background-dark: #0f0909;
$card-bg: #1a1010;
$card-border: #2a1a1a;
$text-primary: #f8f5f2;
$text-secondary: #a89b9b;
$text-disabled: #6b5d5d;

// 阴影
$shadow-soft: rgba(139, 0, 0, 0.08);
$shadow-medium: rgba(139, 0, 0, 0.16);
$shadow-heavy: rgba(139, 0, 0, 0.24);

// 动画
@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes wave {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bgFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.4;
  }
}

// 基础样式重置
.voice-library-container {
  position: relative;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "PingFang SC", "Noto Sans SC", sans-serif;
  color: $text-primary;
  overflow-x: hidden;
}

// 背景层
.background-layer {
  position: fixed;
  inset: 0;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(15, 9, 9, 0.9) 0%,
      rgba(26, 15, 15, 0.8) 100%
    );
    z-index: 2;
  }
}

.bg-carousel {
  position: absolute;
  inset: 0;

  .bg-layer {
    position: absolute;
    inset: 0;

    .bg-img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;

      transition: opacity 1.5s ease-in-out;

      &.active {
        opacity: 1;
      }
    }
  }
}

// 装饰元素
.decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;

  .decoration {
    position: absolute;
    border-radius: 50%;

    &.petal-1 {
      top: 10%;
      left: 10%;
      width: 100px;
      height: 100px;
      background: radial-gradient(
        circle,
        rgba(211, 47, 47, 0.1) 0%,
        transparent 70%
      );
      animation: pulse 4s ease-in-out infinite;
    }

    &.petal-2 {
      bottom: 20%;
      right: 15%;
      width: 150px;
      height: 150px;
      background: radial-gradient(
        circle,
        rgba(106, 27, 154, 0.08) 0%,
        transparent 70%
      );
      animation: pulse 5s ease-in-out infinite reverse;
    }

    &.petal-3 {
      top: 40%;
      right: 25%;
      width: 80px;
      height: 80px;
      background: radial-gradient(
        circle,
        rgba(255, 213, 79, 0.05) 0%,
        transparent 70%
      );
      animation: pulse 6s ease-in-out infinite;
    }

    &.glow-1 {
      top: 30%;
      left: 20%;
      width: 200px;
      height: 200px;
      background: radial-gradient(
        circle,
        rgba(211, 47, 47, 0.05) 0%,
        transparent 70%
      );
      filter: blur(20px);
    }

    &.glow-2 {
      bottom: 30%;
      right: 25%;
      width: 300px;
      height: 300px;
      background: radial-gradient(
        circle,
        rgba(106, 27, 154, 0.03) 0%,
        transparent 70%
      );
      filter: blur(30px);
    }
  }
}

// 主内容区域
.main-content {
  position: relative;
  z-index: 4;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  animation: floatIn 0.6s ease-out;
  padding-top: 80px;
}

// 头部样式
.library-header {
  margin-bottom: 32px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .logo-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, $camellia-red, $blood-crimson);
      display: flex;
      align-items: center;
      justify-content: center;
      color: $camellia-white;
      box-shadow: 0 8px 32px rgba(198, 40, 40, 0.3);

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .title-group {
      .title {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 2rem;
        font-weight: 700;
        color: $camellia-white;

        .title-text {
          background: linear-gradient(
            135deg,
            $camellia-light-red,
            $camellia-red
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .title-badge {
          background: rgba(211, 47, 47, 0.2);
          border: 1px solid rgba(211, 47, 47, 0.3);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: $camellia-light-red;
        }
      }

      .subtitle {
        margin: 8px 0 0;
        color: $text-secondary;
        font-size: 1rem;
        max-width: 600px;
      }
    }
  }

  .stats-section {
    display: flex;
    gap: 24px;

    .stat-item {
      text-align: center;

      .stat-label {
        font-size: 0.875rem;
        color: $text-secondary;
        margin-bottom: 4px;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: $camellia-light-red;
      }
    }
  }

  .header-divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(211, 47, 47, 0.3),
      transparent
    );
  }
}

// 语音列表区域
.voice-list-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .section-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: $camellia-white;
    }

    .filter-controls {
      display: flex;
      gap: 8px;

      .filter-btn {
        padding: 8px 16px;
        background: rgba(42, 26, 26, 0.6);
        border: 1px solid rgba(107, 93, 93, 0.3);
        border-radius: 20px;
        color: $text-secondary;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(211, 47, 47, 0.1);
          border-color: rgba(211, 47, 47, 0.3);
          color: $camellia-light-red;
        }

        &.active {
          background: rgba(211, 47, 47, 0.2);
          border-color: $camellia-red;
          color: $camellia-light-red;
        }
      }
    }
  }

  .voice-list-container {
    background: rgba(26, 16, 16, 0.6);
    border: 1px solid rgba(42, 26, 26, 0.8);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    overflow: hidden;

    .voice-list {
      max-height: 60vh;
      overflow-y: auto;
      padding: 16px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(42, 26, 26, 0.3);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(211, 47, 47, 0.4);
        border-radius: 3px;

        &:hover {
          background: rgba(211, 47, 47, 0.6);
        }
      }
    }
  }
}

// 语音卡片
.voice-card {
  background: rgba(30, 20, 20, 0.8);
  border: 1px solid $card-border;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.4s ease-out;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(211, 47, 47, 0.5);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  &--unlocked {
    .voice-index {
      background: linear-gradient(
        135deg,
        rgba(211, 47, 47, 0.1),
        rgba(106, 27, 154, 0.05)
      );
    }
  }

  &--locked {
    opacity: 0.7;

    .voice-index {
      background: rgba(107, 93, 93, 0.2);
      color: $text-disabled;
    }

    .voice-title {
      color: $text-disabled;
    }
  }

  &--playing {
    border-color: $camellia-red;
    background: linear-gradient(
      135deg,
      rgba(211, 47, 47, 0.1),
      rgba(26, 16, 16, 0.8)
    );

    .voice-index {
      background: linear-gradient(135deg, $camellia-red, $blood-crimson);
      color: $camellia-white;
    }

    .play-btn {
      background: $camellia-red;
      color: $camellia-white;
    }
  }

  &--loading {
    .play-wave {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 12px;
      pointer-events: none;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
          circle,
          rgba(211, 47, 47, 0.1) 0%,
          transparent 70%
        );
        animation: pulse 2s ease-in-out infinite;
      }
    }
  }
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

.card-left {
  display: flex;
  align-items: center;
  gap: 16px;

  .voice-index {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $camellia-light-red;
    font-weight: 700;
    transition: all 0.3s ease;

    .index-number {
      font-size: 1.5rem;
      line-height: 1;
    }

    .index-label {
      font-size: 0.75rem;
      opacity: 0.8;
      margin-top: 2px;
    }
  }

  .voice-info {
    .voice-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: $camellia-white;
      margin-bottom: 4px;
    }

    .voice-status {
      display: flex;
      align-items: center;
      gap: 12px;

      .status-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;

        &.unlocked {
          background: rgba(255, 107, 107, 0.1);
          color: $camellia-light-red;
          border: 1px solid rgba(255, 107, 107, 0.3);
        }

        &.locked {
          background: rgba(107, 93, 93, 0.1);
          color: $text-disabled;
          border: 1px solid rgba(107, 93, 93, 0.3);
        }
      }
    }
  }
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;

  @media (max-width: 640px) {
    width: 100%;
    align-items: stretch;
  }

  .voice-actions {
    display: flex;
    gap: 8px;

    .action-btn {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &.play-btn {
        background: rgba(42, 26, 26, 0.8);
        border: 1px solid rgba(107, 93, 93, 0.3);
        color: $camellia-light-red;

        &:hover:not(:disabled) {
          background: rgba(211, 47, 47, 0.1);
          border-color: rgba(211, 47, 47, 0.3);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &.active {
          background: $camellia-red;
          color: $camellia-white;
          border-color: $camellia-red;
        }

        .btn-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      &.download-btn {
        background: rgba(106, 27, 154, 0.1);
        border: 1px solid rgba(106, 27, 154, 0.3);
        color: $vein-purple;

        &:hover {
          background: rgba(106, 27, 154, 0.2);
          border-color: rgba(106, 27, 154, 0.5);
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    .action-placeholder {
      width: 48px;
      height: 48px;
      opacity: 0;
    }
  }

  .play-progress {
    width: 200px;

    @media (max-width: 640px) {
      width: 100%;
    }

    .progress-bar {
      height: 4px;
      background: rgba(107, 93, 93, 0.3);
      border-radius: 2px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, $camellia-red, $camellia-light-red);
        border-radius: 2px;
        transition: width 0.1s linear;
      }
    }
  }
}

// 空状态
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: $text-secondary;

  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    color: $text-disabled;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .empty-title {
    margin: 0 0 8px;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .empty-description {
    margin: 0;
    font-size: 1rem;
  }
}

// 播放控制栏
.player-controls {
  background: rgba(26, 16, 16, 0.9);
  border: 1px solid rgba(211, 47, 47, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-top: 24px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .player-info {
    flex: 1;

    .player-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: $camellia-white;
      margin-bottom: 4px;
    }

    .player-time {
      font-size: 0.875rem;
      color: $text-secondary;
    }
  }

  .player-buttons {
    display: flex;
    gap: 12px;

    .player-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: $camellia-red;
      color: $camellia-white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: $blood-crimson;
        transform: scale(1.05);
      }

      svg {
        width: 24px;
        height: 24px;
      }

      &.stop-btn {
        background: rgba(107, 93, 93, 0.3);

        &:hover {
          background: rgba(107, 93, 93, 0.5);
        }
      }
    }
  }

  .player-progress {
    flex: 2;

    .progress-slider {
      width: 100%;
      height: 4px;
      -webkit-appearance: none;
      background: rgba(107, 93, 93, 0.3);
      border-radius: 2px;
      outline: none;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: $camellia-red;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: $camellia-light-red;
          transform: scale(1.2);
        }
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;

        &::-webkit-slider-thumb {
          cursor: not-allowed;
        }
      }
    }
  }
}

// 页脚
.library-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid rgba(107, 93, 93, 0.3);

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .footer-info {
      p {
        margin: 0 0 8px;
        color: $text-secondary;
        font-size: 0.875rem;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .footer-note {
        font-style: italic;
        color: $camellia-light-red;
      }
    }

    .footer-stats {
      font-size: 0.875rem;
      color: $text-secondary;

      .highlight {
        color: $camellia-light-red;
        font-weight: 600;
      }
    }
  }
}

// 动画过渡
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 1.5s ease;
}
.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}
.bg-fade-enter-to,
.bg-fade-leave-from {
  opacity: 0.4;
}

.voice-item-enter-active,
.voice-item-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.voice-item-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.voice-item-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.voice-item-move {
  transition: transform 0.4s ease;
}

// 响应式调整
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .title-section {
    .title-group {
      .title {
        font-size: 1.75rem;

        .title-badge {
          font-size: 0.75rem;
          padding: 2px 8px;
        }
      }

      .subtitle {
        font-size: 0.875rem;
      }
    }
  }

  .voice-list {
    max-height: 50vh;
    padding: 12px;
  }

  .voice-card {
    padding: 12px;
  }

  .card-left {
    gap: 12px;

    .voice-index {
      width: 50px;
      height: 50px;

      .index-number {
        font-size: 1.25rem;
      }
    }

    .voice-info {
      .voice-title {
        font-size: 1rem;
      }

      .voice-status {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  }

  .player-controls {
    padding: 16px;

    .player-info {
      .player-title {
        font-size: 1rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .title-section {
    .title-group {
      .title {
        font-size: 1.5rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  }

  .stats-section {
    width: 100%;
    justify-content: space-between;

    .stat-item {
      flex: 1;
    }
  }
}
</style>