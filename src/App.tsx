import React, { useState, useRef, useEffect } from "react";
import { Send, User, ChevronRight, ChevronLeft, Activity, Zap, Shield, Target, X, Trophy, Info, Image as ImageIcon, MessageSquare, MessageSquareOff, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PongGame from "./components/PongGame";

const PLAYERS: Record<string, { name: string; title: string; image: string; color: string; description: string; achievements: string[]; gallery: string[]; videoId: string; }> = {
  ma_long: {
    name: "马龙",
    title: "六边形战士 (Hexagon Warrior)",
    image: "https://bkimg.cdn.bcebos.com/pic/0e2442a7d933c895d143cd6ba04a64f082025aafaad0?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
    color: "from-red-600/20 to-orange-600/20",
    description: "马龙是世界乒乓球历史上最伟大的运动员之一，首位集奥运会、世锦赛、世界杯、亚运会、亚锦赛、亚洲杯、巡回赛总决赛、全运会单打冠军于一身的超级全满贯男子选手。他的技术全面，正手杀伤力极大，战术素养极高。",
    achievements: [
      "2届奥运会男单冠军 (2016, 2020)",
      "3届世乒赛男单冠军 (2015, 2017, 2019)",
      "首位男子双圈大满贯得主"
    ],
    gallery: [
      "https://bkimg.cdn.bcebos.com/pic/b03533fa828ba61ea8d336d28c6c800a304e241ff38f?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/8cb1cb1349540923dd54fc104c00c609b3de9c82e31e?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/e61190ef76c6a7efce1b084b23a2b851f3deb48fc81f?x-bce-process=image/resize,m_lfit,w_1000,limit_1"
    ],
    videoId: "BV1G4411t7R2"
  },
  fan_zhendong: {
    name: "樊振东",
    title: "暴力熊猫 (Little Fatty)",
    image: "https://bkimg.cdn.bcebos.com/pic/cf1b9d16fdfaaf51f3de68f5170d83eef01f3a29cc7d?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
    color: "from-blue-600/20 to-indigo-600/20",
    description: "樊振东以其极具破坏力的反手拧拉和惊人的中远台相持能力闻名世界。他的球风硬朗，击球质量极高，被誉为国乒新生代的绝对主力。",
    achievements: [
      "世乒赛男单冠军 (2021, 2023)",
      "4次世界杯男单冠军",
      "单打奥运会冠军 (2024)"
    ],
    gallery: [
      "https://bkimg.cdn.bcebos.com/pic/80cb39dbb6fd52668ac488fbaa18972bd5073675?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/faedab64034f78f0f736d9831e691d55b319ebc4b631?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/e850352ac65c103853431ab3d5498413b07eca802333?x-bce-process=image/resize,m_lfit,w_1000,limit_1"
    ],
    videoId: "BV1LQQHBUEYM"
  },
  zhang_jike: {
    name: "张继科",
    title: "藏獒 (Imperial Tiger)",
    image: "https://bkimg.cdn.bcebos.com/pic/0b7b02087bf40ad18b8cc3635d2c11dfa8eccec2?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
    color: "from-zinc-100/20 to-zinc-400/20",
    description: "张继科创造了445天最快大满贯的历史纪录。他的反手接发球霸王拧极具侵略性，心理素质极强，比赛中经常展现出“藏獒”般的血性。",
    achievements: [
      "445天最快大满贯纪录保持者",
      "奥运会男单冠军 (2012)",
      "2届世乒赛男单冠军 (2011, 2013)"
    ],
    gallery: [
      "https://bkimg.cdn.bcebos.com/pic/b21bb051f8198618f453982b42ed2e738bd4e60d?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/d62a6059252dd42a283471faf7634cb5c9ea15ce1213?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/faf2b2119313b07eca803d1bf98f862397dda14426d5?x-bce-process=image/resize,m_lfit,w_1000,limit_1"
    ],
    videoId: "BV1yA411A7X3"
  },
  xu_xin: {
    name: "许昕",
    title: "人民艺术家 (X-Man)",
    image: "https://bkimg.cdn.bcebos.com/pic/e7cd7b899e510fb30f24f5c1cf6adf95d143ad4ba616?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
    color: "from-green-600/20 to-emerald-600/20",
    description: "许昕是当今乒坛极少数打到顶尖水平的直板选手之一。他拥有世界级正手爆冲能力、极大的跑动范围和出神入化的台内手感，常常打出令人惊叹的神仙球。",
    achievements: [
      "2届奥运会男团冠军 (2016, 2020)",
      "20次国际乒联巡回赛单打冠军",
      "多届世乒赛双打/混双冠军"
    ],
    gallery: [
      "https://bkimg.cdn.bcebos.com/pic/caef76094b36acaf2edde4ab6a809a1001e939013669?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/908fa0ec08fa513d543eebf2306d55fbb2fbd902?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/024f78f0f736afc379319b19fd42fcc4b74543a9b40e?x-bce-process=image/resize,m_lfit,w_1000,limit_1"
    ],
    videoId: "BV1Gg4y187QU"
  },
  wang_chuqin: {
    name: "王楚钦",
    title: "大头 (Big Head)",
    image: "https://bkimg.cdn.bcebos.com/pic/0d338744ebf81a4c510fef562a737759252dd52a08a0?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
    color: "from-purple-600/20 to-pink-600/20",
    description: "王楚钦是目前世界排名第一的男单选手。作为左手将，他的打法非常现代，速度极快，衔接流畅，正反手实力均衡且极具杀伤力。",
    achievements: [
      "亚运会男单冠军 (2022)",
      "多届世乒赛男团冠军",
      "世乒赛男双、混双冠军"
    ],
    gallery: [
      "https://bkimg.cdn.bcebos.com/pic/4610b912c8fcc3cec3fd83f4a01ec188d43f86948afb?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/00e93901213fb80e7bec671b048a382eb9389a503efe?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/48540923dd54564e9258860f80858b82d158ccbfe1c8?x-bce-process=image/resize,m_lfit,w_1000,limit_1"
    ],
    videoId: "BV1qw4m1Y7iR"
  },
  sun_yingsha: {
    name: "孙颖莎",
    title: "小魔王 (Little Demon King)",
    image: "https://bkimg.cdn.bcebos.com/pic/562c11dfa9ec8a136327f3867754868fa0ec08fa6a07?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
    color: "from-yellow-500/20 to-orange-500/20",
    description: "孙颖莎是目前世界排名第一的女单选手。她的技术特点鲜明，正手攻击性极强，具备“女子技术男性化”的特点，且在关键时刻拥有一颗大心脏。",
    achievements: [
      "世乒赛女单冠军 (2023)",
      "奥运会女团冠军 (2020)",
      "亚运会女单冠军 (2022)"
    ],
    gallery: [
      "https://bkimg.cdn.bcebos.com/pic/dcc451da81cb39dbdcf137c5db160924ab18306b?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/9d82d158ccbf6c81473fc17ab73eb13533fa401c?x-bce-process=image/resize,m_lfit,w_1000,limit_1",
      "https://bkimg.cdn.bcebos.com/pic/8326cffc1e178a828726f320fd03738da977e81c?x-bce-process=image/resize,m_lfit,w_1000,limit_1"
    ],
    videoId: "BV1YUSDBxETS"
  },
};

interface AnswerDetails {
  playerId: string;
  personalityGreeting: string;
  tacticalAdvice: string;
  actionDemonstration: string;
  focusPoints: string[];
}

interface Message {
  id: string;
  role: "user" | "system";
  content: string;
  details?: AnswerDetails;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isInputHidden, setIsInputHidden] = useState(false);
  const [isAvatarsExpanded, setIsAvatarsExpanded] = useState(false);
  const [playingGameId, setPlayingGameId] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg.content }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`请求失败 (${response.status}): ${errorText ? errorText.slice(0, 50) : "empty response"}`);
        }
        throw new Error(errorData.error?.message || "网络请求失败");
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`JSON解析失败: ${responseText ? responseText.slice(0, 50) : "empty response"}`);
      }
      
      let jsonStr = responseData.choices[0]?.message?.content?.trim() || "{}";
      jsonStr = jsonStr.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
      
      if (!jsonStr) {
        throw new Error("AI 返回了空内容");
      }
      
      let data: AnswerDetails;
      try {
        data = JSON.parse(jsonStr);
      } catch (e) {
        throw new Error(`AI 返回了格式不正确的数据: ${jsonStr.slice(0, 50)}...`);
      }

      const sysMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content: "",
        details: data,
      };
      setMessages((prev) => [...prev, sysMsg]);
    } catch (error: any) {
      console.error(error);
      let errorMsgContent = "系统遇到问题，请稍后重试或检查 API Key设置。";
      if (error?.error?.code === "json_validate_failed") {
        errorMsgContent = "AI返回的数据格式有误，请重新尝试提问。";
      } else if (error?.message) {
        errorMsgContent = `系统遇到问题: ${error.message}`;
      }

      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content: errorMsgContent,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] font-sans text-slate-50 selection:bg-blue-900 overflow-hidden relative">
      <div className="stadium-glow"></div>

      {/* Header */}
      <header className="flex-none p-6 border-b border-white/10 glass-card shrink-0 z-10 m-4 mb-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-10 w-64 h-64 bg-emerald-600 rounded-full blur-[100px]" />
          <div className="absolute -bottom-10 left-10 w-48 h-48 bg-blue-600 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-4xl mx-auto flex items-center justify-between relative gap-2">
          <div className="shrink-1 min-w-0">
            <h1 className="text-base sm:text-2xl font-bold tracking-wider mb-0.5 sm:mb-1 flex items-center gap-2 sm:gap-3 text-blue-400">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 shrink-0" />
              <span className="truncate">PONG MASTER AI</span>
            </h1>
            <p className="text-slate-400 text-[10px] sm:text-sm italic truncate">向顶级冠军请教技术、战术与心态</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 justify-end shrink-0">
            <button
              onClick={() => setIsInputHidden(!isInputHidden)}
              className="p-1.5 sm:p-2 rounded-full glass-card hover:bg-slate-800 transition-colors text-slate-300 shrink-0"
              title={isInputHidden ? "显示输入框" : "隐藏输入框"}
            >
              {isInputHidden ? <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" /> : <MessageSquareOff className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <div 
              className={`flex items-center transition-all duration-300 ${isAvatarsExpanded ? 'gap-1.5' : 'gap-0'} sm:gap-2`}
              onClick={() => {
                if (window.innerWidth < 640) setIsAvatarsExpanded(!isAvatarsExpanded);
              }}
            >
              {Object.entries(PLAYERS).map(([id, p]) => {
                const isSelected = selectedPlayerId === id;
                const isVisibleOnMobile = isAvatarsExpanded || isSelected || (!selectedPlayerId && id === Object.keys(PLAYERS)[0]);

                return (
                  <div
                    key={id}
                    onClick={(e) => {
                      if (window.innerWidth >= 640 || isAvatarsExpanded) {
                        e.stopPropagation();
                        setSelectedPlayerId(id);
                        if (window.innerWidth < 640) setIsAvatarsExpanded(false);
                      }
                    }}
                    className={`
                      w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full overflow-hidden border transition-all cursor-pointer relative hover:z-10 hover:-translate-y-1
                      ${isSelected ? 'border-blue-500 opacity-100 grayscale-0 ring-1 ring-blue-500' : 'border-neutral-700 opacity-60 grayscale'}
                      ${isVisibleOnMobile ? 'block' : 'hidden'} sm:block
                      sm:hover:grayscale-0 sm:hover:opacity-100
                    `}
                    title={p.name}
                  >
                    <img src={p.image} referrerPolicy="no-referrer" alt={p.name} className="w-full h-full object-cover object-top" />
                  </div>
                );
              })}
              <div className="sm:hidden text-slate-400 ml-1 flex-shrink-0 cursor-pointer">
                {isAvatarsExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className={`flex-1 overflow-y-auto p-4 sm:p-6 ${!isInputHidden ? 'pb-48' : 'pb-8'} space-y-8 scroll-smooth z-10`}>
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center pt-20">
              <div className="w-20 h-20 glass-card flex items-center justify-center mb-6 shadow-2xl relative">
                <Target className="w-10 h-10 text-blue-400 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-blue-400 mb-3">PONG MASTER AI</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm italic">
                描述你遇到的问题，系统会自动匹配最擅长该技术的国乒冠军为你解答。
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => setInput("我的反手拧拉总是吃旋转，起不来下旋球怎么办？")} className="px-4 py-2 glass-card hover:bg-slate-800/80 rounded-full text-sm transition-colors text-slate-300 hover:text-white">
                  教学：反手拧拉起下旋
                </button>
                <button onClick={() => setInput("正手拉加转弧圈球总是发不上力，身体不够协调。")} className="px-4 py-2 glass-card hover:bg-slate-800/80 rounded-full text-sm transition-colors text-slate-300 hover:text-white">
                  教学：正手加转弧圈力
                </button>
                <button onClick={() => setInput("比赛到了决胜局关键分，总是不敢出手，怎么练心态？")} className="px-4 py-2 glass-card hover:bg-slate-800/80 rounded-full text-sm transition-colors text-slate-300 hover:text-white">
                  心理：关键分怎么打
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "user" ? (
                      <div className="glass-card text-white px-6 py-4 rounded-3xl rounded-tr-sm max-w-[85%] sm:max-w-[70%] shadow-lg border border-slate-700">
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="w-full max-w-3xl flex gap-4 sm:gap-6">
                        {!msg.details ? (
                          <div className="bg-blue-900/20 text-blue-400 px-6 py-4 rounded-3xl rounded-tl-sm border border-blue-900/50 flex-1">
                            {msg.content}
                          </div>
                        ) : (
                          <div className="flex-1 w-full space-y-6">
                            {/* Player Card header */}
                            <div className="flex items-center gap-4 glass-card p-6">
                              <div className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                <img
                                  src={PLAYERS[msg.details.playerId]?.image || "https://cravatar.cn/avatar/default?d=identicon&s=200"}
                                  alt={msg.details.playerId}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover object-top"
                                  onError={(e) => {
                                      // Fallback logic for broken wiki images
                                      (e.target as HTMLImageElement).src = `https://cravatar.cn/avatar/${encodeURIComponent(PLAYERS[msg.details.playerId]?.name || 'Player')}?d=identicon&s=200`;
                                  }}
                                />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2 uppercase italic text-slate-100">
                                  {PLAYERS[msg.details.playerId]?.name || "神秘名将"}
                                  <span className="badge-gold">
                                    {PLAYERS[msg.details.playerId]?.title || "指导教练"}
                                  </span>
                                </h3>
                                <p className="text-slate-400 italic mt-2 font-serif text-sm">
                                  "{msg.details.personalityGreeting}"
                                </p>
                              </div>
                            </div>

                            {/* Content Blocks */}
                            <div className="space-y-6">
                              <div className="glass-card p-6 border-l-4 border-l-amber-500 border-white/10 shadow-sm">
                                <h4 className="flex items-center gap-2 font-bold mb-4 text-amber-500 tracking-widest text-xs uppercase">
                                  <Activity className="w-4 h-4" />
                                  教练指导意见 Coach Insight
                                </h4>
                                <p className="leading-relaxed text-slate-200">
                                  {msg.details.tacticalAdvice}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="glass-card p-6 relative overflow-hidden group">
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none" />
                                  <h4 className="flex items-center gap-2 font-bold mb-4 text-slate-500 text-xs uppercase">
                                    <Zap className="w-4 h-4" />
                                    动作轨迹演示 Motion Analysis
                                  </h4>
                                  <p className="text-sm leading-relaxed text-slate-300 relative z-10">
                                    {msg.details.actionDemonstration}
                                  </p>
                                </div>

                                <div className="glass-card p-6 bg-slate-900">
                                  <h4 className="flex items-center gap-2 font-bold mb-4 text-blue-400 text-xs uppercase">
                                    <Shield className="w-4 h-4" />
                                    核心要点 Checklist
                                  </h4>
                                  <ul className="space-y-3">
                                    {msg.details.focusPoints.map((point, idx) => (
                                      <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                                        <span className="shrink-0 flex items-center justify-center text-blue-400 text-xs mt-0.5">
                                          •
                                        </span>
                                        <span className="leading-relaxed">{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="w-full max-w-3xl flex gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl glass-card animate-pulse flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-500/50 animate-[spin_3s_linear_infinite]" />
                    </div>
                    <div className="flex-1 space-y-4 pt-2">
                      <div className="h-5 glass-card rounded-md w-32 animate-pulse" />
                      <div className="h-3 glass-card rounded-md max-w-[80%] animate-pulse" />
                      <div className="space-y-2 mt-6">
                         <div className="h-20 glass-card rounded-xl w-full animate-pulse" />
                         <div className="h-20 glass-card rounded-xl w-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Player Profile Modal */}
      <AnimatePresence>
        {selectedPlayerId && PLAYERS[selectedPlayerId] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm"
            onClick={() => setSelectedPlayerId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card bg-[#0f172a] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="relative h-48 bg-slate-900 border-b border-white/10 shrink-0">
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-screen" />
                <button
                  onClick={() => setSelectedPlayerId(null)}
                  className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-slate-900/50 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute -bottom-12 left-6 flex items-end gap-4 scale-90 sm:scale-100 origin-bottom-left">
                  <div 
                    className="w-24 h-24 rounded-2xl overflow-hidden border border-white/20 bg-slate-800 shadow-xl cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                    onClick={() => setExpandedImage(PLAYERS[selectedPlayerId].image)}
                  >
                    <img
                      src={PLAYERS[selectedPlayerId].image}
                      alt={PLAYERS[selectedPlayerId].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="mb-2">
                    <h2 className="text-2xl font-black italic uppercase text-slate-50 tracking-wider">
                      {PLAYERS[selectedPlayerId].name}
                    </h2>
                    <div className="badge-gold inline-block mt-1">
                      {PLAYERS[selectedPlayerId].title}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => setPlayingGameId(selectedPlayerId)}
                        className="px-4 py-1.5 bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 shadow-lg shadow-red-600/20 active:scale-95"
                      >
                        <Activity className="w-4 h-4" />
                        下场切磋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 pt-16 overflow-y-auto space-y-8 flex-1">
                {/* Intro */}
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-blue-400 text-xs uppercase tracking-widest mb-3">
                    <Info className="w-4 h-4" />
                    球员简介
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {PLAYERS[selectedPlayerId].description}
                  </p>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-amber-500 text-xs uppercase tracking-widest mb-3">
                    <Trophy className="w-4 h-4" />
                    历史成绩
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {PLAYERS[selectedPlayerId].achievements.map((ach, idx) => (
                      <li key={idx} className="glass-card bg-slate-900 shadow-none border-white/5 py-3 px-4 rounded-xl flex items-start sm:items-center gap-3 text-sm text-slate-200">
                        <div className="w-2 h-2 shrink-0 rounded-full bg-amber-500 mt-1.5 sm:mt-0" />
                        <span className="leading-tight">{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Video Demonstration */}
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-red-500 text-xs uppercase tracking-widest mb-3">
                    <PlayCircle className="w-4 h-4" />
                    实战演示
                  </h3>
                  <div className="aspect-video rounded-xl overflow-hidden glass-card p-0 shadow-sm">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`//player.bilibili.com/player.html?bvid=${PLAYERS[selectedPlayerId].videoId}&page=1&high_quality=1&danmaku=0`}
                      title={`${PLAYERS[selectedPlayerId].name} Highlights`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* Grid Gallery */}
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-emerald-400 text-xs uppercase tracking-widest mb-3">
                    <ImageIcon className="w-4 h-4" />
                    风采展示
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PLAYERS[selectedPlayerId].gallery.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square rounded-xl overflow-hidden glass-card p-0 shadow-sm group cursor-pointer border border-white/5 hover:border-white/20 transition-colors"
                        onClick={() => setExpandedImage(img)}
                      >
                        <img
                          src={img}
                          alt="Gallery"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <AnimatePresence>
        {!isInputHidden && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="flex-none p-4 w-full max-w-4xl mx-auto absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent pt-10 z-20"
          >
            <form onSubmit={handleSubmit} className="relative group">
              <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="提问：正手拉下旋总是下网怎么办？"
            className="w-full glass-card bg-slate-900/90 rounded-full px-6 py-4 pr-14 focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-2xl backdrop-blur transition-all placeholder:text-slate-600 text-slate-100 border border-slate-700"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
            </form>
            <p className="text-center text-xs text-slate-500 mt-4 mb-2 italic">
              PONG MASTER AI - 由 通义千问 (Qwen-Turbo) 驱动的战术分析系统
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pong Game Modal */}
      {playingGameId && PLAYERS[playingGameId] && (
        <PongGame 
          playerKey={playingGameId} 
          playerName={PLAYERS[playingGameId].name}
          onClose={() => setPlayingGameId(null)} 
        />
      )}

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setExpandedImage(null)}
          >
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute right-6 top-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={expandedImage}
              alt="Expanded view"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
