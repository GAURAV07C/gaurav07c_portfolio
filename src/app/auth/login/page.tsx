"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BlurFade from "@/components/BlurFade";
import grainImage from "@/assets/images/grain.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      {/* Background grain effect */}
      <div
        className="absolute inset-0 -z-10 opacity-5 pointer-events-none"
        style={{ backgroundImage: `url(${grainImage.src})` }}
      />
      
      {/* Glow effect */}
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
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 transition"
                required
              />
            </div>
            
            {error && <div className="text-red-400 text-sm">{error}</div>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3 rounded-xl mt-4 transition flex justify-center items-center"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </BlurFade>
    </div>
  );
}
