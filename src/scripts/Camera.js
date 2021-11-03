import { Object3D, PerspectiveCamera } from "three";

export default class Camera {
  constructor() {
    this.camera = null;
    this.container = new Object3D();
    this.container.name = "Camera";
    this.init();
  }
  init() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.container.add(this.camera);
  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}
