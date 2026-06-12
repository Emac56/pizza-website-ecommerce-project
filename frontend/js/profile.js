loadProfile();

async function saveProfile() {

    const name =
        document.getElementById("editName").value.trim();

    const phone =
        document.getElementById("editPhone").value.trim();

    // Validation (Step 3)
    if (!validateProfileForm()) {
        return;
    }

    try {

        const response = await fetch(
            `/api/users/${userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    phone
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to update profile"
            );
        }

        updateProfileUI(name, phone);

        exitEditMode();

        showSuccess(
            "Profile updated successfully"
        );

    } catch (error) {

        showError(
            error.message
        );

    }

}

function updateProfileUI(name, phone) {

    document.querySelector("#profileName")
        .innerHTML = name;

    document.querySelector("#profilePhone")
        .innerHTML = phone;

}

function showSuccess(message) {
    alert(message);
}

function showError(message) {
    alert(message);
}


function enableProfileInputs() {

    document
      .getElementById("editName")
      .removeAttribute("disabled");

    document
      .getElementById("editPhone")
      .removeAttribute("disabled");
}

function exitEditMode() {

    editProfileBtn.textContent =
      "Edit Profile";

    isEditing = false;
}



let isEditing = false;

editProfileBtn.addEventListener("click", () => {

    if (!isEditing) {

        enableProfileInputs();

        editProfileBtn.textContent = "Save Profile";

        isEditing = true;

        return;
    }

    saveProfile();

});

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

<div>

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
  (event) => {

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
nameElement.textContent;

const currentPhone =
phoneElement.textContent;

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

  }
);