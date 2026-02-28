import { CheckSquare, FileText, Paperclip } from "lucide-react";

export default function RightSidebar() {
    return (
        <div className="p-6 flex flex-col gap-8 h-full">
            {/* Intelligence Score */}
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Context Intelligence</h3>
                <div className="flex items-center gap-4 mb-6">
                    {/* Radial Progress Ring */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="32" cy="32" r="28" className="stroke-slate-800 fill-none" strokeWidth="4" />
                            <circle cx="32" cy="32" r="28" className="stroke-primary fill-none line-cap-round" strokeWidth="4" strokeDasharray="175" strokeDashoffset="22" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
                        </svg>
                        <span className="absolute text-lg font-bold text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">87</span>
                    </div>
                    <div>
                        <div className="text-white font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Excellent</div>
                        <div className="text-xs text-slate-400 mt-0.5">Context is well-organized</div>
                    </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium text-slate-300">
                            <span>Completeness</span><span className="text-primary">92%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)]" style={{ width: '92%' }}></div>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium text-slate-300">
                            <span>Connections</span><span className="text-[#0ea5e9]">75%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#0ea5e9] rounded-full" style={{ width: '75%' }}></div>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium text-slate-300">
                            <span>Freshness</span><span className="text-amber-500">79%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '79%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-border/40"></div>

            {/* Members */}
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Members</h3>
                <div className="flex flex-col gap-4">
                    {[
                        { in: "SC", name: "Sarah Chen", role: "Owner", color: "bg-teal-500", on: true },
                        { in: "AK", name: "Alex Kim", role: "Editor", color: "bg-amber-600", on: true },
                        { in: "MR", name: "Marcus R.", role: "Editor", color: "bg-[#0ea5e9]", on: false },
                        { in: "JT", name: "Jamie T.", role: "Viewer", color: "bg-purple-600", on: false },
                    ].map(m => (
                        <div key={m.in} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center text-[11px] font-bold text-white shadow-sm ring-2 ring-background`}>
                                    {m.in}
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-slate-200 group-hover:text-white transition-colors">{m.name}</div>
                                    <div className="text-[11px] text-slate-500">{m.role}</div>
                                </div>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full ${m.on ? 'bg-green-500 shadow-[0_0_5px_#22C55E]' : 'bg-slate-700'}`}></div>
                        </div>
                    ))}
                    <button className="mt-2 w-full py-2.5 rounded-xl border border-dashed border-slate-600 text-xs font-medium text-slate-400 hover:text-slate-200 hover:border-slate-500 hover:bg-slate-800/30 transition-all">
                        + Invite member
                    </button>
                </div>
            </div>

            <div className="h-px bg-border/40"></div>

            {/* Tags */}
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {["#hackathon", "#AI", "#2026", "#react", "#typescript", "#graph-db", "#ContextOS"].map(tag => (
                        <span key={tag} className="px-2.5 py-1 text-[11px] font-medium text-slate-400 bg-slate-800/60 border border-slate-700/60 rounded-full hover:bg-slate-700 hover:text-white cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="h-px bg-border/40"></div>

            {/* Activity Timeline Mini */}
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex justify-between items-center">
                    Activity <span className="text-primary cursor-pointer hover:underline text-[9px]">View all</span>
                </h3>

                <div className="flex flex-col gap-0 relative">
                    <div className="absolute left-[3px] top-2 bottom-2 w-px bg-slate-800 z-0"></div>

                    <div className="relative z-10 flex flex-row items-start justify-between mb-5 group cursor-pointer">
                        <div className="flex gap-3 flex-1">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shadow-[0_0_8px_rgba(168,85,247,0.8)] shrink-0"></div>
                            <div>
                                <p className="text-[12px] text-slate-300 leading-snug"><span className="text-white font-medium">You</span> Added note <br /> <span className="text-purple-400 group-hover:underline">Architecture Decision Record</span></p>
                                <p className="text-[10px] text-slate-500 mt-0.5">2m ago</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-row items-start justify-between mb-5 group cursor-pointer">
                        <div className="flex gap-3 flex-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0"></div>
                            <div>
                                <p className="text-[12px] text-slate-300 leading-snug"><span className="text-white font-medium">Alex</span> Completed task <br /> <span className="text-green-400 group-hover:underline line-through opacity-80">Setup CI/CD Pipeline</span></p>
                                <p className="text-[10px] text-slate-500 mt-0.5">14m ago</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-row items-start justify-between mb-5 group cursor-pointer">
                        <div className="flex gap-3 flex-1">
                            <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shadow-[0_0_8px_rgba(236,72,153,0.8)] shrink-0"></div>
                            <div>
                                <p className="text-[12px] text-slate-300 leading-snug"><span className="text-white font-medium">Sarah</span> Uploaded file <br /> <span className="text-pink-400 group-hover:underline">wireframes_v3.fig</span></p>
                                <p className="text-[10px] text-slate-500 mt-0.5">1h ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
