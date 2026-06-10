loadOrders();

function getStatusBadge(status) {

  switch (status) {

    case "Pending":
      return `
        <span
          class="bg-yellow-100
                 text-yellow-700
                 px-3 py-1
                 rounded-full"
        >
          Pending
        </span>
      `;

    case "Preparing":
      return `
        <span
          class="bg-orange-100
                 text-orange-700
                 px-3 py-1
                 rounded-full"
        >
          Preparing
        </span>
      `;

    case "Out for Delivery":
      return `
        <span
          class="bg-blue-100
                 text-blue-700
                 px-3 py-1
                 rounded-full"
        >
          Out for Delivery
        </span>
      `;

    case "Delivered":
      return `
        <span
          class="bg-green-100
                 text-green-700
                 px-3 py-1
                 rounded-full"
        >
          Delivered
        </span>
      `;

    case "Cancelled":
      return `
        <span
          class="bg-red-100
                 text-red-700
                 px-3 py-1
                 rounded-full"
        >
          Cancelled
        </span>
      `;

    default:
      return `
        <span
          class="bg-gray-100
                 text-gray-700
                 px-3 py-1
                 rounded-full"
        >
          Status Unavailable
        </span>
      `;
  }

}


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

    total +=
      Number(item.price) *
      Number(item.quantity);

    itemsHtml += `
      <p>
        ${item.name} × ${item.quantity}
      </p>
    `;

  }

  ordersContainer.innerHTML += `
    <div class="bg-white rounded-3xl p-6 shadow">

      <div class="flex justify-between items-center">

        <div>

          <h2 class="text-xl font-bold">
            Order #${order.id}
          </h2>

          <p class="text-gray-500">
            ${new Date(
              order.created_at
            ).toLocaleDateString()}
          </p>

        </div>

<div class="flex gap-2">

  ${getStatusBadge(order.status)}

  <span
    class="bg-gray-100
           text-gray-700
           px-3 py-1
           rounded-full"
  >
    ${order.payment_method.toUpperCase()}
  </span>

</div>

      </div>

      <div class="mt-4 space-y-2">
        ${itemsHtml}
      </div>

      <div class="mt-4 pt-4 border-t font-bold text-lg">
        Total: ₱${total}
      </div>

    </div>
  `;

}

} catch (error) {

console.log(error);

}

}