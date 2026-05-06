// 🎯 SISTEMA COMPLETO ADMIN REGATAS
import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUser = null;
let currentRole = null;
let chart = null;

// 🔐 INIT AUTH
export function initAuth() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      const roleDoc = await getDoc(doc(db, "users", user.uid));
      currentRole = roleDoc.exists() ? roleDoc.data().rol : "user";

      console.log("✅ Usuario:", user.email, "Rol:", currentRole);

      showPanel();
      loadDashboard();
      loadPagos();
      loadDeudores();
    } else {
      currentUser = null;
      showLogin();
    }
  });
}

export function showLogin() {
  document.getElementById("login-box").style.display = "block";
  document.getElementById("admin-panel").style.display = "none";
}

export function showPanel() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("admin-panel").style.display = "block";
  document.getElementById("user-info").innerHTML = `👤 ${currentUser.email} (${currentRole})`;
}

// 🔑 LOGIN
export async function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;

  if (!email || !pass) {
    return Swal.fire("Error", "Completa email y contraseña", "error");
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    Swal.fire("✅ Login OK", result.user.email, "success");
  } catch (e) {
    console.error(e);
    Swal.fire("❌ Error", "Email o contraseña incorrectos", "error");
  }
}

export async function logout() {
  await signOut(auth);
  Swal.fire("Sesión cerrada", "", "info");
}

// 💰 REGISTRAR PAGO
export async function registrarPago() {
  const nombre = document.getElementById("p-nombre").value;
  const dni = document.getElementById("p-dni").value;
  const mes = document.getElementById("p-mes").value;
  const monto = document.getElementById("p-monto").value;

  if (!nombre || !dni || !mes || !monto) {
    return Swal.fire("Error", "Completa todos los campos", "error");
  }

  try {
    await addDoc(collection(db, "pagos"), {
      nombre,
      dni: parseInt(dni),
      mes,
      monto: parseFloat(monto),
      estado: "pagado",
      fecha: new Date().toISOString(),
    });

    Swal.fire("✅ Pago registrado", "", "success");
    document.getElementById("p-nombre").value = "";
    document.getElementById("p-dni").value = "";
    document.getElementById("p-mes").value = "";
    document.getElementById("p-monto").value = "";

    loadPagos();
    loadDashboard();
    loadDeudores();
  } catch (e) {
    console.error(e);
    Swal.fire("Error", e.message, "error");
  }
}

// 📋 CARGAR PAGOS
export async function loadPagos() {
  try {
    const snap = await getDocs(collection(db, "pagos"));
    let html = `
      <table style="width:100%;border-collapse:collapse;">
        <tr style="background:#1f2a44;border:1px solid #2d3e5f;">
          <th style="padding:10px;border:1px solid #2d3e5f;">Nombre</th>
          <th style="padding:10px;border:1px solid #2d3e5f;">DNI</th>
          <th style="padding:10px;border:1px solid #2d3e5f;">Mes</th>
          <th style="padding:10px;border:1px solid #2d3e5f;">Monto</th>
          <th style="padding:10px;border:1px solid #2d3e5f;">Estado</th>
          <th style="padding:10px;border:1px solid #2d3e5f;">Acción</th>
        </tr>
    `;

    snap.docs.forEach((doc) => {
      const d = doc.data();
      html += `
        <tr style="border:1px solid #2d3e5f;">
          <td style="padding:10px;border:1px solid #2d3e5f;">${d.nombre}</td>
          <td style="padding:10px;border:1px solid #2d3e5f;">${d.dni}</td>
          <td style="padding:10px;border:1px solid #2d3e5f;">${d.mes}</td>
          <td style="padding:10px;border:1px solid #2d3e5f;">$${d.monto}</td>
          <td style="padding:10px;border:1px solid #2d3e5f;">✅ ${d.estado}</td>
          <td style="padding:10px;border:1px solid #2d3e5f;">
            <button onclick="deletePago('${doc.id}')" style="padding:5px 10px;background:#e74c3c;color:white;border:none;cursor:pointer;">
              Eliminar
            </button>
          </td>
        </tr>
      `;
    });

    html += `</table>`;
    document.getElementById("lista-pagos").innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

// 🗑️ ELIMINAR PAGO
export async function deletePago(id) {
  const confirmar = await Swal.fire({
    title: "¿Eliminar?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#95a5a6",
    confirmButtonText: "Sí, eliminar",
  });

  if (!confirmar.isConfirmed) return;

  try {
    await deleteDoc(doc(db, "pagos", id));
    Swal.fire("✅ Eliminado", "", "success");
    loadPagos();
    loadDashboard();
    loadDeudores();
  } catch (e) {
    console.error(e);
  }
}

// 📊 DASHBOARD (GRÁFICOS)
export async function loadDashboard() {
  try {
    const snap = await getDocs(collection(db, "pagos"));
    const pagos = snap.docs.map((d) => d.data());

    // Total ingresos
    const total = pagos.reduce((acc, p) => acc + parseFloat(p.monto), 0);
    document.getElementById("total-ingresos").innerHTML = `$${total.toFixed(2)}`;

    // Pagos por mes
    const porMes = {};
    pagos.forEach((p) => {
      porMes[p.mes] = (porMes[p.mes] || 0) + parseFloat(p.monto);
    });

    const ctx = document.getElementById("chart-mes").getContext("2d");
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(porMes),
        datasets: [
          {
            label: "Ingresos por mes ($)",
            data: Object.values(porMes),
            backgroundColor: "#27ae60",
            borderColor: "#229954",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#ecf0f1" },
            grid: { color: "#1f2a44" },
          },
          x: {
            ticks: { color: "#ecf0f1" },
            grid: { color: "#1f2a44" },
          },
        },
      },
    });

    // Total pagos
    document.getElementById("total-pagos").innerHTML = pagos.length;
  } catch (e) {
    console.error(e);
  }
}

// 📉 DEUDORES AUTOMÁTICOS
export async function loadDeudores() {
  try {
    const mesActual = new Date().toLocaleString("es-ES", { month: "long" });
    const snap = await getDocs(collection(db, "jugadores"));
    const pagos = await getDocs(collection(db, "pagos"));

    const pagaron = pagos.docs
      .filter((p) => p.data().mes.toLowerCase() === mesActual.toLowerCase())
      .map((p) => p.data().dni);

    const deudores = snap.docs.filter(
      (j) => !pagaron.includes(j.data().dni)
    );

    let html = `<h3>❌ Deudores (Mes: ${mesActual})</h3>`;
    html += `<table style="width:100%;border-collapse:collapse;">
      <tr style="background:#c0392b;border:1px solid #e74c3c;">
        <th style="padding:10px;border:1px solid #e74c3c;">Nombre</th>
        <th style="padding:10px;border:1px solid #e74c3c;">DNI</th>
        <th style="padding:10px;border:1px solid #e74c3c;">Acción</th>
      </tr>
    `;

    deudores.forEach((j) => {
      const d = j.data();
      html += `
        <tr style="border:1px solid #e74c3c;background:#2d1f1f;">
          <td style="padding:10px;border:1px solid #e74c3c;">${d.nombre}</td>
          <td style="padding:10px;border:1px solid #e74c3c;">${d.dni}</td>
          <td style="padding:10px;border:1px solid #e74c3c;">
            <button onclick="recordarDeuda('${d.nombre}', '${d.telefono}')" style="padding:5px 10px;background:#3498db;color:white;border:none;cursor:pointer;">
              💬 WhatsApp
            </button>
          </td>
        </tr>
      `;
    });

    html += `</table>`;
    document.getElementById("lista-deudores").innerHTML = html;
    document.getElementById("total-deudores").innerHTML = deudores.length;
  } catch (e) {
    console.error(e);
  }
}

// 💬 RECORDAR DEUDA POR WHATSAPP
export function recordarDeuda(nombre, telefono) {
  const mensaje = `Hola ${nombre}, te recordamos que tienes una deuda pendiente con el club. Por favor contacta con tesorería.`;
  const enlace = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(enlace, "_blank");
}

// 📤 EXPORTAR A EXCEL
export async function exportarExcel() {
  try {
    const snap = await getDocs(collection(db, "pagos"));
    const pagos = snap.docs.map((d) => d.data());

    const ws = XLSX.utils.json_to_sheet(pagos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");

    const fecha = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `pagos_${fecha}.xlsx`);

    Swal.fire("✅ Excel exportado", "", "success");
  } catch (e) {
    console.error(e);
    Swal.fire("Error", e.message, "error");
  }
}

// ⚽ REGISTRAR ASISTENCIA
export async function registrarAsistencia() {
  const dni = document.getElementById("a-dni").value;
  const presente = document.getElementById("a-presente").checked;

  if (!dni) {
    return Swal.fire("Error", "Ingresa DNI", "error");
  }

  try {
    await addDoc(collection(db, "asistencia"), {
      dni: parseInt(dni),
      fecha: new Date().toISOString(),
      presente,
    });

    Swal.fire("✅ Asistencia registrada", "", "success");
    document.getElementById("a-dni").value = "";
    document.getElementById("a-presente").checked = false;
    loadAsistencia();
  } catch (e) {
    console.error(e);
  }
}

// 📋 CARGAR ASISTENCIA
export async function loadAsistencia() {
  try {
    const snap = await getDocs(collection(db, "asistencia"));
    const hoy = new Date().toISOString().split("T")[0];
    const hoyAsistencia = snap.docs.filter(
      (d) => d.data().fecha.split("T")[0] === hoy
    );

    let html = `<h3>📋 Asistencia de hoy</h3>`;
    html += `<table style="width:100%;border-collapse:collapse;">
      <tr style="background:#1f2a44;border:1px solid #2d3e5f;">
        <th style="padding:10px;border:1px solid #2d3e5f;">DNI</th>
        <th style="padding:10px;border:1px solid #2d3e5f;">Estado</th>
      </tr>
    `;

    hoyAsistencia.forEach((d) => {
      const a = d.data();
      const estado = a.presente ? "✅ Presente" : "❌ Ausente";
      html += `
        <tr style="border:1px solid #2d3e5f;">
          <td style="padding:10px;border:1px solid #2d3e5f;">${a.dni}</td>
          <td style="padding:10px;border:1px solid #2d3e5f;">${estado}</td>
        </tr>
      `;
    });

    html += `</table>`;
    document.getElementById("lista-asistencia").innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

// 🔍 HISTORIAL POR JUGADOR
export async function buscarHistorial() {
  const dni = document.getElementById("search-dni").value;

  if (!dni) {
    return Swal.fire("Error", "Ingresa DNI", "error");
  }

  try {
    const q = query(collection(db, "pagos"), where("dni", "==", parseInt(dni)));
    const snap = await getDocs(q);

    let html = `<h3>📜 Historial DNI ${dni}</h3>`;
    html += `<table style="width:100%;border-collapse:collapse;">
      <tr style="background:#1f2a44;border:1px solid #2d3e5f;">
        <th style="padding:10px;border:1px solid #2d3e5f;">Nombre</th>
        <th style="padding:10px;border:1px solid #2d3e5f;">Mes</th>
        <th style="padding:10px;border:1px solid #2d3e5f;">Monto</th>
        <th style="padding:10px;border:1px solid #2d3e5f;">Fecha</th>
      </tr>
    `;

    snap.docs.forEach((d) => {
      const p = d.data();
      html += `
        <tr style="border:1px solid #2d3e5f;">
          <td style="padding:10px;border:1px solid #2d3e5f;">${p.nombre}</td>
          <td style="padding:10px;border:1px solid #2d3e5f;">${p.mes}</td>
          <td style="padding:10px;border:1px solid #2d3e5f;">$${p.monto}</td>
          <td style="padding:10px;border:1px solid #2d3e5f;">${new Date(p.fecha).toLocaleDateString()}</td>
        </tr>
      `;
    });

    html += `</table>`;
    document.getElementById("historial-result").innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

// Exponer globales
window.login = login;
window.logout = logout;
window.registrarPago = registrarPago;
window.deletePago = deletePago;
window.exportarExcel = exportarExcel;
window.registrarAsistencia = registrarAsistencia;
window.buscarHistorial = buscarHistorial;
window.recordarDeuda = recordarDeuda;
