import { CheckSquare, FileText, Paperclip, Share, Plus, UserPlus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CircularProgress } from "./LeftSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function RightSidebar() {
    const { id } = useParams();
    const contextId = parseInt(id);
    const { contexts } = useApp();
    const ctx = contexts.find(c => c.id === contextId) || contexts[0];

    const themeColor = id ? (ctx.id === 1 ? "text-cyan-400" : ctx.id === 2 ? "text-amber-400" : ctx.id === 4 ? "text-emerald-400" : "text-purple-400") : "text-primary";
    const themeShadow = id ? (ctx.id === 1 ? "shadow-[0_0_15px_rgba(6,182,212,0.4)]" : ctx.id === 2 ? "shadow-[0_0_15px_rgba(245,158,11,0.3)]" : ctx.id === 4 ? "shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "shadow-[0_0_15px_rgba(168,85,247,0.3)]") : "";

    return (
        <div className="p-6 flex flex-col gap-8 h-full bg-[#05070A]/50 backdrop-blur-md">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`ctx-${ctx.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-8"
                >
                    {/* Intelligence Score */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-5">Context Intelligence</h3>
                        <div className="flex items-center gap-5 mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <CircularProgress
                                key={`progress-${ctx.id}`}
                                score={ctx.score}
                                color={themeColor}
                                isActive={true}
                                theme={{ shadow: themeShadow }}
                                size="lg"
                            />
                            <div>
                                <div className={cn("font-black text-xl tracking-tight transition-colors", themeColor)}>
                                    {ctx.status}
                                </div>
                                <div className="text-xs font-bold text-slate-500 mt-0.5">{ctx.statusDesc}</div>
                            </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-5 px-1">
                            {[
                                { label: "Completeness", value: ctx.metrics.completeness, color: themeColor },
                                { label: "Connections", value: ctx.metrics.connections, color: "text-blue-400" },
                                { id: "freshness", label: "Freshness", value: ctx.metrics.freshness, color: "text-amber-500" }
                            ].map((m) => (
                                <div key={m.label} className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-black tracking-widest uppercase text-slate-500">
                                        <span>{m.label}</span>
                                        <span className={m.color}>{m.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${m.value}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={cn("h-full rounded-full transition-all duration-500", m.color.replace('text-', 'bg-'))}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-white/5"></div>

                    {/* Members */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Members</h3>
                            <button className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">View All</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {ctx.members.map(m => (
                                <motion.div
                                    key={`${ctx.id}-${m.id}`}
                                    whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.02)" }}
                                    className="flex items-center justify-between p-2 -mx-2 rounded-xl cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border border-white/10", m.color)}>
                                            {m.initials}
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-black text-slate-200">{m.name}</div>
                                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{m.role}</div>
                                        </div>
                                    </div>
                                    <div className={cn("w-1.5 h-1.5 rounded-full", m.online ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]' : 'bg-slate-800')}></div>
                                </motion.div>
                            ))}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-2 w-full py-3 rounded-xl border border-dashed border-white/10 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2"
                            >
                                <UserPlus className="w-3.5 h-3.5" /> Invite Member
                            </motion.button>
                        </div>
                    </div>

                    <div className="h-px bg-white/5"></div>

                    {/* Tags */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-5">Insight Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {ctx.tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 text-[10px] font-bold text-slate-400 bg-white/[0.03] border border-white/5 rounded-lg hover:bg-white/10 hover:text-white cursor-pointer transition-all">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-white/5"></div>

                    {/* Activity Timeline */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-5">Context Activity</h3>
                        <div className="flex flex-col gap-5 relative">
                            {/* Connector line */}
                            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/5"></div>

                            {ctx.activity.map((item, idx) => (
                                <motion.div
                                    key={`${ctx.id}-${item.id}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-6 group cursor-pointer"
                                >
                                    <div className={cn("absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#05070A] z-10", item.color)}></div>
                                    <div>
                                        <p className="text-[12px] text-slate-300 leading-snug font-medium">
                                            <span className="text-white font-black">{item.user}</span> {item.action}
                                            <br />
                                            <span className={cn("opacity-80 group-hover:opacity-100 transition-opacity", item.strike && "line-through")}>{item.target}</span>
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-tighter">{item.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
