import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Layers, BrainCircuit, Clock, ChevronRight, X, Plus
} from "lucide-react";
import { cn } from "../lib/utils";
import { CircularProgress } from "../components/LeftSidebar";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, contexts, addContext } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [newCtxName, setNewCtxName] = useState("");
    const [creating, setCreating] = useState(false);

    const username = user?.username || "there";

    const handleCreateContext = (e) => {
        e.preventDefault();
        if (!newCtxName.trim()) return;
        setCreating(true);
        const id = addContext(newCtxName.trim());
        setNewCtxName("");
        setShowModal(false);
        setCreating(false);
        navigate(`/context/${id}`);
    };

    // Stats derived from global state
    const stats = [
        {
            label: "Total Contexts",
            value: String(contexts.length),
            trend: `${contexts.length} workspace${contexts.length !== 1 ? "s" : ""} active`,
            trendColor: "text-emerald-400",
            icon: Layers,
            iconBg: "bg-cyan-500/10",
            iconColor: "text-cyan-400",
        },
        {
            label: "Average Intelligence Score",
            value: contexts.length
                ? Math.round(contexts.reduce((a, c) => a + (c.score || 0), 0) / contexts.length).toString()
                : "0",
            trend: "Across all contexts",
            trendColor: "text-emerald-400",
            icon: BrainCircuit,
            iconBg: "bg-amber-500/10",
            iconColor: "text-amber-400",
        },
        {
            label: "Total Items",
            value: String(contexts.reduce((a, c) => a + (c.items?.length ?? 0), 0)),
            trend: "Notes, tasks & files",
            trendColor: "text-cyan-400",
            icon: Clock,
            iconBg: "bg-rose-500/10",
            iconColor: "text-rose-400",
        },
    ];

    // Show top 4 contexts on dashboard
    const priorityContexts = contexts.slice(0, 4);

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full p-8 md:p-12 overflow-y-auto bg-[#05070A] font-sans custom-scrollbar"
            >
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <motion.h1
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="text-4xl md:text-5xl font-black text-white tracking-tight"
                            >
                                Hello {username}.
                            </motion.h1>
                            <p className="text-slate-500 text-lg font-medium">
                                You have{" "}
                                <span className="text-slate-300">{contexts.length} active context{contexts.length !== 1 ? "s" : ""}</span>.
                            </p>
                        </div>

                        {/* Add Context Button */}
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-[#0B0F19] font-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all text-sm"
                        >
                            <Plus className="w-4 h-4" strokeWidth={3} />
                            Add Context
                        </motion.button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.04)" }}
                                className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 transition-all group cursor-default"
                            >
                                <div className="flex flex-col gap-6">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.iconBg)}>
                                        <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                                        <span className="text-5xl font-black text-white">{stat.value}</span>
                                        <p className={cn("text-sm font-bold mt-2", stat.trendColor)}>{stat.trend}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Priority Contexts */}
                    {priorityContexts.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-white tracking-tight">Your Contexts</h2>
                                <Link to="/contexts" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm tracking-wide transition-colors group">
                                    View all <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {priorityContexts.map((ctx, idx) => (
                                    <Link key={ctx.id} to={`/context/${ctx.id}`}>
                                        <motion.div
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
                                            className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between group transition-all cursor-pointer"
                                        >
                                            <div className="space-y-3">
                                                <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">
                                                    {ctx.name}
                                                </h3>
                                                <p className="text-slate-500 text-sm font-medium">{ctx.time || "Recent"}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase bg-slate-800/50 text-slate-300">
                                                        {ctx.items?.length ?? 0} items
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase bg-slate-800/50 text-slate-300">
                                                        {ctx.tag || "Active"}
                                                    </span>
                                                </div>
                                            </div>
                                            <CircularProgress
                                                score={ctx.score}
                                                color="text-cyan-400"
                                                isActive={true}
                                                theme={{ shadow: "shadow-[0_0_20px_rgba(6,182,212,0.4)]" }}
                                                size="lg"
                                            />
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {contexts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center"
                        >
                            <Layers className="w-12 h-12 text-slate-800 mb-4" />
                            <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">No contexts yet</p>
                            <p className="text-slate-700 text-sm mt-2">Click "Add Context" to create your first one</p>
                        </motion.div>
                    )}
                </div>

                {/* Bottom Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
            </motion.div>

            {/* ── Add Context Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                        >
                            <div className="bg-[#0D1117] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-[0_30px_80px_rgba(0,0,0,0.6)] pointer-events-auto mx-4">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-white tracking-tight">New Context</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateContext} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">
                                            Context Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newCtxName}
                                            onChange={(e) => setNewCtxName(e.target.value)}
                                            placeholder="e.g. Series B Prep, Q3 Roadmap..."
                                            autoFocus
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all font-medium text-[15px]"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={!newCtxName.trim() || creating}
                                        className="w-full bg-primary text-[#0B0F19] font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-40 disabled:cursor-not-allowed text-sm tracking-wide flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" strokeWidth={3} />
                                        Create Context
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
