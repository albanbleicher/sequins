import "../app.scss";
import App from "./App";
if (module.hot) {
  module.hot.accept(function () {
    location.reload();
  });
}
console.log(window);
document.addEventListener("DOMContentLoaded", (e) => {
  const canvas = document.querySelector(".world");
  const custom = document.querySelector(".custom");
  const debug = window.location.hash.includes("debug");
  if (debug) console.warn("Debug mode enabled");
  const directStart = document.getElementById("direct-start");
  const startWImage = document.getElementById("start-w-image");
  const file = document.querySelector("input");
  console.log(file);
  startWImage.addEventListener("click", () => {
    file.click();
  });
  file.addEventListener("change", (e) => {
    console.log(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    document.querySelector(".begin").classList.add("hidden");
    const ctx = custom.getContext("2d");
    const image = new Image(500, 500);
    image.src = url;
    image.onload = (e) => {
      ctx.drawImage(image, 0, 0, 500, 500);
      custom.toBlob((blob) => {
        const final = URL.createObjectURL(blob);
        const img = document.createElement("img");
        img.src = final;

        img.onload = () => {
          setTimeout(() => {
            document.querySelector(".loading").classList.remove("hidden");
            new App(canvas, debug, img.src);
          }, 500);
        };
      });
    };
  });
  directStart.addEventListener("click", () => {
    document.querySelector(".begin").classList.add("hidden");

    setTimeout(() => {
      document.querySelector(".loading").classList.remove("hidden");
      new App(canvas, debug);
    }, 500);
  });
});
