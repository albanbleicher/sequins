import { BoxBufferGeometry, Euler } from "three";
import {
  DoubleSide,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshNormalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneBufferGeometry,
  RingBufferGeometry,
  Vector3,
} from "three";

export default class Pillow {
  constructor(params) {
    this.container = new Object3D();
    this.container.name = "Pillow";
    this.params = {
      width: 20,
      height: 10,
      factor: 2,
    };
    this.debug = params.debug;
    this.scene = params.scene;
    this.envMap = params.envMap;
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
    const geo = new RingBufferGeometry(0.03, 0.3, 30, 1);

    const material = new MeshStandardMaterial({
      color: "white",
      side: DoubleSide,
      envMapIntensity: 2,
      roughness: 0.1,
      metalness: 1,
    });

    if (this.debug) {
      const folder = this.debug.addFolder({ title: "Sequin Material" });
      folder.addInput(material, "metalness", {
        min: 0,
        max: 1,
      });
      folder.addInput(material, "roughness", {
        min: 0,
        max: 1,
      });
      folder.addInput(material, "envMapIntensity", {
        min: 0,
        max: 10,
      });
    }
    this.count =
      (this.params.factor * this.params.width + 1) *
      (this.params.factor * this.params.height + 1);
    this.instance = new InstancedMesh(geo.toNonIndexed(), material, this.count);

    const mat = new Matrix4();
    let total = 0;
    for (let i = 0; i < this.params.width * this.params.factor + 1; i++) {
      for (let j = 0; j < this.params.height * this.params.factor + 1; j++) {
        const pos = new Vector3(
          -this.params.width / 2 + i / this.params.factor - i * 0.05,
          j / this.params.factor - this.params.height / 2 - j * 0.05,
          0.01
        );
        mat.setPosition(pos);
        this.instance.setMatrixAt(total, mat);
        total++;
      }
    }
    this.instance.instanceMatrix.needsUpdate = true;
    this.container.add(this.instance);
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      for (let i = 0; i < this.count; i++) {
        const mat = new Matrix4();
        this.instance.getMatrixAt(i, mat);
        const pos = new Vector3();
        pos.setFromMatrixPosition(mat);
        // mat.makeRotationY((x * Math.PI) / 2);
        mat.makeRotationY((x * Math.PI) / 2);
        mat.setPosition(pos);
        this.instance.setMatrixAt(i, mat);
      }
      this.instance.instanceMatrix.needsUpdate = true;
    });
  }
}
