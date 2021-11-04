import { Object3D, Scene } from "three";
import Renderer from "./Renderer";
import Camera from "./Camera";
import Time from "./Tools/Time";
import World from "./World";
import { Pane } from "tweakpane";
import Loader from "./Tools/Loader";
import Mouse from "./Mouse";
export default class App {
  constructor(canvas, debug) {
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
    await this.assets.load();
    this.scene.environment = this.assets.textures.env_;
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
    });
    this.scene.add(this.world.container);
    window.addEventListener("resize", () => {
      this.renderer.resize();
      this.camera.resize();
    });
  }
}
