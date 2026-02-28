import { Search, LayoutDashboard, Database, SearchIcon, Zap, Rocket, BookOpen, Brain, Sparkles, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

const MOCK_CONTEXTS = [
    { id: 1, name: "Hackathon 2026", items: 23, members: 4, score: 87, icon: Zap, color: "text-primary", border: "border-primary/50", ring: "border-primary" },
    { id: 2, name: "Series A Prep", items: 41, members: 2, score: 64, icon: Rocket, color: "text-amber-500", border: "border-amber-500/30", ring: "border-amber-500" },
    { id: 3, name: "Product Roadmap", items: 78, members: 6, score: 91, icon: BookOpen, color: "text-purple-500", border: "border-purple-500/30", ring: "border-purple-500" },
    { id: 4, name: "ML Research", items: 35, members: 3, score: 72, icon: Brain, color: "text-green-500", border: "border-green-500/30", ring: "border-green-500" },
    { id: 5, name: "Brand Refresh", items: 12, members: 2, score: 45, icon: Sparkles, color: "text-pink-500", border: "border-pink-500/30", ring: "border-pink-500" }
];

export default function LeftSidebar() {
    return (
        <div className="w-[260px] h-full flex flex-col bg-surface/50 backdrop-blur-2xl border-r border-border/80 text-sm">

            {/* Branding */}
            <div className="h-[72px] flex items-center px-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <span className="text-primary font-bold text-lg">C</span>
                    </div>
                    <span className="font-semibold text-[15px] tracking-wide text-white">ContextOS</span>
                </div>
            </div>

            {/* Global Search */}
            <div className="px-4 mb-6 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search contexts..."
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2 pl-9 pr-4 text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-xs"
                />
            </div>

            {/* Main Nav */}
            <div className="px-3 flex flex-col gap-1 mb-8">
                <NavLink to="/" className={({ isActive }) => clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors", isActive && "text-slate-100 bg-slate-800/80 font-medium")}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                </NavLink>
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors text-left">
                    <Database className="w-4 h-4" /> All Contexts
                </button>
                <NavLink to="/search" className={({ isActive }) => clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors", isActive && "text-slate-100 bg-slate-800/80 font-medium")}>
                    <SearchIcon className="w-4 h-4" /> Smart Search
                </NavLink>
            </div>

            {/* Contexts List */}
            <div className="px-6 mb-3 flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">Contexts</span>
            </div>

            <div className="px-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pb-4">
                {MOCK_CONTEXTS.map((ctx, i) => {
                    const isActive = i === 0; // First item "Hackathon 2026" active as per screenshot
                    const Icon = ctx.icon;

                    return (
                        <NavLink
                            key={ctx.id}
                            to={`/contexts/${ctx.id}`}
                            className={clsx(
                                "group relative flex items-center justify-between p-3 rounded-xl transition-all duration-300",
                                isActive ? "bg-primary/5 border border-primary/30" : "border border-transparent hover:bg-slate-800/40 hover:border-slate-700/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center bg-surface border", ctx.border)}>
                                    <Icon className={clsx("w-4 h-4", ctx.color)} />
                                </div>
                                <div>
                                    <div className={clsx("font-medium text-[13px] mb-0.5", isActive ? "text-slate-100" : "text-slate-300 group-hover:text-slate-200")}>
                                        {ctx.name}
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        {ctx.items} items · {ctx.members} members
                                    </div>
                                </div>
                            </div>

                            {/* Score Circular Badge */}
                            <div className={clsx(
                                "w-8 h-8 rounded-full border-[2px] flex items-center justify-center text-[10px] font-bold shadow-lg",
                                ctx.ring, isActive ? "text-primary shadow-[0_0_10px_rgba(6,182,212,0.4)]" : "text-slate-300 shadow-none border-t-transparent border-r-transparent opacity-60 group-hover:opacity-100" // Simplified SVG ring approximation with CSS borders for non-active
                            )}>
                                {ctx.score}
                            </div>
                        </NavLink>
                    );
                })}

                <button className="flex items-center gap-2 px-4 py-3 text-[13px] text-slate-500 hover:text-slate-300 transition-colors mt-2">
                    <Plus className="w-4 h-4" /> New Context
                </button>
            </div>

            {/* User Profile Footer */}
            <div className="h-[72px] shrink-0 border-t border-border/50 px-5 flex items-center justify-between hover:bg-slate-800/30 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs">
                        YC
                    </div>
                    <div>
                        <div className="text-[13px] font-medium text-slate-200">YC Founder</div>
                        <div className="text-[11px] text-slate-500">Pro · 5 contexts</div>
                    </div>
                </div>
                <div className="w-4 h-4 rounded border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                    ⇧
                </div>
            </div>
        </div>
    );
}
