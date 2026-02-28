import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';

const typeColors = {
    context: "border-primary bg-primary/20 shadow-[0_0_50px_rgba(6,182,212,0.8)]",
    note: "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    task: "border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
    deadline: "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    file: "border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    member: "border-teal-500 bg-teal-500/10 shadow-[0_0_20px_rgba(20,184,166,0.3)]",
};

export default function CustomNode({ data }) {
    const isContext = data.type === 'context';
    const size = isContext ? "w-64 h-64" : "w-28 h-28";

    return (
        <div
            className={clsx(
                "rounded-full border-[3px] flex items-center justify-center p-4 transition-transform duration-300 hover:scale-105 backdrop-blur-md cursor-pointer animate-pop-in",
                size,
                typeColors[data.type] || typeColors.note
            )}
            style={{ animationDelay: `${Math.random() * 0.5}s` }}
        >
            <Handle type="target" position={Position.Top} className="opacity-0" />

            <div className={clsx("text-center font-semibold text-white", isContext ? "text-2xl" : "text-sm")}>
                {data.label}
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
}
