import { Pane } from "tweakpane";
import { Object3D, Scene } from "three";
import Renderer from "./Renderer";
import Camera from "./Camera";
import Time from "./Tools/Time";
import World from "./World";

export default class App {
  constructor(canvas, debug) {
    this.canvas = canvas;
    this.time = new Time();
    this.camera = new Camera();
    this.scene = new Scene();
    this.renderer = new Renderer({
      canvas,
      camera: this.camera,
      scene: this.scene,
    });
    if (debug) {
      this.debug = new Pane();
    }
    this.container = new Object3D();
    this.container.name = "App";
    this.init();
    this.time.addEventListener("tick", (e) => {
      this.renderer.render();
    });
  }
  init() {
    this.world = new World({
      camera: this.camera,
      renderer: this.renderer,
      time: this.time,
      debug: this.debug,
    });
    this.scene.add(this.world.container);
    window.addEventListener("resize", () => {
      this.renderer.resize();
      this.camera.resize();
    });
  }
}
