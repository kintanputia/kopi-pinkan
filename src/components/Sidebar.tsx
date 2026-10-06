import { Icon, type IconName } from "./Icon";
import { useStore } from "../store";

const adminNavItems: { label: string; icon: IconName }[] = [
  { label: "Dashboard", icon: "home" },
  { label: "Semua Pengajuan", icon: "file" },
  { label: "Mitra Aktif", icon: "document" },
];

const partnerNavItems: { label: string; icon: IconName }[] = [
  { label: "Beranda", icon: "home" },
  { label: "Ajukan Proposal", icon: "package" },
  { label: "Pengajuan Saya", icon: "file" },
  { label: "Surat Penawaran", icon: "document" },
  { label: "Pusat Bantuan", icon: "help" },
];

export function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark" aria-hidden="true">
        <span className="brand-cup" />
        <span className="brand-steam steam-one" />
        <span className="brand-steam steam-two" />
      </div>
      <div>
        <strong>KOPI</strong>
        <span>PINKAN</span>
      </div>
    </div>
  );
}

export function Sidebar({
  active,
  onNavigate,
  isOpen,
  onClose,
  role,
}: {
  active: string;
  onNavigate: (label: string) => void;
  isOpen: boolean;
  onClose: () => void;
  role: "admin" | "partner";
}) {
  const { daftar, idSaya } = useStore();
  const saya = daftar.find((p) => p.id === idSaya);
  const perluTinjau = daftar.filter((p) => p.status === "Perlu Ditinjau").length;

  const navItems = role === "admin" ? adminNavItems : partnerNavItems;
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={onClose} aria-label="Tutup menu">
          <Icon name="close" />
        </button>
        <Logo />
        <nav>
          <p className="nav-heading">MENU UTAMA</p>
          {navItems.map((item) => (
            <button
              className={`nav-item ${active === item.label ? "active" : ""}`}
              key={item.label}
              onClick={() => {
                onNavigate(item.label);
                onClose();
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {role === "admin" && item.label === "Semua Pengajuan" && perluTinjau > 0 && (
              <span className="nav-count">{perluTinjau}</span>
              )}
              {role === "partner" && item.label === "Surat Penawaran" && saya?.status === "Disetujui" && (
              <span className="nav-dot" />
              )}
            </button>
          ))}
        </nav>
        {role === "partner" && (
          <div className="sidebar-help">
            <div className="help-spark"><Icon name="sparkle" size={18} /></div>
            <strong>Butuh bantuan?</strong>
            <p>Tim Pinkan siap bantu kamu memulai bisnis.</p>
            <button onClick={() => onNavigate("Pusat Bantuan")}>
              Hubungi kami <Icon name="arrow" size={15} />
            </button>
          </div>
        )}
        <div className="sidebar-footer">
          <span>© 2027 Kopi Pinkan</span>
          <span>Versi 1.0</span>
        </div>
      </aside>
    </>
  );
}