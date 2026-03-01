import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Clock, Activity, Zap, RefreshCw, UserPlus,
    CheckCircle, XCircle, Hash, Shield, FileText, CheckSquare,
    Paperclip, Layout, Plus, X
} from "lucide-react";
import {
    apiGetMembers, apiGetPendingRequests, apiInviteMember,
    apiApproveRequest, apiRejectRequest, apiGetActivity, apiGetIntelligence, apiCreateTag
} from "../lib/api";
import clsx from "clsx";
import { useApp } from "../context/AppContext";

// ── relative time helper ──────────────────────────────────────────────────────
function relativeTime(dateStr) {
    if (!dateStr) return "";
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return `JUST NOW`;
    if (diff < 3600) return `${Math.floor(diff / 60)} MIN AGO`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} HR AGO`;
    const days = Math.floor(diff / 86400);
    if (days < 7) return `${days} DAYS AGO`;
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" }).toUpperCase();
}

const ACTION_STRINGS = {
    NOTE_CREATED: "Created note", NOTE_UPDATED: "Updated note", NOTE_DELETED: "Deleted note",
    TASK_CREATED: "Created task", TASK_COMPLETED: "Completed task", TASK_DELETED: "Deleted task",
    TASK_UPDATED: "Updated task", FILE_UPLOADED: "Uploaded file", FILE_DELETED: "Deleted file",
    MEMBER_ADDED: "Joined context", MEMBER_REQUESTED: "Requested invite", MEMBER_APPROVED: "Approved member",
    MEMBER_REJECTED: "Rejected member", CONTEXT_DELETED: "Deleted context", ITEM_CREATED: "Added item",
};

const ActivityIcon = ({ type }) => {
    const props = { className: "w-3 h-3 text-cyan-400" };
    if (type.includes('NOTE')) return <FileText {...props} />;
    if (type.includes('TASK')) return <CheckSquare {...props} />;
    if (type.includes('FILE')) return <Paperclip {...props} />;
    if (type.includes('MEMBER')) return <Users {...props} />;
    return <Activity {...props} />;
};

function activityLabel(a) {
    const base = ACTION_STRINGS[a.type] || a.type;
    const title = a.metadata?.title || "";
    return `You ${base}: ${title || "Note"}`;
}

// ── Gauge Component (Picture 2 Style) ──────────────────────────────────────────
const CircularGauge = ({ score }) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - ((score || 0) / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Background Shadow/Glow */}
                <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-2xl" />

                <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    <circle
                        cx="64" cy="64" r={radius}
                        stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent"
                    />
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        cx="64" cy="64" r={radius}
                        stroke="#06B6D4" strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                    <span className="text-4xl font-black text-white tracking-tighter">{score || 0}</span>
                </div>
            </div>
            <div className="mt-4 text-center">
                <h4 className="text-[13px] font-black text-white uppercase tracking-wider">Intelligence Score</h4>
            </div>
        </div>
    );
};

// ── Sidebar component (exported) ──────────────────────────────────────────────
export default function ContextSidebar({ contextId, myRole, tags = [], onMemberAction, refreshTrigger }) {
    const { user } = useApp();
    const [intelligence, setIntelligence] = useState(null);
    const [members, setMembers] = useState([]);
    const [pending, setPending] = useState([]);
    const [activity, setActivity] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("viewer");
    const [inviting, setInviting] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteMsg, setInviteMsg] = useState("");
    const [addingTag, setAddingTag] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [, setTick] = useState(0);

    const loadAll = useCallback(async () => {
        if (!contextId) return;
        try {
            const intel = await apiGetIntelligence(contextId).catch(() => null);
            setIntelligence(intel);

            const mems = await apiGetMembers(contextId).catch(() => []);
            setMembers(mems);

            const acts = await apiGetActivity(contextId).catch(() => []);
            setActivity(acts);

            if (myRole === "host" || myRole === "owner") {
                const pend = await apiGetPendingRequests(contextId).catch(() => []);
                setPending(pend);
            }
        } catch (e) { console.error("sidebar load:", e.message); }
    }, [contextId, myRole]);

    useEffect(() => { loadAll(); }, [loadAll, refreshTrigger]);

    useEffect(() => {
        const t = setInterval(() => setTick(x => x + 1), 30000);
        return () => clearInterval(t);
    }, []);

    const filteredActivity = useMemo(() => {
        if (filter === "ALL") return activity;
        return activity.filter(a => a.type?.includes(filter));
    }, [activity, filter]);

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        setIsInviting(true); setInviteMsg("");
        try {
            await apiInviteMember(contextId, inviteEmail.trim(), inviteRole);
            setInviteMsg("✓ Invite sent successfully");
            setInviteEmail("");
            await loadAll();
            await onMemberAction?.();
            setTimeout(() => { setInviting(false); setInviteMsg(""); }, 1500);
        } catch (e) {
            setInviteMsg("Failed: " + e.message);
        } finally {
            setIsInviting(false);
        }
    };

    const handleApprove = async (requestId: any) => {
        try { await apiApproveRequest(requestId); await loadAll(); await onMemberAction?.(); }
        catch (e: any) { alert(e.message); }
    };

    const handleReject = async (requestId: any) => {
        try { await apiRejectRequest(requestId); await loadAll(); await onMemberAction?.(); }
        catch (e: any) { alert(e.message); }
    };

    const score = intelligence?.score ?? 0;

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 w-full max-w-[320px]">

            {/* CONTEXT INTELLIGENCE */}
            <div className="bg-surface border border-white/[0.05] rounded-3xl p-6 shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 block">Context Intelligence</span>

                <CircularGauge score={score} />

                <div className="mt-4 space-y-5">
                    {[
                        { label: "Completeness", val: intelligence?.completeness ?? 0 },
                        { label: "Connections", val: intelligence?.connections ?? 0 },
                        { label: "Freshness", val: intelligence?.freshness ?? 0 },
                    ].map(({ label, val }) => (
                        <div key={label}>
                            <div className="flex justify-between mb-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{label}</span>
                                <span className="text-[11px] font-black text-cyan-400">{val}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${val}%` }}
                                    transition={{ duration: 1.2, ease: "circOut" }}
                                    className="h-full rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MEMBERS */}
            <div className="bg-surface border border-white/[0.05] rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Members</span>
                    <span className="text-[10px] font-black text-white bg-white/[0.05] px-2 py-0.5 rounded-lg">{members.length}</span>
                </div>

                <div className="space-y-4">
                    {members.map(m => (
                        <div key={m.id} className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden">
                                    <span className="text-[11px] font-black text-white">{(m.email || "U")[0].toUpperCase()}</span>
                                </div>
                                <div className={clsx("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface", m.is_online ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-orange-500")} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-[13px] font-black text-white truncate leading-tight">{m.email === user?.email ? 'You' : m.email?.split('@')[0]}</p>
                                    {m.role === 'owner' && (
                                        <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[8px] font-black text-cyan-400 uppercase tracking-[0.1em]">Owner</span>
                                    )}
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{m.is_online ? 'Active Now' : 'Offline'}</p>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setInviting(true)}
                        className="w-full py-3 rounded-xl border border-dashed border-white/10 text-[11px] font-black text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all uppercase tracking-widest mt-2 flex items-center justify-center gap-2 group"
                    >
                        <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
                        Invite member
                    </button>

                    <AnimatePresence>
                        {inviting && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setInviting(false)}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[340px] bg-[#0D1117] border border-white/10 rounded-2xl p-6 shadow-[0_32px_64px_rgba(0,0,0,0.8)] z-[101]"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-[13px] font-black text-white uppercase tracking-widest">Invite Member</h3>
                                    </div>

                                    <form onSubmit={handleInvite} className="space-y-5">
                                        <div className="space-y-1.5">
                                            <input
                                                autoFocus
                                                value={inviteEmail}
                                                onChange={e => setInviteEmail(e.target.value)}
                                                placeholder="teammate@company.com"
                                                type="email"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-medium"
                                                required
                                            />
                                        </div>

                                        {inviteMsg && (
                                            <p className={clsx(
                                                "text-[10px] font-bold px-3 py-2 rounded-lg",
                                                inviteMsg.toLowerCase().includes("fail") || inviteMsg.toLowerCase().includes("error") ? "bg-rose-500/10 text-rose-400" : "bg-cyan-500/10 text-cyan-400"
                                            )}>
                                                {inviteMsg}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setInviting(false)}
                                                className="flex-1 h-[40px] rounded-xl bg-white/5 hover:bg-white/10 text-white text-[12px] font-black uppercase tracking-widest transition-colors flex items-center justify-center"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isInviting || !inviteEmail}
                                                className="flex-1 h-[40px] rounded-xl bg-cyan-500 text-black text-[12px] font-black uppercase tracking-widest hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
                                            >
                                                {isInviting ? "..." : "Add"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {(myRole === "host" || myRole === "owner") && pending.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/[0.05]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Pending Approval</p>
                        {pending.map(p => (
                            <div key={p.user_id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.02] mb-2">
                                <span className="text-[11px] font-bold text-slate-300 truncate">{p.email}</span>
                                <div className="flex gap-1.5">
                                    <button onClick={() => handleApprove(p.request_id)} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"><CheckCircle className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleReject(p.request_id)} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><XCircle className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* TAGS (Picture 2 style) */}
            <div className="bg-surface border border-white/[0.05] rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5" />
                        Tags
                    </span>
                    <button onClick={() => setAddingTag(!addingTag)} className="text-slate-600 hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
                <AnimatePresence>
                    {addingTag && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!newTag.trim()) return;
                                try {
                                    await apiCreateTag(contextId, newTag.trim());
                                    setNewTag(""); setAddingTag(false);
                                    onMemberAction?.();
                                } catch (e) { alert(e.message); }
                            }}
                            className="mb-3 overflow-hidden"
                        >
                            <input autoFocus value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="New tag name..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-cyan-500/50" />
                        </motion.form>
                    )}
                </AnimatePresence>
                <div className="flex flex-wrap gap-2 pt-2">
                    {tags.length === 0 ? <span className="text-[10px] text-slate-600 font-bold">No tags yet</span> : tags.map(t => (
                        <span key={t.id} className="px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-default flex items-center gap-1.5">
                            {t.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* ACTIVITY */}
            <div className="bg-surface border border-white/[0.05] rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Activity</span>
                    <div className="flex bg-white/[0.03] p-1 rounded-lg border border-white/5">
                        {["ALL", "TASKS", "NOTES"].map(t => (
                            <button key={t} onClick={() => setFilter(t)} className={clsx("px-2.5 py-1 rounded-md text-[9px] font-black transition-all", filter === t ? "bg-white/10 text-white shadow-sm" : "text-slate-600 hover:text-slate-400")}>{t}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredActivity.map(a => (
                        <div key={a.id} className="flex gap-4 relative group">
                            <div className="shrink-0 pt-1">
                                <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center relative group-hover:border-white/20 transition-all">
                                    <div className={clsx("absolute inset-0 rounded-full opacity-10",
                                        a.type?.includes("NOTE") ? "bg-purple-500" :
                                            a.type?.includes("TASK") ? "bg-emerald-500" : "bg-cyan-500"
                                    )} />
                                    <ActivityIcon type={a.type} />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-black text-slate-600 tracking-widest group-hover:text-slate-400 transition-colors uppercase">{relativeTime(a.created_at)}</span>
                                <p className="text-[11px] font-black text-white leading-relaxed mt-1">{activityLabel(a)}</p>
                            </div>
                        </div>
                    ))}
                    {filteredActivity.length === 0 && <p className="text-[11px] font-bold text-center text-slate-700 py-8 uppercase tracking-widest">No matching activity</p>}
                </div>
            </div>
        </motion.div>
    );
}
