export class GameLoop {
  constructor(update, draw) { this.update = update; this.draw = draw; this.lastTime = 0; }
  start() { requestAnimationFrame((time) => this.frame(time)); }
  frame(time) {
    const delta = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    this.update(delta); this.draw();
    requestAnimationFrame((nextTime) => this.frame(nextTime));
  }
}
