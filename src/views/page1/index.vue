<template>
    <main class="home">
        <canvas ref="canvasEl" class="rose-canvas"></canvas>
        <!-- 背景轮播放在最底层 -->
        <div class="carousel carousel1">
            <img v-for="(src, idx) in randomFive" :key="idx" :src="src" class="carousel-image"
                :class="{ active: idx === currentIndex }" />
        </div>
        <div class="carousel carousel2">
            <img v-for="(src, idx) in randomFive2" :key="idx" :src="src" class="carousel-image"
                :class="{ active: idx === currentIndex }" />
        </div>
        <section class="center" role="main">
            <h1 class="title">命定之种 · 椿</h1>

            <div class="subtitle" aria-live="polite">
                <span class="typed">{{ typed }}</span><span class="cursor" aria-hidden="true">|</span>
            </div>

        </section>

        <!-- 页脚波浪：SVG 内部已做 duplicate（translate(1200,0)）实现无缝循环 -->
        <footer class="footer-wave-3" aria-hidden="true">
            <svg class="wave wave1" viewBox="0 0 1200 100" preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#ff4f4f" />
                        <stop offset="100%" stop-color="#800000" />
                    </linearGradient>
                </defs>

                <!-- 原始 path -->
                <path d="M0,40 C300,140 900,-20 1200,60 L1200,100 L0,100 Z" fill="url(#waveGrad3)" />
                <!-- duplicate：向右平移一整宽（1200）实现无缝衔接 -->
                <path d="M0,40 C300,140 900,-20 1200,60 L1200,100 L0,100 Z" transform="translate(1200,0)"
                    fill="url(#waveGrad3)" />
            </svg>

            <svg class="wave wave2" viewBox="0 0 1200 100" preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg">
                <!-- 原始 path -->
                <path d="M0,50 C400,0 800,150 1200,50 L1200,100 L0,100 Z" fill="rgba(255,79,79,0.6)" />
                <!-- duplicate -->
                <path d="M0,50 C400,0 800,150 1200,50 L1200,100 L0,100 Z" transform="translate(1200,0)"
                    fill="rgba(255,79,79,0.6)" />
            </svg>

            <svg class="wave wave3" viewBox="0 0 1200 100" preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg">
                <!-- 原始 path -->
                <path d="M0,30 C200,80 1000,20 1200,70 L1200,100 L0,100 Z" fill="rgba(255,79,79,0.3)" />
                <!-- duplicate -->
                <path d="M0,30 C200,80 1000,20 1200,70 L1200,100 L0,100 Z" transform="translate(1200,0)"
                    fill="rgba(255,79,79,0.3)" />
            </svg>
        </footer>

    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import violet from '@/assets/violet.png'



const canvasEl = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D
let animationId: number
let lastTime = 0
let elapsed = 0

interface Rose {
    baseX: number
    y: number
    size: number
    speed: number
    swayAmp: number
    swayFreq: number
    phase: number
    angle: number
    angularSpeed: number
}

const roses: Rose[] = []
const ROSE_COUNT_DESKTOP = 20
const ROSE_COUNT_MOBILE = 8
const ROSE_IMG = new Image()
ROSE_IMG.src = violet

function initRoses(count: number) {
    roses.length = 0
    const canvas = canvasEl.value!
    const w = canvas.width / (window.devicePixelRatio || 1)
    const h = canvas.height / (window.devicePixelRatio || 1)

    for (let i = 0; i < count; i++) {
        const baseX = Math.random() * w
        roses.push({
            baseX,
            y: Math.random() * -h,
            size: 30 + Math.random() * 40,
            speed: 30 + Math.random() * 70,
            swayAmp: 20 + Math.random() * 20,
            swayFreq: 0.5 + Math.random() * 1,
            phase: Math.random() * Math.PI * 2,
            angle: Math.random() * Math.PI * 2,
            angularSpeed: (Math.random() - 0.5) * 2
        })
    }
    elapsed = 0
}

let resizeTimeout: number
function resizeCanvas() {
    window.clearTimeout(resizeTimeout)
    resizeTimeout = window.setTimeout(() => {
        cancelAnimationFrame(animationId)
        const canvas = canvasEl.value!
        const parent = canvas.parentElement!
        const dpr = window.devicePixelRatio || 1
        const w = parent.clientWidth
        const h = parent.clientHeight

        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
        canvas.width = w * dpr
        canvas.height = h * dpr

        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(dpr, dpr)

        const isMobile = w < 768
        initRoses(isMobile ? ROSE_COUNT_MOBILE : ROSE_COUNT_DESKTOP)
        lastTime = 0
        animationId = requestAnimationFrame(tickCanvas)
    }, 200)
}

function tickCanvas(now: number) {
    if (!lastTime) lastTime = now
    const dt = (now - lastTime) / 1000
    lastTime = now
    elapsed += dt

    const canvas = canvasEl.value!
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    ctx.clearRect(0, 0, w, h)

    roses.forEach(r => {
        r.y += r.speed * dt
        const sway = r.swayAmp * Math.sin(r.phase + elapsed * r.swayFreq)
        const x = r.baseX + sway
        r.angle += r.angularSpeed * dt

        if (r.y > h + r.size) {
            r.y = -r.size
            r.baseX = Math.random() * w
            r.phase = Math.random() * Math.PI * 2
        }

        if (x > w + r.size || x < -r.size) return


        // 计算透明度
        const alpha = 1 - (r.y / h) * 0.5;
        // 限制 alpha 在 [0,1] 之间（可选）
        const clampedAlpha = Math.max(0, Math.min(1, alpha));
        ctx.save()
        ctx.globalAlpha = clampedAlpha;
        ctx.translate(x, r.y)
        ctx.rotate(r.angle)
        ctx.drawImage(ROSE_IMG, -r.size / 2, -r.size / 2, r.size, r.size)
        ctx.restore()
    })

    animationId = requestAnimationFrame(tickCanvas)
}




// 固定要循环的副标题句子（写死）
const lines = [
    '为你盛放，亦为你凋零',
    '双生之舞，一念纯白，一念赤红',
    '本能即本质，追寻即宿命 ',
    '于黑海岸边，静候你的归来 ',
    '在无人知晓的秘密小径',
    '呼唤那沉默之花的芬芳',
    '一根荆棘胜过千颗花种',
    '它的根茎持续到永恒中',
    '将那无限置于你的手掌',
    '为你的千千万万次盛放'
];

const typed = ref('');
let lineIndex = 0;
let charIndex = 0;
let deleting = false;
let timer: number | null = null;

const TYPING = 200;     // 打字速度（ms/字符）
const DELETING = 35;   // 删除速度
const PAUSE = 1000;    // 完成后停留时间

function tick() {
    const cur = lines[lineIndex];
    if (!deleting) {
        typed.value = cur.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex >= cur.length) {
            timer = window.setTimeout(() => { deleting = true; tick(); }, PAUSE);
            return;
        }
        timer = window.setTimeout(tick, TYPING);
    } else {
        typed.value = cur.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex <= 0) {
            deleting = false;
            lineIndex = (lineIndex + 1) % lines.length;
            timer = window.setTimeout(tick, 300);
            return;
        }
        timer = window.setTimeout(tick, DELETING);
    }
}



// 1. 全量导入横图，直接映射成 string[]
const modules = import.meta.glob("@/assets/images1/*.{jpg,png,jpeg,webp}", {
    eager: true,
});
const allSrcs: string[] = Object.values(modules).map((mod: any) => mod.default);

// 1. 全量导入竖图，直接映射成 string[]
const modules2 = import.meta.glob("@/assets/images2/*.{jpg,png,jpeg,webp}", {
    eager: true,
});
const allSrcs2: string[] = Object.values(modules2).map((mod: any) => mod.default);

// 2. 洗牌并取 5 张
function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
const randomFive = ref<string[]>(shuffle(allSrcs).slice(0, 5));
const randomFive2 = ref<string[]>(shuffle(allSrcs2).slice(0, 5));

const currentIndex = ref(0);
let Imgtimer: number;


onMounted(() => {
    timer = window.setTimeout(tick, 500);
    Imgtimer = window.setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % 5;
    }, 5000);

    const canvas = canvasEl.value!
    ctx = canvas.getContext('2d')!

    ROSE_IMG.onload = () => {
        resizeCanvas()
    }
    window.addEventListener('resize', resizeCanvas)
});

onBeforeUnmount(() => {
    clearInterval(Imgtimer);
    if (timer) window.clearTimeout(timer);

    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resizeCanvas)
});

</script>

<style lang="scss" scoped>
/* 固定配色（写死） */
$bg-dark: #05060a;
$ice-blue: #bff7ff;
$neon-pink: #ff66c4;
$violet: #7a39ff;
$gold: #ffd580;
$text: #eef6fb;

.home {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #05060a;
    color: $text;
    font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Noto Sans CJK SC', sans-serif;

    .rose-canvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        pointer-events: none;
    }

    .carousel {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;

        &::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.1);
            pointer-events: none;
            z-index: 1;
        }

        .carousel-image {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 1s ease;
            filter: blur(1px);

            &.active {
                opacity: 1;
            }
        }
    }


    .carousel2 {
        display: none;
    }

}

.center {
    position: relative; // 新增：为绝对定位的 ::before 做参照
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px 18px;
    gap: 18px;

   
    &::before {
        content: "";
        position: absolute;
        inset: 12px;
        border-radius: 12px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.15));
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        z-index: 2;
        pointer-events: none;
    }

    .title {
        z-index: 9;

        font-size: 2rem;
        margin: 0;
        font-weight: 800;
        line-height: 1;
        background: linear-gradient(90deg, #fff0f2 0%, #ff4f4f 40%, #9e1820 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 10px 40px rgba(158, 24, 32, 0.18);

    }

    .subtitle {
        font-size: 1.05rem;
        min-height: 1.6em; // 保证高度稳定
        color: #ffc7cc;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        z-index: 9;

        .typed {
            display: inline-block;
            white-space: nowrap;
            letter-spacing: 0.6px;
            font-weight: 600;
        }

        .cursor {
            display: inline-block;
            width: 10px;
            height: 1.05em;
            margin-left: 4px;
            background: linear-gradient(180deg, $ice-blue, $neon-pink);
            border-radius: 2px;
            animation: blink 1s steps(1) infinite;
        }
    }

}

.footer-wave-3 {
    position: relative;
    width: 100%;
    height: 120px;
    margin-top: -125px;
    overflow: hidden;

    .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 200%;
        height: 100%;
        transform: translateX(0);
    }

    .wave1 {
        animation: waveMove 16s linear infinite;
        z-index: 1;
    }

    .wave2 {
        animation: waveMove 24s linear infinite;
        z-index: 2;
        animation-delay: -4s;
    }

    .wave3 {
        animation: waveMove 32s linear infinite;
        z-index: 3;
        animation-delay: -8s;
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

@keyframes blink {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@media (max-width: 720px) {
    .home {
        .carousel1 {
            display: none;
        }

        .carousel2 {
            display: block;
        }
    }

    .center {
        padding: 20px 14px;

        .title {
            font-size: 1.5rem;
        }

        .subtitle {
            font-size: 0.98rem;
        }
    }


}
</style>
