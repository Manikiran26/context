import { Brain, Layers, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="w-full h-full p-10 overflow-y-auto animate-pop-in">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Good morning, YC.</h1>
                        <p className="text-slate-400 text-lg">You have 5 active contexts and 14 upcoming deadlines.</p>
                    </div>
                    <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full cursor-pointer hover:bg-slate-800/80 transition-colors">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">AI Active</span>
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-1"></span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 border-l-4 border-l-primary">
                        <div className="flex items-center gap-3 mb-4">
                            <Layers className="w-5 h-5 text-primary" />
                            <h3 className="text-sm font-medium text-slate-400">Total Contexts</h3>
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">5</div>
                        <div className="text-xs text-green-400 font-medium">+2 this week</div>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-amber-500">
                        <div className="flex items-center gap-3 mb-4">
                            <Brain className="w-5 h-5 text-amber-500" />
                            <h3 className="text-sm font-medium text-slate-400">Average Intelligence Score</h3>
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">71.8</div>
                        <div className="text-xs text-green-400 font-medium">+4 points from last analysis</div>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-red-500">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="w-5 h-5 text-red-500" />
                            <h3 className="text-sm font-medium text-slate-400">Critical Deadlines (7d)</h3>
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">3</div>
                        <div className="text-xs text-red-400 font-medium">Requires immediate attention</div>
                    </div>
                </div>

                {/* Active Contexts Prompt */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Your Priority Contexts</h2>
                    <Link to="/contexts/1" className="text-sm font-medium text-primary hover:text-[#08c5e6] flex items-center gap-1 transition-colors">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Context Widget 1 */}
                    <Link to="/contexts/1" className="glass-card p-6 group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Hackathon 2026</h3>
                                <p className="text-sm text-slate-400">Last updated 2 mins ago</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border border-primary text-primary flex items-center justify-center font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">87</div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-medium text-slate-300"><span className="text-white">12</span> Notes</div>
                            <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-medium text-slate-300"><span className="text-white">6</span> Tasks</div>
                            <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-medium text-slate-300"><span className="text-red-400">2</span> Due soon</div>
                        </div>
                    </Link>

                    {/* Context Widget 2 */}
                    <Link to="/contexts/2" className="glass-card p-6 group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">Series A Prep</h3>
                                <p className="text-sm text-slate-400">Last updated 1 hour ago</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border border-amber-500 text-amber-500 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">64</div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-medium text-slate-300"><span className="text-white">18</span> Notes</div>
                            <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-medium text-slate-300"><span className="text-white">11</span> Tasks</div>
                            <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-medium text-slate-300"><span className="text-amber-400">4</span> In Review</div>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}
