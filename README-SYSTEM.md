# 🏃 SISTEMA CLUB PRO - GUÍA COMPLETA

## 📋 TABLA DE CONTENIDOS
1. [Setup Inicial](#setup-inicial)
2. [Características](#características)
3. [Estructura del Proyecto](#estructura)
4. [Credenciales de Prueba](#credenciales)
5. [Uso del Sistema](#uso)

---

## 🚀 SETUP INICIAL

### 1. FIRESTORE - Crear Usuarios en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto: **voz-arg-2c418**
3. **Authentication** → Crea estos usuarios:

```
📧 admin@club.com / Pass: 123456
📧 tesorero@club.com / Pass: 123456
📧 entrenador@club.com / Pass: 123456
```

### 2. FIRESTORE - Crear Estructura de Datos

En **Firestore Database**, crea estas colecciones:

#### `users/` (Roles)
```
users/
  admin123:
    {
      nombre: "Santiago Admin",
      email: "admin@club.com",
      rol: "admin"
    }
  tesorero123:
    {
      nombre: "Juan Tesorero",
      email: "tesorero@club.com",
      rol: "tesorero"
    }
```

#### `jugadores/` (Datos)
```
jugadores/
  jug_12345678:
    {
      nombre: "Lionel Messi",
      dni: 12345678,
      categoria: "A",
      telefono: "5491123456789"
    }
```

#### `pagos/` (Se crea automáticamente)
Se crea cuando registras el primer pago.

#### `asistencia/` (Se crea automáticamente)
Se crea cuando registras la primera asistencia.

---

## 🎯 CARACTERÍSTICAS

### 📊 DASHBOARD
- **Total Ingresos**: Suma de todos los pagos
- **Total Pagos**: Cantidad de registros
- **Deudores**: Jugadores sin pago del mes actual
- **Gráfico**: Ingresos agrupados por mes
- **Exportar Excel**: Descarga todas las cuotas

### 💰 CUOTAS
- ➕ Registrar nuevos pagos
- 📋 Lista completa de pagos
- 🗑️ Eliminar pagos (con confirmación)
- 📊 Tabla de todos los movimientos

### ❌ DEUDORES
- 📉 Lista automática de deudores del mes
- 💬 Botón WhatsApp directo para recordar deuda
- 📊 Contador de deudores totales

### ⚽ ASISTENCIA
- ✅ Registrar presencia/ausencia
- 📋 Historial del día actual
- ☑️ Marcar como presente o ausente

### 📜 HISTORIAL
- 🔍 Buscar movimientos por DNI
- 📊 Tabla con fecha y monto
- 💵 Historial completo del jugador

---

## 🏗️ ESTRUCTURA DEL PROYECTO

```
regatas/
├── index.html              (Frontend catálogo)
├── package.json           
├── setup-firestore.js     (Inicializar datos)
├── src/
│   ├── admin.html         ⭐ PANEL ADMIN
│   ├── catalogo.html      (Ecommerce)
│   ├── carrito.html       (Carrito)
│   ├── categorias.html    
│   ├── contacto.html      
│   ├── fixture.html       
│   ├── css/
│   │   └── admin.css      (Estilos admin)
│   ├── js/
│   │   ├── firebase.js    (Config Firebase)
│   │   ├── admin-system.js ⭐ LÓGICA SISTEMA
│   │   └── cart.js        (Carrito)
│   └── public/
```

---

## 🔐 CREDENCIALES

### Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@club.com | 123456 | admin |
| tesorero@club.com | 123456 | tesorero |
| entrenador@club.com | 123456 | entrenador |

### Firebase Config
```
projectId: voz-arg-2c418
authDomain: voz-arg-2c418.firebaseapp.com
```

---

## 💻 USO DEL SISTEMA

### 1️⃣ ACCEDER AL PANEL
- URL: `http://localhost/src/admin.html` (o tu servidor)
- Ingresa email y contraseña

### 2️⃣ DASHBOARD
- Ver ingresos totales
- Descargar Excel con `📤 EXPORTAR A EXCEL`

### 3️⃣ REGISTRAR CUOTA
- Ir a tab **💰 CUOTAS**
- Completar: Nombre, DNI, Mes, Monto
- Click en **✅ REGISTRAR PAGO**

### 4️⃣ VER DEUDORES
- Ir a tab **❌ DEUDORES**
- Se muestran automáticamente
- Click **💬 WhatsApp** para avisar

### 5️⃣ ASISTENCIA
- Ir a tab **⚽ ASISTENCIA**
- Ingresar DNI
- Marcar ✅ Presente o dejar vacío
- Click **GUARDAR**

### 6️⃣ HISTORIAL
- Ir a tab **📜 HISTORIAL**
- Ingresar DNI
- Click **🔍 BUSCAR**
- Ver todos los pagos del jugador

---

## 🔧 FUNCIONES DISPONIBLES

```javascript
// Login
login()

// Logout
logout()

// Cuotas
registrarPago()
deletePago(id)
loadPagos()

// Dashboard
loadDashboard()
exportarExcel()

// Deudores
loadDeudores()
recordarDeuda(nombre, telefono)

// Asistencia
registrarAsistencia()
loadAsistencia()

// Historial
buscarHistorial()

// Navegación tabs
showTab(tabName)
```

---

## 📱 WHATSAPP AUTOMÁTICO

El sistema genera links directos a WhatsApp:

```
https://wa.me/549261XXXXXXX?text=Tenés deuda con el club...
```

**Configurar teléfono:**
1. Guarda jugador con campo `telefono: "5491234567890"`
2. Sistema detecta y crea link automático

---

## 📊 GRÁFICOS

- **Chart.js**: Gráficos dinámicos de ingresos
- **Actualización automática**: Al registrar pago se actualiza
- **Export**: Datos también exportables a Excel

---

## 🚨 ERRORES COMUNES

### "No acceso a Firestore"
→ Revisa que agregaste el usuario en **users collection**

### "WhatsApp no funciona"
→ Asegúrate que el campo `telefono` tenga formato: `5491234567890`

### "No puedo ver deudores"
→ Los jugadores deben estar en colección `jugadores`

### "Excel no descarga"
→ Revisa que haya pagos registrados

---

## 🎓 PRÓXIMOS PASOS

1. ✅ **Crear usuarios en Firebase Auth**
2. ✅ **Agregar colecciones en Firestore**
3. ✅ **Registrar jugadores**
4. 🔄 **Usar el sistema**
5. 🚀 **Deploy a producción**

---

## 📞 SOPORTE

**Estructura completa incluye:**
- ✅ Auth con Firebase
- ✅ Dashboard con Chart.js
- ✅ CRUD completo de cuotas
- ✅ Deudores automáticos
- ✅ Control de asistencia
- ✅ Historial por jugador
- ✅ Export a Excel
- ✅ WhatsApp automático
- ✅ Roles y permisos

---

**¡Sistema listo para usar! 🚀**
