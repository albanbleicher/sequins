import {
  CubeTextureLoader,
  EquirectangularReflectionMapping,
  TextureLoader,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import textures from "../../textures/*.{png,jpg,hdr,jpeg}";
export default class Loader {
  constructor() {
    this.textures = [];
    this.texLoader = new TextureLoader();
    this.hdriLoader = new RGBELoader();
    this.waiterTextures = [];
  }
  load() {
    return new Promise((resolve) => {
      this.loadTextures();
      Promise.all(this.waiterTextures).then(() => {
        resolve();
      });
    });
  }
  loadCustom(url) {
    const loader = new CubeTextureLoader();
    return new Promise((resolve) => {
      loader.load([url, url, url, url, url, url], (data) => {
        this.textures["custom"] = data;
        resolve();
      });
    });
  }
  loadTextures() {
    Object.entries(textures).forEach((item, i) => {
      const tex = Object.entries(item[1])[0];
      const format = tex[0];
      const url = tex[1];
      console.log(format, url);
      switch (format) {
        case "png":
        case "jpg":
        case "jpeg":
          const promiseImg = new Promise((resolve) => {
            this.texLoader.load(url, (data) => {
              this.textures[item[0]] = data;
              resolve();
            });
          });
          this.waiterTextures.push(promiseImg);
          break;
        case "hdr":
          const promiseHDRI = new Promise((resolve) => {
            this.hdriLoader.load(url, (data) => {
              data.mapping = EquirectangularReflectionMapping;
              this.textures[item[0]] = data;
              console.log(data);
              resolve();
            });
          });
          this.waiterTextures.push(promiseHDRI);
          break;
      }
    });
    //   console.log(
    //     textures.forEach((item) => {
    //       console.log(item);
    //     })
    //   );
  }
}
