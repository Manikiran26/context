import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Info } from "lucide-react";

export default function IntelligenceTooltip() {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative flex items-center ml-2 z-50 pointer-events-auto"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Info className="w-4 h-4 text-slate-500 hover:text-primary transition-colors cursor-help" />
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 w-48 p-3 rounded-xl shadow-2xl bg-[#1A2235] border border-white/10 text-[12px] leading-relaxed text-slate-300 pointer-events-none text-center"
                    >
                        Score calculated from activity frequency, deadlines, and collaboration intensity.
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-[#1A2235] border-t-[6px] border-x-transparent border-x-[6px] border-b-0" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
