import { useState } from "react";
import type { ProjectItem } from "./ProjectCard";

interface AddProjectFormProps {
    onAddProject: (newProject: ProjectItem) => void;
}

export function AddProjectForm({ onAddProject }: AddProjectFormProps) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [techStackInput, setTechStackInput] = useState<string>("");
    const [isFeatured, setIsFeatured] = useState<boolean>(false);
    const [status, setStatus] = useState<"completed" | "planned">("planned");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validasi sederhana
        if (!title.trim() || !description.trim()) {
            alert("Judul dan deskripsi wajib diisi!");
            return;
        }

        // Ubah string "React, Tailwind, Vite" menjadi array ["React", "Tailwind", "Vite"]
        const techArray = techStackInput
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech.length > 0);

        const newProject: ProjectItem = {
            id: "proj-" + Date.now().toString(),
            title,
            description,
            techStack: techArray.length > 0 ? techArray : ["General"],
            isFeatured,
            status,
        };

        // Kirim data ke parent (App.tsx)
        onAddProject(newProject);

        // Reset formulir
        setTitle("");
        setDescription("");
        setTechStackInput("");
        setIsFeatured(false);
        setStatus("planned");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl mb-10 space-y-4"
        >
            <h2 className="text-lg font-semibold text-white">Tambah Projek Baru</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                        Judul Projek
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Contoh: Aplikasi Monitoring Keuangan"
                        className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-lg text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                        Tech Stack (Pisahkan dengan koma)
                    </label>
                    <input
                        type="text"
                        value={techStackInput}
                        onChange={(e) => setTechStackInput(e.target.value)}
                        placeholder="React, TypeScript, Tailwind"
                        className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-lg text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                    Deskripsi Singkat
                </label>
                <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan fitur utama dari proyek ini..."
                    className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-lg text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-colors resize-none"
                />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-6 text-xs text-slate-300">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="rounded-sm border-slate-700 bg-slate-950 text-indigo-500 focus:ring-0"
                        />
                        <span>⭐ Tandai sebagai Featured</span>
                    </label>

                    <label className="inline-flex items-center gap-2">
                        <span>Status:</span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as "completed" | "planned")}
                            className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-white focus:outline-hidden"
                        >
                            <option value="planned">Direncanakan</option>
                            <option value="completed">Selesai</option>
                        </select>
                    </label>
                </div>

                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                    + Simpan Projek
                </button>
            </div>
        </form>
    );
}