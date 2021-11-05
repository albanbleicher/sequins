import { WebGLRenderer, sRGBEncoding, ReinhardToneMapping } from "three";

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
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = ReinhardToneMapping;
    this.renderer.toneMappingExposure = 3;
  }
  render() {
    this.renderer.render(this.scene, this.camera.camera);
    this.camera.controls.update();
  }
  resize() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
