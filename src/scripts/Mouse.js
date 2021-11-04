import { EventDispatcher, Raycaster, Vector3 } from "three";

export default class Mouse extends EventDispatcher {
  constructor(params) {
    super();
    this.camera = params.camera;
    this.scene = params.scene;
    this.raycaster = new Raycaster();
    this.mouse = new Vector3();
    this.debug = params.debug;
    this.delta = 0;
    this.init();
  }
  init() {
    window.addEventListener("mousemove", (e) => {
      const vec = new Vector3();
      const pos = new Vector3();
      vec.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vec.unproject(this.camera.camera);
      vec.sub(this.camera.camera.position).normalize();
      let distance = -this.camera.camera.position.z / vec.z;
      pos.copy(this.camera.camera.position).add(vec.multiplyScalar(distance));
      this.mouse.copy(pos);
      this.dispatchEvent({
        type: "move",
        message: { pos, delta: this.delta - e.clientX },
      });
      this.delta = e.clientX;
    });
    if (this.debug) {
      const folder = this.debug.addFolder({
        title: "Mouse Coords to World Position",
      });
      folder.addMonitor(this.mouse, "x");
      folder.addMonitor(this.mouse, "y");
      folder.addMonitor(this.mouse, "z");
    }
  }
}
