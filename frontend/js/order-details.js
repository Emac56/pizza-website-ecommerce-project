const params =
new URLSearchParams(
  window.location.search
);

const orderId =
params.get("id");

console.log(orderId);

fetch(
  `${API_BASE_URL}/api/orders/${orderId}/items`
)