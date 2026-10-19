// 1. PENGGUNAAN DISCRIMINATED UNION (Tagged Union)
// Menggunakan properti penanda `type` sebagai "discriminant" (pembeda).
// Setiap varian memiliki properti unik (contoh: actionText hanya di 'success', errorCode hanya di 'error').
// Manfaat: TypeScript akan otomatis mempersempit tipe (type narrowing) saat pengecekan kondisi.
export type BannerNotification =
    | { type: "info"; message: string }
    | { type: "success"; message: string; actionText?: string; onAction?: () => void }
    | { type: "error"; message: string; errorCode?: number };