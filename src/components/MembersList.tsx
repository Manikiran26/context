import { Plus } from "lucide-react";

export default function MembersList({ members }) {
    // Mock members if not provided
    const mockMembers = members || [
        { id: 1, name: "Sarah Chen", initials: "SC", color: "bg-cyan-500/20 text-cyan-400", role: "Owner", active: true },
        { id: 2, name: "Alex Kim", initials: "AK", color: "bg-amber-500/20 text-amber-400", role: "Editor", active: true },
        { id: 3, name: "Marcus R.", initials: "MR", color: "bg-emerald-500/20 text-emerald-400", role: "Editor", active: false },
        { id: 4, name: "Jamie T.", initials: "JT", color: "bg-purple-500/20 text-purple-400", role: "Viewer", active: false },
    ];

    return (
        <div className="bg-[#05070A]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-4">Members</h3>

            <div className="space-y-4 mb-5">
                {mockMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${member.color}`}>
                                {member.initials}
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-slate-200 group-hover:text-white transition-colors">{member.name}</p>
                                <p className="text-[11px] font-medium text-slate-500">{member.role}</p>
                            </div>
                        </div>
                        {member.active ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                        ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        )}
                    </div>
                ))}
            </div>

            <button className="w-full py-2.5 rounded-xl border border-dashed border-white/10 text-slate-500 text-[12px] font-bold flex items-center justify-center gap-2 hover:border-white/20 hover:text-slate-300 hover:bg-white/[0.02] transition-all">
                <Plus className="w-3.5 h-3.5" /> Invite member
            </button>
        </div>
    );
}
