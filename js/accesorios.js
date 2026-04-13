let productos = [];
let productosFiltrados = [];
let productoSeleccionado = null;

const grid = document.getElementById("productosGrid");
const buscarInput = document.getElementById("buscarInput");
const botonesFiltro = document.querySelectorAll(".filtro");
const tallasContainer = document.getElementById("tallasContainer");
const btnAgregar = document.getElementById("btnAgregarCarrito");

// ================== CARGAR JSON ==================
fetch("/json/dataAccesorios.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    productosFiltrados = data;
    mostrarProductos(productos);
  })
  .catch(err => console.error("Error cargando accesorios:", err));

// ================== MOSTRAR ==================
function mostrarProductos(lista) {
  grid.innerHTML = "";

  lista.forEach(prod => {
    grid.innerHTML += `
      <div class="col-md-6 col-lg-3">
        <div class="card producto-card shadow-sm h-100">

          <img src="${prod.imagen}" class="card-img-top">

          <div class="card-body text-center d-flex flex-column">

            <span class="badge bg-primary mb-1">${prod.estilo}</span>

            <h5>${prod.titulo}</h5>

            <p class="text-success fw-bold">₡${prod.precio}</p>

            <button class="btn btn-ver mt-auto"
              onclick="verProducto('${prod.titulo}')">
              Ver más
            </button>

          </div>
        </div>
      </div>
    `;
  });
}

// ================== VER PRODUCTO ==================
function verProducto(titulo) {

  productoSeleccionado = productos.find(p => p.titulo === titulo);

  document.getElementById("modalTitulo").innerText = productoSeleccionado.titulo;
  document.getElementById("modalImagen").src = productoSeleccionado.imagen;
  document.getElementById("modalDescripcion").innerText = productoSeleccionado.descripcion;
  document.getElementById("modalPrecio").innerText = "₡" + productoSeleccionado.precio;
  document.getElementById("modalEstilo").innerText = productoSeleccionado.estilo;

  // TALLAS
  tallasContainer.innerHTML = "";

  productoSeleccionado.tallas.forEach(talla => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-light talla-option";
    btn.innerText = talla;

    btn.onclick = () => {
      document.querySelectorAll(".talla-option")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      btnAgregar.disabled = false;
    };

    tallasContainer.appendChild(btn);
  });

  btnAgregar.disabled = true;

  new bootstrap.Modal(document.getElementById("modalProducto")).show();
}

// ================== AGREGAR AL CARRITO ==================
function agregarConOpciones() {

  if (!productoSeleccionado) return;

  const talla = document.querySelector(".talla-option.active");

  if (!talla) {
    alert("Selecciona una opción");
    return;
  }

  const item = {
    nombre: productoSeleccionado.titulo,
    imagen: productoSeleccionado.imagen,
    precio: productoSeleccionado.precio,
    talla: talla.innerText,
    cantidad: 1
  };

  carrito.push(item);
  saveCart();
  updateBadge();
  renderCart();

  bootstrap.Modal.getInstance(
    document.getElementById("modalProducto")
  ).hide();
}

// GLOBAL
window.verProducto = verProducto;
window.agregarConOpciones = agregarConOpciones;

// ================== FILTROS ==================
botonesFiltro.forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".filtro")
      .forEach(b => b.classList.remove("activo"));

    btn.classList.add("activo");

    const filtro = btn.innerText;

    productosFiltrados = (filtro === "Todos")
      ? productos
      : productos.filter(p => p.estilo === filtro);

    mostrarProductos(productosFiltrados);
  });
});

// ================== BUSCADOR ==================
buscarInput.addEventListener("input", () => {

  const text = buscarInput.value.toLowerCase();

  const filtrados = productosFiltrados.filter(p =>
    p.titulo.toLowerCase().includes(text)
  );

  mostrarProductos(filtrados);
});