import { EquirectangularReflectionMapping, TextureLoader } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import textures from "../../textures/*.{png,jpg,hdr,jpeg}";
export default class Loader {
  constructor() {
    this.textures = [];
    this.texLoader = new TextureLoader();
    this.hdriLoader = new RGBELoader();
  }
  load() {
    return new Promise((resolve, reject) => {
      Object.entries(textures).forEach((item) => {
        const tex = Object.entries(item[1])[0];
        const format = tex[0];
        const url = tex[1];
        switch (format) {
          case "png":
          case "jpg":
          case "jpeg":
            this.texLoader.load(url, (data) => {
              this.textures[item[0]] = data;
              resolve();
            });
            break;
          case "hdr":
            this.hdriLoader.load(url, (data) => {
              data.mapping = EquirectangularReflectionMapping;
              this.textures[item[0]] = data;
              resolve();
            });
            break;
        }
      });
      //   console.log(
      //     textures.forEach((item) => {
      //       console.log(item);
      //     })
      //   );
    });
  }
}
