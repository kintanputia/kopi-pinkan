import { Icon } from "./Icon";

const langkah: { peran: "Mitra" | "Admin"; teks: string }[] = [
  { peran: "Mitra", teks: "Buka Ajukan Proposal, isi formulir, lalu kirim." },
  { peran: "Admin", teks: "Klik Tinjau pada proposalmu, pilih Minta Update, dan isi catatan." },
  { peran: "Mitra", teks: "Buka Beranda, klik Perbarui data, lalu kirim ulang." },
  { peran: "Admin", teks: "Tinjau lagi, lalu klik Setujui." },
  { peran: "Mitra", teks: "Buka Surat Penawaran, centang persetujuan, lalu klik Terima Perjanjian." },
];

export function PanduanDemo({ onTutup }: { onTutup: () => void }) {
  return (
    <aside className="panduan no-print">
      <div className="panduan-kepala">
        <div className="panduan-ikon"><Icon name="sparkle" size={20} /></div>
        <div className="panduan-judul">
          <p className="eyebrow">CARA MENCOBA PROTOTIPE</p>
          <strong>Ikuti 5 langkah ini untuk melihat seluruh alur</strong>
          <span>Gunakan tombol Admin dan Mitra di pojok kanan atas untuk berganti peran.</span>
        </div>
        <button className="panduan-tutup" onClick={onTutup} aria-label="Sembunyikan panduan">
          <Icon name="close" size={16} />
        </button>
      </div>

      <ol className="panduan-langkah">
        {langkah.map((l, i) => (
          <li key={l.teks} className={`panduan-kartu ${l.peran === "Admin" ? "admin" : "mitra"}`}>
            <div className="panduan-nomor">{i + 1}</div>
            <span className="panduan-peran">{l.peran}</span>
            <p>{l.teks}</p>
          </li>
        ))}
      </ol>

      <p className="panduan-catatan">
        Ingin mengulang dari awal? Klik <strong>Reset Data Demo</strong> di bagian bawah halaman.
      </p>
    </aside>
  );
}