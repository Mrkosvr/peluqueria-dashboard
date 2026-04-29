# Studio App · Dashboard Peluquería

Panel de gestión completo para peluquería con citas, clientes y servicios.

## Estructura del proyecto

```
peluqueria-dashboard/
├── app/
│   ├── layout.jsx        ← Layout raíz de Next.js
│   └── page.jsx          ← Página principal
├── components/
│   ├── Dashboard.jsx     ← Shell principal con navegación y topbar
│   ├── TabCitas.jsx      ← Pestaña de citas (mes/semana/día/tabla)
│   ├── TabClientes.jsx   ← Pestaña de clientes + estadísticas
│   ├── TabServicios.jsx  ← Pestaña de servicios y productos
│   └── LiveToast.jsx     ← Notificación de citas en tiempo real
├── lib/
│   ├── data.js           ← Datos iniciales mock (reemplazar por API/DB)
│   └── store.js          ← Estado global con useReducer + Context
├── package.json
├── next.config.js
└── jsconfig.json
```

## Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar en desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:3000
```

## Deploy en Vercel

```bash
# Opción A: desde CLI
npx vercel

# Opción B: conecta tu repo de GitHub en vercel.com
# → Import project → Deploy (sin configuración extra necesaria)
```

---

## Cómo conectar con Make (Integromat)

### Webhook → Nueva cita en tiempo real

1. En Make, crea un escenario con trigger **Webhook**
2. Copia la URL del webhook
3. En `lib/store.js`, reemplaza el `setTimeout` de demo por una llamada real:

```js
// En StoreProvider, sustituye el useEffect de demo por:
useEffect(() => {
  // Opción A: Server-Sent Events (SSE) desde tu backend
  const evtSource = new EventSource("/api/citas-stream");
  evtSource.onmessage = (e) => {
    const cita = JSON.parse(e.data);
    dispatch({ type: "LIVE_CITA", payload: cita });
  };
  return () => evtSource.close();
}, []);
```

4. Crea `/app/api/citas-stream/route.js` en Next.js para recibir el POST de Make y emitir SSE.

### Endpoint para recibir citas de Make

Crea el archivo `app/api/nueva-cita/route.js`:

```js
export async function POST(request) {
  const body = await request.json();
  // Aquí guardas en tu base de datos (Supabase, etc.)
  // y emites el evento SSE a los clientes conectados
  return Response.json({ ok: true });
}
```

---

## Base de datos recomendada: Supabase

```bash
npm install @supabase/supabase-js
```

Tabla `citas` sugerida:
| Campo | Tipo |
|---|---|
| id | uuid |
| fecha | date |
| hora | time |
| cliente_nombre | text |
| cliente_telefono | text |
| cliente_email | text |
| servicio_id | uuid |
| duracion | int |
| precio | numeric |
| estado | text |
| origen | text |
| notas | text |
| created_at | timestamptz |

---

## Personalización rápida

- **Colores y marca**: edita el `topbar` en `Dashboard.jsx`
- **Horario del salón**: modifica el array `HORAS` en `TabCitas.jsx`
- **Servicios por defecto**: edita `SERVICIOS_INIT` en `lib/data.js`
- **Clientes iniciales**: edita `CLIENTES_INIT` en `lib/data.js`
