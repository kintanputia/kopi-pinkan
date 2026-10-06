import { useState } from "react";
import { Icon, type IconName } from "../components/Icon";
import { useStore } from "../store";
import type { Status } from "../types";
import { hariMenunggu } from "../format";
import { paketInfo } from "../paket";
import { RiwayatStatus } from "../components/RiwayatStatus";

function inisial(nama: string) {
  return nama.split(" ").map((k) => k[0]).join("").slice(0, 2).toUpperCase();
}

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const kelasStatus: Record<Status, string> = {
  "Perlu Ditinjau": "need-review",
  "Perlu Diperbarui": "needs-update",
  "Disetujui": "approved",
  "Ditolak": "rejected",
  "Kemitraan Aktif": "approved",
};

export function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [filter, setFilter] = useState("Semua");
  const [cari, setCari] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  
  const { daftar, ubahStatus } = useStore();
  const kata = cari.trim().toLowerCase();
  const tampil = daftar
    .filter((p) => filter === "Semua" || p.status === filter)
    .filter((p) => !kata || p.nama.toLowerCase().includes(kata) || p.id.toLowerCase().includes(kata))
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const hitung = (s: Status) => daftar.filter(p => p.status === s).length;
  const menunggu = daftar.filter(
    (p) => p.status === "Perlu Ditinjau" && Date.now() - new Date(p.tanggal).getTime() > 2 * 86_400_000
  ).length;

    const [mode, setMode] = useState<"lihat" | "update" | "tolak" | "setujui">("lihat");
    const [catatan, setCatatan] = useState("");
    const pilih = daftar.find((p) => p.id === selectedApplicant) ?? null;

    function tutup() {
    setSelectedApplicant(null);
    setMode("lihat");
    setCatatan("");
    }

    function setujui() {
    if (!pilih) return;
    ubahStatus(pilih.id, "Disetujui");
    tutup();
    }

    function simpanCatatan() {
    if (!pilih || !catatan.trim()) return;
    ubahStatus(
        pilih.id,
        mode === "update" ? "Perlu Diperbarui" : "Ditolak",
        catatan.trim()
    );
    tutup();
    }

  function sel(v: string | boolean | undefined) {
    let t = String(v ?? "");
    if (/^[=+\-@]/.test(t)) t = "'" + t;
    return `"${t.replace(/"/g, '""')}"`;
  }

  function unduhLaporan() {
    const kepala = ["ID", "Nama", "NIK", "WhatsApp", "Email", "Paket", "Alamat", "Area penjualan", "Listrik dan air", "Status", "Catatan", "Tanggal masuk"];
    const baris = daftar.map((p) =>
      [
        sel(p.id), sel(p.nama), `="${p.nik}"`, `="${p.whatsapp}"`, sel(p.email), sel(p.paket),
        sel(p.alamat), sel(p.areaPenjualan), sel(p.listrikAir ? "Tersedia" : "Belum tersedia"), sel(p.status),
        sel(p.catatan), sel(formatTanggal(p.tanggal)),
      ].join(",")
    );
    const csv = "\uFEFF" + [kepala.map(sel).join(","), ...baris].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-pengajuan-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className="admin-heading">
        <div>
          <p className="eyebrow">PORTAL ADMIN HQ</p>
          <h1>Halo, Sarah!</h1>
          <p>Pantau dan kelola seluruh pengajuan kemitraan Kopi Pinkan.</p>
        </div>
        <button className="export-button" onClick={unduhLaporan}>
          <Icon name="document" size={17} /> Unduh laporan (CSV)
        </button>
      </section>

      <section className="admin-stats">
        {[
            { label: "Total Pengajuan", value: String(daftar.length), change: "Semua pengajuan", icon: "file" as IconName, tone: "blue" },
            { label: "Perlu Ditinjau", value: String(hitung("Perlu Ditinjau")), change: "Menunggu admin", icon: "clock" as IconName, tone: "pink" },
            { label: "Perlu Diperbarui", value: String(hitung("Perlu Diperbarui")), change: "Menunggu mitra", icon: "document" as IconName, tone: "yellow" },
            { label: "Disetujui", value: String(hitung("Disetujui")), change: "Pengajuan disetujui", icon: "check" as IconName, tone: "green" },
            { label: "Ditolak", value: String(hitung("Ditolak")), change: "Pengajuan ditolak", icon: "close" as IconName, tone: "red" },
            { label: "Mitra Aktif", value: String(hitung("Kemitraan Aktif")), change: "Sudah bergabung", icon: "user" as IconName, tone: "purple" },
        ].map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className={`stat-icon ${stat.tone}`}><Icon name={stat.icon} /></div>
            <div>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.change}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="card applications-card">
        <div className="applications-header">
          <div>
            <p className="eyebrow">PENGAJUAN TERBARU</p>
            <h2>Proposal masuk</h2>
          </div>
          <button className="text-button" onClick={() => onNavigate("Semua Pengajuan")}>
            Lihat semua <Icon name="arrow" size={14} />
          </button>
        </div>
        <div className="table-tools">
          <div className="filter-tabs">
            {["Semua", "Perlu Ditinjau", "Perlu Diperbarui", "Disetujui", "Ditolak", "Kemitraan Aktif"].map((item) => (
              <button
                className={filter === item ? "active" : ""}
                key={item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="search-box">
            <span>⌕</span>
            <input aria-label="Cari pengajuan" placeholder="Cari nama atau ID..." value={cari} onChange={(e) => setCari(e.target.value)} />
          </label>
        </div>
        <div className="table-scroll">
          <table className="applications-table">
            <thead>
              <tr>
                <th>MITRA</th>
                <th>LOKASI</th>
                <th>PAKET</th>
                <th>TANGGAL MASUK</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tampil.map((p, index) => (
                <tr key={p.id}>
                  <td>
                    <div className="applicant">
                      <span className={`applicant-avatar avatar-${index % 4}`}>{inisial(p.nama)}</span>
                      <div><strong>{p.nama}</strong><span>{p.id}</span></div>
                    </div>
                  </td>
                  <td>{p.alamat}</td>
                  <td>{p.paket} · {paketInfo[p.paket].nama}</td>
                  <td>
                    <div className="tanggal-sel">
                      <span>{formatTanggal(p.tanggal)}</span>
                      {p.status === "Perlu Ditinjau" && (
                        <span className={`table-status tunggu ${hariMenunggu(p.tanggal) >= 2 ? "lama" : ""}`}>
                          {hariMenunggu(p.tanggal) === 0 ? "Baru masuk" : `Menunggu ${hariMenunggu(p.tanggal)} hari`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td><span className={`table-status ${kelasStatus[p.status]}`}>{p.status}</span></td>
                  <td>
                    <button className="review-button" onClick={() => setSelectedApplicant(p.id)}>
                      Tinjau <Icon name="arrow" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="admin-bottom-grid">
        <section className="card review-summary">
        <div className="card-heading">
          <div>
            <p className="eyebrow">RINGKASAN KEPUTUSAN</p>
            <h2>Aktivitas peninjauan</h2>
          </div>
          <span>Saat ini</span>
        </div>
        <div className="activity-bars">
          {[
            ["Disetujui", hitung("Disetujui") + hitung("Kemitraan Aktif"), "approved"],
            ["Perlu Diperbarui", hitung("Perlu Diperbarui"), "updated"],
            ["Ditolak", hitung("Ditolak"), "rejected"],
          ].map(([label, value, tone]) => (
            <div className="activity-row" key={label}>
              <div><span>{label}</span><strong>{value}</strong></div>
              <div className="activity-track"><i className={String(tone)} style={{ width: `${Math.min(100, Number(value) * 20)}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

        <section className="card admin-reminder">
          <div className="reminder-icon"><Icon name="bell" size={22} /></div>
          <div>
            <p className="eyebrow">PENGINGAT HARI INI</p>
            <h2>{menunggu} proposal sudah menunggu lebih dari 2 hari</h2>
            <p>Prioritaskan peninjauan agar calon mitra mendapat keputusan tepat waktu.</p>
            <button onClick={() => setFilter("Perlu Ditinjau")}>Tinjau sekarang <Icon name="arrow" size={14} /></button>
          </div>
        </section>
      </div>

      {pilih && (
        <div className="review-modal-backdrop" onClick={tutup}>
            <section className="review-modal wide" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={tutup} aria-label="Tutup">
                <Icon name="close" />
            </button>
            <div className="modal-icon"><Icon name="file" size={26} /></div>
            <p className="eyebrow">TINJAU PROPOSAL · {pilih.id}</p>
            <h2>{pilih.nama}</h2>

            <dl className="modal-detail">
                <div><dt>Paket</dt><dd>{pilih.paket} · {paketInfo[pilih.paket].nama}</dd></div>
                <div><dt>NIK</dt><dd>{pilih.nik}</dd></div>
                <div><dt>WhatsApp</dt><dd>{pilih.whatsapp}</dd></div>
                <div><dt>Email</dt><dd>{pilih.email}</dd></div>
                <div><dt>Alamat stasiun</dt><dd>{pilih.alamat}</dd></div>
                <div><dt>Area penjualan</dt><dd>{pilih.areaPenjualan ?? "-"}</dd></div>
                <div><dt>Listrik dan air</dt><dd>{pilih.listrikAir ? "Tersedia" : "Belum tersedia"}</dd></div>
                <div>
                <dt>Status</dt>
                <dd><span className={`table-status ${kelasStatus[pilih.status]}`}>{pilih.status}</span></dd>
                </div>
                {pilih.catatan && <div><dt>Catatan</dt><dd>{pilih.catatan}</dd></div>}
            </dl>

            {pilih.foto && <img className="modal-foto" src={pilih.foto} alt="Foto garasi/lokasi" />}
            <h3 className="modal-subjudul">Riwayat status</h3>
            <RiwayatStatus riwayat={pilih.riwayat} />

            {pilih.status !== "Perlu Ditinjau" ? (
                <p className="modal-info">Proposal ini sudah diproses. Tindakan hanya tersedia untuk status Perlu Ditinjau.</p>
            ) : mode === "lihat" ? (
                <div className="modal-actions">
                <button className="update-action" onClick={() => setMode("update")}>Minta Update</button>
                <button className="reject-action" onClick={() => setMode("tolak")}>Tolak</button>
                <button className="approve-action" onClick={() => setMode("setujui")}>
                    <Icon name="check" size={15} /> Setujui
                </button>
                </div>
            ) : mode === "setujui" ? (
              <div className="modal-note">
                <p className="modal-konfirmasi">
                  Setujui proposal <strong>{pilih.nama}</strong>? Surat Penawaran akan dibuat dan notifikasi WhatsApp dikirim ke mitra. Tindakan ini tidak bisa dibatalkan.
                </p>
                <div className="modal-actions">
                  <button onClick={() => setMode("lihat")}>Batal</button>
                  <button className="approve-action" onClick={setujui}>
                    <Icon name="check" size={15} /> Ya, Setujui
                  </button>
                </div>
              </div>
            ) : (
                <div className="modal-note">
                <label>
                    <span>{mode === "update" ? "Catatan revisi untuk mitra" : "Alasan penolakan"}</span>
                    <textarea
                    rows={3}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder={mode === "update" ? "Contoh: foto lokasi kurang jelas" : "Contoh: area penjualan sudah penuh"}
                    />
                </label>
                <div className="modal-actions">
                    <button onClick={() => { setMode("lihat"); setCatatan(""); }}>Batal</button>
                    <button
                    className={mode === "update" ? "update-action" : "reject-action"}
                    disabled={!catatan.trim()}
                    onClick={simpanCatatan}
                    >
                    {mode === "update" ? "Kirim Permintaan Update" : "Kirim Penolakan"}
                    </button>
                </div>
                </div>
            )}
            </section>
        </div>
        )}
    </>
  );
}