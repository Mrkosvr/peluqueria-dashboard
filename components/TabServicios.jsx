"use client";
import { useState } from "react";
import { useStore } from "../lib/store";

const COLORS_SERVICIO = ["#3b82f6","#8b5cf6","#ec4899","#f59e0b","#10b981","#06b6d4","#ef4444","#a78bfa","#fb7185","#34d399"];

function ServiceModal({ item, onClose, onSave, tipo }) {
  const isNew = !item?.id;
  const [form, setForm] = useState(item || {
    tipo, nombre: "", precio: 0, duracion: tipo === "servicio" ? 30 : undefined,
    stock: tipo === "producto" ? 0 : undefined, marca: tipo === "producto" ? "" : undefined,
    color: COLORS_SERVICIO[0],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const s = {
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
    modal: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
    header: { padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
    body: { padding: "20px 24px" },
    footer: { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 8, justifyContent: "flex-end" },
    label: { display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", marginBottom: 5 },
    input: { width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, color: "#1e293b", outline: "none", boxSizing: "border-box", background: "#fafafa", fontFamily: "inherit" },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 },
    btn: (v) => ({ padding: "9px 20px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", border: "none", background: v === "primary" ? "#1a1a2e" : "#f1f5f9", color: v === "primary" ? "#fff" : "#475569" }),
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{isNew ? `Nuevo ${tipo}` : `Editar ${tipo}`}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>×</button>
        </div>
        <div style={s.body}>
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>NOMBRE <span style={{ color: "#ef4444" }}>*</span></label>
            <input style={s.input} value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder={tipo === "servicio" ? "Ej: Corte Mujer" : "Ej: Champú Reparador"} />
          </div>
          <div style={s.row}>
            <div>
              <label style={s.label}>PRECIO (€)</label>
              <input type="number" style={s.input} value={form.precio} onChange={e => set("precio", +e.target.value)} />
            </div>
            {tipo === "servicio" && (
              <div>
                <label style={s.label}>DURACIÓN (min)</label>
                <input type="number" style={s.input} value={form.duracion || 30} onChange={e => set("duracion", +e.target.value)} />
              </div>
            )}
            {tipo === "producto" && (
              <div>
                <label style={s.label}>STOCK</label>
                <input type="number" style={s.input} value={form.stock || 0} onChange={e => set("stock", +e.target.value)} />
              </div>
            )}
          </div>
          {tipo === "producto" && (
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>MARCA</label>
              <input style={s.input} value={form.marca || ""} onChange={e => set("marca", e.target.value)} placeholder="Ej: L'Oréal" />
            </div>
          )}
          {tipo === "servicio" && (
            <div>
              <label style={s.label}>COLOR EN CALENDARIO</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                {COLORS_SERVICIO.map(c => (
                  <button key={c} onClick={() => set("color", c)} style={{
                    width: 28, height: 28, borderRadius: "50%", background: c, border: form.color === c ? "3px solid #1a1a2e" : "3px solid transparent",
                    cursor: "pointer", outline: "none", transition: "border 0.15s"
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={s.footer}>
          <button style={s.btn("cancel")} onClick={onClose}>Cancelar</button>
          <button style={s.btn("primary")} onClick={() => {
            if (!form.nombre.trim()) { alert("El nombre es obligatorio"); return; }
            onSave({ ...form, id: form.id || `${tipo[0]}${Date.now()}` });
            onClose();
          }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ msg, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 28, maxWidth: 360, width: "90%", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 20 }}>{msg}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Cancelar</button>
          <button onClick={onConfirm} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

function ItemCard({ item, soloLectura, onEdit, onDelete }) {
  const esServicio = item.tipo === "servicio";
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "16px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      transition: "box-shadow 0.15s"
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {esServicio ? (
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${item.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: item.color }} />
          </div>
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🛍️</div>
        )}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{item.nombre}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            {esServicio ? `${item.duracion}min` : `Stock: ${item.stock ?? "—"}`}
            {item.marca && ` · ${item.marca}`}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{item.precio}€</div>
          {esServicio && <div style={{ fontSize: 10, color: "#94a3b8" }}>{(item.precio / (item.duracion / 60)).toFixed(0)}€/h</div>}
        </div>
        {!soloLectura && (
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={onEdit} style={{ padding: "6px 12px", border: "1.5px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#475569" }}>Editar</button>
            <button onClick={onDelete} style={{ padding: "6px 10px", border: "1.5px solid #fee2e2", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 12, color: "#ef4444" }}>🗑</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TabServicios() {
  const { state, dispatch } = useStore();
  const [soloLectura, setSoloLectura] = useState(false);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [tab, setTab] = useState("servicios");
  const [buscar, setBuscar] = useState("");

  const items = state.servicios.filter(s => {
    const matchTipo = s.tipo === tab.slice(0, -1); // "servicios" → "servicio"
    const q = buscar.toLowerCase();
    return matchTipo && (!q || s.nombre.toLowerCase().includes(q) || (s.marca || "").toLowerCase().includes(q));
  });

  const totalServicios = state.servicios.filter(s => s.tipo === "servicio");
  const totalProductos = state.servicios.filter(s => s.tipo === "producto");
  const ingresoPromedio = totalServicios.length ? (totalServicios.reduce((a, s) => a + s.precio, 0) / totalServicios.length).toFixed(0) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #e2e8f0", background: "#fff", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {/* Tabs */}
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 10, padding: 3, gap: 2 }}>
          {[{ id: "servicios", label: "✂️ Servicios", count: totalServicios.length }, { id: "productos", label: "🛍️ Productos", count: totalProductos.length }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#1e293b" : "#64748b",
              boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
            }}>{t.label} <span style={{ fontSize: 10, background: tab === t.id ? "#f1f5f9" : "transparent", padding: "1px 6px", borderRadius: 20, marginLeft: 4 }}>{t.count}</span></button>
          ))}
        </div>
        <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="🔍 Buscar..." style={{
          padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit", background: "#f8fafc", width: 200
        }} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setSoloLectura(!soloLectura)} style={{
            padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, border: "1.5px solid",
            background: soloLectura ? "#fef9c3" : "#fff", borderColor: soloLectura ? "#eab308" : "#e2e8f0",
            color: soloLectura ? "#854d0e" : "#475569"
          }}>{soloLectura ? "🔒 Solo lectura" : "🔓 Editable"}</button>
          {!soloLectura && (
            <button onClick={() => setModal({ mode: "new", tipo: tab === "servicios" ? "servicio" : "producto" })} style={{
              padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer"
            }}>+ Añadir {tab === "servicios" ? "servicio" : "producto"}</button>
          )}
        </div>
      </div>

      {/* Stats rápidas */}
      <div style={{ padding: "12px 20px", display: "flex", gap: 12, borderBottom: "1px solid #e2e8f0", background: "#fff", flexWrap: "wrap" }}>
        {(tab === "servicios" ? [
          { label: "Total servicios", value: totalServicios.length, color: "#6366f1" },
          { label: "Precio promedio", value: `${ingresoPromedio}€`, color: "#10b981" },
          { label: "Precio más alto", value: `${Math.max(...totalServicios.map(s => s.precio), 0)}€`, color: "#f59e0b" },
          { label: "Servicio más corto", value: `${Math.min(...totalServicios.map(s => s.duracion || 999))}min`, color: "#8b5cf6" },
        ] : [
          { label: "Total productos", value: totalProductos.length, color: "#f59e0b" },
          { label: "Stock total", value: totalProductos.reduce((a, p) => a + (p.stock || 0), 0), color: "#10b981" },
          { label: "Precio promedio", value: `${totalProductos.length ? (totalProductos.reduce((a, p) => a + p.precio, 0) / totalProductos.length).toFixed(0) : 0}€`, color: "#6366f1" },
          { label: "Stock bajo (<5)", value: totalProductos.filter(p => (p.stock || 0) < 5).length, color: "#ef4444" },
        ]).map(stat => (
          <div key={stat.label} style={{ padding: "6px 14px", background: `${stat.color}10`, borderRadius: 8, border: `1px solid ${stat.color}25` }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{tab === "servicios" ? "✂️" : "🛍️"}</div>
            <div style={{ fontSize: 14 }}>No hay {tab}. {!soloLectura && "Pulsa \"Añadir\" para crear uno."}</div>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 10 }}>
          {items.map(item => (
            <ItemCard key={item.id} item={item} soloLectura={soloLectura}
              onEdit={() => setModal({ mode: "edit", item, tipo: item.tipo })}
              onDelete={() => setConfirm(item.id)} />
          ))}
        </div>
      </div>

      {/* Modales */}
      {modal && (
        <ServiceModal
          item={modal.mode === "edit" ? modal.item : null}
          tipo={modal.tipo}
          onClose={() => setModal(null)}
          onSave={item => {
            if (modal.mode === "edit") dispatch({ type: "UPDATE_SERVICIO", payload: item });
            else dispatch({ type: "ADD_SERVICIO", payload: item });
          }}
        />
      )}
      {confirm && (
        <ConfirmDialog
          msg="¿Eliminar este elemento? Esta acción no se puede deshacer."
          onConfirm={() => { dispatch({ type: "DELETE_SERVICIO", id: confirm }); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
