"use client";
import { useEffect, useState } from "react";
import { useStore } from "../lib/store";

export default function LiveToast() {
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.liveAlert) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [state.liveAlert]);

  if (!state.liveAlert) return null;

  const cita = state.liveAlert;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      transform: visible ? "translateY(0)" : "translateY(120px)",
      opacity: visible ? 1 : 0,
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        background: "#fff", borderRadius: 14, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        border: "1.5px solid #e2e8f0", padding: "16px 20px", minWidth: 320, maxWidth: 380,
        borderLeft: "5px solid #25d366", display: "flex", gap: 14, alignItems: "flex-start"
      }}>
        <div style={{ fontSize: 24, flexShrink: 0 }}>🟢</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#25d366", letterSpacing: "0.06em" }}>NUEVA CITA · WHATSAPP</div>
            <button onClick={() => dispatch({ type: "CLEAR_ALERT" })}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginTop: 4 }}>{cita.clienteNombre}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{cita.servicioNombre} · {cita.fecha} a las {cita.hora}</div>
          {cita.clienteTelefono && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>📞 {cita.clienteTelefono}</div>}
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            <span style={{ fontSize: 11, background: "#f0fdf4", color: "#15803d", padding: "3px 8px", borderRadius: 20, fontWeight: 700, border: "1px solid #bbf7d0" }}>
              ✓ Guardada automáticamente
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
