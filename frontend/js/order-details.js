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

  </div>

`;

} catch (error) {

console.log(error);

}

}