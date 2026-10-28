// File: src/hooks/useProducts.ts
import { useState, useEffect } from "react";
import type { Product, ProductResponse, SortOption } from "../types";

interface UseProductsParams {
    searchQuery: string;
    selectedCategory: string;
    sortBy: SortOption;
}

interface UseProductsResult {
    products: Product[];
    isLoading: boolean;
    errorMessage: string | null;
    refresh: () => void;
}

export function useProducts({
    searchQuery,
    selectedCategory,
    sortBy,
}: UseProductsParams): UseProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState<number>(0);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchProducts() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                let url = "https://dummyjson.com/products?limit=12";

                // Prioritas 1: Jika user sedang mengetik pencarian
                if (searchQuery.trim().length > 0) {
                    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery.trim())}`;
                }
                // Prioritas 2: Jika kategori spesifik dipilih
                else if (selectedCategory && selectedCategory !== "all") {
                    url = `https://dummyjson.com/products/category/${encodeURIComponent(selectedCategory)}`;
                }

                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Gagal memuat produk (HTTP ${response.status})`);
                }

                const data: ProductResponse = await response.json();
                const resultList = [...data.products];

                // Pengurutan harga di memori (in-memory sorting)
                if (sortBy === "price-asc") {
                    resultList.sort((a, b) => a.price - b.price);
                } else if (sortBy === "price-desc") {
                    resultList.sort((a, b) => b.price - a.price);
                }

                setProducts(resultList);
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === "AbortError") return;
                setErrorMessage(
                    err instanceof Error ? err.message : "Terjadi kesalahan koneksi"
                );
            } finally {
                setIsLoading(false);
            }
        }

        // Debounce 400ms: Hanya fetch jika user berhenti mengetik selama 400ms
        const timer = setTimeout(() => {
            fetchProducts();
        }, 400);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [searchQuery, selectedCategory, sortBy, reloadTrigger]);

    const refresh = () => setReloadTrigger((prev) => prev + 1);

    return { products, isLoading, errorMessage, refresh };
}