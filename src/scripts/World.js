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
    this.custom = params.custom;
    this.init();
  }
  init() {
    this.pillow = new Pillow({
      debug: this.debug,
      scene: this.scene,
      mouse: this.mouse,
      time: this.time,
      custom: this.custom,
    });
    this.container.add(this.pillow.container);
    this.pillow.container.position.x += 1;
    this.pillow.container.position.y += 1;
  }
}
