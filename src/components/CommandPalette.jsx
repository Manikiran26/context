import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, Network, Clock, Plus } from "lucide-react";

const COMMANDS = [
    { id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
    { id: "search", label: "Search", path: "/search", icon: Search },
    { id: "graph", label: "Graph View", path: "/graph", icon: Network },
    { id: "timeline", label: "Timeline", path: "/timeline", icon: Clock },
    { id: "create", label: "Create Context", path: null, icon: Plus },
];

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (cmd) => {
        if (cmd.path) navigate(cmd.path);
        setOpen(false);
        setQuery("");
    };

    const filtered = COMMANDS.filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-background/60 backdrop-blur-md z-[100] flex items-start justify-center pt-[20vh]"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg glass-panel-heavy rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] border-white/10"
                    >
                        <div className="flex items-center px-4 py-4 border-b border-white/5">
                            <Search className="w-5 h-5 text-slate-400 mr-3" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 text-lg"
                            />
                            <div className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5 ml-2 font-mono uppercase">ESC</div>
                        </div>
                        <div className="p-2 max-h-80 overflow-y-auto">
                            {filtered.map(cmd => (
                                <button
                                    key={cmd.id}
                                    onClick={() => handleSelect(cmd)}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surfaceHover/80 text-left transition-colors text-slate-400 hover:text-white group"
                                >
                                    <cmd.icon className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                                    <span className="font-medium text-sm">{cmd.label}</span>
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <div className="py-6 text-center text-sm text-slate-500">
                                    No results found.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
