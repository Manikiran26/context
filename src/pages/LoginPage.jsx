import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ShieldCheck, UserPlus, Zap, ArrowRight, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import clsx from "clsx";

export default function LoginPage() {
    const [mode, setMode] = useState("login"); // 'login' | 'register'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, register } = useApp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (mode === "login") {
                await login(email, password);
            } else {
                await register(email, password);
            }
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030508] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="z-10 w-full max-w-[420px] px-6"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                    >
                        <Zap className="w-7 h-7 text-cyan-400 fill-cyan-400/20" />
                    </motion.div>
                    <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Context OS</h1>
                </div>

                {/* Auth Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
                    {/* Interior Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                    
                    <div className="mb-8">
                        <div className="flex bg-black/40 rounded-xl p-1 mb-8 border border-white/5">
                            {["login", "register"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => { setMode(m); setError(""); }}
                                    className={clsx(
                                        "flex-1 py-2 text-[11px] font-black uppercase tracking-[0.15em] rounded-lg transition-all duration-300",
                                        mode === m ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            {mode === "login" ? "Welcome Back" : "Initialize Identity"}
                        </h2>
                        <p className="text-slate-500 text-[13px] font-medium mt-1.5">
                            {mode === "login" ? "Secure access to your intelligence graph." : "Join the next generation of knowledge management."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@context.ai"
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-[14px] placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-[14px] placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-medium"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-3"
                                >
                                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                    <p className="text-rose-400 text-[12px] font-bold leading-tight">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 md:h-[44px] bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[13px] uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : (
                                <>
                                    {mode === "login" ? "Enter System" : "Onboard Identity"}
                                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
                
                {/* Footer Link */}
                <button 
                    onClick={() => navigate("/")}
                    className="w-full text-center mt-10 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:text-slate-400 transition-colors"
                >
                    Back to Overview
                </button>
            </motion.div>
        </div>
    );
}
