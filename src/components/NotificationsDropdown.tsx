import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, Users, UserPlus, Info } from "lucide-react";
import { useApp } from "../context/AppContext";
import clsx from "clsx";

export default function NotificationsDropdown({ isOpen, onClose }) {
    const { notifications, unreadCount, markAsRead, handleRequestAction } = useApp();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-3 w-80 bg-[#0D1117] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-cyan-500 text-[10px] font-black px-2 py-0.5 rounded-full text-black">
                                    {unreadCount} NEW
                                </span>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <Bell className="w-8 h-8 text-slate-800 mx-auto mb-3" />
                                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">All caught up</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <NotificationItem key={n.id} notification={n} />
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function NotificationItem({ notification: n }: any) {
    const { markAsRead, handleRequestAction } = useApp();
    const isRequest = n.type === 'MEMBER_REQUEST';
    const metadata = n.metadata || {};

    return (
        <div 
            className={clsx(
                "p-4 border-b border-white/5 transition-colors hover:bg-white/[0.02]",
                !n.isRead && "bg-cyan-500/[0.02]"
            )}
            onClick={() => !n.isRead && markAsRead(n.id)}
        >
            <div className="flex gap-3">
                <div className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                    isRequest ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                )}>
                    {isRequest ? <UserPlus className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-slate-300 leading-relaxed">
                        {isRequest ? (
                            <>
                                <span className="font-black text-white">{metadata.actor_email}</span> wants to add <span className="font-black text-white">{metadata.target_email}</span>
                            </>
                        ) : (
                            metadata.message || "New notification"
                        )}
                    </p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">
                        {new Date(n.createdAt).toLocaleDateString()}
                    </p>

                    {isRequest && !n.isRead && (
                        <div className="flex gap-2 mt-3">
                            {/* In actual DB, context_members row ID is needed for approval. 
                                We'll use a trick/fetch to find it if not in metadata, but 
                                ideally metadata should include the membership row ID (membership_id).
                                Since I am the author, I'll update the backend to include membership_id in metadata later.
                                For now, I'll assume we can get it or I'll fix the backend now.
                            */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestAction(metadata.membership_id, n.id, "approve");
                                }}
                                className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                            >
                                <Check className="w-3 h-3" strokeWidth={3} /> Accept
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestAction(metadata.membership_id, n.id, "reject");
                                }}
                                className="flex-1 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-500/20 transition-all flex items-center justify-center gap-1.5"
                            >
                                <X className="w-3 h-3" strokeWidth={3} /> Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
