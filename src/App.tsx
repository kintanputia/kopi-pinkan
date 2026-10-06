import { useState } from "react";
import { Icon } from "./components/Icon";
import { Sidebar, Logo } from "./components/Sidebar";
import { Dashboard } from "./pages/DashboardAdmin";
import { PartnerDashboard } from "./pages/DashboardPartner";
import { SimplePage } from "./pages/HalamanSederhana";
import { FormPengajuan } from "./pages/FormPengajuan";
import { SuratPenawaran } from "./pages/SuratPenawaran";
import { ToastWhatsApp } from "./components/ToastWhatsApp";
import { useStore } from "./store";
import { MitraAktif } from "./pages/MitraAktif";
import { PengajuanSaya } from "./pages/PengajuanSaya";
import { PanduanDemo } from "./components/PanduanDemo";

function inisial(nama: string) {
  return nama.split(" ").map((k) => k[0]).join("").slice(0, 2).toUpperCase();
}

const notifMitra: Record<string, [string, string]> = {
  "Perlu Ditinjau": ["Proposal berhasil diterima", "Tim kami sedang melakukan peninjauan."],
  "Perlu Diperbarui": ["Proposal perlu diperbarui", "Cek catatan admin di Beranda."],
  "Disetujui": ["Proposal disetujui", "Surat Penawaran sudah tersedia."],
  "Ditolak": ["Proposal ditolak", "Lihat alasannya di Beranda."],
  "Kemitraan Aktif": ["Kemitraan aktif", "Tim distribusi akan segera menghubungimu."],
};

export default function App() {
  const [role, setRole] = useState<"admin" | "partner">("admin");
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [panduanBuka, setPanduanBuka] = useState(true);
  const { resetDemo, daftar, idSaya } = useStore();
  const saya = daftar.find((p) => p.id === idSaya);
  const menunggu = daftar.filter((p) => p.status === "Perlu Ditinjau").length;

  return (
    <div className="app-shell">
      <Sidebar
        active={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
      />
      <main className="main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
            <Icon name="menu" />
          </button>
          <div className="mobile-logo"><Logo /></div>
          <div className="topbar-actions">
            <div className="role-switch" aria-label="Pilih tampilan dashboard">
              <button
                className={role === "admin" ? "active" : ""}
                onClick={() => {
                  setRole("admin");
                  setActivePage("Dashboard");
                }}
              >
                Admin
              </button>
              <button
                className={role === "partner" ? "active" : ""}
                onClick={() => {
                  setRole("partner");
                  setActivePage("Beranda");
                }}
              >
                Mitra
              </button>
            </div>
            <div className="notification-wrap">
              <button
                className="icon-button"
                aria-label="Notifikasi"
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Icon name="bell" size={21} />
                <span />
              </button>
              {notificationsOpen && (
                <div className="notification-popover">
                  <p>NOTIFIKASI TERBARU</p>
                  <strong>
                    {role === "admin"
                      ? `${menunggu} proposal perlu ditinjau`
                      : saya ? notifMitra[saya.status][0] : "Belum ada notifikasi"}
                  </strong>
                  <span>
                    {role === "admin"
                      ? "Buka dashboard untuk menindaklanjuti."
                      : saya ? notifMitra[saya.status][1] : "Ajukan proposal untuk memulai."}
                  </span>
                </div>
              )}
            </div>
            <div className="profile">
              <div className="avatar">{role === "admin" ? "SA" : saya ? inisial(saya.nama) : "?"}</div>
              <div>
                <strong>{role === "admin" ? "Sarah Amelia" : saya?.nama ?? "Belum mengajukan"}</strong>
                <span>
                  {role === "admin"
                    ? "Administrator HQ"
                    : saya?.status === "Kemitraan Aktif" ? "Mitra Aktif" : "Calon Mitra"}
                </span>
              </div>
              <span className="chevron">⌄</span>
            </div>
          </div>
        </header>
        <div className="content">
          {panduanBuka && <PanduanDemo onTutup={() => setPanduanBuka(false)} />}
          {role === "admin" && (activePage === "Dashboard" || activePage === "Semua Pengajuan") ? (
            <Dashboard onNavigate={setActivePage} />
          ) : role === "admin" && activePage === "Mitra Aktif" ? (
            <MitraAktif />
          ) : role === "partner" && activePage === "Beranda" ? (
            <PartnerDashboard onNavigate={setActivePage} />
          ) : role === "partner" && activePage === "Pengajuan Saya" ? (
            <PengajuanSaya onNavigate={setActivePage} />
          ) : role === "partner" && activePage === "Ajukan Proposal" ? (
            <FormPengajuan onSelesai={() => setActivePage("Beranda")} />
          ) : role === "partner" && activePage === "Perbarui Data" ? (
            <FormPengajuan perbarui onSelesai={() => setActivePage("Beranda")} />
          ) : role === "partner" && activePage === "Surat Penawaran" ? (
            <SuratPenawaran onNavigate={setActivePage} />
          ) : (
            <SimplePage page={activePage} onBack={() => setActivePage(role === "admin" ? "Dashboard" : "Beranda")} />
          )}
        </div>
        <footer className="demo-footer">
          {!panduanBuka && (
            <button onClick={() => setPanduanBuka(true)}>Tampilkan Panduan</button>
          )}
          <span>Mode demo · data tersimpan di browser ini</span>
          <button
            onClick={() => {
              if (window.confirm("Kembalikan semua data ke data contoh?")) {
                resetDemo();
                setActivePage(role === "admin" ? "Dashboard" : "Beranda");
              }
            }}
          >
            Reset Data Demo
          </button>
        </footer>
      </main>
      <ToastWhatsApp />
    </div>
  );
}