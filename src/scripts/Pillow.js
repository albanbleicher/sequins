import {
  DoubleSide,
  Mesh,
  MeshNormalMaterial,
  Object3D,
  PlaneBufferGeometry,
} from "three";
import Sequins from "./Sequins";

export default class Pillow {
  constructor(params) {
    this.container = new Object3D();
    this.container.name = "Pillow";
    this.params = {
      width: 10,
      height: 10,
      factor: 2.2,
    };
    this.debug = params.debug;
    this.scene = params.scene;
    this.mouse = params.mouse;
    this.time = params.time;
    this.custom = params.custom;

    this.init();
  }

  init() {
    const count =
      (this.params.factor * this.params.width + 1) *
      (this.params.factor * this.params.height + 1);
    this.front = new Sequins({
      count,
      ...this.params,
      color: "white",
      front: true,
      mouse: this.mouse,
      time: this.time,
      debug: this.debug,
      custom: this.custom,
    });
    this.container.add(this.front.container);
    this.back = new Sequins({
      count,
      ...this.params,
      color: "black",
      front: false,
      mouse: this.mouse,
      time: this.time,
      debug: this.debug,
      custom: this.custom,
    });
    this.container.add(this.back.container);
  }
}
