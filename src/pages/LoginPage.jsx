import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useApp();

    const handleLogin = (e) => {
        e.preventDefault();
        // Requirement: Password must be "password" for every email
        if (password === "password") {
            setError("");
            setUser(email);
            navigate("/dashboard");
        } else {
            setError("Invalid password");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden font-sans"
        >
            {/* Top Corner Decorative Shapes (Reused from Landing Page) */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 2, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] pointer-events-none opacity-40"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path fill="rgba(255,255,255,0.05)" d="M44.7,-76.4C58.1,-69.2,69.5,-57.4,77.3,-44C85.1,-30.7,89.2,-15.3,88.3,-0.51C87.4,14.3,81.5,28.6,73,40.7C64.4,52.8,53.2,62.7,40.5,70.5C27.7,78.3,13.9,83.9,-0.6,85C-15.1,86.1,-30.2,82.7,-43.3,75.1C-56.4,67.6,-67.5,56,-75.4,42.5C-83.3,29.1,-88,14.5,-88,0C-87.9,-14.5,-83.1,-29.1,-74.6,-42C-66.2,-54.9,-54.1,-66.1,-40.4,-73C-26.7,-79.9,-13.3,-82.5,0.7,-83.7C14.7,-85,29.4,-84.9,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </motion.div>

            {/* Main Title at Top */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-12 left-0 right-0 text-center z-10"
            >
                <h1 className="text-4xl md:text-5xl font-black text-[#F0E6FF] tracking-[0.2em] uppercase drop-shadow-[0_0_20px_rgba(240,230,255,0.3)]">
                    CONTEXT OS
                </h1>
            </motion.div>

            {/* Login Card Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full max-w-md z-20 mx-4"
            >
                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 rounded-3xl bg-[#F0E6FF]/5 flex items-center justify-center mb-6 border border-[#F0E6FF]/20 shadow-[0_0_30px_rgba(240,230,255,0.1)]">
                            <ShieldCheck className="w-10 h-10 text-[#F0E6FF]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight text-center">Login</h2>
                        <p className="text-slate-500 mt-2 text-[15px] font-medium tracking-wide">Enter your access credentials</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        {/* Email Field */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#F0E6FF] transition-colors" strokeWidth={1.5} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-[#F0E6FF]/40 focus:ring-1 focus:ring-[#F0E6FF]/20 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#F0E6FF] transition-colors" strokeWidth={1.5} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-[#F0E6FF]/40 focus:ring-1 focus:ring-[#F0E6FF]/20 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <p className="text-red-400 text-sm font-semibold">{error}</p>
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-[#F0E6FF] hover:bg-white text-black font-black py-5 rounded-2.5xl transition-all shadow-[0_20px_40px_rgba(240,230,255,0.15)] flex items-center justify-center gap-3 text-lg"
                        >
                            Get access <span className="text-2xl">→</span>
                        </motion.button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            Forgot credentials? <span className="text-[#F0E6FF]/80 cursor-pointer hover:text-[#F0E6FF] hover:underline transition-colors decoration-dotted">Request recovery</span>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Bottom Glow (Synced with Landing Page) */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        </motion.div>
    );
}
