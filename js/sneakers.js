let productos = [];

const grid = document.getElementById("productosGrid");

fetch("json/dataSneakers.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos(productos);
  })
  .catch(err => console.error("Error cargando productos:", err));

function mostrarProductos(lista) {
  grid.innerHTML = "";
  if (lista.length === 0) {
    grid.innerHTML = `<p class="text-center text-muted">No se encontraron productos.</p>`;
    return;
  }

  lista.forEach((prod, index) => {
    grid.innerHTML += `
      <div class="col-md-6 col-lg-3">
        <div class="card shadow-sm h-100">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.titulo}">
          <div class="card-body text-center d-flex flex-column">
            <h5 class="fw-bold">${prod.titulo}</h5>
            <p class="text-pink fw-semibold">${prod.precio}</p>
            <div class="mt-auto">
              <button class="btn btn-ver btn-sm" onclick="verProducto(${index})">Ver más</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function verProducto(indice) {
  const prod = productos[indice];
  document.getElementById("modalTitulo").innerText = prod.titulo;
  document.getElementById("modalImagen").src = prod.imagen;
  document.getElementById("modalDescripcion").innerText = prod.descripcion;

  const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
  modal.show();
}


let colorSeleccionado = null;
let tallaSeleccionada = null;

// Selección de color
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("color-option")) {
    document.querySelectorAll(".color-option").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    colorSeleccionado = e.target.dataset.color;
  }

  if (e.target.classList.contains("talla-option")) {
    document.querySelectorAll(".talla-option").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    tallaSeleccionada = e.target.textContent;
  }
});

// Agregar con opciones
function agregarConOpciones() {
  if (!colorSeleccionado || !tallaSeleccionada) {
    alert("Seleccione talla y color");
    return;
  }

  console.log("Color:", colorSeleccionado);
  console.log("Talla:", tallaSeleccionada);

  // aquí puedes integrarlo con tu carrito
}