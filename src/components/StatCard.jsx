import { motion } from "framer-motion";
import IntelligenceTooltip from "./IntelligenceTooltip";

export default function StatCard({ title, value, subtitle, icon: Icon, delay = 0, tooltip }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-6 flex flex-col group relative overflow-visible"
        >
            <div className="absolute -inset-px bg-gradient-to-br from-primary/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
            <div className="flex items-start justify-between mb-4 relative z-10 w-full">
                <div className="flex items-center">
                    <div className="text-slate-400 font-medium text-sm">{title}</div>
                    {tooltip && <IntelligenceTooltip />}
                </div>
                <div className="p-2 rounded-lg bg-surface border border-white/5 text-slate-300 group-hover:text-primary transition-colors shadow-inner">
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div className="text-3xl font-extrabold text-white mb-1 relative z-10 tracking-tight">{value}</div>
            <div className="text-xs text-slate-500 relative z-10 font-medium">{subtitle}</div>
        </motion.div>
    );
}
