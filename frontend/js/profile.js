const profileContainer =
document.querySelector(
  "#profileContainer"
);

const userName =
localStorage.getItem(
  "userName"
);

profileContainer.innerHTML = `
  <div class="space-y-4">

    <div>

      <p class="text-gray-500">
        Name
      </p>

      <p class="font-bold text-lg">
        ${userName}
      </p>

    </div>

  </div>
`;