import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Pengajuan, Riwayat, Status } from "./types";

const KUNCI = "kopi-pinkan-pengajuan";

const pesan: Record<Status, (p: Pengajuan) => string> = {
  "Perlu Ditinjau": () =>
    "Proposal Anda telah kami terima dan sedang ditinjau oleh tim Kopi Pinkan.",
  "Perlu Diperbarui": (p) =>
    `Mohon lengkapi data proposal Anda terkait ${p.catatan}. Silakan perbarui melalui dashboard Kopi Pinkan.`,
  "Disetujui": () =>
    "Selamat! Proposal Anda telah disetujui. Silakan cek dashboard untuk melihat Surat Penawaran dan menandatangani perjanjian.",
  "Ditolak": (p) =>
    `Mohon maaf, saat ini kami belum dapat menyetujui proposal Anda karena ${p.catatan}.`,
  "Kemitraan Aktif": () =>
    "Kemitraan resmi dimulai! Tim distribusi kami akan segera menghubungi Anda terkait pengiriman gerobak dan jadwal pelatihan.",
};

function muatDaftar(): Pengajuan[] {
  try {
    const simpanan = localStorage.getItem(KUNCI);
    if (simpanan === null) return dataContoh();
    const hasil = JSON.parse(simpanan);
    return Array.isArray(hasil) ? hasil : dataContoh();
  } catch {
    return dataContoh();
  }
}

function simpanAman(kunci: string, nilai: string) {
  try {
    localStorage.setItem(kunci, nilai);
  } catch {
    console.warn("Penyimpanan browser penuh atau tidak tersedia.");
  }
}

function bacaAman(kunci: string): string | null {
  try {
    return localStorage.getItem(kunci);
  } catch {
    return null;
  }
}

function buatRiwayat(status: Status, tanggal: string, catatan?: string): Riwayat[] {
  const mulai = new Date(tanggal).getTime();
  const jalur: Record<Status, Status[]> = {
    "Perlu Ditinjau": ["Perlu Ditinjau"],
    "Perlu Diperbarui": ["Perlu Ditinjau", "Perlu Diperbarui"],
    "Disetujui": ["Perlu Ditinjau", "Disetujui"],
    "Ditolak": ["Perlu Ditinjau", "Ditolak"],
    "Kemitraan Aktif": ["Perlu Ditinjau", "Disetujui", "Kemitraan Aktif"],
  };
  return jalur[status].map((s, i, semua) => ({
    status: s,
    waktu: new Date(mulai + i * 6 * 3_600_000).toISOString(),
    catatan: i === semua.length - 1 ? catatan : undefined,
  }));
}

function dataContoh(): Pengajuan[] {
  const hariLalu = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
  const daftar: Pengajuan[] = [
    {
      id: "KPN-DEMO01", nama: "Aulia Rahman", nik: "3174010101900001", whatsapp: "081234560001",
      email: "aulia.rahman@email.com", paket: "Paket A", listrikAir: true,
      alamat: "Jl. Kemang Raya No. 12, Jakarta Selatan",
      areaPenjualan: "Kawasan Kemang dan Cipete Raya",
      status: "Perlu Ditinjau", tanggal: hariLalu(3),
    },
    {
      id: "KPN-DEMO02", nama: "Nadia Putri", nik: "3273010202920002", whatsapp: "081234560002",
      email: "nadia.putri@email.com", paket: "Paket B", listrikAir: true,
      alamat: "Jl. Dago Atas No. 45, Bandung",
      areaPenjualan: "Dago Atas dan sekitar kampus ITB",
      status: "Perlu Ditinjau", tanggal: hariLalu(1),
    },
    {
      id: "KPN-DEMO03", nama: "Rizky Pratama", nik: "3578010303930003", whatsapp: "081234560003",
      email: "rizky.pratama@email.com", paket: "Paket C", listrikAir: false,
      alamat: "Jl. Darmo Permai No. 8, Surabaya",
      areaPenjualan: "Darmo Permai dan sekitar Pakuwon Mall",
      status: "Perlu Diperbarui", catatan: "foto lokasi kurang jelas dan ketersediaan listrik belum terkonfirmasi",
      tanggal: hariLalu(5),
    },
    {
      id: "KPN-DEMO04", nama: "Dewi Lestari", nik: "3372010404940004", whatsapp: "081234560004",
      email: "dewi.lestari@email.com", paket: "Paket B", listrikAir: true,
      alamat: "Jl. Slamet Riyadi No. 21, Surakarta",
      areaPenjualan: "Koridor Slamet Riyadi dan area Car Free Day",
      status: "Disetujui", tanggal: hariLalu(7),
    },
    {
      id: "KPN-DEMO05", nama: "Sinta Maharani", nik: "5171010505950005", whatsapp: "081234560005",
      email: "sinta.maharani@email.com", paket: "Paket A", listrikAir: true,
      alamat: "Jl. Sunset Road No. 3, Denpasar",
      areaPenjualan: "Sunset Road dan kawasan Seminyak",
      status: "Ditolak", catatan: "area penjualan di lokasi tersebut sudah penuh",
      tanggal: hariLalu(10),
    },
    {
      id: "KPN-DEMO06", nama: "Bagas Wicaksono", nik: "3471010606960006", whatsapp: "081234560006",
      email: "bagas.wicaksono@email.com", paket: "Paket A", listrikAir: true,
      alamat: "Jl. Malioboro No. 77, Yogyakarta",
      areaPenjualan: "Malioboro dan sekitar Stasiun Tugu",
      status: "Kemitraan Aktif", tanggal: hariLalu(14),
    },
  ];
  return daftar.map((p) => ({ ...p, riwayat: buatRiwayat(p.status, p.tanggal, p.catatan) }));
}

interface Store {
  daftar: Pengajuan[];
  idSaya: string | null;                 // partner yang sedang aktif
  toast: { ke: string; teks: string } | null;
  kirim: (data: Omit<Pengajuan, "id" | "status" | "tanggal">) => void;
  kirimUlang: (id: string, data: Partial<Pengajuan>) => void;
  ubahStatus: (id: string, status: Status, catatan?: string) => void;
  tutupToast: () => void;
  resetDemo: () => void;
}

const Ctx = createContext<Store>(null!);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [daftar, setDaftar] = useState<Pengajuan[]>(muatDaftar)
  const [idSaya, setIdSaya] = useState<string | null>(
    () => bacaAman(KUNCI + "-saya")
  );
  const [toast, setToast] = useState<Store["toast"]>(null);

  useEffect(() => {
    simpanAman(KUNCI, JSON.stringify(daftar));
  }, [daftar]);

  function notifikasi(p: Pengajuan) {
    setToast({ ke: p.whatsapp, teks: pesan[p.status](p) });
  }

  function ubahStatus(id: string, status: Status, catatan = "") {
    const lama = daftar.find((p) => p.id === id);
    if (!lama) return;
    const baru = {
      ...lama,
      status,
      catatan,
      riwayat: [...(lama.riwayat ?? []), { status, waktu: new Date().toISOString(), catatan: catatan || undefined }],
    };
    setDaftar(daftar.map((p) => (p.id === id ? baru : p)));
    notifikasi(baru);
  }

  function kirim(data: Omit<Pengajuan, "id" | "status" | "tanggal">) {
    const baru: Pengajuan = {
      ...data,
      id: "KPN-" + Date.now().toString().slice(-7),
      status: "Perlu Ditinjau",
      tanggal: new Date().toISOString(),
      riwayat: [{ status: "Perlu Ditinjau", waktu: new Date().toISOString() }],
    };
    setDaftar([baru, ...daftar]);
    setIdSaya(baru.id);
    simpanAman(KUNCI + "-saya", baru.id);
    notifikasi(baru);
  }

  function kirimUlang(id: string, data: Partial<Pengajuan>) {
    const lama = daftar.find((p) => p.id === id);
    if (!lama) return;
    const baru = {
      ...lama,
      ...data,
      status: "Perlu Ditinjau" as Status,
      catatan: "",
      riwayat: [...(lama.riwayat ?? []), { status: "Perlu Ditinjau" as Status, waktu: new Date().toISOString() }],
    };
    setDaftar(daftar.map((p) => (p.id === id ? baru : p)));
    notifikasi(baru);
  }

  function resetDemo() {
    setDaftar(dataContoh());
    setIdSaya(null);
    localStorage.removeItem(KUNCI + "-saya");
    setToast(null);
  }

  return (
    <Ctx.Provider value={{ daftar, idSaya, toast, kirim, kirimUlang, ubahStatus, resetDemo, tutupToast: () => setToast(null) }}>
      {children}
    </Ctx.Provider>
  );
}