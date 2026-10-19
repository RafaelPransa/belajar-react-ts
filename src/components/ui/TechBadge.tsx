// 1. KONTRAK PROPS (TypeScript Interface)
// Mendefinisikan struktur data yang diterima komponen anak:
// - `label`: Required string prop (teks teknologi).
// - `isHighLighted`: Optional boolean prop dengan tanda `?` (opsional untuk styling khusus).
interface TechBadgeProps {
    label: string;
    isHighLighted?: boolean;
}

// 2. KOMPONEN FUNGSIONAL DENGAN DEFAULT PARAMETER VALUE & PROPS DESTRUCTURING
// - Menerima props dengan tipe `TechBadgeProps`.
// - Menggunakan nilai bawaan `isHighLighted = false` saat prop ini tidak dikirimkan oleh komponen parent.
export function TechBadge({ label, isHighLighted = false }: TechBadgeProps) {
    return (
        <span
            // 3. DYNAMIC STYLING (Conditional Class Names via Ternary Operator)
            // Memilih kelas Tailwind CSS secara dinamis berdasarkan nilai boolean `isHighLighted`.
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-200 select-none ${isHighLighted
                ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/10 hover:border-indigo-400/70 hover:bg-indigo-500/15"
                : "bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-600"
                }`}
        >
            {/* 4. CONDITIONAL RENDERING (Short-Circuit Evaluation `&&`) */}
            {/* Indikator dot bercahaya hanya dirender jika `isHighLighted` bernilai true */}
            {isHighLighted && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400" />
            )}

            {/* 5. TEXT INTERPOLATION (JSX Expression) */}
            {/* Menampilkan nilai string dari prop `label` */}
            {label}
        </span>
    );
}

