// ─── TIPOS / CONSTANTES ───────────────────────────────────────────────────────

export const SERVICIOS = [
  { id: "s1", tipo: "servicio", nombre: "Corte Hombre", duracion: 30, precio: 15, color: "#3b82f6" },
  { id: "s2", tipo: "servicio", nombre: "Corte Mujer", duracion: 60, precio: 28, color: "#8b5cf6" },
  { id: "s3", tipo: "servicio", nombre: "Tinte Completo", duracion: 120, precio: 65, color: "#ec4899" },
  { id: "s4", tipo: "servicio", nombre: "Mechas/Balayage", duracion: 150, precio: 90, color: "#f59e0b" },
  { id: "s5", tipo: "servicio", nombre: "Tratamiento Keratina", duracion: 180, precio: 120, color: "#10b981" },
  { id: "s6", tipo: "servicio", nombre: "Permanente", duracion: 120, precio: 70, color: "#06b6d4" },
  { id: "s7", tipo: "servicio", nombre: "Peinado/Recogido", duracion: 45, precio: 25, color: "#a78bfa" },
  { id: "s8", tipo: "servicio", nombre: "Manicura", duracion: 45, precio: 20, color: "#fb7185" },
  { id: "p1", tipo: "producto", nombre: "Champú Reparador", precio: 18, stock: 24, marca: "L'Oréal" },
  { id: "p2", tipo: "producto", nombre: "Mascarilla Hidratante", precio: 22, stock: 15, marca: "Schwarzkopf" },
  { id: "p3", tipo: "producto", nombre: "Aceite Argan", precio: 28, stock: 10, marca: "Moroccanoil" },
  { id: "p4", tipo: "producto", nombre: "Laca Fijadora", precio: 12, stock: 30, marca: "Got2b" },
  { id: "p5", tipo: "producto", nombre: "Sérum Brillo", precio: 35, stock: 8, marca: "Olaplex" },
];

export const CLIENTES = [
  { id: "c1", nombre: "María García", telefono: "+34 612 345 678", email: "maria.garcia@gmail.com", notas: "Alérgica al amoniaco. Prefiere tintes vegetales.", fechaAlta: "2023-03-15", totalVisitas: 24, totalGastado: 1240 },
  { id: "c2", nombre: "Ana López", telefono: "+34 634 567 890", email: "ana.lopez@hotmail.com", notas: "", fechaAlta: "2023-06-20", totalVisitas: 12, totalGastado: 580 },
  { id: "c3", nombre: "Carlos Martínez", telefono: "+34 645 678 901", email: "carlos.m@gmail.com", notas: "Siempre pide el mismo corte nº3.", fechaAlta: "2022-11-10", totalVisitas: 36, totalGastado: 540 },
  { id: "c4", nombre: "Laura Sánchez", telefono: "+34 656 789 012", email: "", notas: "Prefiere citas a primera hora.", fechaAlta: "2024-01-05", totalVisitas: 8, totalGastado: 620 },
  { id: "c5", nombre: "Pedro Fernández", telefono: "+34 667 890 123", email: "pedro.f@empresa.com", notas: "", fechaAlta: "2023-09-22", totalVisitas: 18, totalGastado: 270 },
  { id: "c6", nombre: "Sofía Ruiz", telefono: "+34 678 901 234", email: "sofia.ruiz@gmail.com", notas: "Cliente VIP. Viene cada 3 semanas.", fechaAlta: "2022-05-30", totalVisitas: 52, totalGastado: 3800 },
  { id: "c7", nombre: "Jorge Torres", telefono: "+34 689 012 345", email: "jorge.t@outlook.com", notas: "", fechaAlta: "2024-02-14", totalVisitas: 5, totalGastado: 75 },
  { id: "c8", nombre: "Carmen Díaz", telefono: "+34 690 123 456", email: "carmen.diaz@gmail.com", notas: "Caspa. Usar champú especial.", fechaAlta: "2023-04-18", totalVisitas: 20, totalGastado: 900 },
];

// Genera citas para el mes actual
function generarCitas() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = ahora.getMonth();
  const citas = [];
  let id = 1;

  const pares = [
    { clienteId: "c1", servicioId: "s3" },
    { clienteId: "c2", servicioId: "s2" },
    { clienteId: "c3", servicioId: "s1" },
    { clienteId: "c4", servicioId: "s4" },
    { clienteId: "c5", servicioId: "s1" },
    { clienteId: "c6", servicioId: "s5" },
    { clienteId: "c7", servicioId: "s7" },
    { clienteId: "c8", servicioId: "s6" },
  ];

  const horas = ["09:00", "10:00", "10:30", "11:00", "12:00", "16:00", "17:00", "18:00", "18:30"];
  const estados = ["confirmada", "confirmada", "confirmada", "pendiente", "completada"];

  for (let dia = 1; dia <= 28; dia++) {
    const fecha = new Date(año, mes, dia);
    const dow = fecha.getDay();
    if (dow === 0) continue; // sin domingos

    const numCitas = dow === 6 ? 2 : Math.floor(Math.random() * 3) + 1;
    const horasUsadas = new Set();

    for (let j = 0; j < numCitas; j++) {
      const par = pares[(id - 1) % pares.length];
      const cliente = CLIENTES.find(c => c.id === par.clienteId);
      const servicio = SERVICIOS.find(s => s.id === par.servicioId);
      let hora;
      do { hora = horas[Math.floor(Math.random() * horas.length)]; } while (horasUsadas.has(hora));
      horasUsadas.add(hora);

      const estado = dia < ahora.getDate()
        ? (Math.random() > 0.1 ? "completada" : "cancelada")
        : dia === ahora.getDate()
          ? estados[Math.floor(Math.random() * 3)]
          : estados[Math.floor(Math.random() * 4)];

      citas.push({
        id: `cita-${id++}`,
        fecha: `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
        hora,
        clienteId: par.clienteId,
        clienteNombre: cliente.nombre,
        clienteTelefono: cliente.telefono,
        clienteEmail: cliente.email,
        servicioId: par.servicioId,
        servicioNombre: servicio.nombre,
        duracion: servicio.duracion || 60,
        precio: servicio.precio,
        color: servicio.color || "#6366f1",
        estado,
        notas: "",
        origen: Math.random() > 0.4 ? "whatsapp" : "manual",
      });
    }
  }

  return citas.sort((a, b) => `${a.fecha}${a.hora}` < `${b.fecha}${b.hora}` ? -1 : 1);
}

export const CITAS_INICIALES = generarCitas();
