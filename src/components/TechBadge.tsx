interface TechBadgeProps {
    label: string;
    isHighLighted?: boolean;
}

export function TechBadge({ label, isHighLighted = false }: TechBadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-200 select-none ${
                isHighLighted
                    ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/10 hover:border-indigo-400/70 hover:bg-indigo-500/15"
                    : "bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-600"
            }`}
        >
            {isHighLighted && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400" />
            )}
            {label}
        </span>
    );
}