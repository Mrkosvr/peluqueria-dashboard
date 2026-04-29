"use client";
import { useState, useMemo } from "react";
import { useStore } from "../lib/store";

const MESES_CORTOS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function BarChart({ data, colorKey = "#6366f1", label = "" }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 10 }}>{label}</div>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 80 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div title={`${d.label}: ${d.value}`} style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              height: `${(d.value / max) * 72}px`, minHeight: d.value ? 3 : 0,
              background: colorKey, opacity: d.active ? 1 : 0.4, transition: "height 0.4s, opacity 0.2s"
            }} />
            <span style={{ fontSize: 9, color: "#94a3b8", whiteSpace: "nowrap" }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segments, size = 100 }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let cum = 0;
  const radius = 38, cx = 50, cy = 50, circ = 2 * Math.PI * radius;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={14} />
      {segments.map((s, i) => {
        const pct = s.value / total;
        const offset = circ * (1 - pct);
        const rotation = (cum / total) * 360 - 90;
        cum += s.value;
        return (
          <circle key={i} cx={cx} cy={cy} r={radius} fill="none"
            stroke={s.color} strokeWidth={14}
            strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
            strokeDashoffset={0}
            transform={`rotate(${rotation} ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.5s" }} />
        );
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={14} fontWeight={700} fill="#1e293b">{total}</text>
    </svg>
  );
}

function StatCard({ label, value, sub, color = "#6366f1", icon }) {
  return (
    <div style={{ background: "#fff", border: `1.5px solid #e2e8f0`, borderTop: `3px solid ${color}`, borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 6 }}>{label.toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1e293b" }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 22 }}>{icon}</div>
      </div>
    </div>
  );
}

function ClienteDrawer({ cliente, citas, onClose, onEdit }) {
  const clienteCitas = citas.filter(c => c.clienteId === cliente.id || c.clienteNombre === cliente.nombre);
  const completadas = clienteCitas.filter(c => c.estado === "completada");
  const gastado = completadas.reduce((a, c) => a + (c.precio || 0), 0);

  // Visitas por mes (últimos 6 meses)
  const ahora = new Date();
  const visitasMes = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - 5 + i, 1);
    const mes = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      label: MESES_CORTOS[d.getMonth()],
      value: clienteCitas.filter(c => c.fecha?.startsWith(mes)).length,
      active: i === 5
    };
  });

  const serviciosUsados = {};
  clienteCitas.forEach(c => {
    if (c.servicioNombre) serviciosUsados[c.servicioNombre] = (serviciosUsados[c.servicioNombre] || 0) + 1;
  });
  const topServicios = Object.entries(serviciosUsados).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const s = {
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", justifyContent: "flex-end" },
    drawer: { width: 420, background: "#fff", height: "100%", overflowY: "auto", boxShadow: "-4px 0 30px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" },
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.drawer}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{cliente.nombre}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Cliente desde {cliente.fechaAlta || "—"}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8" }}>×</button>
        </div>
        <div style={{ padding: "20px 24px", flex: 1 }}>
          {/* Datos */}
          <div style={{ marginBottom: 20 }}>
            {[
              ["📞", "Teléfono", cliente.telefono || "—"],
              ["✉️", "Email", cliente.email || "—"],
              ["📝", "Notas", cliente.notas || "—"],
            ].map(([icon, label, val]) => (
              <div key={label} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em" }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: "#1e293b", marginTop: 1 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <StatCard label="Total visitas" value={clienteCitas.length} icon="✂️" color="#6366f1" />
            <StatCard label="Total gastado" value={`${gastado}€`} icon="💳" color="#10b981" />
          </div>
          {/* Visitas por mes */}
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <BarChart data={visitasMes} colorKey="#6366f1" label="VISITAS ÚLTIMOS 6 MESES" />
          </div>
          {/* Servicios favoritos */}
          {topServicios.length > 0 && (
            <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 10 }}>SERVICIOS MÁS USADOS</div>
              {topServicios.map(([svc, count]) => (
                <div key={svc} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#1e293b" }}>{svc}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1" }}>{count}x</span>
                </div>
              ))}
            </div>
          )}
          {/* Próximas citas */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 10 }}>PRÓXIMAS CITAS</div>
            {clienteCitas.filter(c => c.fecha >= new Date().toISOString().slice(0, 10) && c.estado !== "cancelada").slice(0, 3).map(c => (
              <div key={c.id} style={{ padding: "8px 10px", background: `${c.color}12`, borderLeft: `3px solid ${c.color}`, borderRadius: "0 8px 8px 0", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.fecha} {c.hora}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.servicioNombre}</div>
              </div>
            ))}
            {!clienteCitas.filter(c => c.fecha >= new Date().toISOString().slice(0, 10) && c.estado !== "cancelada").length &&
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Sin próximas citas</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TabClientes() {
  const { state } = useStore();
  const [buscar, setBuscar] = useState("");
  const [selCliente, setSelCliente] = useState(null);
  const [drawerCliente, setDrawerCliente] = useState(null);

  const clientes = state.clientes.filter(c => {
    const q = buscar.toLowerCase();
    return !q || c.nombre.toLowerCase().includes(q) || (c.telefono || "").includes(q) || (c.email || "").toLowerCase().includes(q);
  });

  // Estadísticas globales o por cliente
  const citasRef = selCliente
    ? state.citas.filter(c => c.clienteId === selCliente.id || c.clienteNombre === selCliente.nombre)
    : state.citas;

  const gastadoRef = citasRef.filter(c => c.estado === "completada").reduce((a, c) => a + (c.precio || 0), 0);

  const ahora = new Date();
  const visitasMes6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - 5 + i, 1);
    const mesStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { label: MESES_CORTOS[d.getMonth()], value: citasRef.filter(c => c.fecha?.startsWith(mesStr)).length, active: i === 5 };
  });

  const estadosCitas = [
    { label: "Confirmadas", value: citasRef.filter(c => c.estado === "confirmada").length, color: "#22c55e" },
    { label: "Pendientes", value: citasRef.filter(c => c.estado === "pendiente").length, color: "#eab308" },
    { label: "Completadas", value: citasRef.filter(c => c.estado === "completada").length, color: "#94a3b8" },
    { label: "Canceladas", value: citasRef.filter(c => c.estado === "cancelada").length, color: "#ef4444" },
  ];

  const serviciosCount = {};
  citasRef.forEach(c => { if (c.servicioNombre) serviciosCount[c.servicioNombre] = (serviciosCount[c.servicioNombre] || 0) + 1; });
  const topServicios = Object.entries(serviciosCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxS = topServicios[0]?.[1] || 1;

  return (
    <div style={{ display: "flex", height: "100%", background: "#f8fafc" }}>
      {/* Panel izquierdo - tabla */}
      <div style={{ width: 420, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0" }}>
          <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="🔍 Buscar clientes..." style={{
            width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
            fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#f8fafc"
          }} />
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {/* Fila "todos" */}
          <div onClick={() => setSelCliente(null)} style={{
            padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f1f5f9",
            background: !selCliente ? "#f0f9ff" : "#fff", display: "flex", justifyContent: "space-between", alignItems: "center"
          }}
            onMouseEnter={e => { if (selCliente) e.currentTarget.style.background = "#f8fafc"; }}
            onMouseLeave={e => { if (selCliente) e.currentTarget.style.background = "#fff"; }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: !selCliente ? "#1a1a2e" : "#475569" }}>📊 Estadísticas totales</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{state.clientes.length} clientes · {state.citas.length} citas</div>
            </div>
            {!selCliente && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />}
          </div>
          {clientes.map(c => {
            const nCitas = state.citas.filter(x => x.clienteId === c.id || x.clienteNombre === c.nombre).length;
            const isSelected = selCliente?.id === c.id;
            return (
              <div key={c.id}
                onClick={() => { setSelCliente(c); }}
                onDoubleClick={() => setDrawerCliente(c)}
                style={{
                  padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f1f5f9",
                  background: isSelected ? "#f0f9ff" : "#fff", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#fafafa"; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "#fff"; }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: isSelected ? "#1a1a2e" : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: isSelected ? "#fff" : "#475569"
                  }}>{c.nombre.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{c.nombre}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.telefono || "Sin teléfono"} · {nCitas} citas</div>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); setDrawerCliente(c); }} style={{
                  background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "3px 8px",
                  fontSize: 10, color: "#94a3b8", cursor: "pointer"
                }}>Ver →</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel derecho - estadísticas */}
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1e293b" }}>
            {selCliente ? selCliente.nombre : "Estadísticas totales"}
          </h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>
            {selCliente ? "Haz doble clic en el cliente para ver el perfil completo" : "Selecciona un cliente para ver sus estadísticas individuales"}
          </p>
        </div>

        {/* Tarjetas stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard label="Total citas" value={citasRef.length} icon="📅" color="#6366f1" />
          <StatCard label="Completadas" value={citasRef.filter(c => c.estado === "completada").length} icon="✅" color="#10b981" />
          <StatCard label="Ingresos" value={`${gastadoRef}€`} icon="💰" color="#f59e0b" />
          {!selCliente && <StatCard label="Clientes" value={state.clientes.length} icon="👤" color="#8b5cf6" />}
          {selCliente && <StatCard label="Canceladas" value={citasRef.filter(c => c.estado === "cancelada").length} icon="❌" color="#ef4444" />}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {/* Visitas por mes */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 18 }}>
            <BarChart data={visitasMes6} colorKey="#6366f1" label="CITAS POR MES (ÚLTIMOS 6)" />
          </div>
          {/* Donut estados */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 18, display: "flex", gap: 20, alignItems: "center" }}>
            <DonutChart segments={estadosCitas} size={110} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 10 }}>ESTADOS</div>
              {estadosCitas.map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                    <span style={{ fontSize: 12, color: "#475569" }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top servicios */}
        {topServicios.length > 0 && (
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 14 }}>SERVICIOS MÁS SOLICITADOS</div>
            {topServicios.map(([svc, count], i) => (
              <div key={svc} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{svc}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1" }}>{count} veces</span>
                </div>
                <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${(count / maxS) * 100}%`, background: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"][i], borderRadius: 3, transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer cliente */}
      {drawerCliente && (
        <ClienteDrawer cliente={drawerCliente} citas={state.citas}
          onClose={() => setDrawerCliente(null)} />
      )}
    </div>
  );
}
