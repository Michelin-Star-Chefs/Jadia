/* eslint-disable import/extensions */
import {
  fetchLoggedInUser,
  logOutHandler,
  updateUsernameHandler,
  updatePFPHandler,
  setNav,
} from "./global.js";

const isAuthError = err => err.status === 401 || err.status === 403;
const redirectToLogin = () => window.location.assign("/login.html");
const renderUsername = username => {
  document.querySelector("#username").textContent = username;
};

const main = async () => {
  const user = await fetchLoggedInUser();
  if (!user) return redirectToLogin();

  const logoutForm = document.querySelector("#logout-form");
  const updateUsernameForm = document.querySelector("#username-form");
  const updatePFPForm = document.querySelector("#profile-picture-form");

  logoutForm.addEventListener("submit", async event => {
    event.preventDefault();
    logOutHandler();
  });

  updateUsernameForm.addEventListener("submit", async event => {
    event.preventDefault();
    const [response, err] = await updateUsernameHandler(event.target);

    if (err)
      return isAuthError(err)
        ? redirectToLogin()
        : alert("Something went wrong");
    renderUsername(response.username);

    event.target.reset();
  });
  updateUsernameForm.dataset.userId = user.id;

  updatePFPForm.addEventListener("submit", async e => {
    e.preventDefault();
    const [response, err] = await updatePFPHandler(e.target);
    if (err) {
      alert("Something went wrong");
    }
    e.target.reset();
  });
  updatePFPForm.dataset.userId = user.id;

  setNav(!!user);
  renderUsername(user.username);
};

main();
