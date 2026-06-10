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
      <div class="space-y-6">

        <div>

          <p class="text-gray-500">
            Name
          </p>

          <p class="font-bold text-lg">
            ${user.name}
          </p>

        </div>

        <div>

          <p class="text-gray-500">
            Phone Number
          </p>

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

      alert(
        "Edit Profile coming next step"
      );

    }

  }
);