export const metadata = {
  title: "Studio App · Peluquería",
  description: "Panel de gestión para tu peluquería",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
