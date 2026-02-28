import { Bold, Italic, Underline, Code, Heading1, Heading2, Minus, Link as LinkIcon, Plus } from "lucide-react";

export default function ContextNotes() {
    return (
        <div className="max-w-4xl mx-auto px-10 py-8 pb-32">

            {/* Editor Toolbar */}
            <div className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-1.5 flex items-center gap-1 mb-8 shadow-sm">
                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors"><Underline className="w-4 h-4" /></button>
                <div className="w-px h-5 bg-border mx-2"></div>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors"><Code className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors"><Heading1 className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors"><Heading2 className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
                <div className="w-px h-5 bg-border mx-2"></div>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors"><LinkIcon className="w-4 h-4" /></button>

                <div className="flex-1"></div>
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-[13px] font-medium mr-1">
                    <Plus className="w-3.5 h-3.5" /> Add Block
                </button>
            </div>

            {/* Editor Content */}
            <div className="space-y-8 animate-pop-in">

                {/* Title */}
                <div>
                    <h1 className="text-[40px] font-bold text-white tracking-tight leading-tight mb-4 flex items-center gap-3">
                        Hackathon 2026 — Context OS
                    </h1>
                    <p className="text-lg text-slate-400">
                        Building the future of digital memory. Our core thesis: context collapses app silos.
                    </p>
                </div>

                {/* Section 1 */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-pink-500">🎯</span> Core Architecture
                    </h2>
                    <div className="bg-[#0e1620] border border-cyan-900/40 rounded-xl p-5 shadow-[0_4px_20px_rgba(6,182,212,0.05)]">
                        <p className="text-cyan-100 text-base leading-relaxed">
                            We use a graph-based relational model where every piece of information is a node with typed edges connecting them to a context.
                        </p>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-amber-600">📦</span> Tech Stack
                    </h2>
                    <p className="text-slate-400 text-sm font-medium tracking-wide">
                        React · Supabase · pgvector · Claude API · React Flow · Framer Motion
                    </p>

                    <div className="space-y-3 mt-6">
                        <label className="flex items-center gap-4 bg-[#0e1720]/80 border border-green-900/30 rounded-xl px-5 py-4 cursor-pointer hover:bg-[#111c27] transition-colors shadow-sm">
                            <div className="w-5 h-5 rounded flex items-center justify-center bg-green-500 text-white shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-green-500 font-medium line-through">Finish relationship graph view</span>
                        </label>

                        <label className="flex items-center gap-4 bg-[#0e1720]/80 border border-green-900/30 rounded-xl px-5 py-4 cursor-pointer hover:bg-[#111c27] transition-colors shadow-sm">
                            <div className="w-5 h-5 rounded flex items-center justify-center bg-green-500 text-white shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-green-500 font-medium line-through">Implement smart search with semantic matching</span>
                        </label>

                        <label className="flex items-center gap-4 border border-transparent rounded-xl px-5 py-4 cursor-pointer hover:bg-slate-800/30 transition-colors">
                            <div className="w-5 h-5 rounded border-2 border-slate-600 shrink-0"></div>
                            <span className="text-slate-300 font-medium">Build activity heatmap component</span>
                        </label>

                        <label className="flex items-center gap-4 border border-transparent rounded-xl px-5 py-4 cursor-pointer hover:bg-slate-800/30 transition-colors">
                            <div className="w-5 h-5 rounded border-2 border-slate-600 shrink-0"></div>
                            <span className="text-slate-300 font-medium">Add AI context intelligence scorer</span>
                        </label>
                    </div>
                </div>

                <div className="mt-8 pt-4 w-full border border-dashed border-slate-700/80 rounded-xl p-4 text-slate-500 text-sm hover:border-slate-500 hover:text-slate-400 cursor-text transition-colors bg-slate-800/20">
                    + Press to add a new block...
                </div>

            </div>
        </div>
    );
}
