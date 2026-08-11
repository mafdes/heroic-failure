const ROUNDS = [
  { zone: .30, speed: .54, score: 4 }, { zone: .22, speed: .72, score: 7 }, { zone: .15, speed: .93, score: 10 }, { zone: .09, speed: 1.18, score: 13 }, { zone: .045, speed: 1.52, score: 16 },
];

export class DexterityChallenge {
  constructor() { this.reset(); }
  reset() { this.round = 0; this.position = 0; this.direction = 1; this.score = 1; this.status = "intro"; }
  update(delta, pressed) {
    if (this.status === "intro" && pressed) { this.status = "playing"; return; }
    if (this.status === "result" && pressed) { this.reset(); return; }
    if (this.status !== "playing") return;
    const config = ROUNDS[this.round];
    this.position += this.direction * config.speed * delta;
    if (this.position >= 1 || this.position <= 0) { this.position = Math.max(0, Math.min(1, this.position)); this.direction *= -1; }
    if (pressed) this.resolveRound(config);
  }
  resolveRound(config) {
    const zoneStart = .5 - config.zone / 2;
    const hit = this.position >= zoneStart && this.position <= zoneStart + config.zone;
    if (!hit) { this.status = "result"; return; }
    this.score = config.score; this.round += 1;
    if (this.round === ROUNDS.length) { this.score = 18; this.status = "result"; }
  }
  draw(ctx) {
    ctx.fillStyle = "#211d2a"; ctx.fillRect(0, 0, 960, 540); ctx.textAlign = "center";
    if (this.status === "intro") return this.drawIntro(ctx);
    if (this.status === "result") return this.drawResult(ctx);
    this.drawRound(ctx);
  }
  title(ctx, text, y) { ctx.fillStyle = "#f3c46b"; ctx.font = "bold 38px Georgia"; ctx.fillText(text, 480, y); }
  copy(ctx, text, y, color = "#f7ead0") { ctx.fillStyle = color; ctx.font = "22px Georgia"; ctx.fillText(text, 480, y); }
  drawIntro(ctx) { this.title(ctx, "PRUEBA DE DESTREZA", 145); this.copy(ctx, "Detén el indicador dentro de la zona dorada.", 215); this.copy(ctx, "Cada acierto hace que la burocracia sea menos razonable.", 250, "#d3a658"); this.copy(ctx, "Pulsa ESPACIO o haz clic para empezar.", 350); }
  drawRound(ctx) {
    const config = ROUNDS[this.round]; const x = 130; const y = 265; const width = 700; const height = 42; const zoneStart = x + width * (.5 - config.zone / 2);
    this.title(ctx, `DESTREZA — PRUEBA ${this.round + 1} DE 5`, 120); this.copy(ctx, "Cuando quieras. Nadie confía en ti.", 170, "#bdb0b6");
    ctx.fillStyle = "#4a3d51"; ctx.fillRect(x, y, width, height); ctx.fillStyle = "#d3a658"; ctx.fillRect(zoneStart, y, width * config.zone, height); ctx.fillStyle = "#f7ead0"; ctx.fillRect(x + width * this.position - 5, y - 12, 10, height + 24); this.copy(ctx, "ESPACIO / CLIC: detener", 390);
  }
  drawResult(ctx) { this.title(ctx, "RESULTADO OFICIAL", 145); this.copy(ctx, `DESTREZA  ${this.score}`, 235, "#f3c46b"); const verdict = this.score >= 16 ? "Inquietante. Tal vez tengas futuro." : this.score >= 10 ? "Aceptable. No preguntaremos cómo." : "El reino ha anotado tus limitaciones."; this.copy(ctx, verdict, 295); this.copy(ctx, "Pulsa ESPACIO o haz clic para repetir la prueba.", 390, "#bdb0b6"); }
}
