// =======================
// CARRITO GLOBAL
// =======================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =======================
// GUARDAR LOCALSTORAGE
// =======================
function saveCart() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// =======================
// FORMATO COLÓN
// =======================
function formatCRC(num) {
  return "₡" + Number(num).toLocaleString("es-CR");
}

// =======================
// LIMPIAR PRECIO
// =======================
function getPrice(value) {
  if (!value) return 0;

  return Number(
    value.toString()
      .replace(/₡/g, "")
      .replace(/,/g, "")
      .replace(/\s/g, "")
  ) || 0;
}

// =======================
// BADGE
// =======================
function updateBadge() {
  const badge = document.getElementById("carritoBadge");
  if (!badge) return;

  const total = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

  badge.innerText = total;
  badge.style.display = total > 0 ? "inline" : "none";
}

// =======================
// AGREGAR AL CARRITO (GLOBAL)
// =======================
function addToCart(producto = null) {

  const titulo = producto?.nombre || document.getElementById("modalTitulo")?.innerText || "Sin nombre";
  const imagen = producto?.imagen || document.getElementById("modalImagen")?.src || "";
  const talla = producto?.talla || document.querySelector(".talla-option.active")?.innerText || "N/A";
  const precioTexto = producto?.precio || document.getElementById("modalPrecio")?.innerText || "₡0";

  const nuevo = {
    nombre: titulo,
    imagen,
    talla,
    precio: getPrice(precioTexto),
    cantidad: 1
  };

  const existe = carrito.find(
    p => p.nombre === nuevo.nombre && p.talla === nuevo.talla
  );

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push(nuevo);
  }

  saveCart();
  updateBadge();
  renderCart();
}

// =======================
// RENDER CARRITO
// =======================
function renderCart() {
  const container = document.getElementById("modalCarritoBody");
  const total = document.getElementById("totalCarrito");

  if (!container) return;

  container.innerHTML = "";

  if (carrito.length === 0) {
    container.innerHTML = `<div class="text-center text-muted py-4">🛒 Carrito vacío</div>`;
    if (total) total.innerText = "₡0";
    return;
  }

  let sum = 0;

  carrito.forEach((p, i) => {

    const precio = Number(p.precio) || 0;
    const cantidad = Number(p.cantidad) || 1;
    const subtotal = precio * cantidad;

    sum += subtotal;

    container.innerHTML += `
      <div class="d-flex justify-content-between align-items-center mb-3 p-2 rounded" style="background:#111;color:#fff">

        <div class="d-flex gap-2 align-items-center">
          <img src="${p.imagen}" style="width:60px;height:60px;object-fit:cover;border-radius:10px">

          <div>
            <b>${p.nombre}</b><br>
            <small>Talla ${p.talla}</small><br>
            <span>${formatCRC(precio)} x ${cantidad}</span><br>
            <strong>${formatCRC(subtotal)}</strong>
          </div>
        </div>

        <div class="d-flex gap-2 align-items-center">
          <button onclick="cambiarCantidad(${i}, -1)" class="btn btn-sm btn-secondary">-</button>
          <span style="color:white">${cantidad}</span>
          <button onclick="cambiarCantidad(${i}, 1)" class="btn btn-sm btn-secondary">+</button>
          <button onclick="removeItem(${i})" class="btn btn-sm btn-danger">x</button>
        </div>

      </div>
    `;
  });

  if (total) total.innerText = formatCRC(sum);
}

// =======================
// CAMBIAR CANTIDAD
// =======================
function cambiarCantidad(i, cambio) {
  carrito[i].cantidad += cambio;

  if (carrito[i].cantidad <= 0) {
    carrito.splice(i, 1);
  }

  saveCart();
  updateBadge();
  renderCart();
}

// =======================
// ELIMINAR
// =======================
function removeItem(i) {
  carrito.splice(i, 1);
  saveCart();
  updateBadge();
  renderCart();
}

// =======================
// GLOBAL
// =======================
window.addToCart = addToCart;
window.cambiarCantidad = cambiarCantidad;
window.removeItem = removeItem;

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {

  updateBadge();

  const btn = document.getElementById("btnAbrirCarrito");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      renderCart();
      new bootstrap.Modal(document.getElementById("modalCarrito")).show();
    });
  }

  const btnAdd = document.getElementById("btnAgregarCarrito");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      addToCart();
      bootstrap.Modal.getInstance(document.getElementById("modalProducto"))?.hide();
    });
  }

});
function irCheckout() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  window.location.href = "checkout.html";
}