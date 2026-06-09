
loadOrders();

async function loadOrders() {

  const userId =
  localStorage.getItem("userId");

  if (!userId) {
    return;
  }

  try {

    const response =
    await fetch(
      `${API_BASE_URL}/api/orders/user/${userId}`
    );

    const orders =
    await response.json();

    const ordersContainer =
document.querySelector(
  "#ordersContainer"
);

ordersContainer.innerHTML = "";


console.log(items);

for (const order of orders) {
  
  const itemsResponse =
await fetch(
  `${API_BASE_URL}/api/orders/${order.id}/items`
);

const items =
await itemsResponse.json();

  
let total = 0;

let itemsHtml = "";

for (const item of items) {
  
  total += Number(item.price) * Number(item.quantity);

  itemsHtml += `
  
    <p>
      ${item.name} × ${item.quantity}
    </p>

  `;

}

  ordersContainer.innerHTML += `
  
  <div
    class="bg-white
           rounded-3xl
           p-6
           shadow"
  >

    <div
      class="flex
             justify-between
             items-center"
    >

      <div>

        <h2
          class="text-xl
                 font-bold"
        >
          Order #${order.id}
        </h2>

        <p
          class="text-gray-500"
        >
          ${new Date(
            order.created_at
          ).toLocaleDateString()}
        </p>

      </div>

      <span
        class="bg-yellow-100
               text-yellow-700
               px-3 py-1
               rounded-full"
      >
        ${order.payment_method.toUpperCase()}
      </span>

    </div>

<div
  class="mt-4
         space-y-2"
>

  ${itemsHtml}

</div>

<div
  class="mt-4
         pt-4
         border-t
         font-bold
         text-lg"
>
  Total: ₱${total}
</div>

</div>

  `;

}

  }

  catch (error) {

    console.log(error);

  }

}