import PerspectiveCamera from "./PerspectiveCamera.js";
import { Vector2 } from "../math/Vector2.js";
export default class SpotLightShadow {
  constructor() {
    this.type = "SpotLightShadow";
    this.camera = new PerspectiveCamera(90, 1, 0.1, 100);
    this.bias = 0;
    this.mapSize = new Vector2(2048, 2048);
    this.map = null;
  }
}
