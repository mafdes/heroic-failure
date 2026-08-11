const TOTAL_ROUNDS = 20;

function roundConfig(round) {
  if (round === 0) return { zone: .42, speed: .38 };
  return { zone: Math.max(.009, .25 * Math.pow(.84, round - 1)), speed: .52 + round * .045 };
}

export class StrengthChallenge {
  constructor() { this.reset(); }
  reset() { this.round = 0; this.charge = 0; this.score = 1; this.status = "intro"; this.hasCharged = false; }
  update(delta, pressed, held, released) {
    if (this.status === "intro" && pressed) { this.status = "playing"; return; }
    if (this.status !== "playing") return;
    const config = roundConfig(this.round);
    if (held) { this.charge += config.speed * delta; this.hasCharged = this.hasCharged || this.charge > .02; }
    if (this.charge >= 1) { this.charge = 1; this.status = "result"; }
    if (released && this.hasCharged) this.resolveRound(config);
  }
  resolveRound(config) {
    const zoneStart = .5 - config.zone / 2;
    if (this.charge < zoneStart || this.charge > zoneStart + config.zone) { this.status = "result"; return; }
    this.round += 1; this.score = Math.min(TOTAL_ROUNDS, this.round + 1); this.charge = 0; this.hasCharged = false;
    if (this.round === TOTAL_ROUNDS) this.status = "result";
  }
  draw(ctx) {
    ctx.fillStyle = "#211d2a"; ctx.fillRect(0, 0, 960, 540); ctx.textAlign = "center";
    if (this.status === "intro") return this.drawIntro(ctx);
    if (this.status === "result") return this.drawResult(ctx);
    const config = roundConfig(this.round); const x = 130; const y = 265; const width = 700; const height = 42; const zoneStart = x + width * (.5 - config.zone / 2);
    this.title(ctx, `FUERZA — NIVEL ${this.round + 1} DE ${TOTAL_ROUNDS}`, 120); this.copy(ctx, this.round < 1 ? "La pesa está vacía. Por ahora." : "No te pases. La espalda no tiene repuestos.", 170, "#bdb0b6");
    ctx.fillStyle = "#4a3d51"; ctx.fillRect(x, y, width, height); ctx.fillStyle = "#a9683e"; ctx.fillRect(zoneStart, y, width * config.zone, height); ctx.fillStyle = "#f3c46b"; ctx.fillRect(x, y, width * this.charge, height); this.copy(ctx, "MANTÉN ESPACIO / CLIC Y SUELTA EN LA ZONA", 390);
  }
  title(ctx, text, y) { ctx.fillStyle = "#f3c46b"; ctx.font = "bold 38px Georgia"; ctx.fillText(text, 480, y); }
  copy(ctx, text, y, color = "#f7ead0") { ctx.fillStyle = color; ctx.font = "22px Georgia"; ctx.fillText(text, 480, y); }
  drawIntro(ctx) { this.title(ctx, "PRUEBA DE FUERZA", 145); this.copy(ctx, "Carga la pesa y suéltala en la zona rojiza.", 215); this.copy(ctx, "20 niveles. Tu columna ha solicitado discreción.", 250, "#d3a658"); this.copy(ctx, "Pulsa ESPACIO o haz clic para empezar.", 350); }
  drawResult(ctx) { this.title(ctx, "RESULTADO OFICIAL", 145); this.copy(ctx, `FUERZA  ${this.score} / 20`, 235, "#f3c46b"); const verdict = this.score >= 18 ? "La pesa ha pedido asilo político." : this.score >= 10 ? "Suficiente para mover una silla con permiso." : "Tu músculo ha presentado una queja formal."; this.copy(ctx, verdict, 295); this.copy(ctx, "Pulsa ESPACIO o haz clic para volver a las pruebas.", 390, "#bdb0b6"); }
}
