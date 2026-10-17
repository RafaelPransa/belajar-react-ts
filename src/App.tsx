import './App.css'

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  isFeatured: boolean;
  status: "completed" | "planned";
}

const projects: ProjectItem[] = [
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
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-400">
            Daftar Project
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kumpulan proyek pengembangan perangkat lunak dan eksplorasi teknologi.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-semibold text-lg text-slate-200 leading-snug">
                    {project.title}
                  </h2>
                  {/* Logical AND: Hanya muncul jika featured */}
                  {project.isFeatured && (
                    <span className="shrink-0 text-xs bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded-full font-medium">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div>
                <ul className="flex flex-wrap gap-1.5 mb-4 list-none p-0">
                  {project.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700/50"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>


                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">ID: {project.id}</span>

                  {/* Ternary: Menyesuaikan style status */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-medium ${project.status === "completed"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                      : "bg-sky-950 text-sky-400 border border-sky-800/60"
                      }`}
                  >
                    {project.status === "completed" ? "Selesai" : "Direncanakan"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;