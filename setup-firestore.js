// 🔧 SCRIPT DE SETUP - Ejecutar UNA VEZ para inicializar Firestore

import { db } from "./src/js/firebase.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function setupFirebase() {
  console.log("📝 Inicializando Firestore...");

  // Usuarios de ejemplo
  const usuarios = [
    {
      uid: "admin123",
      email: "admin@club.com",
      nombre: "Santiago Admin",
      rol: "admin",
    },
    {
      uid: "tesorero123",
      email: "tesorero@club.com",
      nombre: "Juan Tesorero",
      rol: "tesorero",
    },
    {
      uid: "entrenador123",
      email: "entrenador@club.com",
      nombre: "Carlos Entrenador",
      rol: "entrenador",
    },
  ];

  // Jugadores de ejemplo
  const jugadores = [
    { nombre: "Lionel Messi", dni: 12345678, categoria: "A", telefono: "5491123456789" },
    { nombre: "Juan Perez", dni: 23456789, categoria: "B", telefono: "5491987654321" },
    { nombre: "Diego Martinez", dni: 34567890, categoria: "A", telefono: "5491555666777" },
    { nombre: "Carlos Rodriguez", dni: 45678901, categoria: "C", telefono: "5491444555666" },
  ];

  try {
    // Guardar usuarios
    for (const user of usuarios) {
      const { uid, ...userData } = user;
      await setDoc(doc(db, "users", uid), userData);
      console.log(`✅ Usuario creado: ${userData.email}`);
    }

    // Guardar jugadores
    for (const jugador of jugadores) {
      const id = `jug_${jugador.dni}`;
      await setDoc(doc(db, "jugadores", id), jugador);
      console.log(`✅ Jugador creado: ${jugador.nombre}`);
    }

    console.log("✅ FIRESTORE SETUP COMPLETO!");
    console.log("📝 Usa estas credenciales:");
    console.log("   Email: admin@club.com");
    console.log("   Contraseña: (la que configures en Firebase Auth)");

  } catch (error) {
    console.error("❌ Error en setup:", error);
  }
}

// Para ejecutar en consola: setupFirebase()
window.setupFirebase = setupFirebase;
