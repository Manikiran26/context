import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

export default function InviteMemberModal({ isOpen, onClose, contextId, onInviteSuccess }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setStatus(null);
        setMessage("");

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/contexts/${contextId}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, targetRole: 'viewer' })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
                setEmail("");
                if (onInviteSuccess) onInviteSuccess(data);
                // Close after a short delay
                setTimeout(() => {
                    onClose();
                    setStatus(null);
                    setMessage("");
                }, 2000);
            } else {
                setStatus('error');
                setMessage(data.error || "Failed to send invite");
            }
        } catch (err) {
            setStatus('error');
            setMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#05070A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                            <h2 className="text-sm font-black uppercase tracking-widest text-white">Invite Member</h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <p className="text-sm text-slate-400">
                                Enter the email of the person you want to invite to this context.
                            </p>

                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#05070A] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-500"
                                    disabled={loading || status === 'success'}
                                />
                            </div>

                            {/* Status Messages */}
                            <AnimatePresence mode="wait">
                                {status === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-center gap-2 text-cyan-400 text-xs font-bold bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        {message}
                                    </motion.div>
                                )}
                                {status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-center gap-2 text-cyan-400 text-xs font-bold bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {message}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-sm font-bold transition-all"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !email || status === 'success'}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-[#05070A] text-sm font-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Send Invite"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
