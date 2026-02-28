import { Search, LayoutDashboard, Database, SearchIcon, Plus, Zap, Rocket, BookOpen, Brain, Sparkles } from "lucide-react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useApp } from "../context/AppContext";

const THEME_MAP = {
    "Zap": {
        icon: Zap,
        color: "text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
        shadow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
        activeBorder: "border-amber-500"
    },
    "Rocket": {
        icon: Rocket,
        color: "text-orange-400",
        border: "border-orange-500/30",
        bg: "bg-orange-500/10",
        shadow: "shadow-[0_0_15px_rgba(249,115,22,0.2)]",
        activeBorder: "border-orange-500"
    },
    "BookOpen": {
        icon: BookOpen,
        color: "text-purple-400",
        border: "border-purple-500/30",
        bg: "bg-purple-500/10",
        shadow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]",
        activeBorder: "border-purple-500"
    },
    "Brain": {
        icon: Brain,
        color: "text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]",
        activeBorder: "border-emerald-500"
    },
    "Sparkles": {
        icon: Sparkles,
        color: "text-rose-400",
        border: "border-rose-500/30",
        bg: "bg-rose-500/10",
        shadow: "shadow-[0_0_15px_rgba(244,63,94,0.2)]",
        activeBorder: "border-rose-500"
    }
};

const CircularProgress = ({ score, color, isActive, theme, size = "sm" }) => {
    const radius = size === "lg" ? 28 : 13;
    const strokeWidth = size === "lg" ? 3 : 2.5;
    const center = size === "lg" ? 32 : 18;
    const svgSize = size === "lg" ? 64 : 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className={clsx("relative flex items-center justify-center shrink-0", size === "lg" ? "w-16 h-16" : "w-9 h-9")}>
            <svg className={clsx("-rotate-90 transform", size === "lg" ? "w-16 h-16" : "w-10 h-10")}>
                {/* Track */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-white/5"
                />
                {/* Progress */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    fill="transparent"
                    strokeLinecap="round"
                    className={clsx(
                        "transition-all duration-500",
                        color,
                        isActive && theme.shadow
                    )}
                />
            </svg>
            <span className={clsx(
                "absolute inset-0 flex items-center justify-center font-black transition-colors duration-500",
                size === "lg" ? "text-lg" : "text-[10px]",
                isActive ? color : "text-slate-500 group-hover:text-slate-400"
            )}>
                {score}
            </span>
        </div>
    );
};

export default function LeftSidebar() {
    const { id: activeId } = useParams();
    const navigate = useNavigate();
    const { user, contexts } = useApp();

    return (
        <div className="w-[280px] h-full flex flex-col bg-[#05070A] border-r border-white/5 text-sm font-sans relative z-30">

            {/* Branding */}
            <div className="h-[80px] flex items-center px-6 shrink-0">
                <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        <span className="text-white font-black text-xl">C</span>
                    </div>
                    <span className="font-black text-[17px] tracking-[0.15em] uppercase text-white">Context OS</span>
                </div>
            </div>

            {/* Global Search */}
            <div className="px-5 mb-8 relative">
                <Search className="absolute left-9 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search contexts..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all text-[13px] font-medium"
                />
            </div>

            {/* Main Nav */}
            <div className="px-4 flex flex-col gap-1.5 mb-10">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => clsx(
                        "flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group",
                        isActive ? "bg-white/[0.05] text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-white/10" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                    )}
                >
                    <LayoutDashboard className={clsx("w-5 h-5", activeId ? "text-slate-500" : "text-white")} strokeWidth={1.5} />
                    <span className="font-bold tracking-tight">Dashboard</span>
                </NavLink>
                <NavLink
                    to="/contexts"
                    className={({ isActive }) => clsx(
                        "flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group",
                        isActive ? "bg-white/[0.05] text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-white/10" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                    )}
                >
                    <Database className="w-5 h-5 group-hover:text-slate-300" strokeWidth={1.5} />
                    <span className="font-bold tracking-tight">All Contexts</span>
                </NavLink>
                <NavLink
                    to="/search"
                    className={({ isActive }) => clsx(
                        "flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group",
                        isActive ? "bg-white/[0.05] text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-white/10" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                    )}
                >
                    <SearchIcon className="w-5 h-5 group-hover:text-slate-300" strokeWidth={1.5} />
                    <span className="font-bold tracking-tight">Smart Search</span>
                </NavLink>
            </div>

            {/* Contexts List */}
            <div className="px-7 mb-4 flex items-center justify-between">
                <span className="text-[11px] uppercase font-black tracking-[0.2em] text-slate-600">Contexts</span>
                <div className="h-[1px] flex-1 bg-white/5 ml-4" />
            </div>

            <div className="px-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pb-6">
                <AnimatePresence>
                    {contexts.map((ctx, idx) => {
                        const isActive = parseInt(activeId) === ctx.id || String(activeId) === String(ctx.id);
                        const theme = THEME_MAP[ctx.icon] || THEME_MAP["Zap"];
                        const Icon = theme.icon;
                        const itemCount = ctx.items?.length ?? (ctx.notes.length + ctx.tasks.length + ctx.files.length);

                        return (
                            <motion.div
                                key={ctx.id}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <NavLink
                                    to={`/context/${ctx.id}`}
                                    className={({ isActive: linkActive }) => clsx(
                                        "group relative flex items-center justify-between p-3.5 rounded-[1.25rem] transition-all duration-300 border",
                                        linkActive
                                            ? "bg-white/[0.04] border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                                            : "border-transparent hover:bg-white/[0.02] hover:border-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className={clsx(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                                            theme.bg,
                                            isActive && theme.shadow
                                        )}>
                                            <Icon className={clsx("w-5 h-5", theme.color)} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <div className={clsx(
                                                "font-black text-[14px] leading-tight transition-colors",
                                                isActive ? theme.color : "text-slate-300 group-hover:text-white"
                                            )}>
                                                {ctx.name}
                                            </div>
                                            <div className="text-[11px] font-bold text-slate-600 mt-0.5 tracking-wide">
                                                {itemCount} items · {ctx.members.length} members
                                            </div>
                                        </div>
                                    </div>

                                    <CircularProgress
                                        score={ctx.score}
                                        color={theme.color}
                                        isActive={isActive}
                                        theme={theme}
                                    />
                                </NavLink>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center justify-center gap-2 mx-2 py-4 rounded-2xl border border-white/5 text-[13px] font-bold text-slate-500 hover:text-white hover:bg-white/[0.03] hover:border-white/10 transition-all mt-4"
                >
                    <Plus className="w-4 h-4" /> New Context
                </motion.button>
            </div>

            {/* User Profile Footer */}
            <div className="h-[80px] shrink-0 border-t border-white/5 px-6 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-all">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-lg">
                        {user?.username ? user.username.slice(0, 2).toUpperCase() : "YC"}
                    </div>
                    <div>
                        <div className="text-[14px] font-black text-white leading-tight">{user?.username || "User"}</div>
                        <div className="text-[11px] font-bold text-slate-600 mt-0.5">Pro · {contexts.length} contexts</div>
                    </div>
                </div>
                <div className="w-5 h-5 rounded-lg border border-white/10 flex items-center justify-center text-[10px] text-slate-500 font-black">
                    ⇧
                </div>
            </div>
        </div>
    );
}

export { CircularProgress };
