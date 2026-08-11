const RUNES = ["☿", "☉", "☾"];
const TOTAL_ROUNDS = 20;

function roundConfig(round) { return { preview: Math.max(.65, 2.25 - round * .08), answer: Math.max(.55, 2.4 - round * .09) }; }

export class IntelligenceChallenge {
  constructor() { this.attributeId = "intelligence"; this.reset(); }
  reset() { this.round = 0; this.score = 1; this.status = "intro"; this.timer = 0; this.sequence = []; this.answer = 0; this.optionOrder = [0, 1, 2]; }
  beginMemory() {
    const length = 3 + Math.floor(this.round / 4);
    this.sequence = Array.from({ length }, (_, index) => (this.round * 2 + index * 2 + 1) % RUNES.length);
    this.answer = this.sequence.at(-1); this.optionOrder = this.round < 4 ? [0, 1, 2] : [1, 0, 2]; if (this.round >= 9) this.optionOrder = [2, 0, 1]; this.timer = roundConfig(this.round).preview; this.status = "preview";
  }
  update(delta, pressed, _held, _released, choice) {
    if (this.status === "intro" && pressed) { this.status = "countdown"; this.timer = 3; return; }
    if (this.status === "countdown") { this.timer -= delta; if (this.timer <= 0) this.beginMemory(); return; }
    if (this.status === "preview") { this.timer -= delta; if (this.timer <= 0) { this.timer = roundConfig(this.round).answer; this.status = "answer"; } return; }
    if (this.status === "answer") {
      this.timer -= delta;
      if (choice) this.resolve(this.optionOrder[choice - 1]);
      else if (this.timer <= 0) this.status = "result";
    }
  }
  resolve(choice) { if (choice !== this.answer) { this.status = "result"; return; } this.round += 1; this.score = Math.min(TOTAL_ROUNDS, this.round + 1); if (this.round === TOTAL_ROUNDS) this.status = "result"; else this.beginMemory(); }
  draw(ctx) {
    ctx.fillStyle = "#211d2a"; ctx.fillRect(0, 0, 960, 540); ctx.textAlign = "center";
    if (this.status === "intro") return this.drawIntro(ctx);
    if (this.status === "countdown") return this.drawCountdown(ctx);
    if (this.status === "result") return this.drawResult(ctx);
    this.title(ctx, `INTELIGENCIA — NIVEL ${this.round + 1} DE ${TOTAL_ROUNDS}`, 105);
    if (this.status === "preview") { this.copy(ctx, "Memoriza el último sello de la secuencia.", 160, "#bdb0b6"); this.copy(ctx, this.sequence.map((rune) => RUNES[rune]).join("   "), 290, "#f3c46b"); return; }
    this.copy(ctx, this.round >= 4 ? "¿Qué sello cerraba la secuencia? (Opciones reorganizadas.)" : "¿Qué sello cerraba la secuencia?", 165); this.copy(ctx, `1: ${RUNES[this.optionOrder[0]]}       2: ${RUNES[this.optionOrder[1]]}       3: ${RUNES[this.optionOrder[2]]}`, 290, "#f3c46b"); this.copy(ctx, `Tiempo restante: ${Math.max(0, this.timer).toFixed(1)} s`, 365, "#bdb0b6");
  }
  title(ctx, text, y) { ctx.fillStyle = "#f3c46b"; ctx.font = "bold 38px Georgia"; ctx.fillText(text, 480, y); }
  copy(ctx, text, y, color = "#f7ead0") { ctx.fillStyle = color; ctx.font = "22px Georgia"; ctx.fillText(text, 480, y); }
  drawIntro(ctx) { this.title(ctx, "PRUEBA DE INTELIGENCIA", 145); this.copy(ctx, "Memoriza sellos rúnicos antes de que desaparezcan.", 215); this.copy(ctx, "La administración llama a esto pensar.", 250, "#d3a658"); this.copy(ctx, "Pulsa ESPACIO o haz clic para empezar.", 350); }
  drawCountdown(ctx) { this.title(ctx, "PREPÁRATE", 170); this.copy(ctx, String(Math.max(1, Math.ceil(this.timer))), 300, "#f3c46b"); this.copy(ctx, "Los sellos no esperarán a que leas el manual.", 370, "#bdb0b6"); }
  drawResult(ctx) { this.title(ctx, "RESULTADO OFICIAL", 145); this.copy(ctx, `INTELIGENCIA  ${this.score} / 20`, 235, "#f3c46b"); const verdict = this.score >= 18 ? "La academia quiere tu cráneo. Para estudiarlo." : this.score >= 10 ? "Has leído al menos el título del libro." : "El libro ha ganado esta discusión."; this.copy(ctx, verdict, 295); this.copy(ctx, "Pulsa ESPACIO o haz clic para volver a las pruebas.", 390, "#bdb0b6"); }
}
