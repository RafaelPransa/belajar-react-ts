// 1. DATA MODELING / DOMAIN ENTITY TYPE (TypeScript Interface)
// Mendefinisikan blueprint struktur data proyek dalam aplikasi:
// - `id`, `title`, `description`: Tipe primitif string.
// - `techStack`: Array of string (`string[]`) untuk menampung daftar teknologi.
// - `isFeatured`: Boolean flag penanda proyek unggulan.
// - `status`: String Literal Union Type ("completed" | "planned") untuk membatasi status hanya pada 2 opsi valid.
export interface ProjectItem {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    isFeatured: boolean;
    status: "completed" | "planned";
}