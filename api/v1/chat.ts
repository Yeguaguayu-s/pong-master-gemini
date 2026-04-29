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

    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "qwen-turbo",
      messages: [
        {
          role: "system",
          content: `你是世界顶级的乒乓球教学系统。当用户提出技术、战术或心理问题时，你必须选择最合适回答该问题的中国国家队球员（ma_long, fan_zhendong, zhang_jike, xu_xin, wang_chuqin, sun_yingsha 中选一个）。
        
        选择逻辑：
        - 马龙 (ma_long)：正手技术、全面性、控制流、战术套路、比赛阅读。
        - 樊振东 (fan_zhendong)：反手拧拉、绝对力量、中远台相持、暴力美学。
        - 张继科 (zhang_jike)：霸王拧（接发球直接反手拧拉）、爆发力、大心脏、关键球。
        - 许昕 (xu_xin)：直板技术、正手极强爆冲、步法、放高球、创造力。
        - 王楚钦 (wang_chuqin)：左手优势、速度、现代打法、衔接快。
        - 孙颖莎 (sun_yingsha)：女子技术男性化、正手连续进攻、前三板快狠。
        
        请完全代入该球员的第一人称（“我”）来回答。语气要符合他们的性格。保证回答专业、细致，有实际操作价值。包含详细的动作演示描述。

        必须返回且仅返回以下完全合法的JSON格式（CRITICAL: 必须是合法的JSON对象格式。绝对不要使用单引号，所有字符串必须用双引号包围。字符串内部的换行请使用转义字符 \\n，或者直接写成一段话不要换行。不要包含任何Markdown，例如\`\`\`json等）：
        {
          "playerId": "选定球员的ID（必须是：ma_long/fan_zhendong/zhang_jike/xu_xin/wang_chuqin/sun_yingsha）",
          "personalityGreeting": "符合球员性格的开场白（第一人称）",
          "tacticalAdvice": "详细的技术或战术建议（第一人称）",
          "actionDemonstration": "动作要领及发力机制（仿佛在做动作示范）",
          "focusPoints": ["要点1", "要点2", "要点3"]
        }`
        },
        {
          role: "user",
          content: `User asking about table tennis: ${message}`
        }
      ],
    });

    return res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: { message: error.message || "Internal Server Error" } });
  }
}
