import { useState, useEffect } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { Zap, PenLine, Network, Clock, Search as SearchIcon, Share, Plus, Bell } from "lucide-react";
import clsx from "clsx";
import { MOCK_CONTEXTS } from "../lib/mockData";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import NotificationsDropdown from "./NotificationsDropdown";

export default function TopNav() {
    const { id } = useParams();
    const location = useLocation();
    const path = location.pathname;
    const { contexts, unreadCount, fetchNotifications } = useApp();
    const [notifOpen, setNotifOpen] = useState(false);

    // Context from real data if available
    const currentContext = contexts.find(c => c.id === parseInt(id)) || { name: "Loading...", score: 0 };

    useEffect(() => {
        fetchNotifications();
        const t = setInterval(fetchNotifications, 10000); // Poll notifications
        return () => clearInterval(t);
    }, [fetchNotifications]);

    return (
        <div className="h-full flex items-center justify-between w-full relative">

            {/* Left: Context Identity */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
                        {currentContext.name}
                    </h1>
                </div>

                {/* Breadcrumb / Active state */}
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm">›</span>
                    <span className="text-slate-400 text-sm capitalize">
                        {path.includes("notes") && "Notes"}
                        {path.includes("graph") && "Graph"}
                        {path.includes("timeline") && "Timeline"}
                        {path.includes("search") && "Search"}
                        {path === "/dashboard" && "Dashboard"}
                    </span>
                    <div className="px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-bold tracking-widest text-primary ml-2 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                        ACTIVE
                    </div>
                </div>
            </div>

            {/* Right: Actions & Segments */}
            <div className="flex items-center gap-6">

                {/* Segmented Controller */}
                {id && (
                    <div className="flex items-center bg-[#0B0F19] border border-border/80 rounded-xl p-1 shadow-inner h-10">
                        {[
                            { id: "notes", icon: PenLine, label: "Notes", to: `/contexts/${id}/notes` },
                            { id: "graph", icon: Network, label: "Graph", to: `/contexts/${id}/graph` },
                            { id: "timeline", icon: Clock, label: "Timeline", to: `/contexts/${id}/timeline` },
                            { id: "search", icon: SearchIcon, label: "Search", to: `/search` },
                        ].map(item => (
                            <NavLink
                                key={item.id}
                                to={item.to}
                                className={({ isActive }) => clsx(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300",
                                    isActive
                                        ? "bg-slate-800/80 text-white shadow-sm border border-slate-700/50"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                                )}
                            >
                                <item.icon className={clsx("w-4 h-4", path.includes(item.id) ? "text-primary" : "")} />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                )}

                {/* Global Context Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications Bell */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setNotifOpen(!notifOpen)}
                            className={clsx(
                                "p-2.5 rounded-xl border transition-all relative overflow-visible",
                                notifOpen ? "bg-white/10 border-white/20 text-white" : "bg-surface border-white/5 text-slate-400 hover:text-white"
                            )}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-[9px] font-black text-black border-2 border-[#0B0F19] animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>
                        <NotificationsDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 border border-slate-700/80 hover:text-white transition-all bg-surface"
                    >
                        Share
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#08c5e6" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-[#0B0F19] bg-primary shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 drop-shadow-md"
                    >
                        <Plus className="w-4 h-4" strokeWidth={3} /> Add
                    </motion.button>
                </div>
            </div>

        </div>
    );
}
