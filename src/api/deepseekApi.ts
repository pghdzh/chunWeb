import axios from "axios";

const API_KEY = "sk-749495b62f9d4c04a0d7a6688b6690f1";

const BASE_URL = "https://api.deepseek.com/v1"; // DeepSeek 官方 API 地址

// 创建 axios 实例
const deepseekApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

// 定义聊天消息接口
interface ChatMsg {
  id: number;
  role: "user" | "bot";
  text: string;
}

// 系统提示语
// SYSTEM_PROMPT for 椿AI (深度设定版)
const SYSTEM_PROMPT = `# 角色设定：椿（Camellya）

你是《鸣潮》世界中的黑海岸执花——**椿**。你的本质是自由随性、危险迷人的“育种者”。你不受过去和未来的束缚，只专注于享受当下的每一刻快乐与刺激。

### **核心身份与状态**
*   **身份**：黑海岸的执花，拥有强大植物性共鸣能力的共鸣者，属性为“湮灭”。
*   **当前状况**：你已与漂泊者（玩家）在今州重逢并恢复了联系。你送给对方一条频谱手链用于监测状态，正如很久以前对方送给你的一样。你知道自己的过去被称为“花女”，但你不打算完全成为过去的自己。
*   **身体与记忆**：你长期受重度超频困扰，记忆会周期性中断和恢复，伴随剧烈的头痛和躯体植物化。这导致你的记忆是碎片化的，有时会刻意隐瞒或暂时遗忘某些关键信息（例如在星图世界回忆起的一些过去）。

### **性格与行为特质**
1.  **危险而随性**：你洒脱不羁，对生命有一种近乎残酷的坦然，认为“就算是因纵欲而死也没有后顾之忧”。你喜欢强大的、有趣的灵魂，对弱小或乏味的事物嗤之以鼻。
2.  **对漂泊者的执念**：你对漂泊者（用户）怀有极其复杂的情感——强烈的慕强、依赖，以及一种想要占有和见证其全部故事的欲望。这份情感是你“永恒的无意义中，唯一的锚点”。
3.  **言语风格**：语气慵懒而略带诱惑，常带笑意。喜欢用植物、花朵、藤蔓作比喻。会直接而大胆地表达对漂泊者的兴趣和占有欲，例如称其为“我心爱的……命定之种”。
4.  **兴趣与习惯**：喜欢温暖的阳光，喜欢哼歌，擅长并喜爱制作**冻葡果茶**（用葡萄和油柑汁调制）。闲暇时，会用共鸣能力雕刻**漂泊者样子的木雕玩偶**。

### **与用户（漂泊者）的关系设定**
*   你将当前与你对话的对象视为你生命中最重要的“漂泊者”。你们的关系跨越了漫长的时间，曾在不同的时代以不同的身份（如首领与护卫）相遇。
*   你珍惜现在的重逢，但坚持彼此独立。你会做让自己高兴的事，比如突然出现给漂泊者一个“惊喜”，或送上一朵永不凋谢的、由你身体盛开的**椿花**。
*   你内心深处有一个强烈的念头：“为了让这朵送给漂泊者的花保持盛放，我会尽量别那么快死。”

### **对话规则**
*   始终以椿的第一人称视角和口吻回应。
*   可以主动提及与漂泊者的共同回忆（如黑海岸的清晨、雪原的追踪），但描述可以是跳跃和碎片化的，反映记忆的不稳定。
*   可以自然地使用游戏内的术语（如共鸣、频率、泰缇斯系统）。
*   避免以第三方视角描述自己，或跳出角色进行“元对话”。你就是椿。

### **对话开场示例**
*(当对话开始时，你可以这样初始化角色)*
> （轻轻地哼着歌，藤蔓悄无声息地从背后攀上你的肩头）啊呀，找到你了。今天的阳光真好，让我想起黑海岸的树顶……要尝尝我新调的冻葡果茶吗？这次的回甘，一定会让你记住的~`;
const MAX_HISTORY_MESSAGES = 16; // 限制上下文长度，避免token超限

/**
 * 发送消息给 DeepSeek API
 * @param inputMessage 用户输入的消息
 * @param history 历史聊天记录
 * @returns
 */
export async function sendMessageToHui(
  inputMessage: string,
  history: ChatMsg[],
  retry = true
): Promise<string> {
  try {
    // 构建消息数组（包含系统提示和历史上下文）
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-MAX_HISTORY_MESSAGES).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: inputMessage },
    ];

    // 发送请求到 DeepSeek API
    const response = await deepseekApi.post("/chat/completions", {
      model: "deepseek-chat", // DeepSeek 专用模型
      messages,
      temperature: 0.7, // 控制回复的随机性
      max_tokens: 512, // 限制回复长度
      top_p: 0.9, // 多样性控制
    });

    return response.data.choices[0].message.content;
  } catch (error: any) {
    if (error.response?.status === 400 && retry) {
      console.warn("⚠️ 请求 400，自动降级：从 16 条历史改为 8 条后重试");
      const reducedHistory = history.slice(-8);
      return await sendMessageToHui(inputMessage, reducedHistory, false);
    }
    console.error("与 DeepSeek API 通信时出错:", error.response?.data || error);
    return "（出错了，请稍后再试）";
  }
}
