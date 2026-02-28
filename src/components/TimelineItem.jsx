import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function TimelineItem({ item, index, isLast }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex gap-6 pb-10 group"
        >
            {/* Vertical Line */}
            {!isLast && (
                <div className="absolute top-8 left-5 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent -translate-x-[0.5px]" />
            )}

            {/* Icon Bubble */}
            <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 bg-surface shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
                <item.icon className={cn("w-4 h-4", item.iconColor)} />
            </div>

            {/* Content Card */}
            <div className="flex-1 glass-card p-5 group-hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors tracking-tight">{item.title}</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md tracking-wide">{item.time}</span>
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-4">{item.description}</p>

                {item.tag && (
                    <span className="inline-block text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-surface border border-white/5 text-slate-300 group-hover:border-white/10 group-hover:text-white transition-colors">
                        {item.tag}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
