const tablaProductos = document.querySelector("#productos");
const formulario = document.querySelector("#formulario");
const valor = document.querySelector("#buscarEsto");
const inicio = document.querySelector("#inicio");
const categoriaSelect = document.querySelector("#categoria-select");
const tituloCategoria = document.querySelector("#categoriaSeleccionada");
let productosCantidad = document.querySelector("#cantidadProductos");
let articulosCarrito = [];
let jsonVic = [];
let bandera = true;
let filtros = [];
let filtro = "ofertas";
let banderaBusqueda = false;
let banderaFiltros = false;
let cantidadProductos = 0;
//Evenlisteners
evenlisteners();
function evenlisteners() {
  tablaProductos.addEventListener("click", agregar);
  formulario.addEventListener("submit", buscar);
  valor.addEventListener("change", validacion);
  inicio.addEventListener("click", cargarProductos);

  categoriaSelect.addEventListener("input", cargarCategoria);

  articulosCarrito = JSON.parse(localStorage.getItem("articulosCarrito")) || [];
}

function cargarProductos() {
  vaciarMain();
  fetch("articulos.json")//https://apiconexxion-default-rtdb.firebaseio.com/articulos.json
    .then((respuesta) => respuesta.json())
    .then((productos) => {
      cantidadProductos = 0;
      productos.forEach((producto, index) => {
        let bandera = true;
        let banderaInsert = false;
        const card2 = document.createElement("div");
        if (banderaFiltros) {
          filtros.forEach((filtro) => {
            console.log(filtro);
            if (producto.titulo.indexOf(filtro) != -1) {
              console.log("desde filtro afirmativo");
              banderaBusqueda = false;
            }
          });
        } else {
          if (filtro == "todas") {
            banderaBusqueda = false;
          } else {
            for (let index = 0; index < producto.categorias.length; index++) {
              if (producto.categorias[index] == filtro) {
                banderaBusqueda = false;
                break;
              } else {
                banderaBusqueda = true;
              }
              console.log(banderaBusqueda);
            }
          }
        }

        if (articulosCarrito.length > 0 && !banderaBusqueda) {
          articulosCarrito.forEach((productoCarro) => {
            if (producto.producto === productoCarro.titulo && bandera) {
              card2.innerHTML += `
                    <div class="card2 shadow rounded cardExpan contenedor">
                        <div class="imgBox">
                            <img src="${producto.imagen}" alt="">
                            <div class="marcaAgua"><div  class="marcaLogo">CONEXXIÓN</div><span class="marcaLogoMayorista">Mayorista</span></div>
                        </div>
                        <div class="detalle">
                            <div class="title">
                                <h3>${producto.titulo}</h3>
                                    <div class="price">
                           
                                        <span>${producto.precio}</span>
                                    </div>
                                
                            </div>
                            <div class="btn btn2 text-wrap agregar-carrito btn2-danger" data-id="${producto.id}">Quitar del carrito</div>
                        </div>
                    </div>
                    `;
              bandera = false;
              banderaInsert = true;
            }
          });
        }
        if (bandera && !banderaBusqueda) {
          card2.innerHTML += `
                    <div class="card2 shadow rounded cardExpan contenedor">
                        <div class="imgBox">
                            <img src="${producto.imagen}" alt="">
                            <div class="marcaAgua"><div  class="marcaLogo">CONEXXIÓN</div><span class="marcaLogoMayorista">Mayorista</span></div>
                        </div>
                        <div class="detalle">
                            <div class="title">
                                <h3>${producto.titulo}</h3>
                                    <div class="price">
                           
                                        <span>${producto.precio}</span>
                                    </div>
                                
                            </div>
                            <div class="btn btn2 text-wrap agregar-carrito" data-id="${producto.id}">Agregar al carrito</div>
                        </div>
                    </div>
                    `;
          banderaInsert = true;
        }

        if (banderaInsert) {
          tablaProductos.appendChild(card2);
          cantidadProductos++;
          console.log(cantidadProductos);

          switch (filtro) {
            case "todas":
              tituloCategoria.innerHTML = `<h2>Todas las Categorías</h2><span id="cantidadProductos" style="font-size:1em;  line-height:-10px ;">${cantidadProductos} productos</span>`;
              break;
            case "ofertas":
              tituloCategoria.innerHTML = `<h2>Ofertas</h2><span id="cantidadProductos" style="font-size:1em;  line-height:-10px ;">${cantidadProductos} productos</span>`;
              break;
            case "elec-electri":
              tituloCategoria.innerHTML = `<h2>Electricidad y Electronica</h2><span id="cantidadProductos" style="font-size:1em;  line-height:-10px ;">${cantidadProductos} productos</span>`;
              break;
            case "acc-celulares":
              tituloCategoria.innerHTML = `<h2>Accesorios para Celulares</h2><span id="cantidadProductos" style="font-size:1em;  line-height:-10px ;">${cantidadProductos} productos</span>`;
              break;
            case "acc-pc":
              tituloCategoria.innerHTML = `<h2>Accesorios para PC</h2><span id="cantidadProductos" style="font-size:1em;  line-height:-10px ;">${cantidadProductos} productos</span>`;
              break;
            case "herr-rep":
              tituloCategoria.innerHTML = `<h2>Herramientas y Repuestos</h2><span id="cantidadProductos" style="font-size:1em;  line-height:-10px ;">${cantidadProductos} productos</span>`;
              break;
            case "hobbie":
              tituloCategoria.innerHTML = `<h2>Hobbie</h2><span id="cantidadProductos" style="font-size:1em;  line-height:-10px ;">${cantidadProductos} productos</span>`;
              break;
            case "otros":
              tituloCategoria.innerHTML = `<h2>Otras Categorias</h2><span id="cantidadProductos" style="font-size:1em;  line-height:-10px ;">${cantidadProductos} productos</span>`;
              break;
            default:
              break;
          }
        }
        banderaBusqueda = true;
      });
      banderaBusqueda = false;
      filtro = "";
      filtros = [];
      banderaFiltros = false;
    });
}
cargarProductos();

function cargarCategoria(e) {
  console.log(e.target.value);
  filtro = e.target.value;

  cargarProductos();
  setTimeout(() => {}, 2000);
}

function buscar(e) {
  e.preventDefault();

  const filtro1 = valor.value;

  if (filtro1.trim() != "") {
    tituloCategoria.innerHTML = `Su Busqueda: ${filtro1}.`;
    banderaFiltros = true;
    const filtroEspecifico = filtro1.toUpperCase().trim().split(" ");
    console.log(filtroEspecifico);
    const filtro2 = [];
    filtroEspecifico.forEach((palabra) => {
      if (
        palabra !== "DE" &&
        palabra !== "DEL" &&
        palabra !== "PARA" &&
        palabra !== "EL" &&
        palabra !== "LA" &&
        palabra.trim() !== ""
      ) {
        filtros.push(palabra);
      }
    });
    console.log(filtros);

    banderaBusqueda = true;
    cargarProductos();
  }
}
function validacion(e) {
  e.preventDefault();
  console.log("hola desde validacion");
  console.log(e.target.value);
}
function vaciarMain() {
  while (tablaProductos.firstChild) {
    tablaProductos.removeChild(tablaProductos.firstChild);
  }
}
function agregar(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
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
      // cambio de color del boton y mensaje
      e.target.classList.toggle("btn2-danger");
      e.target.textContent = "Agregar al carrito";

      console.log("Producto Eliminado");
      console.log(articulosCarrito);
    } else {
      const producto = e.target.parentElement.parentElement;
      //Enviamos el producto selecionado para tomar sus datos
      leerDatosproducto(producto);
      localStorage.setItem(
        "articulosCarrito",
        JSON.stringify(articulosCarrito)
      );
      // cambio de color del boton y mensaje
      e.target.classList.toggle("btn2-danger");
      e.target.textContent = "Quitar del carrito";
    }
  }
}

function leerDatosproducto(producto) {
  let infoProducto = {
    imagen: producto.querySelector("img").src,
    titulo: producto.querySelector("h3").textContent,
    precio: producto.querySelector(".price span").textContent,
    id: producto
      .querySelector(".detalle .agregar-carrito")
      .getAttribute("data-id"),
    cantidad: 0,
  };
  articulosCarrito.push(infoProducto); //= [...articulosCarrito, infoCurso];
  console.log(articulosCarrito);
}
