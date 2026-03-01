import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Bell, Check, X } from "lucide-react";
import LeftSidebar from "../components/LeftSidebar";
import { useApp } from "../context/AppContext";
import { cn } from "../lib/utils";

export default function AppLayout() {
    const {
        user, contexts, logout, heartbeat, fetchNotifications,
        notifications, unreadCount, markAsRead, handleRequestAction
    } = useApp();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Heartbeat Polling (30 seconds)
    useEffect(() => {
        if (!user || !user.email) return;
        heartbeat(); // Initial call
        const interval = setInterval(heartbeat, 30000);
        return () => clearInterval(interval);
    }, [user?.email]);

    // Notifications Polling (20 seconds)
    useEffect(() => {
        if (!user || !user.email) return;
        fetchNotifications(); // Initial call
        const interval = setInterval(fetchNotifications, 20000);
        return () => clearInterval(interval);
    }, [user?.email]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const initials = user?.username ? user.username.charAt(0).toUpperCase() : "U";

    return (
        <div className="flex bg-background min-h-screen text-slate-200 overflow-hidden font-sans">
            {/* Subtle radial gradient background animation */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--color-accent-context)_rgba(6,182,212,0.15),_transparent_50%)]" />

            {/* Fixed Sidebar */}
            <div className="z-20 h-full shrink-0">
                <LeftSidebar />
            </div>

            {/* Main Content Area - standardizes spacing */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">

                {/* Global Top Header / Profile Actions */}
                <header className="h-[80px] shrink-0 flex items-center justify-end px-8 border-b border-white/10 relative z-50 gap-4">

                    {/* Notification Bell */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all relative"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-[#05070A] text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-[#05070A]">
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-3 w-80 bg-surface border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                                    >
                                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500 text-[#05070A]/10 px-2 py-0.5 rounded-full">
                                                    {unreadCount} New
                                                </span>
                                            )}
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <p className="text-slate-500 text-sm font-medium">All caught up!</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        className={cn(
                                                            "p-4 border-b border-white/10 transition-colors cursor-default",
                                                            !notif.isRead ? "bg-white/[0.02]" : "opacity-60"
                                                        )}
                                                        onClick={() => !notif.isRead && markAsRead(notif.id)}
                                                    >
                                                        <p className="text-sm text-slate-200 font-medium leading-relaxed">
                                                            {notif.message}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-3">
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                                                {new Date(notif.createdAt).toLocaleDateString()}
                                                            </span>
                                                            {!notif.isRead && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                                            )}
                                                        </div>

                                                        {/* Actions for Member Requests */}
                                                        {notif.type === 'member_request' && !notif.isRead && (
                                                            <div className="flex gap-2 mt-4">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRequestAction(notif.relatedRequestId, notif.id, 'approve');
                                                                    }}
                                                                    className="flex-1 bg-cyan-500 text-[#05070A] text-[11px] font-black py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-cyan-500 text-[#05070A] transition-all shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                                                                >
                                                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRequestAction(notif.relatedRequestId, notif.id, 'reject');
                                                                    }}
                                                                    className="flex-1 bg-white/5 border border-white/10 text-slate-400 text-[11px] font-black py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-white/10 hover:text-white transition-all"
                                                                >
                                                                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3.5 hover:bg-white/[0.04] p-2 pr-4 rounded-full transition-all border border-transparent hover:border-white/10 group"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#05070A] border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all uppercase">
                                {initials}
                            </div>
                            <div className="text-left hidden sm:block">
                                <div className="text-[14px] font-black text-white leading-tight">
                                    {user?.username || 'user'}
                                </div>
                                <div className="text-[11px] font-bold text-slate-500 mt-0.5">Pro · {contexts?.length || 0} contexts</div>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {dropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-surface border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                                    >
                                        <div className="p-2 border-b border-white/10 pb-3 mb-1 px-4 pt-4">
                                            <p className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Account</p>
                                            <p className="text-sm font-bold text-slate-400 mt-1 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1.5 pt-0">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500 text-[#05070A]/10 transition-colors text-sm font-bold"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {/* Reusable container width strictly defined here */}
                    <div className="max-w-7xl mx-auto px-6 w-full h-full pt-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
