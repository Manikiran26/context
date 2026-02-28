import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import clsx from "clsx";

export default function IntelligenceCard({ score = 87 }) {
    let label = "Needs Work";
    let color = "text-rose-400";
    let glow = "shadow-[0_0_20px_rgba(244,63,94,0.4)]";
    let ringColor = "text-rose-500";

    if (score >= 80) {
        label = "Excellent";
        color = "text-cyan-400";
        glow = "shadow-[0_0_20px_rgba(6,182,212,0.4)]";
        ringColor = "text-cyan-500";
    } else if (score >= 60) {
        label = "Good";
        color = "text-emerald-400";
        glow = "shadow-[0_0_20px_rgba(16,185,129,0.4)]";
        ringColor = "text-emerald-500";
    }

    // Example sub-scores
    const bars = [
        { label: "Completeness", value: 92, color: "bg-emerald-500" },
        { label: "Connections", value: 75, color: "bg-cyan-500" },
        { label: "Freshness", value: 79, color: "bg-amber-500" }
    ];

    return (
        <div className="bg-[#05070A]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-5">Context Intelligence</h3>

            <div className="flex items-center gap-5 mb-6">
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" className="fill-none stroke-white/5" strokeWidth="8" />
                        <motion.circle
                            cx="50" cy="50" r="45"
                            className={clsx("fill-none", ringColor)}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className={clsx("absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center bg-[#05070A]", glow)}>
                        <span className="text-lg font-black text-white">{score}</span>
                    </div>
                </div>
                <div>
                    <p className="text-[15px] font-black text-white">{label}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Context is {label.toLowerCase()}</p>
                </div>
            </div>

            <div className="space-y-3.5">
                {bars.map((bar, idx) => (
                    <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-400">{bar.label}</span>
                            <span className={clsx(
                                bar.color.replace('bg-', 'text-').replace('500', '400')
                            )}>{bar.value}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${bar.value}%` }}
                                transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                                className={clsx("h-full rounded-full", bar.color)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
