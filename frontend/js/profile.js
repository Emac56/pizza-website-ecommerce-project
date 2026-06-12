loadProfile();

async function loadProfile() {

const userId =
localStorage.getItem(
"userId"
);

const profileContainer =
document.querySelector(
"#profileContainer"
);

try {

const response =
  await fetch(
    `${API_BASE_URL}/api/users/${userId}`
  );

const user =
  await response.json();

profileContainer.innerHTML = `
  <div>

    <p class="text-gray-500">
      Name
    </p>

    <div id="profileName">

      <p class="font-bold text-lg">
        ${user.name}
      </p>

    </div>

  </div>

  <div class="mt-4">

    <p class="text-gray-500">
      Phone Number
    </p>

    <div id="profilePhone">

      <p class="font-bold text-lg">
        ${user.phone}
      </p>

    </div>

  </div>
`;

} catch (error) {

console.log(error);

}

}

document.addEventListener(
"click",
async (event) => {

if (
  event.target.id ===
  "editProfileBtn"
) {

  const nameElement =
    document.querySelector(
      "#profileName"
    );

  const phoneElement =
    document.querySelector(
      "#profilePhone"
    );

  const currentName =
    nameElement.textContent.trim();

  const currentPhone =
    phoneElement.textContent.trim();

  nameElement.innerHTML = `
    <input
      id="editName"
      class="w-full border rounded-xl p-3"
      value="${currentName}"
    >
  `;

  phoneElement.innerHTML = `
    <input
      id="editPhone"
      class="w-full border rounded-xl p-3"
      value="${currentPhone}"
    >
  `;

  event.target.textContent =
    "Save Profile";

  event.target.id =
    "saveProfileBtn";

}
else if (
  event.target.id ===
  "changePasswordBtn"
) {

  document
    .querySelector(
      "#passwordSection"
    )
    .classList
    .remove(
      "hidden"
    );

}


else if (
  event.target.id ===
  "saveProfileBtn"
) {

  const userId =
    localStorage.getItem(
      "userId"
    );

  const name =
    document.querySelector(
      "#editName"
    ).value;

  const phone =
    document.querySelector(
      "#editPhone"
    ).value;

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            name,
            phone
          })
        }
      );

    await response.json();

    alert(
      "Profile updated successfully!"
    );

    loadProfile();

    const button =
      document.querySelector(
        "#saveProfileBtn"
      );

    if (button) {

      button.textContent =
        "Edit Profile";

      button.id =
        "editProfileBtn";

    }

  } catch (error) {

    console.log(error);

  }

}

}
);