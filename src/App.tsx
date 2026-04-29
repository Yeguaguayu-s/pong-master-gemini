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

interface AnalysisResult {
  responses: AnswerDetails[];
}

interface Message {
  id: string;
  role: "user" | "system";
  content: string;
  details?: AnswerDetails[];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isInputHidden, setIsInputHidden] = useState(false);
  const [isHeaderAvatarsExpanded, setIsHeaderAvatarsExpanded] = useState(false);
  const [isBottomAvatarsExpanded, setIsBottomAvatarsExpanded] = useState(false);
  const [playingGameId, setPlayingGameId] = useState<string | null>(null);
  const [selectedChatPlayerIds, setSelectedChatPlayerIds] = useState<string[]>([]);
  const [autoMatchMode, setAutoMatchMode] = useState<'single' | 'multi'>('single');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // 将光标移至末尾
        const len = text.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }, 100);
  };

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
        body: JSON.stringify({ 
          message: userMsg.content,
          playerIds: selectedChatPlayerIds,
          autoMatchMode: selectedChatPlayerIds.length === 0 ? autoMatchMode : undefined
        }),
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
      
      let data: AnalysisResult;
      try {
        data = JSON.parse(jsonStr);
        // Fallback for old single response format
        if (!data.responses && (data as any).playerId) {
          data = { responses: [data as any] };
        }
      } catch (e) {
        throw new Error(`AI 返回了格式不正确的数据: ${jsonStr.slice(0, 50)}...`);
      }

      const sysMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content: "",
        details: data.responses,
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
              className={`p-1 px-2 sm:p-2 sm:px-2 rounded-full glass-card transition-all duration-300 shrink-0 flex items-center gap-1.5 border ${!isInputHidden ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-slate-800/40 border-white/5 text-slate-500 hover:text-slate-300'}`}
              title={isInputHidden ? "显示对话框" : "隐藏对话框"}
            >
              <MessageSquare className={`w-4 h-4 sm:w-5 sm:h-5 ${!isInputHidden ? 'text-blue-400' : 'text-slate-500'}`} />
              <span className={`text-[10px] hidden sm:inline uppercase tracking-tighter font-bold ${!isInputHidden ? 'text-blue-400' : 'text-slate-500'}`}>Chat</span>
            </button>
            <div 
              className={`flex items-center transition-all duration-300 ${isHeaderAvatarsExpanded ? 'gap-1' : 'gap-0'} sm:gap-1.5`}
              onClick={() => {
                if (window.innerWidth < 640) setIsHeaderAvatarsExpanded(!isHeaderAvatarsExpanded);
              }}
            >
              {Object.entries(PLAYERS).map(([id, p]) => {
                const isSelected = selectedPlayerId === id;
                const isVisibleOnMobile = isHeaderAvatarsExpanded || isSelected || (!selectedPlayerId && id === Object.keys(PLAYERS)[0]);

                return (
                  <div
                    key={id}
                    onClick={(e) => {
                      if (window.innerWidth >= 640 || isHeaderAvatarsExpanded) {
                        e.stopPropagation();
                        setSelectedPlayerId(id);
                        if (window.innerWidth < 640) setIsHeaderAvatarsExpanded(false);
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
                {isHeaderAvatarsExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className={`flex-1 overflow-y-auto p-4 sm:p-6 ${!isInputHidden ? (isBottomAvatarsExpanded ? 'pb-80' : 'pb-60') : 'pb-8'} space-y-8 scroll-smooth z-10`}>
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
              <div className="flex sm:flex-wrap items-center justify-start sm:justify-center gap-3 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 px-4 sm:px-0 scrollbar-hide no-scrollbar -mx-4 sm:mx-0">
                <button onClick={() => handleSuggestionClick("我的反手拧拉总是吃旋转，起不来下旋球怎么办？")} className="whitespace-nowrap px-4 py-2 glass-card hover:bg-slate-800/80 rounded-full text-xs sm:text-sm transition-colors text-slate-300 hover:text-white shrink-0">
                  反手拧拉技巧
                </button>
                <button onClick={() => handleSuggestionClick("正手拉加转弧圈球总是发不上力，身体不够协调。")} className="whitespace-nowrap px-4 py-2 glass-card hover:bg-slate-800/80 rounded-full text-xs sm:text-sm transition-colors text-slate-300 hover:text-white shrink-0">
                  正手爆冲发力
                </button>
                <button onClick={() => handleSuggestionClick("比赛到了决胜局关键分，总是不敢出手，怎么练心态？")} className="whitespace-nowrap px-4 py-2 glass-card hover:bg-slate-800/80 rounded-full text-xs sm:text-sm transition-colors text-slate-300 hover:text-white shrink-0">
                  决胜局心理素质
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
                      <div className="glass-card text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl rounded-tr-sm max-w-[90%] sm:max-w-[70%] shadow-lg border border-slate-700/50">
                        <p className="leading-relaxed text-sm sm:text-base">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="w-full max-w-3xl flex gap-3 sm:gap-6">
                        {!msg.details ? (
                          <div className="bg-blue-900/20 text-blue-400 px-5 py-3 sm:px-6 sm:py-4 rounded-2xl rounded-tl-sm border border-blue-900/50 flex-1 text-sm sm:text-base">
                            {msg.content}
                          </div>
                        ) : (
                          <div className="flex-1 w-full space-y-8 sm:space-y-10 text-left">
                            {msg.details.map((detail, dIdx) => (
                              <div key={`${detail.playerId}-${dIdx}`} className="space-y-6 relative">
                                {msg.details!.length > 1 && (
                                  <div className="absolute -left-2 sm:-left-10 -top-2 sm:top-10 flex flex-col items-center gap-2 z-10">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 border-[#020617] shadow-lg text-white">
                                      {dIdx + 1}
                                    </div>
                                    <div className="hidden sm:block w-0.5 h-full bg-gradient-to-b from-blue-600/50 to-transparent absolute top-8 -z-10" />
                                  </div>
                                )}
                                
                                {/* Player Card header */}
                                <div className="flex items-center gap-2 sm:gap-4 glass-card p-3 sm:p-6 border-white/5 bg-slate-900/40">
                                  <div className={`w-12 h-12 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg`}>
                                    <img
                                      src={PLAYERS[detail.playerId]?.image || "https://cravatar.cn/avatar/default?d=identicon&s=200"}
                                      alt={detail.playerId}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover object-top"
                                      onError={(e) => {
                                          (e.target as HTMLImageElement).src = `https://cravatar.cn/avatar/${encodeURIComponent(PLAYERS[detail.playerId]?.name || 'Player')}?d=identicon&s=200`;
                                      }}
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                      <h3 className="text-base sm:text-xl font-bold tracking-tight uppercase italic text-slate-100 truncate">
                                        {PLAYERS[detail.playerId]?.name || "神秘名将"}
                                      </h3>
                                      <span className="badge-gold self-start sm:self-auto px-1.5 py-0.5 leading-none">
                                        {PLAYERS[detail.playerId]?.title.split('(')[0].trim() || "导师"}
                                      </span>
                                    </div>
                                    <p className="text-slate-400 italic mt-1 font-serif text-[10px] sm:text-sm line-clamp-1 sm:line-clamp-2">
                                      "{detail.personalityGreeting}"
                                    </p>
                                  </div>
                                </div>

                                {/* Content Blocks */}
                                <div className="space-y-3 sm:space-y-6">
                                  <div className="glass-card p-4 sm:p-6 border-l-2 sm:border-l-4 border-l-amber-500 border-white/10 shadow-sm transition-all hover:bg-white/[0.02]">
                                    <h4 className="flex items-center gap-2 font-bold mb-2 sm:mb-4 text-amber-500 tracking-widest text-[9px] sm:text-xs uppercase">
                                      <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                                      {PLAYERS[detail.playerId]?.name} 的见解
                                    </h4>
                                    <p className="leading-relaxed text-slate-200 text-xs sm:text-base">
                                      {detail.tacticalAdvice}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                                    <div className="glass-card p-4 sm:p-6 relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
                                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none" />
                                      <h4 className="flex items-center gap-2 font-bold mb-2 sm:mb-4 text-slate-500 text-[9px] sm:text-xs uppercase">
                                        <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                                        动作轨迹
                                      </h4>
                                      <p className="text-[11px] sm:text-sm leading-relaxed text-slate-300 relative z-10">
                                        {detail.actionDemonstration}
                                      </p>
                                    </div>
                                    
                                    <div className="glass-card p-4 sm:p-6 bg-slate-900/50 hover:bg-slate-800/80 transition-colors shadow-inner border-white/5">
                                      <h4 className="flex items-center gap-2 font-bold mb-2 sm:mb-4 text-blue-400 text-[9px] sm:text-xs uppercase">
                                        <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                                        核心要点
                                      </h4>
                                      <ul className="space-y-1.5 sm:space-y-3">
                                        {detail.focusPoints.map((point, idx) => (
                                          <li key={idx} className="flex gap-2 sm:gap-3 text-[11px] sm:text-sm text-slate-300 items-start">
                                            <span className="shrink-0 flex items-center justify-center text-blue-500 text-[10px] mt-0.5">•</span>
                                            <span className="leading-snug sm:leading-relaxed">{point}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
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
            className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-[#020617]/95 backdrop-blur-xl"
            onClick={() => setSelectedPlayerId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card bg-[#0b1222] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-4xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[92vh] border-white/5 sm:rounded-3xl rounded-none"
            >
              {/* Modal Header/Hero Area */}
              <div className="relative min-h-[320px] sm:h-72 shrink-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${PLAYERS[selectedPlayerId].color} opacity-60`} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                
                <div className="absolute inset-0 bg-black/40 sm:hidden" />
                
                <button
                  onClick={() => setSelectedPlayerId(null)}
                  className="absolute right-4 top-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/10 backdrop-blur-xl shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 bg-gradient-to-t from-[#0b1222] via-[#0b1222]/90 to-transparent">
                  <div 
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-800 shadow-2xl cursor-pointer hover:border-white/50 transition-all transform hover:scale-105 shrink-0"
                    onClick={() => setExpandedImage(PLAYERS[selectedPlayerId].image)}
                  >
                    <img
                      src={PLAYERS[selectedPlayerId].image}
                      alt={PLAYERS[selectedPlayerId].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="text-center sm:text-left pb-1 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-1 sm:gap-4 mb-1.5 sm:mb-2">
                      <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter text-white drop-shadow-2xl truncate">
                        {PLAYERS[selectedPlayerId].name}
                      </h2>
                      <span className="badge-gold self-center sm:self-auto py-0.5 sm:py-1 px-2 sm:px-3 glass-card bg-amber-500/10 border-amber-500/40 text-amber-500 text-[9px] sm:text-xs">
                        {PLAYERS[selectedPlayerId].title}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] sm:text-sm max-w-lg line-clamp-1 sm:line-clamp-2 italic mb-3 sm:mb-4">
                      {PLAYERS[selectedPlayerId].description.split('。')[0]}。
                    </p>
                    <button
                      onClick={() => setPlayingGameId(selectedPlayerId)}
                      className="px-6 sm:px-8 py-2 sm:py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 active:scale-95 group/btn mx-auto sm:mx-0 w-full sm:w-auto"
                    >
                      <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:animate-pulse" />
                      立即切磋挑战
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Content Scroll Area */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
                  {/* Left Column: Stats & Achievements */}
                  <div className="lg:col-span-2 space-y-8">
                    <section>
                      <h3 className="flex items-center gap-2 font-black text-blue-400 text-[10px] uppercase tracking-[0.2em] mb-4">
                        <Info className="w-4 h-4" />
                        球员自传 Profile
                      </h3>
                      <div className="glass-card bg-white/[0.02] p-5 border-white/5 leading-relaxed text-slate-300 text-sm italic font-serif">
                        {PLAYERS[selectedPlayerId].description}
                      </div>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2 font-black text-amber-500 text-[10px] uppercase tracking-[0.2em] mb-4">
                        <Trophy className="w-4 h-4" />
                        巅峰荣誉 Honors
                      </h3>
                      <div className="space-y-3">
                        {PLAYERS[selectedPlayerId].achievements.map((ach, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-4 glass-card bg-gradient-to-r from-amber-500/5 to-transparent border-white/5 hover:border-amber-500/20 transition-colors group/honor">
                            <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover/honor:scale-110 transition-transform">
                              <Trophy className="w-4 h-4 text-amber-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-200">{ach}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Demo & Photos */}
                  <div className="lg:col-span-3 space-y-8">
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 font-black text-red-500 text-[10px] uppercase tracking-[0.2em]">
                          <PlayCircle className="w-4 h-4" />
                          实战演示 Video Demo
                        </h3>
                        <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          HD 1080P
                        </span>
                      </div>
                      <div className="aspect-video rounded-2xl overflow-hidden glass-card p-0 shadow-2xl border-2 border-white/5 group/video relative">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`//player.bilibili.com/player.html?bvid=${PLAYERS[selectedPlayerId].videoId}&page=1&high_quality=1&danmaku=0&autoplay=0`}
                          title={`${PLAYERS[selectedPlayerId].name} Highlights`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="opacity-90 group-hover/video:opacity-100 transition-opacity"
                        ></iframe>
                      </div>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2 font-black text-emerald-400 text-[10px] uppercase tracking-[0.2em] mb-4">
                        <ImageIcon className="w-4 h-4" />
                        场外风采 Gallery
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {PLAYERS[selectedPlayerId].gallery.map((img, idx) => (
                          <motion.div 
                            key={idx} 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="aspect-square rounded-xl overflow-hidden glass-card p-0 shadow-lg cursor-pointer border-2 border-white/5 hover:border-white/20 transition-all group/photo"
                            onClick={() => setExpandedImage(img)}
                          >
                            <img
                              src={img}
                              alt="Gallery"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top transition-all duration-700 group-hover/photo:scale-110 filter brightness-90 group-hover/photo:brightness-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity" />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer (for mobile especially) */}
              <div className="p-4 border-t border-white/5 bg-black/20 text-center sm:hidden">
                <button
                  onClick={() => setSelectedPlayerId(null)}
                  className="text-xs text-slate-500 font-bold uppercase tracking-widest"
                >
                  点击背景或此处关闭详情
                </button>
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
            {/* Coach Selector */}
            <div className="flex flex-col gap-2 mb-3 px-1 sm:px-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsBottomAvatarsExpanded(!isBottomAvatarsExpanded)}
                    className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-extrabold flex items-center gap-1.5 hover:text-slate-300 transition-colors group/label px-2 py-1 glass-card bg-slate-900/50 border-white/5 active:scale-95"
                  >
                    <Target className={`w-3.5 h-3.5 transition-transform duration-300 ${isBottomAvatarsExpanded ? 'rotate-90 text-blue-500' : ''}`} /> 
                    想请教谁? Select
                    <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isBottomAvatarsExpanded ? 'rotate-90' : ''}`} />
                  </button>
                  {selectedChatPlayerIds.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1 text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-medium"
                    >
                      <span>已选 {selectedChatPlayerIds.length} 位名师</span>
                      <button onClick={() => setSelectedChatPlayerIds([])} className="hover:text-blue-200 ml-1">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </motion.div>
                  )}
                </div>
                {selectedChatPlayerIds.length === 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-600 italic">自动匹配</span>
                    <div className="flex bg-slate-900/80 rounded-full p-0.5 border border-slate-700 shadow-inner">
                      <button 
                        type="button"
                        onClick={() => setAutoMatchMode('single')}
                        className={`px-2 py-0.5 text-[9px] rounded-full transition-all font-bold ${autoMatchMode === 'single' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        单人
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAutoMatchMode('multi')}
                        className={`px-2 py-0.5 text-[9px] rounded-full transition-all font-bold ${autoMatchMode === 'multi' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        多人
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {isBottomAvatarsExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2.5 py-2 overflow-x-auto no-scrollbar -mx-2 px-2">
                      {Object.entries(PLAYERS).map(([id, p]) => {
                        const isSelected = selectedChatPlayerIds.includes(id);
                        const selectIndex = selectedChatPlayerIds.indexOf(id);
                        
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedChatPlayerIds(prev => prev.filter(pid => pid !== id));
                              } else {
                                setSelectedChatPlayerIds(prev => [...prev, id]);
                              }
                            }}
                            className={`
                              w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 transition-all relative group/coach shrink-0
                              ${isSelected 
                                ? 'border-blue-500 ring-4 ring-blue-500/20 scale-105 shadow-xl z-10' 
                                : 'border-slate-800 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-105 hover:border-slate-600'}
                            `}
                          >
                            {isSelected && (
                              <div className="absolute top-0 right-0 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[8px] font-bold z-20 border border-white shadow-md">
                                {selectIndex + 1}
                              </div>
                            )}
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/coach:opacity-100 transition-opacity flex items-end justify-center pb-1">
                              <span className="text-[8px] text-white font-bold">{p.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSubmit} className="relative group">
              <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedChatPlayerIds.length > 0 
              ? `咨询 ${selectedChatPlayerIds.map(id => PLAYERS[id].name).join(' & ')}...` 
              : "提问：正手拉下旋球老是下网怎么办？"}
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
