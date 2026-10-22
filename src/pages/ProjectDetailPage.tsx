import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, TechBadge } from "../components";
import type { ProjectItem } from "../types";

export function ProjectDetailPage() {
    // ========================================================================
    // 1. TEKNIK: TYPE-SAFE URL PARAMETER EXTRACTION (`useParams`)
    // ========================================================================
    // Mengambil nilai parameter dinamis `:id` dari URL browser (misal: "/project/proj-1").
    // Anotasi generic `<{ id: string }>` menjamin tipe variabel `id` adalah string.
    const { id } = useParams<{ id: string }>();

    // ========================================================================
    // 2. TEKNIK: PROGRAMMATIC NAVIGATION HOOK (`useNavigate`)
    // ========================================================================
    // Memberikan akses ke fungsi `navigate()` untuk berpindah halaman secara imperatif
    // melalui logika JavaScript (misal: saat tombol diklik atau setelah proses selesai).
    const navigate = useNavigate();

    // ========================================================================
    // 3. TEKNIK: DATA RETRIEVAL DENGAN DEFENSIVE TRY-CATCH
    // ========================================================================
    // Mengambil koleksi proyek dari localStorage dan mencocokkan item berdasarkan `id`.
    let project: ProjectItem | undefined;
    try {
        const savedData = localStorage.getItem("portfolio_projects_data");
        const projects: ProjectItem[] = savedData ? JSON.parse(savedData) : [];
        project = projects.find((p) => p.id === id);
    } catch (error) {
        console.error("Gagal membaca data proyek untuk halaman detail:", error);
    }

    // ========================================================================
    // 4. TEKNIK: DEFENSIVE RENDERING & 404 NOT FOUND GUARD CLAUSE
    // ========================================================================
    // Jika `id` di URL tidak cocok dengan data proyek apa pun, hentikan alur render
    // dan tampilkan layar fallback ramah pengguna (mencegah crash/runtime error).
    if (!project) {
        return (
            <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
                <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-xl">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto text-xl font-bold">
                        !
                    </div>
                    <h1 className="text-xl font-bold text-white">Projek Tidak Ditemukan</h1>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        Projek dengan ID <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{id}</code> tidak terdaftar di sistem.
                    </p>
                    {/* Programmatic navigation untuk kembali ke beranda */}
                    <Button variant="primary" size="sm" onClick={() => navigate("/")} className="w-full">
                        Kembali ke Beranda
                    </Button>
                </div>
            </main>
        );
    }

    // Nilai terhitung (Derived State)
    const isCompleted = project.status === "completed";

    // ========================================================================
    // 5. TEKNIK: DETAIL VIEW PRESENTATION
    // ========================================================================
    return (
        <main className="relative min-h-screen bg-slate-950 text-slate-100 px-6 py-12 md:py-16">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

            <div className="relative max-w-2xl mx-auto space-y-8">
                {/* 6. TEKNIK: DECLARATIVE NAVIGATION DENGAN KOMPONEN `<Link>` */}
                {/* Mengarahkan pengguna kembali ke rute root "/" tanpa reload browser */}
                <div>
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
                            ← Kembali ke Showcase
                        </Button>
                    </Link>
                </div>

                {/* Kartu Detail Utama */}
                <article className="p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-6 backdrop-blur-sm">
                    {/* Header Detail: ID, Judul, Featured Badge & Status */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-6">
                        <div>
                            <span className="font-mono text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded-md">
                                ID: {project.id}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 leading-tight">
                                {project.title}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Conditional Rendering untuk Badge Featured */}
                            {project.isFeatured && (
                                <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">
                                    ⭐ Featured
                                </span>
                            )}
                            <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium border ${isCompleted
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                    }`}
                            >
                                {isCompleted ? "● Selesai" : "○ Direncanakan"}
                            </span>
                        </div>
                    </div>

                    {/* Deskripsi Proyek */}
                    <div>
                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Deskripsi Projek
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    {/* Daftar Teknologi (List Rendering dari Komponen Reusable TechBadge) */}
                    <div>
                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Teknologi yang Digunakan
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <TechBadge key={tech} label={tech} isHighLighted={true} />
                            ))}
                        </div>
                    </div>

                    {/* 7. TEKNIK: PROGRAMMATIC NAVIGATION VIA BUTTON EVENT HANDLER */}
                    {/* Memanggil `navigate("/")` saat tombol diklik */}
                    <div className="pt-6 border-t border-slate-800/80 flex justify-end">
                        <Button variant="secondary" size="sm" onClick={() => navigate("/")}>
                            Tutup & Kembali
                        </Button>
                    </div>
                </article>
            </div>
        </main>
    );
}