import {
  Matrix4,
  Vector3,
  DoubleSide,
  Object3D,
  RingBufferGeometry,
  MeshStandardMaterial,
  InstancedMesh,
  FrontSide,
  BackSide,
  Quaternion,
} from "three";
export default class Sequins {
  constructor(params) {
    this.color = params.color;
    this.width = params.width;
    this.height = params.height;
    this.factor = params.factor;
    this.count = params.count;
    this.front = params.front;
    this.mouse = params.mouse;
    this.sequins = [];
    this.container = new Object3D();
    this.container.name = "Sequins";
    this.init();
  }
  init() {
    const geo = new RingBufferGeometry(0.03, 0.3, 30, 1);
    const material = new MeshStandardMaterial({
      color: this.color,
      envMapIntensity: 2,
      roughness: 0.1,
      metalness: 1,
      side: this.front ? FrontSide : BackSide,
    });

    this.instance = new InstancedMesh(geo.toNonIndexed(), material, this.count);

    const mat = new Matrix4();
    let total = 0;
    for (let i = 0; i < this.width * this.factor + 1; i++) {
      for (let j = 0; j < this.height * this.factor + 1; j++) {
        const pos = new Vector3(
          -this.width / 2 + i / this.factor - i * 0.05,
          j / this.factor - this.height / 2 - j * 0.05,
          this.front ? 0.05 : 0.01
        );
        mat.setPosition(pos);
        this.instance.setMatrixAt(total, mat);

        total++;
      }
    }
    this.instance.instanceMatrix.needsUpdate = true;
    this.container.add(this.instance);
    this.mouse.addEventListener("move", (e) => {
      for (let i = 0; i < this.count; i++) {
        const mat = new Matrix4();
        this.instance.getMatrixAt(i, mat);
        const pos = new Vector3();
        const rot = new Quaternion();
        const target = rot.clone();
        pos.setFromMatrixPosition(mat);
        rot.setFromRotationMatrix(mat);
        target.setFromAxisAngle(
          new Vector3(0, 1, 0),
          1 * e.message.delta === 0 ? (e.message.delta = 1) : e.message.delta
        );
        rot.slerp(target, 0.1);
        const fromMouse = e.message.pos.distanceTo(pos);
        if (fromMouse < 1) {
          mat.makeRotationFromQuaternion(rot);
          mat.setPosition(pos);
        }
        this.instance.setMatrixAt(i, mat);
      }
      this.instance.instanceMatrix.needsUpdate = true;
    });
  }
  move(delta) {
    for (let i = 0; i < this.count; i++) {
      const mat = new Matrix4();
      this.instance.getMatrixAt(i, mat);
      const pos = new Vector3();
      pos.setFromMatrixPosition(mat);
      mat.makeRotationY((delta * Math.PI) / 2);
      mat.setPosition(pos);
      this.instance.setMatrixAt(i, mat);
    }
    this.instance.instanceMatrix.needsUpdate = true;
  }
}
