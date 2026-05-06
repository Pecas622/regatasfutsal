// ====== CARRITO GLOBAL ======
function getCarrito() {
    return JSON.parse(localStorage.getItem("atsc_carrito") || "[]");
}

function updateCartCount() {
    const c = getCarrito();
    const totalItems = c.reduce((acc, p) => acc + (p.cantidad || 1), 0);

    const count = document.getElementById("cart-count");
    if (count) count.textContent = totalItems;
}