"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { signIn, getCurrentUser } from "@/lib/supabase-api";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                if (user) router.push("/admin");
            })
            .catch(() => {});
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signIn(email, password);
            router.push("/admin");
        } catch (err) {
            console.error("Login failed:", err);
            const msg = err.message || "Invalid email or password. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4">
            {/* Ambient Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative w-full max-w-[420px] admin-card p-6 sm:p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-400 shadow-[0_0_24px_rgba(16, 185, 129,0.3)] mb-4">
                        <Lock className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Admin Portal</h2>
                    <p className="text-sm text-zinc-400 mt-1">Sign in to manage your portfolio</p>
                </div>

                <form onSubmit={handleLogin} className="admin-form-group">
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-400">
                            <AlertCircle size={15} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="admin-field">
                        <label className="admin-label">Email Address</label>
                        <div className="admin-input-wrapper">
                            <Mail className="admin-input-icon h-4.5 w-4.5" strokeWidth={1.5} />
                            <input
                                type="email"
                                required
                                placeholder="admin@example.com"
                                className="admin-input admin-input--with-icon"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Password</label>
                        <div className="admin-input-wrapper">
                            <Lock className="admin-input-icon h-4.5 w-4.5" strokeWidth={1.5} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="admin-input admin-input--with-icon"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="admin-btn admin-btn-primary w-full mt-2 py-3 text-sm font-semibold justify-center transition duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : null}
                        <span>{loading ? "Signing in..." : "Sign In"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
