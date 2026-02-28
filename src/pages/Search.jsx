import { useState, useMemo } from "react";
import { Search as SearchIcon, Command, Clock, Star, FileText, CheckSquare, Paperclip, Calendar } from "lucide-react";
import clsx from "clsx";
import { MOCK_CONTEXTS, RECENT_SEARCHES, PINNED_ITEMS } from "../lib/mockData";

const ICON_MAP = {
    note: FileText,
    task: CheckSquare,
    file: Paperclip,
    deadline: Calendar,
    context: Command
};

export default function Search() {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredResults = useMemo(() => {
        if (!query && activeFilter === "All") return [];

        const results = [];
        MOCK_CONTEXTS.forEach(context => {
            // Search context name
            if (context.name.toLowerCase().includes(query.toLowerCase()) && (activeFilter === "All")) {
                results.push({ ...context, type: "context", contextName: context.name });
            }

            // Search items within context
            const items = [
                ...context.notes.map(n => ({ ...n, contextName: context.name })),
                ...context.tasks.map(t => ({ ...t, contextName: context.name })),
                ...context.files.map(f => ({ ...f, contextName: context.name })),
                ...(context.deadlines || []).map(d => ({ ...d, contextName: context.name }))
            ];

            items.forEach(item => {
                const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
                const matchesFilter = activeFilter === "All" || activeFilter.toLowerCase().includes(item.type.toLowerCase());

                if (matchesQuery && matchesFilter) {
                    results.push(item);
                }
            });
        });

        return results;
    }, [query, activeFilter]);

    const showHistory = !query && activeFilter === "All";

    return (
        <div className="w-full h-full flex flex-col items-center pt-24 px-10 relative overflow-y-auto custom-scrollbar">

            {/* Heavy central background glow behind the search box */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#06B6D4]/10 blur-3xl rounded-full pointer-events-none" />

            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 z-10">Smart Search</h3>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-8 z-10">Search across all contexts</h1>

            {/* Big Search Input */}
            <div className="w-full max-w-3xl relative z-10 mb-8">
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search notes, tasks, files, members, deadlines..."
                    className="w-full bg-[#0B0F19] border border-primary/30 rounded-xl py-4 pl-14 pr-16 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] text-[15px]"
                    autoFocus
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-1">
                    <kbd className="w-6 h-6 flex items-center justify-center bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono text-xs"><Command className="w-3 h-3" /></kbd>
                    <kbd className="w-6 h-6 flex items-center justify-center bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono text-xs">K</kbd>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 z-10 mb-16">
                {["All", "Notes", "Tasks", "Files", "Deadlines"].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={clsx(
                            "px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300",
                            activeFilter === filter
                                ? "bg-transparent border border-primary text-primary shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                                : "bg-transparent border border-slate-700/60 text-slate-500 hover:text-slate-300 hover:border-slate-500 hover:bg-slate-800/30"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Results Area */}
            <div className="w-full max-w-3xl z-10 pb-20">
                {showHistory ? (
                    <div className="grid grid-cols-2 gap-8">
                        {/* Recent */}
                        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <h3 className="text-sm font-semibold text-white">Recent</h3>
                            </div>
                            <div className="flex flex-col">
                                {RECENT_SEARCHES.map(item => (
                                    <div key={item.id} className="py-3 border-b border-border/50 text-[14px] text-slate-300 hover:text-primary cursor-pointer transition-colors px-2 flex items-center gap-3">
                                        <span className="text-[10px] uppercase font-bold text-slate-600 w-10 text-right">{item.type}</span>
                                        {item.title}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pinned */}
                        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500 stroke-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                                <h3 className="text-sm font-semibold text-white">Pinned</h3>
                            </div>
                            <div className="flex flex-col">
                                {PINNED_ITEMS.map(item => (
                                    <div key={item.id} className="py-3 border-b border-border/50 text-[14px] text-slate-300 hover:text-primary cursor-pointer transition-colors px-2 flex items-center gap-3">
                                        <span className="text-[10px] uppercase font-bold text-slate-600 w-10 text-right">{item.type}</span>
                                        {item.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item, idx) => {
                                const Icon = ICON_MAP[item.type] || FileText;
                                return (
                                    <div key={idx} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-surface border border-slate-700 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                                                <Icon className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">{item.title || item.name}</h4>
                                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                                    <span className="capitalize">{item.type}</span>
                                                    <span>·</span>
                                                    <span className="text-slate-400">{item.contextName}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 rounded-md bg-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-20 text-slate-500">
                                No results found for "{query}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
