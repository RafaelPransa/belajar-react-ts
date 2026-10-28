// File: src/components/ui/Modal.tsx
import { useEffect, type ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        // 1. Tangani event tombol Escape dengan fallback
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.key === "Esc") {
                onClose();
            }
        };

        // 2. Pasang listener pada document hanya jika modal sedang terbuka
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // Kunci scroll latar belakang
        }

        // 3. Cleanup: Lepas listener saat modal ditutup / unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-white truncate pr-4">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-sm p-1 cursor-pointer transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}