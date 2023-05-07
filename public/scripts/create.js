/* eslint-disable import/extensions */
import { fetchLoggedInUser, signupAndLoginHandler, setNav } from "./global.js";

const validateCreateForm = (event) => {
  event.preventDefault();

  // Clear previous error messages
  const errorMessages = document.querySelectorAll(".help.is-danger");
  errorMessages.forEach((errorMessage) => {
    errorMessage.textContent = "";
  });

  // Validate username and password
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  let isValid = true;

  if (usernameInput.value.trim() === "") {
    isValid = false;
    document.getElementById("username-error").textContent = "Username is required.";
  }

  if (passwordInput.value.trim() === "") {
    isValid = false;
    document.getElementById("password-error").textContent = "Password is required.";
  }

  // If form is valid, call the signupAndLoginHandler
  if (isValid) {
    signupAndLoginHandler("/api/users", event.target);
  }
};

const main = async () => {
  const user = await fetchLoggedInUser();
  if (user) return window.location.assign("/user.html");

  setNav();
  document
    .querySelector("#create-form")
    .addEventListener("submit", validateCreateForm);
};

main();
