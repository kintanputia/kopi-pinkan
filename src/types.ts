export type Status =
  | "Perlu Ditinjau"
  | "Perlu Diperbarui"
  | "Disetujui"
  | "Ditolak"
  | "Kemitraan Aktif";

export interface Pengajuan {
  id: string;
  nama: string;
  nik: string;
  whatsapp: string;
  email: string;
  paket: "Paket A" | "Paket B" | "Paket C";
  alamat: string;
  areaPenjualan?: string;
  foto?: string;
  listrikAir: boolean;
  status: Status;
  catatan?: string;
  tanggal: string;
  riwayat?: Riwayat[];
}

export interface Riwayat {
  status: Status;
  waktu: string;
  catatan?: string;
}