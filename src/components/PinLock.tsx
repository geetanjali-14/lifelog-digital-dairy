"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Lock, Delete, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface PinLockProps {
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
}

export function PinLock({ onSuccess, onCancel, title = "Enter Vault PIN" }: PinLockProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [hasPin, setHasPin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkPin() {
      const res = await fetch("/api/auth/vault");
      const data = await res.json();
      setHasPin(data.hasPin);
    }
    checkPin();
  }, []);

  const handleVerify = useCallback(async (pinToVerify: string) => {
    try {
      const res = await fetch("/api/auth/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          pin: pinToVerify, 
          action: hasPin ? "verify" : "set" 
        }),
      });
      const data = await res.json();

      if (data.isValid || data.success) {
        onSuccess();
      } else {
        setError(true);
        setPin("");
        // Vibrate if supported
        if ("vibrate" in navigator) navigator.vibrate(200);
      }
    } catch (err) {
      console.error(err);
    }
  }, [hasPin, onSuccess]);

  const handleNumberClick = (num: string) => {
    setPin(prev => {
      if (prev.length < 4) {
        const next = prev + num;
        if (next.length === 4) {
          handleVerify(next);
        }
        return next;
      }
      return prev;
    });
    setError(false);
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  if (hasPin === null) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-6">
          <Lock size={32} />
        </div>

        <h2 className="text-2xl font-extrabold text-foreground mb-2">
          {hasPin ? title : "Set Vault PIN"}
        </h2>
        <p className="text-text-muted text-sm mb-10 text-center">
          {hasPin 
            ? "Enter your 4-digit PIN to access private memories." 
            : "Create a 4-digit PIN to secure your private entries."}
        </p>

        {/* PIN Display */}
        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                error ? "border-red-500 bg-red-500" :
                pin.length > i ? "border-brand bg-brand" : "border-border"
              } ${error ? "animate-shake" : ""}`}
            />
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs font-bold mb-6 flex items-center gap-1"
          >
            <AlertCircle size={14} />
            INCORRECT PIN. TRY AGAIN.
          </motion.div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-xl font-bold text-foreground hover:bg-surface-hover active:scale-90 transition-all"
            >
              {num}
            </button>
          ))}
          <button
            onClick={onCancel}
            className="w-16 h-16 rounded-full flex items-center justify-center text-text-muted hover:text-foreground active:scale-90 transition-all"
          >
            <X size={24} />
          </button>
          <button
            onClick={() => handleNumberClick("0")}
            className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-xl font-bold text-foreground hover:bg-surface-hover active:scale-90 transition-all"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full flex items-center justify-center text-text-muted hover:text-foreground active:scale-90 transition-all"
          >
            <Delete size={24} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
