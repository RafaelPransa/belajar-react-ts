// File: src/pages/ProductExplorerPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import type { Product, SortOption } from "../types";

// Daftar kategori populer DummyJSON
const CATEGORIES = [
    { label: "Semua Kategori", value: "all" },
    { label: "Beauty", value: "beauty" },
    { label: "Fragrances", value: "fragrances" },
    { label: "Furniture", value: "furniture" },
    { label: "Groceries", value: "groceries" },
];

export function ProductExplorerPage() {
    // 1. State Filter & Kontrol
    const [search, setSearch] = useState<string>("");
    const [category, setCategory] = useState<string>("all");
    const [sort, setSort] = useState<SortOption>("default");

    // 2. State untuk Modal Detail Produk (Nullable State)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // 3. Panggil Custom Hook useProducts
    const { products, isLoading, errorMessage, refresh } = useProducts({
        searchQuery: search,
        selectedCategory: category,
        sortBy: sort,
    });

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Navigasi Atas */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            ← Kembali ke Portofolio
                        </Button>
                    </Link>

                    <Button variant="secondary" size="sm" onClick={refresh} isLoading={isLoading}>
                        🔄 Refresh Data
                    </Button>
                </div>

                {/* Header & Filter Controls Bar */}
                <header className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-indigo-400">
                            Product Explorer
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Katalog e-commerce interaktif dengan fitur Debounced Search, Kategori, Sorting, dan Modal Spesifikasi.
                        </p>
                    </div>

                    {/* Bar Kontrol 3 Kolom */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                        {/* Input Pencarian */}
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari produk..."
                                className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Filter Dropdown Kategori */}
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setSearch(""); // Reset search jika kategori diganti
                            }}
                            className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>

                        {/* Dropdown Sorting Harga */}
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortOption)}
                            className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="default">Urutan Default</option>
                            <option value="price-asc">Harga: Rendah ke Tinggi</option>
                            <option value="price-desc">Harga: Tinggi ke Rendah</option>
                        </select>
                    </div>
                </header>

                {/* Indikator Status & Error */}
                {isLoading && (
                    <p className="text-xs text-indigo-400 animate-pulse">
                        🔍 Sedang menyinkronkan data katalog...
                    </p>
                )}

                {errorMessage && (
                    <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-xs">
                        {errorMessage}
                    </div>
                )}

                {/* Grid Katalog Produk */}
                <section>
                    <div className="flex justify-between items-center mb-4 text-xs text-slate-400">
                        <span>Ditemukan: <strong>{products.length}</strong> produk</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {products.map((item) => (
                            <article
                                key={item.id}
                                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 hover:shadow-lg transition-all duration-200"
                            >
                                <div>
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        loading="lazy"
                                        className="w-full h-40 object-cover rounded-xl bg-slate-950 mb-3 border border-slate-800/80"
                                    />
                                    <span className="text-[10px] text-indigo-400 uppercase font-semibold">
                                        {item.category}
                                    </span>
                                    <h2 className="font-semibold text-sm text-slate-100 line-clamp-1 mt-0.5">
                                        {item.title}
                                    </h2>
                                    <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-bold text-slate-100">${item.price.toFixed(2)}</span>
                                        <span className="text-amber-400 text-[11px] block">★ {item.rating}</span>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setSelectedProduct(item)}
                                    >
                                        Detail
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {!isLoading && products.length === 0 && (
                        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                            Tidak ada produk yang cocok dengan kriteria pencarian / filter ini.
                        </div>
                    )}
                </section>

                {/* Modal Pop-up Detail Produk */}
                <Modal
                    isOpen={selectedProduct !== null}
                    onClose={() => setSelectedProduct(null)}
                    title={selectedProduct?.title ?? "Detail Produk"}
                >
                    {selectedProduct && (
                        <div className="space-y-4">
                            <img
                                src={selectedProduct.thumbnail}
                                alt={selectedProduct.title}
                                className="w-full h-48 object-cover rounded-xl bg-slate-950 border border-slate-800"
                            />

                            <div className="flex items-center justify-between text-xs">
                                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase font-semibold text-[10px]">
                                    {selectedProduct.category}
                                </span>
                                <span className="text-amber-400 font-medium">
                                    Rating: ★ {selectedProduct.rating} / 5
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase mb-1">
                                    Deskripsi Lengkap
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {selectedProduct.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-slate-400 block">Harga Satuan</span>
                                    <span className="text-xl font-extrabold text-emerald-400">
                                        ${selectedProduct.price.toFixed(2)}
                                    </span>
                                </div>

                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        alert(`Produk "${selectedProduct.title}" berhasil dimasukkan ke keranjang belanja!`);
                                        setSelectedProduct(null);
                                    }}
                                >
                                    + Tambah ke Keranjang
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </main>
    );
}