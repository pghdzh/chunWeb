<template>
  <div class="chat-page">
    <div class="carousel carousel1" aria-hidden="true">
      <img
        v-for="(src, idx) in randomFive"
        :key="idx"
        :src="src"
        class="carousel-image"
        :class="{ active: idx === currentIndex }"
      />
    </div>
    <div class="carousel carousel2" aria-hidden="true">
      <img
        v-for="(src, idx) in randomFive2"
        :key="idx"
        :src="src"
        class="carousel-image"
        :class="{ active: idx === currentIndex }"
      />
    </div>

    <div class="chat-container">
      <!-- 统计面板（放在聊天容器顶部） -->
      <div class="stats-panel">
        <div class="stat-item">
          总对话次数：<span>{{ stats.totalChats }}</span>
        </div>
        <div class="stat-item">
          首次使用：<span>{{
            new Date(stats.firstTimestamp).toISOString().slice(0, 10)
          }}</span>
        </div>
        <div class="stat-item">
          活跃天数：<span>{{ stats.activeDates.length }}</span> 天
        </div>
        <div class="stat-item">
          今日对话：<span>{{
            stats.dailyChats[new Date().toISOString().slice(0, 10)] || 0
          }}</span>
          次
        </div>
        <button class="detail-btn" @click="showModal = true">全部</button>
      </div>
      <div class="messages" ref="msgList">
        <transition-group name="msg" tag="div">
          <div
            v-for="msg in chatLog"
            :key="msg.id"
            :class="[
              'message',
              msg.role,
              { error: msg.isError, egg: msg.isEgg },
            ]"
          >
            <div class="avatar" :class="msg.role"></div>
            <div class="bubble">
              <div class="content" v-html="msg.text"></div>
            </div>
          </div>
          <div v-if="loading" class="message bot" key="loading">
            <div class="avatar bot"></div>
            <div class="bubble loading">
              正在思考中
              <span class="dots">
                <span class="dot">.</span>
                <span class="dot">.</span>
                <span class="dot">.</span>
              </span>
            </div>
          </div>
        </transition-group>
      </div>
      <form class="input-area" @submit.prevent="sendMessage">
        <textarea
          v-model="input"
          placeholder="向椿提问…"
          :disabled="loading"
          @keydown="handleKeydown"
          rows="1"
        ></textarea>

        <div class="btn-group">
          <button
            type="button"
            class="clear-btn"
            @click="clearChat"
            :disabled="loading"
            title="清空对话"
          >
            ✖
          </button>
        </div>
        <button
          type="button"
          class="copy-btn"
          :disabled="!chatLog.length || loading"
          @click="() => copyChat()"
        >
          {{ copyButtonText }}
        </button>
        <!-- 发送按钮 -->
        <button
          type="submit"
          class="send-btn"
          :disabled="!input.trim() || loading"
        >
          发送
        </button>

        <!-- 统计数据按钮 -->
        <button
          type="button"
          class="Alldetail-btn"
          @click="showModal = true"
          title="查看统计"
        >
          统计数据
        </button>
      </form>
    </div>

    <!-- 详细统计弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h3>详细统计</h3>
        <ul class="detail-list">
          <li>总对话次数：{{ stats.totalChats }}</li>
          <li>
            首次使用：{{
              new Date(stats.firstTimestamp).toISOString().slice(0, 10)
            }}
          </li>
          <li>活跃天数：{{ stats.activeDates.length }} 天</li>
          <li>
            今日对话：{{
              stats.dailyChats[new Date().toISOString().slice(0, 10)] || 0
            }}
            次
          </li>
          <li>总使用时长：{{ formatDuration(stats.totalTime) }}</li>
          <li>当前连续活跃：{{ stats.currentStreak }} 天</li>
          <li>最长连续活跃：{{ stats.longestStreak }} 天</li>
          <li>
            最活跃日：{{ mostActiveDayComputed }} （{{
              stats.dailyChats[mostActiveDayComputed] || 0
            }}
            次）
          </li>
        </ul>
        <button class="close-btn" @click="showModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  computed,
  onMounted,
  nextTick,
  watch,
  onBeforeUnmount,
} from "vue";
import { sendMessageToHui } from "@/api/deepseekApi";

const STORAGE_KEY = "hui_chat_log";

// 本地存储键名
const STORAGE_STATS_KEY = "hui_chat_stats";
const showModal = ref(false);
// Stats 类型声明，确保所有字段都有默认值
interface Stats {
  firstTimestamp: number; // 首次使用时间戳
  totalChats: number; // 总对话次数
  activeDates: string[]; // 有发言的日期列表（yyyy‑mm‑dd）
  dailyChats: Record<string, number>; // 每日对话次数
  currentStreak: number; // 当前连续活跃天数
  longestStreak: number; // 历史最长连续活跃天数

  totalTime: number; // 累计使用时长（毫秒）
}

// 默认值，用于补齐本地存储中可能缺失的字段
const defaultStats: Stats = {
  firstTimestamp: Date.now(),
  totalChats: 0,
  activeDates: [],
  dailyChats: {},
  currentStreak: 0,
  longestStreak: 0,

  totalTime: 0,
};

// 从 localStorage 加载并合并默认值
function loadStats(): Stats {
  const saved = localStorage.getItem(STORAGE_STATS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { ...defaultStats, ...parsed };
    } catch {
      console.warn("加载统计数据失败，使用默认值");
    }
  }
  return { ...defaultStats };
}

// 保存到 localStorage
function saveStats() {
  localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
}

// 更新「活跃天数」及「连续活跃」逻辑
function updateActive(date: string) {
  if (!stats.activeDates.includes(date)) {
    stats.activeDates.push(date);
    updateStreak();
    saveStats(); // 持久化活跃天数变化
  }
}
function updateStreak() {
  const dates = [...stats.activeDates].sort();
  let curr = 0,
    max = stats.longestStreak,
    prevTs = 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  dates.forEach((d) => {
    const ts = new Date(d).getTime();
    if (prevTs && ts - prevTs === 86400000) curr++;
    else curr = 1;
    max = Math.max(max, curr);
    prevTs = ts;
  });
  stats.currentStreak = dates[dates.length - 1] === todayStr ? curr : 0;
  stats.longestStreak = max;
  saveStats();
}

// 更新「每日对话次数」
function updateDaily(date: string) {
  stats.dailyChats[date] = (stats.dailyChats[date] || 0) + 1;
  saveStats(); // 持久化活跃天数变化
}

// 计算最活跃日
const mostActiveDayComputed = computed(() => {
  let day = "",
    max = 0;
  for (const [d, c] of Object.entries(stats.dailyChats)) {
    if (c > max) {
      max = c;
      day = d;
    }
  }
  return day || new Date().toISOString().slice(0, 10);
});

// 格式化总使用时长
function formatDuration(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h ? `${h} 小时 ${m} 分钟` : `${m} 分钟`;
}

// —— Vue 响应式状态 ——
const stats = reactive<Stats>(loadStats());
// 会话开始时间，用于计算本次时长
const sessionStart = Date.now();

interface ChatMsg {
  id: number;
  role: "user" | "bot";
  text: string;
  isError?: boolean;
  isEgg?: boolean;
}

const chatLog = ref<ChatMsg[]>(loadChatLog());
const input = ref("");
const loading = ref(false);
const msgList = ref<HTMLElement>();

const encourageEggs = [
  {
    file: "audio (0).mp3",
    text: "我真正的死亡，或许不是心跳停止…而是某天醒来，看见你送的礼物，却再也想不起‘你’是谁。连‘遗忘’本身，都被遗忘的那一刻。",
  },
  {
    file: "audio (1).mp3",
    text: "别动哦。你已经被我的花缠住了……开玩笑的。今天阳光很好，陪我晒晒太阳吧？",
  },
  {
    file: "audio (2).mp3",
    text: "如果你敢轻易死掉，我可是会非常、非常生气的。毕竟，我的花还没送你呢。",
  },
  {
    file: "audio (3).mp3",
    text: "我们认识多久了？算了，记不清也好。只要现在你在这里，就够了。",
  },
  {
    file: "audio (4).mp3",
    text: "我雕了很多个‘你’…睡着的、战斗的、皱着眉头的。可它们都没有温度。所以…你要好好活着，活到我能亲手把这个给你——那朵永不凋谢的椿花。这是我…唯一的‘永恒’了。",
  },
  {
    file: "audio (5).mp3",
    text: "手链的频率…很平稳。很好。如果你让它乱响起来…我会第一个知道，也会第一个赶到。至于赶到了是救你，还是笑话你…就看我心情了。",
  },
  {
    file: "audio (6).mp3",
    text: "医疗舱的味道…我又回来了吗？这次忘了多久…一天？一年？…看见你还在，看来时间没跑太远。扶我一下，我们去晒晒太阳。趁我…还没把‘现在’也忘掉。",
  },
  {
    file: "audio (7).mp3",
    text: "新调的冻葡果茶，油柑我多放了一颗…会很涩哦。但回甘的时候，你会想起我的。就像痛苦之后，才会记得快乐有多清晰…来，试试看？",
  },
  {
    file: "audio (8).mp3",
    text: "有时候，当一只不用思考过去的动物也挺好。饿了就捕猎，困了就睡觉，喜欢就靠近…就像我现在，只是忽然想见你了，所以就来找你了。不需要其他理由。",
  },
  {
    file: "audio (9).mp3",
    text: "人类用‘年’来丈量生命，真有趣。我的尺度是‘遗忘’。上一次彻底忘记你，到这一次重新记住你…这中间，就是我的‘一生’。所以，对我好一点哦，在我‘活着’的这段时间里。",
  },
  {
    file: "audio (10).mp3",
    text: "我好像…在几百年前的一个雨天，也等过一个人。伞是红色的，像花一样。…那个人是你吗？还是另一个，被我彻底忘掉的人？算了，别回答。现在的你，是现在的你就好。",
  },
  {
    file: "audio (11).mp3",
    text: "我知道，太过靠近会让你想逃。没关系哦。我的花可以开在很远的地方，藤蔓可以延伸到你看不见的阴影里…但我总能知道你在哪。这种‘知道’，就是我最舒适的牢笼。对你，也对我。",
  },
  {
    file: "audio (12).mp3",
    text: "别把我想象成需要你拯救的脆弱花朵。我是藤蔓，是荆棘。你前进时，我可以为你铺路，也可以…轻易将你绊倒。靠近我，本身就是一种危险游戏。你…还没玩腻吧？",
  },
  {
    file: "audio (13).mp3",
    text: "有时，我会突然‘确认’到自己的存在…比如现在，阳光穿过我眼睫的这一刻。下一瞬可能又会忘记。所以，如果你看到我在发呆，可能…我正在努力记住‘活着’的感觉。",
  },
  {
    file: "audio (14).mp3",
    text: "你说，对于一株植物而言，‘思考’是不是一种病？我大概…病得不轻。不然怎么会觉得，和你这样消磨时间，比自由生长更有趣。",
  },
  {
    file: "audio (15).mp3",
    text: "人类喜欢用‘爱’或‘恨’来概括一切。真方便啊。可我分不清。我只知道，你是我无尽荒原里，唯一想听见的回声。这算什么？你可以告诉我。",
  },
  {
    file: "audio (16).mp3",
    text: "…我们刚才说到哪儿了？啊，没关系。反正对话像藤蔓，走丢了，总会从另一个地方长出来。你只要习惯我的‘断层’就好…就像习惯四季轮转那样。",
  },
  {
    file: "audio (17).mp3",
    text: "看，用共鸣催生的小小花。它只能开一分钟。这一分钟，就是它的全部生命…而这一分钟，我选择看着你。这份‘短暂’，就是我给你的礼物。",
  },
  {
    file: "audio (18).mp3",
    text: "要好好戴着我的手链哦。如果哪天它不见了，哪怕是你摘下的…我也一定会知道。然后，我会用藤蔓编一条新的、永远也解不开的，亲自为你系上。",
  },
  {
    file: "audio (19).mp3",
    text: "夜晚真好。所有的噪音都沉淀下去，只剩下频率…你的，我的，世界的。这时候，我才能听清自己内部，那持续不断的、崩裂与重生的声音。",
  },
  {
    file: "audio (20).mp3",
    text: "偶尔，只是偶尔，我会希望这个‘当下’能无限延长。没有过去要追查，没有未来要担忧，就像琥珀里的昆虫。而你是凝固我的那颗松脂…呵，我好像说了些奇怪的话。",
  },
  {
    file: "audio (21).mp3",
    text: "我的触觉…有时很模糊。分不清是藤蔓碰到了石头，还是我的‘心’碰到了‘孤独’的边界。你能分得清吗？",
  },
  {
    file: "audio (22).mp3",
    text: "如果有一天，你发现我开始说‘永远’…快逃。那说明我已经病入膏肓，想把你也拖进我静止的时间里，做我唯一的标本。",
  },
  {
    file: "audio (23).mp3",
    text: "把你做成木偶好不好？这样你就不会老，不会变，不会离开。…呵，骗你的。我更喜欢看你挣扎、改变、不情愿…却又不得不走向我的样子。",
  },
  {
    file: "audio (24).mp3",
    text: "你今天…频率里有一点杂音。是焦虑？还是隐藏的悲伤？不想说也没关系，我的花会安静地把它吸走…作为生长的养分。",
  },
];

function playVoice(name: string) {
  const audio = new Audio(`/voice/${name}`);
  audio.play().catch((e) => console.warn("音频播放失败：", e));
}

let lastEggTime = 0; // 记录最后一次触发彩蛋的时间戳
let coolDownPeriod = 1 * 60 * 1000; // 冷却1分钟（毫秒）
const triggeredVoices = new Set(
  JSON.parse(localStorage.getItem("triggeredVoices") || "[]")
);

async function sendMessage() {
  if (!input.value.trim()) return;
  if (stats.totalChats === 0 && !localStorage.getItem(STORAGE_STATS_KEY)) {
    stats.firstTimestamp = Date.now();
    saveStats();
  }
  const date = new Date().toISOString().slice(0, 10); // 每次都取最新“今天”
  stats.totalChats++;
  updateActive(date);
  updateDaily(date);
  saveStats();

  const userText = input.value;
  chatLog.value.push({
    id: Date.now(),
    role: "user",
    text: userText,
  });
  input.value = "";
  loading.value = true;

  try {
    //  throw new Error("测试错误");
    const history = chatLog.value.filter((msg) => !msg.isEgg && !msg.isError);
    const botReply = await sendMessageToHui(userText, history);
    if (botReply == "error") {
      chatLog.value.push({
        id: Date.now() + 2,
        role: "bot",
        text: "可能是API余额耗尽或者到达对话上限了，清空试试还不行的话就b站联系我吧",
        isError: true,
      });
    } else {
      chatLog.value.push({
        id: Date.now() + 1,
        role: "bot",
        text: botReply,
      }); // —— 鼓励彩蛋：5% 概率触发 ——
      if (Date.now() - lastEggTime > coolDownPeriod && Math.random() < 0.05) {
        // 随机挑一条
        let voiceId = Math.floor(Math.random() * encourageEggs.length);
        const egg = encourageEggs[voiceId];

        // 记录触发过的语音编号
        triggeredVoices.add(voiceId || 0);

        // 保存到 localStorage
        localStorage.setItem(
          "triggeredVoices",
          JSON.stringify([...triggeredVoices])
        );

        // 播放对应语音（不带 .mp3 后缀）
        playVoice(egg.file);
        // 推入带标记的彩蛋消息
        chatLog.value.push({
          id: Date.now() + 2,
          role: "bot",
          text: `<p style="color:#d32f2f; font-style: italic;font-weight: bold">${egg.text}</p>`,
          isEgg: true,
        });
        lastEggTime = Date.now();
      }
      // —— 彩蛋结束 ——
    }
  } catch (e) {
    console.error(e);
   
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") sendMessage();
}

function clearChat() {
  if (confirm("确定要清空全部对话吗？")) {
    chatLog.value = [
      {
        id: Date.now(),
        role: "bot",
        text: "（轻轻地哼着歌，藤蔓悄无声息地从背后攀上你的肩头）啊呀，找到你了。今天的阳光真好……要尝尝我新调的冻葡果茶吗？这次的回甘，一定会让你记住的~",
      },
    ];
    localStorage.removeItem(STORAGE_KEY);
  }
}

function loadChatLog(): ChatMsg[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("chatLog 解析失败：", e);
    }
  }
  return [
    {
      id: Date.now(),
      role: "bot",
      text: "（轻轻地哼着歌，藤蔓悄无声息地从背后攀上你的肩头）啊呀，找到你了。今天的阳光真好……要尝尝我新调的冻葡果茶吗？这次的回甘，一定会让你记住的~",
    },
  ];
}

async function scrollToBottom() {
  await nextTick();
  if (msgList.value) {
    msgList.value.scrollTop = msgList.value.scrollHeight;
  }
}

//复制文本相关
// 复制按钮文字与定时器（加入到 script setup）
const copyButtonText = ref("复制");
let _copyTimer: number | null = null;

// 把 HTML 文本转为纯文本（保留 <br> 换行）
function stripHtml(html = ""): string {
  if (typeof document === "undefined") {
    // SSR 安全返回
    return html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
  }
  const div = document.createElement("div");
  const withBreaks = String(html).replace(/<br\s*\/?>/gi, "\n");
  div.innerHTML = withBreaks;
  return div.textContent || div.innerText || "";
}

// 根据 chatLog.build 出可读的纯文本（含时间戳）
function buildChatPlainText(): string {
  // chatLog 是你已有的 ref<ChatMsg[]>
  return chatLog.value
    .map((msg) => {
      // 尝试把 msg.id 当作时间戳（你的代码里确实用 Date.now() 作为 id）
      const time = new Date(msg.id).toLocaleString();
      const who = msg.role === "user" ? "你" : "椿";
      const text = stripHtml(msg.text);
      return `[${time}] ${who}: ${text}`;
    })
    .join("\n\n");
}

// 回退复制：execCommand
function fallbackCopyText(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // 防止滚动到页面底部
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("execCommand copy failed");
}

// 主复制函数（在模板里绑定 @click="copyChat"）
async function copyChat() {
  const text = buildChatPlainText();
  if (!text) {
    copyButtonText.value = "无内容可复制";
    clearTimeout(_copyTimer as number);
    _copyTimer = window.setTimeout(() => (copyButtonText.value = "复制"), 1600);
    return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopyText(text);
    }
    copyButtonText.value = "已复制";
  } catch (err) {
    try {
      // 再试一次回退方案
      fallbackCopyText(text);
      copyButtonText.value = "已复制";
    } catch (e) {
      console.error("复制失败：", e);
      copyButtonText.value = "复制失败";
    }
  } finally {
    clearTimeout(_copyTimer as number);
    _copyTimer = window.setTimeout(() => (copyButtonText.value = "复制"), 1600);
  }
}

watch(
  chatLog,
  async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatLog.value));
    await scrollToBottom();
  },
  { deep: true }
);

function handleBeforeUnload() {
  stats.totalTime += Date.now() - sessionStart;
  saveStats();
}

// ========== 背景图片导入与轮播 ==========
const modules = import.meta.glob("@/assets/images1/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const allSrcs: string[] = Object.values(modules).map((mod: any) => mod.default);

const modules2 = import.meta.glob("@/assets/images2/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const allSrcs2: string[] = Object.values(modules2).map(
  (mod: any) => mod.default
);

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
let Imgtimer: number | undefined;

onMounted(() => {
  scrollToBottom();
  window.addEventListener("beforeunload", handleBeforeUnload);
  Imgtimer = window.setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % Math.max(1, randomFive.value.length);
  }, 5200);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  if (Imgtimer) clearInterval(Imgtimer);
  if (_copyTimer) clearTimeout(_copyTimer);
});
</script>

<style scoped lang="scss">
/* 颜色变量（集中管理）*/

$accent-1: #8b0000; // 暗紫主光（冷雅）
$accent-2: #d32f2f; // 冷海蓝高光（湿光感）

$accent-2-light: #f5fafc; // $accent-2 向白方向提亮约12%（手算替代 lighten）

$text-light: #f3fbff; // 近白文本

/* 半透明 / 阴影常用（用 rgba(hex, alpha) 生成）*/
$accent-1-05: rgba($accent-1, 0.05);
$accent-2-03: rgba($accent-2, 0.03);
$accent-2-04: rgba($accent-2, 0.04);
$accent-2-06: rgba($accent-2, 0.06);
$accent-2-26: rgba($accent-2, 0.26);
$accent-1-12: rgba($accent-1, 0.12);
$text-light-02: rgba($text-light, 0.02);
$text-light-22: rgba($text-light, 0.22);
$text-light-72: rgba($text-light, 0.72);

/* ====== 椿风格 · 聊天页（基于你原结构） ====== */
.chat-page {
  padding-top: 64px;
  min-height: 100vh;
  font-family: "Noto Sans SC", "PingFang SC", "Helvetica Neue", Arial,
    sans-serif;
  color: $text-light;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    180deg,
    rgba(8, 6, 10, 1) 0%,
    rgba(3, 2, 6, 1) 100%
  );
  position: relative;
  overflow-x: hidden;

  /* 舞台紫光层（代替月光气流） */
  &::before {
    content: "";
    position: fixed;
    inset: 0;
    background: radial-gradient(
        600px 160px at 10% 8%,
        $accent-1-05,
        transparent 12%
      ),
      radial-gradient(420px 120px at 78% 18%, $accent-2-03, transparent 12%);
    pointer-events: none;
    z-index: 0;
    mix-blend-mode: screen;
    filter: blur(6px);
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
      background: linear-gradient(
        180deg,
        rgba(2, 6, 10, 0.12),
        rgba(2, 6, 10, 0.28)
      );
      pointer-events: none;
      z-index: 1;
      mix-blend-mode: multiply;
    }

    .carousel-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      filter: blur(0.8px) saturate(0.98) contrast(0.96);
      transition: opacity 560ms ease,
        transform 760ms cubic-bezier(0.2, 0.9, 0.2, 1);

      &.active {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  .carousel2 {
    display: none;
  }

  .chat-container {
    flex: 1;
    width: 920px;
    max-width: calc(100% - 32px);
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    z-index: 9;
    position: relative;
  }

  /* 统计面板：玻璃 + 紫光高光 */
  .stats-panel {
    display: flex;
    align-items: center;
    background: linear-gradient(
      180deg,
      rgba(10, 10, 14, 0.6),
      rgba(6, 6, 10, 0.54)
    );
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 14px;
    color: $accent-2-light; /* 直接使用替代色，避免 lighten() */
    justify-content: space-around;
    box-shadow: 0 12px 34px rgba(2, 4, 8, 0.6);
    border: 1px solid $accent-2-06;
    backdrop-filter: blur(6px) saturate(0.98);

    .stat-item {
      .label {
        font-size: 12px;
        color: $text-light-72;
        margin-bottom: 4px;
      }

      span {
        color: $accent-2;
        font-weight: 700;
        font-size: 15px;
        text-shadow: 0 0 6px rgba($accent-2, 0.06);
      }
    }

    .detail-btn {
      background: transparent;
      border: 1px solid $accent-2-06;
      border-radius: 8px;
      color: $text-light;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.16s ease, box-shadow 0.16s ease, transform 0.12s;

      &:hover {
        background: rgba($accent-2, 0.04);
        box-shadow: 0 10px 26px rgba($accent-2, 0.06);
        transform: translateY(-2px);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 6px rgba($accent-2, 0.04);
      }
    }
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0 140px;
    overscroll-behavior: contain;
    scroll-behavior: smooth;
    max-height: 72vh;
    z-index: 6;
  }

  /* 消息气泡：椿风（紫光内衬 + 金色极细点缀） */
  .message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 14px;
    color: $text-light;
    position: relative;

    &.user {
      flex-direction: row-reverse;
    }

    &.error .bubble {
      background: linear-gradient(
        180deg,
        rgba(90, 30, 40, 0.16),
        rgba(60, 20, 28, 0.12)
      );
      border: 1px solid rgba(200, 60, 70, 0.12);
      box-shadow: 0 8px 26px rgba(80, 30, 30, 0.06);
    }

    &.egg .bubble {
      border: 1px solid $accent-2-06;
      box-shadow: 0 8px 26px rgba($accent-2, 0.06);
      transition: all 0.28s cubic-bezier(0.2, 0.9, 0.2, 1);
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin: 0 10px;
      background-size: cover;
      background-position: center;
      flex-shrink: 0;
      z-index: 10;
      box-shadow: 0 8px 28px rgba(2, 6, 12, 0.6);
      border: 1px solid rgba($text-light, 0.03);
      background-clip: padding-box;

      &.bot {
        background-image: url("@/assets/avatar/chun.webp");
        box-shadow: 0 10px 34px rgba($accent-2, 0.06),
          inset 0 1px 0 rgba($accent-1, 0.03);
        border: 2px solid $accent-2-06;
        transform: scaleX(-1);
      }

      &.user {
        background: linear-gradient(
          180deg,
          rgba(6, 6, 10, 1),
          rgba(6, 6, 10, 0.96)
        );
        box-shadow: 0 8px 22px rgba(2, 6, 12, 0.6);
        border: 1px solid rgba($accent-2, 0.02);
      }
    }

    .bubble {
      max-width: 78%;
      background: linear-gradient(
        180deg,
        rgba(6, 8, 12, 0.96),
        rgba(8, 6, 10, 0.98)
      );
      border: 1px solid $accent-2-04;
      padding: 14px 16px;
      border-radius: 16px;
      line-height: 1.7;
      word-break: break-word;
      box-shadow: 0 10px 30px rgba(2, 6, 14, 0.6);
      transition: box-shadow 0.18s, transform 0.12s, background 0.12s;
      color: $text-light;
      position: relative;
      overflow: visible;
      backdrop-filter: blur(2px) saturate(1);

      /* 紫光内衬（顶部轻薄高光条） */
      &::after {
        content: "";
        position: absolute;
        left: 8px;
        right: 8px;
        top: 6px;
        height: 6px;
        border-radius: 6px;
        background: linear-gradient(
          90deg,
          rgba($accent-2, 0.06),
          rgba($accent-1, 0.04)
        );
        pointer-events: none;
        mix-blend-mode: screen;
        opacity: 0.95;
        filter: blur(1px);
      }

      &:hover {
        box-shadow: 0 18px 44px rgba(2, 6, 14, 0.72),
          0 0 30px rgba($accent-2, 0.04);
        transform: translateY(-2px);
      }

      &.loading {
        color: rgba($text-light, 0.98);
        opacity: 0.98;
      }

      /* bot 消息视觉尾巴（左侧） */
      .message.bot & {
        border-radius: 16px 16px 16px 6px;
        background: linear-gradient(
          160deg,
          rgba(6, 8, 12, 0.98),
          rgba(6, 6, 10, 0.96)
        );
        box-shadow: 0 12px 36px rgba(6, 10, 18, 0.6),
          inset 0 1px 0 rgba($accent-2, 0.02);
      }

      /* user 消息右侧尾巴 */
      .message.user & {
        border-radius: 16px 16px 6px 16px;
        background: linear-gradient(
          200deg,
          rgba(6, 8, 12, 0.98),
          rgba(5, 6, 10, 0.96)
        );
      }

      .dots {
        display: inline-flex;
        align-items: center;
        margin-left: 6px;

        .dot {
          opacity: 0;
          font-size: 16px;
          animation: blink 1s infinite;
          color: $accent-2;

          &:nth-child(1) {
            animation-delay: 0s;
          }
          &:nth-child(2) {
            animation-delay: 0.18s;
          }
          &:nth-child(3) {
            animation-delay: 0.36s;
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 0;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-4px);
            color: $accent-2;
          }
        }
      }
    }
  }

  /* 输入区：舞台月匣感（玻璃 + 紫光按钮）*/
  .input-area {
    position: sticky;
    bottom: 12px;
    display: flex;
    align-items: center;
    background: linear-gradient(
      180deg,
      rgba(6, 8, 12, 0.92),
      rgba(8, 6, 10, 0.94)
    );
    backdrop-filter: blur(8px) saturate(1.02);
    padding: 12px;
    gap: 12px;
    z-index: 30;
    border-radius: 14px;
    box-shadow: 0 18px 44px rgba(2, 6, 14, 0.72);
    border: 1px solid $accent-2-04;

    textarea {
      flex: 1;
      padding: 12px 16px;
      background: linear-gradient(
        180deg,
        rgba(6, 6, 8, 0.92),
        rgba(6, 6, 8, 0.9)
      );
      border: 1px solid $accent-2-04;
      color: $text-light;
      font-size: 15px;
      line-height: 1.45;
      outline: none;
      resize: none;
      overflow: hidden;
      min-height: 48px;
      max-height: 160px;
      border-radius: 10px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
      transition: box-shadow 0.12s, border-color 0.12s, transform 0.12s;

      &::placeholder {
        color: $text-light-22;
      }

      &:focus {
        border-color: $accent-2-26;
        box-shadow: 0 0 0 6px rgba($accent-2, 0.04);
        transform: translateY(-1px);
      }
    }

    .btn-group {
      display: flex;
      gap: 8px;

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0;
        border: none;
        border-radius: 10px;
        background: linear-gradient(
          180deg,
          rgba(8, 8, 10, 0.6),
          rgba(6, 6, 8, 0.6)
        );
        color: $text-light;
        cursor: pointer;
        transition: transform 0.12s, box-shadow 0.12s, background 0.12s;
        box-shadow: 0 6px 18px rgba(2, 6, 12, 0.6);
        border: 1px solid rgba($accent-2, 0.03);

        &:hover {
          transform: translateY(-2px);
          background: rgba($accent-2, 0.04);
          box-shadow: 0 12px 28px rgba($accent-2, 0.06);
        }

        &:active {
          transform: translateY(0);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .clear-btn {
        font-size: 16px;
        line-height: 1;
      }
    }

    .send-btn {
      padding: 0 22px;
      height: 40px;
      border: none;
      border-radius: 20px;
      background: linear-gradient(135deg, $accent-2 0%, $accent-1 100%);
      color: #0b0306;
      font-weight: 800;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 12px 36px $accent-1-12;
      transition: transform 0.12s, box-shadow 0.18s, filter 0.12s;

      &:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 18px 46px rgba($accent-1, 0.16);
        filter: saturate(1.06);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 8px rgba($accent-2, 0.06);
      }
    }

    .Alldetail-btn {
      display: none;
      margin-left: 4px;
      background: transparent;
      border: 1px solid $accent-2-06;
      border-radius: 6px;
      padding: 6px 10px;
      color: $text-light;
      font-size: 13px;
      cursor: pointer;

      &:hover {
        background: rgba($accent-2, 0.03);
        box-shadow: 0 6px 14px rgba($accent-2, 0.04);
      }
    }
    .copy-btn {
      margin-left: 8px;
      padding: 0 14px;
      height: 36px;
      border-radius: 14px;
      border: none;
      cursor: pointer;
      font-weight: 700;
      font-size: 13px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.04),
        rgba(255, 255, 255, 0.02)
      );
      color: $text-light;
      box-shadow: 0 8px 20px rgba(2, 6, 12, 0.6);
      transition: transform 0.12s, box-shadow 0.12s, opacity 0.12s;
      border: 1px solid $accent-2-04;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba($accent-2, 0.06);
        background: rgba($accent-2, 0.03);
      }

      &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    }
  }

  /* 模态框（舞台玻璃箱） */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(3, 6, 10, 0.78),
      rgba(6, 10, 14, 0.9)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 16px;

    .modal-content {
      width: 380px;
      max-width: 100%;
      background: linear-gradient(
        180deg,
        rgba(6, 8, 10, 0.98),
        rgba(8, 6, 10, 0.98)
      );
      backdrop-filter: blur(8px) saturate(1.02);
      border-radius: 14px;
      padding: 20px;
      color: $text-light;
      box-shadow: 0 20px 60px rgba(2, 6, 10, 0.9);
      border: 1px solid $accent-2-04;
      animation: fadeInUp 220ms ease;
      position: relative;

      &::before {
        content: "🎭";
        position: absolute;
        left: 14px;
        top: 10px;
        font-size: 14px;
        color: rgba($accent-2, 0.08);
        pointer-events: none;
      }

      h3 {
        margin: 0 0 12px 0;
        font-size: 18px;
        font-weight: 800;
        text-align: center;
        color: $accent-2;
        padding-bottom: 8px;
        border-bottom: 1px dashed rgba($accent-2, 0.04);
      }

      .detail-list {
        list-style: none;
        padding: 0;
        margin: 12px 0 18px;
        line-height: 1.6;
        font-size: 14px;
        color: rgba($text-light, 0.96);

        li {
          margin-bottom: 8px;
          padding-left: 6px;

          &:nth-child(odd) {
            color: rgba($text-light, 0.94);
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .close-btn {
        display: block;
        margin: 0 auto;
        padding: 8px 20px;
        background: linear-gradient(135deg, $accent-2, $accent-1);
        color: #0b0306;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 700;
        box-shadow: 0 12px 36px rgba($accent-1, 0.12);
        transition: transform 0.12s ease, box-shadow 0.14s ease;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 46px rgba($accent-1, 0.16);
        }
        &:active {
          transform: translateY(-1px) scale(0.996);
        }
        &:focus-visible {
          outline: none;
          box-shadow: 0 0 0 8px rgba($accent-2, 0.06);
        }
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.995);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 480px) {
      .modal-content {
        width: 100%;
        padding: 16px;
        border-radius: 12px;
        h3 {
          font-size: 16px;
        }
        .close-btn {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
        }
      }
    }
  }

  /* 响应式（保留逻辑，微调间距） */
  @media (max-width: 768px) {
    .chat-container {
      width: 100%;
      padding: 12px;
      padding-top: 20px;
      .carousel1 {
        display: none;
      }
      .carousel2 {
        display: block;
      }
      .stats-panel {
        display: none;
      }
    }

    .bubble {
      padding: 10px 12px;
      font-size: 14px;
      max-width: 86%;
    }

    .avatar {
      width: 36px;
      height: 36px;
    }

    .input-area {
      flex-direction: column;
      align-items: stretch;

      textarea {
        width: 100%;
      }
      button {
        width: 100%;
      }
      .Alldetail-btn {
        display: block;
      }
    }
  }
}

/* ====== 轻量动效关键帧（保留） ====== */
@keyframes tide-flow {
  0% {
    transform: translateY(0) translateX(0) rotate(-2deg);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-6px) translateX(-4px) rotate(2deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0) translateX(0) rotate(-2deg);
    opacity: 0.9;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0.98);
    opacity: 0.18;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.36;
  }
  100% {
    transform: scale(0.98);
    opacity: 0.18;
  }
}
</style>
