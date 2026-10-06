import { useStore } from "../store";
import { formatTanggal, inisial } from "../format";
import { paketInfo } from "../paket";

export function MitraAktif() {
  const { daftar } = useStore();
  const aktif = daftar.filter((p) => p.status === "Kemitraan Aktif");

  function sejak(p: (typeof aktif)[number]) {
    const r = [...(p.riwayat ?? [])].reverse().find((x) => x.status === "Kemitraan Aktif");
    return formatTanggal(r ? r.waktu : p.tanggal);
  }

  return (
    <>
      <section className="admin-heading">
        <div>
          <p className="eyebrow">JARINGAN KEMITRAAN</p>
          <h1>Mitra aktif</h1>
          <p>{aktif.length} mitra sudah menerima perjanjian dan memulai kemitraan.</p>
        </div>
      </section>

      <section className="card applications-card">
        <div className="table-scroll">
          <table className="applications-table">
            <thead>
              <tr>
                <th>MITRA</th>
                <th>LOKASI STASIUN</th>
                <th>PAKET</th>
                <th>MITRA SEJAK</th>
              </tr>
            </thead>
            <tbody>
              {aktif.length === 0 && (
                <tr>
                  <td colSpan={4} className="tabel-kosong">Belum ada mitra aktif.</td>
                </tr>
              )}
              {aktif.map((p, index) => (
                <tr key={p.id}>
                  <td>
                    <div className="applicant">
                      <span className={`applicant-avatar avatar-${index % 4}`}>{inisial(p.nama)}</span>
                      <div><strong>{p.nama}</strong><span>{p.id}</span></div>
                    </div>
                  </td>
                  <td>{p.alamat}</td>
                  <td>{p.paket} · {paketInfo[p.paket].nama}</td>
                  <td>{sejak(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}