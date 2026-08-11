import { drawCountdown } from "../engine/countdown.js";

const OBJECTS = ["⚔", "🧀", "👑", "🐟", "🍄", "🧦"];
const TOTAL_ROUNDS = 20;
const CARDS = [{ x: 110, y: 220 }, { x: 365, y: 220 }, { x: 620, y: 220 }];
function config(round) { return { preview: Math.max(.65, 2.4 - round * .085), answer: Math.max(.7, 3 - round * .1) }; }

export class IntelligenceChallenge {
  constructor() { this.attributeId = "intelligence"; this.reset(); }
  reset() { this.round = 0; this.score = 1; this.status = "intro"; this.timer = 0; this.objects = []; this.answer = 0; this.options = []; }
  beginMemory() {
    const length = 3 + Math.floor(this.round / 4); this.objects = Array.from({ length }, (_, index) => (this.round + index * 2) % OBJECTS.length); this.answer = this.objects.at(-1);
    this.options = [this.answer, (this.answer + 1) % OBJECTS.length, (this.answer + 4) % OBJECTS.length]; if (this.round >= 4) this.options.reverse(); if (this.round >= 9) this.options = [this.options[1], this.options[2], this.options[0]];
    this.timer = config(this.round).preview; this.status = "preview";
  }
  update(delta, pressed, _held, _released, choice, tap) {
    if (this.status === "intro" && pressed) { this.status = "countdown"; this.timer = 3; return; }
    if (this.status === "countdown") { this.timer -= delta; if (this.timer <= 0) this.beginMemory(); return; }
    if (this.status === "preview") { this.timer -= delta; if (this.timer <= 0) { this.timer = config(this.round).answer; this.status = "answer"; } return; }
    if (this.status !== "answer") return;
    this.timer -= delta; const selected = choice ? choice - 1 : this.cardAt(tap);
    if (selected !== null) this.resolve(this.options[selected]); else if (this.timer <= 0) this.status = "result";
  }
  cardAt(tap) { if (!tap) return null; const index = CARDS.findIndex((card) => tap.x >= card.x && tap.x <= card.x + 230 && tap.y >= card.y && tap.y <= card.y + 190); return index < 0 ? null : index; }
  resolve(object) { if (object !== this.answer) { this.status = "result"; return; } this.round += 1; this.score = Math.min(TOTAL_ROUNDS, this.round + 1); if (this.round === TOTAL_ROUNDS) this.status = "result"; else this.beginMemory(); }
  draw(ctx) {
    ctx.fillStyle = "#211d2a"; ctx.fillRect(0, 0, 960, 540); ctx.textAlign = "center";
    if (this.status === "intro") return this.intro(ctx); if (this.status === "countdown") return drawCountdown(ctx, this.timer, "El inventario no admite reclamaciones."); if (this.status === "result") return this.result(ctx);
    this.title(ctx, `INTELIGENCIA — NIVEL ${this.round + 1} DE ${TOTAL_ROUNDS}`, 95);
    if (this.status === "preview") { this.copy(ctx, "Memoriza el último objeto del expediente.", 150, "#bdb0b6"); this.copy(ctx, this.objects.map((object) => OBJECTS[object]).join("     "), 300, "#f3c46b", 78); return; }
    this.copy(ctx, this.round >= 4 ? "¿Qué objeto cerraba el expediente? Las tarjetas han sido reorganizadas." : "¿Qué objeto cerraba el expediente?", 150); CARDS.forEach((card, index) => { ctx.fillStyle = "#4a3044"; ctx.fillRect(card.x, card.y, 230, 190); ctx.strokeStyle = "#d3a658"; ctx.lineWidth = 3; ctx.strokeRect(card.x, card.y, 230, 190); this.copyAt(ctx, OBJECTS[this.options[index]], card.x + 115, card.y + 105, "#f3c46b", 78); }); this.copy(ctx, `Clic/toca una tarjeta · ${Math.max(0, this.timer).toFixed(1)} s`, 470, "#bdb0b6");
  }
  title(ctx, text, y) { this.copyAt(ctx, text, 480, y, "#f3c46b", 34, "bold "); }
  copy(ctx, text, y, color = "#f7ead0", size = 22) { this.copyAt(ctx, text, 480, y, color, size); }
  copyAt(ctx, text, x, y, color, size, weight = "") { ctx.fillStyle = color; ctx.font = `${weight}${size}px Georgia`; ctx.fillText(text, x, y); }
  intro(ctx) { this.title(ctx, "PRUEBA DE INTELIGENCIA", 145); this.copy(ctx, "Memoriza objetos grandes. Luego toca el que faltaba.", 215); this.copy(ctx, "El ministerio ha perdido el expediente. Otra vez.", 250, "#d3a658"); this.copy(ctx, "Pulsa ESPACIO o haz clic para empezar.", 350); }
  result(ctx) { this.title(ctx, "RESULTADO OFICIAL", 145); this.copy(ctx, `INTELIGENCIA  ${this.score} / 20`, 235, "#f3c46b"); const text = this.score >= 18 ? "La academia quiere tu cráneo. Para estudiarlo." : this.score >= 10 ? "Has leído al menos el título del libro." : "El libro ha ganado esta discusión."; this.copy(ctx, text, 295); this.copy(ctx, "Pulsa ESPACIO o haz clic para volver a las pruebas.", 390, "#bdb0b6"); }
}
