import { useState } from "react";
import { Icon } from "../components/Icon";
import { useStore } from "../store";
import { paketInfo } from "../paket"

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function SuratPenawaran({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { daftar, idSaya, ubahStatus } = useStore();
  const [setuju, setSetuju] = useState(false);
  const saya = daftar.find((p) => p.id === idSaya);

  const tersedia = saya && (saya.status === "Disetujui" || saya.status === "Kemitraan Aktif");

  if (!saya || !tersedia) {
    return (
      <section className="simple-page">
        <p className="eyebrow">SURAT PENAWARAN</p>
        <h1>Belum tersedia</h1>
        <p>
          {saya
            ? `Surat Penawaran muncul setelah proposalmu disetujui. Status saat ini: ${saya.status}.`
            : "Kamu belum mengajukan proposal kemitraan."}
        </p>
        <button className="form-submit" onClick={() => onNavigate("Beranda")}>
          Kembali ke Beranda
        </button>
      </section>
    );
  }

  const aktif = saya.status === "Kemitraan Aktif";

  return (
    <section className="surat-page">
      <p className="eyebrow no-print">SURAT PENAWARAN</p>
      <h1 className="no-print">Surat Penawaran Kemitraan</h1>

      <article className="card surat">
        <header className="surat-kop">
          <strong>KOPI PINKAN</strong>
          <span>Kantor Pusat · Program Kemitraan</span>
        </header>

        <p className="surat-nomor">
          Nomor: SP/{saya.id}
          <br />
          Tanggal: {formatTanggal(new Date().toISOString())}
        </p>

        <p>
          Kepada Yth.
          <br />
          <strong>{saya.nama}</strong>
          <br />
          NIK {saya.nik}
        </p>

        <p>
          Berdasarkan proposal yang telah ditinjau, Kopi Pinkan dengan senang hati menawarkan
          kemitraan dengan rincian berikut:
        </p>

        <dl className="surat-detail">
          <div><dt>Paket kemitraan</dt><dd>{saya.paket} · {paketInfo[saya.paket].nama}</dd></div>
          <div><dt>Nilai paket</dt><dd>{paketInfo[saya.paket].harga}</dd></div>
          <div><dt>Alamat stasiun</dt><dd>{saya.alamat}</dd></div>
          <div><dt>Area penjualan</dt><dd>{saya.areaPenjualan ?? "-"}</dd></div>
          <div><dt>Listrik dan air</dt><dd>{saya.listrikAir ? "Tersedia" : "Belum tersedia"}</dd></div>
        </dl>

        <h2>Ringkasan ketentuan</h2>
        <ol className="surat-ketentuan">
          <li>Kopi Pinkan mendistribusikan kopi kemasan galon, gelas, kantong plastik, sedotan, gerobak sepeda listrik, dan rompi seragam pengemudi.</li>
          <li>Mitra mengelola barang, sumber daya pengemudi, dan area penjualan di stasiunnya.</li>
          <li>Mitra menjaga kualitas produk dan identitas merek Kopi Pinkan.</li>
          <li>Setelah perjanjian diterima, tim distribusi menghubungi mitra untuk pengiriman gerobak dan jadwal pelatihan.</li>
        </ol>
        <p className="surat-catatan">
          Ketentuan di atas adalah contoh untuk keperluan prototipe.
        </p>

        {aktif ? (
          <div className="surat-selesai">
            <Icon name="check" size={20} strokeWidth={2.5} />
            <div>
              <strong>Perjanjian sudah kamu terima</strong>
              <span>Status kemitraanmu sekarang Kemitraan Aktif.</span>
            </div>
          </div>
        ) : (
          <div className="surat-aksi">
            <label className="check">
              <input type="checkbox" checked={setuju} onChange={(e) => setSetuju(e.target.checked)} />
              <span>Saya telah membaca dan menyetujui ketentuan di atas.</span>
            </label>
            <button
              className="form-submit"
              disabled={!setuju}
              onClick={() => ubahStatus(saya.id, "Kemitraan Aktif")}
            >
              Terima Perjanjian
            </button>
          </div>
        )}
      </article>

      <div className="surat-tombol no-print">
        <button className="form-submit" onClick={() => window.print()}>
          Cetak / Simpan PDF
        </button>
        {aktif && (
          <button className="text-button" onClick={() => onNavigate("Beranda")}>
            Kembali ke Beranda
          </button>
        )}
      </div>
    </section>
  );
}