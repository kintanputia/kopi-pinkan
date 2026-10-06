import type { Pengajuan } from "./types";

export const paketInfo: Record<
  Pengajuan["paket"],
  { nama: string; harga: string; isi: string[] }
> = {
  "Paket A": {
    nama: "Pinkan Start",
    harga: "Rp 25.000.000",
    isi: ["1 gerobak sepeda listrik", "2 rompi seragam pengemudi", "Paket awal kopi galon, gelas, kantong, dan sedotan"],
  },
  "Paket B": {
    nama: "Pinkan Grow",
    harga: "Rp 45.000.000",
    isi: ["2 gerobak sepeda listrik", "4 rompi seragam pengemudi", "Stok kopi galon dan perlengkapan 2x lebih banyak"],
  },
  "Paket C": {
    nama: "Pinkan Max",
    harga: "Rp 65.000.000",
    isi: ["3 gerobak sepeda listrik", "6 rompi seragam pengemudi", "Stok kopi galon dan perlengkapan 3x lebih banyak"],
  },
};