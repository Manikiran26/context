import { FileText, CheckSquare, Paperclip, Plus } from "lucide-react";
import clsx from "clsx";

export default function ActivityFeed({ activities }) {
    // Mock activities if not provided
    const mockActivities = activities || [
        {
            id: 1,
            user: "You",
            action: "Added note",
            target: "Architecture Decision Record",
            time: "2m ago",
            type: "note",
            color: "text-purple-400",
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-400",
            iconBorder: "border-purple-500/20"
        },
        {
            id: 2,
            user: "Alex",
            action: "Completed task",
            target: "Setup CI/CD Pipeline",
            time: "14m ago",
            type: "task",
            color: "text-emerald-400",
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-400",
            iconBorder: "border-emerald-500/20"
        },
        {
            id: 3,
            user: "Sarah",
            action: "Uploaded file",
            target: "wireframes_v3.fig",
            time: "1h ago",
            type: "file",
            color: "text-pink-400",
            iconBg: "bg-pink-500/10",
            iconColor: "text-pink-400",
            iconBorder: "border-pink-500/20"
        },
        {
            id: 4,
            user: "You",
            action: "Set deadline",
            target: "Project Alpha Launch",
            time: "3h ago",
            type: "note",
            color: "text-rose-400",
            iconBg: "bg-rose-500/10",
            iconColor: "text-rose-400",
            iconBorder: "border-rose-500/20",
            hideIcon: true
        }
    ];

    const getIconInfo = (type) => {
        switch (type) {
            case "note":
                return { Icon: FileText, label: "Note" };
            case "task":
                return { Icon: CheckSquare, label: "Task" };
            case "file":
                return { Icon: Paperclip, label: "File" };
            default:
                return { Icon: FileText, label: "Note" };
        }
    };

    return (
        <div className="bg-[#05070A]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Activity</h3>
                <div className="flex gap-2">
                    {['Note', 'Task', 'File'].map((filter, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 hover:text-white cursor-pointer transition-colors">
                            {filter}
                        </span>
                    ))}
                </div>
            </div>

            <div className="relative pl-3 space-y-5 z-10">
                <div className="absolute left-[15px] top-2 bottom-4 w-px bg-white/[0.06]" />

                {mockActivities.map((activity, idx) => {
                    const { Icon, label } = getIconInfo(activity.type);

                    return (
                        <div key={activity.id} className="relative flex gap-4 group">
                            <div className={clsx("absolute -left-1.5 top-1.5 w-2 h-2 rounded-full z-10",
                                activity.color.replace('text', 'bg')
                            )} />

                            <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[13px] leading-tight text-white mb-0.5">
                                        <span className={clsx("font-black", activity.user === "You" ? "text-slate-400" : activity.color)}>
                                            {activity.user}
                                        </span>
                                        {" "}
                                        <span className="text-slate-300 font-medium">
                                            {activity.action}
                                        </span>
                                    </p>
                                    <p className="text-[12px] font-bold text-slate-500 truncate">
                                        {activity.target}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1">
                                        {activity.time}
                                    </p>
                                </div>

                                {!activity.hideIcon && (
                                    <div className={clsx("w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-sm", activity.iconBg, activity.iconBorder)}>
                                        <Icon className={clsx("w-3.5 h-3.5", activity.iconColor)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action FAB */}
            <button className="absolute bottom-5 right-5 w-12 h-12 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#05070A] shadow-[0_8px_32px_rgba(6,182,212,0.4)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20">
                <Plus className="w-6 h-6" strokeWidth={3} />
            </button>
        </div>
    );
}
