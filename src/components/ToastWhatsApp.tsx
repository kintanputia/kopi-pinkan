import { useEffect } from "react";
import { Icon } from "./Icon";
import { useStore } from "../store";

export function ToastWhatsApp() {
  const { toast, tutupToast } = useStore();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(tutupToast, 8000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <aside className="wa-toast" role="status" onClick={tutupToast}>
      <div className="wa-head">
        <span className="wa-logo"><Icon name="phone" size={16} strokeWidth={2.2} /></span>
        <div>
          <strong>WhatsApp · Kopi Pinkan</strong>
          <small>Simulasi pesan ke {toast.ke}</small>
        </div>
        <button className="wa-close" aria-label="Tutup notifikasi">
          <Icon name="close" size={16} />
        </button>
      </div>
      <p className="wa-bubble">{toast.teks}</p>
    </aside>
  );
}