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
  Color,
} from "three";
export default class Sequins {
  constructor(params) {
    this.debug = params.debug;
    this.color = params.color;
    this.width = params.width;
    this.height = params.height;
    this.factor = params.factor;
    this.count = params.count;
    this.front = params.front;
    this.mouse = params.mouse;
    this.time = params.time;
    this.custom = params.custom;
    this.sequins = [];
    this.container = new Object3D();
    this.container.name = "Sequins";
    this.init();
  }
  init() {
    const geo = new RingBufferGeometry(0.03, 0.3, 30, 1);
    const material = new MeshStandardMaterial({
      color: new Color(this.color),
      envMapIntensity: 2,
      roughness: 0.2,
      metalness: 1,
      transparent: true,
      opacity: 0,
      side: this.front ? FrontSide : BackSide,
    });
    if (this.debug) {
      const folder = this.debug.addFolder({
        title: `${this.front ? "Front" : "Back"} Sequins Material`,
      });
      folder.addInput(material, "roughness", {
        min: 0,
        max: 1,
        step: 0.1,
      });
      folder.addInput(material, "metalness", {
        min: 0,
        max: 1,
        step: 0.1,
      });
    }
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
        const quat = new Quaternion();
        this.sequins[total] = {
          col: i,
          position: pos,
          currentRotation: quat,
          targetRotation: quat.clone(),
          fromMouse: 1000,
        };
        total++;
      }
    }
    this.instance.instanceMatrix.needsUpdate = true;
    this.container.add(this.instance);
    this.mouse.addEventListener("move", (e) => {
      for (let i = 0; i < this.count; i++) {
        this.sequins[i].fromMouse = e.message.pos.distanceTo(
          this.sequins[i].position
        );
        if (this.sequins[i].fromMouse < 0.5) {
          this.sequins[i].targetRotation.setFromAxisAngle(
            new Vector3(0, 1, 0),
            e.message.direction ? Math.PI : 2 * Math.PI
          );
        }
      }
    });
    this.time.addEventListener("tick", () => {
      if (material.opacity !== 1) {
        material.opacity += 0.05;
      }
      this.sequins.forEach((sequin, i) => {
        const mat = new Matrix4();
        this.instance.getMatrixAt(i, mat);
        const rot = sequin.currentRotation;
        if (sequin.fromMouse < 1) rot.slerp(sequin.targetRotation, 0.07);
        mat.makeRotationFromQuaternion(rot);
        const pos = sequin.position.clone();
        pos.z = Math.sin(this.time.current * 0.02 + sequin.col / 10);
        pos.z += this.front ? 0.1 : 0;
        mat.setPosition(pos);
        this.instance.setMatrixAt(i, mat);
      });
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
