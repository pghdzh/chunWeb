<template>
  <div class="gallery-container">
    <button class="upload-btn" @click="openUploadModal">上传图片</button>

    <section class="gallery section">
      <div class="sort-controls">
        <button @click="toggleSort" class="sort-btn">
          按 {{ sortBy === "like_count" ? "点赞量" : "最新上传" }} 排序
        </button>
      </div>
      <div class="gallery-grid">
        <div
          v-for="(img, index) in images"
          :key="img.id"
          class="card"
          @click="openLightbox(index)"
          ref="cards"
        >
          <div class="card-inner">
            <img
              :src="img.src"
              :alt="img.alt"
              loading="lazy"
              @load="onImageLoad($event)"
            />
            <div class="overlay">
              <span>查看大图</span>
            </div>
            <button class="like-btn" @click.stop="handleLike(img)">
              <i class="heart" :class="{ liked: img.liked }"></i>
              <span class="like-count">{{ img.likeCount }}</span>
            </button>
          </div>
        </div>
      </div>
      <!-- sentinel：用于触发无限滚动 -->
      <div ref="sentinel" class="sentinel"></div>
      <!-- 可选：加载中/结束提示 -->
      <div class="loading" v-if="loading">加载中...</div>
      <div class="finished" v-if="finished">已全部加载</div>
    </section>
    <aside class="ranking-panel">
      <div class="panel-header" @click="expanded = !expanded">
        <h3 class="ranking-title">上传排行榜</h3>
        <span>共{{ images.length }}张</span>
        <span class="toggle-icon">{{ expanded ? "▾" : "▸" }}</span>
      </div>
      <transition name="fade">
        <ul v-if="expanded" class="ranking-list">
          <li
            v-for="(item, idx) in rankingList"
            :key="idx"
            class="ranking-item"
            :class="`rank-${idx + 1}`"
          >
            <span class="rank">{{ idx + 1 }}</span>
            <span class="name">{{ item.nickname }}</span>
            <span class="count">{{ item.count }} 张</span>
          </li>
        </ul>
      </transition>
    </aside>
    <!-- Lightbox Modal -->
    <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
      <span class="close" @click="closeLightbox">✕</span>
      <span class="prev" @click.stop="prevImage">‹</span>
      <img :src="images[currentIndex].src" :alt="images[currentIndex].alt" />
      <span class="next" @click.stop="nextImage">›</span>
    </div>

    <!-- 上传弹窗 -->
    <div
      v-if="uploadModalOpen"
      class="upload-modal-overlay"
      @click.self="closeUploadModal"
    >
      <div class="upload-modal">
        <h3>批量上传图片</h3>
        <div class="tip-container">
          <ul class="tips-list">
            <li>审核规则：1.不要色情倾向（露三点）我怕被封 2.要我能认出是椿。</li>
            <li>
              由于没有用户系统，我这边不好做审核反馈，但只要显示上传成功，我这边肯定能收到。
            </li>
            <li>
              如果图片数量较多请在b站私信联系我给我网盘链接，因为我云服务器比较小一次性上传太多图片可能会导致上传不上，感谢理解。
            </li>
            <li>
              因为审核上传一次比较麻烦，所以审核时间不定，最晚一周，感谢谅解。
            </li>
          </ul>
        </div>
        <p class="stats">
          今日已上传：<strong>{{ uploadedToday }}</strong> 张，
          剩余可上传：<strong>{{ remaining }}</strong> 张
        </p>
        <label>
          昵称：
          <input v-model="nickname" type="text" placeholder="请输入昵称" />
        </label>
        <label>
          选择图片（最多 {{ remaining }} 张）：
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            @change="handleFileSelect"
          />
        </label>
        <p class="tip" v-if="selectedFiles.length">
          已选 {{ selectedFiles.length }} 张
        </p>
        <div class="modal-actions">
          <button :disabled="!canSubmit || isUploading" @click="submitUpload">
            {{ isUploading ? "上传中..." : "立即上传" }}
          </button>
          <button class="cancel" @click="closeUploadModal">取消</button>
        </div>
      </div>
    </div>

    <!-- <div class="floating-chibis">
      <img v-for="(pet, i) in chibiList" :key="i" :src="pet.src" :style="{ top: pet.top + 'px', left: pet.left + 'px' }"
        class="chibi-img" />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from "vue";
import { uploadImages } from "@/api/modules/images"; // 前面封装的上传接口
import { getRankingList } from "@/api/modules/ranking"; // 根据你的实际路径调整
import { gsap } from "gsap"; // ← 本地引入
import { getImagesLikesList, likeImage } from "@/api/modules/imagesLikes";
import { debounce } from "lodash";

const sortBy = ref<"uploaded_at" | "like_count">("like_count");
const order = ref<"asc" | "desc">("desc");
function toggleSort() {
  if (sortBy.value === "uploaded_at") {
    sortBy.value = "like_count";
    order.value = "desc";
  } else {
    sortBy.value = "uploaded_at";
    order.value = "desc";
  }
  pageImage.value = 1;
  images.value = [];
  finished.value = false;
  window.scrollTo(0, 0);
  loadNextPage();
}
// 获取已点赞 ID 数组
function getLikedIds(): number[] {
  const data = localStorage.getItem("likedImageIds");
  return data ? JSON.parse(data) : [];
}

// 保存已点赞 ID 数组
function setLikedIds(ids: number[]) {
  localStorage.setItem("likedImageIds", JSON.stringify(ids));
}

async function handleLike(img: ImageItem) {
  if (img.liked) return; // 已点过就不重复调用

  try {
    await likeImage(img.id); // 调用后端接口
    img.likeCount += 1; // 本地更新点赞数
    img.liked = true; // 标记已点赞

    // 更新 localStorage
    const likedIds = getLikedIds();
    likedIds.push(img.id);
    setLikedIds(likedIds);
  } catch (error) {
    console.error("点赞失败", error);
    alert("点赞失败，请稍后重试");
  }
}

interface ImageItem {
  src: string;
  alt: string;
  likeCount: number;
  id: number;
  liked: Boolean;
}

interface RankingItem {
  id?: number; // 如果接口返回有 id，可加上
  nickname: string;
  count: number;
}
const rankingList = ref<RankingItem[]>([]);
const expanded = ref(true);

// 默认分页参数（如不分页可省略）
const page = 1;
const pageSize = 99;

const fetchRanking = async () => {
  const res = await getRankingList({ page, pageSize, character_key: "chun" });
  if (res.success) {
    rankingList.value = res.data;
  } else {
    console.error("获取排行榜失败", res.message);
  }
};

// 响应式存放最终图片列表
const images = ref<ImageItem[]>([]);

const pageImage = ref(1);
const limit = ref(10);
const loading = ref(false);
const finished = ref(false);

const sentinel = ref<HTMLElement | null>(null);

// 1. 在外层创建一个单例 observerCard
const observerCard = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerCard.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
// 2. 每次有新卡片时，都调用这个方法去挂载观察
async function observeNewCards(startIndex = 0) {
  await nextTick();
  const cards = document.querySelectorAll<HTMLElement>(".card");
  for (let i = startIndex; i < cards.length; i++) {
    observerCard.observe(cards[i]);
  }
}

async function loadNextPage() {
  if (loading.value || finished.value) return;
  loading.value = true;
  try {
    const res = await getImagesLikesList({
      page: pageImage.value,
      limit: limit.value,
      sortBy: sortBy.value,
      character_key: "chun",
      order: order.value,
    });
    const likedIds = getLikedIds();
    const list = (
      res.images as Array<{ url: string; like_count: number; id: number }>
    ).map((item) => ({
      src: item.url,
      alt: "",
      likeCount: item.like_count,
      id: item.id, // 如果需要的话，方便点赞用
      liked: likedIds.includes(item.id),
    }));
    if (list.length === 0) {
      finished.value = true;
      return;
    }
    // 记录加载前的长度，方便后面找出“新增”节点
    const oldLength = images.value.length;
    const existingIds = new Set(images.value.map((i) => i.id));
    const filtered = list.filter((item) => !existingIds.has(item.id));
    images.value.push(...filtered);
    pageImage.value++;

    observeNewCards(oldLength);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// 3. 给 loadNextPage 包装一个防抖版
const debouncedLoad = debounce(
  () => {
    loadNextPage();
  },
  200,
  { leading: true, trailing: false }
);

const lightboxOpen = ref(false);
const currentIndex = ref(0);

function openLightbox(index: number) {
  currentIndex.value = index;
  lightboxOpen.value = true;
}
function closeLightbox() {
  lightboxOpen.value = false;
}
function prevImage() {
  currentIndex.value =
    (currentIndex.value + images.value.length - 1) % images.value.length;
}
function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
}

// 渐显＆Blur‑Up 效果
function onImageLoad(e: Event) {
  const img = e.target as HTMLImageElement;
  const card = img.closest(".card");
  card?.classList.add("loaded");
}

// 上传弹窗逻辑

const uploadModalOpen = ref(false);
const nickname = ref("");
const fileInput = ref<HTMLInputElement>();
const selectedFiles = ref<File[]>([]);

// 从 localStorage 读取“今天”已上传数量
function getTodayKey() {
  return `uploaded_${new Date().toISOString().slice(0, 10)}`;
}
const uploadedToday = ref<number>(
  Number(localStorage.getItem(getTodayKey()) || 0)
);
const remaining = computed(() => Math.max(24 - uploadedToday.value, 0));

// 控制提交按钮
const canSubmit = computed(() => {
  return (
    nickname.value.trim().length > 0 &&
    selectedFiles.value.length > 0 &&
    selectedFiles.value.length <= remaining.value
  );
});

// 放在 script 顶部，或者 utils 里
function clearOldUploadRecords() {
  const today = new Date();
  const storage = window.localStorage;
  for (const key of Object.keys(storage)) {
    if (!key.startsWith("uploaded_")) continue;

    // key 格式 uploaded_YYYY-MM-DD
    const dateStr = key.slice("uploaded_".length);
    const recordDate = new Date(dateStr);
    if (isNaN(recordDate.getTime())) continue;

    // 计算相差天数
    const diffMs = today.getTime() - recordDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    // 如果超过 2 天，就删掉
    if (diffDays > 2) {
      storage.removeItem(key);
    }
  }
}

function openUploadModal() {
  clearOldUploadRecords();
  nickname.value = "";
  selectedFiles.value = [];
  if (fileInput.value) fileInput.value.value = "";
  // 每次打开重新刷新已上传数
  uploadedToday.value = Number(localStorage.getItem(getTodayKey()) || 0);
  uploadModalOpen.value = true;
}
function closeUploadModal() {
  uploadModalOpen.value = false;
}

// 本地截断到剩余数量
function handleFileSelect(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || []);

  if (!files) return;

  const validFiles: File[] = [];
  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      alert(`文件太大：${file.name}，请控制在 20MB 内`);
      continue;
    }
    validFiles.push(file);
  }

  if (validFiles.length === 0) return;

  if (validFiles.length > remaining.value) {
    alert(
      `今天最多还能上传 ${remaining.value} 张，已为你截取前 ${remaining.value} 张`
    );
    selectedFiles.value = files.slice(0, remaining.value);
  } else {
    selectedFiles.value = files;
  }
}
const isUploading = ref(false);
async function submitUpload() {
  if (!canSubmit.value) return;
  isUploading.value = true;
  try {
    const res = await uploadImages(
      selectedFiles.value,
      nickname.value.trim(),
      "chun"
    );
    const uploadedCount = res.data.length;
    // 更新 localStorage
    uploadedToday.value += uploadedCount;
    localStorage.setItem(getTodayKey(), String(uploadedToday.value));

    alert(`成功上传 ${uploadedCount} 张图片`);
    closeUploadModal();
    // …可选：刷新画廊列表或把新图片追加到 images …
  } catch (err: any) {
    console.error(err);
    alert(err.message || "上传失败");
  } finally {
    isUploading.value = false;
  }
}

interface Chibi {
  src: string;
  top: number;
  left: number;
}

const chibiList = ref<Chibi[]>([]);
let sentinelObserver: IntersectionObserver;
// Scroll-triggered lazy animation
onMounted(async () => {
  // 1. 拉排行榜
  await fetchRanking();

  // 2. 拉第一页图片并挂载动画 observer
  await loadNextPage(); // 内部会调用 observeNewCards(oldLen)
  // 对首次卡片做一次完整 observe
  observeNewCards(0);

  // 3. 初始化 sentinelObserver，再 observe
  sentinelObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) debouncedLoad();
    },
    { rootMargin: "0px", threshold: 0.1 }
  );
  if (sentinel.value) {
    sentinelObserver.observe(sentinel.value);
  }
  // // 1. 基础配置信息
  // const total = 9; // 总共 9 张图（编号 1～9）
  // const pickCount = 3; // 每次抽取 3 张
  // const vw = window.innerWidth;
  // const vh = window.innerHeight;

  // // 如果已知单张小人图片的宽高，可避免超出边界；
  // // 假设小人图片宽 100px、高 100px，按需替换：
  // const imgWidth = 100;
  // const imgHeight = 100;

  // // 2. Fisher–Yates 洗牌函数
  // function shuffle(array) {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // }

  // // 3. 随机选出 3 个编号
  // const nums = shuffle(Array.from({ length: total }, (_, k) => k + 1));
  // const picks = nums.slice(0, pickCount);

  // // 4. 生成随机位置并填充 chibiList
  // chibiList.value = []; // 先清空
  // picks.forEach((i) => {
  //   chibiList.value.push({
  //     src: `/QImages/1 (${i}).png`,
  //     left: Math.random() * (vw - imgWidth), // 保证不超出左右边界
  //     top: Math.random() * (vh - imgHeight), // 保证不超出上下边界
  //   });
  // });

  // // 2. 等 img 渲染到 DOM
  // await nextTick();

  // // 3. 给每个小人绑定 GSAP 动画
  // const imgs = document.querySelectorAll<HTMLImageElement>(".chibi-img");
  // imgs.forEach((img, index) => {
  //   const padding = 200; // 边缘预留空间
  //   // ✅ 初始出场动画（闪现）
  //   gsap.fromTo(
  //     img,
  //     { opacity: 0, scale: 0.5 },
  //     {
  //       opacity: 1,
  //       scale: 1,
  //       duration: 0.8,
  //       ease: "back.out(2)",
  //       delay: 0.2 * index,
  //     }
  //   );

  //   // ✅ 鼠标靠近闪避
  //   img.addEventListener("mouseenter", () => {
  //     gsap.killTweensOf(img);

  //     gsap.to(img, {
  //       x: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
  //       y: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
  //       duration: 1.2,
  //       ease: "back.out(2)",
  //       onComplete: () => {
  //         // 闪避完成后，再重新启用动画
  //         animate(img);
  //       },
  //     });
  //   });

  //   const animate = (img: HTMLImageElement) => {
  //     let { x, y } = img.getBoundingClientRect();
  //     let deltaX = (Math.random() - 0.5) * 200;
  //     let deltaY = (Math.random() - 0.5) * 200;

  //     // 预测一下偏移后的位置
  //     let nextX = x + deltaX;
  //     let nextY = y + deltaY;

  //     // 校正：防漂出左、右、上、下边界
  //     if (nextX < padding) deltaX = padding - x;
  //     if (nextX + img.width > window.innerWidth - padding)
  //       deltaX = window.innerWidth - padding - (x + img.width);
  //     if (nextY < padding) deltaY = padding - y;
  //     if (nextY + img.height > window.innerHeight - padding)
  //       deltaY = window.innerHeight - padding - (y + img.height);

  //     gsap.to(img, {
  //       x: `+=${deltaX.toFixed(0)}`,
  //       y: `+=${deltaY.toFixed(0)}`,
  //       rotation: `+=${((Math.random() - 0.5) * 60).toFixed(0)}`,
  //       duration: 2 + Math.random() * 2,
  //       ease: "power1.inOut",
  //       onComplete: () => animate(img),
  //     });
  //   };
  //   animate(img);
  // });
});

onBeforeUnmount(() => {
  observerCard.disconnect();
  sentinelObserver.disconnect();
  // 以及你在 onMounted 里新建的其它 Observer
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

// 辅助色
$shadow-soft: rgba(26, 15, 15, 0.08);
$shadow-medium: rgba(26, 15, 15, 0.16);
$shadow-heavy: rgba(26, 15, 15, 0.32);
$glass-white: rgba(248, 245, 242, 0.92);
$glass-red: rgba(211, 47, 47, 0.12);

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes petalFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.gallery-container {
  background: linear-gradient(135deg, $camellia-cream 0%, $camellia-white 100%);
  min-height: 100vh;
  padding: 0 16px 120px;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: "";
    position: fixed;
    inset: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba($camellia-light-red, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba($vein-purple, 0.03) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: 1;
  }
}

.upload-btn {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 28px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "PingFang SC", "Noto Sans SC", -apple-system, BlinkMacSystemFont,
    sans-serif;
  color: $camellia-white;
  background: linear-gradient(135deg, $camellia-red 0%, $blood-crimson 100%);
  border: none;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba($blood-crimson, 0.25),
    0 2px 8px rgba($blood-crimson, 0.15),
    inset 0 1px 0 rgba($camellia-white, 0.3);
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 12px 40px rgba($blood-crimson, 0.35),
      0 4px 16px rgba($blood-crimson, 0.2),
      inset 0 1px 0 rgba($camellia-white, 0.4);
    background: linear-gradient(
      135deg,
      $camellia-light-red 0%,
      $camellia-red 100%
    );
  }

  &:active {
    transform: translateX(-50%) translateY(0);
  }
}

.gallery {
  padding-top: 88px;
  max-width: 1200px;
  margin: 0 auto;
}

.sort-controls {
  margin-bottom: 24px;
  text-align: center;

  .sort-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 0.95rem;
    font-weight: 500;
    color: $camellia-dark-red;
    background: $camellia-white;
    border: 2px solid rgba($camellia-red, 0.15);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      border-color: $camellia-red;
      background: rgba($camellia-red, 0.05);
      box-shadow: 0 4px 20px rgba($camellia-red, 0.1);
    }

    &::before {
      content: "";
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, $camellia-red, $blood-crimson);
      border-radius: 50%;
    }
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 8px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.card {
  aspect-ratio: 3/4;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: transform 0.4s ease, opacity 0.4s ease;

  &.visible {
    animation: fadeInUp 0.6s ease forwards;
  }

  &:hover {
    transform: translateY(-8px);

    .card-inner::after {
      opacity: 1;
    }

    .overlay {
      opacity: 1;
      transform: translateY(0);
    }

    .like-btn {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba($deep-shadow, 0.6) 0%,
      rgba($deep-shadow, 0.2) 30%,
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px 16px;
  background: linear-gradient(to top, rgba($deep-shadow, 0.8), transparent);
  color: $camellia-white;
  transform: translateY(10px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2;

  span {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    opacity: 0.9;
  }
}

.like-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba($deep-shadow, 0.7);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 20px;
  color: $camellia-white;
  cursor: pointer;
  transform: translateY(-10px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 3;

  &:hover {
    background: rgba($blood-crimson, 0.8);
    animation: heartbeat 0.4s ease;
  }

  .heart {
    width: 18px;
    height: 18px;
    position: relative;
    background: url("/icons/heart-red-outline.svg") no-repeat center;
    background-size: contain;
    &.liked {
      background: url("/icons/heart-red-filled.svg") no-repeat center;
      animation: heartbeat 0.6s ease;
    }
  }

  .like-count {
    font-size: 0.85rem;
    font-weight: 600;
  }
}

.sentinel {
  height: 20px;
  margin: 40px 0;
}

.loading,
.finished {
  text-align: center;
  padding: 24px;
  color: $camellia-dark-red;
  font-size: 0.95rem;
  font-weight: 500;
}

.ranking-panel {
  position: fixed;
  top: 88px;
  right: 16px;
  width: 260px;
  background: $glass-white;
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba($camellia-red, 0.1);
  box-shadow: 0 12px 40px rgba($deep-shadow, 0.08),
    0 4px 16px rgba($deep-shadow, 0.04);
  z-index: 100;
  overflow: hidden;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    margin: 32px auto;
    max-width: 480px;
  }
}

.panel-header {
  padding: 20px 24px;
  background: linear-gradient(
    135deg,
    rgba($camellia-red, 0.1),
    rgba($vein-purple, 0.05)
  );
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba($camellia-red, 0.1);

  .ranking-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: $camellia-dark-red;
    letter-spacing: 0.5px;
  }

  .toggle-icon {
    color: $camellia-red;
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }
}

.ranking-list {
  list-style: none;
  margin: 0;
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($camellia-red, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba($camellia-red, 0.2);
    border-radius: 3px;
  }
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 10px;
  background: rgba($camellia-white, 0.8);
  border-radius: 16px;
  border: 1px solid rgba($camellia-red, 0.08);
  transition: all 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: translateX(4px);
    background: $camellia-white;
    border-color: rgba($camellia-red, 0.15);
    box-shadow: 0 4px 16px rgba($camellia-red, 0.1);
  }

  &.rank-1 {
    background: linear-gradient(
      135deg,
      rgba($gold-glow, 0.15),
      rgba($camellia-red, 0.1)
    );
    border-color: rgba($gold-glow, 0.3);

    .rank {
      color: $camellia-red;
      text-shadow: 0 2px 4px rgba($gold-glow, 0.3);
    }
  }

  &.rank-2 {
    background: linear-gradient(
      135deg,
      rgba($camellia-red, 0.1),
      rgba($vein-purple, 0.05)
    );
    border-color: rgba($camellia-red, 0.2);
  }

  &.rank-3 {
    background: linear-gradient(
      135deg,
      rgba($camellia-light-red, 0.08),
      rgba($camellia-red, 0.05)
    );
    border-color: rgba($camellia-light-red, 0.15);
  }
}

.rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($camellia-red, 0.1);
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
  color: $camellia-red;
  flex-shrink: 0;
}

.name {
  flex: 1;
  margin: 0 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: $deep-shadow;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.count {
  font-size: 0.9rem;
  font-weight: 600;
  color: $camellia-red;
  white-space: nowrap;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba($deep-shadow, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);

  img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba($deep-shadow, 0.5);
    animation: fadeInUp 0.4s ease;
  }

  .close,
  .prev,
  .next {
    position: absolute;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $camellia-white;
    font-size: 1.5rem;
    cursor: pointer;
    background: rgba($camellia-red, 0.2);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background: $camellia-red;
      transform: scale(1.1);
    }
  }

  .close {
    top: 24px;
    right: 24px;
  }

  .prev,
  .next {
    top: 50%;
    transform: translateY(-50%);
  }

  .prev {
    left: 24px;
  }

  .next {
    right: 24px;
  }
}

.upload-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba($deep-shadow, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    align-items: flex-end;
    padding: 0;
  }
}

.upload-modal {
  background: $camellia-white;
  border-radius: 24px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 80px rgba($deep-shadow, 0.2),
    0 8px 32px rgba($deep-shadow, 0.1);

  @media (max-width: 768px) {
    border-radius: 24px 24px 0 0;
    max-height: 80vh;
    padding: 24px;
  }

  h3 {
    margin: 0 0 24px;
    color: $camellia-dark-red;
    font-size: 1.4rem;
    font-weight: 700;
    text-align: center;
  }
}

.tip-container {
  background: rgba($camellia-cream, 0.8);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border-left: 4px solid $camellia-red;

  .tips-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: 6px 0 6px 24px;
      color: $camellia-dark-red;
      font-size: 0.9rem;
      line-height: 1.5;
      position: relative;

      &::before {
        content: "•";
        position: absolute;
        left: 0;
        color: $camellia-red;
        font-size: 1.2rem;
      }
    }
  }
}

.stats {
  text-align: center;
  margin: 0 0 24px;
  color: $camellia-dark-red;
  font-size: 1rem;

  strong {
    color: $camellia-red;
    font-weight: 700;
  }
}

label {
  display: block;
  margin-bottom: 20px;
  color: $deep-shadow;
  font-size: 0.95rem;
  font-weight: 500;

  input[type="text"],
  input[type="file"] {
    width: 100%;
    margin-top: 8px;
    padding: 14px 16px;
    border: 2px solid rgba($camellia-red, 0.1);
    border-radius: 12px;
    background: $camellia-white;
    color: $deep-shadow;
    font-size: 0.95rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $camellia-red;
      box-shadow: 0 0 0 3px rgba($camellia-red, 0.1);
    }

    &::placeholder {
      color: rgba($deep-shadow, 0.5);
    }
  }
}

.tip {
  text-align: center;
  margin: 12px 0 24px;
  color: $camellia-red;
  font-size: 0.9rem;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;

  button {
    flex: 1;
    padding: 16px 24px;
    border: none;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:not(.cancel) {
      background: linear-gradient(135deg, $camellia-red, $blood-crimson);
      color: $camellia-white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba($blood-crimson, 0.3);
      }
    }

    &.cancel {
      background: transparent;
      color: $camellia-red;
      border: 2px solid rgba($camellia-red, 0.2);

      &:hover {
        background: rgba($camellia-red, 0.05);
        border-color: $camellia-red;
      }
    }
  }
}

// 移动端适配优化
@media (max-width: 768px) {
  .gallery-container {
    padding: 0 12px 100px;
  }

  .gallery {
    padding-top: 72px;
  }

  .upload-btn {
    bottom: 16px;
    padding: 14px 24px;
    font-size: 0.95rem;
  }

 
  .lightbox {
    .close,
    .prev,
    .next {
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
    }

    .close {
      top: 16px;
      right: 16px;
    }

    .prev {
      left: 16px;
    }

    .next {
      right: 16px;
    }
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .card {
    border-radius: 16px;
  }

  .like-btn {
    top: 12px;
    right: 12px;
    padding: 6px 10px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .upload-modal {
    padding: 20px;
  }
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>