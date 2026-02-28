import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Type, CheckSquare, Paperclip, Check, Trash2,
    FileText, ChevronDown, PenLine, Network, Clock,
    GitBranch, Calendar, X, AlertCircle, Edit3, Flag
} from "lucide-react";
import { useApp } from "../context/AppContext";
import clsx from "clsx";
import ContextSidebar from "../components/ContextSidebar";
import EditorToolbar from "../components/EditorToolbar";

// ─── Item Components (Notes tab) ──────────────────────────────

function TextItem({ item, contextId }) {
    const { updateItem, removeItem } = useApp();
    const [hover, setHover] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="group relative"
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        >
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 focus-within:border-white/20 transition-colors">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                        <Type className="w-3 h-3" /> Text Block
                    </div>
                    <AnimatePresence>
                        {hover && (
                            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => removeItem(contextId, item.id)}
                                className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all">
                                <Trash2 className="w-3 h-3" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
                <textarea
                    value={item.content}
                    onChange={(e) => updateItem(contextId, item.id, { content: e.target.value })}
                    placeholder="Start typing your thoughts..."
                    rows={3}
                    className="w-full bg-transparent text-slate-200 text-[15px] leading-relaxed font-medium placeholder:text-slate-700 focus:outline-none resize-none"
                />
            </div>
        </motion.div>
    );
}

function TaskItem({ item, contextId }) {
    const { toggleTask, updateItem, removeItem } = useApp();
    const [hover, setHover] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="group relative"
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        >
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-white/15 transition-colors">
                <button
                    onClick={() => toggleTask(contextId, item.id)}
                    className={clsx("w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                        item.completed ? "bg-emerald-500 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "border-slate-700 hover:border-emerald-500/50"
                    )}>
                    <AnimatePresence>
                        {item.completed && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
                <input
                    type="text" value={item.content}
                    onChange={(e) => updateItem(contextId, item.id, { content: e.target.value })}
                    placeholder="Task description..."
                    className={clsx("flex-1 bg-transparent text-[15px] font-medium focus:outline-none transition-all",
                        item.completed ? "text-slate-600 line-through decoration-slate-600" : "text-slate-200 placeholder:text-slate-700"
                    )}
                />
                <AnimatePresence>
                    {hover && (
                        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => removeItem(contextId, item.id)}
                            className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all">
                            <Trash2 className="w-3 h-3" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function FileItem({ item, contextId }) {
    const { removeItem } = useApp();
    const [hover, setHover] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="group relative"
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        >
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-white/15 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-pink-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-black text-slate-200 truncate">{item.name}</p>
                    {item.size && <p className="text-[11px] font-bold text-slate-600 mt-0.5">{(item.size / 1024).toFixed(1)} KB</p>}
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-[10px] font-black uppercase tracking-widest text-pink-400 shrink-0">File</span>
                <AnimatePresence>
                    {hover && (
                        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => removeItem(contextId, item.id)}
                            className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all">
                            <Trash2 className="w-3 h-3" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ─── Graph Placeholder ─────────────────────────────────────────

function GraphPlaceholder({ ctx }) {
    const nodes = [
        { x: 50, y: 50, label: ctx.name, main: true },
        { x: 20, y: 25, label: "Notes", color: "bg-cyan-500" },
        { x: 80, y: 25, label: "Tasks", color: "bg-emerald-500" },
        { x: 15, y: 70, label: "Files", color: "bg-pink-500" },
        { x: 80, y: 72, label: "Team", color: "bg-amber-500" },
        { x: 50, y: 15, label: "Goals", color: "bg-purple-500" },
    ];
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-lg">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Network className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-[15px]">Context Graph</h3>
                        <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">Visual relationship map</p>
                    </div>
                </div>
                <div className="relative w-full h-72 bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.3) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                    <svg className="absolute inset-0 w-full h-full">
                        {nodes.slice(1).map((node, i) => (
                            <line key={i} x1="50%" y1="50%" x2={`${node.x}%`} y2={`${node.y}%`}
                                stroke="rgba(99,102,241,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
                        ))}
                    </svg>
                    {nodes.map((node, i) => (
                        <motion.div key={i}
                            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                            {node.main ? (
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center">
                                        <GitBranch className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest whitespace-nowrap max-w-[80px] truncate text-center">{ctx.name}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <div className={clsx("w-7 h-7 rounded-xl border border-white/10 flex items-center justify-center shadow-md", node.color + "/20")}>
                                        <div className={clsx("w-2.5 h-2.5 rounded-full", node.color)} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-500 whitespace-nowrap">{node.label}</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
                <p className="text-center text-slate-700 text-[11px] font-bold uppercase tracking-widest mt-5">Full interactive graph — coming soon</p>
            </div>
        </motion.div>
    );
}

// ─── Deadline Banner ───────────────────────────────────────────

function DeadlineBanner({ ctx, onSetDeadline }) {
    const { setDeadline } = useApp();
    const [showPicker, setShowPicker] = useState(false);
    const [dateVal, setDateVal] = useState("");

    const hasDeadline = !!ctx.deadline;

    // Compute days remaining
    let daysRemaining = null;
    let isPast = false;
    if (hasDeadline) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dl = new Date(ctx.deadline);
        dl.setHours(0, 0, 0, 0);
        const diff = Math.round((dl - today) / (1000 * 60 * 60 * 24));
        daysRemaining = diff;
        isPast = diff < 0;
    }

    const formattedDeadline = hasDeadline
        ? new Date(ctx.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : null;

    const handleSave = () => {
        if (!dateVal) return;
        setDeadline(ctx.id, dateVal);
        setShowPicker(false);
        setDateVal("");
    };

    const handleRemove = () => {
        setDeadline(ctx.id, null);
    };

    return (
        <div className="mb-8">
            {/* Not set */}
            {!hasDeadline && !showPicker && (
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPicker(true)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-dashed border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20 hover:bg-white/[0.02] transition-all text-[13px] font-black tracking-wide w-full justify-center"
                >
                    <Calendar className="w-4 h-4" />
                    Set Deadline
                </motion.button>
            )}

            {/* Date picker inline */}
            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="bg-[#0D1117] border border-white/10 rounded-2xl p-5 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Flag className="w-4 h-4 text-rose-400" />
                                <span className="text-[13px] font-black text-white">Set Deadline</span>
                            </div>
                            <button onClick={() => setShowPicker(false)} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <input
                            type="date"
                            value={dateVal}
                            onChange={(e) => setDateVal(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-[14px] font-bold focus:outline-none focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/20 transition-all mb-4 [color-scheme:dark]"
                        />
                        <div className="flex gap-2">
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={handleSave} disabled={!dateVal}
                                className="flex-1 py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-[13px] font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(239,68,68,0.3)]">
                                Confirm
                            </motion.button>
                            <button onClick={() => setShowPicker(false)} className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-500 hover:text-white text-[13px] font-bold transition-colors">
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Deadline set */}
            {hasDeadline && !showPicker && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                        "rounded-2xl border px-5 py-4 flex flex-wrap items-center gap-3",
                        isPast
                            ? "bg-rose-950/20 border-rose-500/30 shadow-[0_0_20px_rgba(239,68,68,0.08)]"
                            : daysRemaining <= 3
                                ? "bg-orange-950/20 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.08)]"
                                : "bg-emerald-950/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                    )}
                >
                    <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                        isPast ? "bg-rose-500/20" : daysRemaining <= 3 ? "bg-orange-500/20" : "bg-emerald-500/10"
                    )}>
                        {isPast ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <Flag className="w-4 h-4 text-emerald-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Deadline</p>
                        <p className={clsx("text-[14px] font-black",
                            isPast ? "text-rose-400" : daysRemaining <= 3 ? "text-orange-400" : "text-white"
                        )}>
                            {formattedDeadline}
                        </p>
                    </div>

                    {/* Days badge */}
                    <span className={clsx(
                        "px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border shrink-0",
                        isPast
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                            : daysRemaining === 0
                                ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                                : daysRemaining <= 3
                                    ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    )}>
                        {isPast ? "Expired" : daysRemaining === 0 ? "Due today" : `${daysRemaining}d left`}
                    </span>

                    {/* Edit / Remove */}
                    <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setDateVal(ctx.deadline); setShowPicker(true); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/8 text-slate-400 hover:text-white text-[11px] font-black transition-all hover:bg-white/[0.07]">
                            <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={handleRemove}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-[11px] font-black transition-all">
                            <X className="w-3 h-3" /> Remove
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// ─── Timeline + Deadline View ──────────────────────────────────

function TimelineView({ ctx }) {
    const items = ctx.items || [];
    const texts = items.filter(i => i.type === "text");
    const tasks = items.filter(i => i.type === "task");
    const files = items.filter(i => i.type === "file");

    // Build timeline events
    const events = [
        { label: "Context created", sub: ctx.createdAt || "Recently", color: "bg-indigo-500", glow: "shadow-[0_0_12px_rgba(99,102,241,0.6)]", done: true },
        ...texts.map(t => ({ label: "Added text block", sub: t.content?.slice(0, 40) || "Empty block", color: "bg-cyan-500", glow: "shadow-[0_0_10px_rgba(6,182,212,0.5)]", done: true })),
        ...tasks.map(t => ({ label: t.completed ? "Completed task" : "Added task", sub: t.content || "Unnamed task", color: t.completed ? "bg-emerald-500" : "bg-amber-500", glow: t.completed ? "shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "shadow-[0_0_10px_rgba(245,158,11,0.5)]", done: t.completed })),
        ...files.map(f => ({ label: "Uploaded file", sub: f.name, color: "bg-pink-500", glow: "shadow-[0_0_10px_rgba(236,72,153,0.5)]", done: true })),
    ];

    // Deadline event
    let deadlineEvent = null;
    let daysRemaining = null;
    let isPast = false;
    if (ctx.deadline) {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const dl = new Date(ctx.deadline); dl.setHours(0, 0, 0, 0);
        const diff = Math.round((dl - today) / (1000 * 60 * 60 * 24));
        daysRemaining = diff;
        isPast = diff < 0;
        const formatted = dl.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
        deadlineEvent = {
            label: `Deadline: ${formatted}`,
            sub: isPast ? "This deadline has passed" : diff === 0 ? "Due today!" : `${diff} day${diff !== 1 ? "s" : ""} remaining`,
            color: isPast ? "bg-rose-500" : diff <= 3 ? "bg-orange-500" : "bg-emerald-500",
            glow: isPast ? "shadow-[0_0_16px_rgba(239,68,68,0.7)]" : diff <= 3 ? "shadow-[0_0_16px_rgba(249,115,22,0.7)]" : "shadow-[0_0_16px_rgba(16,185,129,0.5)]",
            done: !isPast,
            isDeadline: true,
            isPast,
            urgent: diff <= 3 && !isPast,
        };
    }

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="py-4">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                    <h3 className="text-white font-black text-[15px]">Activity Timeline</h3>
                    <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">{events.length + (deadlineEvent ? 1 : 0)} events</p>
                </div>
            </div>

            {/* Deadline Banner */}
            <DeadlineBanner ctx={ctx} />

            {/* Separator */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-white/[0.04]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Activity Log</span>
                <div className="h-px flex-1 bg-white/[0.04]" />
            </div>

            {/* Events */}
            <div className="relative pl-6">
                <div className="absolute left-[9px] top-2 bottom-4 w-px bg-white/[0.06]" />
                <div className="space-y-4">
                    {events.map((ev, idx) => (
                        <motion.div key={idx}
                            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className="relative flex gap-4 items-start group"
                        >
                            <div className={clsx("absolute -left-6 top-1.5 w-[18px] h-[18px] rounded-full border-2 border-[#05070A] z-10 shrink-0", ev.color, ev.glow)} />
                            <div className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl px-4 py-3.5 group-hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-[13px] font-black text-slate-200">{ev.label}</p>
                                    <span className={clsx("px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest shrink-0",
                                        ev.done ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                    )}>
                                        {ev.done ? "Done" : "Pending"}
                                    </span>
                                </div>
                                {ev.sub && <p className="text-[11px] text-slate-600 mt-1 truncate font-medium">{ev.sub}</p>}
                            </div>
                        </motion.div>
                    ))}

                    {/* Deadline event in timeline */}
                    {deadlineEvent && (
                        <motion.div
                            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: events.length * 0.06 + 0.05 }}
                            className="relative flex gap-4 items-start"
                        >
                            <div className={clsx("absolute -left-6 top-1.5 w-[18px] h-[18px] rounded-full border-2 border-[#05070A] z-10 shrink-0", deadlineEvent.color, deadlineEvent.glow)} />
                            <div className={clsx(
                                "flex-1 rounded-2xl px-4 py-3.5 border",
                                deadlineEvent.isPast
                                    ? "bg-rose-950/20 border-rose-500/30"
                                    : deadlineEvent.urgent
                                        ? "bg-orange-950/20 border-orange-500/30"
                                        : "bg-emerald-950/10 border-emerald-500/20"
                            )}>
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <Flag className={clsx("w-3.5 h-3.5 shrink-0",
                                            deadlineEvent.isPast ? "text-rose-400" : deadlineEvent.urgent ? "text-orange-400" : "text-emerald-400"
                                        )} />
                                        <p className={clsx("text-[13px] font-black",
                                            deadlineEvent.isPast ? "text-rose-300" : deadlineEvent.urgent ? "text-orange-300" : "text-white"
                                        )}>
                                            {deadlineEvent.label}
                                        </p>
                                    </div>
                                    <span className={clsx(
                                        "px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                                        deadlineEvent.isPast
                                            ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                                            : deadlineEvent.urgent
                                                ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    )}>
                                        {deadlineEvent.isPast ? "Expired" : deadlineEvent.done ? `${daysRemaining}d left` : "Today"}
                                    </span>
                                </div>
                                <p className={clsx("text-[11px] mt-1 font-bold",
                                    deadlineEvent.isPast ? "text-rose-600" : "text-slate-600"
                                )}>
                                    {deadlineEvent.sub}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Future placeholder */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: (events.length + (deadlineEvent ? 1 : 0)) * 0.06 + 0.1 }}
                        className="relative flex gap-4 items-start opacity-25"
                    >
                        <div className="absolute -left-6 top-1.5 w-[18px] h-[18px] rounded-full border-2 border-dashed border-slate-700 z-10" />
                        <div className="flex-1 border border-dashed border-white/5 rounded-2xl px-4 py-3.5">
                            <p className="text-[12px] font-bold text-slate-600">Future activity will appear here...</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Tab Config ────────────────────────────────────────────────

const TABS = [
    { id: "notes", label: "Notes", icon: PenLine },
    { id: "graph", label: "Graph", icon: Network },
    { id: "timeline", label: "Timeline", icon: Clock },
];

const ADD_OPTIONS = [
    { type: "text", label: "Text Block", icon: Type, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { type: "task", label: "Task", icon: CheckSquare, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { type: "file", label: "File", icon: Paperclip, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
];

// ─── Main Page ─────────────────────────────────────────────────

export default function ContextPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const contextId = parseInt(id) || id;
    const { contexts, addItem } = useApp();
    const [activeTab, setActiveTab] = useState("notes");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const fileInputRef = useRef(null);

    const ctx = contexts.find((c) => c.id === contextId || c.id === parseInt(id)) || contexts[0];

    if (!ctx) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-slate-500 font-bold text-lg">Context not found</p>
                    <button onClick={() => navigate("/contexts")} className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-bold">← Back to All Contexts</button>
                </div>
            </div>
        );
    }

    const handleAddItem = (type) => {
        setDropdownOpen(false);
        if (type === "file") { fileInputRef.current?.click(); return; }
        addItem(ctx.id, { type, content: "" });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        addItem(ctx.id, { type: "file", name: file.name, size: file.size });
        e.target.value = "";
    };

    const items = ctx.items || [];
    const tasksDone = items.filter(i => i.type === "task" && i.completed).length;
    const tasksTotal = items.filter(i => i.type === "task").length;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full h-full overflow-y-auto bg-[#05070A] font-sans custom-scrollbar"
        >
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />

            <div className="max-w-7xl mx-auto px-8 py-10 pb-32">

                {/* ── Header ── */}
                <div className="mb-8">
                    <button onClick={() => navigate("/contexts")}
                        className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors mb-3 flex items-center gap-1">
                        ← All Contexts
                    </button>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-[38px] font-black text-white tracking-tighter leading-tight">{ctx.name}</h1>
                            <div className="flex items-center gap-4 mt-1.5">
                                <span className="text-slate-500 text-sm font-medium">{items.length} items</span>
                                {tasksTotal > 0 && (
                                    <><span className="text-slate-800">·</span>
                                        <span className="text-slate-500 text-sm font-medium">{tasksDone}/{tasksTotal} tasks done</span></>
                                )}
                                {ctx.deadline && (
                                    <><span className="text-slate-800">·</span>
                                        <span className="text-[11px] font-black text-rose-400/80 flex items-center gap-1">
                                            <Flag className="w-3 h-3" />
                                            {new Date(ctx.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                        </span></>
                                )}
                            </div>
                        </div>

                        {/* + Add (Notes only) */}
                        {activeTab === "notes" && (
                            <div className="relative mt-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => setDropdownOpen(o => !o)}
                                    className={clsx(
                                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black tracking-wide transition-all border",
                                        dropdownOpen ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300" : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                                    )}>
                                    <Plus className={clsx("w-4 h-4 transition-transform duration-200", dropdownOpen && "rotate-45")} strokeWidth={3} />
                                    Add
                                    <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform duration-200", dropdownOpen && "rotate-180")} />
                                </motion.button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -6, scale: 0.96 }} transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-[#0D1117] border border-white/10 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                                        >
                                            {ADD_OPTIONS.map(opt => (
                                                <button key={opt.type} onClick={() => handleAddItem(opt.type)}
                                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-[13px] font-black transition-all hover:bg-white/[0.04] text-left">
                                                    <div className={clsx("w-7 h-7 rounded-lg flex items-center justify-center border", opt.bg, opt.border)}>
                                                        <opt.icon className={clsx("w-3.5 h-3.5", opt.color)} />
                                                    </div>
                                                    <span className="text-slate-200">{opt.label}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Tab Navigation ── */}
                <div className="flex items-center gap-1 border-b border-white/[0.06] mb-8">
                    {TABS.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "relative flex items-center gap-2 px-4 py-2.5 text-[13px] font-black tracking-wide transition-all duration-200 rounded-t-lg",
                                    isActive ? "text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                                )}>
                                <tab.icon className={clsx("w-3.5 h-3.5", isActive ? "text-indigo-400" : "")} />
                                {tab.label}
                                {/* Deadline dot on Timeline tab */}
                                {tab.id === "timeline" && ctx.deadline && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                                )}
                                {isActive && (
                                    <motion.div layoutId="tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] rounded-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Tab Content ── */}
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Left Column - Main Content */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            {activeTab === "notes" && (
                                <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

                                    {/* Editor Toolbar added here */}
                                    <EditorToolbar />

                                    {items.length === 0 ? (
                                        <div className="py-24 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center">
                                            <Plus className="w-10 h-10 text-slate-800 mb-4" />
                                            <p className="text-slate-600 font-black uppercase tracking-widest text-[11px]">Nothing here yet</p>
                                            <p className="text-slate-700 text-sm mt-2">Click <span className="text-cyan-500">+ Add</span> to create text blocks, tasks, or attach files</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <AnimatePresence mode="popLayout">
                                                {items.map(item => {
                                                    if (item.type === "text") return <TextItem key={item.id} item={item} contextId={ctx.id} />;
                                                    if (item.type === "task") return <TaskItem key={item.id} item={item} contextId={ctx.id} />;
                                                    if (item.type === "file") return <FileItem key={item.id} item={item} contextId={ctx.id} />;
                                                    return null;
                                                })}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "graph" && (
                                <motion.div key="graph" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                    <GraphPlaceholder ctx={ctx} />
                                </motion.div>
                            )}

                            {activeTab === "timeline" && (
                                <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                    <TimelineView ctx={ctx} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="w-full xl:w-[320px] shrink-0">
                        <ContextSidebar context={ctx} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
