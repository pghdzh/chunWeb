<template>
  <div class="megumi-page" aria-live="polite">


    <main class="container" ref="mainContainer">
      <!-- HERO -->
      <header class="hero" role="banner">
        <div class="left-col">
          <button class="avatar-card">
            <picture class="avatar-wrap">
              <img src="@/assets/images1/QQ20250923-103501.webp" alt="珂莱塔 头像" class="avatar" loading="lazy"
                decoding="async" />
            </picture>

            <div class="avatar-meta">
              <span class="avatar-badge">共鸣能力 · 红椿盛放</span>
            </div>
          </button>


        </div>

        <div class="right-col" ref="metaCard">
          <h1 class="name">椿 <span class="jp">（黑海岸执花）</span></h1>

          <p class="lead">
            自由随性，自有一种“危险”的吸引力。 她相信这个世界中存在着命运既定的牵系，且乐意顺着这份牵引愉快地游走世间。
          </p>

          <!-- 桌面侧边 quick-info（sticky） -->
          <aside class="quick-info" ref="infoCard" aria-label="角色快速信息">
            <h3 class="qi-title">快速资料</h3>
            <dl>
              <div>
                <dt>武器类型</dt>
                <dd>佩枪</dd>
              </div>
              <div>
                <dt>出生</dt>
                <dd>未知</dd>
              </div>
              <div>
                <dt>共鸣属性</dt>
                <dd>湮灭</dd>
              </div>
              <div>
                <dt>特殊料理</dt>
                <dd>冻葡果茶</dd>
              </div>
              <div>
                <dt>中文CV</dt>
                <dd>柳知萧</dd>
              </div>
              <div>
                <dt>实装版本</dt>
                <dd>V1.4</dd>
              </div>
            </dl>
          </aside>
        </div>
      </header>

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
          <li>【含苞状态】：协奏圈右边会有一朵花的形态，该状态是椿的爆发输出期间。</li>
          <li>【红椿盛绽】：共鸣技能会使椿在白头发的椿和红头发的椿来回切换，白椿更擅长对单和追击，红椿更擅长对群和打桩。</li>
        </ul>

        <blockquote class="quote">基础流程：变奏入场-E-AAAA-E-R-【一日花】E-Z-E <br>(普攻--A，重击--Z，共鸣技能--E，共鸣解放--R，声骸--Q)</blockquote>
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

      <section id="timeline" class="card timeline">
        <div class="card-head">
          <h2>共鸣链详解 · 提升</h2>
        </div>

        <div class="tl-wrap">
          <div class="vl" aria-hidden="true"></div>
          <ol class="tl-list">
            <li v-for="(ev, i) in timeline" :key="i" class="tl-item">
              <div class="marker" aria-hidden="true"><span>{{ i + 1 }}链</span></div>
              <div class="tl-card">
                <h3 class="tl-title">{{ ev.title }}<span class="tl-meta">(提升{{ ev.time }})</span></h3>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const timeline = ref([
  { time: '10%', title: '在无人知晓的秘密小径', desc: '施放变奏技能八千春秋时，暴击伤害提升28%，持续18秒，每25秒可触发1次。共鸣回路一日花免疫打断。' },
  { time: '22%', title: '呼唤那沉默之花的芬芳', desc: '共鸣回路一日花伤害倍率提升120%。' },
  { time: '22%', title: '一根荆棘胜过千颗花种', desc: '共鸣解放芳华绽烬伤害倍率提升50%；含苞状态期间，椿的攻击提升58%。' },
  { time: '7%', title: '它的根茎持续到永恒中', desc: '施放变奏技能八千春秋后，队伍中的角色普攻伤害加成提升25%，持续30秒。' },
  { time: '3%', title: '将那无限置于你的手掌', desc: '变奏技能八千春秋伤害倍率提升303%。延奏技能缠绕伤害倍率提升68%。' },
  { time: '31%', title: '为你的千千万万次盛放', desc: '共鸣回路酣梦的伤害倍率提升效果额外提升150%；共鸣回路永生花：施放共鸣回路一日花后15秒内，协奏能量充满时，若永生花不处于冷却状态，共鸣技能替换为永生花。施放永生花时，消耗50点协奏值，回复50点【红椿·蕊】，造成共鸣回路一日花100%的湮灭伤害，此次伤害为普攻伤害，每25秒可施放1次。施放永生花后，进入含苞状态，清除所有红椿·蕾，并将共鸣回路酣梦的伤害倍率提升效果提升至250%。共鸣回路永生花免疫打断。' }
]);



const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


onMounted(() => {

  if (!reducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.avatar-card', { duration: 0.8, y: 18, opacity: 0, scale: 0.99 })
      .from('.right-col > .name', { duration: 0.9, x: 24, opacity: 0 }, '-=0.45')
      .from('.quick-info', { duration: 0.7, y: 12, opacity: 0 }, '-=0.55');

    gsap.utils.toArray('.tl-item').forEach((it: any, idx: number) => {
      gsap.from(it.querySelector('.tl-card'), {
        scrollTrigger: {
          trigger: it,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 22,
        duration: 0.7,
        delay: idx * 0.06
      });
    });

    gsap.to('.avatar-card', { scale: 1.007, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  } else {
    document.documentElement.classList.add('reduced-motion');
  }


});


</script>

<style scoped lang="scss">
/* 整体背景容器 */
.megumi-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, #fffafc 0%, #f8f7fb 100%);
  font-family: "Noto Sans SC", system-ui, -apple-system, "Segoe UI", Roboto, Arial;
  color: #14202b;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: clamp(18px, 4vw, 80px);
  box-sizing: border-box;
  padding-top: 60px;



  /* 主体容器提升 z-index，保证在背景之上 */
  .container {
    position: relative;
    z-index: 10;
    max-width: 1100px;
    margin: 0 auto;
    padding: clamp(12px, 2vw, 40px);
  }

  /* 方便 reduced motion */
  &.reduced-motion * {
    transition: none !important;
    animation: none !important;
  }
}

/* HERO 布局 */
.hero {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 28px;
  align-items: start;

  .left-col {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .avatar-card {
    background: rgba(255, 255, 255, 0.92);
    /* 半透明白，便于对比 */
    backdrop-filter: blur(6px);
    border-radius: 16px;
    padding: 12px;
    box-shadow: 0 18px 50px rgba(20, 20, 30, 0.08);
    display: grid;
    justify-items: center;
    gap: 8px;
    border: 1px solid rgba(220, 220, 225, 0.6);
    cursor: pointer;
    transition: transform .28s cubic-bezier(.2, .9, .3, 1), box-shadow .28s;
    width: 100%;
  }



  .avatar-wrap {
    width: 100%;
    display: block;
  }

  .avatar {
    width: 100%;
    height: auto;
    border-radius: 10px;
    display: block;
    box-shadow: 0 10px 36px rgba(20, 20, 30, 0.06);
    border: 3px solid rgba(255, 255, 255, 0.9);
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
    color: #5f6b72;
  }



  .right-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .name {
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    margin: 0;
    color: #111315;
  }

  .jp {
    font-size: .95rem;
    color: #6f6f6f;
    margin-left: 8px;
    font-weight: 400;
  }

  .lead {
    margin: 6px 0 0;
    color: #47525a;
    line-height: 1.7;
    max-width: 78ch;
  }

  .quick-info {
    margin-top: 12px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(6px);
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 10px 28px rgba(20, 20, 30, 0.06);
    font-size: 0.95rem;
    position: sticky;
    top: 18px;
    align-self: start;

    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 6px 10px;
    }

    dt {
      font-weight: 600;
      color: #555;
      font-size: 0.85rem;
      margin-top: 6px;
    }

    dd {
      margin: 0;
      color: #333;
      font-size: 0.93rem;
      min-width: 200px;
    }
  }
}

/* 通用卡片风格（白色 + 毛玻璃） */
.card {
  margin-top: 22px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 18px 44px rgba(20, 20, 30, 0.06);
  backdrop-filter: blur(4px);
  color: #222;
  border: 1px solid rgba(220, 220, 225, 0.6);

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
.personality {
  .traits {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .traits li {
    padding: 12px 0;
    border-bottom: 1px dashed #f5f5f5;
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
}

/* overview 配队 */
.overview {
  .two-col {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-top: 8px;

    .team {
      margin: 8px;
      min-width: 180px;

      ul {
        display: flex;
        gap: 8px;
        padding: 6px 0;
      }

      li img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }
}

/* timeline */
.timeline {
  .tl-wrap {
    position: relative;
    padding: 8px 0 0 0;
  }

  .vl {
    position: absolute;
    left: 56px;
    top: 26px;
    bottom: 20px;
    width: 2px;
    background: linear-gradient(180deg, #f3b7c9, #9fb8d1);
    border-radius: 2px;
    opacity: 0.12;
  }

  .tl-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tl-item {
    display: flex;
    gap: 18px;
    align-items: flex-start;
    padding: 12px 8px 18px 8px;
    position: relative;
  }

  .marker {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    flex: 0 0 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #ffffff, rgba(255, 255, 255, 0.95));
    box-shadow: 0 8px 20px rgba(20, 20, 30, 0.06);
    border: 1px solid rgba(200, 200, 200, 0.08);
  }

  .marker span {
    font-weight: 700;
    color: #f3b7c9;
  }

  .tl-card {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.96));
    border-radius: 10px;
    padding: 10px 14px;
    box-shadow: 0 10px 32px rgba(20, 20, 30, 0.04);
    width: calc(100% - 60px);
  }

  .tl-meta {
    color: #6f6f6f;
    font-size: 0.9rem;
    margin-bottom: 6px;
  }

  .tl-title {
    margin: 0;
    font-size: 1.02rem;
    color: #111315;
  }

  .tl-desc {
    margin: 8px 0 0;
    color: #444;
    line-height: 1.6;
  }
}

/* footer */
.credits {
  margin-top: 18px;
  color: #6f6f6f;
  font-size: 0.94rem;
}





/* Responsive */
@media (max-width: 980px) {
  .megumi-page {


    .container {
      padding: 18px;
    }
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 18px;

    .quick-info {
      display: none;
    }

  }

  .overview .two-col {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .timeline .vl {
    left: 40px;
  }

  .card {
    padding: 14px;
    border-radius: 12px;
  }
}


/* small accessibility tweaks */
.avatar-card,
.btn {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.06);
}
</style>
