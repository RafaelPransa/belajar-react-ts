import { useState, useEffect } from "react";
import { getProducts, type Product, getMessageError } from "../services/productService";

// ============================================================================
// 1. TEKNIK: GENERIC DISCRIMINATED UNION (ASYNC UI STATE PATTERN)
// ============================================================================
// Memodelkan status asynchronous menggunakan discriminated union dengan tipe generik `<T>`.
// Manfaat: Mencegah "impossible states" (misal: status loading aktif bersamaan dengan adanya data & pesan error).
// Setiap varian status ("loading" | "error" | "success") memiliki payload data yang relevan dan eksklusif.
type AsyncState<T> =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; data: T };

export function CatalogExplorer() {
    // ============================================================================
    // 2. TEKNIK: REACT HOOK WITH GENERIC TYPE ANNOTATION
    // ============================================================================
    // State lokal diikat ke `AsyncState` dengan tipe data spesifik `Product[]`.
    const [state, setState] = useState<AsyncState<Product[]>>({ status: "loading" });

    // ============================================================================
    // 3. TEKNIK: ASYNC FETCH & SPECIFIC ERROR FILTERING (ABORT ERROR HANDLING)
    // ============================================================================
    const fetchData = (signal?: AbortSignal) => {
        setState({ status: "loading" });

        getProducts(signal)
            .then((products) => {
                // Saat sukses: TypeScript otomatis mengizinkan payload `data`
                setState({ status: "success", data: products });
            })
            .catch((error) => {
                // Filter pembatalan sengaja: Jika request dibatalkan oleh AbortController (misal unmount),
                // abaikan agar tidak mengubah state UI menjadi error.
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }
                setState({ status: "error", message: getMessageError(error) });
            });
    };

    // ============================================================================
    // 4. TEKNIK: LIFECYCLE EFFECT WITH ABORTCONTROLLER CLEANUP
    // ============================================================================
    // Mencegah memory leak dan race condition:
    // Jika user berpindah halaman sebelum request selesai, fungsi cleanup `abort()` akan membatalkan request.
    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);

        // Cleanup function saat komponen di-unmount
        return () => controller.abort();
    }, []);

    return (
        <section className="mt-12 pt-10 border-t border-slate-800/80">
            {/* Header section dengan tombol Refresh */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Katalog Produk Eksternal</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Integrasi REST API publik dari DummyJSON</p>
                </div>

                {/* Tombol refresh dengan state disable dan animasi putar saat loading */}
                <button
                    type="button"
                    onClick={() => fetchData()}
                    disabled={state.status === "loading"}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    <span className={state.status === "loading" ? "animate-spin" : ""}>🔄</span> Refresh Data
                </button>
            </div>

            {/* ======================================================================== */}
            {/* 5. TEKNIK: TYPE-SAFE CONDITIONAL RENDERING (DISCRIMINATED UNION NARROWING) */}
            {/* ======================================================================== */}

            {/* KONDISI 1: LOADING STATE (Skeleton Loading Screen untuk UX Perceived Performance) */}
            {state.status === "loading" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((id) => (
                        <div
                            key={id}
                            className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl animate-pulse flex gap-3 items-center"
                        >
                            <div className="w-16 h-16 bg-slate-800 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-800 rounded-md w-3/4" />
                                <div className="h-3 bg-slate-800/60 rounded-md w-1/3" />
                                <div className="h-3 bg-slate-800/80 rounded-md w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* KONDISI 2: ERROR STATE (Fallback UI dengan Tombol Retry) */}
            {state.status === "error" && (
                <div className="p-6 bg-rose-950/30 border border-rose-900/60 rounded-xl text-center">
                    <p className="text-rose-300 text-sm mb-3">Gagal memuat produk: {state.message}</p>
                    <button
                        type="button"
                        onClick={() => fetchData()}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* KONDISI 3: SUCCESS STATE (Akses Aman ke `state.data` Karena Type Narrowing) */}
            {state.status === "success" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {state.data.map((item) => (
                        <article
                            key={item.id}
                            className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex gap-3.5 hover:border-slate-700 transition-colors"
                        >
                            {/* Optimasi gambar: loading="lazy" */}
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                loading="lazy"
                                className="w-16 h-16 object-cover rounded-lg bg-slate-950 border border-slate-800 shrink-0"
                            />
                            <div className="flex flex-col justify-between overflow-hidden">
                                <div>
                                    <h3 className="font-semibold text-sm text-slate-100 truncate" title={item.title}>
                                        {item.title}
                                    </h3>
                                    <span className="text-[11px] text-indigo-400 font-medium capitalize">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-slate-200 mt-1">
                                    ${item.price.toFixed(2)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}