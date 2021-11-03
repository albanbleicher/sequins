import { EventDispatcher } from "three";

export default class Time extends EventDispatcher {
  constructor() {
    super();
    this.current = 0;
    this.start();
  }
  start() {
    this.dispatchEvent({ type: "start" });
    this.tick();
  }
  tick() {
    this.current += 1;
    this.dispatchEvent({ type: "tick" });
    this.raf = requestAnimationFrame(this.tick.bind(this));
  }
  stop() {
    this.dispatchEvent({ type: "stop" });
    cancelAnimationFrame(this.raf);
  }
}
