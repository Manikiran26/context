import { Check } from "lucide-react";

export default function Timeline() {

    // Create mock heatmap grid (12 cols x 7 rows roughly = 84 days)
    const heatmapCells = Array.from({ length: 84 }).map((_, i) => {
        const intensity = Math.random();
        let bg = "bg-slate-800/40";
        if (intensity > 0.8) bg = "bg-[#06B6D4] shadow-[0_0_12px_rgba(6,182,212,0.9)] z-20";
        else if (intensity > 0.6) bg = "bg-[#0891b2] shadow-[0_0_8px_rgba(8,145,178,0.7)] z-10";
        else if (intensity > 0.4) bg = "bg-[#0e4b5f] shadow-[0_0_4px_rgba(14,75,95,0.4)] z-0";
        else if (intensity > 0.2) bg = "bg-[#0a2f3d]";
        return <div key={i} className={`w-[14px] h-[14px] rounded-[3px] ${bg} transition-all duration-300 hover:scale-125 cursor-pointer`}></div>;
    });

    return (
        <div className="max-w-4xl mx-auto px-10 py-10 pb-32">

            {/* Header */}
            <div className="mb-10">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Timeline</h3>
                <h1 className="text-[36px] font-bold text-white tracking-tight leading-tight">Hackathon 2026</h1>
            </div>

            {/* Heatmap Section */}
            <div className="mb-14">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-3">
                    Activity Heatmap <div className="w-8 h-px bg-slate-700"></div> Last 84 Days
                </div>

                <div className="inline-block relative">
                    <div className="grid grid-cols-[repeat(12,minmax(0,1fr))] gap-1.5 mb-3">
                        {heatmapCells}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                        <span>Less</span>
                        <div className="flex gap-1.5">
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-slate-800/40"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0a2f3d]"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0e4b5f] shadow-[0_0_4px_rgba(14,75,95,0.4)]"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0891b2] shadow-[0_0_8px_rgba(8,145,178,0.7)]"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#06B6D4] shadow-[0_0_12px_rgba(6,182,212,0.9)]"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </div>

            {/* Vertical Timeline */}
            <div className="relative">
                <div className="absolute left-[7px] top-6 bottom-8 w-px bg-slate-800 z-0"></div>

                <div className="space-y-6">

                    {/* Milestone - Past */}
                    <div className="relative z-10 flex gap-6 items-center opacity-50 hover:opacity-100 transition-opacity">
                        <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0 mt-1"></div>
                        <div className="flex-1 border border-slate-800/80 bg-slate-900/30 rounded-2xl p-4 flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Check className="w-4 h-4" />
                                <span className="font-medium text-[15px]">Kickoff</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-slate-800/60 rounded-full text-[10px] font-bold tracking-wider text-slate-400">MILESTONE</span>
                                <span className="text-slate-500 text-xs font-semibold">Feb 28</span>
                            </div>
                        </div>
                    </div>

                    {/* Deadline - Past */}
                    <div className="relative z-10 flex gap-6 items-center opacity-50 hover:opacity-100 transition-opacity">
                        <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0 mt-1"></div>
                        <div className="flex-1 border border-slate-800/80 bg-slate-900/30 rounded-2xl p-4 flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Check className="w-4 h-4" />
                                <span className="font-medium text-[15px]">MVP Demo Ready</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-red-900/10 border border-red-900/30 rounded-full text-[10px] font-bold tracking-wider text-red-500">DEADLINE</span>
                                <span className="text-slate-500 text-xs font-semibold">Mar 1</span>
                            </div>
                        </div>
                    </div>

                    {/* Task - Active */}
                    <div className="relative z-10 flex gap-6 items-center">
                        <div className="w-4 h-4 rounded-full bg-amber-500 border-[3px] border-[#0B0F19] shadow-[0_0_12px_rgba(245,158,11,0.8)] relative flex justify-center items-center shrink-0 mt-1">
                            <div className="absolute w-8 h-8 rounded-full border border-amber-500/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        </div>
                        <div className="flex-1 border border-amber-500/30 bg-amber-950/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_5px_20px_rgba(245,158,11,0.05)] cursor-pointer hover:bg-amber-950/30 hover:-translate-y-0.5 transition-all">
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-[16px] text-white">Design Review</span>
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 text-[10px] font-bold tracking-wide">In Progress</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-amber-900/30 border border-amber-700/50 rounded-full text-[10px] font-bold tracking-wider text-amber-400">TASK</span>
                                <span className="text-slate-300 text-xs font-semibold">Mar 2</span>
                            </div>
                        </div>
                    </div>

                    {/* Deadline - Future */}
                    <div className="relative z-10 flex gap-6 items-center">
                        <div className="w-4 h-4 rounded-full bg-[#0B0F19] border-2 border-red-500 flex items-center justify-center shrink-0 mt-1"></div>
                        <div className="flex-1 border border-slate-700/50 bg-[#111827] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-slate-500/80 transition-all">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-[16px] text-white">Final Submission</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-[10px] font-bold tracking-wider text-red-400">DEADLINE</span>
                                <span className="text-slate-400 text-xs font-semibold">Mar 3</span>
                            </div>
                        </div>
                    </div>

                    {/* Milestone - Future */}
                    <div className="relative z-10 flex gap-6 items-center">
                        <div className="w-4 h-4 rounded-full bg-[#0B0F19] border-2 border-primary flex items-center justify-center shrink-0 mt-1"></div>
                        <div className="flex-1 border border-slate-700/50 bg-[#111827] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-slate-500/80 transition-all">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-[16px] text-white">Judging Day</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-bold tracking-wider text-primary">MILESTONE</span>
                                <span className="text-slate-400 text-xs font-semibold">Mar 5</span>
                            </div>
                        </div>
                    </div>

                    {/* Milestone - Future */}
                    <div className="relative z-10 flex gap-6 items-center">
                        <div className="w-4 h-4 rounded-full bg-[#0B0F19] border-2 border-slate-500 flex items-center justify-center shrink-0 mt-1"></div>
                        <div className="flex-1 border border-slate-700/50 bg-[#111827] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-slate-500/80 transition-all">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-[16px] text-white">Winners Announced</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold tracking-wider text-slate-400 border border-slate-600/50">MILESTONE</span>
                                <span className="text-slate-400 text-xs font-semibold">Mar 8</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
