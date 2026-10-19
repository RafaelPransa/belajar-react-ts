import type { BannerNotification } from "../../types";

// 2. KONTRAK PROPS (TypeScript Interface)
// Mendefinisikan kontrak komunikasi antara komponen Parent dan Child:
// - `notice`: Union Type dengan Nullable (`BannerNotification | null`) untuk state kondisional.
// - `onClose`: Callback Function Type (`() => void`) untuk meneruskan aksi penutupan ke parent.
interface NoticeBannerProps {
    notice: BannerNotification | null;
    onClose: () => void;
}

// 3. KOMPONEN FUNGSIONAL & PROPS DESTRUCTURING
// Menerima props dengan anotasi tipe `NoticeBannerProps` dan langsung mendestrukturisasinya.
export function NoticeBanner({ notice, onClose }: NoticeBannerProps) {
    // 4. EARLY RETURN PATTERN (Type Guard / Guard Clause)
    // Jika data `notice` bernilai null, langsung hentikan render (return null).
    // Sekaligus berfungsi sebagai Type Guard: setelah baris ini, TypeScript menjamin `notice` bukan null.
    if (!notice) return null;

    // 5. LOOKUP TABLE / OBJECT MAPPING PATTERN
    // Alternatif bersih pengganti switch-case atau if-else panjang.
    // Memetakan nilai discriminant (`notice.type`) langsung ke styling class Tailwind CSS.
    const styles = {
        info: "bg-sky-950/60 border-sky-800 text-sky-200",
        success: "bg-emerald-950/60 border-emerald-800 text-emerald-200",
        error: "bg-rose-950/60 border-rose-800 text-rose-200",
    };

    return (
        <div className={`p-4 rounded-xl border flex items-center justify-between mb-6 transition-all ${styles[notice.type]}`}>
            <div className="flex items-center gap-2">
                {/* 6. TYPE NARROWING & CONDITIONAL RENDERING (Short-Circuit &&) */}
                {/* Berkat Discriminated Union, TypeScript tahu `notice.errorCode` hanya valid di tipe 'error' */}
                <span className="font-semibold text-sm">
                    {notice.type === "info" && "Informasi"}
                    {notice.type === "success" && "Berhasil"}
                    {notice.type === "error" && `Error ${notice.errorCode}`}
                </span>
                <span className="text-sm opacity-90">
                    - {notice.message}
                </span>
            </div>

            {/* 7. EVENT HANDLING (Callback Trigger) */}
            {/* Memanggil fungsi callback `onClose` saat tombol diklik */}
            <button
                onClick={onClose}
                className="text-sm opacity-60 hover:opacity-100 px-2 py-1 cursor-pointer"
            >
                Tutup X
            </button>
        </div>
    );
}