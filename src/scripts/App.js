import { Object3D, Scene } from "three";
import gsap from "gsap";
import Renderer from "./Renderer";
import Camera from "./Camera";
import Time from "./Tools/Time";
import World from "./World";
import { Pane } from "tweakpane";
import Loader from "./Tools/Loader";
import Mouse from "./Mouse";
import { app } from "./db";
import { v4 as uuidv4 } from "uuid";

import {
  getStorage,
  ref,
  listAll,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default class App {
  constructor(canvas, debug, url) {
    this.url = url;
    this.custom = url ? true : false;
    this.canvas = canvas;
    this.isSaving = false;
    this.time = new Time();
    this.camera = new Camera({ canvas });
    this.assets = new Loader();
    this.scene = new Scene();
    this.renderer = new Renderer({
      canvas,
      camera: this.camera,
      scene: this.scene,
    });
    this.container = new Object3D();
    this.container.name = "App";
    if (debug) {
      this.debug = new Pane();
    }
    this.storage = getStorage(app);

    this.init();

    this.time.addEventListener("tick", (e) => {
      this.renderer.render();
    });
    window.addEventListener("keyup", async (e) => {
      if (e.key === "s") {
        if (!this.isSaving) {
          this.canvas.classList.add("hidden");
          document.querySelector(".loading").classList.remove("hidden");
          this.isSaving = true;
          const chunks = []; // here we will store our recorded media chunks (Blobs)
          const stream = this.canvas.captureStream(); // grab our canvas MediaStream
          const rec = new MediaRecorder(stream); // init the recorder
          // every time the recorder has new data, we will store it in our array
          rec.ondataavailable = (e) => chunks.push(e.data);
          // only when the recorder stops, we construct a complete Blob from all the chunks
          rec.onstop = async (e) => {
            const videosRefs = ref(this.storage, uuidv4());
            const blob = new Blob(chunks, { type: "video/webm" });
            await uploadBytes(videosRefs, blob);
            this.showGrid();
          };
          setTimeout(() => {
            rec.start();
            const pillow = this.scene.getObjectByName("Pillow");
            gsap.to(pillow.rotation, {
              y: pillow.rotation.y + Math.PI * 2,
              duration: 2,
            });
            setTimeout(() => {
              rec.stop();
            }, 3200);
          }, 500);
        }
      }
    });
  }
  async init() {
    if (this.url) {
      await this.assets.loadCustom(this.url);
      const tex = this.assets.textures.custom;
      tex.encoding = 3001;
      this.scene.environment = this.assets.textures.custom;
      setTimeout(() => {
        this.build();
      }, 500);
    } else {
      await this.assets.load();
      this.scene.environment = this.assets.textures.env_;
      setTimeout(() => {
        this.build();
      }, 500);
    }
  }
  build() {
    this.canvas.style.pointerEvents = "all";
    document.querySelector(".loading").classList.add("hidden");
    this.mouse = new Mouse({
      camera: this.camera,
      scene: this.scene,
      debug: this.debug,
    });

    this.world = new World({
      camera: this.camera,
      renderer: this.renderer,
      time: this.time,
      debug: this.debug,
      scene: this.scene,
      mouse: this.mouse,
      custom: this.custom,
    });
    this.scene.add(this.world.container);
    gsap.to(this.camera.camera.position, {
      z: 20,
      ease: "expo.easeOut",
      duration: 0.9,
      delay: 0.7,
    });
    window.addEventListener("resize", () => {
      this.renderer.resize();
      this.camera.resize();
    });
  }
  async showGrid() {
    const storageData = ref(this.storage, "");
    const waiter = [];
    const { items } = await listAll(storageData);
    items.forEach(async (item) => {
      const promise = getDownloadURL(ref(this.storage, item.fullPath));
      waiter.push(promise);
    });
    Promise.all(waiter).then((videos) => {
      this.time.stop();
      this.canvas.remove();
      const gridWrapper = document.querySelector(".grid-wrapper");
      const grid = document.querySelector(".grid");
      document.querySelector(".loading").classList.add("hidden");
      gridWrapper.classList.remove("hidden");
      videos.forEach((video) => {
        const element = document.createElement("video");
        element.src = video;
        element.setAttribute("loop", "");
        const wrapper = document.createElement("div");
        wrapper.classList.add("grid-element");
        wrapper.append(element);
        const notice = document.createElement("span");
        notice.innerText = "Click to download";
        wrapper.append(notice);
        grid.append(wrapper);

        wrapper.addEventListener("mouseenter", () => {
          element.play();
        });
        wrapper.addEventListener("mouseleave", () => {
          element.pause();
        });
        wrapper.addEventListener("click", () => {
          window.open(video, "_blank");
        });
      });
    });
  }
}
