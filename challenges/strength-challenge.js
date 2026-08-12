import { drawCountdown } from "../engine/countdown.js";

const TOTAL_ROUNDS = 20;

function roundConfig(round) {
  const level = round + 1;
  let zoneSize = 0.38;
  let baseSpeed = 0.50;
  let isErratic = false;
  let moveZone = false;
  let blink = false;
  let message = "";

  if (level === 1) {
    zoneSize = 0.38;
    baseSpeed = 0.52;
    message = "La pesa de hierro ordinario. Nada que temer.";
  } else if (level === 2) {
    zoneSize = 0.26;
    baseSpeed = 0.82;
    message = "Aumentando el pesaje para el expediente del gremio.";
  } else if (level === 3) {
    zoneSize = 0.16;
    baseSpeed = 1.20;
    isErratic = true;
    message = "Pesaje con hierro encantado. Controle el impulso.";
  } else if (level === 4) {
    zoneSize = 0.11;
    baseSpeed = 1.60;
    isErratic = true;
    moveZone = true;
    message = "Evaluación de resistencia física avanzada.";
  } else if (level === 5) {
    zoneSize = 0.075;
    baseSpeed = 2.05;
    isErratic = true;
    moveZone = true;
    blink = true;
    message = "Tensión muscular bajo supervisión de los Agentes.";
  } else {
    const extra = level - 5;
    zoneSize = Math.max(0.015, 0.058 - extra * 0.006);
    baseSpeed = 2.35 + extra * 0.26;
    isErratic = true;
    moveZone = true;
    blink = true;
    message = `Prueba de Titanes — Nivel ${level}.`;
  }

  return { level, zoneSize, baseSpeed, isErratic, moveZone, blink, message };
}

export class StrengthChallenge {
  constructor() {
    this.attributeId = "strength";
    this.reset();
  }

  reset() {
    this.round = 0;
    this.charge = 0;
    this.zoneCenter = 0.5;
    this.timeInRound = 0;
    this.hasCharged = false;
    this.blinkTimer = 0;
    this.isChargeVisible = true;
    this.score = 1;
    this.status = "intro";
  }

  update(delta, pressed, held, released) {
    if (this.status === "intro" && pressed) {
      this.status = "countdown";
      this.countdown = 3;
      return;
    }
    if (this.status === "countdown") {
      this.countdown -= delta;
      if (this.countdown <= 0) this.status = "ready";
      return;
    }
    if (this.status === "ready" && pressed) {
      this.status = "playing";
      this.charge = 0;
      this.hasCharged = false;
      this.timeInRound = 0;
      return;
    }
    if (this.status !== "playing") return;

    this.timeInRound += delta;
    const cfg = roundConfig(this.round);

    // 1. Movimiento de la zona objetivo si el nivel lo requiere
    if (cfg.moveZone) {
      const wave = Math.sin(this.timeInRound * (2.2 + this.round * 0.35));
      const maxOffset = 0.36 - cfg.zoneSize / 2;
      this.zoneCenter = 0.5 + wave * maxOffset;
    } else {
      this.zoneCenter = 0.5;
    }

    // 2. Cálculo de velocidad de carga (errática o lineal)
    let currentSpeed = cfg.baseSpeed;
    if (cfg.isErratic) {
      // Tirones y fluctuaciones bruscas de carga
      const pulse = 1 + 0.65 * Math.sin(this.timeInRound * 8) + 0.3 * Math.cos(this.timeInRound * 14);
      currentSpeed *= Math.max(0.2, pulse);
    }

    // 3. Proceso de Carga
    if (held) {
      this.charge += currentSpeed * delta;
      this.hasCharged = this.hasCharged || this.charge > 0.02;
    }

    // Si sobrepasa el 100%, falla automáticamente (se le cae la pesa)
    if (this.charge >= 1) {
      this.charge = 1;
      this.status = "result";
      return;
    }

    // 4. Parpadeo / Temblor muscular
    if (cfg.blink && held) {
      this.blinkTimer += delta;
      if (this.blinkTimer >= 0.16) {
        this.blinkTimer = 0;
        this.isChargeVisible = !this.isChargeVisible;
      }
    } else {
      this.isChargeVisible = true;
    }

    // 5. Soltar carga
    if (released && this.hasCharged) {
      this.resolveRound(cfg);
    }
  }

  resolveRound(cfg) {
    const zoneStart = this.zoneCenter - cfg.zoneSize / 2;
    const zoneEnd = this.zoneCenter + cfg.zoneSize / 2;

    if (this.charge < zoneStart || this.charge > zoneEnd) {
      this.status = "result";
      return;
    }

    this.round += 1;
    this.score = Math.min(TOTAL_ROUNDS, this.round + 1);
    this.charge = 0;
    this.hasCharged = false;
    this.timeInRound = 0;
    this.blinkTimer = 0;
    this.isChargeVisible = true;

    if (this.round === TOTAL_ROUNDS) this.status = "result";
  }

  draw(ctx) {
    ctx.fillStyle = "#1a1622";
    ctx.fillRect(0, 0, 960, 540);
    ctx.textAlign = "center";

    if (this.status === "intro") return this.drawIntro(ctx);
    if (this.status === "countdown") return this.drawCountdown(ctx);
    if (this.status === "ready") return this.drawReady(ctx);
    if (this.status === "result") return this.drawResult(ctx);

    this.drawRound(ctx);
  }

  title(ctx, text, y) {
    ctx.fillStyle = "#f3c46b";
    ctx.font = "bold 40px Cinzel, Georgia, serif";
    ctx.fillText(text, 480, y);
  }

  copy(ctx, text, y, color = "#f7ead0") {
    ctx.fillStyle = color;
    ctx.font = "600 24px Cinzel, Georgia, serif";
    ctx.fillText(text, 480, y);
  }

  drawIntro(ctx) {
    this.title(ctx, "PRUEBA DE FUERZA", 135);
    this.copy(ctx, "Demuestra al gremio que tus músculos son algo más que rumor de taberna.", 215);
    this.copy(ctx, "Carga la pesa y suéltala exactamente en la franja objetivo.", 265, "#d3a658");
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para empezar.", 370);
  }

  drawCountdown(ctx) {
    drawCountdown(ctx, this.countdown, "Sopesando el hierro real...");
  }

  drawReady(ctx) {
    this.title(ctx, "LA PESA REAL ESTÁ LISTA", 165);
    this.copy(ctx, "MANTÉN ESPACIO, CLIC o TOQUE para cargar la pesa.", 275);
    this.copy(ctx, "Suelta el botón cuando la carga esté en la franja objetivo.", 325, "#d3a658");
  }

  drawRound(ctx) {
    const cfg = roundConfig(this.round);
    const x = 110;
    const y = 260;
    const width = 740;
    const height = 46;

    this.title(ctx, `FUERZA DEL GREMIO — NIVEL ${cfg.level} DE ${TOTAL_ROUNDS}`, 115);
    this.copy(ctx, cfg.message, 175, "#bdb0b6");

    // Contenedor / Rail de carga
    ctx.fillStyle = "#362a3f";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(211, 166, 88, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // Zona objetivo (Rojiza / Dorada)
    const zoneStartPixel = x + width * (this.zoneCenter - cfg.zoneSize / 2);
    const zoneWidthPixel = width * cfg.zoneSize;
    ctx.fillStyle = "#a9683e";
    ctx.fillRect(zoneStartPixel, y, zoneWidthPixel, height);
    ctx.strokeStyle = "#f3c46b";
    ctx.lineWidth = 2;
    ctx.strokeRect(zoneStartPixel, y, zoneWidthPixel, height);

    // Barra de Carga del Jugador
    if (this.isChargeVisible && this.charge > 0) {
      ctx.fillStyle = "#f3c46b";
      ctx.shadowColor = "#f3c46b";
      ctx.shadowBlur = 10;
      ctx.fillRect(x, y, width * this.charge, height);
      ctx.shadowBlur = 0;
    }

    // Leyenda de control
    this.copy(ctx, "MANTÉN PULSADO Y SUELTA EN LA FRANJA OBJETIVO DEL GREMIO", 410, "#f7ead0");
  }

  drawResult(ctx) {
    this.title(ctx, "RESULTADO OFICIAL", 130);
    ctx.fillStyle = "#f3c46b";
    ctx.font = "bold 34px Cinzel, Georgia, serif";
    ctx.fillText(`FUERZA  ${this.score} / 20`, 480, 220);

    let verdict = "";
    if (this.score <= 2) verdict = "Tus brazos son como fideos de la taberna real.";
    else if (this.score <= 4) verdict = "Patético. El hierro del Nivel 3 te ha aplastado.";
    else if (this.score === 5) verdict = "¡A un suspiro de la gloria! El temblor muscular te ha vencido.";
    else if (this.score <= 9) verdict = "¡TITÁNICO! El gremio contempla tu fuerza con preocupación.";
    else verdict = "¡LEYENDA DE LA MAZMORRA! Has levantado el castillo entero.";

    this.copy(ctx, verdict, 290, this.score >= 6 ? "#f3c46b" : "#f7ead0");
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para volver a las pruebas.", 395, "#bdb0b6");
  }
}
