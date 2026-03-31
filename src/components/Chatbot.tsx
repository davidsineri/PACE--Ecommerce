import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAgent } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

const QUICK_REPLIES = [
  'Rekomendasikan destinasi wisata Papua',
  'Produk oleh-oleh terbaik dari Papua',
  'Berapa ongkos kirim ke Jakarta?',
  'Ceritakan tentang Raja Ampat',
];

const GREETING = 'Halo Kaka! Saya PACE AI 🌿 Ada yang bisa saya bantu tentang wisata atau produk lokal Papua hari ini?';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: GREETING }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Fokus input saat chat dibuka
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const reply = await chatWithAgent(text, history, products);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error: any) {
      const isApiKeyError = error.message?.includes('API_KEY') || error.message?.includes('401');
      setMessages(prev => [...prev, {
        role: 'model',
        text: isApiKeyError
          ? 'Maaf, AI belum dikonfigurasi. Pastikan `GEMINI_API_KEY` sudah diisi di file `.env`.'
          : 'Maaf, terjadi kesalahan saat menghubungi server. Silakan coba lagi nanti.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{ role: 'model', text: GREETING }]);
  };

  const showQuickReplies = messages.length === 1 && !isLoading;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-colors z-50"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[540px] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">PACE AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                    <p className="text-[10px] text-emerald-100">Online — Travel & Shopping Agent</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Hapus percakapan"
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 dark:bg-stone-950">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-tr-sm'
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      <p>{msg.text}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-2.5 flex-row">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Quick replies */}
              {showQuickReplies && (
                <div className="space-y-2 pt-1">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left text-xs px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya tentang wisata atau produk..."
                  className="flex-1 bg-stone-100 dark:bg-stone-800 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center disabled:opacity-40 transition-all active:scale-95"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
