'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, X, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  mrp?: number;
  images?: string[];
  category?: string;
  storeName?: string;
  storeUsername?: string;
  rating?: string | null;
  reviewCount?: number;
  matchScore?: number;
  matchDetails?: string[];
}

type Message = { role: 'user' | 'assistant' | 'error'; content: string; products?: Product[] };

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setMessages([{ role: 'assistant', content: "👋 Hello! I'm Drip Finder, your personal shopping assistant. How can I help you find the perfect product today?" }]);
    }, 600);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    const userInput = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userInput }) });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'No response', products: data.products || [] }]);
      } else {
        setMessages(prev => [...prev, { role: 'error', content: data.error || 'Error' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'error', content: "Couldn't reach the chat service. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: "🛍️ Show bags", query: "show me bags" },
    { label: "⭐ 4+ star rated", query: "products rated above 4 stars" },
    { label: "💰 Under $50", query: "products under $50" },
    { label: "🔥 Best deals", query: "find me the best deals" },
    { label: "🎨 Black items", query: "show black products" },
    { label: "👑 Top rated", query: "show top rated products" },
  ];

  return (
    <div>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-3 rounded-full shadow-2xl transition-all hover:scale-110 font-semibold text-sm"
      >
        what&apos;s my drip?😎
      </button>

      {/* Chat Modal */}
      {open && (
        <div className="fixed right-6 bottom-24 z-50 w-[380px] h-[550px] bg-white text-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <div className="font-bold">Drip Finder</div>
                <div className="text-xs text-white/80">Always here to help</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] ${m.role === 'user' ? '' : ''}`}>
                  <div className={`p-3 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md' 
                      : m.role === 'error' 
                        ? 'bg-rose-100 text-rose-600 rounded-bl-md' 
                        : 'bg-white border border-slate-200 shadow-sm rounded-bl-md'
                  }`}>
                    <div className="text-sm whitespace-pre-line">{m.content}</div>
                  </div>

                  {/* Product Cards */}
                  {m.products && m.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {/* Show all matching products (up to 8) */}
                      {m.products.slice(0, 8).map((p: Product) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          prefetch={true}
                          className="block"
                          onClick={() => setOpen(false)}
                        >
                          <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex gap-3">
                              {/* Product Image */}
                              {p.images && p.images[0] && (
                                <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                  <Image
                                    src={p.images[0]}
                                    alt={p.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                  {p.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {p.category && (
                                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                      {p.category}
                                    </span>
                                  )}
                                  {p.storeName && (
                                    <span className="text-[10px] text-slate-500">
                                      by {p.storeName}
                                    </span>
                                  )}
                                </div>
                                {/* Price Display */}
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="font-bold text-indigo-600">${p.price}</span>
                                  {p.mrp && p.mrp > p.price && (
                                    <>
                                      <span className="text-xs text-slate-400 line-through">${p.mrp}</span>
                                      <span className="text-[10px] text-green-600 font-medium">
                                        {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% off
                                      </span>
                                    </>
                                  )}
                                </div>
                                {/* Rating Display */}
                                {p.rating && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-medium text-slate-700">{p.rating}</span>
                                    {p.reviewCount !== undefined && p.reviewCount > 0 && (
                                      <span className="text-xs text-slate-400">({p.reviewCount} reviews)</span>
                                    )}
                                  </div>
                                )}
                                {/* Match Quality Indicator */}
                                {p.matchDetails && p.matchDetails.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {p.matchDetails.slice(0, 3).map((detail, idx) => (
                                      <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full">
                                        ✓ {detail}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* View Icon */}
                              <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                            </div>
                          </div>
                        </Link>
                      ))}
                      {/* Show count if there are more products */}
                      {m.products.length > 8 && (
                        <div className="text-center text-xs text-slate-500 py-2">
                          +{m.products.length - 8} more products found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md p-3 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Finding products...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(action.query); }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 text-slate-600 text-xs rounded-full whitespace-nowrap transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Search products or ask a question..."
                className="flex-1 px-4 py-2.5 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-full flex items-center justify-center transition-all"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
