import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "voz-arg-2c418.firebaseapp.com",
    projectId: "voz-arg-2c418",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let planActual = { nombre: '', precio: '' };

function seleccionarPlan(el, nombre, precio) {
    document.querySelectorAll('.plan').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    planActual = { nombre, precio };
    document.getElementById('res-plan').textContent = nombre;
    document.getElementById('res-total').textContent = precio;
}

function esDNIValido(dni) {
    return /^\d{7,9}$/.test(dni);
}

function limpiarFormulario() {
    document.getElementById('f-nombre').value = '';
    document.getElementById('f-dni').value = '';
    document.getElementById('f-categoria').value = '';
    document.getElementById('f-mes').value = '';
    document.getElementById('res-plan').textContent = '—';
    document.getElementById('res-total').textContent = '$ —';
    document.querySelectorAll('.plan').forEach(p => p.classList.remove('selected'));
    planActual = { nombre: '', precio: '' };
}

function generarComprobante(pago) {
    const win = window.open('', '_blank');
    const fecha = pago.fecha instanceof Date
        ? pago.fecha.toLocaleString()
        : new Date().toLocaleString();
    win.document.write(`
        <html>
        <head>
            <title>Comprobante</title>
            <style>body{font-family:Arial;padding:20px}.box{border:1px solid #ccc;padding:20px;border-radius:10px}</style>
        </head>
        <body>
            <div class="box">
                <h2>Regatas Futsal</h2>
                <p><strong>Jugador:</strong> ${pago.nombre}</p>
                <p><strong>DNI:</strong> ${pago.dni}</p>
                <p><strong>Plan:</strong> ${pago.plan}</p>
                <p><strong>Categoría:</strong> ${pago.categoria}</p>
                <p><strong>Mes:</strong> ${pago.mes}</p>
                <p><strong>Monto:</strong> ${pago.monto}</p>
                <p><strong>Método:</strong> ${pago.metodo}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <hr>
                <strong>PAGADO ✔</strong>
            </div>
        </body>
        </html>
    `);
    win.document.close();
}

async function registrarPago() {
    const nombre = document.getElementById('f-nombre').value.trim();
    const dni = document.getElementById('f-dni').value.trim();
    const categoria = document.getElementById('f-categoria').value;
    const mes = document.getElementById('f-mes').value;
    const metodo = document.getElementById('f-metodo').value;

    if (!nombre || !dni || !categoria || !mes || !planActual.nombre) {
        mostrarToast('Completa todos los campos', true);
        return;
    }
    if (!esDNIValido(dni)) {
        mostrarToast('DNI invalido', true);
        return;
    }

    try {
        const q = query(collection(db, "pagos"), where("dni", "==", dni));
        const snap = await getDocs(q);
        const pagos = snap.docs.map(d => d.data());
        const yaPago = pagos.some(p => p.mes === mes);

        if (yaPago) {
            mostrarToast("Este jugador ya pago ese mes", true);
            return;
        }

        const pago = {
            nombre, dni, categoria,
            plan: planActual.nombre,
            monto: planActual.precio,
            mes, metodo,
            fecha: new Date(),
            estado: "pagado"
        };

        await addDoc(collection(db, "pagos"), pago);
        mostrarToast("Pago registrado correctamente");
        generarComprobante(pago);
        limpiarFormulario();

    } catch (e) {
        console.error(e);
        mostrarToast("Error al guardar", true);
    }
}

async function abrirHistorial() {
    const dni = document.getElementById('f-dni').value.trim();
    const lista = document.getElementById('historial-lista');

    if (!dni) {
        mostrarToast("Ingresa DNI primero", true);
        return;
    }

    try {
        const q = query(collection(db, "pagos"), where("dni", "==", dni));
        const snap = await getDocs(q);

        if (snap.empty) {
            lista.innerHTML = '<p style="text-align:center;color:gray">No hay pagos</p>';
        } else {
            lista.innerHTML = '';
            const pagos = snap.docs.map(d => d.data());
            pagos.sort((a, b) => {
                const fa = a.fecha?.seconds ? a.fecha.seconds * 1000 : new Date(a.fecha).getTime();
                const fb = b.fecha?.seconds ? b.fecha.seconds * 1000 : new Date(b.fecha).getTime();
                return fb - fa;
            });
            pagos.forEach(p => {
                lista.innerHTML += `
                    <div class="historial-item">
                        <div>
                            <strong>${p.nombre}</strong><br>
                            ${p.plan} · ${p.categoria}<br>
                            ${p.mes}
                        </div>
                        <div>
                            ${p.monto}<br>
                            <span>${p.estado}</span>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById('modal-historial').classList.add('open');

    } catch (e) {
        console.error(e);
        mostrarToast("Error cargando historial", true);
    }
}

function cerrarHistorial() {
    document.getElementById('modal-historial').classList.remove('open');
}

function mostrarToast(msg, error = false) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    toast.style.borderColor = error ? 'red' : 'green';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

window.registrarPago = registrarPago;
window.abrirHistorial = abrirHistorial;
window.cerrarHistorial = cerrarHistorial;
window.seleccionarPlan = seleccionarPlan;
