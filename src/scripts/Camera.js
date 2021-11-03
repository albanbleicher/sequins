import { Object3D, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default class Camera {
  constructor(params) {
    this.camera = null;
    this.init();
    this.setControls(params.canvas);
  }
  init() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 20;
  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  setControls(canvas) {
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
  }
}
