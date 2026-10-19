import { useState, useEffect } from "react";
import "./App.css";
import { ProjectCards, type ProjectItem } from "./components/ProjectCard";
import { AddProjectForm } from "./components/AddProjectForm";
import { NoticeBanner, type BannerNotification } from "./components/NoticeBanner";
import { CatalogExplorer } from "./components/ExternalProducts";

// 1. DATA SEED / DEFAULT DATA (Typed Constant Array)
// Menggunakan array bertipe `ProjectItem[]` sebagai data awal aplikasi.
const initialProjects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Sistem Pemesanan Travel",
    description: "Sistem pemesanan tiket travel berbasis website dengan manajemen jadwal terorganisir.",
    techStack: ["Astro.js", "Tailwind CSS", "JavaScript"],
    isFeatured: true,
    status: "completed",
  },
  {
    id: "proj-2",
    title: "Media Pembelajaran Hemoglobin",
    description: "Website edukasi interaktif mengenai struktur dan fungsi hemoglobin pada tubuh manusia.",
    techStack: ["HTML", "CSS", "JavaScript"],
    isFeatured: true,
    status: "completed",
  },
  {
    id: "proj-3",
    title: "Platform Arsip Puisi",
    description: "Ruang digital untuk menyimpan, mengkategorikan, dan membaca karya puisi kontemporer.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Express.js", "PostgreSQL"],
    isFeatured: false,
    status: "planned",
  },
];

function App() {
  // 2. KELOMPOK STATE & LAZY INITIAL STATE PATTERN (useState Hook)
  // - State `projectList`: Menggunakan fungsi inisialisasi lazy `() => { ... }` agar pembacaan
  //   localStorage hanya dijalankan 1 kali saat komponen di-mount, bukan di setiap re-render.
  const [projectList, setProjectList] = useState<ProjectItem[]>(() => {
    const savedData = localStorage.getItem("portfolio_projects_data");
    if (savedData) {
      try {
        return JSON.parse(savedData) as ProjectItem[];
      } catch {
        console.error("Gagal parse data projects dari localStorage");
        return initialProjects;
      }
    }
    return initialProjects; // Kembalikan nilai default jika localStorage kosong
  });

  // - State `notice`: Nullable State dengan tipe Discriminated Union `BannerNotification | null`
  //   untuk menampilkan banner notifikasi dinamis saat ada aksi tambah/hapus.
  const [notice, setNotice] = useState<BannerNotification | null>(null);

  // 3. KELOMPOK PERHITUNGAN NILAI (Derived State / Computed Values)
  // Menghitung statistik langsung dari state `projectList` tanpa membuat state tambahan
  // guna menghindari inkonsistensi data.
  const completedCount = projectList.filter((p) => p.status === "completed").length;
  const plannedCount = projectList.filter((p) => p.status === "planned").length;

  // 4. KELOMPOK HANDLER / FUNGSI AKSI (Immutable State Update)
  // - Handler penambah proyek secara immutable dengan spread operator `[newProject, ...prevProjects]`
  const handleAddProject = (newProject: ProjectItem) => {
    setProjectList((prevProjects) => [newProject, ...prevProjects]);
    // Memasang banner notifikasi sukses
    setNotice({
      type: "success",
      message: `Projek ${newProject?.title} berhasil ditambahkan!`,
    });
  };

  // - Handler hapus proyek secara immutable menggunakan `Array.prototype.filter`
  const handleDeleteProject = (id: string) => {
    const deletedItem = projectList.find((p) => p.id === id);
    setProjectList((prev) => prev.filter((item) => item.id !== id));

    // Memasang banner notifikasi sukses
    setNotice({
      type: "success",
      message: `Projek ${deletedItem?.title ?? id} berhasil dihapus!`,
    });
  };

  // 5. KELOMPOK EFFECT (Sinkronisasi Side-Effects dengan Dependency Array)
  // - Menyimpan perubahan `projectList` secara otomatis ke Web Storage API (localStorage)
  useEffect(() => {
    localStorage.setItem("portfolio_projects_data", JSON.stringify(projectList));
  }, [projectList]); // Dependency array: hanya jalan ketika `projectList` berubah

  // - Memperbarui judul tab browser (document.title)
  useEffect(() => {
    document.title = `Daftar project ${projectList.length} - Portofolio`;
  }, [projectList]); // Dependency array: sinkron dengan jumlah `projectList`

  // 6. RENDER RETURN JSX (Komposisi Komponen & Callback Passing)
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 px-6 py-12 md:py-16">
      {/* Ambient glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-b from-indigo-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium mb-4 shadow-xs backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Showcase Projek & Eksplorasi
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Daftar Projek
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
            Katalog komponen modular yang dibangun menggunakan React, TypeScript, dan Tailwind CSS.
          </p>

          {/* Quick Stats Bar */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-800/60 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
              <strong className="text-slate-100 font-semibold">{projectList.length}</strong> Total Projek
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <strong className="text-slate-100 font-semibold">{completedCount}</strong> Selesai
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <strong className="text-slate-100 font-semibold">{plannedCount}</strong> Direncanakan
            </span>
          </div>
        </header>

        {/* 7. KOMPONEN NOTIFIKASI DENGAN CONDITIONAL & CALLBACK PROPS */}
        <NoticeBanner notice={notice} onClose={() => setNotice(null)} />

        {/* 8. FORM CONTROLLED DENGAN LIFTING STATE UP CALLBACK */}
        <AddProjectForm onAddProject={handleAddProject} />

        {/* 9. LIST RENDERING DENGAN UNIQUE KEY PROP & EVENT CALLBACK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectList.map((item) => (
            <ProjectCards key={item.id} project={item} onDelete={handleDeleteProject} />
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-slate-100">Produk</h2>
          <CatalogExplorer />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-800/60 text-center text-xs text-slate-500">
          Belajar React & TypeScript • Komponen Modular & Props
        </footer>
      </div>
    </main>
  );
}

export default App;