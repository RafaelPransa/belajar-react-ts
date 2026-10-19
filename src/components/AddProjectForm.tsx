import { useState, useRef, useEffect } from "react";
import type { ProjectItem } from "./ProjectCard";
import { Button } from "./ui/Button";

// 1. KONTRAK PROPS DENGAN CALLBACK FUNCTION (TypeScript Interface)
// Komponen form menerima callback function `onAddProject` yang bertugas
// mengirim data proyek baru yang telah divalidasi ke komponen parent (App.tsx).
interface AddProjectFormProps {
    onAddProject: (newProject: ProjectItem) => void;
}

// 2. KOMPONEN FUNGSIONAL & PROPS DESTRUCTURING
export function AddProjectForm({ onAddProject }: AddProjectFormProps) {
    // 3. CONTROLLED COMPONENT STATE (useState Hook dengan Generic Type Annotations)
    // React mengontrol nilai setiap input melalui state lokal:
    // - Primitive types: string, boolean.
    // - Union Literal Type: "completed" | "planned" untuk status proyek.
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [techStackInput, setTechStackInput] = useState<string>("");
    const [isFeatured, setIsFeatured] = useState<boolean>(false);
    const [status, setStatus] = useState<"completed" | "planned">("planned");

    // 4. DOM REFERENCE HOOK (useRef & Direct DOM Access)
    // Menyimpan referensi langsung ke elemen DOM `<input>` untuk manipulasi imperatif (fokus kursor)
    // tanpa memicu re-render komponen.
    const titleInputRef = useRef<HTMLInputElement | null>(null);

    // 5. LIFECYCLE EFFECT ON MOUNT (useEffect dengan Empty Dependency Array `[]`)
    // Berjalan tepat 1 kali saat komponen pertama kali di-mount ke layar browser.
    useEffect(() => {
        titleInputRef.current?.focus();
    }, []);

    // 6. FORM SUBMISSION HANDLER & EVENT TYPING (React.FormEvent)
    // Tipe event `React.FormEvent<HTMLFormElement>` menjamin type-safety pada event submit form.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Mencegah perilaku default browser (full-page reload)
        e.preventDefault();

        // Validasi input sederhana
        if (!title.trim() || !description.trim()) {
            alert("Judul dan deskripsi wajib diisi!");
            titleInputRef.current?.focus();
            return;
        }

        // 7. DATA TRANSFORMATION / NORMALIZATION
        // Mengubah string masukan mentah "React, Tailwind, Vite" menjadi array string bersih ["React", "Tailwind", "Vite"]
        const techArray = techStackInput
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech.length > 0);

        // 8. DATA OBJECT CREATION (Type-Safe Entity)
        // Membentuk objek proyek baru sesuai kontrak tipe `ProjectItem`
        const newProject: ProjectItem = {
            id: "proj-" + Date.now().toString(),
            title,
            description,
            techStack: techArray.length > 0 ? techArray : ["General"],
            isFeatured,
            status,
        };

        // 9. CHILD-TO-PARENT COMMUNICATION (Lifting State Up via Callback)
        // Mengirimkan objek proyek baru ke parent (App.tsx)
        onAddProject(newProject);

        // 10. FORM STATE RESETTING
        // Mengembalikan seluruh state input ke nilai awal setelah submit berhasil
        setTitle("");
        setDescription("");
        setTechStackInput("");
        setIsFeatured(false);
        setStatus("planned");

        // Mengembalikan fokus kursor ke input judul secara otomatis
        titleInputRef.current?.focus();
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
                    {/* 11. CONTROLLED TEXT INPUT DENGAN REF */}
                    <input
                        ref={titleInputRef}
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
                    {/* CONTROLLED TEXT INPUT */}
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
                {/* CONTROLLED TEXTAREA INPUT */}
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
                    {/* 12. CONTROLLED CHECKBOX INPUT */}
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="rounded-sm border-slate-700 bg-slate-950 text-indigo-500 focus:ring-0"
                        />
                        <span>⭐ Tandai sebagai Featured</span>
                    </label>

                    {/* 13. CONTROLLED SELECT DROPDOWN DENGAN TYPE ASSERTION */}
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

                {/* 14. SUBMIT BUTTON */}
                <Button type="submit" variant="primary" size="sm">+ Simpan Projek</Button>
            </div>
        </form>
    );
}