const params =
new URLSearchParams(
window.location.search
);

const orderId =
params.get("id");

loadOrder();

async function loadOrder() {

try {

const response =
await fetch(
  `${API_BASE_URL}/api/orders/${orderId}`
);

const order =
await response.json();

const itemsResponse =
await fetch(
  `${API_BASE_URL}/api/orders/${orderId}/items`
);

const items =
await itemsResponse.json();

let itemsHtml = "";
let total = 0;

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

document.querySelector(
  "#orderDetails"
).innerHTML = `

  <h1 class="text-3xl font-bold mb-4">
    Order #${order.id}
  </h1>

  <div class="space-y-2">

    <p>
      <strong>Status:</strong>
      ${order.status}
    </p>

    <p>
      <strong>Payment:</strong>
      ${order.payment_method.toUpperCase()}
    </p>

    <p>
      <strong>Name:</strong>
      ${order.full_name}
    </p>

    <p>
      <strong>Phone:</strong>
      ${order.phone_number}
    </p>

    <p>
      <strong>Address:</strong>
      ${order.street_address}
    </p>

    <p>
      <strong>City:</strong>
      ${order.city}
    </p>
    
    <hr class="my-4">

<h2 class="text-xl font-bold mb-2">
  Ordered Items
</h2>

<div class="space-y-2">
  ${itemsHtml}
</div>

<div
  class="mt-4
         pt-4
         border-t
         font-bold
         text-xl"
>
  Total: ₱${total}
</div>

  </div>

`;

} catch (error) {

console.log(error);

}

}