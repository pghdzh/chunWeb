<template>
  <div class="megumi-message-board" aria-live="polite">
    <!-- 半透明顶部标题 -->
    <header class="board-header" role="banner">
      <div class="title-wrap">
        <h1>留言板</h1>
        <span>(共{{ messages.length }}条)</span>
        <p class="subtitle">在夜色里盛放，静候你的归来。</p>
      </div>
    </header>

    <!-- 留言展示区 -->
    <section class="message-list">
      <transition-group name="msg" tag="div" class="message-list-inner">
        <!-- messages -->
        <div
          v-for="(msg, idx) in messages"
          :key="msg.id || msg._tempId || idx"
          class="message-card"
          :data-index="idx"
          tabindex="0"
          role="article"
          :aria-label="`留言来自 ${msg.name || '匿名'}，内容：${msg.content}`"
        >
          <div class="message-meta">
            <div class="left-meta">
              <div class="name-avatar" :title="msg.name || '匿名'">
                {{ getInitial(msg.name) }}
              </div>
              <div class="meta-texts">
                <div class="message-name">{{ msg.name || "匿名" }}</div>
                <div class="message-time">{{ formatTime(msg.created_at) }}</div>
              </div>
            </div>
          </div>

          <p class="message-content">{{ msg.content }}</p>
        </div>
      </transition-group>
    </section>

    <!-- 底部发送区 -->
    <section class="message-form" aria-label="写下你的留言">
      <label class="sr-only" for="mb-name">你的昵称</label>
      <input
        id="mb-name"
        v-model="name"
        type="text"
        placeholder="你的昵称"
        @keydown.enter.prevent
      />

      <label class="sr-only" for="mb-content">留言内容</label>
      <textarea
        id="mb-content"
        v-model="content"
        placeholder="写下你的留言..."
        @keydown.ctrl.enter.prevent="submitMessage"
        @input="autoGrow"
        ref="textareaRef"
      />

      <div class="form-row">
        <div class="hint">按 <kbd>Ctrl</kbd> + <kbd>Enter</kbd> 快捷发送</div>
        <button @click="submitMessage" :disabled="isSending || !content.trim()">
          <span v-if="!isSending">发送</span>
          <span v-else>发送中…</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { getMessageList, createMessage } from "@/api/modules/message";

const messages = ref<any[]>([]);
const name = ref(localStorage.getItem("chun_name") || "");
const content = ref("");

const isSending = ref(false);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const fetchMessages = async () => {
  try {
    const res = await getMessageList({ page: 1, pageSize: 9999 });
    messages.value = res.data || [];
  } catch (err) {
    console.error(err);
  } finally {
  }
};

const submitMessage = async () => {
  if (!content.value.trim() || isSending.value) return;
  isSending.value = true;
  const payload = { name: name.value || "匿名", content: content.value };
  try {
    localStorage.setItem("chun_name", name.value);
    content.value = "";
    await nextTick();
    // 发送请求
    await createMessage(payload);
    // 重新同步列表（更可靠）
    await fetchMessages();
  } catch (err) {
    console.error(err);
  } finally {
    isSending.value = false;
  }
};

const formatTime = (time: string) => {
  if (!time) return "";
  const d = new Date(time);
  // 例如：2025-08-11 15:30
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

const getInitial = (n?: string) => {
  if (!n) return "匿";
  return n.trim().slice(0, 1).toUpperCase();
};

const autoGrow = (e?: Event) => {
  const ta = textareaRef.value;
  if (!ta) return;
  ta.style.height = "auto";
  const h = Math.min(ta.scrollHeight, 220);
  ta.style.height = h + "px";
};

onMounted(() => {
  fetchMessages();
  // ensure textarea autosize initial
  nextTick(() => autoGrow());
});
</script>

<style scoped lang="scss">
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
$glass-white: rgba(248, 245, 242, 0.85);
$glass-red: rgba(211, 47, 47, 0.12);
$shadow-soft: rgba(139, 0, 0, 0.08);
$shadow-medium: rgba(139, 0, 0, 0.16);
$shadow-heavy: rgba(139, 0, 0, 0.24);

@keyframes petalFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(3deg);
  }
}

@keyframes shimmer {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.3;
  }
}

@keyframes glowPulse {
  0%,
  100% {
    box-shadow: 0 8px 32px rgba($blood-crimson, 0.2);
  }
  50% {
    box-shadow: 0 12px 48px rgba($blood-crimson, 0.3);
  }
}

.megumi-message-board {
  min-height: 100vh;
  padding: 88px 0 180px;
  background: linear-gradient(
    135deg,
    rgba($camellia-cream, 2%) 0%,
    $camellia-cream 30%,
    rgba($camellia-cream, 1%) 100%
  );
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "PingFang SC", "Noto Sans SC", sans-serif;
  color: $deep-shadow;
  position: relative;
  overflow-x: hidden;

  // 背景装饰元素
  &::before,
  &::after {
    content: "";
    position: fixed;
    pointer-events: none;
    z-index: 1;
  }

  &::before {
    top: -10%;
    right: -10%;
    width: 40%;
    height: 40%;
    background: radial-gradient(
      circle,
      rgba($camellia-light-red, 0.06) 0%,
      transparent 70%
    );
  }

  &::after {
    bottom: -10%;
    left: -10%;
    width: 30%;
    height: 30%;
    background: radial-gradient(
      circle,
      rgba($vein-purple, 0.04) 0%,
      transparent 70%
    );
  }
}

.board-header {
  padding: 20px 24px;
  background: $glass-white;
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba($camellia-red, 0.1);
  z-index: 100;
  box-shadow: 0 4px 24px $shadow-soft;

  .title-wrap {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: $camellia-dark-red;
      background: linear-gradient(135deg, $camellia-red, $blood-crimson);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    span {
      font-size: 0.95rem;
      color: $camellia-red;
      font-weight: 500;
      opacity: 0.8;
    }

    .subtitle {
      margin: 0 0 0 auto;
      font-size: 0.9rem;
      color: $camellia-red;
      font-style: italic;
      font-weight: 500;
      opacity: 0.8;
      white-space: nowrap;
    }
  }
}

.message-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;

  .message-list-inner {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.message-card {
  background: $camellia-white;
  border-radius: 18px;
  padding: 20px 24px 20px 32px;
  box-shadow: 0 8px 32px $shadow-soft, 0 2px 8px rgba(255, 255, 255, 0.5) inset;
  border: 1px solid rgba($camellia-red, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 16px;
    bottom: 16px;
    width: 4px;
    background: linear-gradient(180deg, $camellia-red, $blood-crimson);
    border-radius: 0 4px 4px 0;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba($camellia-red, 0.02) 50%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px $shadow-medium,
      0 4px 16px rgba(255, 255, 255, 0.6) inset;

    &::after {
      opacity: 1;
      animation: petalFloat 3s ease-in-out infinite;
    }
  }

  &:focus-within {
    outline: 2px solid rgba($camellia-red, 0.3);
    outline-offset: 2px;
  }
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;

  .left-meta {
    display: flex;
    align-items: center;
    gap: 16px;

    .name-avatar {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: 700;
      color: $camellia-white;
      background: linear-gradient(135deg, $camellia-red, $blood-crimson);
      box-shadow: 0 4px 12px rgba($blood-crimson, 0.3),
        0 2px 4px rgba(255, 255, 255, 0.3) inset;
      flex-shrink: 0;
      transition: transform 0.3s ease;

      .message-card:hover & {
        transform: scale(1.05) rotate(5deg);
      }
    }

    .meta-texts {
      .message-name {
        font-size: 1.1rem;
        font-weight: 700;
        color: $camellia-dark-red;
        margin-bottom: 4px;
      }

      .message-time {
        font-size: 0.85rem;
        color: rgba($camellia-dark-red, 20%);
        font-weight: 500;
      }
    }
  }
}

.message-content {
  font-size: 1rem;
  line-height: 1.7;
  color: $deep-shadow;
  margin: 0;
  padding-left: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  position: relative;
  z-index: 1;
}

.message-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    $glass-white 20%,
    $glass-white 100%
  );
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba($camellia-red, 0.1);
  z-index: 100;
  box-shadow: 0 -4px 32px $shadow-soft;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, transparent, $glass-white);
    pointer-events: none;
  }

  #mb-name,
  #mb-content {
    max-width: 800px;
    margin: 0 auto;
    display: block;
    width: 100%;
    padding: 16px 20px;
    background: $camellia-white;
    border: 2px solid rgba($camellia-red, 0.15);
    border-radius: 14px;
    font-size: 1rem;
    color: $deep-shadow;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px $shadow-soft;

    &:focus {
      outline: none;
      border-color: $camellia-red;
      box-shadow: 0 0 0 3px rgba($camellia-red, 0.1), 0 8px 24px $shadow-medium;
      transform: translateY(-2px);
    }

    &::placeholder {
      color: rgba($camellia-dark-red, 30%);
    }
  }

  #mb-name {
    margin-bottom: 12px;
  }

  #mb-content {
    min-height: 100px;
    max-height: 300px;
    resize: vertical;
    margin-bottom: 20px;
    line-height: 1.6;
  }
}

.form-row {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .hint {
    font-size: 0.9rem;
    color: $camellia-red;
    opacity: 0.8;
    display: flex;
    align-items: center;
    gap: 8px;

    kbd {
      padding: 4px 8px;
      background: $camellia-white;
      border: 1px solid rgba($camellia-red, 0.2);
      border-radius: 6px;
      font-size: 0.85rem;
      color: $camellia-dark-red;
      box-shadow: 0 2px 4px $shadow-soft;
    }
  }

  button {
    padding: 12px 32px;
    background: linear-gradient(135deg, $camellia-red, $blood-crimson);
    color: $camellia-white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba($blood-crimson, 0.3);
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

    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba($blood-crimson, 0.4);
      animation: glowPulse 2s ease-in-out infinite;

      &::before {
        left: 100%;
      }
    }

    &:active:not(:disabled) {
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
  }
}

// 消息动画效果
.msg-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.msg-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.msg-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.msg-move {
  transition: transform 0.5s ease;
}

// 屏幕阅读器专用样式
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

// 移动端适配
@media (max-width: 768px) {
  .megumi-message-board {
    padding: 88px 0 200px;
  }

  .board-header {
    padding: 16px 20px;

    .title-wrap {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .subtitle {
        margin: 0;
        align-self: flex-start;
      }
    }
  }

  .message-list {
    padding: 0 16px;
  }

  .message-card {
    padding: 16px 20px 16px 28px;
    border-radius: 14px;

    &::before {
      top: 12px;
      bottom: 12px;
    }

    .message-meta .left-meta {
      gap: 12px;

      .name-avatar {
        width: 44px;
        height: 44px;
        font-size: 1rem;
      }

      .meta-texts {
        .message-name {
          font-size: 1rem;
        }
        .message-time {
          font-size: 0.8rem;
        }
      }
    }
  }

  .message-form {
    padding: 16px 20px;

    #mb-name,
    #mb-content {
      padding: 14px 16px;
      font-size: 0.95rem;
    }

    #mb-content {
      min-height: 80px;
    }
  }

  .form-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;

    .hint {
      order: 2;
      justify-content: center;
    }

    button {
      order: 1;
      width: 100%;
      padding: 14px;
    }
  }
}

@media (max-width: 480px) {
  .message-card {
    padding: 14px 16px 14px 24px;
    border-radius: 12px;

    .message-meta .left-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .name-avatar {
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>