let productos = [];
let productosFiltrados = [];
let productoActivo = null;

const grid = document.getElementById("productosGrid");

// =======================
// CARGAR PRODUCTOS
// =======================
async function cargarProductos() {
  try {
    grid.innerHTML = `<p class="text-muted text-center">Cargando productos...</p>`;

    const res = await fetch("json/dataSneakers.json");
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();

    productos = Array.isArray(data)
      ? data.filter(p => p?.titulo && p?.precio && p?.imagen)
      : [];

    productosFiltrados = [...productos];

    render(productosFiltrados);

  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="text-danger text-center">Error cargando productos</p>`;
  }
}

// =======================
// RENDER
// =======================
function render(list) {
  grid.innerHTML = "";

  list.forEach((prod) => {
    grid.innerHTML += `
      <div class="col-md-6 col-lg-3">
        <div class="card producto-card h-100">

          <img src="${prod.imagen}" loading="lazy">

          <div class="card-body text-center d-flex flex-column">

            <h5>${prod.titulo}</h5>

            <p class="precio">${prod.precio}</p>

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

// =======================
// VER PRODUCTO
// =======================
function verProducto(titulo) {

  productoActivo = productos.find(p => p.titulo === titulo);
  if (!productoActivo) return;

  document.getElementById("modalTitulo").innerText = productoActivo.titulo;
  document.getElementById("modalImagen").src = productoActivo.imagen;
  document.getElementById("modalDescripcion").innerText = productoActivo.descripcion || "";
  document.getElementById("modalPrecio").innerText = productoActivo.precio;

  reset();

  new bootstrap.Modal(document.getElementById("modalProducto")).show();
}

// =======================
// RESET
// =======================
function reset() {
  document.querySelectorAll(".talla-option").forEach(b => b.classList.remove("active"));
  tallaSeleccionada = null;
}

// =======================
// TALLA
// =======================
let tallaSeleccionada = null;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("talla-option")) {
    document.querySelectorAll(".talla-option").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    tallaSeleccionada = e.target.textContent;
  }
});

// =======================
// AGREGAR AL CARRITO
// =======================
function agregarConOpciones() {

  if (!productoActivo) return alert("No hay producto");

  if (!tallaSeleccionada) return alert("Selecciona talla");

  addToCart({
    nombre: productoActivo.titulo,
    imagen: productoActivo.imagen,
    precio: productoActivo.precio,
    talla: tallaSeleccionada
  });

  bootstrap.Modal.getInstance(document.getElementById("modalProducto"))?.hide();
}

// =======================
// FILTROS
// =======================
document.querySelectorAll(".filtro").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".filtro").forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");

    const filtro = btn.textContent.trim();

    productosFiltrados = filtro === "Todos"
      ? [...productos]
      : productos.filter(p => p.categoria === filtro);

    render(productosFiltrados);
  });
});

// =======================
// BUSCADOR
// =======================
document.getElementById("buscarInput").addEventListener("input", (e) => {

  const text = e.target.value.toLowerCase();

  render(productosFiltrados.filter(p =>
    p.titulo.toLowerCase().includes(text)
  ));
});

// =======================
// INIT
// =======================
cargarProductos();
window.verProducto = verProducto;
window.agregarConOpciones = agregarConOpciones;