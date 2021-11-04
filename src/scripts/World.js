import { IcosahedronGeometry, Mesh, MeshNormalMaterial, Object3D } from "three";
import Pillow from "./Pillow";

export default class World {
  constructor(params) {
    this.camera = params.camera;
    this.renderer = params.renderer;
    this.time = params.time;
    this.debug = params.debug;
    this.container = new Object3D();
    this.container.name = "World";
    this.scene = params.scene;
    this.mouse = params.mouse;
    this.init();
  }
  init() {
    this.pillow = new Pillow({
      debug: this.debug,
      scene: this.scene,
      mouse: this.mouse,
      time: this.time,
    });
    this.container.add(this.pillow.container);
  }
}
