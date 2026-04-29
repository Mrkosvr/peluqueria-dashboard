"use client";
import { useState, useMemo } from "react";
import { useStore } from "../lib/store";

const HORAS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00"];
const DIAS_SEMANA = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const ESTADO_COLORS = {
  confirmada: { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
  pendiente:  { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
  completada: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
  cancelada:  { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};

function padDate(d) { return String(d).padStart(2,"0"); }
function toDateStr(y,m,d) { return `${y}-${padDate(m+1)}-${padDate(d)}`; }

function CitaModal({ cita, onClose, onSave, onDelete, mode, servicios, clientes }) {
  const isNew = mode === "new";
  const [form, setForm] = useState(cita || {
    fecha: new Date().toISOString().slice(0,10),
    hora: "09:00", clienteNombre: "", clienteTelefono: "", clienteEmail: "",
    servicioId: "", servicioNombre: "", duracion: 60, precio: 0,
    estado: "pendiente", notas: "", origen: "manual",
  });

  const set = (k, v) => {
    let upd = { ...form, [k]: v };
    if (k === "servicioId") {
      const s = servicios.find(x => x.id === v);
      if (s) upd = { ...upd, servicioNombre: s.nombre, duracion: s.duracion || 60, precio: s.precio, color: s.color || "#6366f1" };
    }
    setForm(upd);
  };

  const s = {
    overlay: { position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 },
    modal: { background:"#fff",borderRadius:16,width:"100%",maxWidth:580,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 25px 60px rgba(0,0,0,0.25)" },
    header: { padding:"20px 24px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center" },
    body: { padding:"20px 24px" },
    footer: { padding:"16px 24px",borderTop:"1px solid #f1f5f9",display:"flex",gap:8,justifyContent:"flex-end" },
    label: { display:"block",fontSize:11,fontWeight:700,color:"#64748b",letterSpacing:"0.06em",marginBottom:5 },
    input: { width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:14,color:"#1e293b",outline:"none",boxSizing:"border-box",background:"#fafafa",fontFamily:"inherit" },
    row: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 },
    btn: (v) => ({ padding:"9px 20px",borderRadius:8,fontWeight:600,fontSize:13,cursor:"pointer",border:"none",
      background: v==="primary"?"#1a1a2e":v==="danger"?"#fee2e2":"#f1f5f9",
      color: v==="primary"?"#fff":v==="danger"?"#ef4444":"#475569" }),
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#1e293b"}}>{isNew ? "Nueva cita" : "Editar cita"}</div>
            {!isNew && <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>ID: {cita?.id}</div>}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#94a3b8",lineHeight:1}}>×</button>
        </div>
        <div style={s.body}>
          {/* Cliente */}
          <div style={{marginBottom:14}}>
            <label style={s.label}>NOMBRE DEL CLIENTE <span style={{color:"#ef4444"}}>*</span></label>
            <input style={s.input} value={form.clienteNombre} onChange={e=>set("clienteNombre",e.target.value)} placeholder="Nombre completo" />
          </div>
          <div style={s.row}>
            <div>
              <label style={s.label}>TELÉFONO</label>
              <input style={s.input} value={form.clienteTelefono||""} onChange={e=>set("clienteTelefono",e.target.value)} placeholder="+34 600 000 000" />
            </div>
            <div>
              <label style={s.label}>EMAIL</label>
              <input style={s.input} value={form.clienteEmail||""} onChange={e=>set("clienteEmail",e.target.value)} placeholder="email@ejemplo.com" />
            </div>
          </div>
          {/* Fecha/hora */}
          <div style={s.row}>
            <div>
              <label style={s.label}>FECHA</label>
              <input type="date" style={s.input} value={form.fecha} onChange={e=>set("fecha",e.target.value)} />
            </div>
            <div>
              <label style={s.label}>HORA</label>
              <select style={s.input} value={form.hora} onChange={e=>set("hora",e.target.value)}>
                {HORAS.map(h=><option key={h}>{h}</option>)}
              </select>
            </div>
          </div>
          {/* Servicio */}
          <div style={{marginBottom:14}}>
            <label style={s.label}>SERVICIO</label>
            <select style={s.input} value={form.servicioId||""} onChange={e=>set("servicioId",e.target.value)}>
              <option value="">— Seleccionar servicio —</option>
              {servicios.filter(x=>x.tipo==="servicio").map(s=>(
                <option key={s.id} value={s.id}>{s.nombre} · {s.duracion}min · {s.precio}€</option>
              ))}
            </select>
          </div>
          <div style={s.row}>
            <div>
              <label style={s.label}>DURACIÓN (min)</label>
              <input type="number" style={s.input} value={form.duracion} onChange={e=>set("duracion",+e.target.value)} />
            </div>
            <div>
              <label style={s.label}>PRECIO (€)</label>
              <input type="number" style={s.input} value={form.precio} onChange={e=>set("precio",+e.target.value)} />
            </div>
          </div>
          {/* Estado */}
          <div style={{marginBottom:14}}>
            <label style={s.label}>ESTADO</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["pendiente","confirmada","completada","cancelada"].map(st=>{
                const c = ESTADO_COLORS[st];
                const active = form.estado===st;
                return <button key={st} onClick={()=>set("estado",st)} style={{
                  padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",
                  background:active?c.bg:"#f8fafc",color:active?c.text:"#94a3b8",
                  border:`1.5px solid ${active?c.dot:"#e2e8f0"}`,textTransform:"capitalize"
                }}>{st}</button>;
              })}
            </div>
          </div>
          {/* Notas */}
          <div>
            <label style={s.label}>NOTAS</label>
            <textarea style={{...s.input,height:72,resize:"vertical"}} value={form.notas||""} onChange={e=>set("notas",e.target.value)} placeholder="Observaciones, preferencias, alergias..." />
          </div>
        </div>
        <div style={s.footer}>
          {!isNew && <button style={s.btn("danger")} onClick={()=>{onDelete(cita.id);onClose();}}>Eliminar</button>}
          <div style={{flex:1}}/>
          <button style={s.btn("cancel")} onClick={onClose}>Cancelar</button>
          <button style={s.btn("primary")} onClick={()=>{
            if(!form.clienteNombre.trim()){alert("El nombre es obligatorio");return;}
            onSave({...form,id:form.id||`cita-${Date.now()}`});
            onClose();
          }}>{isNew?"Crear cita":"Guardar cambios"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── VISTA MES ────────────────────────────────────────────────────────────────
function VistaMes({ año, mes, citas, onDayClick, onCitaClick }) {
  const primerDia = new Date(año, mes, 1).getDay();
  const diasEnMes = new Date(año, mes+1, 0).getDate();
  const hoyStr = new Date().toISOString().slice(0,10);
  const cells = [];
  for (let i=0; i<primerDia; i++) cells.push(null);
  for (let d=1; d<=diasEnMes; d++) cells.push(d);

  return (
    <div style={{flex:1,overflow:"auto",padding:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,background:"#e2e8f0",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
        {DIAS_SEMANA.map(d=>(
          <div key={d} style={{background:"#f8fafc",padding:"10px 0",textAlign:"center",fontSize:11,fontWeight:700,color:"#64748b",letterSpacing:"0.06em"}}>{d}</div>
        ))}
        {cells.map((d,i)=>{
          if(!d) return <div key={`e${i}`} style={{background:"#fafafa",minHeight:100}}/>;
          const dateStr = toDateStr(año,mes,d);
          const dayCitas = citas.filter(c=>c.fecha===dateStr);
          const isHoy = dateStr===hoyStr;
          return (
            <div key={d} onClick={()=>onDayClick(dateStr)} style={{background:"#fff",minHeight:100,padding:"8px 6px",cursor:"pointer",position:"relative",transition:"background 0.1s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f0f9ff"}
              onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
              <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26,borderRadius:"50%",fontSize:13,fontWeight:isHoy?700:400,background:isHoy?"#1a1a2e":"transparent",color:isHoy?"#fff":"#1e293b"}}>{d}</span>
              <div style={{marginTop:4,display:"flex",flexDirection:"column",gap:2}}>
                {dayCitas.slice(0,3).map(c=>(
                  <div key={c.id} onClick={e=>{e.stopPropagation();onCitaClick(c);}} style={{
                    fontSize:10,padding:"2px 6px",borderRadius:4,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",
                    background:`${c.color}22`,color:c.color,borderLeft:`2px solid ${c.color}`,cursor:"pointer"
                  }}>{c.hora} {c.clienteNombre.split(" ")[0]}</div>
                ))}
                {dayCitas.length>3 && <div style={{fontSize:10,color:"#94a3b8",paddingLeft:6}}>+{dayCitas.length-3} más</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── VISTA SEMANA ─────────────────────────────────────────────────────────────
function VistaSemana({ fechaRef, citas, onCitaClick, onSlotClick }) {
  const lunes = new Date(fechaRef);
  lunes.setDate(lunes.getDate() - (lunes.getDay()===0?6:lunes.getDay()-1));
  const dias = Array.from({length:7},(_,i)=>{ const d=new Date(lunes); d.setDate(d.getDate()+i); return d; });
  const hoyStr = new Date().toISOString().slice(0,10);

  return (
    <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column"}}>
      {/* Header días */}
      <div style={{display:"grid",gridTemplateColumns:"56px repeat(7,1fr)",borderBottom:"1px solid #e2e8f0",background:"#f8fafc",flexShrink:0}}>
        <div/>
        {dias.map(d=>{
          const ds = toDateStr(d.getFullYear(),d.getMonth(),d.getDate());
          const isHoy = ds===hoyStr;
          return (
            <div key={ds} style={{padding:"12px 4px",textAlign:"center",borderLeft:"1px solid #e2e8f0"}}>
              <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,letterSpacing:"0.06em"}}>{DIAS_SEMANA[d.getDay()]}</div>
              <div style={{marginTop:2,display:"inline-flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:"50%",fontSize:14,fontWeight:700,background:isHoy?"#1a1a2e":"transparent",color:isHoy?"#fff":"#1e293b"}}>{d.getDate()}</div>
            </div>
          );
        })}
      </div>
      {/* Grid horas */}
      <div style={{flex:1,overflow:"auto"}}>
        {HORAS.map(hora=>(
          <div key={hora} style={{display:"grid",gridTemplateColumns:"56px repeat(7,1fr)",minHeight:48,borderBottom:"1px solid #f1f5f9"}}>
            <div style={{padding:"4px 8px 0",fontSize:11,color:"#94a3b8",textAlign:"right",flexShrink:0,paddingTop:6}}>{hora}</div>
            {dias.map(d=>{
              const ds = toDateStr(d.getFullYear(),d.getMonth(),d.getDate());
              const slot = citas.filter(c=>c.fecha===ds&&c.hora===hora);
              return (
                <div key={ds+hora} onClick={()=>!slot.length&&onSlotClick(ds,hora)} style={{borderLeft:"1px solid #f1f5f9",padding:2,cursor:"pointer",position:"relative",minHeight:48}}
                  onMouseEnter={e=>{if(!slot.length)e.currentTarget.style.background="#f0f9ff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                  {slot.map(c=>(
                    <div key={c.id} onClick={e=>{e.stopPropagation();onCitaClick(c);}} style={{
                      background:`${c.color}18`,borderLeft:`3px solid ${c.color}`,borderRadius:"0 6px 6px 0",
                      padding:"4px 6px",cursor:"pointer",marginBottom:1
                    }}>
                      <div style={{fontSize:10,fontWeight:700,color:c.color,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.clienteNombre.split(" ")[0]}</div>
                      <div style={{fontSize:9,color:"#94a3b8"}}>{c.servicioNombre}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VISTA DÍA ────────────────────────────────────────────────────────────────
function VistaDia({ fecha, citas, onCitaClick, onSlotClick }) {
  const fechaStr = `${fecha.getFullYear()}-${padDate(fecha.getMonth()+1)}-${padDate(fecha.getDate())}`;
  const dayCitas = citas.filter(c=>c.fecha===fechaStr);

  return (
    <div style={{flex:1,overflow:"auto",padding:"0 16px 16px"}}>
      <div style={{marginBottom:16,paddingTop:12}}>
        <span style={{fontSize:13,fontWeight:600,color:"#1e293b"}}>{fecha.getDate()} de {MESES[fecha.getMonth()]} — </span>
        <span style={{fontSize:13,color:"#94a3b8"}}>{dayCitas.length} cita{dayCitas.length!==1?"s":""}</span>
      </div>
      {HORAS.map(hora=>{
        const slot = dayCitas.filter(c=>c.hora===hora);
        return (
          <div key={hora} style={{display:"flex",gap:12,minHeight:56,borderBottom:"1px solid #f1f5f9",padding:"4px 0",cursor:!slot.length?"pointer":"default"}}
            onClick={()=>!slot.length&&onSlotClick(fechaStr,hora)}
            onMouseEnter={e=>{if(!slot.length)e.currentTarget.style.background="#f8fafc";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
            <div style={{width:48,fontSize:12,color:"#94a3b8",paddingTop:4,flexShrink:0,textAlign:"right"}}>{hora}</div>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>
              {slot.map(c=>{
                const ec = ESTADO_COLORS[c.estado];
                return (
                  <div key={c.id} onClick={e=>{e.stopPropagation();onCitaClick(c);}} style={{
                    background:`${c.color}12`,border:`1.5px solid ${c.color}30`,borderLeft:`4px solid ${c.color}`,
                    borderRadius:"0 10px 10px 0",padding:"10px 14px",cursor:"pointer",
                    display:"flex",justifyContent:"space-between",alignItems:"center"
                  }}>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>{c.clienteNombre}</div>
                      <div style={{fontSize:12,color:"#64748b",marginTop:1}}>{c.servicioNombre} · {c.duracion}min · {c.precio}€</div>
                      {c.clienteTelefono&&<div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>📞 {c.clienteTelefono}</div>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:ec.bg,color:ec.text,textTransform:"capitalize"}}>{c.estado}</span>
                      {c.origen==="whatsapp"&&<span style={{fontSize:10,color:"#25d366"}}>● WhatsApp</span>}
                    </div>
                  </div>
                );
              })}
              {!slot.length && <div style={{height:48,display:"flex",alignItems:"center",paddingLeft:4}}>
                <span style={{fontSize:11,color:"#e2e8f0"}}>+ Añadir cita</span>
              </div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── VISTA TABLA ──────────────────────────────────────────────────────────────
function VistaTabla({ citas, onCitaClick }) {
  const [buscar, setBuscar] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const filtered = citas.filter(c=>{
    const q = buscar.toLowerCase();
    const matchQ = !q || c.clienteNombre.toLowerCase().includes(q) || c.servicioNombre.toLowerCase().includes(q) || c.fecha.includes(q);
    const matchE = filtroEstado==="todos" || c.estado===filtroEstado;
    return matchQ && matchE;
  }).sort((a,b)=>`${a.fecha}${a.hora}`<`${b.fecha}${b.hora}`?-1:1);

  const cols = ["Fecha","Hora","Cliente","Teléfono","Servicio","Duración","Precio","Estado","Origen"];
  return (
    <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column"}}>
      {/* Filtros */}
      <div style={{padding:"12px 16px",display:"flex",gap:10,alignItems:"center",borderBottom:"1px solid #e2e8f0",flexShrink:0,flexWrap:"wrap"}}>
        <input value={buscar} onChange={e=>setBuscar(e.target.value)} placeholder="🔍 Buscar cliente, servicio..." style={{padding:"8px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",width:240,fontFamily:"inherit"}}/>
        {["todos","pendiente","confirmada","completada","cancelada"].map(e=>(
          <button key={e} onClick={()=>setFiltroEstado(e)} style={{
            padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",border:"1.5px solid",
            background:filtroEstado===e?"#1a1a2e":"transparent",
            borderColor:filtroEstado===e?"#1a1a2e":"#e2e8f0",
            color:filtroEstado===e?"#fff":"#64748b",textTransform:"capitalize"
          }}>{e==="todos"?"Todas":e}</button>
        ))}
        <span style={{marginLeft:"auto",fontSize:12,color:"#94a3b8"}}>{filtered.length} citas</span>
      </div>
      {/* Tabla */}
      <div style={{flex:1,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead style={{position:"sticky",top:0,zIndex:1}}>
            <tr style={{background:"#f8fafc",borderBottom:"2px solid #e2e8f0"}}>
              {cols.map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h.toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i)=>{
              const ec = ESTADO_COLORS[c.estado];
              return (
                <tr key={c.id} onClick={()=>onCitaClick(c)} style={{borderBottom:"1px solid #f1f5f9",cursor:"pointer",background:i%2===0?"#fff":"#fafafa"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#f0f9ff"}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#fafafa"}>
                  <td style={{padding:"10px 12px",fontWeight:600,color:"#1e293b"}}>{c.fecha}</td>
                  <td style={{padding:"10px 12px"}}>{c.hora}</td>
                  <td style={{padding:"10px 12px",fontWeight:600}}>{c.clienteNombre}</td>
                  <td style={{padding:"10px 12px",color:"#64748b"}}>{c.clienteTelefono||"—"}</td>
                  <td style={{padding:"10px 12px"}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:c.color,flexShrink:0}}/>
                      {c.servicioNombre}
                    </span>
                  </td>
                  <td style={{padding:"10px 12px",color:"#64748b"}}>{c.duracion}min</td>
                  <td style={{padding:"10px 12px",fontWeight:700,color:"#1e293b"}}>{c.precio}€</td>
                  <td style={{padding:"10px 12px"}}>
                    <span style={{padding:"3px 8px",borderRadius:20,fontSize:11,fontWeight:700,background:ec.bg,color:ec.text,textTransform:"capitalize"}}>{c.estado}</span>
                  </td>
                  <td style={{padding:"10px 12px",fontSize:11,color:c.origen==="whatsapp"?"#25d366":"#94a3b8"}}>
                    {c.origen==="whatsapp"?"● WA":"manual"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && <div style={{padding:48,textAlign:"center",color:"#94a3b8",fontSize:14}}>No se encontraron citas</div>}
      </div>
    </div>
  );
}

// ─── MAIN CITAS ───────────────────────────────────────────────────────────────
export default function TabCitas() {
  const { state, dispatch } = useStore();
  const [vista, setVista] = useState("semana");
  const [fecha, setFecha] = useState(new Date());
  const [modal, setModal] = useState(null); // { mode: "new"|"edit", cita?, fecha?, hora? }

  const año = fecha.getFullYear();
  const mes = fecha.getMonth();

  const navegar = (delta) => {
    const d = new Date(fecha);
    if (vista==="mes") d.setMonth(d.getMonth()+delta);
    else if (vista==="semana") d.setDate(d.getDate()+7*delta);
    else d.setDate(d.getDate()+delta);
    setFecha(d);
  };

  const tituloNav = () => {
    if (vista==="mes") return `${MESES[mes]} ${año}`;
    if (vista==="semana") {
      const lunes=new Date(fecha); lunes.setDate(lunes.getDate()-(lunes.getDay()===0?6:lunes.getDay()-1));
      const domingo=new Date(lunes); domingo.setDate(lunes.getDate()+6);
      return `${lunes.getDate()} ${MESES[lunes.getMonth()].slice(0,3)} — ${domingo.getDate()} ${MESES[domingo.getMonth()].slice(0,3)} ${año}`;
    }
    return `${fecha.getDate()} de ${MESES[mes]} de ${año}`;
  };

  const handleSave = (cita) => {
    if (state.citas.find(c=>c.id===cita.id)) dispatch({type:"UPDATE_CITA",payload:cita});
    else dispatch({type:"ADD_CITA",payload:cita});
  };

  const vistasBtns = [
    {id:"mes",icon:"⊞",label:"Mes"},
    {id:"semana",icon:"⊟",label:"Semana"},
    {id:"dia",icon:"▤",label:"Día"},
    {id:"tabla",icon:"≡",label:"Tabla"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#fff"}}>
      <style>{`.view-btn:hover{background:#f1f5f9!important;}`}</style>
      {/* Barra superior */}
      <div style={{padding:"12px 16px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:12,flexShrink:0,flexWrap:"wrap",background:"#fff"}}>
        {/* Navegación */}
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={()=>navegar(-1)} style={{padding:"6px 10px",border:"1.5px solid #e2e8f0",borderRadius:8,background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,color:"#475569"}}>‹</button>
          <button onClick={()=>setFecha(new Date())} style={{padding:"6px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,background:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,color:"#475569"}}>Hoy</button>
          <button onClick={()=>navegar(1)} style={{padding:"6px 10px",border:"1.5px solid #e2e8f0",borderRadius:8,background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,color:"#475569"}}>›</button>
        </div>
        <span style={{fontSize:15,fontWeight:700,color:"#1e293b",minWidth:220}}>{tituloNav()}</span>
        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          {/* Selector vista */}
          <div style={{display:"flex",background:"#f1f5f9",borderRadius:10,padding:3,gap:2}}>
            {vistasBtns.map(v=>(
              <button key={v.id} className="view-btn" onClick={()=>setVista(v.id)} style={{
                padding:"6px 12px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                background:vista===v.id?"#fff":"transparent",color:vista===v.id?"#1e293b":"#64748b",
                boxShadow:vista===v.id?"0 1px 4px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"
              }}>{v.icon} {v.label}</button>
            ))}
          </div>
          <button onClick={()=>setModal({mode:"new",cita:{fecha:fecha.toISOString().slice(0,10),hora:"09:00"}})} style={{
            padding:"8px 16px",background:"#1a1a2e",color:"#fff",border:"none",borderRadius:8,
            fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6
          }}>+ Nueva cita</button>
        </div>
      </div>

      {/* Contenido */}
      {vista==="mes" && <VistaMes año={año} mes={mes} citas={state.citas}
        onDayClick={ds=>{setFecha(new Date(ds+"T12:00:00"));setVista("dia");}}
        onCitaClick={c=>setModal({mode:"edit",cita:c})} />}
      {vista==="semana" && <VistaSemana fechaRef={fecha} citas={state.citas}
        onCitaClick={c=>setModal({mode:"edit",cita:c})}
        onSlotClick={(ds,h)=>setModal({mode:"new",cita:{fecha:ds,hora:h}})} />}
      {vista==="dia" && <VistaDia fecha={fecha} citas={state.citas}
        onCitaClick={c=>setModal({mode:"edit",cita:c})}
        onSlotClick={(ds,h)=>setModal({mode:"new",cita:{fecha:ds,hora:h}})} />}
      {vista==="tabla" && <VistaTabla citas={state.citas} onCitaClick={c=>setModal({mode:"edit",cita:c})} />}

      {/* Modal */}
      {modal && <CitaModal
        cita={modal.cita} mode={modal.mode}
        servicios={state.servicios} clientes={state.clientes}
        onClose={()=>setModal(null)}
        onSave={handleSave}
        onDelete={id=>dispatch({type:"DELETE_CITA",id})}
      />}
    </div>
  );
}
