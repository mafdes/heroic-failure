const TOTAL_ROUNDS = 20;

function roundConfig(round) {
  if (round === 0) return { zone: .36, speed: .48 };
  return { zone: Math.max(.008, .22 * Math.pow(.82, round - 1)), speed: .95 + round * .17 };
}

export class DexterityChallenge {
  constructor() { this.attributeId = "dexterity"; this.reset(); }
  reset() { this.round = 0; this.position = 0; this.direction = 1; this.decoyPosition = .8; this.decoyDirection = -1; this.score = 1; this.status = "intro"; }
  update(delta, pressed) {
    if (this.status === "intro" && pressed) { this.status = "countdown"; this.countdown = 3; return; }
    if (this.status === "countdown") { this.countdown -= delta; if (this.countdown <= 0) { this.position = 0; this.status = "playing"; } return; }
    if (this.status !== "playing") return;
    const config = roundConfig(this.round);
    this.position += this.direction * config.speed * delta;
    if (this.position >= 1 || this.position <= 0) { this.position = Math.max(0, Math.min(1, this.position)); this.direction *= -1; }
    if (this.round >= 4) {
      this.decoyPosition += this.decoyDirection * (config.speed * .67 + .31) * delta;
      if (this.decoyPosition >= 1 || this.decoyPosition <= 0) { this.decoyPosition = Math.max(0, Math.min(1, this.decoyPosition)); this.decoyDirection *= -1; }
    }
    if (pressed) this.resolveRound(config);
  }
  resolveRound(config) {
    const zoneStart = .5 - config.zone / 2;
    if (this.position < zoneStart || this.position > zoneStart + config.zone) { this.status = "result"; return; }
    this.round += 1; this.score = Math.min(TOTAL_ROUNDS, this.round + 1);
    if (this.round === TOTAL_ROUNDS) this.status = "result";
  }
  draw(ctx) {
    ctx.fillStyle = "#211d2a"; ctx.fillRect(0, 0, 960, 540); ctx.textAlign = "center";
    if (this.status === "intro") return this.drawIntro(ctx);
    if (this.status === "countdown") return this.drawCountdown(ctx);
    if (this.status === "result") return this.drawResult(ctx);
    this.drawRound(ctx);
  }
  title(ctx, text, y) { ctx.fillStyle = "#f3c46b"; ctx.font = "bold 38px Georgia"; ctx.fillText(text, 480, y); }
  copy(ctx, text, y, color = "#f7ead0") { ctx.fillStyle = color; ctx.font = "22px Georgia"; ctx.fillText(text, 480, y); }
  drawIntro(ctx) { this.title(ctx, "PRUEBA DE DESTREZA", 145); this.copy(ctx, "20 niveles. Una zona dorada. Cero garantías.", 215); this.copy(ctx, "A partir del nivel 2, la burocracia se pone creativa.", 250, "#d3a658"); this.copy(ctx, "Pulsa ESPACIO o haz clic para empezar.", 350); }
  drawCountdown(ctx) { this.title(ctx, "PREPÁRATE", 170); this.copy(ctx, String(Math.max(1, Math.ceil(this.countdown))), 300, "#f3c46b"); this.copy(ctx, "No hagas clic todavía.", 370, "#bdb0b6"); }
  drawRound(ctx) {
    const config = roundConfig(this.round); const x = 130; const y = 265; const width = 700; const height = 42; const zoneStart = x + width * (.5 - config.zone / 2);
    this.title(ctx, `DESTREZA — NIVEL ${this.round + 1} DE ${TOTAL_ROUNDS}`, 120); this.copy(ctx, this.round < 1 ? "Calentamiento administrativo." : "Cuando quieras. Nadie confía en ti.", 170, "#bdb0b6");
    ctx.fillStyle = "#4a3d51"; ctx.fillRect(x, y, width, height); ctx.fillStyle = "#d3a658"; ctx.fillRect(zoneStart, y, width * config.zone, height); if (this.round >= 4) { ctx.fillStyle = "#c95b74"; ctx.fillRect(x + width * this.decoyPosition - 5, y - 12, 10, height + 24); } ctx.fillStyle = "#f7ead0"; ctx.fillRect(x + width * this.position - 5, y - 12, 10, height + 24); this.copy(ctx, this.round >= 4 ? "ESPACIO / CLIC: el blanco, no el rosa" : "ESPACIO / CLIC: detener", 390);
  }
  drawResult(ctx) { this.title(ctx, "RESULTADO OFICIAL", 145); this.copy(ctx, `DESTREZA  ${this.score} / 20`, 235, "#f3c46b"); const verdict = this.score >= 18 ? "Inquietante. Tal vez tengas futuro." : this.score >= 10 ? "Aceptable. No preguntaremos cómo." : "El reino ha anotado tus limitaciones."; this.copy(ctx, verdict, 295); this.copy(ctx, "Pulsa ESPACIO o haz clic para volver a las pruebas.", 390, "#bdb0b6"); }
}
