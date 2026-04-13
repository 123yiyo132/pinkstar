let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const lista = document.getElementById("listaCarrito");
const totalEl = document.getElementById("totalCarrito");

const nombre = document.getElementById("clienteNombre");
const direccion = document.getElementById("clienteDireccion");
const telefono = document.getElementById("clienteTelefono");

const btnWsp = document.getElementById("btnWsp");

let totalGlobal = 0;
let facturaVista = false;

// =====================
// RENDER PRO CON IMAGEN
// =====================
function render() {

  // 🔥 SI NO HAY LISTA, EVITA ERROR
  if (!lista || !totalEl) return;

  lista.innerHTML = "";
  totalGlobal = 0;

  // 🚨 CARRO VACÍO
  if (!carrito || carrito.length === 0) {
    lista.innerHTML = `
      <div class="empty">
        🛒 No hay productos en el carrito
      </div>
    `;
    totalEl.innerText = "₡0";
    return;
  }
  carrito.forEach((p, i) => {

    const sub = p.precio * p.cantidad;
    totalGlobal += sub;

    lista.innerHTML += `
      <div class="cart-item">

        <!-- IMAGEN -->
        <div class="img-box">
          <img src="${p.imagen}" alt="${p.nombre}">
        </div>

        <!-- INFO -->
        <div class="info">
          <h6>${p.nombre}</h6>
          <small>Talla: ${p.talla}</small>

          <div class="qty">
            <button onclick="changeQty(${i},-1)">-</button>
            <span>${p.cantidad}</span>
            <button onclick="changeQty(${i},1)">+</button>
          </div>
        </div>

        <!-- PRECIO -->
        <div class="price">
          ₡${sub}
        </div>

        <button class="remove" onclick="removeItem(${i})">✕</button>

      </div>
    `;
  });

  totalEl.innerText = "₡" + totalGlobal;
}

// =====================
// CAMBIAR CANTIDAD
// =====================
function changeQty(i, val){
  carrito[i].cantidad += val;

  if(carrito[i].cantidad <= 0){
    carrito.splice(i,1);
  }

  save();
  render();
}

// =====================
// ELIMINAR
// =====================
function removeItem(i){
  carrito.splice(i,1);
  save();
  render();
}

// =====================
// GUARDAR
// =====================
function save(){
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// =====================
// CLIENTE
// =====================
function getCliente(){
  return {
    nombre:nombre.value,
    direccion:direccion.value,
    telefono:telefono.value
  };
}

// =====================
// PDF (MEJORADO)
// =====================
async function generarPDF(){

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const c = getCliente();

  let y = 20;
  let total = 0;

  doc.setFillColor(15,15,15);
  doc.rect(0,0,210,40,"F");

  doc.setTextColor(255,255,255);
  doc.setFontSize(20);
  doc.text("PINK STAR",20,20);

  doc.setFontSize(10);
  doc.text("FACTURA OFICIAL",20,30);

  y = 55;

  // CLIENTE
  doc.setTextColor(0);
  doc.setFillColor(240,240,240);
  doc.rect(15,y-10,180,30,"F");

  doc.text("Cliente: " + c.nombre,20,y);
  doc.text("Dirección: " + c.direccion,20,y+8);
  doc.text("Tel: " + c.telefono,20,y+16);

  y += 40;

  carrito.forEach(p => {

    const sub = p.precio * p.cantidad;
    total += sub;

    doc.setFontSize(12);
    doc.text(p.nombre,20,y);

    doc.setFontSize(10);
    doc.text("Talla: " + p.talla,20,y+7);
    doc.text("Cantidad: " + p.cantidad,20,y+14);
    doc.text("" + sub,160,y+10);

    y += 25;
  });

  doc.setFillColor(0);
  doc.rect(15,y+5,180,20,"F");

  doc.setTextColor(255,255,255);
  doc.setFontSize(14);
  doc.text("" + total,20,y+18);

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "factura.pdf";
  a.click();

  document.getElementById("pdfFrame").src = url;
  new bootstrap.Modal(document.getElementById("modalPDF")).show();

  facturaVista = true;
  btnWsp.disabled = false;
}

// =====================
// WHATSAPP LIMPIO
// =====================
function abrirWhatsApp(){

  const c = getCliente();

  let msg =
`PINK STAR - FACTURA

Cliente: ${c.nombre}
Direccion: ${c.direccion}
Telefono: ${c.telefono}

PRODUCTOS:
`;

  carrito.forEach(p=>{
    msg += `- ${p.nombre} | Talla ${p.talla} | x${p.cantidad} - ₡${p.precio*p.cantidad}\n`;
  });

  msg += `\nTOTAL: ₡${totalGlobal}`;

  window.open(
    "https://wa.me/50661913525?text=" + encodeURIComponent(msg),
    "_blank"
  );
}

// INIT
render();


