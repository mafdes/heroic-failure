export class Input {
  constructor(target) {
    this.pressed = false;
    this.released = false;
    this.held = false;
    this.choice = null;
    window.addEventListener("keydown", (event) => {
      if (["Digit1", "Digit2", "Digit3"].includes(event.code)) { this.choice = Number(event.code.at(-1)); return; }
      if (event.code === "Space" || event.code === "Enter") { event.preventDefault(); if (!this.held) this.pressed = true; this.held = true; }
    });
    window.addEventListener("keyup", (event) => {
      if (event.code === "Space" || event.code === "Enter") { this.held = false; this.released = true; }
    });
    target.addEventListener("pointerdown", () => { this.pressed = true; this.held = true; });
    window.addEventListener("pointerup", () => { this.held = false; this.released = true; });
  }
  consumePress() { const pressed = this.pressed; this.pressed = false; return pressed; }
  consumeRelease() { const released = this.released; this.released = false; return released; }
  consumeChoice() { const choice = this.choice; this.choice = null; return choice; }
}
