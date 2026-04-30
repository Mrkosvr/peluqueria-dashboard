"use client";
import { useState } from "react";
import { StoreProvider, useStore } from "../lib/store";
import TabCitas from "./TabCitas";
import TabClientes from "./TabClientes";
import TabServicios from "./TabServicios";
import LiveToast from "./LiveToast";

const TABS = [
  { id: "citas", label: "Citas", icon: "📅", desc: "Agenda del día" },
  { id: "clientes", label: "Clientes", icon: "👥", desc: "Base de clientes" },
  { id: "servicios", label: "Servicios", icon: "✂️", desc: "Catálogo" },
];

function BadgeCitasHoy() {
  const { state } = useStore();
  const hoy = new Date().toISOString().slice(0, 10);
  const n = state.citas.filter(c => c.fecha === hoy && c.estado !== "cancelada").length;
  if (!n) return null;
  return (
    <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 800, padding: "1px 7px", marginLeft: 6 }}>{n}</span>
  );
}

function Inner() {
  const [tabActiva, setTabActiva] = useState("citas");
  const { state } = useStore();
  const hoy = new Date().toISOString().slice(0, 10);
  const citasHoy = state.citas.filter(c => c.fecha === hoy && c.estado !== "cancelada");
  const proxima = citasHoy.find(c => c.hora >= new Date().toTimeString().slice(0, 5) && c.estado !== "completada");

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      fontFamily: "'Outfit', system-ui, sans-serif", background: "#f8fafc", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        button, input, select, textarea { font-family: inherit; }
      `}</style>

      {/* TOPBAR */}
      <header style={{
        height: 58, background: "#1a1a2e", display: "flex", alignItems: "center",
        padding: "0 20px", gap: 20, flexShrink: 0, borderBottom: "1px solid #2d2d44"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 22 }}>✂️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Studio App</div>
            <div style={{ fontSize: 9, color: "#6366f1", fontWeight: 700, letterSpacing: "0.1em" }}>PELUQUERÍA</div>
          </div>
        </div>

        {/* Tabs navegación */}
        <nav style={{ display: "flex", gap: 4, marginLeft: 16 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setTabActiva(tab.id)} style={{
              padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: tabActiva === tab.id ? "rgba(99,102,241,0.2)" : "transparent",
              color: tabActiva === tab.id ? "#a5b4fc" : "#94a3b8",
              fontSize: 13, fontWeight: tabActiva === tab.id ? 700 : 500,
              borderBottom: tabActiva === tab.id ? "2px solid #6366f1" : "2px solid transparent",
              transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6
            }}>
              {tab.icon} {tab.label}
              {tab.id === "citas" && <BadgeCitasHoy />}
            </button>
          ))}
        </nav>

        {/* Info rápida */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          {proxima && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "5px 12px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a5b4fc", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#a5b4fc", fontWeight: 600 }}>
                Próxima: {proxima.hora} — {proxima.clienteNombre.split(" ")[0]}
              </span>
            </div>
          )}
          <div style={{ fontSize: 12, color: "#64748b" }}>
            {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })}
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff"
          }}>A</div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: tabActiva === "citas" ? "flex" : "none", flex: 1, overflow: "hidden", flexDirection: "column" }}>
          <TabCitas />
        </div>
        <div style={{ display: tabActiva === "clientes" ? "flex" : "none", flex: 1, overflow: "hidden" }}>
          <TabClientes />
        </div>
        <div style={{ display: tabActiva === "servicios" ? "flex" : "none", flex: 1, overflow: "hidden", flexDirection: "column" }}>
          <TabServicios />
        </div>
      </main>

      {/* Live alert toast */}
      <LiveToast />
    </div>
  );
}
