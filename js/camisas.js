// ================== VARIABLES ==================
let productos = [];
let carrito = [];
let productoSeleccionado = null;

const grid = document.getElementById("productosGrid");
const buscarInput = document.getElementById("buscarInput");
const botonesFiltro = document.querySelectorAll(".filtro");
const coloresContainer = document.getElementById("coloresContainer");
const tallasContainer = document.getElementById("tallasContainer");
const agregarCarritoBtn = document.getElementById("agregarCarritoBtn");

// ================== CARGAR JSON ==================
fetch("json/dataCamisas.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos(productos);
  })
  .catch(err => console.error("Error cargando productos:", err));

// ================== FUNCIONES ==================
function mostrarProductos(lista) {
  grid.innerHTML = "";
  if(lista.length === 0) {
    grid.innerHTML = `<p class="text-center text-muted">No se encontraron productos.</p>`;
    return;
  }

  lista.forEach((prod, index) => {
    grid.innerHTML += `
      <div class="col-md-6 col-lg-3">
        <div class="card producto-card shadow-sm h-100" onclick="verProducto(${index})">
          <img src="${prod.imagen}" alt="${prod.titulo}" class="card-img-top">
          <div class="card-body text-center d-flex flex-column">
            <h5>${prod.titulo}</h5>
            <p>${prod.precio}</p>
            <div class="mt-auto">
              <button class="btn btn-ver w-100">Ver más</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function verProducto(indice) {
  productoSeleccionado = productos[indice];
  document.getElementById("modalTitulo").innerText = productoSeleccionado.titulo;
  document.getElementById("modalImagen").src = productoSeleccionado.imagen;
  document.getElementById("modalDescripcion").innerText = productoSeleccionado.descripcion;

  // COLORES
  coloresContainer.innerHTML = "";
  productoSeleccionado.colores.forEach((color, i) => {
    const btn = document.createElement("button");
    btn.className = "color-option" + (i===0?" active":"");
    btn.style.background = color.hex;
    btn.dataset.color = color.nombre;
    btn.addEventListener("click", () => seleccionarColor(btn));
    coloresContainer.appendChild(btn);
  });

  // TALLAS
  tallasContainer.innerHTML = "";
  productoSeleccionado.tallas.forEach((talla, i) => {
    const btn = document.createElement("button");
    btn.className = "talla-option" + (i===0?" active":"");
    btn.innerText = talla;
    btn.addEventListener("click", () => seleccionarTalla(btn));
    tallasContainer.appendChild(btn);
  });

  const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
  modal.show();
}

function seleccionarColor(btn) {
  coloresContainer.querySelectorAll(".color-option").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function seleccionarTalla(btn) {
  tallasContainer.querySelectorAll(".talla-option").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function agregarConOpciones() {
  if(!productoSeleccionado) return;
  const color = coloresContainer.querySelector(".color-option.active").dataset.color;
  const talla = tallasContainer.querySelector(".talla-option.active").innerText;
  
  // Crear producto con opciones
  const item = {
    producto: productoSeleccionado,
    color,
    talla,
    cantidad: 1
  };
  console.log("Agregado al carrito:", item);
  alert(`Se agregó ${productoSeleccionado.titulo} (${color}, talla ${talla}) al carrito.`);
}

// ================== FILTROS ==================
botonesFiltro.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filtro.activo").classList.remove("activo");
    btn.classList.add("activo");
    const categoria = btn.dataset.categoria;
    if(categoria === "Todos") mostrarProductos(productos);
    else mostrarProductos(productos.filter(p => p.categoria === categoria));
  });
});

// ================== BUSCADOR ==================
buscarInput.addEventListener("keyup", () => {
  const texto = buscarInput.value.toLowerCase();
  mostrarProductos(productos.filter(p => p.titulo.toLowerCase().includes(texto)));
});