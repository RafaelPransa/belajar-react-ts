// ============================================================================
// MATERI 10: ROUTING HALAMAN DENGAN REACT ROUTER (MULTI-PAGE SPA)
// ============================================================================
// File ini bertindak sebagai "Router Central / Peta Lalu Lintas" aplikasi.
// App.tsx tidak lagi menampung state tampilan secara langsung, melainkan mengatur
// pergantian komponen halaman (pages) berdasarkan URL di browser.
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HomePage, ProjectDetailPage, ProductExplorerPage } from "./pages";


function App() {
  return (
    // 1. TEKNIK: BROWSER ROUTER (ROUTER CONTEXT PROVIDER)
    // Membungkus seluruh aplikasi agar fitur HTML5 History API (pushState, replaceState) aktif,
    // memungkinkan perubahan URL di address bar tanpa reload halaman.
    <BrowserRouter>
      {/* 2. TEKNIK: ROUTES CONTAINER */}
      {/* Bertindak sebagai pemilih rute cerdas yang mencocokkan path URL saat ini dengan daftar Route */}
      <Routes>
        {/* 3. TEKNIK: STATIC ROUTE (RUTE BERANDA) */}
        {/* Menampilkan HomePage ketika pengguna mengakses path root "/" */}
        <Route path="/" element={<HomePage />} />

        {/* 4. TEKNIK: DYNAMIC ROUTE DENGAN PARAMETER `:id` */}
        {/* Tanda titik dua (`:id`) adalah placeholder variabel dinamis. */}
        {/* Rute ini menangkap URL seperti "/project/proj-1", "/project/proj-2", dll. */}
        <Route path="/project/:id" element={<ProjectDetailPage />} />

        {/* Rute Mini Project */}
        <Route path="/explorer" element={<ProductExplorerPage />} />

        {/* 5. TEKNIK: WILDCARD / CATCH-ALL ROUTE (404 NOT FOUND) */}
        {/* Tanda bintang (*) menangkap semua alamat URL yang tidak terdaftar di rute sebelumnya. */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
              <h1 className="text-6xl font-extrabold text-indigo-500 mb-2">404</h1>
              <h2 className="text-2xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
              <p className="text-slate-400 text-sm max-w-sm mb-6">
                Alamat URL yang Anda tuju tidak terdaftar atau telah dipindahkan.
              </p>
              {/* Penggunaan komponen <Link> untuk kembali ke halaman utama tanpa reload */}
              <Link to="/" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
                ← Kembali ke Beranda
              </Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;