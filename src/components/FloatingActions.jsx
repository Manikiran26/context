import { useState } from "react";
import { Plus, FileText, CheckSquare, Paperclip } from "lucide-react";
import clsx from "clsx";

export default function FloatingActions() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="absolute bottom-8 right-8 z-50 flex flex-col items-end"
        >
            {/* Extended creation items shown on click */}
            <div className={clsx(
                "flex flex-col items-end gap-5 mb-5 origin-bottom transition-all duration-300",
                isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4 pointer-events-none"
            )}>

                <div className="flex items-center gap-4 cursor-pointer group/item">
                    <span className="bg-[#111827] text-slate-300 text-[14px] px-5 py-2.5 rounded-full border border-slate-700/80 shadow-lg font-bold tracking-wide group-hover/item:text-white transition-colors">Note</span>
                    <button className="w-[56px] h-[56px] rounded-[20px] bg-[#111827] border border-slate-700/80 flex items-center justify-center hover:border-purple-500 hover:bg-[#1a2235] transition-all shadow-md group/btn group-hover/item:border-purple-500 group-hover/item:bg-[#1a2235]">
                        <FileText className="w-6 h-6 text-purple-400 group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="flex items-center gap-4 cursor-pointer group/item">
                    <span className="bg-[#111827] text-slate-300 text-[14px] px-5 py-2.5 rounded-full border border-slate-700/80 shadow-lg font-bold tracking-wide group-hover/item:text-white transition-colors">Task</span>
                    <button className="w-[56px] h-[56px] rounded-[20px] bg-[#111827] border border-slate-700/80 flex items-center justify-center hover:border-green-500 hover:bg-[#1a2235] transition-all shadow-md group/btn group-hover/item:border-green-500 group-hover/item:bg-[#1a2235]">
                        <CheckSquare className="w-6 h-6 text-green-400 group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="flex items-center gap-4 cursor-pointer group/item">
                    <span className="bg-[#111827] text-slate-300 text-[14px] px-5 py-2.5 rounded-full border border-slate-700/80 shadow-lg font-bold tracking-wide group-hover/item:text-white transition-colors">File</span>
                    <button className="w-[56px] h-[56px] rounded-[20px] bg-[#111827] border border-slate-700/80 flex items-center justify-center hover:border-pink-500 hover:bg-[#1a2235] transition-all shadow-md group/btn group-hover/item:border-pink-500 group-hover/item:bg-[#1a2235]">
                        <Paperclip className="w-6 h-6 text-pink-400 group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>

            </div>

            {/* Main Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-[72px] h-[72px] rounded-[24px] flex items-center justify-center text-[#0B0F19] transition-all z-10 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-[#06B6D4]/30",
                    isOpen ? "bg-[#08c5e6] shadow-[0_0_40px_rgba(6,182,212,0.7)] scale-105" : "bg-[#06B6D4] hover:bg-[#08c5e6] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)]"
                )}>
                <Plus className={clsx("w-8 h-8 stroke-[3] transition-transform duration-300", isOpen && "rotate-45")} />
            </button>
        </div>
    );
}
