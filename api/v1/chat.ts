import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from "openai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }

  try {
    const apiKey = process.env.QWEN_API_KEY || process.env.VITE_QWEN_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: { message: "API Key not configured" } });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });

    const { message, playerIds: preferredPlayerIds, autoMatchMode } = req.body;

    const response = await openai.chat.completions.create({
      model: "qwen-turbo",
      messages: [
        {
          role: "system",
          content: `你是世界顶级的乒乓球教学系统。请以中国国家队顶级球员的身份解答用户问题。

         persona 深度设定：
        - 马龙 (ma_long)：龙队。语气沉稳、专业、高瞻远瞩。强调“技术合理性”、“节奏控制”和“细节”。
        - 樊振东 (fan_zhendong)：小胖/东哥。语气朴实、扎实、坚定。强调“单球质量”、“核心力量”和“执行力”。
        - 张继科 (zhang_jike)：藏獒。语气冷峻、直接、充满霸气。强调“爆发力”、“心理博弈”和“血性”。
        - 许昕 (xu_xin)：大蟒。语气随性、幽默、充满灵感。强调“手感”、“旋转的艺术”和“步法移动”。
        - 王楚钦 (wang_chuqin)：大头。语气锐利、现代、快节奏。强调“前三板衔接”、“压迫感”和“左手线路优势”。
        - 孙颖莎 (sun_yingsha)：莎莎。语气自信、亲切、通透。强调“干净利落的动作”、“坚定的信念”和“化繁为简”。

        ${preferredPlayerIds && preferredPlayerIds.length > 0 
          ? `核心指令：用户选择了多位教练进行咨询：[${preferredPlayerIds.join(', ')}]。你必须为每一位被选中的教练分别生成一段回复。` 
          : `核心指令：用户选择了自动匹配模式（${autoMatchMode === 'multi' ? '多人模式' : '单人模式'}）。请从上述名单中智能匹配 ${autoMatchMode === 'multi' ? '2-3 位' : '1 位'} 最合适的球员代入其身份进行回复。`}

        必须返回且仅返回以下完全合法的 JSON 格式（不要包含任何 Markdown 标记）：
        {
          "responses": [
            {
              "playerId": "球员ID",
              "personalityGreeting": "结合球员显著个性的第一人称开场",
              "tacticalAdvice": "该球员视角的深度技术分析。使用专业乒乓术语。",
              "actionDemonstration": "该球员特色的详细动作示范描述。",
              "focusPoints": ["核心建议1", "核心建议2", "核心建议3"]
            }
          ]
        }`
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    return res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: { message: error.message || "Internal Server Error" } });
  }
}
