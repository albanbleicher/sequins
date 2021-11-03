import { WebGLRenderer } from "three";

export default class Renderer {
  constructor(params) {
    this.renderer = null;
    this.canvas = params.canvas;
    this.camera = params.camera;
    this.scene = params.scene;
    this.init();
  }
  init() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      precision: "highp",
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  render() {
    this.renderer.render(this.scene, this.camera.camera);
  }
  resize() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
