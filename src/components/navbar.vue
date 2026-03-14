<template>
  <nav
    ref="navbarRef"
    class="navbar theme-chun"
    :class="{ 'is-scrolled': isScrolled, 'dropdown-open': dropdownOpen }"
    role="navigation"
    aria-label="椿之导航"
  >
    <div class="navbar__container">
      <!-- Logo区域 -->
      <div
        class="navbar__logo"
        @click="scrollToTop"
        role="button"
        tabindex="0"
        title="回到顶端"
        aria-label="椿设定集主页"
      >
        <div class="logo-glow"></div>
        <span class="logo-icon">🌸</span>
        <div class="logo-text">
          <span class="logo-chun">椿</span>
          <span class="logo-subtitle">设定集</span>
        </div>
        <div class="logo-decoration">
          <div class="decoration-line left"></div>
          <div class="decoration-dot"></div>
          <div class="decoration-line right"></div>
        </div>
      </div>

      <!-- 在线人数 -->
      <div class="online-count" v-if="onlineCount !== null" aria-live="polite">
        <div class="count-icon">❀</div>
        <div class="count-text">
          <span class="count-label">绽放中</span>
          <span class="count-value">{{ onlineCount }}</span>
        </div>
      </div>
      <!-- 添加BGM控制按钮 -->
      <div class="bgm-control">
        <button
          class="bgm-btn"
          @click="toggleBGM"
          :aria-label="isBGMPlaying ? '暂停背景音乐' : '播放背景音乐'"
          :title="isBGMPlaying ? '暂停背景音乐' : '播放背景音乐'"
        >
          <span class="bgm-icon">{{ isBGMPlaying ? "♫" : "♪" }}</span>
          <span class="bgm-glow"></span>
          <span class="bgm-petal">❀</span>
        </button>
      </div>
      <!-- PC端导航 - 主要链接 -->
      <ul class="navbar__links" id="primary-navigation">
        <li v-for="(item, index) in mainLinks" :key="item.name">
          <router-link
            :to="item.path"
            class="link"
            active-class="router-link-active"
            :data-index="index"
          >
            <span class="link-bg"></span>
            <span class="link-text">{{ item.name }}</span>
            <span class="link-glow"></span>
            <span class="link-petal" v-if="index % 2 === 0">❀</span>
          </router-link>
        </li>

        <!-- 下拉菜单触发按钮 -->
        <li class="dropdown-trigger" @mouseenter="dropdownOpen = true">
          <button
            class="dropdown-btn"
            @click="toggleDropdown"
            aria-haspopup="true"
            :aria-expanded="dropdownOpen"
          >
            <span class="btn-text">更多</span>
            <span class="btn-icon" :class="{ open: dropdownOpen }">❀</span>
            <span class="btn-glow"></span>
          </button>

          <!-- 下拉菜单 -->
          <transition name="dropdown">
            <ul
              v-if="dropdownOpen"
              class="dropdown-menu"
              @mouseenter="dropdownOpen = true"
              @mouseleave="onDropdownLeave"
            >
              <li v-for="item in dropdownLinks" :key="item.name">
                <router-link
                  :to="item.path"
                  class="dropdown-link"
                  @click="closeDropdown"
                >
                  <span class="link-icon">❀</span>
                  <span class="link-text">{{ item.name }}</span>
                </router-link>
              </li>
              <!-- 总站链接 -->
              <li>
                <a
                  href="http://slty.site/#/redirector"
                  target="_blank"
                  rel="noopener"
                  class="dropdown-link external"
                  @click="closeDropdown"
                >
                  <span class="link-icon">→</span>
                  <span class="link-text">总站</span>
                </a>
              </li>
            </ul>
          </transition>
        </li>
      </ul>

      <!-- 移动端汉堡菜单按钮 -->
      <button
        class="navbar__toggle"
        :class="{ active: mobileOpen }"
        @click="toggleMobileMenu"
        aria-label="切换菜单"
        aria-controls="mobile-navigation"
        :aria-expanded="mobileOpen"
      >
        <div class="toggle-glow"></div>
        <span class="line line--1"></span>
        <span class="line line--2"></span>
        <span class="line line--3"></span>
        <span class="toggle-petal">❀</span>
      </button>

      <!-- 移动端菜单 -->
      <transition name="mobile-menu">
        <div
          v-if="mobileOpen"
          class="mobile-menu-overlay"
          @click="closeMobileMenu"
        >
          <div class="mobile-menu" @click.stop>
            <div class="mobile-header">
              <div class="mobile-logo">
                <span class="logo-icon">🌸</span>
                <span class="logo-text">椿设定集</span>
              </div>
              <button
                class="mobile-close"
                @click="closeMobileMenu"
                aria-label="关闭菜单"
              >
                ✕
              </button>
            </div>

            <ul class="mobile-links" id="mobile-navigation">
              <li v-for="item in links" :key="item.name">
                <router-link
                  :to="item.path"
                  class="mobile-link"
                  @click="closeMobileMenu"
                >
                  <span class="link-bg"></span>
                  <span class="link-text">{{ item.name }}</span>
                  <span class="link-petal">❀</span>
                </router-link>
              </li>
              <li>
                <a
                  href="https://slty.site/#/redirector"
                  target="_blank"
                  rel="noopener"
                  class="mobile-link external"
                  @click="closeMobileMenu"
                >
                  <span class="link-text">前往总站</span>
                  <span class="external-icon">↗</span>
                </a>
              </li>
            </ul>

            <div class="mobile-footer">
              <div class="online-count-mobile" v-if="onlineCount !== null">
                <span class="count-icon">❀</span>
                <span class="count-text"
                  >当前 {{ onlineCount }} 人正在绽放</span
                >
              </div>
              <button
                class="bgm-btn-mobile"
                @click="toggleBGM"
                :aria-label="isBGMPlaying ? '暂停背景音乐' : '播放背景音乐'"
              >
                <span class="bgm-icon">{{
                  isBGMPlaying ? "♫ 暂停音乐" : "♪ 播放音乐"
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { io } from "socket.io-client";

const siteId = "chun";
const onlineCount = ref<number | null>(null);
const socket = io(import.meta.env.VITE_API_BASE_URL, { query: { siteId } });

const mobileOpen = ref(false);
const dropdownOpen = ref(false);
const isScrolled = ref(false);
const dropdownTimeout = ref(null);

// 分割链接：PC端显示前5个，剩余放在下拉菜单
const links = [
  { name: "初绽之庭", path: "/" },
  { name: "命运花期", path: "/timeLine" },
  { name: "无声花笺", path: "/message" },
  { name: "赤华影廊", path: "/gallery" },
  { name: "落英藏", path: "/resources" },
  { name: "红椿对谈", path: "/talk" },
  { name: "迷庭戏", path: "/game" },
  { name: "荆棘回响", path: "/voice" },
  { name: "烬华谱", path: "/music" },
  { name: "漫生卷", path: "/wiki" },
  { name: "余香录", path: "/thanks" },
];

const mainLinks = computed(() => links.slice(0, 5));
const dropdownLinks = computed(() => links.slice(5));

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const toggleMobileMenu = () => {
  mobileOpen.value = !mobileOpen.value;
};

const closeMobileMenu = () => {
  mobileOpen.value = false;
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};

const onDropdownLeave = () => {
  if (dropdownTimeout.value) clearTimeout(dropdownTimeout.value);
  dropdownTimeout.value = setTimeout(() => {
    dropdownOpen.value = false;
  }, 150);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  closeMobileMenu();
  closeDropdown();
};

// 添加BGM相关变量
const bgmAudio = ref<HTMLAudioElement | null>(null);
const isBGMPlaying = ref(false);
const isBGMInitialized = ref(false);

// BGM控制函数
const initBGM = () => {
  if (isBGMInitialized.value) return;

  bgmAudio.value = new Audio("/无瑕的种核.mp3");
  bgmAudio.value.loop = true;
  bgmAudio.value.volume = 0.5; // 设置默认音量50%
  bgmAudio.value.preload = "auto";

  // 监听音频加载完成
  bgmAudio.value.addEventListener("canplaythrough", () => {
    isBGMInitialized.value = true;
    console.log("BGM加载完成");
  });

  // 监听播放结束（循环播放）
  bgmAudio.value.addEventListener("ended", () => {
    if (isBGMPlaying.value) {
      bgmAudio.value?.play();
    }
  });

  // 监听音频错误
  bgmAudio.value.addEventListener("error", (e) => {
    console.error("BGM加载失败:", e);
  });
};

const toggleBGM = () => {
  if (!bgmAudio.value) {
    initBGM();
  }

  if (isBGMPlaying.value) {
    bgmAudio.value?.pause();
  } else {
    // 浏览器自动播放策略：需要用户交互后才能播放
    const playPromise = bgmAudio.value?.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("播放失败，需要用户交互:", error);
        // 可以在这里显示提示，告知用户需要点击播放
      });
    }
  }

  isBGMPlaying.value = !isBGMPlaying.value;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  socket.on("onlineCount", (count: number) => {
    onlineCount.value = count;
  });
});

onBeforeUnmount(() => {
  if (bgmAudio.value) {
    bgmAudio.value.pause();
    bgmAudio.value.src = "";
    bgmAudio.value = null;
  }
  socket.disconnect();
  if (dropdownTimeout.value) clearTimeout(dropdownTimeout.value);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1200;
  height: 76px;
  padding: 12px 0;
  display: block;
  background: linear-gradient(
    180deg,
    rgba(28, 8, 12, 0.95) 0%,
    rgba(18, 5, 8, 0.92) 100%
  );
  backdrop-filter: blur(12px) saturate(1.8);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(184, 43, 67, 0.2);
  box-shadow: 0 4px 30px rgba(216, 58, 100, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);

  &.is-scrolled {
    height: 68px;
    box-shadow: 0 8px 40px rgba(184, 43, 67, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    background: linear-gradient(
      180deg,
      rgba(24, 6, 10, 0.98) 0%,
      rgba(14, 3, 6, 0.96) 100%
    );
  }
}

/* 容器 */
.navbar__container {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 20px;
}

/* Logo 样式 */
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  background: linear-gradient(
    135deg,
    rgba(216, 58, 100, 0.08),
    rgba(184, 43, 67, 0.04)
  );
  border: 1px solid rgba(216, 58, 100, 0.15);

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(216, 58, 100, 0.3);
    box-shadow: 0 8px 24px rgba(216, 58, 100, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);

    .logo-glow {
      opacity: 0.6;
    }

    .logo-icon {
      transform: scale(1.1) rotate(15deg);
    }
  }

  .logo-glow {
    position: absolute;
    inset: -2px;
    background: radial-gradient(
      circle at center,
      rgba(216, 58, 100, 0.3) 0%,
      transparent 70%
    );
    border-radius: 14px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  .logo-icon {
    font-size: 24px;
    color: #ff7aa8;
    text-shadow: 0 0 20px rgba(216, 58, 100, 0.6),
      0 0 40px rgba(216, 58, 100, 0.3);
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1;

    .logo-chun {
      font-size: 24px;
      font-weight: 900;
      background: linear-gradient(135deg, #ff7aa8, #d83a64);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 1px;
      text-shadow: 0 2px 10px rgba(216, 58, 100, 0.3);
    }

    .logo-subtitle {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 2px;
    }
  }

  .logo-decoration {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .decoration-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(216, 58, 100, 0.4),
        transparent
      );
    }

    .decoration-dot {
      width: 4px;
      height: 4px;
      background: #ff7aa8;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(216, 58, 100, 0.6);
    }
  }
}

/* 在线人数 */
.online-count {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: rgba(18, 5, 8, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(216, 58, 100, 0.15);

  .count-icon {
    font-size: 14px;
    color: #ff7aa8;
    animation: pulse 2s infinite;
  }

  .count-text {
    display: flex;
    flex-direction: column;
    line-height: 1;

    .count-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 0.5px;
    }

    .count-value {
      font-size: 18px;
      font-weight: 700;
      color: #ff7aa8;
      text-shadow: 0 0 20px rgba(216, 58, 100, 0.4);
      margin-top: 2px;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
.bgm-control {
  display: flex;
  align-items: center;

  .bgm-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      rgba(216, 58, 100, 0.12),
      rgba(184, 43, 67, 0.08)
    );
    border: 1px solid rgba(216, 58, 100, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(
        135deg,
        rgba(216, 58, 100, 0.18),
        rgba(184, 43, 67, 0.12)
      );
      border-color: rgba(216, 58, 100, 0.4);
      transform: translateY(-2px);

      .bgm-glow {
        opacity: 0.6;
      }

      .bgm-petal {
        opacity: 1;
        transform: scale(1.2) rotate(15deg);
      }
    }

    .bgm-icon {
      font-size: 18px;
      color: #ff7aa8;
      text-shadow: 0 0 15px rgba(216, 58, 100, 0.5);
      position: relative;
      z-index: 1;
      transition: transform 0.3s ease;
    }

    .bgm-glow {
      position: absolute;
      inset: -1px;
      background: radial-gradient(
        circle at center,
        rgba(216, 58, 100, 0.2) 0%,
        transparent 70%
      );
      border-radius: 13px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
    }

    .bgm-petal {
      position: absolute;
      top: -4px;
      right: -4px;
      font-size: 10px;
      color: #ff7aa8;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.3s ease;
      filter: drop-shadow(0 0 4px rgba(216, 58, 100, 0.6));
    }

    &:hover .bgm-icon {
      transform: scale(1.1);
    }
  }

  // 播放时的状态
  .bgm-btn[data-playing="true"] {
    .bgm-icon {
      animation: musicPulse 2s infinite;
    }

    .bgm-petal {
      opacity: 1;
      animation: petalFloat 3s infinite;
    }
  }
}

/* 移动端BGM按钮 */
.bgm-btn-mobile {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(216, 58, 100, 0.15),
    rgba(184, 43, 67, 0.1)
  );
  border: 1px solid rgba(216, 58, 100, 0.25);
  color: #ff9ec0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(216, 58, 100, 0.2),
      rgba(184, 43, 67, 0.15)
    );
    border-color: rgba(216, 58, 100, 0.4);
    transform: translateY(-2px);
  }

  .bgm-icon {
    font-size: 16px;
  }
}

/* 动画 */
@keyframes musicPulse {
  0%,
  100% {
    transform: scale(1);
    text-shadow: 0 0 15px rgba(216, 58, 100, 0.5);
  }
  50% {
    transform: scale(1.1);
    text-shadow: 0 0 25px rgba(216, 58, 100, 0.8);
  }
}

@keyframes petalFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bgm-control {
    display: none; /* 隐藏PC端BGM按钮，在移动端显示 */
  }

  .mobile-footer {
    .bgm-btn-mobile {
      display: block;
    }
  }
}

/* 在PC端隐藏移动端BGM按钮 */
@media (min-width: 769px) {
  .bgm-btn-mobile {
    display: none;
  }
}
/* PC端导航链接 */
.navbar__links {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;

  > li {
    position: relative;

    &:not(.dropdown-trigger) .link {
      padding: 12px 20px;
      border-radius: 12px;
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
      background: transparent;
      border: 1px solid transparent;

      &:hover {
        background: linear-gradient(
          135deg,
          rgba(216, 58, 100, 0.12),
          rgba(184, 43, 67, 0.08)
        );
        border-color: rgba(216, 58, 100, 0.3);
        transform: translateY(-2px);

        .link-glow {
          opacity: 0.6;
        }

        .link-petal {
          opacity: 1;
          transform: translateY(-2px) rotate(15deg);
        }
      }

      &.router-link-active {
        background: linear-gradient(
          135deg,
          rgba(216, 58, 100, 0.18),
          rgba(184, 43, 67, 0.12)
        );
        border-color: rgba(216, 58, 100, 0.4);

        .link-text {
          color: #ff9ec0;
          text-shadow: 0 0 15px rgba(216, 58, 100, 0.4);
        }

        .link-glow {
          opacity: 0.8;
        }

        .link-petal {
          opacity: 1;
        }
      }

      .link-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(216, 58, 100, 0.1),
          transparent
        );
        border-radius: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .link-text {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.85);
        letter-spacing: 0.3px;
        position: relative;
        z-index: 1;
        transition: color 0.3s ease;
      }

      .link-glow {
        position: absolute;
        inset: -1px;
        background: radial-gradient(
          circle at center,
          rgba(216, 58, 100, 0.2) 0%,
          transparent 70%
        );
        border-radius: 13px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
      }

      .link-petal {
        font-size: 12px;
        color: #ff7aa8;
        opacity: 0;
        transition: all 0.3s ease;
      }
    }
  }
}

/* 下拉菜单样式 */
.dropdown-trigger {
  position: relative;

  .dropdown-btn {
    padding: 12px 20px;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      rgba(216, 58, 100, 0.1),
      rgba(184, 43, 67, 0.05)
    );
    border: 1px solid rgba(216, 58, 100, 0.2);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: linear-gradient(
        135deg,
        rgba(216, 58, 100, 0.15),
        rgba(184, 43, 67, 0.1)
      );
      border-color: rgba(216, 58, 100, 0.4);
      transform: translateY(-1px);

      .btn-glow {
        opacity: 0.6;
      }
    }

    .btn-text {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: 0.3px;
    }

    .btn-icon {
      font-size: 12px;
      color: #ff7aa8;
      transition: transform 0.3s ease;

      &.open {
        transform: rotate(180deg);
      }
    }

    .btn-glow {
      position: absolute;
      inset: -1px;
      background: radial-gradient(
        circle at center,
        rgba(216, 58, 100, 0.15) 0%,
        transparent 70%
      );
      border-radius: 13px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    }
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 200px;
    background: linear-gradient(
      180deg,
      rgba(24, 6, 10, 0.98),
      rgba(18, 4, 7, 0.98)
    );
    backdrop-filter: blur(20px);
    border: 1px solid rgba(216, 58, 100, 0.25);
    border-radius: 16px;
    padding: 8px;
    list-style: none;
    margin: 0;
    box-shadow: 0 20px 60px rgba(184, 43, 67, 0.2),
      0 8px 30px rgba(12, 3, 5, 0.8);
    z-index: 1000;

    &::before {
      content: "";
      position: absolute;
      top: -6px;
      right: 20px;
      width: 12px;
      height: 12px;
      background: inherit;
      border-top: 1px solid rgba(216, 58, 100, 0.25);
      border-left: 1px solid rgba(216, 58, 100, 0.25);
      transform: rotate(45deg);
    }

    li {
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }

      .dropdown-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 12px;
        text-decoration: none;
        transition: all 0.2s ease;
        position: relative;

        &:hover {
          background: linear-gradient(
            135deg,
            rgba(216, 58, 100, 0.15),
            rgba(184, 43, 67, 0.1)
          );
          transform: translateX(4px);

          .link-icon {
            transform: scale(1.2);
          }
        }

        &.router-link-active {
          background: linear-gradient(
            135deg,
            rgba(216, 58, 100, 0.2),
            rgba(184, 43, 67, 0.15)
          );
          border-left: 3px solid #ff7aa8;

          .link-text {
            color: #ff9ec0;
          }
        }

        .link-icon {
          font-size: 12px;
          color: #ff7aa8;
          transition: transform 0.2s ease;
        }

        .link-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
          transition: color 0.2s ease;
        }

        &.external .link-text {
          color: #ff9ec0;
        }
      }
    }
  }
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 移动端汉堡菜单按钮 */
.navbar__toggle {
  display: none;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(216, 58, 100, 0.1),
    rgba(184, 43, 67, 0.05)
  );
  border: 1px solid rgba(216, 58, 100, 0.2);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(216, 58, 100, 0.15),
      rgba(184, 43, 67, 0.1)
    );
    border-color: rgba(216, 58, 100, 0.4);

    .toggle-glow {
      opacity: 0.6;
    }

    .toggle-petal {
      transform: scale(1.1) rotate(15deg);
    }
  }

  &.active {
    background: linear-gradient(
      135deg,
      rgba(216, 58, 100, 0.2),
      rgba(184, 43, 67, 0.15)
    );

    .line--1 {
      transform: translateY(8px) rotate(45deg);
    }

    .line--2 {
      opacity: 0;
      transform: scaleX(0);
    }

    .line--3 {
      transform: translateY(-8px) rotate(-45deg);
    }

    .toggle-petal {
      opacity: 0;
    }
  }

  .toggle-glow {
    position: absolute;
    inset: -1px;
    background: radial-gradient(
      circle at center,
      rgba(216, 58, 100, 0.15) 0%,
      transparent 70%
    );
    border-radius: 13px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  .line {
    display: block;
    width: 20px;
    height: 2px;
    margin: 4px auto;
    background: linear-gradient(90deg, #ff7aa8, #d83a64);
    border-radius: 1px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .toggle-petal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #ff7aa8;
    opacity: 0.3;
    transition: all 0.3s ease;
  }
}

/* 移动端菜单 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(8, 2, 4, 0.9);
  backdrop-filter: blur(8px);
  z-index: 1199;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-top: 76px;
}

.mobile-menu {
  width: 320px;
  height: calc(100vh - 76px);
  background: linear-gradient(
    180deg,
    rgba(24, 6, 10, 0.98),
    rgba(18, 4, 7, 0.98)
  );
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(216, 58, 100, 0.25);
  border-top: 1px solid rgba(216, 58, 100, 0.25);
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;

  .mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(216, 58, 100, 0.2);

    .mobile-logo {
      display: flex;
      align-items: center;
      gap: 12px;

      .logo-icon {
        font-size: 24px;
        color: #ff7aa8;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 700;
        background: linear-gradient(135deg, #ff7aa8, #d83a64);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .mobile-close {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(216, 58, 100, 0.1);
      border: 1px solid rgba(216, 58, 100, 0.2);
      color: #ff7aa8;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(216, 58, 100, 0.2);
      }
    }
  }

  .mobile-links {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;

    li {
      margin-bottom: 8px;

      .mobile-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px;
        border-radius: 14px;
        text-decoration: none;
        position: relative;
        transition: all 0.2s ease;
        border: 1px solid transparent;

        &:hover {
          background: linear-gradient(
            135deg,
            rgba(216, 58, 100, 0.12),
            rgba(184, 43, 67, 0.08)
          );
          border-color: rgba(216, 58, 100, 0.3);
          transform: translateX(4px);

          .link-petal {
            transform: rotate(15deg);
          }
        }

        &.router-link-active {
          background: linear-gradient(
            135deg,
            rgba(216, 58, 100, 0.18),
            rgba(184, 43, 67, 0.12)
          );
          border-color: rgba(216, 58, 100, 0.4);

          .link-text {
            color: #ff9ec0;
          }

          .link-petal {
            opacity: 1;
          }
        }

        &.external {
          .link-text {
            color: #ff9ec0;
          }

          .external-icon {
            color: #ff7aa8;
            font-size: 14px;
          }
        }

        .link-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(216, 58, 100, 0.1),
            transparent
          );
          border-radius: 14px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .link-text {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          transition: color 0.2s ease;
        }

        .link-petal {
          font-size: 14px;
          color: #ff7aa8;
          opacity: 0.6;
          transition: all 0.2s ease;
        }
      }
    }
  }

  .mobile-footer {
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid rgba(216, 58, 100, 0.2);

    .online-count-mobile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(216, 58, 100, 0.08);
      border-radius: 12px;
      border: 1px solid rgba(216, 58, 100, 0.15);

      .count-icon {
        font-size: 16px;
        color: #ff7aa8;
        animation: pulse 2s infinite;
      }

      .count-text {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

/* 移动端菜单动画 */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .navbar__links > li:not(.dropdown-trigger) .link {
    padding: 12px 16px;
    font-size: 13px;
  }

  .dropdown-trigger .dropdown-btn {
    padding: 12px 16px;
  }
}

@media (max-width: 768px) {
  .navbar__container {
    padding: 0 16px;
  }

  .navbar__toggle {
    display: block;
  }

  .navbar__links {
    display: none;
  }

  .online-count {
    display: none;
  }

  .navbar__logo {
    padding: 6px 12px;

    .logo-text {
      .logo-chun {
        font-size: 20px;
      }

      .logo-subtitle {
        font-size: 10px;
      }
    }

    .logo-decoration {
      display: none;
    }
  }
}

@media (max-width: 480px) {
  .navbar__logo {
    .logo-icon {
      font-size: 20px;
    }

    .logo-text {
      .logo-chun {
        font-size: 18px;
      }
    }
  }

  .mobile-menu {
    width: 100%;
    border-left: none;
  }
}
</style>