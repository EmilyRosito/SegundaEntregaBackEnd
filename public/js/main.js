
const socket = io();


function renderProducts(data) {
  const productsList = document.getElementById("products_list");
  productsList.innerHTML = "";

  data.forEach(product => {
    const productDiv = createProductDiv(product);
    productsList.appendChild(productDiv);
  });
}


function createProductDiv(product) {
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>${product.title}</h3>
    <p>${product.price}</p>
    <p>${product.description}</p>
  `;
  return div;
}

socket.on("getProducts", renderProducts);
