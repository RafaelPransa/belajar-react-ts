export type BannerNotification =
    | { type: "info"; message: string }
    | { type: "success"; message: string; actionText?: string; onAction?: () => void }
    | { type: "error"; message: string; errorCode?: number };

interface NoticeBannerProps {
    notice: BannerNotification | null;
    onClose: () => void;
}

export function NoticeBanner({ notice, onClose }: NoticeBannerProps) {
    if (!notice) return null;

    const styles = {
        info: "bg-sky-950/60 border-sky-800 text-sky-200",
        success: "bg-emerald-950/60 border-emerald-800 text-emerald-200",
        error: "bg-rose-950/60 border-rose-800 text-rose-200",
    };

    return (
        <div className={`p-4 rounded-xl border flex items-center justify-between mb-6 transition-all ${styles[notice.type]}`}>
            <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                    {notice.type === "info" && "Informasi"}
                    {notice.type === "success" && "Berhasil"}
                    {notice.type === "error" && `Error ${notice.errorCode}`}
                </span>
                <span className="text-sm opacity-90">
                    - {notice.message}
                </span>
            </div>

            <button
                onClick={onClose}
                className="text-sm opacity-60 hover:opacity-100 px-2 py-1 cursor-pointer"
            >
                Tutup X
            </button>
        </div>
    );
}