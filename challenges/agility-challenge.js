import { drawCountdown } from "../engine/countdown.js";

const TOTAL_ROUNDS = 20;
function config(round) { return { duration: 2.8 + round * .09, speed: .28 + round * .018, spawn: Math.max(.32, .9 - round * .025) }; }

export class AgilityChallenge {
  constructor() { this.attributeId = "agility"; this.reset(); }
  reset() { this.round = 0; this.score = 1; this.status = "intro"; this.lane = 1; this.obstacles = []; this.timer = 0; this.spawnTimer = 0; this.seed = 0; }
  startRound() { this.lane = 1; this.obstacles = []; this.timer = config(this.round).duration; this.spawnTimer = .55; this.status = "playing"; }
  update(delta, pressed, _held, _released, _choice, tap, direction) {
    if (this.status === "intro" && pressed) { this.status = "countdown"; this.timer = 3; return; }
    if (this.status === "countdown") { this.timer -= delta; if (this.timer <= 0) this.startRound(); return; }
    if (this.status !== "playing") return;
    const selected = direction ? this.lane + direction : tap ? Math.min(2, Math.floor(tap.x / 320)) : null; if (selected !== null) this.lane = Math.max(0, Math.min(2, selected));
    const level = config(this.round); this.timer -= delta; this.spawnTimer -= delta; if (this.spawnTimer <= 0) { const lane = (this.seed * 7 + this.round * 3 + 1) % 3; this.obstacles.push({ lane, y: -45, wide: this.round >= 4 && this.seed % 4 === 0 }); this.seed += 1; this.spawnTimer = level.spawn; }
    this.obstacles.forEach((obstacle) => { obstacle.y += level.speed * 540 * delta; }); this.obstacles = this.obstacles.filter((obstacle) => obstacle.y < 580);
    if (this.obstacles.some((obstacle) => obstacle.y > 390 && obstacle.y < 480 && (obstacle.lane === this.lane || obstacle.wide && Math.abs(obstacle.lane - this.lane) === 1))) { this.status = "result"; return; }
    if (this.timer <= 0) { this.round += 1; this.score = Math.min(TOTAL_ROUNDS, this.round + 1); if (this.round === TOTAL_ROUNDS) this.status = "result"; else this.startRound(); }
  }
  draw(ctx) { ctx.fillStyle = "#211d2a"; ctx.fillRect(0, 0, 960, 540); ctx.textAlign = "center"; if (this.status === "intro") return this.intro(ctx); if (this.status === "countdown") return drawCountdown(ctx, this.timer, "El pasillo ha sido despejado. Más o menos."); if (this.status === "result") return this.result(ctx); this.title(ctx, `AGILIDAD — NIVEL ${this.round + 1} DE ${TOTAL_ROUNDS}`, 95); this.copy(ctx, "Toca un carril o usa ← → para esquivar al ministerio.", 145, "#bdb0b6"); for (let lane = 0; lane < 3; lane += 1) { ctx.strokeStyle = "#65556b"; ctx.lineWidth = 3; ctx.strokeRect(170 + lane * 210, 180, 180, 310); } this.obstacles.forEach((obstacle) => { ctx.fillStyle = obstacle.wide ? "#c95b74" : "#a9683e"; const x = 170 + obstacle.lane * 210; ctx.fillRect(x + 25, obstacle.y, obstacle.wide ? 340 : 130, 40); }); ctx.fillStyle = "#f3c46b"; ctx.fillRect(210 + this.lane * 210, 415, 100, 55); this.copy(ctx, "Toca IZQUIERDA · CENTRO · DERECHA", 525, "#f3c46b"); }
  title(ctx, text, y) { ctx.fillStyle = "#f3c46b"; ctx.font = "bold 35px Georgia"; ctx.fillText(text, 480, y); }
  copy(ctx, text, y, color = "#f7ead0") { ctx.fillStyle = color; ctx.font = "22px Georgia"; ctx.fillText(text, 480, y); }
  intro(ctx) { this.title(ctx, "PRUEBA DE AGILIDAD", 145); this.copy(ctx, "Cruza el pasillo sin ser sellado por un formulario.", 215); this.copy(ctx, "Desde el nivel 5, algunos formularios ocupan demasiado espacio.", 250, "#d3a658"); this.copy(ctx, "Pulsa ESPACIO o haz clic para empezar.", 350); }
  result(ctx) { this.title(ctx, "RESULTADO OFICIAL", 145); this.copy(ctx, `AGILIDAD  ${this.score} / 20`, 235, "#f3c46b"); const text = this.score >= 18 ? "Has llegado antes que el papeleo. Histórico." : this.score >= 10 ? "Puedes cruzar una sala sin pedir auxilio." : "El pasillo te ha ganado por puntos."; this.copy(ctx, text, 295); this.copy(ctx, "Pulsa ESPACIO o haz clic para volver a las pruebas.", 390, "#bdb0b6"); }
}
