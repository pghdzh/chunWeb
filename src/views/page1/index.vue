<template>
  <main class="camellia-container">
    <!-- 山茶花粒子画布 -->
    <canvas ref="canvasEl" class="camellia-canvas"></canvas>

    <!-- 动态背景系统 -->
    <div class="bg-gradient"></div>
    <div class="particle-overlay"></div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 标题区域 -->
      <div class="title-section">
        <div class="title-wrapper">
          <h1 class="main-title">
            <span
              class="title-char"
              v-for="(char, i) in titleChars"
              :key="i"
              :style="{ animationDelay: `${i * 0.05}s` }"
            >
              {{ char }}
            </span>
          </h1>
          <div class="subtitle">Camellya · Resonant Archive</div>
        </div>

        <!-- 动态副标题 -->
        <div class="typewriter-section">
          <div class="typewriter-box">
            <span class="typed-text">{{ typed }}</span>
            <span class="cursor">
              <span class="cursor-core"></span>
              <span class="cursor-glow"></span>
            </span>
          </div>
          <div
            class="progress-line"
            :style="{ width: spectrumWidth + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 血色波浪页脚 -->
    <footer class="wave-footer">
      <div class="wave-layer layer-1"></div>
      <div class="wave-layer layer-2"></div>
      <div class="wave-layer layer-3"></div>
      <div class="footer-content">
        <div class="footer-text">「命定之种，悄然绽放」</div>
      </div>
    </footer>

  
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import violet from "@/assets/violet.jpg";

// Canvas粒子系统
const canvasEl = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D;
let animationId: number;
let lastTime = 0;
let elapsed = 0;

interface Petal {
  x: number;
  y: number;
  size: number;
  speed: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  angle: number;
  angularSpeed: number;
  opacity: number;
  hue: number;
}

const petals: Petal[] = [];
const PETAL_COUNT_DESKTOP = 25;
const PETAL_COUNT_MOBILE = 12;
const PETAL_IMG = new Image();
PETAL_IMG.src = violet;

function initPetals(count: number) {
  petals.length = 0;
  const canvas = canvasEl.value!;
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);

  for (let i = 0; i < count; i++) {
    petals.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 40 + Math.random() * 50,
      speed: 20 + Math.random() * 30,
      swayAmp: 15 + Math.random() * 25,
      swayFreq: 0.3 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 1.5,
      opacity: 0.3 + Math.random() * 0.4,
      hue: 340 + Math.random() * 20,
    });
  }
  elapsed = 0;
}

let resizeTimeout: number;
function resizeCanvas() {
  window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    cancelAnimationFrame(animationId);
    const canvas = canvasEl.value!;
    const parent = canvas.parentElement!;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const isMobile = w < 768;
    initPetals(isMobile ? PETAL_COUNT_MOBILE : PETAL_COUNT_DESKTOP);
    lastTime = 0;
    animationId = requestAnimationFrame(tickCanvas);
  }, 200);
}

function tickCanvas(now: number) {
  if (!lastTime) lastTime = now;
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  elapsed += dt;

  const canvas = canvasEl.value!;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  // 创建渐变背景
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "rgba(26, 15, 15, 0.2)");
  gradient.addColorStop(1, "rgba(139, 0, 0, 0.1)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  petals.forEach((p) => {
    p.y -= p.speed * dt;
    p.x += p.swayAmp * Math.sin(p.phase + elapsed * p.swayFreq) * dt;
    p.angle += p.angularSpeed * dt;

    // 循环花瓣位置
    if (p.y < -p.size) {
      p.y = h + p.size;
      p.x = Math.random() * w;
    }
    if (p.x > w + p.size) p.x = -p.size;
    if (p.x < -p.size) p.x = w + p.size;

    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    // 绘制花瓣（使用图片或形状）
    if (PETAL_IMG.complete) {
      ctx.drawImage(PETAL_IMG, -p.size / 2, -p.size / 2, p.size, p.size);
    } else {
      // 备用：绘制粉色圆形
      ctx.fillStyle = `hsl(${p.hue}, 70%, 60%)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size / 3, p.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });

  animationId = requestAnimationFrame(tickCanvas);
}

// 标题字符动画
const titleChars = "椿 · Camellia".split("");

// 副标题打字机效果
const lines = [
  "为你盛放，亦为你凋零",
  "双生之舞，一念纯白，一念赤红",
  "本能即本质，追寻即宿命",
  "于黑海岸边，静候你的归来",
  "危险的甜美，致命的吸引",
  "共鸣失控，理性崩坏",
  "白色伪装下，血色在蔓延",
  "触碰我吧，然后一起沉沦",
  "我的存在，即是你的劫难",
  "这一次，请别逃开...",
];

const typed = ref("");
let lineIndex = 0;
let charIndex = 0;
let deleting = false;
let textTimer: number | null = null;
const spectrumWidth = ref(0);

function typeText() {
  const cur = lines[lineIndex];
  if (!deleting) {
    typed.value = cur.slice(0, charIndex + 1);
    charIndex++;
    spectrumWidth.value = (charIndex / cur.length) * 100;

    if (charIndex >= cur.length) {
      textTimer = window.setTimeout(() => {
        deleting = true;
        typeText();
      }, 2000);
      return;
    }
    textTimer = window.setTimeout(typeText, 100);
  } else {
    typed.value = cur.slice(0, charIndex - 1);
    charIndex--;
    spectrumWidth.value = (charIndex / cur.length) * 100;

    if (charIndex <= 0) {
      deleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
      textTimer = window.setTimeout(typeText, 500);
      return;
    }
    textTimer = window.setTimeout(typeText, 50);
  }
}


// 生命周期
onMounted(() => {
  // 初始化文本动画
  textTimer = window.setTimeout(typeText, 800);

  // 初始化画布
  const canvas = canvasEl.value!;
  ctx = canvas.getContext("2d")!;

  PETAL_IMG.onload = () => {
    resizeCanvas();
  };
  window.addEventListener("resize", resizeCanvas);
});

onBeforeUnmount(() => {
  if (textTimer) window.clearTimeout(textTimer);
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", resizeCanvas);
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
$danger-glow: #ff1a1a;

.camellia-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(
    135deg,
    $deep-shadow 0%,
    #2a1a1a 50%,
    $deep-shadow 100%
  );
  color: $camellia-white;
  font-family: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", sans-serif;
  overflow: hidden;
}

// 背景渐变层
.bg-gradient {
  position: absolute;
  inset: 0;
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
    linear-gradient(180deg, rgba($deep-shadow, 0.9) 0%, rgba(#2a1a1a, 0.8) 100%);
  z-index: 0;
}

// 粒子覆盖层
.particle-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent 0px,
    transparent 1px,
    rgba($camellia-light-red, 0.03) 2px,
    rgba($camellia-light-red, 0.03) 3px
  );
  z-index: 1;
  pointer-events: none;
}

// Canvas 画布
.camellia-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

// 主内容区域
.main-content {
  position: relative;
  z-index: 3;
  min-height: calc(100vh - 120px);
  padding: 2rem 1.5rem 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

// 标题区域
.title-section {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;

  .title-wrapper {
    margin-bottom: 2rem;
  }
}

.main-title {
  font-family: "Noto Serif SC", "Songti SC", serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.1em;

  .title-char {
    display: inline-block;
    opacity: 0;
    transform: translateY(20px) rotateX(90deg);
    background: linear-gradient(
      135deg,
      $camellia-cream 0%,
      $camellia-light-red 50%,
      $blood-crimson 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 2px 4px rgba($blood-crimson, 0.3),
      0 0 20px rgba($camellia-light-red, 0.2);
    animation: charAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

    &:nth-child(1) {
      color: $camellia-light-red;
    }
    &:nth-child(3) {
      margin-left: 0.2em;
      color: $gold-glow;
    }
  }
}

.subtitle {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 300;
  letter-spacing: 0.3em;
  color: rgba($camellia-white, 0.7);
  text-transform: uppercase;
  margin-top: 0.5rem;
  opacity: 0;
  animation: fadeInUp 0.8s ease 0.8s forwards;
}

// 打字机区域
.typewriter-section {
  background: rgba($deep-shadow, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba($camellia-red, 0.2);
  box-shadow: 0 8px 32px rgba($blood-crimson, 0.1),
    inset 0 1px 0 rgba($camellia-white, 0.1);
  max-width: 600px;
  margin: 0 auto;

  .typewriter-box {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px;
    padding: 0.5rem;
  }

  .typed-text {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    font-weight: 400;
    color: $camellia-cream;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1.5;
    min-height: 1.5em;
  }

  .cursor {
    position: relative;
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
    height: 1.5em;

    .cursor-core {
      width: 3px;
      height: 1.2em;
      background: $camellia-red;
      border-radius: 1px;
      animation: blink 1.2s infinite;
    }

    .cursor-glow {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      background: $camellia-red;
      border-radius: 50%;
      filter: blur(6px);
      opacity: 0.4;
      animation: pulse 1.2s infinite;
    }
  }

  .progress-line {
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      $camellia-red 20%,
      $gold-glow 50%,
      $camellia-red 80%,
      transparent
    );
    border-radius: 1px;
    transition: width 0.3s ease;
    margin-top: 1rem;
  }
}

// 波浪页脚
.wave-footer {
  position: relative;
  height: 120px;
  width: 100%;
  margin-top: auto;
  overflow: hidden;

  .wave-layer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background-repeat: repeat-x;
    background-size: 50% 100%;
  }

  .layer-1 {
    background-image: linear-gradient(
      to bottom,
      rgba($camellia-red, 0.8),
      rgba($camellia-dark-red, 0.6)
    );
    animation: waveMove 20s linear infinite;
    z-index: 1;
    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 C200,10 400,110 600,60 C800,10 1000,110 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E");
    mask-repeat: repeat-x;
  }

  .layer-2 {
    background-image: linear-gradient(
      to bottom,
      rgba($blood-crimson, 0.6),
      rgba($deep-shadow, 0.4)
    );
    animation: waveMove 25s linear infinite;
    z-index: 2;
    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,80 C300,40 600,100 900,60 C1000,40 1100,80 1200,60 L1200,100 L0,100 Z'/%3E%3C/svg%3E");
    mask-repeat: repeat-x;
    animation-delay: -5s;
  }

  .layer-3 {
    background-image: linear-gradient(
      to bottom,
      rgba($camellia-light-red, 0.4),
      transparent
    );
    animation: waveMove 30s linear infinite;
    z-index: 3;
    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,40 C400,20 800,60 1200,40 L1200,80 L0,80 Z'/%3E%3C/svg%3E");
    mask-repeat: repeat-x;
    animation-delay: -10s;
  }

  .footer-content {
    position: absolute;
    bottom: 1.5rem;
    left: 0;
    width: 100%;
    text-align: center;
    z-index: 4;

    .footer-text {
      color: rgba($camellia-cream, 0.8);
      font-size: 0.9rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
  }
}


// 动画定义
@keyframes charAppear {
  from {
    opacity: 0;
    transform: translateY(20px) rotateX(90deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.2;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes waveMove {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes floatReverse {
  0% {
    transform: translateY(100vh) rotate(0deg) scaleX(-1);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100vh) rotate(-360deg) scaleX(-1);
    opacity: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem 1rem 6rem;
    padding-top: 80px;
  }

  .main-title {
    gap: 0.2rem;
  }

  .typewriter-section {
    padding: 1rem;
    border-radius: 16px;

    .typed-text {
      font-size: 1rem;
    }
  }

  .feature-card {
    padding: 1rem;

    .feature-icon {
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
    }
  }

  .wave-footer {
    height: 100px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.8rem;
    letter-spacing: 0.2em;
  }

  .typewriter-section {
    .typed-text {
      font-size: 0.9rem;
    }
  }
}

// 暗黑模式适配
@media (prefers-color-scheme: dark) {
  .bg-gradient {
    background: radial-gradient(
        circle at 20% 30%,
        rgba($camellia-red, 0.2) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba($vein-purple, 0.15) 0%,
        transparent 40%
      ),
      linear-gradient(
        180deg,
        rgba($deep-shadow, 0.95) 0%,
        rgba(#1f1212, 0.9) 100%
      );
  }
}
</style>