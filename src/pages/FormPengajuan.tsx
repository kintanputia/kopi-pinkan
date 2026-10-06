import { useState, type FormEvent } from "react";
import { useStore } from "../store";
import type { Pengajuan } from "../types";
import { paketInfo } from "../paket";

function keBase64(file: File): Promise<string> {
  return new Promise((selesai) => {
    const r = new FileReader();
    r.onload = () => selesai(r.result as string);
    r.readAsDataURL(file);
  });
}

function kecilkanFoto(file: File): Promise<string> {
  return new Promise((selesai, gagal) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    const batas = setTimeout(() => {
      URL.revokeObjectURL(url);
      gagal(new Error("waktu habis"));
    }, 10000);
    img.onload = () => {
      clearTimeout(batas);
      const skala = Math.min(1, 800 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * skala);
      c.height = Math.round(img.height * skala);
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      selesai(c.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => {
      clearTimeout(batas);
      URL.revokeObjectURL(url);
      gagal(new Error("format tidak didukung"));
    };
    img.src = url;
  });
}

export function FormPengajuan({ onSelesai, perbarui = false }: { onSelesai: () => void; perbarui?: boolean }) {
  const { kirim, kirimUlang, daftar, idSaya } = useStore();
  const lama = perbarui ? daftar.find((p) => p.id === idSaya) : undefined;
  const [f, setF] = useState({
    paket: (lama?.paket ?? "Paket A") as Pengajuan["paket"],
    nama: lama?.nama ?? "",
    nik: lama?.nik ?? "",
    whatsapp: lama?.whatsapp ?? "",
    email: lama?.email ?? "",
    alamat: lama?.alamat ?? "",
    areaPenjualan: lama?.areaPenjualan ?? "",
    listrikAir: lama?.listrikAir ?? false,
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [error, setError] = useState("");

  const ubah = (k: keyof typeof f, v: string | boolean) =>
    setF((lama) => ({ ...lama, [k]: v }));

  const saya = daftar.find((p) => p.id === idSaya);
  if (!perbarui && saya && saya.status !== "Ditolak") {
    return (
      <section className="simple-page">
        <p className="eyebrow">PENGAJUAN KEMITRAAN</p>
        <h1>Kamu sudah punya pengajuan</h1>
        <p>Proposalmu berstatus <strong>{saya.status}</strong>. Satu mitra hanya bisa memiliki satu pengajuan aktif.</p>
        <button className="form-submit" onClick={onSelesai}>Kembali ke Beranda</button>
      </section>
    );
  }

  async function kirimForm(e: FormEvent) {
    e.preventDefault();
    if (!f.nama.trim() || !f.alamat.trim()) return setError("Nama dan alamat wajib diisi.");
    if (!f.areaPenjualan.trim()) return setError("Area penjualan wajib diisi.");
    if (!/^\d{16}$/.test(f.nik)) return setError("NIK harus 16 digit angka.");
    if (!/^\d{9,15}$/.test(f.whatsapp)) return setError("Nomor WhatsApp hanya angka, 9–15 digit.");
    if (!/\S+@\S+\.\S+/.test(f.email)) return setError("Format email belum benar.");
    if (!foto && !lama?.foto) return setError("Foto garasi/lokasi wajib diunggah.");
    if (foto && foto.size > 5_000_000) return setError("Ukuran foto maksimal 5 MB.");

    setError("");
    let fotoBase64: string | undefined;
    try {
      fotoBase64 = foto ? await kecilkanFoto(foto) : lama?.foto;
    } catch {
      return setError("Foto tidak bisa diproses. Gunakan foto berformat JPG atau PNG.");
    }
    const data = { ...f, nama: f.nama.trim(), alamat: f.alamat.trim(), areaPenjualan: f.areaPenjualan.trim(), foto: fotoBase64 };
    if (lama) kirimUlang(lama.id, data);
    else kirim(data);
    onSelesai();
  }

  return (
    <section className="form-page">
      <p className="eyebrow">{lama ? "PERBARUI PROPOSAL" : "PENGAJUAN KEMITRAAN"}</p>
      <h1>{lama ? "Perbarui data proposal" : "Ajukan proposal kemitraan"}</h1>
      {lama?.catatan ? (
        <p className="form-error">Catatan admin: {lama.catatan}</p>
      ) : (
        <p>Lengkapi data berikut. Tim Kopi Pinkan akan meninjau proposalmu.</p>
      )}

      <form className="card form-card" onSubmit={kirimForm}>
        <h2>Paket kemitraan</h2>
          <div className="paket-pilihan" role="radiogroup" aria-label="Pilih paket">
          {(Object.keys(paketInfo) as Pengajuan["paket"][]).map((k) => (
            <label key={k} className={`paket-kartu ${f.paket === k ? "dipilih" : ""}`}>
              <input
                type="radio"
                name="paket"
                value={k}
                checked={f.paket === k}
                onChange={() => ubah("paket", k)}
              />
              <strong>{k} · {paketInfo[k].nama}</strong>
              <span className="paket-harga">{paketInfo[k].harga}</span>
              <ul>
                {paketInfo[k].isi.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </label>
          ))}
        </div>
        <p className="catatan-kecil">Harga dan isi paket adalah asumsi untuk keperluan prototipe.</p>

        <h2>Data pribadi</h2>
        <div className="form-grid">
          <label className="field">
            <span>Nama lengkap</span>
            <input value={f.nama} onChange={(e) => ubah("nama", e.target.value)} />
          </label>
          <label className="field">
            <span>NIK</span>
            <input inputMode="numeric" maxLength={16} value={f.nik}
              onChange={(e) => ubah("nik", e.target.value.replace(/\D/g, ""))} />
          </label>
          <label className="field">
            <span>Nomor WhatsApp aktif</span>
            <input inputMode="numeric" placeholder="08123456789" value={f.whatsapp}
              onChange={(e) => ubah("whatsapp", e.target.value.replace(/\D/g, ""))} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={f.email} onChange={(e) => ubah("email", e.target.value)} />
          </label>
        </div>

        <h2>Detail stasiun</h2>
        <label className="field">
          <span>Alamat stasiun</span>
          <textarea rows={3} value={f.alamat} onChange={(e) => ubah("alamat", e.target.value)} />
        </label>
        <label className="field">
          <span>Area penjualan</span>
          <input
            placeholder="Contoh: kawasan Pasar Senen dan sekitar Stasiun Senen"
            value={f.areaPenjualan}
            onChange={(e) => ubah("areaPenjualan", e.target.value)}
          />
          <small className="bantuan-field">Wilayah tempat gerobak akan berjualan, bisa lebih luas dari alamat stasiun.</small>
        </label>
        <label className="field">
          <span>{lama ? "Foto garasi/lokasi (kosongkan jika tidak diganti)" : "Foto garasi/lokasi (maks. 5 MB)"}</span>
          <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
        </label>
        <label className="check">
          <input type="checkbox" checked={f.listrikAir}
            onChange={(e) => ubah("listrikAir", e.target.checked)} />
          <span>Listrik dan air tersedia di lokasi</span>
        </label>

        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="form-submit">{lama ? "Kirim ulang proposal" : "Kirim proposal"}</button>
      </form>
    </section>
  );
}