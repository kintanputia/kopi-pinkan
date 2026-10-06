import type { Status } from "./types";

export function inisial(nama: string) {
  return nama.split(" ").map((k) => k[0]).join("").slice(0, 2).toUpperCase();
}

export function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatWaktu(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function hariMenunggu(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export const kelasStatus: Record<Status, string> = {
  "Perlu Ditinjau": "need-review",
  "Perlu Diperbarui": "needs-update",
  "Disetujui": "approved",
  "Ditolak": "rejected",
  "Kemitraan Aktif": "approved",
};