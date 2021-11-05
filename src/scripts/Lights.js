import { AmbientLight, Object3D, DirectionalLight } from "three";

export default class Lights {
  constructor() {
    this.container = new Object3D();
    this.container.name = "Lights";
    this.init();
  }
  init() {
    const ambient = new AmbientLight(0xffffff, 1);
    this.container.add(ambient);
    const directional = new DirectionalLight(0xffffff, 1);
    this.container.add(directional);
  }
}
