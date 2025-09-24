<template>
  <div class="megumi-page" aria-live="polite">
    <main class="container" ref="mainContainer">
      <!-- HERO -->
      <header class="hero" role="banner" aria-label="椿 · 角色头部">
        <!-- 装饰花瓣层（纯样式） -->
        <div class="hero-decor" aria-hidden="true"></div>

        <div class="left-col">
          <button class="avatar-card" aria-label="椿 头像卡片">
            <picture class="avatar-wrap">
              <img
                src="@/assets/images1/QQ20250923-103501.webp"
                alt="珂莱塔 头像"
                class="avatar"
                loading="lazy"
                decoding="async"
              />
            </picture>

            <div class="avatar-meta">
              <span class="avatar-badge">共鸣能力 · 红椿盛放</span>
            </div>
          </button>

          <!-- 小摘要卡（移动端显示） -->
          <div class="mini-lead" aria-hidden="false">
            <p>
              自由随性，自有一种危险的吸引力。她相信命运的牵系，且乐意顺着它游走世间。
            </p>
          </div>
        </div>

        <div class="right-col" ref="metaCard">
          <div class="hero-panel">
            <h1 class="name">椿 <span class="jp">（黑海岸执花）</span></h1>

            <!-- 以椿视角的副标题（你之前要求的第一人称稍长句） -->
            <p class="subtitle">我把花瓣折成刀锋，微笑着切开夜的边界。</p>

            <p class="lead">
              自由随性，自有一种“危险”的吸引力。她相信这个世界中存在着命运既定的牵系，且乐意顺着这份牵引愉快地游走世间。
            </p>
          </div>
        </div>
      </header>

      <!-- 其余内容保持原样 -->
      <section id="personality" class="card personality">
        <div class="card-head">
          <h2>核心机制</h2>
        </div>

        <ul class="traits">
          <li>
            【红椿·蕊】：血条上方上限100点的特殊能量条，通过常态攻击，长按A，E1E2消耗。在变奏入场或者施放共鸣回路一日花时，回复100点【红椿·蕊】。
            在普通状态下，消耗【红椿·蕊】会将攻击的基础共鸣能量回复效率提升150%，同时每消耗10点【红椿·蕊】，回复4点协奏能量并获得1层【红椿·蕾】。
            在【含苞状态】下，消耗【红椿·蕊】会将攻击的伤害倍率提升50%，同时攻击的基础共鸣能量回复效率会降低为0%。
          </li>
          <li>
            【红椿·蕾】：能量条上方的一个buff显示，像小火苗的六边形，上限10层，随着消耗【红椿·蕊】增加。
          </li>
          <li>
            【一日花】：攒满协奏能量后，共鸣技能会高亮提示可以使用【一日花】。施放一日花后，清除所有【红椿·蕾】，进入【含苞状态】，每层红椿·蕾使【含苞状态】期间的伤害倍率提升效果额外提升5%，最多可额外提升50%。
          </li>
          <li>
            【含苞状态】：协奏圈右边会有一朵花的形态，该状态是椿的爆发输出期间。
          </li>
          <li>
            【红椿盛绽】：共鸣技能会使椿在白头发的椿和红头发的椿来回切换，白椿更擅长对单和追击，红椿更擅长对群和打桩。
          </li>
        </ul>

        <blockquote class="quote">
          基础流程：变奏入场-E-AAAA-E-R-【一日花】E-Z-E
          <br />(普攻--A，重击--Z，共鸣技能--E，共鸣解放--R，声骸--Q)
        </blockquote>
      </section>

      <section id="overview" class="card overview">
        <div class="card-head">
          <h2>配队</h2>
        </div>

        <div class="grid two-col">
          <div class="team">
            <h3>椿洛守</h3>
            <ul>
              <li><img src="@/assets/avatar/chun.webp" alt="" /></li>
              <li><img src="@/assets/avatar/luokeke.webp" alt="" /></li>
              <li><img src="@/assets/avatar/shouanren.webp" alt="" /></li>
            </ul>
          </div>

          <div class="team">
            <h3>椿散守</h3>
            <ul>
              <li><img src="@/assets/avatar/chun.webp" alt="" /></li>
              <li><img src="@/assets/avatar/sanhua.webp" alt="" /></li>
              <li><img src="@/assets/avatar/shouanren.webp" alt="" /></li>
            </ul>
          </div>

          <div class="team">
            <h3>椿散维</h3>
            <ul>
              <li><img src="@/assets/avatar/chun.webp" alt="" /></li>
              <li><img src="@/assets/avatar/sanhua.webp" alt="" /></li>
              <li><img src="@/assets/avatar/akijueyuan.webp" alt="" /></li>
            </ul>
          </div>
        </div>
      </section>

      <section
        id="timeline"
        class="card timeline"
        aria-labelledby="timeline-heading"
      >
        <div class="card-head">
          <h2 id="timeline-heading">共鸣链详解 · 提升</h2>
        </div>

        <div class="tl-wrap" role="list">
          <!-- 中心线（视觉） -->
          <div class="vl" aria-hidden="true"></div>

          <ol class="tl-list">
            <li
              v-for="(ev, i) in timeline"
              :key="i"
              class="tl-item"
              role="listitem"
              tabindex="0"
              aria-label="第 {{ i + 1 }} 链 · {{ ev.title }}"
            >
              <div class="tl-card">
                <h3 class="tl-title">
                  {{ ev.title }}
                  <span class="tl-meta" aria-hidden="true"
                    >（提升 {{ ev.time }}）</span
                  >
                </h3>
                <p class="tl-desc">{{ ev.desc }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/* 你的脚本逻辑保持不变（我这里保留你原始的 onMounted/gsap/timeline 等） */
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const timeline = ref([
  {
    time: "7.58%",
    title: "在无人知晓的秘密小径",
    desc: "施放变奏技能八千春秋时，暴击伤害提升28%，持续18秒，每25秒可触发1次。共鸣回路一日花免疫打断。",
  },
  {
    time: "26.3%",
    title: "呼唤那沉默之花的芬芳",
    desc: "共鸣回路一日花伤害倍率提升120%。",
  },
  {
    time: "18.4%",
    title: "一根荆棘胜过千颗花种",
    desc: "共鸣解放芳华绽烬伤害倍率提升50%；含苞状态期间，椿的攻击提升58%。",
  },
  {
    time: "6.3%",
    title: "它的根茎持续到永恒中",
    desc: "施放变奏技能八千春秋后，队伍中的角色普攻伤害加成提升25%，持续30秒。",
  },
  {
    time: "8.5%",
    title: "将那无限置于你的手掌",
    desc: "变奏技能八千春秋伤害倍率提升303%。延奏技能缠绕伤害倍率提升68%。",
  },
  {
    time: "87.5%",
    title: "为你的千千万万次盛放",
    desc: "共鸣回路酣梦的伤害倍率提升效果额外提升150%；共鸣回路永生花：施放共鸣回路一日花后15秒内，协奏能量充满时，若永生花不处于冷却状态，共鸣技能替换为永生花。施放永生花时，消耗50点协奏值，回复50点【红椿·蕊】，造成共鸣回路一日花100%的湮灭伤害，此次伤害为普攻伤害，每25秒可施放1次。施放永生花后，进入含苞状态，清除所有红椿·蕾，并将共鸣回路酣梦的伤害倍率提升效果提升至250%。共鸣回路永生花免疫打断。",
  },
]);

const reducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

onMounted(() => {
  if (!reducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".avatar-card", {
      duration: 0.8,
      y: 18,
      opacity: 0,
      scale: 0.99,
    }).from(
      ".right-col > .hero-panel .name",
      { duration: 0.9, x: 24, opacity: 0 },
      "-=0.45"
    );

    gsap.utils.toArray(".tl-item").forEach((it: any, idx: number) => {
      gsap.from(it.querySelector(".tl-card"), {
        scrollTrigger: {
          trigger: it,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 22,
        duration: 0.7,
        delay: idx * 0.06,
      });
    });

    gsap.to(".avatar-card", {
      scale: 1.007,
      duration: 2.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  } else {
    document.documentElement.classList.add("reduced-motion");
  }
});
</script>

<style scoped lang="scss">
/* ---------- 整体色调与背景 ---------- */
.megumi-page {
  position: relative;
  min-height: 100vh;
  /* 背景：浅粉到淡灰 + 暗角 + 轻微纹理层（保留清爽感） */
  background: linear-gradient(
    180deg,
    #fff5f6 0%,
    #ffd8dc 40%,
    #ffb3b9 70%,
    #9e1820 100%
  );
  font-family: "Noto Sans SC", system-ui, -apple-system, "Segoe UI", Roboto,
    Arial;
  color: #121417; /* 深色文字以保证可读性 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: clamp(18px, 4vw, 80px);
  box-sizing: border-box;
  padding-top: 60px;

  .container {
    position: relative;
    z-index: 10;
    max-width: 1100px;
    margin: 0 auto;
    padding: clamp(12px, 2vw, 40px);
  }

  &.reduced-motion * {
    transition: none !important;
    animation: none !important;
  }
}

/* ---------- HERO 布局（玻璃面板 + 花瓣装饰） ---------- */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 28px;
  align-items: start;
  padding: 12px;
  margin-bottom: 6px;

  /* 花瓣/光斑装饰（纯 CSS） */
  .hero-decor {
    position: absolute;
    inset: -40% -10% auto auto;
    width: 60%;
    height: 160%;
    z-index: 2;
    pointer-events: none;
    background: radial-gradient(
        120px 60px at 10% 30%,
        rgba(255, 123, 144, 0.06),
        transparent 20%
      ),
      radial-gradient(
        160px 80px at 35% 20%,
        rgba(158, 24, 32, 0.06),
        transparent 18%
      ),
      radial-gradient(
        260px 120px at 60% 60%,
        rgba(255, 94, 110, 0.03),
        transparent 20%
      );
    transform: rotate(-12deg);
    filter: blur(18px) saturate(120%);
    opacity: 0.95;
  }

  .left-col {
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }

  /* ---------- 头像卡（更具椿风格） ---------- */
  .avatar-card {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.92),
      rgba(255, 248, 249, 0.86)
    );
    border-radius: 16px;
    padding: 12px;
    display: grid;
    justify-items: center;
    gap: 8px;
    border: 1px solid rgba(158, 24, 32, 0.06);
    box-shadow: 0 22px 56px rgba(158, 24, 32, 0.06);
    cursor: pointer;
    transition: transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.28s;
    width: 100%;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 30px 80px rgba(158, 24, 32, 0.11);
    }
  }

  .avatar-wrap {
    width: 100%;
    display: block;
  }

  .avatar {
    width: 100%;
    height: auto;
    border-radius: 12px;
    display: block;
    box-shadow: 0 12px 40px rgba(158, 24, 32, 0.06);
    border: 3px solid rgba(255, 255, 255, 0.9);
    transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1);
   
  }

  .avatar-card:hover .avatar {
    transform: translateY(-4px) scale(1.01);
  }

  .avatar-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .avatar-badge {
    font-size: 0.9rem;
    color: #8b1a27;
    background: linear-gradient(
      90deg,
      rgba(255, 241, 243, 0.7),
      rgba(255, 239, 240, 0.5)
    );
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(158, 24, 32, 0.06);
    font-weight: 600;
  }

  /* 小摘要（移动端在头像下方显示） */
  .mini-lead {
    display: none;
    margin-top: 8px;
    font-size: 0.95rem;
    color: #5b6165;
    max-width: 280px;
  }

  .right-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ---------- hero-panel（毛玻璃面板） ---------- */
  .hero-panel {
    position: relative;
    z-index: 9;
    padding: 18px;
    border-radius: 14px;
    background: linear-gradient(
      180deg,
      rgba(255, 245, 246, 0.62),
      rgba(255, 238, 240, 0.44)
    );
    -webkit-backdrop-filter: blur(6px) saturate(120%);
    backdrop-filter: blur(6px) saturate(120%);
    border: 1px solid rgba(158, 24, 32, 0.08);
    box-shadow: 0 18px 50px rgba(20, 18, 20, 0.06);
  }

  .name {
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    margin: 0;
    /* 椿专属的渐变文字（写死颜色） */
    background: linear-gradient(90deg, #fff0f2 0%, #ff4f4f 40%, #9e1820 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    font-weight: 900;
    letter-spacing: 0.6px;
    display: inline-block;
    -webkit-text-stroke: 0.2px rgba(0, 0, 0, 0.06);
  }

  .jp {
    font-size: 0.95rem;
    color: #6f6f6f;
    margin-left: 8px;
    font-weight: 400;
  }

  .subtitle {
    margin: 6px 0 0;
    font-size: 1.02rem;
    color: #7a1c25; /* 加强可读的红系文字 */
    font-weight: 600;
    line-height: 1.4;
    /* 轻微首行缩进与花瓣装饰对齐感 */
  }

  .lead {
    margin: 10px 0 0;
    color: #47525a;
    line-height: 1.7;
    max-width: 72ch;
  }
}

/* ---------- 卡片与通用元素微调 ---------- */
.card {
  margin-top: 22px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.96),
    rgba(255, 248, 249, 0.94)
  );
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 18px 44px rgba(20, 20, 30, 0.06);
  backdrop-filter: blur(4px);
  color: #222;
  border: 1px solid rgba(220, 200, 205, 0.5);

  h2 {
    margin: 0 0 8px 0;
    font-size: 1.12rem;
    color: #111315;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .btn {
    padding: 8px 12px;
    border-radius: 10px;
    border: none;
    background: #ffffff;
    box-shadow: 0 8px 22px rgba(20, 20, 30, 0.04);
    cursor: pointer;
    font-weight: 600;
  }
}

/* personality */
.personality .traits li {
  padding: 12px 0;
  border-bottom: 1px dashed rgba(243, 183, 201, 0.12);
  font-size: 1rem;
  color: #333;
}

.quote {
  margin-top: 12px;
  padding: 12px 14px;
  border-left: 4px solid #f3b7c9;
  background: linear-gradient(90deg, rgba(243, 183, 201, 0.04), transparent);
  color: #4f4f4f;
  border-radius: 6px;
}

/* overview 配队 */
.overview .two-col {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 8px;
}

.team ul {
  display: flex;
  gap: 8px;
  padding: 6px 0;
}

.team li img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.9);
}

/* timeline */
/* timeline（椿风格改版） */
.timeline {
  position: relative;
  .tl-wrap {
    position: relative;
    padding: 18px 6px 8px 86px; /* 左侧留给标记与中线 */
  }

  /* 中心竖线：带渐变与花瓣光晕 */
  .vl {
    position: absolute;
    left: 72px;
    top: 28px;
    bottom: 20px;
    width: 4px;
    border-radius: 6px;
    background: linear-gradient(
      180deg,
      rgba(158, 24, 32, 0.08),
      rgba(255, 123, 144, 0.06) 50%,
      rgba(158, 24, 32, 0.04)
    );
    box-shadow: 0 6px 18px rgba(158, 24, 32, 0.03),
      inset 0 0 10px rgba(255, 255, 255, 0.02);
    z-index: 1;
    opacity: 0.95;
  }

  .tl-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tl-item {
    position: relative;
    display: flex;
    gap: 18px;
    align-items: flex-start;
    margin: 18px 0;
    z-index: 2;
    transition: transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.28s;
   
  }

  .tl-card {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.99),
      rgba(255, 248, 249, 0.96)
    );
    border-radius: 12px;
    padding: 14px 18px;
    box-shadow: 0 12px 36px rgba(20, 20, 30, 0.04);
    width: calc(100% - 120px); /* 留出左侧空间 */
    border-left: 4px solid transparent;
    transition: transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.28s,
      border-color 0.28s;
    position: relative;
    z-index: 2;
  }

  .tl-item:hover .tl-card,
  .tl-item:focus-within .tl-card {
    transform: translateY(-8px);
    box-shadow: 0 24px 60px rgba(158, 24, 32, 0.08);
    border-left-color: rgba(158, 24, 32, 0.12);
  }

  .tl-title {
    margin: 0 0 6px 0;
    font-size: 1.02rem;
    color: #111115;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .tl-meta {
    color: #7a1c25;
    font-size: 0.9rem;
    font-weight: 600;
    opacity: 0.95;
  }

  .tl-desc {
    margin: 0;
    color: #444;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  /* small screens: 标记移到卡片顶部，节省空间 */
  @media (max-width: 980px) {
    .tl-wrap {
      padding-left: 14px;
    }
    .vl {
      display: none;
    }

    .tl-item {
      display: block;
      margin: 14px 0;
    }

    .tl-card {
      width: 100%;
      padding: 12px;
      border-left: 0;
    }
    .tl-item:hover .tl-card {
      transform: none;
      box-shadow: 0 10px 30px rgba(20, 20, 30, 0.04);
    }
  }
}

/* ---------- 响应式调整（移动端优化） ---------- */
@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 8px;
  }

  .hero .left-col {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .avatar-card {
    width: 120px;
    padding: 8px;
  }

  .avatar {
    border-radius: 10px;
  }

  .hero .mini-lead {
    display: block;
    color: #5b6165;
  }

  .hero .hero-decor {
    display: none;
  }

  .hero .hero-panel {
    padding: 14px;
  }

  .card {
    padding: 14px;
    border-radius: 12px;
  }

  .name {
    font-size: 1.6rem;
  }
  .subtitle {
    font-size: 0.98rem;
  }
  .lead {
    font-size: 0.95rem;
    max-width: 100%;
  }
}

/* 小无障碍与触摸优化 */
.avatar-card,
.btn {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.06);
}
</style>
