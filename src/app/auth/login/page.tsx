"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BlurFade from "@/components/BlurFade";
import grainImage from "@/assets/images/grain.jpg";

type RateLimitEntry = {
  attempts: number;
  blockedUntil: number;
};

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_BLOCK_MS = 5 * 60 * 1000;

const rateLimitStore = new Map<string, RateLimitEntry>();

function getRateLimitKey(email: string, ip?: string) {
  return `${email}:${ip || "unknown"}`;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry) {
    rateLimitStore.set(key, { attempts: 1, blockedUntil: 0 });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.blockedUntil > now) {
    const remainingMs = entry.blockedUntil - now;
    return {
      allowed: false,
      remainingMs,
      retryAfter: Math.ceil(remainingMs / 1000),
    };
  }

  if (now - entry.blockedUntil > RATE_LIMIT_WINDOW_MS && entry.blockedUntil > 0) {
    rateLimitStore.set(key, { attempts: 1, blockedUntil: 0 });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  entry.attempts += 1;

  if (entry.attempts > RATE_LIMIT_MAX) {
    entry.blockedUntil = now + RATE_LIMIT_BLOCK_MS;
    return {
      allowed: false,
      remainingMs: RATE_LIMIT_BLOCK_MS,
      retryAfter: Math.ceil(RATE_LIMIT_BLOCK_MS / 1000),
    };
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.attempts };
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRateLimitError("");

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr) {
      setError(emailErr);
      setLoading(false);
      return;
    }

    if (passErr) {
      setError(passErr);
      setLoading(false);
      return;
    }

    const key = getRateLimitKey(email);
    const rateCheck = checkRateLimit(key);

    if (!rateCheck.allowed) {
      const retrySecs = rateCheck.retryAfter ?? Math.ceil((rateCheck.remainingMs ?? RATE_LIMIT_BLOCK_MS) / 1000);
      setRateLimitError(`Too many failed attempts. Please try again in ${formatTime(retrySecs)}.`);
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (res?.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-5 pointer-events-none"
        style={{ backgroundImage: `url(${grainImage.src})` }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 blur-[100px] -z-10 rounded-full pointer-events-none" />

      <BlurFade>
        <div className="w-full max-w-md p-8 md:p-10 bg-gray-900 border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
          <h1 className="text-3xl font-serif mb-2 text-white">Admin Login</h1>
          <p className="text-white/60 mb-8 text-sm">Sign in to manage your portfolio content.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 transition"
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 transition"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {rateLimitError && (
              <div className="text-amber-400 text-sm bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-3">
                {rateLimitError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3 rounded-xl mt-4 transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </BlurFade>
    </div>
  );
}
