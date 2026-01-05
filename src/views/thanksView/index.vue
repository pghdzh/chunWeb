<template>
  <div class="camellia-ack">
    <!-- 简约背景 -->
    <div class="bg-layers">
      <div class="bg-layer-1"></div>
      <div class="bg-layer-2"></div>
    </div>

    <!-- 主内容 -->
    <main class="content-wrapper">
      <!-- 标题区域 -->
      <div class="title-section">
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-circle"></div>
          <div class="decoration-line"></div>
        </div>

        <h1 class="main-title">鸣谢之章</h1>
        <p class="subtitle">那些为椿注入灵魂的灵感</p>
      </div>

      <!-- 鸣谢列表 -->
      <div class="acknowledgments-section">
        <div v-if="acknowledgements.length === 0" class="empty-state">
          <div class="empty-icon">🌸</div>
          <p class="empty-text">暂无鸣谢内容</p>
        </div>

        <div v-else class="acknowledgments-list">
          <div
            v-for="(item, index) in acknowledgements"
            :key="index"
            class="ack-item"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="item-header">
              <div class="contributor-mark">
                <div class="mark-dot"></div>
                <div class="mark-line"></div>
              </div>
              <span class="contributor-name">{{ item.nickname }}</span>
            </div>

            <div class="item-content">
              <div class="content-quote">「</div>
              <p>{{ item.suggestion }}</p>
              <div class="content-quote">」</div>
            </div>

            <div class="item-divider"></div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="page-footer">
      <div class="footer-text">
        <p>© 2026 椿电子设定集</p>
        <p>每一份灵感都值得被铭记</p>
      </div>
    </footer>

    <!-- 浮动装饰 -->
    <div class="floating-elements">
      <div class="floating-petal petal-1">•</div>
      <div class="floating-petal petal-2">•</div>
      <div class="floating-petal petal-3">•</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 椿主题色变量
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

// 鸣谢数据
const acknowledgements = ref([
  {
    nickname: "赤雪",
    suggestion: "开屏欢迎语：欢迎进入一朵椿花的记忆",
  },
  {
    nickname: "赤雪",
    suggestion: "网站bgm",
  },
]);
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

.camellia-ack {
  min-height: 100vh;
  position: relative;
  background: $deep-shadow;
  color: $camellia-white;
  font-family: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", system-ui,
    sans-serif;
  overflow-x: hidden;
  padding-top: 80px;
}

// 简约背景层
.bg-layers {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  .bg-layer-1 {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at 20% 30%,
        rgba($camellia-red, 0.05) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba($vein-purple, 0.03) 0%,
        transparent 40%
      );
  }

  .bg-layer-2 {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba($camellia-dark-red, 0.02) 50%,
      transparent 100%
    );
  }
}

// 内容包装
.content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px 100px;

  @media (max-width: 768px) {
    padding: 32px 16px 80px;
  }
}

// 标题区域
.title-section {
  text-align: center;
  margin-bottom: 60px;

  .title-decoration {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 24px;

    .decoration-line {
      width: 60px;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($camellia-red, 0.3),
        transparent
      );

      @media (max-width: 480px) {
        width: 40px;
      }
    }

    .decoration-circle {
      width: 8px;
      height: 8px;
      border: 1px solid rgba($camellia-red, 0.4);
      border-radius: 50%;
    }
  }

  .main-title {
    margin: 0 0 12px 0;
    font-size: 32px;
    font-weight: 400;
    letter-spacing: 2px;
    color: $camellia-white;
    position: relative;
    display: inline-block;

    &::after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 1px;
      background: $camellia-red;
    }

    @media (max-width: 768px) {
      font-size: 28px;
    }

    @media (max-width: 480px) {
      font-size: 24px;
    }
  }

  .subtitle {
    margin: 0;
    color: rgba($camellia-white, 0.6);
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 1px;
  }
}

// 鸣谢列表区域
.acknowledgments-section {
  .empty-state {
    text-align: center;
    padding: 60px 20px;

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.4;
    }

    .empty-text {
      color: rgba($camellia-white, 0.5);
      font-size: 16px;
    }
  }

  .acknowledgments-list {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
}

// 鸣谢条目
.ack-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;

  .item-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .contributor-mark {
      position: relative;
      width: 24px;
      height: 24px;
      flex-shrink: 0;

      .mark-dot {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        background: $camellia-red;
        border-radius: 50%;
      }

      .mark-line {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 18px;
        height: 1px;
        background: rgba($camellia-red, 0.3);
      }
    }

    .contributor-name {
      color: $camellia-white;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 1px;
    }
  }

  .item-content {
    position: relative;
    padding: 0 8px;

    .content-quote {
      position: absolute;
      font-size: 24px;
      color: rgba($camellia-red, 0.3);
      font-family: serif;
      line-height: 1;

      &:first-child {
        top: -8px;
        left: 0;
      }

      &:last-child {
        bottom: -8px;
        right: 0;
      }
    }

    p {
      margin: 0;
      color: rgba($camellia-white, 0.8);
      font-size: 16px;
      line-height: 1.8;
      letter-spacing: 0.5px;
      padding: 0 16px;
    }
  }

  .item-divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba($camellia-red, 0.1),
      transparent
    );
    margin-top: 32px;
  }
}

// 页脚
.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  padding: 40px 20px;
  text-align: center;
  width: 100%;
  .footer-text {
    p {
      margin: 0;
      color: rgba($camellia-white, 0.4);
      font-size: 14px;
      line-height: 1.6;

      &:first-child {
        margin-bottom: 4px;
      }
    }
  }
}

// 浮动装饰元素
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  .floating-petal {
    position: absolute;
    color: rgba($camellia-red, 0.2);
    font-size: 12px;

    &.petal-1 {
      top: 20%;
      left: 10%;
      animation: float 12s ease-in-out infinite;
    }

    &.petal-2 {
      top: 60%;
      left: 85%;
      animation: float 15s ease-in-out infinite 3s;
    }

    &.petal-3 {
      top: 85%;
      left: 15%;
      animation: float 18s ease-in-out infinite 6s;
    }
  }
}

// 动画定义
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

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.2;
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(0) rotate(180deg);
    opacity: 0.2;
  }
  75% {
    transform: translateY(20px) rotate(270deg);
    opacity: 0.3;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .content-wrapper {
    padding: 32px 16px 80px;
  }

  .title-section {
    margin-bottom: 48px;
  }

  .acknowledgments-list {
    gap: 24px;
  }

  .ack-item {
    .item-header {
      .contributor-name {
        font-size: 16px;
      }
    }

    .item-content {
      p {
        font-size: 15px;
        line-height: 1.7;
        padding: 0 12px;
      }
    }

    .item-divider {
      margin-top: 24px;
    }
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 24px 12px 60px;
  }

  .title-section {
    margin-bottom: 40px;

    .title-decoration {
      gap: 16px;
    }

    .main-title {
      font-size: 24px;
    }

    .subtitle {
      font-size: 14px;
    }
  }

  .acknowledgments-list {
    gap: 20px;
  }

  .ack-item {
    .item-header {
      .contributor-name {
        font-size: 15px;
      }
    }

    .item-content {
      p {
        font-size: 14px;
        line-height: 1.6;
        padding: 0 8px;
      }
    }

    .item-divider {
      margin-top: 20px;
    }
  }
}

// 滚动条样式（可选）
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba($deep-shadow, 0.8);
}

::-webkit-scrollbar-thumb {
  background: rgba($camellia-red, 0.3);
  border-radius: 3px;

  &:hover {
    background: rgba($camellia-red, 0.4);
  }
}
</style>