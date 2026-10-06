import { useStore } from "../store";
import { formatTanggal, kelasStatus } from "../format";
import { paketInfo } from "../paket";
import { RiwayatStatus } from "../components/RiwayatStatus";

export function PengajuanSaya({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { daftar, idSaya } = useStore();
  const saya = daftar.find((p) => p.id === idSaya);

  if (!saya) {
    return (
      <section className="simple-page">
        <p className="eyebrow">PENGAJUAN SAYA</p>
        <h1>Belum ada pengajuan</h1>
        <p>Kamu belum mengajukan proposal kemitraan.</p>
        <button className="form-submit" onClick={() => onNavigate("Ajukan Proposal")}>
          Ajukan Proposal
        </button>
      </section>
    );
  }

  return (
    <section className="form-page">
      <p className="eyebrow">PROPOSAL #{saya.id}</p>
      <h1>Pengajuan kemitraanmu</h1>
      <p>Diajukan pada {formatTanggal(saya.tanggal)}.</p>

      <div className="card form-card">
        <div className="saya-status">
          <span className={`table-status ${kelasStatus[saya.status]}`}>{saya.status}</span>
          {saya.status === "Perlu Diperbarui" && (
            <button className="form-submit" onClick={() => onNavigate("Perbarui Data")}>
              Perbarui data
            </button>
          )}
          {saya.status === "Disetujui" && (
            <button className="form-submit" onClick={() => onNavigate("Surat Penawaran")}>
              Buka Surat Penawaran
            </button>
          )}
        </div>
        {saya.catatan && (saya.status === "Perlu Diperbarui" || saya.status === "Ditolak") && (
          <p className="form-error">
            {saya.status === "Ditolak" ? "Alasan penolakan" : "Catatan admin"}: {saya.catatan}
          </p>
        )}

        <h2>Data proposal</h2>
        <dl className="modal-detail">
          <div><dt>Paket</dt><dd>{saya.paket} · {paketInfo[saya.paket].nama}</dd></div>
          <div><dt>Nama</dt><dd>{saya.nama}</dd></div>
          <div><dt>NIK</dt><dd>{saya.nik}</dd></div>
          <div><dt>WhatsApp</dt><dd>{saya.whatsapp}</dd></div>
          <div><dt>Email</dt><dd>{saya.email}</dd></div>
          <div><dt>Alamat stasiun</dt><dd>{saya.alamat}</dd></div>
          <div><dt>Area penjualan</dt><dd>{saya.areaPenjualan ?? "-"}</dd></div>
          <div><dt>Listrik dan air</dt><dd>{saya.listrikAir ? "Tersedia" : "Belum tersedia"}</dd></div>
        </dl>
        {saya.foto && <img className="modal-foto" src={saya.foto} alt="Foto garasi/lokasi" />}

        <h2>Riwayat status</h2>
        <RiwayatStatus riwayat={saya.riwayat} />
      </div>
    </section>
  );
}