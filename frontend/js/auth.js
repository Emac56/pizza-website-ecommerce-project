const loginForm = document.querySelector("#loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const loginInput =
      document.querySelector("#loginEmail").value.trim();

    const password =
      document.querySelector("#loginPassword").value.trim();

    if (!loginInput || !password) {
      alert("Fill in all fields");
      return;
    }

    try {

      const response = await fetch(
        "http://192.168.1.7:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            loginInput,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("isLoggedIn", "true");

      window.location.href = "Main.html";

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    }

  });

}

const signupForm = document.querySelector("#signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
      document.querySelector("#signupUsername").value.trim();

    const name =
      document.querySelector("#signupName").value.trim();

    const email =
      document.querySelector("#signupEmail").value.trim();

    const phone =
      document.querySelector("#signupPhone").value.trim();

    const password =
      document.querySelector("#signupPassword").value.trim();

    const confirmPassword =
      document.querySelector("#confirmPassword").value.trim();

    if (
      !username ||
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Invalid email");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const response = await fetch(
        "http://192.168.1.7:5000/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username,
            name,
            email,
            phone,
            password
          })
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        window.location.href = "login.html";
      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    }

  });

}

const togglePassword = (inputId, buttonId) => {

  const input = document.querySelector(inputId);

  const button = document.querySelector(buttonId);

  if (!input || !button) return;

  button.addEventListener("click", () => {

    if (input.type === "password") {

      input.type = "text";

      button.textContent = "Hide";

    } else {

      input.type = "password";

      button.textContent = "Show";

    }

  });

};

togglePassword(
  "#loginPassword",
  "#toggleLoginPassword"
);

togglePassword(
  "#signupPassword",
  "#toggleSignupPassword"
);

togglePassword(
  "#confirmPassword",
  "#toggleConfirmPassword"
);





