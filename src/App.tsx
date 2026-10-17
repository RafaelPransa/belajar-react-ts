import { useState, useEffect } from "react";
import "./App.css";
import { ProjectCards, type ProjectItem } from "./components/ProjectCard";
import { AddProjectForm } from "./components/AddProjectForm";

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
  // State untuk menyimpan daftar proyek dinamis
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
    return initialProjects; // kembalikan default jika tidak ada data
  });

  // Perhitungan statistik dinamis dari state
  const completedCount = projectList.filter((p) => p.status === "completed").length;
  const plannedCount = projectList.filter((p) => p.status === "planned").length;

  // Handler penambah proyek secara immutable
  const handleAddProject = (newProject: ProjectItem) => {
    setProjectList((prevProjects) => [newProject, ...prevProjects]);
  };

  // useEffect untuk otomatis menyimpan data ke localStorage
  useEffect(() => {
    localStorage.setItem("portfolio_projects_data", JSON.stringify(projectList));
  }, [projectList]); // Wajib masukkan projectList ke dalam dependency array!

  useEffect(() => {
    document.title = `Daftar project ${projectList.length} - Portofolio`;
  }, [projectList]); // Wajib masukkan projectList ke dalam dependency array!

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

        {/* Form Tambah Projek (Controlled Component) */}
        <AddProjectForm onAddProject={handleAddProject} />

        {/* Grid List Komponen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectList.map((item) => (
            <ProjectCards key={item.id} project={item} />
          ))}
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