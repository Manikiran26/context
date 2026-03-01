import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight, Shield, Cpu, Target } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();

    // If already logged in, redirect to dashboard
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) navigate("/dashboard", { replace: true });
    }, [navigate]);

    return (
        <div className="min-h-screen w-full bg-[#030508] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="z-10 flex flex-col items-center px-6 text-center"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                >
                    <Zap className="w-3 h-3 fill-cyan-400" />
                    Context Intelligence v1.0
                </motion.div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 max-w-5xl leading-[1.1]">
                    Unify Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-indigo-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.35)]">
                        Digital Context.
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mb-12 leading-relaxed">
                    ContextOS transforms fragmented files, tasks, and notes into a unified knowledge graph with deterministic intelligence scoring.
                </p>

                {/* Main CTA */}
                <motion.button
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-lg tracking-wide shadow-[0_20px_50px_rgba(255,255,255,0.15)] overflow-hidden transition-all hover:bg-cyan-400 hover:text-black hover:shadow-[0_20px_50px_rgba(6,182,212,0.4)]"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Get Started — It’s Free
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                    </span>
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-cyan-300 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Feature Grid Mini */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                    {[
                        { icon: Target, label: "Deterministic", sub: "Data-driven scoring engine" },
                        { icon: Cpu, label: "Graph-Native", sub: "Automatic item connections" },
                        { icon: Shield, label: "Owner-First", sub: "Secure membership control" },
                    ].map((f, i) => (
                        <motion.div
                            key={f.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 text-left hover:bg-white/[0.04] transition-colors group"
                        >
                            <f.icon className="w-6 h-6 text-cyan-500 mb-4 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" />
                            <h4 className="text-[14px] font-black uppercase tracking-widest text-white mb-1">{f.label}</h4>
                            <p className="text-slate-500 text-[13px] font-medium">{f.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Bottom Accent */}
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </div>
    );
}
