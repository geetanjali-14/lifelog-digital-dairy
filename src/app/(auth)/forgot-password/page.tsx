"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send reset link");
      }

      setIsSubmitted(true);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col h-full bg-[#FAFAFA] lg:bg-white px-6 py-8 overflow-y-auto min-h-screen lg:justify-center lg:items-center">
        <div className="flex-1 mt-8 lg:flex-none lg:mt-0 lg:w-full lg:max-w-[420px]">
          <FadeIn>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
              <p className="text-base text-gray-500 max-w-[280px] mx-auto leading-relaxed mb-8">
                We&apos;ve sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center text-brand font-semibold hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] lg:bg-white px-6 py-8 overflow-y-auto min-h-screen lg:justify-center lg:items-center">
      <div className="flex-1 mt-8 lg:flex-none lg:mt-0 lg:w-full lg:max-w-[420px]">
        <FadeIn>
          {/* Back button */}
          <Link
            href="/signin"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Sign In
          </Link>

          {/* Titles */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Forgot password?</h1>
            <p className="text-base text-gray-500 max-w-[280px] mx-auto leading-relaxed">
              No worries! Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-gray-400 text-gray-900 disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand hover:bg-brand-dark text-white rounded-xl font-medium shadow-md shadow-brand/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
