import { drawCountdown } from "../engine/countdown.js";

const TOTAL_ROUNDS = 20;
function config(round) { return { duration: 2.4 + round * .1, drift: .075 + round * .012, zone: Math.max(.07, .25 - round * .009) }; }

export class ConstitutionChallenge {
  constructor() { this.attributeId = "constitution"; this.reset(); }
  reset() { this.round = 0; this.score = 1; this.status = "intro"; this.health = .5; this.zoneOffset = 0; this.direction = 1; this.timer = 0; }
  startRound() { this.health = .5; this.zoneOffset = 0; this.timer = config(this.round).duration; this.status = "playing"; }
  update(delta, pressed, _held, _released, _choice, tap, direction) {
    if (this.status === "intro" && pressed) { this.status = "countdown"; this.timer = 3; return; }
    if (this.status === "countdown") { this.timer -= delta; if (this.timer <= 0) this.startRound(); return; }
    if (this.status !== "playing") return;
    const level = config(this.round); this.zoneOffset += this.round >= 4 ? Math.sin(performance.now() / 700) * .015 * delta : 0; this.health += this.direction * level.drift * delta;
    if (this.health >= .92 || this.health <= .08) this.direction *= -1;
    const push = direction || (tap ? (tap.x < 480 ? -1 : 1) : 0); if (push) this.health = Math.max(0, Math.min(1, this.health + push * .12)); this.timer -= delta;
    const start = .5 + this.zoneOffset - level.zone / 2; if (this.health < start || this.health > start + level.zone) { this.status = "result"; return; }
    if (this.timer <= 0) { this.round += 1; this.score = Math.min(TOTAL_ROUNDS, this.round + 1); if (this.round === TOTAL_ROUNDS) this.status = "result"; else this.startRound(); }
  }
  draw(ctx) { ctx.fillStyle = "#211d2a"; ctx.fillRect(0, 0, 960, 540); ctx.textAlign = "center"; if (this.status === "intro") return this.intro(ctx); if (this.status === "countdown") return drawCountdown(ctx, this.timer, "El médico ha encontrado el estetoscopio."); if (this.status === "result") return this.result(ctx); const level = config(this.round); const x = 130; const y = 245; const w = 700; const h = 54; const start = x + w * (.5 + this.zoneOffset - level.zone / 2); this.title(ctx, `CONSTITUCIÓN — NIVEL ${this.round + 1} DE ${TOTAL_ROUNDS}`, 110); this.copy(ctx, "Mantén el pulso dentro de la zona verde: toca izquierda o derecha.", 165, "#bdb0b6"); ctx.fillStyle = "#4a3d51"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#5b9c70"; ctx.fillRect(start, y, w * level.zone, h); ctx.fillStyle = "#f7ead0"; ctx.fillRect(x + w * this.health - 7, y - 12, 14, h + 24); this.copy(ctx, "← ESTABILIZAR                         ESTABILIZAR →", 380, "#f3c46b"); this.copy(ctx, `${Math.max(0, this.timer).toFixed(1)} s`, 435, "#bdb0b6"); }
  title(ctx, text, y) { ctx.fillStyle = "#f3c46b"; ctx.font = "bold 35px Georgia"; ctx.fillText(text, 480, y); }
  copy(ctx, text, y, color = "#f7ead0") { ctx.fillStyle = color; ctx.font = "22px Georgia"; ctx.fillText(text, 480, y); }
  intro(ctx) { this.title(ctx, "PRUEBA DE CONSTITUCIÓN", 145); this.copy(ctx, "Mantén el pulso en verde durante la inspección médica.", 215); this.copy(ctx, "Si sales de la zona, el diagnóstico sale de tu expediente.", 250, "#d3a658"); this.copy(ctx, "Pulsa ESPACIO o haz clic para empezar.", 350); }
  result(ctx) { this.title(ctx, "RESULTADO OFICIAL", 145); this.copy(ctx, `CONSTITUCIÓN  ${this.score} / 20`, 235, "#f3c46b"); const text = this.score >= 18 ? "Médicamente discutible. Pero admirable." : this.score >= 10 ? "Sobrevivirás al formulario B." : "El médico recomienda sentarse. Mucho."; this.copy(ctx, text, 295); this.copy(ctx, "Pulsa ESPACIO o haz clic para volver a las pruebas.", 390, "#bdb0b6"); }
}
