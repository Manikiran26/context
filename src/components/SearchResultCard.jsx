import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.3 } }
};

export default function SearchResultCard({ result }) {
    return (
        <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 p-4 rounded-xl bg-surface/40 hover:bg-surfaceHover/80 border border-white/5 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
        >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-inner bg-surface border border-white/5 group-hover:border-primary/30 transition-colors">
                {result.icon}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors tracking-tight">{result.title}</h4>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{result.subtitle}</div>
            </div>
            <div className="flex items-center gap-3">
                <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-widest", result.colorClass)}>
                    {result.type}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300" />
            </div>
        </motion.div>
    );
}
