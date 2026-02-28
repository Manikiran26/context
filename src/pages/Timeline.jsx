import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Check, Clock, Calendar, Flag } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Timeline() {
    const { id } = useParams();
    const { contexts } = useApp();
    const currentContext = contexts.find(c => c.id === parseInt(id)) || contexts[0];

    // Create mock heatmap grid (12 cols x 7 rows roughly = 84 days)
    const heatmapCells = useMemo(() => {
        return Array.from({ length: 84 }).map((_, i) => {
            const intensity = Math.random();
            let bg = "bg-slate-800/40";
            if (intensity > 0.8) bg = "bg-primary shadow-[0_0_12px_rgba(6,182,212,0.9)] z-20";
            else if (intensity > 0.6) bg = "bg-primary/70 shadow-[0_0_8px_rgba(6,182,212,0.5)] z-10";
            else if (intensity > 0.4) bg = "bg-primary/40 shadow-[0_0_4px_rgba(6,182,212,0.3)] z-0";
            else if (intensity > 0.2) bg = "bg-primary/20";
            return <div key={i} className={`w-[14px] h-[14px] rounded-[3px] ${bg} transition-all duration-300 hover:scale-125 cursor-pointer`}></div>;
        });
    }, []);

    const timelineItems = useMemo(() => {
        const items = [
            ...(currentContext.tasks || []).map(t => ({ ...t, itemType: 'task' })),
            ...(currentContext.deadlines || []).map(d => ({ ...d, itemType: 'deadline' })),
        ];

        // In a real app we'd sort by date. Here we'll just present them.
        return items;
    }, [currentContext]);

    return (
        <div className="max-w-4xl mx-auto px-10 py-10 pb-32 animate-pop-in">

            {/* Header */}
            <div className="mb-10">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Timeline</h3>
                <h1 className="text-[36px] font-bold text-white tracking-tight leading-tight">{currentContext.name}</h1>
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
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-primary/20"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-primary/40"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-primary/70"></div>
                            <div className="w-[10px] h-[10px] rounded-[2px] bg-primary"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </div>

            {/* Vertical Timeline */}
            <div className="relative">
                <div className="absolute left-[7px] top-6 bottom-8 w-px bg-slate-800 z-0"></div>

                <div className="space-y-6">
                    {timelineItems.length > 0 ? (
                        timelineItems.map((item, idx) => {
                            const isCompleted = item.status === 'completed';
                            const isDeadline = item.itemType === 'deadline';

                            return (
                                <div key={idx} className={`relative z-10 flex gap-6 items-center ${isCompleted ? 'opacity-50' : 'opacity-100'} transition-opacity group`}>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all
                                        ${isCompleted ? 'bg-slate-800 border-2 border-slate-600' :
                                            isDeadline ? 'bg-red-500 border-[3px] border-[#0B0F19] shadow-[0_0_12px_rgba(239,68,68,0.8)]' :
                                                'bg-amber-500 border-[3px] border-[#0B0F19] shadow-[0_0_12px_rgba(245,158,11,0.8)]'}`}>
                                        {isCompleted && <Check className="w-2.5 h-2.5 text-slate-400" />}
                                    </div>

                                    <div className={`flex-1 border rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer hover:-translate-y-0.5
                                        ${isCompleted ? 'border-slate-800/80 bg-slate-900/30' :
                                            isDeadline ? 'border-red-500/30 bg-red-950/10 hover:bg-red-950/20' :
                                                'border-amber-500/30 bg-amber-950/10 hover:bg-amber-950/20'}`}>

                                        <div className="flex items-center gap-4">
                                            <span className={`font-bold text-[16px] ${isCompleted ? 'text-slate-400' : 'text-white'}`}>
                                                {item.title}
                                            </span>
                                            {!isCompleted && !isDeadline && (
                                                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 text-[10px] font-bold tracking-wide">
                                                    In Progress
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase
                                                ${isDeadline ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
                                                    isCompleted ? 'bg-slate-800 border border-slate-700/50 text-slate-400' :
                                                        'bg-amber-900/30 border border-amber-700/50 text-amber-400'}`}>
                                                {item.itemType}
                                            </span>
                                            <span className="text-slate-500 text-xs font-semibold">
                                                {item.date || 'Mar 5'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            No timeline items found for this context.
                        </div>
                    )}

                    {/* Default Kickoff Milestone if emptyish */}
                    <div className="relative z-10 flex gap-6 items-center opacity-50">
                        <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0 mt-1">
                            <Check className="w-2.5 h-2.5 text-slate-400" />
                        </div>
                        <div className="flex-1 border border-slate-800/80 bg-slate-900/30 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-slate-400">
                                <span className="font-medium text-[15px]">Kickoff</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-slate-800/60 rounded-full text-[10px] font-bold tracking-wider text-slate-400">MILESTONE</span>
                                <span className="text-slate-500 text-xs font-semibold">Feb 28</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
