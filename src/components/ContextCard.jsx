import { motion } from "framer-motion";
import { Clock, Users, Database } from "lucide-react";

export default function ContextCard({ context, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, rotateX: 2, rotateY: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="relative p-5 rounded-xl bg-surface/60 backdrop-blur-xl border border-white/5 cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{ perspective: 1000, transformStyle: "preserve-3d" }}
        >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute -inset-px rounded-xl border border-primary/0 group-hover:border-primary/40 transition-colors duration-300 pointer-events-none group-hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface border border-slate-700 flex items-center justify-center text-xl shadow-inner group-hover:border-primary/30 transition-colors">
                            {context.icon}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight">{context.name}</h3>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded uppercase tracking-widest">{context.tag}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[11px] font-bold group-hover:scale-105 transition-transform duration-300">
                        <Database className="w-3 h-3" />
                        {context.score}
                    </div>
                </div>

                {(context.members || 0) > 0 && (
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> {context.time}</div>
                            {context.members > 0 && (
                                <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500" /> {context.members} members</div>
                            )}
                        </div>
                        <div className="flex -space-x-2">
                            {[...Array(Math.min(5, context.members))].map((_, i) => (
                                <div key={i} className="w-7 h-7 rounded-full border-[3px] border-surface bg-gradient-to-br from-slate-600 to-slate-800 shadow-inner flex items-center justify-center text-[10px] font-bold text-white">
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
