import { formatWaktu, kelasStatus } from "../format";
import type { Riwayat } from "../types";

export function RiwayatStatus({ riwayat }: { riwayat?: Riwayat[] }) {
  if (!riwayat || riwayat.length === 0) {
    return <p className="modal-info">Belum ada riwayat status.</p>;
  }
  const urut = [...riwayat].reverse();
  return (
    <ol className="riwayat">
      {urut.map((r, i) => (
        <li key={r.waktu + r.status + i}>
          <div className="riwayat-baris">
            <span className={`table-status ${kelasStatus[r.status]}`}>{r.status}</span>
            <time>{formatWaktu(r.waktu)}</time>
          </div>
          {r.catatan && <p>{r.catatan}</p>}
        </li>
      ))}
    </ol>
  );
}