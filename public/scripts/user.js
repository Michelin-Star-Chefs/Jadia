/* eslint-disable import/extensions */
import {
  fetchLoggedInUser,
  logOutHandler,
  updateUsernameHandler,
  updatePFPHandler,
  setNav,
} from "./global.js";

const user = await fetchLoggedInUser();
const [pfp, err] = await handleFetch(`/api/users/pfp/${user.id}`);

const isAuthError = err => err.status === 401 || err.status === 403;
const redirectToLogin = () => window.location.assign("/login.html");
const renderUsername = username => {
  document.querySelector("#username").textContent = username;
};
const renderPFP = link => {
  document.querySelector("#profile-picture").src = link;
};

const main = async () => {
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
    renderPFP(response.image_url);
  });
  updatePFPForm.dataset.userId = user.id;

  setNav(!!user);
  renderUsername(user.username);
  renderPFP(pfp.image_url);
};

main();
