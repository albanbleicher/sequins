import {
  DoubleSide,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshNormalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneBufferGeometry,
  Vector3,
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

    this.init();
    this.addSequins();
  }
  init() {
    this.geo = new PlaneBufferGeometry(
      this.params.width,
      this.params.height,
      this.params.width * this.params.factor,
      this.params.height * this.params.factor
    );
    this.mat = new MeshNormalMaterial({
      side: DoubleSide,
      wireframe: true,
      opacity: 0,
      transparent: true,
    });
    this.surface = new Mesh(this.geo, this.mat);
    this.container.add(this.surface);
  }
  addSequins() {
    const count =
      (this.params.factor * this.params.width + 1) *
      (this.params.factor * this.params.height + 1);
    this.front = new Sequins({
      count,
      ...this.params,
      color: "black",
      front: true,
      mouse: this.mouse,
      time: this.time,
    });
    this.container.add(this.front.container);
    this.back = new Sequins({
      count,
      ...this.params,
      color: "white",
      front: false,
      mouse: this.mouse,
      time: this.time,
    });
    this.container.add(this.back.container);
  }
}
