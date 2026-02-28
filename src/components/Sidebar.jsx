import { NavLink } from "react-router-dom";
import { Zap, LayoutDashboard, Search, Network, Clock, Plus } from "lucide-react";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/search", label: "Search", icon: Search },
    { path: "/graph", label: "Graph View", icon: Network },
    { path: "/timeline", label: "Timeline", icon: Clock },
];

export default function Sidebar() {
    return (
        <div className="w-64 h-full glass-panel border-y-0 border-l-0 border-r flex flex-col relative z-20">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mr-3 shadow-[0_0_12px_rgba(0,212,255,0.4)]">
                    <Zap className="w-4 h-4 text-white" fill="currentColor" />
                </div>
                <span className="font-bold text-lg tracking-tight">ContextOS</span>
            </div>

            {/* New Context */}
            <div className="p-4">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-surfaceHover/50 transition-all active:scale-[0.98]">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">New Context</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative group",
                            isActive
                                ? "text-white bg-primary/10 border border-primary/20 shadow-[0_0_12px_rgba(0,212,255,0.15)]"
                                : "text-slate-400 hover:text-white hover:bg-surfaceHover border border-transparent"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer User */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surfaceHover border border-slate-700 flex justify-center items-center text-xs font-bold text-white shadow-inner">
                        MX
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Max Engineer</span>
                        <span className="text-[10px] text-green-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
