export class Input {
  constructor(target) {
    this.pressed = false;
    this.released = false;
    this.held = false;
    this.choice = null;
    this.tap = null;
    this.direction = null;
    window.addEventListener("keydown", (event) => {
      if (["Digit1", "Digit2", "Digit3"].includes(event.code)) { this.choice = Number(event.code.at(-1)); return; }
      if (["ArrowLeft", "KeyA", "ArrowRight", "KeyD"].includes(event.code)) { event.preventDefault(); this.direction = ["ArrowLeft", "KeyA"].includes(event.code) ? -1 : 1; return; }
      if (event.code === "Space" || event.code === "Enter") { event.preventDefault(); if (!this.held) this.pressed = true; this.held = true; }
    });
    window.addEventListener("keyup", (event) => {
      if (event.code === "Space" || event.code === "Enter") { this.held = false; this.released = true; }
    });
    target.addEventListener("pointerdown", (event) => { const rect = target.getBoundingClientRect(); this.tap = { x: (event.clientX - rect.left) * target.width / rect.width, y: (event.clientY - rect.top) * target.height / rect.height }; this.pressed = true; this.held = true; });
    window.addEventListener("pointerup", () => { this.held = false; this.released = true; });
  }
  consumePress() { const pressed = this.pressed; this.pressed = false; return pressed; }
  consumeRelease() { const released = this.released; this.released = false; return released; }
  consumeChoice() { const choice = this.choice; this.choice = null; return choice; }
  consumeTap() { const tap = this.tap; this.tap = null; return tap; }
  consumeDirection() { const direction = this.direction; this.direction = null; return direction; }
}
