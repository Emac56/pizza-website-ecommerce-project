let allProducts = [];
let cart = [];
let toastTimeout;

async function fetchPizzas() {

  try {

    const response =
    await fetch("http://192.168.1.7:5000/api/pizzas");

    allProducts = await response.json();

    renderProducts(allProducts);

  } catch (error) {

    console.log(error);

  }

}

function renderProducts(products) {

  const pizzaContainer =
  document.querySelector("#pizzaContainer");

  pizzaContainer.innerHTML = "";

  products.forEach((pizza) => {

    pizzaContainer.innerHTML += `

      <article class="card group flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        <div class="overflow-hidden rounded-2xl">

          <img
            src="images/${pizza.image}" loading="lazy"
            class="thumb h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          >

        </div>

        <div class="mt-4 flex flex-1 flex-col">

          <div class="title text-lg font-black text-[#111]">

            ${pizza.name}

          </div>

          <div class="meta mt-1 text-sm text-gray-500">

            ${pizza.description}

          </div>

          <div class="actions mt-5 flex items-center justify-between">

            <div class="price text-xl font-black text-[#111]">

              ₱${pizza.price}

            </div>

            <button onclick="addToCart(${pizza.id})"
              class="add rounded-2xl bg-[#0ea5b3] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#0891a0]">

              Add

            </button>

          </div>

        </div>

      </article>

    `;

  });

}

function addToCart(productId) {
  let selectedProduct;


  const existingProduct =
  cart.find((item) => {

    return item.id == productId;

  });

  if (existingProduct) {

    existingProduct.quantity += 1;
    selectedProduct = existingProduct;

  } else {

    const product =
    allProducts.find((item) => {

      return item.id == productId;

    });
    selectedProduct = product;

    cart.push({
      ...product,
      quantity: 1
    });

  }

  renderCart();
showToast(selectedProduct);

}
function renderCart() {

  const cartItems =
  document.querySelector("#cartItems");

  const cartTitle =
  document.querySelector("#cartTitle");

  const cartTotal =
   document.querySelector("#cartTotal");

  cartItems.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  cart.forEach((item) => {

    total += Number(item.price) * item.quantity;
    totalItems += item.quantity;

    cartItems.innerHTML += `

<div class="mb-4 flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm">

<div class="flex min-w-0 flex-1 items-center gap-3">

    <img
      src="images/${item.image}"
      class="h-16 w-16 rounded-xl object-cover"
    >

<div class="min-w-0 flex-1">

<h4 class="truncate text-sm font-bold text-[#111]">

        ${item.name}

      </h4>

      <p class="text-sm text-gray-500">

        ₱${item.price}

      </p>

    </div>

  </div>
<div class="ml-auto flex flex-col items-center gap-2">

  <button
    onclick="increaseQuantity(${item.id})"
    class="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0ea5b3] text-sm font-black text-white transition hover:bg-[#0891a0]"
  >
    +
  </button>

  <span
    class="rounded-xl bg-gray-100 px-2 py-1 text-xs font-bold"
  >
    x${item.quantity}
  </span>

  <button
    onclick="decreaseQuantity(${item.id})"
    class="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-sm font-black text-[#111] transition hover:bg-gray-200"
  >
    -
  </button>

</div>
`;
  });

  cartTotal.textContent = `₱${total}`;
  cartTitle.textContent = `Your cart (${totalItems})`;
}

fetchPizzas();


const allBtn =
document.querySelector("#allBtn");

const pizzaBtn =
document.querySelector("#pizzaBtn");

const pastaBtn =
document.querySelector("#pastaBtn");

const sidesBtn =
document.querySelector("#sidesBtn");

const drinksBtn =
document.querySelector("#drinksBtn");

allBtn.addEventListener("click", () => {

  renderProducts(allProducts);

});

pizzaBtn.addEventListener("click", () => {

  const filtered =
  allProducts.filter((product) => {

    return product.category === "Pizza";

  });

  renderProducts(filtered);

});

pastaBtn.addEventListener("click", () => {

  const filtered =
  allProducts.filter((product) => {

    return product.category === "Pasta";

  });

  renderProducts(filtered);

});

sidesBtn.addEventListener("click", () => {

  const filtered =
  allProducts.filter((product) => {

    return product.category === "Sides";

  });

  renderProducts(filtered);

});

drinksBtn.addEventListener("click", () => {

  const filtered =
  allProducts.filter((product) => {

    return product.category === "Drinks";

  });

  renderProducts(filtered);

});

function showToast(product) {

  const toast =
  document.querySelector("#toast");
  
  const toastBg =
  document.querySelector("#toastBg");

  const toastTitle =
  document.querySelector("#toastTitle");

  const toastMessage =
  document.querySelector("#toastMessage");


  let totalItems = 0;

  cart.forEach((item) => {

    totalItems += item.quantity;

  });

  toastTitle.textContent =
  `${product.name} added`;

  toastMessage.textContent =
  `${totalItems} item${totalItems > 1 ? "s" : ""} in your order`;

  toastBg.src = `images/${product.image}`;

  toast.classList.remove(
    "opacity-0",
    "translate-y-[-40px]"
  );

  toast.classList.add(
    "opacity-100",
    "translate-y-[0px]"
  );


clearTimeout(toastTimeout);

toastTimeout = setTimeout(() => {

  toast.classList.remove(
    "opacity-100",
    "translate-y-[0px]"
  );

  toast.classList.add(
    "opacity-0",
    "translate-y-[-40px]"
  );

}, 3500);

}
function increaseQuantity(productId) {

  const product =
  cart.find((item) => {

    return item.id == productId;

  });

  if (product) {

    product.quantity += 1;

    renderCart();

  }

}

function decreaseQuantity(productId) {

  const product =
  cart.find((item) => {

    return item.id == productId;

  });

  if (!product) {
    return;
  }

  product.quantity -= 1;

  if (product.quantity <= 0) {

    cart = cart.filter((item) => {

      return item.id != productId;

    });

  }

  renderCart();

} 

function clearCart() {

  const confirmClear =
  confirm(
    "Are you sure you want to clear your cart?"
  );

  if (!confirmClear) {
    return;
  }

  cart = [];

  renderCart();

}
