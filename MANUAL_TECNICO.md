# 🛠️ Manual Técnico — Pirá Pará (Boutique de Pesca y Camping)

Este documento detalla la arquitectura de software, el flujo de datos, la estructura interna y las directrices para el despliegue de la aplicación en producción (especialmente orientado a **Hostinger / Entornos Node.js**).

---

## 🏗️ 1. Arquitectura General

Pirá Pará está construido como una aplicación full-stack moderna de bajo consumo y alta velocidad usando un patrón **Vite & Express integrada**:

- **Front-end**: React 18+ con TypeScript, Tailwind CSS para el diseño estético de interfaz, y Lucide React para los íconos de vectorización.
- **Back-end**: Servidor Express interactivo (escrito en TypeScript, compilado a CommonJS para evitar incompatibilidades locales de módulos).
- **Persistencia**: Almacenamiento local ligero en formatos JSON (`/data/*.json`) simulando bases de datos de bajo consumo, idóneo para despliegues rápidos sin requerir complejas bases de datos SQL de pago mensual.

---

## 🗄️ 2. Estructura de Datos (Modelos JSON)

La información del sistema se guarda y lee mediante funciones seguras en el archivo `server.ts`. Los archivos principales se encuentran en la raíz o directorio configurado:

### A. Socios (Cofradía) — `data/friends.json`
Contiene la base de miembros inscritos bajo el tipo `Friend`:
```typescript
interface Friend {
  id: string;
  name: string;
  whatsapp: string; // Ej: sin "+" -> "543781223344"
  email: string;
  address?: string;
  city?: string;
  provincia?: string;
  cp?: string;
  points: number;       // Puntos acumulados de fidelidad
  isMayorista: boolean; // Tag manual/automático de precios especiales
  isAdmin?: boolean;    // Flag de acceso administrativo
  createdAt: string;    // Fecha ISO de ingreso
}
```

### B. Pedidos — `data/orders.json`
Almacena el detalle histórico de transacciones:
```typescript
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
}
```

---

## 🔒 3. Seguridad de Acceso y Gestión Administrativa

A petición del cliente, la visibilidad de accesos directos de administrador se modificó para mitigar escaneos malignos:

1. **Habilitación Orgánica**: Se eliminaron los botones de candados/Admin visibles del navbar para usuarios públicos en estado invitado.
2. **Autodetección de Cuenta Admin**: 
   * Al iniciar sesión mediante "Mi Cuenta" utilizando el correo `informatecorrientes@gmail.com` (o cualquier registro cuyo campo `isAdmin` sea `true`), el servidor y el cliente levantan la bandera `isAdminAuthorized`.
   * Esto habilita visual y funcionalmente el botón del **Admin Panel** y permite al operador abrir la vista de configuración en `/admin`.
3. **Ascensos Administrativos desde el Panel**: 
   * En la pestaña **Gabinete de Pescadores Cofradía**, el administrador cuenta con controles reactivos para togglar permisos directos de `'Admin'` o `'Mayorista'` en cualquier fila mediante llamadas `PATCH` a `/api/friends/:id/admin-update`, evitando la necesidad de ingresar claves maestras por defecto en el cliente.

---

## 🚀 4. Guía de Despliegue en Hostinger

Hostinger admite aplicaciones Node.js en planes de Servidores VPS y planes de Web Hosting Empresarial con soporte de gestor Node incorporado de manera sencilla:

### Paso 1: Dependencias de Compilación
Asegúrate de ejecutar el comando de build de producción:
```bash
npm run build
```
Este comando realizará dos acciones vitales especificadas en `package.json`:
1. Compilará la interfaz React a código estático hiper-optimizado dentro del directorio `/dist`.
2. Compilará el backend `server.ts` a un archivo único CommonJS auto-contenido en `/dist/server.cjs` empleando `esbuild`.

### Paso 2: Configuración en Hostinger Panel (hPanel)
1. Subí todos los archivos de tu proyecto al directorio raíz del servidor mediante FTP o el administrador de archivos de Hostinger. (Excepto `node_modules`).
2. Ingresá al panel de hPanel de Hostinger, navega a **Sección Avanzado -> Node.js**.
3. Creá una nueva aplicación especificando:
   - **Node.js Versión**: 18.x o superior.
   - **Application Directory**: `/` (el raíz del proyecto subido).
   - **Application Startup File**: `dist/server.cjs` (el bundle compilado de Express).
4. Presioná el botón **Install PM2** (o el botón que Hostinger provee para iniciar la aplicación).
5. Hacé clic en **Start/Restart** para encender el servidor Express que escuchará automáticamente por el puerto 3000 de redirección interna de Hostinger.

### Paso 3: Persistencia de Datos
* Asegúrate de dar permisos de escritura (`chmod 775` o `755`) al directorio `/data` o la raíz para garantizar que el servidor pueda guardar archivos JSON para que los cambios en pedidos y amigos persistan indefinidamente al reiniciar Node.js.
