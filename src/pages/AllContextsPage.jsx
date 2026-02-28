import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Zap, Rocket, BookOpen, Brain, Sparkles, FolderOpen, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import clsx from "clsx";

const ICON_MAP = {
    Zap: { Icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    Rocket: { Icon: Rocket, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    BookOpen: { Icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    Brain: { Icon: Brain, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    Sparkles: { Icon: Sparkles, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

export default function AllContextsPage() {
    const { contexts, deleteContext } = useApp();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        setDeletingId(id);
        setTimeout(() => {
            deleteContext(id);
            setDeletingId(null);
        }, 300);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full p-8 md:p-12 overflow-y-auto bg-[#05070A] font-sans custom-scrollbar"
        >
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">
                            Workspace
                        </p>
                        <h1 className="text-4xl font-black text-white tracking-tight">All Contexts</h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            {contexts.length} context{contexts.length !== 1 ? "s" : ""} in your workspace
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-black tracking-wide hover:bg-cyan-500/20 transition-all"
                    >
                        <Plus className="w-4 h-4" strokeWidth={3} /> Add Context
                    </motion.button>
                </div>

                {/* Contexts Grid */}
                {contexts.length === 0 ? (
                    <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                        <FolderOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">
                            No contexts yet
                        </p>
                        <p className="text-slate-700 text-sm mt-2">Create your first context from the dashboard</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {contexts.map((ctx, idx) => {
                                const theme = ICON_MAP[ctx.icon] || ICON_MAP["Zap"];
                                const { Icon } = theme;
                                const isDeleting = deletingId === ctx.id;
                                const itemCount = ctx.items?.length ?? (ctx.notes.length + ctx.tasks.length + ctx.files.length);

                                return (
                                    <motion.div
                                        key={ctx.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: isDeleting ? 0 : 1, y: 0, scale: isDeleting ? 0.95 : 1 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                                        onClick={() => navigate(`/context/${ctx.id}`)}
                                        className="group relative bg-white/[0.02] border border-white/8 hover:border-white/15 rounded-[1.75rem] p-6 cursor-pointer transition-all duration-300 hover:bg-white/[0.04] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                                    >
                                        {/* Icon + Name */}
                                        <div className="flex items-start justify-between mb-5">
                                            <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center", theme.bg, theme.border, "border")}>
                                                <Icon className={clsx("w-5 h-5", theme.color)} strokeWidth={1.5} />
                                            </div>

                                            {/* Delete Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => handleDelete(e, ctx.id)}
                                                className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </motion.button>
                                        </div>

                                        <h3 className={clsx("text-[16px] font-black text-white mb-1 group-hover:transition-colors", `group-hover:${theme.color}`)}>
                                            {ctx.name}
                                        </h3>

                                        <div className="flex items-center gap-3 mt-3">
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                                {itemCount} item{itemCount !== 1 ? "s" : ""}
                                            </span>
                                            <span className="text-slate-800">·</span>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                                {ctx.createdAt || "Recent"}
                                            </span>
                                        </div>

                                        {/* Tag */}
                                        <div className="mt-4">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                theme.bg, theme.color, theme.border, "border"
                                            )}>
                                                {ctx.tag || "Active"}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Ambient glows */}
            <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-cyan-500/3 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/3 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>
    );
}
