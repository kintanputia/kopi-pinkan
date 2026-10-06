import { useStore } from "../store";
import { Icon } from "../components/Icon";


export function SimplePage({ page, onBack }: { page: string; onBack: () => void }) {
  const { daftar } = useStore();
  const aktif = daftar.filter((p) => p.status === "Kemitraan Aktif").length;
  const content: Record<string, { eyebrow: string; title: string; copy: string }> = {
    "Pengajuan Saya": {
      eyebrow: "PROPOSAL #KPN-2705128",
      title: "Pengajuan kemitraanmu",
      copy: "Semua data telah diterima dan sedang ditinjau oleh tim Kopi Pinkan.",
    },
    "Surat Penawaran": {
      eyebrow: "DOKUMEN KEMITRAAN",
      title: "Surat penawaran",
      copy: "Dokumen akan otomatis tersedia setelah pengajuanmu disetujui oleh tim HQ.",
    },
    "Semua Pengajuan": {
      eyebrow: "MANAJEMEN PROPOSAL",
      title: "Semua pengajuan mitra",
      copy: "Telusuri, filter, dan tindak lanjuti seluruh proposal kemitraan Kopi Pinkan.",
    },
    "Mitra Aktif": {
      eyebrow: "JARINGAN KEMITRAAN",
      title: "Mitra aktif",
      copy: "Pantau mitra yang telah menyetujui perjanjian dan memulai operasional.",
    },
    "Pusat Bantuan": {
      eyebrow: "KAMI SIAP MEMBANTU",
      title: "Ada yang ingin ditanyakan?",
      copy: "Hubungi Layanan Mitra kami pada hari Senin–Jumat, pukul 09.00–17.00 WIB.",
    },
  };
  const pageContent = content[page] ?? content["Semua Pengajuan"];
  return (
    <section className="simple-page">
      <button className="back-link" onClick={onBack}>← Kembali ke beranda</button>
      <p className="eyebrow">{pageContent.eyebrow}</p>
      <h1>{pageContent.title}</h1>
      <p>{pageContent.copy}</p>
      <div className="simple-card">
        <div className="simple-icon">
          <Icon name={page === "Pusat Bantuan" ? "phone" : page === "Mitra Aktif" || page === "Surat Penawaran" ? "document" : "file"} size={28} />
        </div>
        <div>
          <strong>{page === "Pusat Bantuan" ? "Dukungan Admin via WhatsApp" : page === "Mitra Aktif" ? `${aktif} mitra aktif` : `${daftar.length} pengajuan tercatat`}</strong>
          <span>{page === "Pusat Bantuan" ? "+62 822 9820 4102" : `Terakhir diperbarui ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}</span>
        </div>
        {page === "Pusat Bantuan" && (
          <button
            onClick={() =>
              window.open(
                "https://wa.me/6282298204102?text=" +
                  encodeURIComponent("Halo Kopi Pinkan, saya ingin bertanya tentang program kemitraan."),
                "_blank",
                "noopener"
              )
            }
          >
            Mulai chat
          </button>
        )}
      </div>
    </section>
  );
}