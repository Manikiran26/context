import { Search as SearchIcon, Command, Clock, Star } from "lucide-react";
import clsx from "clsx";

export default function Search() {
    return (
        <div className="w-full h-full flex flex-col items-center pt-24 px-10 relative overflow-y-auto">

            {/* Heavy central background glow behind the search box */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#06B6D4]/10 blur-3xl rounded-full pointer-events-none" />

            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 z-10">Smart Search</h3>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-8 z-10">Search across all contexts</h1>

            {/* Big Search Input */}
            <div className="w-full max-w-3xl relative z-10 mb-8">
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
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
                {[
                    { label: "All", active: true },
                    { label: "Notes", active: false },
                    { label: "Tasks", active: false },
                    { label: "Files", active: false },
                    { label: "Members", active: false },
                    { label: "Deadlines", active: false }
                ].map(filter => (
                    <button
                        key={filter.label}
                        className={clsx(
                            "px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300",
                            filter.active
                                ? "bg-transparent border border-primary text-primary shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                                : "bg-transparent border border-slate-700/60 text-slate-500 hover:text-slate-300 hover:border-slate-500 hover:bg-slate-800/30"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Results Columns - Empty State Preview */}
            <div className="w-full max-w-3xl grid grid-cols-2 gap-8 z-10">

                {/* Recent */}
                <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <h3 className="text-sm font-semibold text-white">Recent</h3>
                    </div>
                    <div className="flex flex-col">
                        <div className="py-3 border-b border-border/50 text-[14px] text-slate-300 hover:text-primary cursor-pointer transition-colors px-2">
                            Architecture Doc
                        </div>
                        <div className="py-3 border-b border-border/50 text-[14px] text-slate-300 hover:text-primary cursor-pointer transition-colors px-2">
                            Sprint Planning
                        </div>
                        <div className="py-3 text-[14px] text-slate-300 hover:text-primary cursor-pointer transition-colors px-2">
                            Wireframes
                        </div>
                    </div>
                </div>

                {/* Pinned */}
                <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 stroke-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                        <h3 className="text-sm font-semibold text-white">Pinned</h3>
                    </div>
                    <div className="flex flex-col">
                        <div className="py-3 border-b border-border/50 text-[14px] text-slate-300 hover:text-primary cursor-pointer transition-colors px-2">
                            Hackathon 2026
                        </div>
                        <div className="py-3 border-b border-border/50 text-[14px] text-slate-300 hover:text-primary cursor-pointer transition-colors px-2">
                            Series A Pitch
                        </div>
                        <div className="py-3 text-[14px] text-slate-300 hover:text-primary cursor-pointer transition-colors px-2">
                            Roadmap Q2
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
