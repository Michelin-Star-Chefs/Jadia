/* eslint-disable import/extensions */
import { fetchLoggedInUser, handleFetch, setNav } from "./global.js";
/* 
const redirectToLogin = () => window.location.assign("/login.html");
if (!user) return redirectToLogin();

*/
const user = await fetchLoggedInUser();
const redirectToLogin = () => window.location.assign("/login.html");


const main = async () => {
  if (!user) redirectToLogin();
  else window.location.assign("/feed.html");
  setNav(!!user);

  const [secret, _err] = await handleFetch("/api/logged-in-secret");
  console.log("secret, _err:", secret, _err);
  if (secret) {
    document.querySelector("#secret-message").textContent = secret.msg;
  }
};

main();
