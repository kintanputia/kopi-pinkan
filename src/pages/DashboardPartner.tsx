import { Icon, type IconName } from "../components/Icon";
import { useStore } from "../store";
import type { Status } from "../types";

type Keadaan = "done" | "current" | "upcoming" | "failed";

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const judulTahap = ["Proposal Dikirim", "Sedang Ditinjau", "Hasil Pengajuan", "Mulai Kemitraan"];

function buatTahap(status: Status, tanggal: string) {
  const kirim = formatTanggal(tanggal);
  const peta: Record<Status, [Keadaan, string][]> = {
    "Perlu Ditinjau": [
      ["done", kirim],
      ["current", "Estimasi 2–3 hari kerja"],
      ["upcoming", "Menunggu peninjauan"],
      ["upcoming", "Segera hadir!"],
    ],
    "Perlu Diperbarui": [
      ["done", kirim],
      ["current", "Menunggu perbaikan darimu"],
      ["upcoming", "Menunggu peninjauan"],
      ["upcoming", "Segera hadir!"],
    ],
    "Disetujui": [
      ["done", kirim],
      ["done", "Selesai ditinjau"],
      ["current", "Disetujui, terima perjanjian"],
      ["upcoming", "Menunggu persetujuanmu"],
    ],
    "Ditolak": [
      ["done", kirim],
      ["done", "Selesai ditinjau"],
      ["failed", "Proposal ditolak"],
      ["upcoming", "Tidak dilanjutkan"],
    ],
    "Kemitraan Aktif": [
      ["done", kirim],
      ["done", "Selesai ditinjau"],
      ["done", "Disetujui"],
      ["done", "Kemitraan dimulai"],
    ],
  };
  return peta[status].map(([state, tgl], i) => ({ judul: judulTahap[i], tgl, state }));
}

export function PartnerDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { daftar, idSaya } = useStore();
  const saya = daftar.find((p) => p.id === idSaya);

  if (!saya) {
    return (
      <section className="simple-page">
        <p className="eyebrow">DASHBOARD MITRA</p>
        <h1>Selamat datang!</h1>
        <p>Kamu belum mengajukan proposal kemitraan.</p>
        <button className="form-submit" onClick={() => onNavigate("Ajukan Proposal")}>
          Ajukan Proposal
        </button>
      </section>
    );
  }

  const tahap = buatTahap(saya.status, saya.tanggal);
  const selesai = tahap.filter((t) => t.state === "done").length;

  const info: Record<Status, { judul: string; teks: string; ikon: IconName; tombol: string; tujuan: string }> = {
    "Perlu Ditinjau": {
      judul: "Sedang Ditinjau",
      teks: "Tim kami sedang memeriksa proposalmu. Notifikasi akan dikirim via WhatsApp.",
      ikon: "clock",
      tombol: "Lihat detail",
      tujuan: "Pengajuan Saya",
    },
    "Perlu Diperbarui": {
      judul: "Perlu Diperbarui",
      teks: `Catatan admin: ${saya.catatan}`,
      ikon: "document",
      tombol: "Perbarui data",
      tujuan: "Perbarui Data",
    },
    "Disetujui": {
      judul: "Proposal Disetujui",
      teks: "Surat Penawaran sudah tersedia. Baca dan terima perjanjian di dashboard.",
      ikon: "check",
      tombol: "Buka Surat Penawaran",
      tujuan: "Surat Penawaran",
    },
    "Ditolak": {
      judul: "Proposal Ditolak",
      teks: `Alasan: ${saya.catatan}`,
      ikon: "close",
      tombol: "Lihat detail",
      tujuan: "Pengajuan Saya",
    },
    "Kemitraan Aktif": {
      judul: "Kemitraan Aktif",
      teks: "Selamat bergabung! Tim distribusi kami akan segera menghubungimu.",
      ikon: "check",
      tombol: "Lihat detail",
      tujuan: "Pengajuan Saya",
    },
  };
  const s = info[saya.status];

  return (
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">DASHBOARD MITRA</p>
          <h1>Halo, {saya.nama.split(" ")[0]}! <span>♡</span></h1>
          <p className="welcome-copy">Selangkah lebih dekat untuk tumbuh bersama Kopi Pinkan.</p>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <span className="art-star star-one">✦</span>
          <span className="art-star star-two">✦</span>
          <div className="cart">
            <div className="cart-awning"><i /><i /><i /><i /></div>
            <div className="cart-body"><b>kopi<br /><span>pinkan</span></b></div>
            <div className="cart-handle" />
            <div className="wheel left" />
            <div className="wheel right" />
          </div>
        </div>
      </section>

      <section className="status-banner">
        <div className="status-icon"><Icon name={s.ikon} size={24} /></div>
        <div className="status-text">
          <span>STATUS PENGAJUAN</span>
          <div>
            <strong>{s.judul}</strong>
            <span className="status-pill">{saya.status}</span>
          </div>
          <p>{s.teks}</p>
        </div>
        <button onClick={() => onNavigate(s.tujuan)}>
          {s.tombol} <Icon name="arrow" size={18} />
        </button>
      </section>

      <div className="dashboard-grid partner-grid">
        <section className="card progress-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">PROGRES PENGAJUAN</p>
              <h2>Perjalanan kemitraanmu</h2>
            </div>
            <span className="progress-count">{selesai} dari 4 tahap</span>
          </div>
          <div className="timeline">
            {tahap.map((t, index) => (
              <div className={`timeline-step ${t.state}`} key={t.judul}>
                <div className="step-rail">
                  <div className="step-circle">
                    {t.state === "done" ? (
                      <Icon name="check" size={16} strokeWidth={2.5} />
                    ) : t.state === "failed" ? (
                      <Icon name="close" size={16} strokeWidth={2.5} />
                    ) : t.state === "current" ? (
                      <span className="pulse-dot" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < tahap.length - 1 && <div className="step-line" />}
                </div>
                <div className="step-copy">
                  <strong>{t.judul}</strong>
                  <span>{t.tgl}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card detail-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">RINGKASAN PROPOSAL</p>
              <h2>Detail pengajuan</h2>
            </div>
            <button className="text-button" onClick={() => onNavigate("Pengajuan Saya")}>Lihat semua</button>
          </div>
          <div className="detail-list">
            <div className="detail-row">
              <div className="detail-icon pink"><Icon name="package" /></div>
              <div><span>Paket kemitraan</span><strong>{saya.paket}</strong></div>
              <span className="verified"><Icon name="check" size={13} /> Lengkap</span>
            </div>
            <div className="detail-row">
              <div className="detail-icon blue"><Icon name="pin" /></div>
              <div><span>Lokasi stasiun</span><strong>{saya.alamat}</strong></div>
            </div>
            <div className="detail-row">
              <div className="detail-icon yellow"><Icon name="calendar" /></div>
              <div><span>Tanggal pengajuan</span><strong>{formatTanggal(saya.tanggal)}</strong></div>
            </div>
          </div>
          <div className="completion">
            <div><span>Kelengkapan data</span><strong>100%</strong></div>
            <div className="completion-track"><div /></div>
          </div>
        </section>

        <section className="card agreement-card partner-agreement">
          <div className="agreement-lock"><Icon name="document" size={26} /></div>
          <div>
            <p className="eyebrow">SURAT PENAWARAN</p>
            <h2>
              {saya.status === "Disetujui"
                ? "Surat Penawaran sudah tersedia"
                : saya.status === "Kemitraan Aktif"
                ? "Perjanjian sudah kamu terima"
                : "Dokumen akan hadir setelah proposal disetujui"}
            </h2>
            <p>Kamu bisa membaca dan menyetujui perjanjian langsung dari dashboard.</p>
          </div>
          <button
            disabled={saya.status !== "Disetujui"}
            onClick={() => onNavigate("Surat Penawaran")}
          >
            {saya.status === "Disetujui" ? "Buka sekarang" : saya.status === "Kemitraan Aktif" ? "Selesai" : "Belum tersedia"}
          </button>
        </section>
      </div>
    </>
  );
}