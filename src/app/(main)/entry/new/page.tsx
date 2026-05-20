"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Smile, Calendar, DollarSign, Type, FileText, Lock, Unlock, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import Link from "next/link";

const MOODS = [
  { label: "Great", emoji: "😀" },
  { label: "Good", emoji: "🙂" },
  { label: "Neutral", emoji: "😐" },
  { label: "Sad", emoji: "😔" },
  { label: "Frustrated", emoji: "😡" },
];

export default function NewEntryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "Neutral",
    entryDate: new Date().toISOString().split('T')[0],
    expense: "",
    highlight: "",
    gratitude: "",
    isPrivate: false,
  });

  useEffect(() => {
    async function fetchPrompts() {
      setLoadingPrompts(true);
      try {
        const res = await fetch("/api/ai/prompts");
        const data = await res.json();
        if (data.prompts) setPrompts(data.prompts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPrompts(false);
      }
    }
    fetchPrompts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expense: formData.expense ? parseFloat(formData.expense) : null,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save entry");
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-6 px-4 pt-6 overflow-y-auto w-full lg:px-8 lg:pt-10 lg:max-w-4xl lg:mx-auto">
      <FadeIn className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              formData.isPrivate 
                ? "bg-amber-50 border-amber-200 text-amber-600" 
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {formData.isPrivate ? <Lock size={16} /> : <Unlock size={16} />}
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
              {formData.isPrivate ? "Private" : "Public"}
            </span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-2.5 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-all shadow-md shadow-brand/20 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Entry
          </button>
        </div>
      </FadeIn>

      <div className="space-y-6">
        {/* Mood Selection */}
        <FadeIn delay={0.1} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="text-sm font-bold text-gray-900 mb-4 flex items-center">
            <Smile className="w-4 h-4 mr-2 text-brand" />
            HOW ARE YOU FEELING?
          </label>
          <div className="flex flex-wrap gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setFormData({ ...formData, mood: mood.label })}
                className={`flex-1 min-w-[100px] p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.mood === mood.label
                    ? "border-brand bg-brand-light/20"
                    : "border-gray-50 bg-gray-50 hover:border-gray-200"
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className={`text-xs font-bold ${formData.mood === mood.label ? "text-brand" : "text-gray-500"}`}>
                  {mood.label.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Content Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FadeIn delay={0.2} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center uppercase tracking-wider">
                    <Type className="w-3.5 h-3.5 mr-1.5" />
                    Entry Title
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. A Productive Day at Work"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand/20 transition-all text-gray-900 font-bold placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Journal Entry
                  </label>

                  {/* AI Prompts */}
                  {prompts.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {prompts.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => setFormData(prev => ({ ...prev, content: prev.content + (prev.content ? "\n\n" : "") + p }))}
                          className="text-[10px] bg-brand/5 text-brand border border-brand/10 px-2 py-1 rounded-full hover:bg-brand/10 transition-colors flex items-center gap-1"
                        >
                          <Sparkles size={10} />
                          {p}
                        </button>
                      ))}
                    </div>
                  )}

                  <textarea
                    rows={12}
                    placeholder="What's on your mind today?"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand/20 transition-all text-gray-900 leading-relaxed placeholder:text-gray-300 resize-none"
                  ></textarea>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="space-y-6">
            <FadeIn delay={0.3} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Entry Date
                  </label>
                  <input
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand/20 transition-all text-gray-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center uppercase tracking-wider">
                    <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                    Daily Expense
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.expense}
                      onChange={(e) => setFormData({ ...formData, expense: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand/20 transition-all text-gray-900 font-bold placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center uppercase tracking-wider">
                    Gratitude
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Today I am grateful for..."
                    value={formData.gratitude}
                    onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand/20 transition-all text-gray-900 text-sm placeholder:text-gray-300 resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center uppercase tracking-wider">
                    Highlight of the Day
                  </label>
                  <input
                    type="text"
                    placeholder="The best moment was..."
                    value={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand/20 transition-all text-gray-900 text-sm placeholder:text-gray-300"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
