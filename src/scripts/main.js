import "../app.scss";
import App from "./app";
if (module.hot) {
  module.hot.accept(function () {
    location.reload();
  });
}
document.addEventListener("DOMContentLoaded", (e) => {
  const canvas = document.querySelector("canvas");
  const debug = window.location.hash.includes("debug");
  if (debug) console.warn("Debug mode enabled");
  new App(canvas, debug);
});
