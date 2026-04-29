"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import { CITAS_INICIALES, CLIENTES, SERVICIOS } from "./data";

const StoreContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADD_CITA":
      return { ...state, citas: [...state.citas, action.payload] };
    case "UPDATE_CITA":
      return { ...state, citas: state.citas.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case "DELETE_CITA":
      return { ...state, citas: state.citas.filter(c => c.id !== action.id) };
    case "ADD_CLIENTE":
      return { ...state, clientes: [...state.clientes, action.payload] };
    case "UPDATE_CLIENTE":
      return { ...state, clientes: state.clientes.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case "ADD_SERVICIO":
      return { ...state, servicios: [...state.servicios, action.payload] };
    case "UPDATE_SERVICIO":
      return { ...state, servicios: state.servicios.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) };
    case "DELETE_SERVICIO":
      return { ...state, servicios: state.servicios.filter(s => s.id !== action.id) };
    case "LIVE_CITA":
      // Simula llegada en tiempo real
      return { ...state, citas: [...state.citas, action.payload], liveAlert: action.payload };
    case "CLEAR_ALERT":
      return { ...state, liveAlert: null };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    citas: CITAS_INICIALES,
    clientes: CLIENTES,
    servicios: SERVICIOS,
    liveAlert: null,
  });

  // Simula llegada de cita en tiempo real (como si viniera de Make/webhook)
  useEffect(() => {
    const timer = setTimeout(() => {
      const hoy = new Date();
      const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`;
      dispatch({
        type: "LIVE_CITA",
        payload: {
          id: `live-${Date.now()}`,
          fecha,
          hora: "19:30",
          clienteNombre: "Isabel Vega",
          clienteTelefono: "+34 611 222 333",
          clienteEmail: "isabel@gmail.com",
          servicioId: "s2",
          servicioNombre: "Corte Mujer",
          duracion: 60,
          precio: 28,
          color: "#8b5cf6",
          estado: "pendiente",
          notas: "Primera visita",
          origen: "whatsapp",
        }
      });
    }, 8000); // llega a los 8 seg para que el user lo vea
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state.liveAlert) {
      const t = setTimeout(() => dispatch({ type: "CLEAR_ALERT" }), 6000);
      return () => clearTimeout(t);
    }
  }, [state.liveAlert]);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
