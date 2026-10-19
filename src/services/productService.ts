// ============================================================================
// 1. TEKNIK: CUSTOM ERROR CLASS (OOP & ERASABLE SYNTAX COMPLIANT)
// ============================================================================
// Membuat turunan dari class bawaan `Error` untuk menangani kegagalan HTTP secara spesifik.
// Menggunakan deklarasi field eksplisit `readonly status: number` (bukan parameter property)
// agar mematuhi aturan 'erasableSyntaxOnly' di TypeScript 5.8+.
class HttpError extends Error {
    readonly status: number;

    constructor(status: number, statusText?: string) {
        super(`HTTP error: ${status}${statusText ? ` ${statusText}` : ""}`);
        this.name = "HttpError";
        this.status = status;
    }
}

// ============================================================================
// 2. TEKNIK: SAFE ERROR HANDLING DENGAN TYPE NARROWING (`unknown`)
// ============================================================================
// Di TypeScript modern, error pada blok catch bertipe `unknown` (bukan `any`).
// Fungsi ini menggunakan pengecekan `instanceof Error` secara aman sebelum membaca `.message`.
export function getMessageError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

// ============================================================================
// 3. TEKNIK: DATA TRANSFER OBJECT (DTO) & API CONTRACT INTERFACE
// ============================================================================
// Mendefinisikan blueprint kontrak struktur data yang diharapkan dari REST API DummyJSON.
export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
}

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

// ============================================================================
// 4. TEKNIK: RUNTIME TYPE GUARD / USER-DEFINED TYPE PREDICATE (`data is Product`)
// ============================================================================
// Data dari API eksternal tidak bisa dipercaya begitu saja (untrusted data).
// Type Predicate `data is Product` memvalidasi tipe data secara mendalam saat runtime:
// - Pengecekan objek non-null
// - Pengecekan keberadaan field dengan operator "in"
// - Pengecekan tipe primitif (`typeof`), validitas numerik (`Number.isFinite`), dan string non-empty
function isProduct(data: unknown): data is Product {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    if (
        !("id" in data) ||
        !("title" in data) ||
        !("description" in data) ||
        !("price" in data) ||
        !("category" in data) ||
        !("thumbnail" in data)
    ) {
        return false;
    }

    return (
        typeof data.id === "number" && Number.isFinite(data.id) &&
        typeof data.title === "string" && data.title.trim().length > 0 &&
        typeof data.description === "string" && data.description.trim().length > 0 &&
        typeof data.price === "number" && Number.isFinite(data.price) &&
        typeof data.category === "string" && data.category.trim().length > 0 &&
        typeof data.thumbnail === "string" && data.thumbnail.trim().length > 0
    );
}

// Type Guard untuk memvalidasi struktur respon pagination dan array produk
function isProductResponse(data: unknown): data is ProductResponse {
    if (typeof data !== "object" || data === null) return false;

    if (
        !("products" in data) ||
        !("total" in data) ||
        !("skip" in data) ||
        !("limit" in data)
    ) return false;

    if (!Array.isArray(data.products)) {
        return false;
    }

    // Memvalidasi setiap elemen dalam array harus memenuhi Type Guard `isProduct`
    if (!data.products.every(isProduct)) {
        return false;
    }

    return (
        typeof data.total === "number" && Number.isFinite(data.total) &&
        typeof data.skip === "number" && Number.isFinite(data.skip) &&
        typeof data.limit === "number" && Number.isFinite(data.limit)
    );
}

const URL_API = "https://dummyjson.com/products?limit=4&select=id,title,price,category,thumbnail,description";

// ============================================================================
// 5. TEKNIK: SERVICE LAYER PATTERN DENGAN ABORT SIGNAL (CANCELLABLE FETCH)
// ============================================================================
// Memisahkan logika komunikasi data jaringan dari komponen UI React.
// - Mendukung pembatalan request lewat parameter `signal?: AbortSignal`.
// - Memverifikasi `response.ok` dan melempar `HttpError` kustom jika gagal.
// - Menjamin data yang di-return 100% valid dengan validasi Type Guard sebelum dikembalikan.
export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
    const response = await fetch(URL_API, { signal });

    if (!response.ok) {
        throw new HttpError(response.status, response.statusText);
    }

    const data: unknown = await response.json();

    if (!isProductResponse(data)) {
        throw new Error("Invalid response data");
    }

    return data.products;
}