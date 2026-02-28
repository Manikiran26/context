import { useParams } from "react-router-dom";
import { Bold, Italic, Underline, Code, Heading1, Heading2, Minus, Link as LinkIcon, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function ContextNotes() {
    const { id } = useParams();
    const { contexts } = useApp();
    const currentContext = contexts.find(c => c.id === parseInt(id)) || contexts[0];

    const toolbarButtons = [
        { icon: Bold, label: "Bold" },
        { icon: Italic, label: "Italic" },
        { icon: Underline, label: "Underline" },
        { type: "divider" },
        { icon: Code, label: "Code" },
        { icon: Heading1, label: "H1" },
        { icon: Heading2, label: "H2" },
        { icon: Minus, label: "Divider" },
        { type: "divider" },
        { icon: LinkIcon, label: "Link" },
    ];

    return (
        <div className="max-w-4xl mx-auto px-10 py-8 pb-32">

            {/* Editor Toolbar */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-10 bg-[#0B0F19]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 flex items-center gap-1 mb-10 shadow-2xl"
            >
                {toolbarButtons.map((btn, idx) => (
                    btn.type === "divider" ? (
                        <div key={`d-${idx}`} className="w-px h-5 bg-white/10 mx-2"></div>
                    ) : (
                        <motion.button
                            key={btn.label}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#fff" }}
                            whileTap={{ scale: 0.92 }}
                            className="p-2.5 rounded-xl text-slate-500 transition-all"
                        >
                            <btn.icon className="w-4 h-4" />
                        </motion.button>
                    )
                ))}

                <div className="flex-1"></div>
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(6,182,212,0.15)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[13px] font-black tracking-tight uppercase"
                >
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Add Block
                </motion.button>
            </motion.div>

            {/* Editor Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentContext.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-12"
                >
                    {/* Title Section */}
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ x: -10 }}
                            animate={{ x: 0 }}
                            className="text-[44px] font-black text-white tracking-tighter leading-[1.1] flex items-center gap-4"
                        >
                            {currentContext.name}
                        </motion.h1>
                        <p className="text-xl font-medium text-slate-500 max-w-2xl leading-relaxed">
                            {currentContext.statusDesc}. Intelligence level currently at <span className="text-white font-black">{currentContext.score}%</span>.
                        </p>
                    </div>

                    {/* Dynamic Sections Based on Context */}
                    <div className="space-y-10">
                        {currentContext.notes.length > 0 ? (
                            currentContext.notes.map((note, idx) => (
                                <motion.div
                                    key={note.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="space-y-4 group"
                                >
                                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                        <span className="text-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity">#</span> {note.title}
                                    </h2>
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 shadow-sm group-hover:border-white/10 transition-colors">
                                        <p className="text-slate-300 text-lg leading-relaxed">
                                            {note.content}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                                <p className="text-slate-600 font-bold uppercase tracking-widest">No active research blocks found</p>
                            </div>
                        )}
                    </div>

                    {/* Tasks Section */}
                    {currentContext.tasks.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">Context Objectives</h3>
                            <div className="grid gap-3">
                                {currentContext.tasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.02)" }}
                                        className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.01] transition-all cursor-pointer group"
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                                            task.status === "completed" ? "bg-emerald-500 text-white" : "border-2 border-slate-700"
                                        )}>
                                            {task.status === "completed" && <Plus className="w-4 h-4 rotate-45" strokeWidth={4} />}
                                        </div>
                                        <span className={cn(
                                            "text-base font-bold transition-all",
                                            task.status === "completed" ? "text-slate-500 line-through" : "text-slate-200 group-hover:text-white"
                                        )}>
                                            {task.title}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="mt-12 py-8 w-full border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-600 gap-3 hover:border-white/20 hover:text-slate-400 cursor-text transition-all bg-white/[0.01]"
                    >
                        <Plus className="w-8 h-8 opacity-20" />
                        <span className="font-black uppercase tracking-widest text-xs">Initialize New Intelligence Block</span>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
