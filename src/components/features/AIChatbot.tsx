"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Sparkles, Loader,
  Bot, User, Minimize2, Maximize2, RotateCcw,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const QUICK_PROMPTS = [
  "Best destinations for honeymoon?",
  "Budget trip under $1000?",
  "Family-friendly packages?",
  "How to use AI Planner?",
];

const WELCOME = `Hi! I'm **TravelAI Assistant** 👋

I can help you with:
• 🌍 Finding the perfect destination
• 💰 Budget planning & cost estimates
• 📅 Creating custom itineraries
• 🏨 Package recommendations
• ❓ Any travel questions

What can I help you with today?`;

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^• /gm, "• ")
    .replace(/\n/g, "<br/>");
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setUnread(0);
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const now = Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: Message = {
      id: now.toString(),
      role: "user",
      content: msg,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Build chat history for context
    const history = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    try {
      const res = await fetch(`${API_BASE}/api/ai/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, chatHistory: history }),
      });

      let reply = "";
      if (res.ok) {
        const data = await res.json();
        reply = data.result || "I couldn't process that. Please try again.";
      } else {
        reply = "Sorry, I'm having trouble connecting. Please make sure the backend is running.";
      }

      const botMsg: Message = {
        id: (now + 1).toString(),
        role: "assistant",
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Connection error. Please check if the backend server is running.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: WELCOME,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="bg-slate-900 border border-slate-700 text-white text-sm px-4 py-2.5 rounded-2xl shadow-xl max-w-[200px] text-center"
            >
              <span className="text-slate-300">Need travel help? 🌍</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-500 text-white shadow-2xl shadow-brand-600/40 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircle size={22} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread badge */}
          {unread > 0 && !open && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {unread}
            </span>
          )}

          {/* Pulse ring */}
          {!open && (
            <span className="absolute inset-0 rounded-2xl border-2 border-brand-400 animate-ping opacity-30" />
          )}
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed right-6 z-50 w-[380px] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl shadow-slate-950/50 overflow-hidden flex flex-col ${
              minimized ? "bottom-24 h-auto" : "bottom-24 h-[560px]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand-600 to-cyan-600 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">TravelAI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/70 text-xs">Online · Powered by Gemini AI</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setMinimized(!minimized)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  {minimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
                </button>
                <button onClick={resetChat}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <RotateCcw size={15} />
                </button>
                <button onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={15} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === "assistant"
                          ? "bg-gradient-to-br from-brand-600 to-cyan-500"
                          : "bg-slate-700"
                      }`}>
                        {msg.role === "assistant"
                          ? <Bot size={14} className="text-white" />
                          : <User size={14} className="text-slate-300" />}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[78%] space-y-1 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "assistant"
                            ? "bg-slate-800 text-slate-200 rounded-tl-sm"
                            : "bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-tr-sm"
                        }`}
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        />
                        <span className="text-slate-600 text-xs px-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-600 to-cyan-500 flex items-center justify-center shrink-0">
                        <Bot size={14} className="text-white" />
                      </div>
                      <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                        <div className="flex gap-1 items-center h-4">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500"
                              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick prompts */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button key={prompt} onClick={() => sendMessage(prompt)}
                        className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-brand-500 hover:bg-brand-600/10 transition-all">
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-slate-800 shrink-0">
                  <div className="flex gap-2 items-end">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about destinations, packages..."
                      disabled={loading}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors disabled:opacity-50 resize-none"
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-cyan-500 text-white flex items-center justify-center disabled:opacity-40 hover:shadow-lg hover:shadow-brand-600/30 transition-all shrink-0"
                    >
                      {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                  <p className="text-slate-600 text-xs mt-2 text-center">
                    Powered by Google Gemini AI
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
