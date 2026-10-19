import { TechBadge } from "../ui/TechBadge";
import { Button } from "../ui/Button";
import type { ProjectItem } from "../../types";

// 2. KONTRAK PROPS KOMPONEN (TypeScript Interface)
// Mendefinisikan data dan fungsi callback yang dibutuhkan oleh kartu proyek:
// - `project`: Objek data bertipe `ProjectItem` (Data passing dari parent).
// - `onDelete`: Optional Callback Function (`(id: string) => void`) untuk meneruskan aksi hapus ke parent.
interface ProjectCardProps {
    project: ProjectItem;
    onDelete?: (id: string) => void;
}

// 3. KOMPONEN FUNGSIONAL & PROPS DESTRUCTURING
// Menerima prop `project` dan `onDelete` dengan tipe `ProjectCardProps`.
export function ProjectCards({ project, onDelete }: ProjectCardProps) {
    // 4. DERIVED STATE / COMPUTED BOOLEAN
    // Menghitung status boolean secara langsung dari properti data tanpa perlu membuat state baru.
    const isCompleted = project.status === "completed";

    return (
        <article className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 backdrop-blur-sm border border-slate-800/80 p-6 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
            {/* Ambient top highlight on hover */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div>
                {/* Header card: Judul & Featured Badge */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h2 className="font-bold text-lg text-slate-100 group-hover:text-indigo-300 transition-colors duration-200 leading-snug">
                        {project.title}
                    </h2>
                    {/* 5. CONDITIONAL RENDERING (Short-Circuit Evaluation `&&`) */}
                    {/* Badge bintang hanya tampil jika `project.isFeatured` bernilai true */}
                    {project.isFeatured && (
                        <span className="inline-flex items-center gap-1 shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-xs">
                            <span className="text-[10px]">⭐</span> Featured
                        </span>
                    )}
                </div>

                {/* Deskripsi Proyek */}
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {project.description}
                </p>
            </div>

            <div>
                {/* 6. LIST RENDERING & PROPS PASSING (Komposisi Komponen Anak) */}
                {/* Menampilkan array string `techStack` menjadi komponen `TechBadge` */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.map((tech) => {
                        const isHighLight =
                            tech.toLowerCase().includes("react") ||
                            tech.toLowerCase().includes("typescript") ||
                            tech.toLowerCase().includes("tailwind css");

                        return (
                            // Penggunaan prop `key` unik untuk rekonsiliasi DOM React
                            <TechBadge key={tech} label={tech} isHighLighted={isHighLight} />
                        );
                    })}
                </div>

                {/* Footer card: ID, Status Badge & Tombol Aksi */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800/70">
                        ID: {project.id}
                    </span>

                    {/* Dynamic Styling berdasarkan kondisi status `isCompleted` */}
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium border ${isCompleted
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                            }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-400 animate-pulse" : "bg-sky-400"
                                }`}
                        />
                        {isCompleted ? "Selesai" : "Direncanakan"}
                    </span>

                    {/* 7. EVENT HANDLING & OPTIONAL CHAINING INVOCATION */}
                    {/* Memanggil callback `onDelete` secara aman menggunakan `?.` bila fungsinya dikirim parent */}
                    <Button type="button" variant="ghost" size="sm" onClick={() => onDelete?.(project.id)}>
                        Delete
                    </Button>
                </div>
            </div>
        </article>
    );
}
