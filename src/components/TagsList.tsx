export default function TagsList({ tags }) {
    // Mock tags if not provided
    const mockTags = tags || ["#hackathon", "#AI", "#2026", "#react", "#typescript", "#graph-db", "#ContextOS"];

    return (
        <div className="bg-[#05070A]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-4">Tags</h3>

            <div className="flex flex-wrap gap-2">
                {mockTags.map((tag, idx) => (
                    <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-slate-400 text-[11px] font-black hover:border-white/20 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
