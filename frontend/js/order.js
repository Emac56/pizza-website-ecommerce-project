async function placeOrder() {

const isStreetValid =
validateStreetAddress();

if (!isStreetValid) {

return;

}

const isCityValid =
validateCity();

if (!isCityValid) {

return;

}

const isZipValid =
validateZipCode();

if (!isZipValid) {

return;

}

const paymentMethod =
document.querySelector(
"#paymentMethod"
).value;

if (
paymentMethod === "gcash"
) {

const isGcashValid =
validateGcashNumber();

if (!isGcashValid) {

  return;

}

}

if (
paymentMethod === "bank"
) {

const isBankNameValid =
validateBankName();

if (!isBankNameValid) {

  return;

}

const isBankAccountValid =
validateBankAccountNumber();

if (!isBankAccountValid) {

  return;

}

}

if (
paymentMethod === "paypal"
) {

const isPaypalValid =
validatePaypalEmail();

if (!isPaypalValid) {

  return;

}

}

const userId =
localStorage.getItem(
"userId"
);

const cartKey =
`cart_${userId}`;

const cart =
JSON.parse(
  localStorage.getItem(cartKey)
) || [];


const fullName =
document.querySelector(
"#fullName"
).value;

const phoneNumber =
document.querySelector(
"#phoneNumber"
).value;

const streetAddress =
document.querySelector(
"#streetAddress"
).value;

const city =
document.querySelector(
"#city"
).value;

const zipCode =
document.querySelector(
"#zipCode"
).value;

let paymentDetails =
"";

if (
paymentMethod === "gcash"
) {

paymentDetails =
document.querySelector(
  "#gcashNumber"
).value;

}

else if (
paymentMethod === "bank"
) {

const bankName =
document.querySelector(
  "#bankName"
).value;

const accountNumber =
document.querySelector(
  "#bankAccountNumber"
).value;

paymentDetails =
`${bankName} - ${accountNumber}`;

}

else if (
paymentMethod === "paypal"
) {

paymentDetails =
document.querySelector(
  "#paypalEmail"
).value;

}

try {

const response =
await fetch(
  `${API_BASE_URL}api/orders`,
  {

    method: "POST",

    headers: {

      "Content-Type":
      "application/json"

    },

    body: JSON.stringify({

  user_id:
  userId,

  full_name:
  fullName,

  phone_number:
  phoneNumber,

  street_address:
  streetAddress,

  city,

  zip_code:
  zipCode,

  payment_method:
  paymentMethod,

  payment_details:
  paymentDetails,

  items:
  cart

})

  }
);

const data =
await response.json();

alert(
  "Thank you! Order successful"
);

const cartKey =
`cart_${userId}`;

localStorage.removeItem(
  cartKey
);

window.location.href =
"index.html";

} catch (error) {

console.log(error);

}

}

function validatePaypalEmail() {

const paypalEmail =
document.querySelector(
"#paypalEmail"
).value.trim();

const error =
document.querySelector(
"#paypalError"
);

error.textContent = "";

if (!paypalEmail) {

error.textContent =
"Input cannot be empty";

return false;

}

return true;

}

function validateBankName() {

const bankName =
document.querySelector(
"#bankName"
).value.trim();

const error =
document.querySelector(
"#bankNameError"
);

error.textContent = "";

if (!bankName) {

error.textContent =
"Input cannot be empty";

return false;

}

return true;

}

function validateBankAccountNumber() {

const accountNumber =
document.querySelector(
"#bankAccountNumber"
).value.trim();

const error =
document.querySelector(
"#bankAccountError"
);

error.textContent = "";

if (!accountNumber) {

error.textContent =
"Input cannot be empty";

return false;

}

return true;

}

function validateGcashNumber() {

const gcashNumber =
document.querySelector(
"#gcashNumber"
).value.trim();

const error =
document.querySelector(
"#gcashError"
);

error.textContent = "";

if (!gcashNumber) {

error.textContent =
"Input cannot be empty";

return false;

}

return true;

}

function validateZipCode() {

const zipCode =
document.querySelector(
"#zipCode"
).value.trim();

const error =
document.querySelector(
"#zipCodeError"
);

error.textContent = "";

if (!zipCode) {

error.textContent =
"Input cannot be empty";

return false;

}

return true;

}

function validateCity() {

const city =
document.querySelector(
"#city"
).value.trim();

const error =
document.querySelector(
"#cityError"
);

error.textContent = "";

if (!city) {

error.textContent =
"Input cannot be empty";

return false;

}

return true;

}

function validateStreetAddress() {

const streetAddress =
document.querySelector(
"#streetAddress"
).value.trim();

const error =
document.querySelector(
"#streetAddressError"
);

error.textContent = "";

if (!streetAddress) {

error.textContent =
"Input cannot be empty";

return false;

}

return true;

}

function togglePaymentFields() {

let method =
document.getElementById(
"paymentMethod"
).value;

document
.getElementById(
"gcashFields"
)
.classList.add("hidden");

document
.getElementById(
"bankFields"
)
.classList.add("hidden");

document
.getElementById(
"paypalFields"
)
.classList.add("hidden");

if (method === "gcash") {

document
.getElementById(
  "gcashFields"
)
.classList.remove(
  "hidden"
);

}

else if (
method === "bank"
) {

document
.getElementById(
  "bankFields"
)
.classList.remove(
  "hidden"
);

}

else if (
method === "paypal"
) {

document
.getElementById(
  "paypalFields"
)
.classList.remove(
  "hidden"
);

}

}

loadUserData();

async function loadUserData() {

const userId =
localStorage.getItem(
"userId"
);

if (!userId) return;

try {

const response =
await fetch(
  `${API_BASE_URL}api/users/${userId}`
);

const user =
await response.json();

document.querySelector(
  "#fullName"
).value =
user.name;

document.querySelector(
  "#phoneNumber"
).value =
user.phone;

document.querySelector(
  "#fullName"
).disabled =
true;

document.querySelector(
  "#phoneNumber"
).disabled =
true;

} catch (error) {

console.log(error);

}

}

