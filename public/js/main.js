
const socket = io();


function renderProductos(info) {
  const productosLista = document.getElementById("productos_lista");
  productosLista.innerHTML = "";

  info.forEach(producto => {
    const productoDiv = createProductoDiv(producto);
    productosLista.appendChild(productoDiv);
  });
}


function createProductoDiv(producto) {
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>${producto.title}</h3>
    <p>${producto.price}</p>
    <p>${producto.description}</p>
  `;
  return div;
}

socket.on("getProductos", renderProductos);
