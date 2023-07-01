const tablaCarrito = document.querySelector("#tablaCarrito");
const totalHTML = document.querySelector("#totalHTML");
let pedidoAEnviar;
let carritoWpp = [];
let articulosCarrito = [];
let total = 0;

eventListeners2();
function eventListeners2() {
  //Cuando arranca la App
  tablaCarrito.addEventListener("click", eliminar);

  document.addEventListener("DOMContentLoaded", () => {
    const articulosCarritoPrev =
      JSON.parse(localStorage.getItem("articulosCarrito")) || [];
    articulosCarritoPrev.forEach((curso) => articulosCarrito.push(curso));
    carritoHTML();
    calcularTotal();
  });
}

function carritoHTML() {
  articulosCarrito.forEach((producto) => {
    const card = document.createElement("div");
    card.innerHTML += `
        <div class="card2 contenedor cardCarrito mb-4 shadow rounded">
        <div class="imgBox">
          <img
            src="${producto.imagen}"
            style="height: 150px; width: 150px"
            alt=""
          />
          <div class="marcaAgua"><div  class="marcaLogo">CONEXXIÓN</div><span class="marcaLogoMayorista">Mayorista</span></div>
        </div>
        <div class="detalle detalleCarrito flex">
          <div>
            <div class="title">
              <h3>${producto.titulo}</h3>
            </div>

            
              <div class="price">
                <span>${producto.precio}</span>
              </div>
            
          </div>

          
            <div class="form-group">
              <label for="gasto">Cantidad:</label>
              <input
                type="number"
                class="form-control"
                name="${producto.id}"
                placeholder="${producto.cantidad}"
                style="width: 150px"
                onchange="cantidad(event)"
                />
            </div>
          
          <div>
            <div class="btn btn2 text-wrap mt-2 btn2-danger eliminar-carrito" data-id="${producto.id}">Eliminar</div>
          </div>
        </div>
      </div>
            
            `;
    tablaCarrito.appendChild(card);
  });
}
function enviarPedido() {
  articulosCarrito.forEach((producto) => {
    //  Armado del pedido de Whatsapp
    const pedir = producto.titulo;
    const pedido = pedir.split(" ");
    console.log(pedido);
    //  Ingresamos los requerimientos de Wpp
    const pedidoWpp = pedido.join("%20");
    console.log(pedidoWpp);
    carritoWpp.push(producto.cantidad + "%20" + pedidoWpp + "%20---%20");
    console.log(carritoWpp);
  });
  //       Texto a enviar por Wpp
  const pedidoWpp2 = carritoWpp.join("%20");
  const totalWpp = total.toFixed(2).toString().replace(".", "");
  console.log(pedidoWpp2);
  pedidoAEnviar = `https://wa.me/5493884324235/?text=Hola%20CONEXXIÓN%20mi%20pedido%20Id:432${totalWpp}127%20es:%20${pedidoWpp2}%20Gracias.`;
  console.log(pedidoAEnviar);
  window.location.href = pedidoAEnviar;
}

function eliminar(e) {
  e.preventDefault();
  if (e.target.classList.contains("eliminar-carrito")) {
    if (e.target.classList.contains("btn2-danger")) {
      const productoId = e.target.getAttribute("data-id");

      // Eliminar producto del carrito
      articulosCarrito = articulosCarrito.filter(
        (producto) => producto.id !== productoId
      );
      localStorage.setItem(
        "articulosCarrito",
        JSON.stringify(articulosCarrito)
      );
      vaciarCarrito();
      carritoHTML();
      calcularTotal();

      console.log("Producto Eliminado");
      console.log(articulosCarrito);
    }
  }
}
function eliminarCarrito() {
  console.log("hola desde eliminarCarrito");
  articulosCarrito = [];
  localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
  vaciarCarrito();
  carritoHTML();
  calcularTotal();
}
function vaciarCarrito() {
  while (tablaCarrito.firstChild) {
    tablaCarrito.removeChild(tablaCarrito.firstChild);
  }
}

// Cargar cantidades
function cantidad(event) {
  const idCantidades = event.target.name;
  articulosCarrito = articulosCarrito.map((producto) => {
    if (producto.id === idCantidades) {
      producto.cantidad = event.target.value;
    }
    return producto;
  });
  localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
  console.log(articulosCarrito);
  calcularTotal();
}

function calcularTotal() {
  total = 0;
  articulosCarrito.forEach((producto) => {
    if (producto.cantidad != 0 || producto.cantidad !== NaN) {
      console.log(producto.precio.slice(producto.precio.indexOf(",")));
      total =
        total + Number(producto.precio.slice(1)) * Number(producto.cantidad);
    }
  });
  console.log(total);
  totalHTML.textContent = Number(total.toFixed(2));
}
