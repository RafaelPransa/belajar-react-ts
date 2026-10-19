import type { ButtonHTMLAttributes, ReactNode } from "react";

// ============================================================================
// 1. TEKNIK: STRING LITERAL UNION TYPE (DESIGN SYSTEM TOKENS)
// ============================================================================
// Membatasi pilihan varian visual dan ukuran tombol hanya pada token desain yang valid.
export type ButtonVariants = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

// ============================================================================
// 2. TEKNIK: COMPONENT PROPS EXTENSION (INHERITANCE DARI NATIVE HTML ATTRIBUTES)
// ============================================================================
// Meng-extend `ButtonHTMLAttributes<HTMLButtonElement>`:
// - Mewarisi semua atribut bawaan elemen HTML `<button>` (misal: `type`, `onClick`, `id`, `aria-*`, dll.)
//   tanpa perlu mendeklarasikannya satu per satu secara manual.
// - Menambahkan prop kustom: `variant`, `size`, dan `isLoading`.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode; // Mendukung teks, icon, atau elemen JSX apa pun
    variant?: ButtonVariants;
    size?: ButtonSize;
    isLoading?: boolean;
}

// ============================================================================
// 3. TEKNIK: DEFAULT PARAMETERS & REST PROPS SPREADING
// ============================================================================
// Menetapkan nilai default parameter untuk prop opsional (`variant = "primary"`, dll.).
// Menggunakan `...restProps` untuk meneruskan sisa atribut native HTML ke tag `<button>`.
export function Button({
    children,
    variant = "primary",
    size = "sm",
    isLoading = false,
    disabled,
    className = "",
    ...restProps
}: ButtonProps) {
    // 4. TEKNIK: BASE STYLES & INTERACTION STATES
    // Kelas Tailwind CSS dasar yang selalu diaplikasikan (layout, cursor, transisi, fokus aksesibilitas).
    const baseStyles =
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

    // 5. TEKNIK: LOOKUP TABLE / OBJECT DICTIONARY DENGAN UTILITY TYPE `Record<K, V>`
    // Memastikan keharusan (exhaustiveness check) bahwa setiap varian dari `ButtonVariants` memiliki definisi style.
    const variantStyles: Record<ButtonVariants, string> = {
        primary:
            "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm focus-visible:ring-indigo-500 active:scale-[0.98]",
        secondary:
            "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 focus-visible:ring-slate-400 active:scale-[0.98]",
        danger:
            "bg-rose-600 hover:bg-rose-500 text-white shadow-sm focus-visible:ring-rose-500 active:scale-[0.98]",
        ghost:
            "bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 focus-visible:ring-slate-500",
    };

    // Dictionary untuk ukuran padding, ukuran font, dan gap ikon
    const sizeStyles: Record<ButtonSize, string> = {
        sm: "px-2.5 py-1.5 text-xs gap-1.5",
        md: "px-4 py-2 text-sm gap-2",
        lg: "px-6 py-3 text-base gap-2.5",
    };

    return (
        // 6. TEKNIK: ATTRIBUTE COMPUTATION & ACCESSIBILITY GUARD
        // Tombol otomatis di-disable jika prop `disabled` bernilai true ATAU sedang `isLoading`.
        <button
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...restProps}
        >
            {/* 7. TEKNIK: CONDITIONAL SPINNER FOR ASYNC FEEDBACK */}
            {isLoading && (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            {children}
        </button>
    );
}