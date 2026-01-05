<template>
  <div class="camellia-page" aria-live="polite">
    <!-- 背景装饰元素 -->
    <div class="bg-pattern" aria-hidden="true"></div>

    <main class="container" ref="mainContainer">
      <!-- HERO 区域 -->
      <header class="hero" role="banner">
        <div class="left-col">
          <button class="avatar-card">
            <picture class="avatar-wrap">
              <img
                src="@/assets/images1/slty (10).webp"
                class="avatar"
                loading="lazy"
                decoding="async"
                alt="椿的角色立绘"
              />
            </picture>
            <div class="avatar-meta">
              <span class="avatar-badge">共鸣能力 · 红椿盛放</span>
            </div>
          </button>
        </div>

        <div class="right-col" ref="metaCard">
          <div class="hero-panel">
            <h1 class="name">
              椿
              <span class="jp">（黑海岸执花）</span>
            </h1>
            <p class="subtitle">我把花瓣折成刀锋，微笑着切开夜的边界。</p>
            <p class="lead">
              自由随性，自有一种"危险"的吸引力。她相信这个世界中存在着命运既定的牵系，且乐意顺着这份牵引愉快地游走世间。
            </p>

            <!-- 彩蛋细节卡片 -->
            <div class="camellia-facts">
              <h3 class="facts-title">🌺 关于椿花</h3>
              <ul class="facts-list">
                <li><strong>花语：</strong>理想的爱</li>
                <li>
                  <strong>别名：</strong>山茶花，总是在开得最绚烂的时候整朵落下
                </li>
                <li>
                  <strong>颜色：</strong>纯洁的白与热烈的红，正如她矛盾的特质
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <!-- 人物经历时间线 -->
      <section id="experience" class="card experience-timeline">
        <div class="card-head">
          <h2>
            <span class="flower-icon">🌸</span>
            人物经历
          </h2>
        </div>

        <div class="timeline-container">
          <div class="timeline-line"></div>

          <div
            class="timeline-item"
            v-for="(item, index) in experience"
            :key="index"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            <div
              class="timeline-dot"
              :class="'dot-' + (index % 2 === 0 ? 'red' : 'white')"
            ></div>
            <div class="timeline-content">
              <h3 class="timeline-title">{{ item.title }}</h3>
              <p class="timeline-desc">{{ item.description }}</p>
              <div class="timeline-tags">
                <span class="tag" v-for="tag in item.tags" :key="tag">{{
                  tag
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心机制 -->
      <section id="personality" class="card personality">
        <div class="card-head">
          <h2>
            <span class="flower-icon">⚙️</span>
            核心机制
          </h2>
        </div>
        <ul class="traits">
          <li
            v-for="(trait, index) in mechanics"
            :key="index"
            :class="{ highlight: trait.highlight }"
          >
            <span class="trait-icon">{{ trait.icon }}</span>
            <span class="trait-text" v-html="trait.text"></span>
          </li>
        </ul>
      </section>

      <!-- 异能力检验报告 -->
      <section id="resonance-status" class="card overview">
        <div class="card-head">
          <h2>
            <span class="flower-icon">📊</span>
            异能力检验报告
          </h2>
        </div>
        <div class="two-col">
          <div class="text-block">
            <div class="report-section">
              <h3 class="report-title">频谱检验报告 RA2▇▇▇▇-G</h3>
              <p class="report-content">
                鉴定依据：【频谱检验报告RA2▇▇▇▇-G】<br />
                无明确共鸣时间，主诉自苏醒后即可运用共鸣能力，因▇▇障碍无法追溯。<br />
                对象声痕位置于胸口，共鸣后躯体出现明显植物化特征，右臂、头部皆有常态异化表征，整体异化程度随频率波动加深。
              </p>
              <div class="report-footnote">
                <span class="footnote-icon">⚠️</span>
                <em
                  >"是人工诱导型？但这种曲线和过去已有的样本也……先封锁报告吧。"</em
                >
              </div>
            </div>

            <div class="report-section" style="margin-top: 2rem">
              <h3 class="report-title">超频诊断报告</h3>
              <p class="report-content">
                受试样本波形呈针尖态，时域表示剧烈且无序，频率极高，检测中时域表示有失真情况，峰值暂无可推定范围。<br />
                诊断结果：<span class="danger-text"
                  >超频临界值低，稳定性极低，超频风险极大。</span
                ><br />
                存在过往超频史，最高等级：重。<br />
                超频后遗症伴随语言能力退化、神志错乱、疼痛发作，无法判断对象本次恶化节点。
              </p>
              <div class="report-footnote">
                <span class="footnote-icon">💉</span>
                <em
                  >对象必须按时进行身体检查，心理辅导作用弱，需定时进行强制矫正。</em
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 主题收藏品区域 -->
      <div class="collectibles-grid">
        <section
          v-for="item in collectibles"
          :key="item.id"
          :id="item.id"
          class="card collectible-card"
          :class="item.colorClass"
        >
          <div class="card-head">
            <h2>
              {{ item.title }}
            </h2>
          </div>
          <div class="collectible-content">
            <div class="collectible-image">
              <img
                :src="item.image"
                :alt="item.title"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="collectible-text">
              <p v-html="item.description"></p>
            </div>
          </div>
        </section>
      </div>

      <!-- 共鸣链详解 -->
      <section id="timeline" class="card timeline">
        <div class="card-head">
          <h2>
            <span class="flower-icon">🔗</span>
            共鸣链详解
          </h2>
        </div>
        <div class="tl-wrap">
          <div class="vl"></div>
          <ol class="tl-list">
            <li
              v-for="(ev, i) in resonanceChain"
              :key="i"
              class="tl-item"
              :style="{ '--delay': i * 0.1 + 's' }"
            >
              <div class="tl-card">
                <h3 class="tl-title">
                  <span class="chain-number">第 {{ i + 1 }} 链</span>
                  {{ ev.title }}
                </h3>
                <p class="tl-desc">{{ ev.description }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- 椿纪事 -->
      <section class="ll-stories" ref="storyRef">
        <div class="card" role="region" aria-labelledby="stories-title">
          <header class="card-head">
            <h2 id="stories-title" class="card-title">
              <span class="flower-icon">📖</span>
              椿的物语
            </h2>
            <div class="stories-subtitle">五段记忆，五次绽放与凋零</div>
          </header>

          <main class="card-body">
            <div class="stories-tabs">
              <button
                v-for="(story, index) in stories"
                :key="story.id"
                :id="`tab-${story.id}`"
                class="tab-button"
                :class="{ active: currentStory === index }"
                @click="selectStory(index)"
                :aria-selected="currentStory === index"
                :aria-controls="`panel-${story.id}`"
              >
                <span class="tab-title">{{ story.title }}</span>
                <span class="tab-subtitle">{{ story.subtitle }}</span>
              </button>
            </div>

            <transition name="fade-slide" mode="out-in">
              <article
                :key="stories[currentStory].id"
                :id="`panel-${stories[currentStory].id}`"
                class="story"
                role="tabpanel"
                :aria-labelledby="`tab-${stories[currentStory].id}`"
              >
                <div class="story-header">
                  <h3 class="story-head">{{ stories[currentStory].title }}</h3>
                  <div class="story-meta">
                    <span class="meta-item"
                      >📅 {{ stories[currentStory].era }}</span
                    >
                    <span class="meta-item"
                      >📍 {{ stories[currentStory].location }}</span
                    >
                  </div>
                </div>
                <div class="story-content">
                  {{ stories[currentStory].content }}
                </div>
              </article>
            </transition>
          </main>

          <footer class="card-foot">
            <button
              class="nav-btn prev-btn"
              @click="prev"
              aria-label="上一则故事"
            >
              ‹
            </button>
            <div class="pager">
              <span class="current">{{ currentStory + 1 }}</span>
              <span class="separator">/</span>
              <span class="total">{{ stories.length }}</span>
            </div>
            <button
              class="nav-btn next-btn"
              @click="next"
              aria-label="下一则故事"
            >
              ›
            </button>
          </footer>
        </div>
      </section>

      <!-- 彩蛋区域 -->
      <section class="card easter-egg">
        <div class="card-head">
          <h2>
            <span class="flower-icon">🎁</span>
            隐藏的细节
          </h2>
        </div>
        <div class="egg-content">
          <div class="egg-item" v-for="(egg, index) in easterEggs" :key="index">
            <div class="egg-icon">{{ egg.icon }}</div>
            <div class="egg-text">
              <h3>{{ egg.title }}</h3>
              <p>{{ egg.description }}</p>
            </div>
          </div>
        </div>
        <div class="egg-footer">
          <p class="egg-hint">
            <span class="hint-icon">💡</span>
            在游戏中，椿的服饰上绣有细小的椿花纹样，暗示着她的本源
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

// 人物经历数据
const experience = [
  {
    title: "未知的过去",
    description:
      "疑似是早期被'人为干预获得超频能力的共鸣者'，这段记忆被封存，被称为'花女'。",
    tags: ["记忆缺失", "花女", "超频起源"],
  },
  {
    title: "收容与治疗",
    description:
      "因自身强大且危险的共鸣能力，在黑海岸被长期收容与治疗。同时作为'执花'，也为组织在各地旅行、选拔人才。",
    tags: ["黑海岸", "执花", "治疗期"],
  },
  {
    title: "重逢漂泊者",
    description:
      "与漂泊者（玩家）在今州重逢。她珍藏的'木雕玩偶'正是在此之前千百次尝试雕刻漂泊者样子的产物。",
    tags: ["重逢", "今州", "木雕玩偶"],
  },
  {
    title: "寻途与相守",
    description:
      "作为同伴与漂泊者一同行动，经历各种事件，并将一份深刻的感情寄托于漂泊者身上。",
    tags: ["同伴", "羁绊", "理想的爱"],
  },
];

// 核心机制数据
const mechanics = [
  {
    icon: "🌸",
    text: "【红椿·蕊】：血条上方上限100点的特殊能量条，通过常态攻击，长按A，E1E2消耗。在变奏入场或者施放共鸣回路一日花时，回复100点【红椿·蕊】。",
    highlight: true,
  },
  {
    icon: "🔥",
    text: "【红椿·蕾】：能量条上方的buff显示，像小火苗的六边形，上限10层，随【红椿·蕊】消耗增加。",
  },
  {
    icon: "💥",
    text: "【一日花】：攒满协奏能量后可使用，清除所有【红椿·蕾】，进入【含苞状态】，每层红椿·蕾使伤害倍率额外提升5%。",
  },
  {
    icon: "🌺",
    text: "【含苞状态】：协奏圈右边显示花朵形态，是椿的爆发输出期间。",
  },
  {
    icon: "🔴⚪",
    text: "【红椿盛绽】：共鸣技能使椿在白发与红发间切换，白椿擅对单追击，红椿擅对群打桩。",
  },
  {
    icon: "🎯",
    text: "<strong>输出流程：</strong> 变奏入场-E-AAAA-E-R-【一日花】E-Z-E",
  },
  {
    icon: "📝",
    text: "<strong>技能缩写：</strong> 普攻 = A，重击 = Z，共鸣技能 = E，共鸣解放 = R，声骸 = Q",
  },
];
import item1 from "./img/item1.jpg";
import item2 from "./img/item2.jpg";
import item3 from "./img/item3.jpg";
import food from "./img/food.png";
// 收藏品数据
const collectibles = [
  {
    id: "wooden-doll",
    title: "木雕玩偶",

    image: item1,
    description:
      "雕刻成【玩家名】样子的木雕玩偶，椿用共鸣能力延展出自身的植物根系雕刻而成，充满了她的个人趣味。<br><br>在今州相会前，她曾千百次试图雕刻出木偶的脸孔，为此损毁了数柄刻刀——落到最后一笔时，总是告以失败。<br><br>一切朦胧的追寻和失落，到如今才落到实处。",
    colorClass: "collectible-red",
  },
  {
    id: "frequency-bracelet",
    title: "频谱手链",

    image: item2,
    description:
      "黑海岸出品的频谱监测手链，在椿的强烈要求下制成。<br><br>与旧日某个礼物相似的造型，功能也相差无几，能够让另一侧的人得知其动向，确认持有者的安危。<br><br>椿知道，自己毕竟不是完全的『花女』，也不打算成为过去的自己。",
    colorClass: "collectible-white",
  },
  {
    id: "camellia-flower",
    title: "一朵椿花",

    image: item3,
    description:
      "献给那个人的花。<br><br>首领也好，调律者也罢，又或者是如今的漂泊者、今州英雄、指引者……其实椿从来无所谓【TA】的身份和责任。然而，她并不能、也不愿意让自己对人生的看法，代替对方的判断。<br><br>那就让这朵不败的花，代替言语表达情感吧。",
    colorClass: "collectible-red",
  },
  {
    id: "grape-tea",
    title: "冻葡果茶",

    image: food,
    description:
      "将切碎的果肉镇入冰水中，佐以新鲜的花蜜。冰块碰撞间，发出清亮美妙的声音。<br><br>椿按照自己的心意调配的果茶，其中奶味已经被稀释得极淡，果肉则以葡萄为主，又加入了些许油柑汁调和。<br><br>清爽甜蜜的果饮在舌尖淌过，淡淡的苦味褪去后，留有一丝奇妙的回甘。",
    colorClass: "collectible-white",
  },
];

// 共鸣链数据
const resonanceChain = [
  {
    title: "在无人知晓的秘密小径",
    description:
      "施放变奏技能八千春秋时，暴击伤害提升28%，持续18秒，每25秒可触发1次。共鸣回路一日花免疫打断。",
  },
  {
    title: "呼唤那沉默之花的芬芳",
    description: "共鸣回路一日花伤害倍率提升120%。",
  },
  {
    title: "一根荆棘胜过千颗花种",
    description:
      "共鸣解放芳华绽烬伤害倍率提升50%；含苞状态期间，椿的攻击提升58%。",
  },
  {
    title: "它的根茎持续到永恒中",
    description:
      "施放变奏技能八千春秋后，队伍中的角色普攻伤害加成提升25%，持续30秒。",
  },
  {
    title: "将那无限置于你的手掌",
    description: `变奏技能八千春秋伤害倍率提升303%。
      延奏技能缠绕伤害倍率提升68%。`,
  },
  {
    title: "为你的千千万万次盛放",
    description: `共鸣回路酣梦的伤害倍率提升效果额外提升150%；
共鸣回路永生花：施放共鸣回路一日花后15秒内，协奏能量充满时，若永生花不处于冷却状态，共鸣技能替换为永生花。
施放永生花时，消耗50点协奏值，回复50点【红椿·蕊】，造成共鸣回路一日花100%的湮灭伤害，此次伤害为普攻伤害，每25秒可施放1次。
施放永生花后，进入含苞状态，清除所有红椿·蕾，并将共鸣回路酣梦的伤害倍率提升效果提升至250%。
共鸣回路永生花免疫打断。`,
  },
];

// 故事数据
const stories = [
  {
    id: "1",
    title: "从今往后",
    subtitle: "黑海岸的清晨",
    era: "重逢之后",
    location: "黑海岸",
    content: `她从梦中醒来。

朝阳在海面升起，黑海岸的又一个清晨来临，与过往无甚不同。椿睁开眼，在树顶惬意地伸了个懒腰。她动作轻巧，不至于从枝头跌下去；即便真的不慎下落，枝蔓也会将她牵住。她喜欢睡在这些地方，安静，无人打扰。

这是一个美好的清晨，椿想，躯体状况稳定，心情平静愉快，短时间内大约不用去医疗舱报道，这就很好。

【玩家名】这段时候应该会留在黑海岸，等待启程前往黎那汐塔，这也非常好，意味着她可以拥有更多时间和【TA】说话、玩耍、相处。

她送了一份礼物给【TA】，就像过去的【TA】送给她的一样。一条手链，用以监测频率状态。

这是现在的她第一次为某个人准备礼物。

真奇怪呀！她想知道一个人是否安全、是否存在……这是非常非常不可思议的事！这意味着她希望对方活着。过去椿从不曾想过这种事，无论是有关他人，还是有关自己。但与那个人从星图世界离开后，在知道了自己身为花女的过去后，她的想法发生了些微改变。

不过，她应当不会跟着对方一起去了。

关于索拉里斯的某些历史，她和【玩家名】的看法不太一样，但正如她不打算干涉对方的行为一样，她也不打算太多解释自己的动机和想法。事实上，出于为【TA】规避风险的考虑，她向那个人隐瞒了一些事——在星图构造的世界中，她并非完全没有回忆起任何过去。

获取的信息不多，但还算关键。她的过去……椿眯起眼睛，轻哼一声。

她打算自己去查查看，等到合适的时机，再和【玩家名】说这件事。

椿并不信任构造出脚下基石的组织，并不信任泰缇斯系统，除了【玩家名】，她谁也不太相信。

只不过，曾经的花女并不乐意深入这些事。过去的自己不想过问这些事，也不愿意参与到故事里，大概是因为抗拒看着【玩家名】为了拯救世界而消耗自己……但现在，椿不再和过去的自己持有同种看法。

她注视着那个人从今州一路走到现在。

独自一人，不断向前，身边逐渐聚集起不同的人。

椿知道，那仍旧不是她的路，但她不再抗拒去看这条路。正如一颗石子触碰另一颗，会在水面激起不同的涟漪，她很乐意成为一个“变量”。在现在，即便她已经从那个人身上获得极大的愉悦和满足，椿仍旧没有立刻觉出乏味、将其抛之脑后。她还是会时常想起【TA】，渴望知道【TA】更多的故事，渴望与之进行更多有趣的游戏。这些陌生的念头像是厚实床褥下坚硬的果实，在她无知无觉、无波无澜的魂灵中留下一块不平整的、略带痛楚的痕迹。

她打开自己的终端，把这个决定写成一条简短的讯息，预计在启程前发给了【玩家名】。既然已经能随时联系，又能通过另外那条手链得知对方的状况，那又有什么可担忧的？索拉里斯无比广阔，如果他们是一个故事的两条线，自然会在某个时刻再度汇聚。

在一个【玩家名】意想不到的时刻……呵呵，那时候，她一定要吓【TA】一跳！

她盘算着这个有趣的点子，哼起歌来。

藤蔓缠绕着椿的手臂向上攀援，细小的花苞在末端徐徐盛放。

忽然地，一个念头出现在她心头。

我要送一朵花给【玩家名】。

这个念头甫一出现，立刻占据了她全部的心神。她要找到【玩家名】，现在就要！然后，她就会把这朵由自己躯体生出的椿花送给那个人，它不会损坏、也不会枯萎——除非她死了。她并不明白自己为何忽然想这么做，但这个念头让她生出一种略带悲哀的情感。当椿想要继续深思下去的时候，头颅中隐隐的剧痛阻止了她。

椿轻呼一口气，放弃了深究，为了……

为了……对！她笑着想，为了让这朵送给【玩家名】的花保持盛放，她会尽量别那么快死。

椿从树上翻身下来，轻快地朝着手链显示的方位跃去，去找【TA】。`,
  },
  {
    id: "2",
    title: "迷宫",
    subtitle: "记忆的断层",
    era: "加入黑海岸",
    location: "医疗舱",
    content: `她从梦中醒来。

眼前的舱体内壁浸透在黑暗中，因调节频率的减噪效果，医疗舱内唯有厚重的寂静安然停驻。椿眨了眨眼，干涩的眼球转动着向右，终端屏幕上显示的指数已经趋于正常——手脚上的枷锁松开了，但她还是没什么力气，只好继续躺在这方狭窄的矫正装置中。

椿尝试着回忆之前发生了什么。她尽量保持平稳地状态去想，但失去的那部分如同一个无底的黑色洞口，望进去，什么也看不见。

她的记忆又中断了。

椿加入黑海岸的时间不久，刚满一年，执花的考核过了，最近才有了权限查看更多泰缇斯系统里的内容。

在登岛前，她独自一人在索拉里斯游荡了很久。

最初苏醒的溶洞没有其他人存在的痕迹，只有盘根错节的植物爬满了洞壁。椿赤着脚淌水前行，走到洞外，看到了荒废的村庄。

脚下踢到一寸残碑，上面刻着模糊的“落香村”三字。

从这座废村向外走，又花费了若久时间。

她饥饿时便杀死山林中的野兽食其血肉，渴了就饮山泉水，在密林中穿行。数月后，椿终于来到有人迹的地方。

后来她才迟缓地觉察出，那座村子或许已经被遗忘数百年了。

来到外界后，椿的记忆仍旧一片空白，并未因为环境的改变而发生变化，而她本人也仍旧只是一头齿爪锋利的动物。人的世界，很多规矩椿都不懂，但她能够使用自己的共鸣能力，这就足够了。力量于椿而言是天生就知道如何应用的武器，她随心所欲地使用它，在悲鸣侵蚀过的土地上自由自在地走着、笑着。

因一无所知，对她而言，索拉里斯的一切在最初都十分有趣。但逐渐掌握了一定程度的知识后，椿又很快感到了无聊。

来到黑海岸纯属意外，但椿总觉得周遭的一切都有种奇妙的熟悉感。

又过了一年，她在系统里找到了自己的名字，得知了过去自己曾在这里生活、工作，得知了自己曾被称为「花女」。

说来也怪，她遗忘了一切，却仍旧记得自己的名字。

好奇驱赶着椿在黑海岸开始了查找，为了找到过去自己的来处，找到「花女」的踪迹……然后呢？然后发生了什么？

想到这里，剧痛再次钉穿了她的头颅，胸口的花骤然膨大疯长，颜色趋近深紫，藤蔓上的尖刺几欲将医疗舱撑裂刺穿。些许片段在脑海中跳跃着，「花女」并不允许她想起这些过去……椿在漆黑的医疗舱中发出沉闷的惨叫，拘束器再度钳制住她的四肢，尖利的警报声响起，黑海岸的医疗人员大约很快就会赶到。

但没用，他们查过了，也早已得出结论——困住她的重度超频症状特殊，无法根治，只能维持。死亡是另一个话题，以当前的情况而言，她甚至无法简单死去。

维持……就是等，等死，或者等一个不知何时来的结局。十分被动，椿并不喜欢。如果无法决定结局，至少该由自己来决定过程。在一切耗尽前，随心所欲地活着。

真疼！

椿带着痛呼，大笑出声。`,
  },
  {
    id: "3",
    title: "须臾",
    subtitle: "雪原的追踪",
    era: "花女时期",
    location: "未知雪原",
    content: `她从梦中醒来。

花女睁开眼，感到寒冷的气流拂过指尖，让手脚都略略僵硬起来。她在车座上磨蹭了片刻，才慢吞吞地坐起来。

黑海岸的车开到了一处可供遮蔽风雪的洞中，外面是一望无际的银色雪原。霜花从天而降，落在她的鼻尖。

花女抖了一下，有些精神不振，往厚实的衣服里缩了缩。

她不是那种耐寒的植物。

“……首领去哪儿了？”先喝了几口水，她这才和车前座同行的执花问道，“我没看到【TA】。”

“往西侧走了，说是找到了什么有意思的痕迹，想先去看看。”

“又不带我……我明明是【TA】的护卫呢，真是的。”

她低声抱怨道，兼任司机、正在埋头吞咽热汤的执花豪爽地大笑道，“【TA】说是因为你睡着了，看你这一路一直没睡好，总觉得冷。难得睡一会儿，就不吵你起来了。”

花女又低声嘟囔了几句谁也听不清楚的话，扁了扁嘴，拉开车门。

“我去找人咯~”

司机和她挥了挥手，示意自己知道，显然已经习惯了两位同行者的相处模式。

花女在雪原中慢慢往前走。

自落香村相遇后，已经过去了许多年。

这次行动，她早就知道要来这片雪原，但还是跟着【玩家名】一起出发了，虽然不喜欢寒冷，但能和首领一起玩耍的时间还是得珍惜。大部分时间，她都会跟着对方外出去办事，索拉里斯热闹的地方、罕为人知的地方、安全处、危险处，两人都曾一一踏足。花女喜欢这种生活，带着未知的快乐，而【玩家名】总是能让有趣的事变得加倍有趣！

她不讨厌危险和风波，甚至还挺喜欢，危险意味着变化——但有首领在身边的时候，她会尽量克制自己找事的兴味和倾向。

危险……

花女抬起手，手腕上细细的链条闪烁着银色的光，监测拉贝尔指数的圆环显示情况一切正常。

她握紧手腕，轻轻呼出一口气。

一切正常就好，花女想，要是发作了、失控了，【玩家名】为了照顾自己，这次任务必然无法如预期那样顺利完成，又要多出不少波折。

她讨厌失控。

最近这几年，花女会梦到一些古怪而陌生的片段，一些并不存在的回忆。在那些梦中，她一直追踪着【玩家名】，但两人从未真的相见。每次从这样的梦里醒来，花女都感到自己的精神状态受到影响，这样的波动在她的躯体上会立刻显现出影响，让她不得不先去黑海岸的医疗室报道。

想到这些，她的心情变得有些糟糕起来。

……还是要尽快找到【玩家名】才行。

她摈弃那些纷杂的念头，专心寻找【玩家名】的频率。在越过两座小丘，一片被冰封住的湖泊后，花女总算看到了那个模糊的影子。

“椿，睡得如何？”

那双金色的眼睛笑着望她，花女也回之一笑。

“呵……有首领在身边，当然是做了个好梦。”`,
  },
  {
    id: "4",
    title: "前夜",
    subtitle: "湖边的沉睡",
    era: "大悲鸣前",
    location: "落香村",
    content: `她从梦中醒来。

昏迷与清醒的间隔越来越短，花女逐渐不再能够分辨自己在何时做梦、何时醒着。

她甚至不记得这是从何时开始的症状了。

海潮般的记忆尖啸着倒灌入意识中，破坏了她的认知和感官，痛苦一刻不歇地撕扯着躯体和意识。花女张开嘴，疼得想吐，但喉管已因重度超频带来的魔化扭曲成了一节粗粝的植物根茎。哀鸣声被堵截在胸膛内部，沉入腹中。

勉强支撑着躯体走了数步，她再度摔在泥泞的河岸边，浑身颤抖，就连指尖都开始不规律地抽搐起来。

这是……第几次了？

她茫然地睁着眼睛，看向上方漆黑的夜色。

一切思考都趋向混乱，但关于【玩家名】的事却记得很清楚。

她已经想起了一切。

关于自己是谁，关于【玩家名】是谁，关于她诞生的目的，关于索拉里斯，关于大悲鸣……

但在她因重度超频步入疯狂前，这些记忆都因躯体的机能被封锁在最深处，从来未曾浮出水面。每次，她都会在苏醒后丢失一切记忆，只余下空茫。待时间流转，躯体状况难以遏制地因重度超频恶化时，她才会回想起自己的使命和根源，接着再度丢失所有记忆。

这是第几次了？花女不知道。

文明毁灭，又再度繁盛，生命消逝，又再度出现新的火光。

她见证着索拉里斯的潮起潮落，却永远是个精神上的异乡人。

【玩家名】……花女默念着这个名字。

他们却从未正式见过面、说过话，如今一切都已失去，她甚至无法判断彼此到底算不算是敌人。

但她知道，在下一次，她一定还会本能地追上【TA】。

这不是什么亲切可爱的思念和执着，而是躯体的枷锁，是花女无法抗拒的东西。

尽管她并不厌恶这枷锁。

林间传来窸窸窣窣的声响，她疲倦地眨了眨眼，红椿盛放，藤蔓瞬息间刺穿了不远处黑暗中的残象。

是了，这就是她的本能，是她的本质，是她的自我……即便在她即将丢失全部记忆和思想时，她仍旧可以依靠自己的本能。

事实上，除了本能，她实在也没什么可抓住的东西了。

下一次……如果能真正认识【玩家名】，和【TA】说说话就好了。花女模糊地思考着。不过，这次她暴露了行踪，或许泰缇斯系统会将那个人引到此处也说不定。

花女闭上眼，在剧痛的顶峰陷入了安眠的黑暗。

带着凉意的湖水浸泡着她的半边脸孔，椿花逐渐枯萎，藤蔓收缩，回归她的躯体。

秋日的夜风吹拂着林叶，轻柔地触碰着沉睡在湖旁的她。大湖北侧，落香村的村民们即将在清晨从美梦中苏醒，彼此呼和着划船向此处来，开始新一日的渔猎。`,
  },
  {
    id: "5",
    title: "曾几何时",
    subtitle: "大厦之巅",
    era: "遥远的过去",
    location: "废土都市",
    content: `她从梦中醒来。

大厦顶端的风凛冽地吹着，她伸了个懒腰，半眯着眼睛向下望去。交错的马路栉比鳞次，川流不息的车辆以尾灯串起一节节多彩的链条，她撑着脸，哼起歌来。

这是她从【玩家名】那里学来的歌。

当然，不是亲自求问的，是她悄悄听来的。

他们现在或许算不上敌人，但这份联系无论如何算不上友好，顶多是单方面的认识。

【玩家名】的出现引起了各方关注，包括她所属的组织。

当然，这和她没什么关系，也不是她能考虑的事。

她不过是被臻选过的种子，是只为追踪【玩家名】而盛放的花。大部分时间里，沉浸在半梦半醒间，她都因为被注射的那些药剂而神思昏沉，唯有对那个人本能的追逐铭刻于心。

那些液体将她的理智拖入泥沼，夺走了她的清醒和自我。

她的思考是不连贯的、疯狂的，如一台随时会起爆的器械，在每一个指针走到终点的时刻前被强行重置。

但她并不在乎。

除了【玩家名】，她几乎不关心任何事。有时候，她觉得那个人就像是被置于空白的画框中。那是一张仅有轮廓的陌生人的画像。画像的剪影由她搜集的那些信息组成——尽管他们离得这么近，但从未见过一次面，因此她并不知道对方的相貌是什么样的。

据说是为了规避泰缇斯系统的追踪，这也意味着他们彼此间不能有接触。

真想和【TA】见一面呀！

她以一种几乎要坠下大厦的姿势将自己悬吊在空中，在心中悠然想到，又忍不住为这幻想嗤笑出声。

藤蔓缠绕着她的手臂向上攀援，细小的花苞在末端徐徐盛放。

忽然地，一个念头出现在她心头。

我要送一朵花给【玩家名】。

这个念头甫一出现，立刻占据了她全部的心神。她要找到【玩家名】，再寻找一个恰当的机会做这件事。然后，她会把这朵由自己躯体生出的椿花送给那个人，它不会损坏、也不会枯萎……这个念头也很快没入她纷乱的思绪中，不见踪影。

此时她尚且不知道，千百年后，她眼前的世界将会湮灭在大悲鸣中。而她会不断在记忆的迷宫徘徊、迷失，直到在一个秋日的清晨沉睡在落香村的湖边，与前来救援此地的【玩家名】相遇，加入黑海岸。再过数百年，那个人将会离开她，而她也将离开黑海岸，直到数十年后于今州重逢。一切未来尚未发生，正如可能性仍沉睡于种子中，等待着命运的绽放。

她从大厦上一跃而下，依靠藤蔓在建筑群中轻快地跳跃着，去找【TA】。`,
  },
];

// 彩蛋数据
const easterEggs = [
  {
    icon: "💝",
    title: "花语的秘密",
    description:
      "椿花的花语是'理想的爱'，暗示着椿对漂泊者纯粹而理想化的情感寄托。",
  },
  {
    icon: "🎨",
    title: "双色象征",
    description:
      "红白双色的椿花分别代表椿性格中热烈与纯洁的两面，也是她红椿/白椿形态的视觉隐喻。",
  },
  {
    icon: "🍂",
    title: "绚烂的凋零",
    description:
      "椿花总是在开得最绚烂时整朵落下，正如椿宁愿在最美好的时刻结束，也不愿慢慢枯萎。",
  },
];

// 响应式计算
const waveformStyle = (index: number) => {
  const height = 20 + Math.sin(index) * 15;
  const delay = index * 0.2;
  return {
    height: `${height}px`,
    animationDelay: `${delay}s`,
  };
};

// 故事切换逻辑
const currentStory = ref(0);
const storyRef = ref<HTMLElement | null>(null);

function selectStory(index: number) {
  currentStory.value = index;
}

function prev() {
  currentStory.value =
    (currentStory.value - 1 + stories.length) % stories.length;
  scrollToStories();
}

function next() {
  currentStory.value = (currentStory.value + 1) % stories.length;
  scrollToStories();
}

function scrollToStories() {
  storyRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// 初始化
onMounted(() => {
  // 可以添加一些初始化动画
});
</script>

<style scoped lang="scss">
// 主题色变量
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

// 衍生变量
$bg-gradient: linear-gradient(135deg, $deep-shadow 0%, #2a1515 100%);
$card-bg: rgba(26, 15, 15, 0.85);
$card-border: rgba(211, 47, 47, 0.15);
$text-primary: $camellia-cream;
$text-secondary: rgba($camellia-cream, 0.85);
$text-muted: rgba($camellia-cream, 0.6);

.camellia-page {
  position: relative;
  min-height: 100vh;
  background: $bg-gradient;
  font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif;
  color: $text-primary;
  padding: 1rem;
  overflow-x: hidden;
  padding-top: 120px;
  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba($camellia-red, 0.08) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba($camellia-white, 0.05) 0%,
        transparent 50%
      );
    z-index: 0;
    pointer-events: none;
  }
}

.bg-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba($camellia-red, 0.1) 1px,
    transparent 0
  );
  background-size: 40px 40px;
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}

.container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

/* ========== HERO 区域 ========== */
.hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  position: relative;

  @media (min-width: 768px) {
    grid-template-columns: 280px 1fr;
    gap: 3rem;
  }

  .left-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .avatar-card {
    background: linear-gradient(
      145deg,
      rgba($camellia-red, 0.15),
      rgba($camellia-white, 0.05)
    );
    border: 2px solid $card-border;
    border-radius: 20px;
    padding: 1rem;
    width: 100%;
    max-width: 280px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        $camellia-red,
        transparent
      );
      opacity: 0;
      transition: opacity 0.4s;
    }

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba($camellia-dark-red, 0.3),
        0 0 0 1px rgba($camellia-red, 0.2),
        inset 0 0 20px rgba($camellia-red, 0.1);

      &::before {
        opacity: 1;
      }

      .avatar {
        transform: scale(1.05);
        filter: brightness(1.1) contrast(1.1);
      }
    }

    &:active {
      transform: translateY(-4px);
    }
  }

  .avatar-wrap {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        transparent 40%,
        rgba($camellia-red, 0.1) 50%,
        transparent 60%
      );
      opacity: 0;
      transition: opacity 0.6s;
    }

    .avatar-card:hover &::after {
      opacity: 1;
      animation: shine 1.5s;
    }
  }

  .avatar {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s;
    border-radius: 10px;
  }

  .avatar-meta {
    margin-top: 1rem;
  }

  .avatar-badge {
    display: inline-block;
    background: linear-gradient(135deg, $camellia-red, $blood-crimson);
    color: $camellia-white;
    padding: 0.5rem 1.2rem;
    border-radius: 100px;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba($camellia-red, 0.3);
  }

  .right-col {
    .hero-panel {
      background: $card-bg;
      backdrop-filter: blur(20px);
      border: 1px solid $card-border;
      border-radius: 20px;
      padding: 2rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba($camellia-white, 0.1);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(
          90deg,
          $camellia-red,
          $camellia-light-red,
          $camellia-red
        );
      }
    }

    .name {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 800;
      background: linear-gradient(
        135deg,
        $camellia-white 20%,
        $camellia-light-red 50%,
        $blood-crimson 80%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin: 0 0 0.5rem 0;
      line-height: 1.1;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .jp {
      display: block;
      font-size: 1.2rem;
      color: $camellia-light-red;
      font-weight: 400;
      margin-top: 0.5rem;
    }

    .subtitle {
      font-size: 1.2rem;
      color: $camellia-light-red;
      margin: 1rem 0;
      font-style: italic;
      position: relative;
      padding-left: 1.5rem;

      &::before {
        content: "❧";
        position: absolute;
        left: 0;
        opacity: 0.7;
      }
    }

    .lead {
      font-size: 1.1rem;
      line-height: 1.7;
      color: $text-secondary;
      margin: 1.5rem 0;
      padding: 1.5rem;
      background: rgba($camellia-red, 0.05);
      border-radius: 12px;
      border-left: 3px solid $camellia-red;
    }

    .camellia-facts {
      margin-top: 2rem;
      padding: 1.5rem;
      background: linear-gradient(
        135deg,
        rgba($camellia-red, 0.1),
        rgba($camellia-white, 0.05)
      );
      border-radius: 12px;
      border: 1px solid rgba($camellia-red, 0.2);

      .facts-title {
        font-size: 1.2rem;
        color: $camellia-light-red;
        margin: 0 0 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .facts-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 0.5rem 0;
          color: $text-secondary;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;

          &::before {
            content: "•";
            color: $camellia-red;
            font-weight: bold;
          }

          strong {
            color: $camellia-white;
            min-width: 4rem;
          }
        }
      }
    }
  }
}

/* ========== 通用卡片样式 ========== */
.card {
  background: $card-bg;
  backdrop-filter: blur(20px);
  border: 1px solid $card-border;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba($camellia-red, 0.2);
  }

  .card-head {
    margin-bottom: 1.5rem;
    position: relative;

    h2 {
      font-size: 1.8rem;
      color: $camellia-white;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .flower-icon {
        font-size: 1.4rem;
        opacity: 0.8;
      }
    }
  }
}

/* ========== 人物经历时间线 ========== */
.experience-timeline {
  .timeline-container {
    position: relative;
    padding: 2rem 0;

    .timeline-line {
      position: absolute;
      left: 1.5rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(
        to bottom,
        transparent,
        $camellia-red,
        transparent
      );
      opacity: 0.6;

      @media (min-width: 768px) {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .timeline-item {
    position: relative;
    margin-bottom: 3rem;
    opacity: 0;
    animation: fadeInUp 0.6s ease forwards;
    animation-delay: var(--delay, 0s);

    @media (min-width: 768px) {
      display: flex;
      align-items: center;

      &:nth-child(odd) {
        flex-direction: row-reverse;

        .timeline-content {
          margin-right: auto;
          margin-left: 3rem;
          text-align: right;
        }
      }

      &:nth-child(even) {
        .timeline-content {
          margin-left: auto;
          margin-right: 3rem;
          text-align: left;
        }
      }
    }

    .timeline-dot {
      position: absolute;
      left: 1.25rem;
      top: 0.5rem;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: 3px solid $card-bg;
      z-index: 2;

      &.dot-red {
        background: linear-gradient(135deg, $camellia-red, $camellia-light-red);
        box-shadow: 0 0 12px rgba($camellia-red, 0.6);
      }

      &.dot-white {
        background: linear-gradient(135deg, $camellia-white, $camellia-cream);
        box-shadow: 0 0 12px rgba($camellia-white, 0.6);
      }

      @media (min-width: 768px) {
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .timeline-content {
      background: rgba($camellia-red, 0.08);
      border: 1px solid rgba($camellia-red, 0.15);
      border-radius: 16px;
      padding: 1.5rem;
      margin-left: 3rem;
      position: relative;

      @media (min-width: 768px) {
        width: calc(50% - 3rem);
        margin-left: 0;
      }

      &::before {
        content: "";
        position: absolute;
        top: 1.5rem;
        left: -0.5rem;
        width: 1rem;
        height: 1rem;
        background: inherit;
        border-left: inherit;
        border-bottom: inherit;
        transform: rotate(45deg);
        border-radius: 2px;

        @media (min-width: 768px) {
          left: auto;
          right: -0.5rem;
          transform: rotate(-135deg);
        }
      }

      .timeline-title {
        color: $camellia-light-red;
        margin: 0 0 0.75rem 0;
        font-size: 1.3rem;
      }

      .timeline-desc {
        color: $text-secondary;
        line-height: 1.6;
        margin: 0 0 1rem 0;
      }

      .timeline-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .tag {
          background: rgba($camellia-red, 0.15);
          color: $camellia-light-red;
          padding: 0.3rem 0.8rem;
          border-radius: 100px;
          font-size: 0.85rem;
          border: 1px solid rgba($camellia-red, 0.3);
        }
      }
    }
  }
}

/* ========== 核心机制 ========== */
.personality {
  .traits {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 1.25rem;
      margin-bottom: 0.75rem;
      background: rgba($camellia-red, 0.05);
      border-radius: 12px;
      border-left: 3px solid transparent;
      transition: all 0.3s;
      display: flex;
      align-items: flex-start;
      gap: 1rem;

      &:hover {
        background: rgba($camellia-red, 0.1);
        border-left-color: $camellia-red;
        transform: translateX(4px);
      }

      &.highlight {
        background: linear-gradient(
          135deg,
          rgba($camellia-red, 0.1),
          rgba($vein-purple, 0.05)
        );
        border-left-color: $vein-purple;

        .trait-icon {
          color: $vein-purple;
        }
      }

      .trait-icon {
        font-size: 1.2rem;
        color: $camellia-red;
        flex-shrink: 0;
        margin-top: 0.2rem;
      }

      .trait-text {
        flex: 1;
        color: $text-secondary;
        line-height: 1.6;

        :deep(strong) {
          color: $camellia-white;
        }
      }
    }
  }
}

/* ========== 异能力检验报告 ========== */
.overview {
  .two-col {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 992px) {
      grid-template-columns: 1fr 300px;
    }
  }

  .text-block {
    .report-section {
      margin-bottom: 2.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .report-title {
      color: $camellia-light-red;
      font-size: 1.2rem;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba($camellia-red, 0.3);
    }

    .report-content {
      color: $text-secondary;
      line-height: 1.7;
      margin: 0 0 1rem 0;

      .danger-text {
        color: $danger-glow;
        font-weight: 600;
      }
    }

    .report-footnote {
      background: rgba($camellia-red, 0.08);
      border-left: 3px solid $camellia-red;
      padding: 1rem;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: $text-muted;

      .footnote-icon {
        margin-right: 0.5rem;
        opacity: 0.8;
      }
    }
  }
}

/* ========== 收藏品网格 ========== */
.collectibles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  .collectible-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-8px) scale(1.02);
    }

    &.collectible-red {
      border-top: 4px solid $camellia-red;

      .collectible-content {
        border-top-color: rgba($camellia-red, 0.3);
      }
    }

    &.collectible-white {
      border-top: 4px solid $camellia-white;

      .collectible-content {
        border-top-color: rgba($camellia-white, 0.3);
      }
    }

    .card-head {
      margin-bottom: 1rem;

      h2 {
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    .collectible-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid;

      .collectible-image {
        img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 12px;
          transition: transform 0.6s;
        }

        &:hover img {
          transform: scale(1.05);
        }
      }

      .collectible-text {
        flex: 1;

        p {
          color: $text-secondary;
          line-height: 1.6;
          margin: 0;
          font-size: 0.95rem;
        }
      }
    }
  }
}

/* ========== 共鸣链时间线 ========== */
.timeline {
  .tl-wrap {
    position: relative;
    padding: 2rem 1rem;

    .vl {
      position: absolute;
      left: 2.5rem;
      top: 2rem;
      bottom: 2rem;
      width: 2px;
      background: linear-gradient(
        to bottom,
        transparent,
        rgba($camellia-red, 0.6),
        transparent
      );

      @media (min-width: 768px) {
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .tl-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .tl-item {
      position: relative;
      margin-bottom: 2.5rem;
      opacity: 0;
      animation: fadeInUp 0.6s ease forwards;
      animation-delay: var(--delay, 0s);

      @media (min-width: 768px) {
        width: calc(50% - 40px);

        &:nth-child(odd) {
          margin-left: auto;

          .tl-card {
            &::before {
              left: -10px;
              border-width: 10px 10px 10px 0;
              border-color: transparent $card-bg transparent transparent;
            }
          }
        }

        &:nth-child(even) {
          .tl-card {
            &::before {
              right: -10px;
              border-width: 10px 0 10px 10px;
              border-color: transparent transparent transparent $card-bg;
            }
          }
        }
      }

      &::after {
        content: "";
        position: absolute;
        left: 2rem;
        top: 1.5rem;
        width: 12px;
        height: 12px;
        background: linear-gradient(135deg, $camellia-red, $camellia-light-red);
        border-radius: 50%;
        border: 3px solid $card-bg;
        box-shadow: 0 0 12px rgba($camellia-red, 0.6);
        z-index: 2;

        @media (min-width: 768px) {
          left: 50%;
          transform: translateX(-50%);
        }
      }

      &:nth-child(even)::after {
        background: linear-gradient(135deg, $camellia-white, $camellia-cream);
        box-shadow: 0 0 12px rgba($camellia-white, 0.6);
      }
    }

    .tl-card {
      background: linear-gradient(
        135deg,
        rgba($camellia-red, 0.1),
        rgba($deep-shadow, 0.8)
      );
      border: 1px solid rgba($camellia-red, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      margin-left: 4rem;
      position: relative;
      transition: all 0.3s;

      @media (min-width: 768px) {
        margin-left: 0;
      }

      &::before {
        content: "";
        position: absolute;
        top: 1.5rem;
        left: -10px;
        border: 10px solid transparent;
        border-right-color: $card-bg;

        @media (min-width: 768px) {
          content: none;
        }
      }

      &:hover {
        transform: translateX(4px);
        box-shadow: 0 8px 24px rgba($camellia-red, 0.2);
      }

      .chain-number {
        display: block;
        color: $camellia-light-red;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .tl-title {
        color: $camellia-white;
        font-size: 1.2rem;
        margin: 0 0 0.75rem 0;
        line-height: 1.3;
      }

      .tl-desc {
        color: $text-secondary;
        line-height: 1.6;
        margin: 0;
        font-size: 0.95rem;
        white-space: pre-wrap;
      }
    }
  }
}

/* ========== 故事区域 ========== */
.ll-stories {
  .card {
    border-color: rgba($camellia-red, 0.25);
  }

  .card-head {
    text-align: center;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba($camellia-red, 0.2);

    .card-title {
      font-size: 2rem;
      justify-content: center;
    }

    .stories-subtitle {
      color: $camellia-light-red;
      font-size: 1rem;
      margin-top: 0.5rem;
      font-style: italic;
    }
  }

  .card-body {
    padding: 2rem 0;
  }

  .stories-tabs {
    display: flex;
    overflow-x: auto;
    gap: 0.5rem;
    padding: 0.5rem;
    margin-bottom: 2rem;
    scrollbar-width: thin;
    scrollbar-color: $camellia-red $deep-shadow;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba($camellia-red, 0.1);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: $camellia-red;
      border-radius: 3px;
    }

    .tab-button {
      flex: 0 0 auto;
      background: rgba($camellia-red, 0.1);
      border: 1px solid rgba($camellia-red, 0.2);
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      min-width: 140px;
      text-align: left;

      &:hover {
        background: rgba($camellia-red, 0.2);
        transform: translateY(-2px);
      }

      &.active {
        background: linear-gradient(
          135deg,
          rgba($camellia-red, 0.3),
          rgba($vein-purple, 0.2)
        );
        border-color: $camellia-red;
        box-shadow: 0 4px 16px rgba($camellia-red, 0.3);

        .tab-title {
          color: $camellia-white;
        }
      }

      .tab-title {
        display: block;
        color: $camellia-light-red;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .tab-subtitle {
        display: block;
        color: $text-muted;
        font-size: 0.85rem;
      }
    }
  }

  .story {
    .story-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba($camellia-red, 0.2);

      .story-head {
        color: $camellia-white;
        font-size: 1.5rem;
        margin: 0 0 0.5rem 0;
      }

      .story-meta {
        display: flex;
        gap: 1rem;

        .meta-item {
          color: $camellia-light-red;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      }
    }

    .story-content {
      color: $text-secondary;
      line-height: 1.8;
      font-size: 1.05rem;
      white-space: pre-wrap;
      :deep(p) {
        margin: 0 0 1.5rem 0;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .card-foot {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 1.5rem;
    border-top: 1px solid rgba($camellia-red, 0.2);
    margin-top: 2rem;

    .nav-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        rgba($camellia-red, 0.2),
        rgba($camellia-red, 0.1)
      );
      border: 1px solid rgba($camellia-red, 0.3);
      color: $camellia-light-red;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: rgba($camellia-red, 0.3);
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .pager {
      color: $camellia-white;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .current {
        color: $camellia-red;
        font-weight: 600;
        font-size: 1.3rem;
      }

      .separator {
        color: $text-muted;
      }

      .total {
        color: $text-secondary;
      }
    }
  }
}

/* ========== 彩蛋区域 ========== */
.easter-egg {
  .egg-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .egg-item {
    background: linear-gradient(
      135deg,
      rgba($camellia-red, 0.08),
      rgba($camellia-white, 0.04)
    );
    border: 1px solid rgba($camellia-red, 0.15);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-4px);
      background: linear-gradient(
        135deg,
        rgba($camellia-red, 0.12),
        rgba($camellia-white, 0.06)
      );
    }

    .egg-icon {
      font-size: 2rem;
      flex-shrink: 0;
      opacity: 0.8;
    }

    .egg-text {
      flex: 1;

      h3 {
        color: $camellia-white;
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
      }

      p {
        color: $text-secondary;
        line-height: 1.6;
        margin: 0;
        font-size: 0.95rem;
      }
    }
  }

  .egg-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px dashed rgba($camellia-red, 0.3);

    .egg-hint {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: $text-muted;
      margin: 0;
      font-size: 0.95rem;
      padding: 1rem;
      background: rgba($camellia-red, 0.05);
      border-radius: 12px;

      .hint-icon {
        font-size: 1.2rem;
        opacity: 0.7;
      }
    }
  }
}

/* ========== 动画 ========== */
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(-5px, -60px) rotate(180deg);
  }
  75% {
    transform: translate(-10px, -30px) rotate(270deg);
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

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

@keyframes wave {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.7);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ========== 响应式调整 ========== */
@media (max-width: 767px) {
  .camellia-page {
    padding: 0.5rem;
  }

  .hero {
    .hero-panel {
      padding: 1.5rem;
    }

    .name {
      font-size: 2.2rem;
    }
  }

  .card {
    padding: 1.5rem;
  }

  .experience-timeline {
    .timeline-item {
      .timeline-content {
        margin-left: 2.5rem;
      }
    }
  }

  .ll-stories {
    .stories-tabs {
      .tab-button {
        min-width: 120px;
        padding: 0.75rem;
      }
    }
  }

  .timeline {
    .tl-wrap {
      .tl-item {
        .tl-card {
          margin-left: 3rem;
        }

        &::after {
          left: 1.75rem;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .hero {
    .avatar-card {
      max-width: 220px;
    }
  }

  .collectibles-grid {
    .collectible-card {
      .collectible-content {
        .collectible-image img {
          height: 150px;
        }
      }
    }
  }

  .ll-stories {
    .story {
      .story-header {
        .story-meta {
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    }
  }
}

/* ========== 打印样式 ========== */
@media print {
  .camellia-page {
    background: white !important;
    color: black !important;
    padding: 0 !important;
  }

  .bg-pattern,
  .nav-btn {
    display: none !important;
  }

  .card {
    break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #ccc !important;
  }
}
</style>