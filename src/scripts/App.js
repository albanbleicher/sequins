import { Object3D, Scene } from "three";
import gsap from "gsap";
import Renderer from "./Renderer";
import Camera from "./Camera";
import Time from "./Tools/Time";
import World from "./World";
import { Pane } from "tweakpane";
import Loader from "./Tools/Loader";
import Mouse from "./Mouse";
export default class App {
  constructor(canvas, debug, url) {
    this.url = url;
    this.custom = url ? true : false;
    this.canvas = canvas;
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
    this.init();
    this.time.addEventListener("tick", (e) => {
      this.renderer.render();
    });
  }

  async init() {
    if (this.url) {
      await this.assets.loadCustom(this.url);
      const tex = this.assets.textures.custom;
      tex.encoding = 3001;
      this.scene.environment = this.assets.textures.custom;
      // this.scene.background = this.assets.textures.custom;
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
}
