import { Bold, Italic, Underline, Code, Heading1, Heading2, Link as LinkIcon, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function EditorToolbar({ onAddBlock }) {
    return (
        <div className="flex items-center justify-between border border-white/10 rounded-2xl px-4 py-2 bg-white/5 mb-6">
            <div className="flex items-center gap-3">
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Bold className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Italic className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Underline className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Code className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Heading1 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Heading2 className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <LineIcon className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <LinkIcon className="w-4 h-4" />
                </button>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAddBlock}
                className="bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-bold border border-cyan-500/10"
            >
                + Add Block
            </motion.button>
        </div>
    );
}

function LineIcon(props) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    )
}
