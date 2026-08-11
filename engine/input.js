export class Input {
  constructor(target) {
    this.pressed = false;
    window.addEventListener("keydown", (event) => {
      if (event.code === "Space" || event.code === "Enter") { event.preventDefault(); this.pressed = true; }
    });
    target.addEventListener("pointerdown", () => { this.pressed = true; });
  }
  consumePress() { const pressed = this.pressed; this.pressed = false; return pressed; }
}
