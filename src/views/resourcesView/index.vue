<template>
  <div class="yuzuki-resources">
    <header class="hero">
      <div class="hero-inner">
        <h1>资源分享</h1>
        <p class="subtitle">可自由上传关于椿的相关链接</p>
      </div>
    </header>

    <main class="container">
      <section class="uploader" :class="{ collapsed: uploaderCollapsed }">
        <div class="uploader-head">
          <button
            class="toggle"
            @click="toggleUploader"
            :aria-expanded="!uploaderCollapsed"
          >
            <span v-if="uploaderCollapsed">展开上传区</span>
            <span v-else>收起上传区</span>
          </button>
        </div>

        <form
          @submit.prevent="addResource"
          class="upload-form"
          :aria-hidden="uploaderCollapsed"
        >
          <div class="row">
            <input
              v-model="form.title"
              type="text"
              placeholder="标题（必填，如果有解压码之类的也写这里吧）"
              aria-label="标题"
            />
            <input
              v-model="form.type"
              type="text"
              placeholder="链接类型(网页链接、b站视频、网盘链接等等)"
              aria-label="来源"
            />
          </div>

          <div class="row">
            <input
              v-model="form.uploader"
              type="text"
              placeholder="上传人（可选）"
              aria-label="上传人"
            />
            <input
              v-model="form.link"
              type="url"
              placeholder="链接(只输入网址不能有中文)"
              aria-label="链接"
            />
          </div>

          <div class="actions">
            <button type="submit" class="btn primary">上传</button>
          </div>
        </form>
      </section>

      <section class="list">
        <div class="list-header">
          <h2>资源列表（{{ resources.length }}）</h2>
          <div class="sort">
            <label>
              排序：
              <select v-model="sortBy">
                <option value="time">按时间（新→旧）</option>
                <option value="likes">按点赞（高→低）</option>
              </select>
            </label>
          </div>
        </div>

        <ul class="items">
          <li v-for="item in sortedResources" :key="item.id" class="item">
            <a
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="title"
              >{{ item.title }}</a
            >

            <div class="meta">
              <div class="left">
                <span class="uploader">{{ item.uploader || "匿名" }}</span>
                <span class="dot">•</span>
                <time :datetime="item.time">{{ formatTime(item.time) }}</time>
              </div>

              <div class="right">
                <button
                  @click.prevent="handleLike(item)"
                  :aria-pressed="likedIds.has(String(item.id))"
                  class="like-btn"
                  :class="{ active: likedIds.has(String(item.id)) }"
                >
                  <img
                    :src="
                      likedIds.has(String(item.id))
                        ? '/icons/heart-red-filled.svg'
                        : '/icons/heart-red-outline.svg'
                    "
                    class="heart-icon"
                    alt="heart"
                  />
                  <span class="count">{{ item.likes }}</span>
                </button>

                <span class="badge">{{ item.type }}</span>
              </div>
            </div>
          </li>
        </ul>

        <p v-if="resources.length === 0" class="empty">
          目前没有资源，快来上传第一条吧！
        </p>
      </section>
    </main>

    <footer class="foot">提示：点击标题将直接跳转</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
// 如果你的工程使用 ts 路径别名 @ 指向 src，可以用 '@/api/resource'，否则根据实际路径调整
import {
  getResourceList,
  createResource,
  likeResource,
} from "@/api/modules/resource";
import { ElMessage } from "element-plus";

interface Resource {
  id: number | string;
  title: string;
  uploader?: string;
  time: string; // ISO 或 created_at
  likes: number;
  link: string;
  type: string;
  role_key?: string;
}

const STORAGE_KEY = "chun_resources_v1";
const DEFAULT_ROLE = "chun";

const form = ref<{
  title: string;
  uploader: string;
  link: string;
  type: string;
}>({
  title: "",
  uploader: "",
  link: "",
  type: "",
});

const resources = ref<Resource[]>([]);
const likedIds = ref(new Set<string>());
const sortBy = ref<"time" | "likes">("time");
const uploaderCollapsed = ref(false);

function mapServerToLocal(row: any): Resource {
  return {
    id: row.id,
    title: row.title,
    uploader: row.uploader || "匿名",
    time: row.created_at || row.time || new Date().toISOString(),
    likes: row.likes ?? 0,
    link: row.link,
    type: row.storage_type || row.type || "other",
    role_key: row.role_key,
  };
}

async function loadResources() {
  try {
    // 尝试从后端拉取（分页可扩展，这里一次拉足够 demo）
    const res: any = await getResourceList({
      role_key: DEFAULT_ROLE,
      page: 1,
      pageSize: 100,
    });
    if (res && res.success && Array.isArray(res.data)) {
      resources.value = res.data.map(mapServerToLocal);
      // 可恢复本地点赞状态（仅 UI 记忆）
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.liked && Array.isArray(parsed.liked)) {
            parsed.liked.forEach((id: string) => likedIds.value.add(id));
          }
        } catch (e) {
          /* ignore */
        }
      }
      return;
    }
  } catch (err) {
    console.warn("拉取资源失败，使用本地缓存", err);
  }
  // 回退：本地缓存（仅恢复点赞状态）
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.liked && Array.isArray(parsed.liked)) {
        parsed.liked.forEach((id: string) => likedIds.value.add(id));
      }
    }
  } catch (e) {
    console.warn("本地加载失败", e);
  }
}

function saveLocalCache() {
  try {
    const liked = Array.from(likedIds.value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ liked }));
  } catch (e) {
    console.warn("保存本地缓存失败", e);
  }
}

onMounted(() => {
  loadResources();
  // 移动端默认收起上传区以节省空间
  uploaderCollapsed.value = window.innerWidth <= 640;
});
function toggleUploader() {
  uploaderCollapsed.value = !uploaderCollapsed.value;
}

async function addResource() {
  const t = form.value.title.trim();
  const l = form.value.link.trim();
  if (!form.value.title.trim() || !form.value.link.trim()) {
    return ElMessage.warning("请填写完整信息");
  }
  if (!/^https?:\/\//i.test(l)) {
    return ElMessage.error("请输入正确的链接(https开头)");
  }
  // 尝试调用后端接口
  try {
    const payload = {
      title: t,
      uploader: form.value.uploader.trim() || "匿名",
      link: l,
      storage_type: form.value.type,
      role_key: DEFAULT_ROLE,
    };
    const res: any = await createResource(payload);
    if (res && res.success && res.data) {
      const added = mapServerToLocal(res.data);
      resources.value.unshift(added);
      // 自动展开到顶部展示（可选）
      saveLocalCache();
      resetForm();
      ElMessage.success("上传成功");
      return;
    }
    ElMessage.error("上传失败");
  } catch (err) {
    console.warn("创建资源失败", err);
  }
}

function resetForm() {
  form.value.title = "";
  form.value.uploader = "";
  form.value.link = "";
  form.value.type = "";
}

async function handleLike(item: Resource) {
  // UI 乐观更新
  const id = item.id;
  const wasLiked = likedIds.value.has(String(id));
  if (wasLiked) {
    likedIds.value.delete(String(id));
    item.likes = Math.max(0, item.likes - 1);
  } else {
    likedIds.value.add(String(id));
    item.likes++;
  }
  saveLocalCache();

  // 同步后端（不依赖返回值进行 UI 回滚，简单处理：若失败则回退）
  try {
    const action = wasLiked ? "unlike" : "like";
    const res: any = await likeResource(id, action);
    if (
      res &&
      res.success &&
      res.data &&
      typeof res.data.likes !== "undefined"
    ) {
      item.likes = res.data.likes;
    }
  } catch (err) {
    console.warn("点赞接口调用失败，回滚本地状态", err);
    // 回滚
    if (wasLiked) {
      // 本来是已赞，取消失败 -> 重新添加
      likedIds.value.add(String(id));
      item.likes++;
    } else {
      likedIds.value.delete(String(id));
      item.likes = Math.max(0, item.likes - 1);
    }
    saveLocalCache();
  }
}

const sortedResources = computed(() => {
  const arr = [...resources.value];
  if (sortBy.value === "time") {
    arr.sort((a, b) => +new Date(b.time) - +new Date(a.time));
  } else {
    arr.sort((a, b) => b.likes - a.likes);
  }
  return arr;
});

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch (e) {
    return iso;
  }
}
</script>

<style lang="scss" scoped>
// 椿的主题色系变量
$camellia-white: #f8f5f2;
$camellia-cream: #fff5f0;
$camellia-red: #d32f2f;
$camellia-dark-red: #8b0000;
$camellia-light-red: #ff6b6b;
$blood-crimson: #c62828;
$deep-shadow: #1a0f0f;
$vein-purple: #6a1b9a;
$gold-glow: #ffd54f;

// 辅助变量
$glass-white: rgba(248, 245, 242, 0.92);
$glass-red: rgba(211, 47, 47, 0.12);
$shadow-soft: rgba(139, 0, 0, 0.08);
$shadow-medium: rgba(139, 0, 0, 0.16);
$shadow-heavy: rgba(139, 0, 0, 0.24);
$border-light: rgba(211, 47, 47, 0.15);

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes heartBeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 8px 32px rgba($blood-crimson, 0.2);
  }
  50% {
    box-shadow: 0 12px 48px rgba($blood-crimson, 0.3);
  }
}

.yuzuki-resources {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba($camellia-cream, 2%) 0%,
    $camellia-cream 30%,
    rgba($camellia-white, 1%) 100%
  );
  padding-top: 80px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "PingFang SC", "Noto Sans SC", sans-serif;
  color: $deep-shadow;
  position: relative;
  overflow-x: hidden;

  // 背景装饰
  &::before,
  &::after {
    content: "";
    position: fixed;
    pointer-events: none;
    z-index: 1;
  }

  &::before {
    top: -20%;
    right: -20%;
    width: 50%;
    height: 50%;
    background: radial-gradient(
      circle,
      rgba($camellia-light-red, 0.05) 0%,
      transparent 70%
    );
    animation: floatIn 2s ease-out;
  }

  &::after {
    bottom: -20%;
    left: -20%;
    width: 40%;
    height: 40%;
    background: radial-gradient(
      circle,
      rgba($vein-purple, 0.03) 0%,
      transparent 70%
    );
    animation: floatIn 2.5s ease-out;
  }
}

.hero {
  padding: 40px 24px 30px;
  background: linear-gradient(
    180deg,
    $glass-white 0%,
    rgba($camellia-white, 0.8) 100%
  );
  backdrop-filter: blur(20px);
  border-bottom: 1px solid $border-light;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 32px $shadow-soft;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 2px;
    background: linear-gradient(90deg, transparent, $camellia-red, transparent);
    opacity: 0.5;
  }

  .hero-inner {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
    animation: floatIn 0.8s ease-out;

    h1 {
      margin: 0 0 12px;
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(
        135deg,
        $camellia-red,
        $blood-crimson,
        $camellia-dark-red
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      line-height: 1.2;
      position: relative;
      display: inline-block;

      &::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 3px;
        background: linear-gradient(90deg, $camellia-red, $camellia-light-red);
        border-radius: 2px;
      }
    }

    .subtitle {
      margin: 0;
      font-size: 1.1rem;
      color: $camellia-red;
      opacity: 0.8;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  }
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  position: relative;
  z-index: 2;
}

.uploader {
  background: $glass-white;
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid $border-light;
  box-shadow: 0 8px 40px $shadow-soft, 0 2px 8px rgba(255, 255, 255, 0.5) inset;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 32px;

  &.collapsed {
    background: rgba($camellia-white, 0.8);

    .upload-form {
      opacity: 0;
      max-height: 0;
      padding: 0;
    }
  }
}

.uploader-head {
  padding: 20px 24px;
  border-bottom: 1px solid $border-light;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .toggle {
    padding: 12px 24px;
    background: linear-gradient(135deg, $camellia-red, $blood-crimson);
    color: $camellia-white;
    border: none;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba($blood-crimson, 0.3);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($blood-crimson, 0.4);

      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.upload-form {
  padding: 32px 24px;
  max-height: 1000px;
  opacity: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    input {
      padding: 16px 20px;
      background: $camellia-white;
      border: 2px solid $border-light;
      border-radius: 12px;
      font-size: 1rem;
      color: $deep-shadow;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px $shadow-soft;

      &:focus {
        outline: none;
        border-color: $camellia-red;
        box-shadow: 0 0 0 3px rgba($camellia-red, 0.1),
          0 8px 24px $shadow-medium;
        transform: translateY(-2px);
      }

      &::placeholder {
        color: rgba($deep-shadow, 40%);
      }
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;

    .btn {
      padding: 16px 40px;
      background: linear-gradient(135deg, $camellia-red, $blood-crimson);
      color: $camellia-white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba($blood-crimson, 0.3);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba($blood-crimson, 0.4);
        animation: glow 2s ease-in-out infinite;

        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(-1px);
      }

      &:disabled {
        background: linear-gradient(
          135deg,
          rgba($camellia-red, 30%),
          rgba($blood-crimson, 30%)
        );
        cursor: not-allowed;
        box-shadow: none;
        opacity: 0.7;
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        transition: left 0.5s ease;
      }
    }
  }
}

.list {
  background: $glass-white;
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid $border-light;
  box-shadow: 0 8px 40px $shadow-soft, 0 2px 8px rgba(255, 255, 255, 0.5) inset;
  padding: 32px;
  animation: floatIn 0.6s ease-out;

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba($camellia-red, 0.1);

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: $camellia-dark-red;
      position: relative;
      display: inline-block;

      &::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 40px;
        height: 3px;
        background: linear-gradient(90deg, $camellia-red, $camellia-light-red);
        border-radius: 2px;
      }
    }

    .sort {
      label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: $camellia-red;
        font-weight: 500;
        font-size: 0.95rem;
      }

      select {
        padding: 10px 16px;
        background: $camellia-white;
        border: 2px solid $border-light;
        border-radius: 10px;
        font-size: 0.95rem;
        color: $deep-shadow;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px $shadow-soft;

        &:focus {
          outline: none;
          border-color: $camellia-red;
          box-shadow: 0 0 0 3px rgba($camellia-red, 0.1);
        }

        option {
          background: $camellia-white;
          color: $deep-shadow;
        }
      }
    }
  }
}

.items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item {
  background: $camellia-white;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid $border-light;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, $camellia-red, $blood-crimson);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px $shadow-medium,
      0 4px 16px rgba(255, 255, 255, 0.6) inset;
    border-color: rgba($camellia-red, 0.3);

    &::before {
      opacity: 1;
    }

    .title {
      color: $camellia-red;
    }
  }

  .title {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: $camellia-dark-red;
    text-decoration: none;
    margin-bottom: 16px;
    line-height: 1.4;
    transition: color 0.3s ease;
    word-break: break-word;
    position: relative;
    padding-right: 32px;

    &::after {
      content: "↗";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.9rem;
      color: $camellia-light-red;
      opacity: 0.6;
      transition: all 0.3s ease;
    }

    &:hover::after {
      transform: translateY(-50%) translateX(4px);
      opacity: 1;
    }
  }
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  .left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    .uploader {
      font-weight: 600;
      color: $camellia-dark-red;
      padding: 6px 12px;
      background: rgba($camellia-red, 0.1);
      border-radius: 8px;
      border: 1px solid rgba($camellia-red, 0.2);
      margin: auto 0;
    }

    .dot {
      color: $camellia-light-red;
      opacity: 0.6;
    }

    time {
      font-size: 0.9rem;
      color: rgba($deep-shadow, 30%);
      font-weight: 500;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 16px;

    .like-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba($camellia-red, 0.1);
      border: 2px solid rgba($camellia-red, 0.2);
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      color: $camellia-red;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        background: rgba($camellia-red, 0.15);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba($camellia-red, 0.2);
      }

      &:active {
        transform: translateY(0);
      }

      &.active {
        background: linear-gradient(
          135deg,
          rgba($camellia-red, 0.2),
          rgba($blood-crimson, 0.2)
        );
        border-color: $camellia-red;
        color: $blood-crimson;

        .heart-icon {
          animation: heartBeat 0.6s ease;
          filter: none;
        }
      }

      .heart-icon {
        width: 20px;
        height: 20px;
        transition: all 0.3s ease;
        filter: grayscale(100%) opacity(0.8);
      }

      .count {
        font-weight: 700;
        min-width: 20px;
        text-align: center;
      }
    }

    .badge {
      padding: 6px 16px;
      background: linear-gradient(
        135deg,
        rgba($camellia-red, 0.1),
        rgba($vein-purple, 0.05)
      );
      border: 2px solid rgba($camellia-red, 0.2);
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      color: $camellia-red;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba($camellia-red, 0.1);
    }
  }
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: rgba($deep-shadow, 40%);
  font-size: 1.1rem;
  font-weight: 500;
  border: 2px dashed $border-light;
  border-radius: 16px;
  background: rgba($camellia-white, 0.5);
}

.foot {
  text-align: center;
  padding: 20px;
  color: $camellia-red;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.8;
  position: relative;
  z-index: 2;
  margin-top: 20px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, $camellia-red, transparent);
    opacity: 0.3;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .hero {
    padding: 32px 20px 24px;

    .hero-inner {
      h1 {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }
  }

  .container {
    padding: 24px 20px 60px;
  }

  .uploader-head .toggle {
    width: 100%;
    text-align: center;
  }

  .list {
    padding: 24px 20px;

    .list-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      h2 {
        font-size: 1.3rem;
      }

      .sort {
        width: 100%;

        label {
          justify-content: space-between;
          width: 100%;
        }

        select {
          flex: 1;
          max-width: 200px;
        }
      }
    }
  }

  .item {
    padding: 20px 16px;

    .title {
      font-size: 1.1rem;
      padding-right: 24px;
    }

    .meta {
      align-items: flex-start;
      gap: 16px;

      .left {
        gap: 12px;

        .uploader,
        time {
          font-size: 0.85rem;
        }
      }

      .right {
        width: 100%;
        justify-content: space-between;
      }
    }
  }

  .empty {
    padding: 40px 16px;
    font-size: 1rem;
  }
}

// 屏幕阅读器专用
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>