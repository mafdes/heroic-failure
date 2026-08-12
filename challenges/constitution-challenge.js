import { drawCountdown } from "../engine/countdown.js";

const TOTAL_ROUNDS = 20;

function roundConfig(round) {
  const level = round + 1;
  let zoneSize = 0.38;
  let gravity = 0.35;
  let impulse = 0.12;
  let duration = 6.0 + level * 0.3;
  let isErratic = false;
  let moveZone = false;
  let blink = false;
  let message = "";

  if (level === 1) {
    zoneSize = 0.38;
    gravity = 0.32;
    message = "Mantenga el pulso en la zona verde con clics acompasados.";
  } else if (level === 2) {
    zoneSize = 0.28;
    gravity = 0.42;
    message = "Evaluación de resistencia biológica.";
  } else if (level === 3) {
    zoneSize = 0.20;
    gravity = 0.54;
    isErratic = true;
    message = "El pulso sufre alteraciones térmicas.";
  } else if (level === 4) {
    zoneSize = 0.14;
    gravity = 0.68;
    isErratic = true;
    moveZone = true;
    message = "La franja de salud se desplaza.";
  } else if (level === 5) {
    zoneSize = 0.095;
    gravity = 0.82;
    isErratic = true;
    moveZone = true;
    blink = true;
    message = "Niebla médica en los monitores del gremio.";
  } else {
    const extra = level - 5;
    zoneSize = Math.max(0.022, 0.075 - extra * 0.005);
    gravity = 0.90 + extra * 0.12;
    isErratic = true;
    moveZone = true;
    blink = true;
    message = `Prueba de Resistencia Imposible — Nivel ${level}.`;
  }

  return { level, zoneSize, gravity, impulse, duration, isErratic, moveZone, blink, message };
}

export class ConstitutionChallenge {
  constructor() {
    this.attributeId = "constitution";
    this.reset();
  }

  reset() {
    this.round = 0;
    this.score = 1;
    this.status = "intro";
    this.health = 0.5;
    this.zoneCenter = 0.5;
    this.timer = 0;
    this.timeInRound = 0;
    this.graceTimer = 0;
    this.blinkTimer = 0;
    this.isIndicatorVisible = true;
  }

  startRound() {
    const cfg = roundConfig(this.round);
    this.health = 0.5;
    this.zoneCenter = 0.5;
    this.timer = cfg.duration;
    this.timeInRound = 0;
    this.graceTimer = 1.3; // 1.3s de tiempo de gracia e inmunidad al empezar
    this.blinkTimer = 0;
    this.isIndicatorVisible = true;
    this.status = "playing";
  }

  update(delta, pressed) {
    if (this.status === "intro" && pressed) {
      this.status = "countdown";
      this.timer = 3;
      return;
    }
    if (this.status === "countdown") {
      this.timer -= delta;
      if (this.timer <= 0) this.startRound();
      return;
    }
    if (this.status !== "playing") return;

    this.timeInRound += delta;
    this.timer -= delta;
    const cfg = roundConfig(this.round);

    // Período de gracia tras la cuenta atrás
    if (this.graceTimer > 0) {
      this.graceTimer -= delta;
    }

    // 1. Movimiento de la zona de salud objetivo
    if (cfg.moveZone) {
      const wave = Math.sin(this.timeInRound * (2.2 + this.round * 0.4));
      const maxOffset = 0.36 - cfg.zoneSize / 2;
      this.zoneCenter = 0.5 + wave * maxOffset;
    } else {
      this.zoneCenter = 0.5;
    }

    // 2. Gravedad / Caída de la aguja de pulso (reducida durante el período de gracia)
    let currentGravity = this.graceTimer > 0 ? cfg.gravity * 0.4 : cfg.gravity;
    if (cfg.isErratic && this.graceTimer <= 0) {
      const pulse = 1 + 0.6 * Math.sin(this.timeInRound * 7) + 0.3 * Math.cos(this.timeInRound * 13);
      currentGravity *= Math.max(0.3, pulse);
    }
    this.health -= currentGravity * delta;

    // 3. Clic / Impulso del jugador para subir la aguja
    if (pressed) {
      this.health = Math.min(1.0, this.health + cfg.impulse);
    }

    // 4. Parpadeo de niebla médica
    if (cfg.blink && this.graceTimer <= 0) {
      this.blinkTimer += delta;
      if (this.blinkTimer >= 0.18) {
        this.blinkTimer = 0;
        this.isIndicatorVisible = !this.isIndicatorVisible;
      }
    } else {
      this.isIndicatorVisible = true;
    }

    // 5. Comprobar si se sale de la zona verde (solo tras el período de gracia)
    if (this.graceTimer <= 0) {
      const zoneStart = this.zoneCenter - cfg.zoneSize / 2;
      const zoneEnd = this.zoneCenter + cfg.zoneSize / 2;

      if (this.health < zoneStart || this.health > zoneEnd) {
        this.status = "result";
        return;
      }
    }

    // 6. Superar la ronda tras aguantar todo el tiempo
    if (this.timer <= 0) {
      this.round += 1;
      this.score = Math.min(TOTAL_ROUNDS, this.round + 1);
      if (this.round === TOTAL_ROUNDS) {
        this.status = "result";
      } else {
        this.startRound();
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#1a1622";
    ctx.fillRect(0, 0, 960, 540);
    ctx.textAlign = "center";

    if (this.status === "intro") return this.drawIntro(ctx);
    if (this.status === "countdown") return drawCountdown(ctx, this.timer, "Los médicos preparan el estetoscopio...");
    if (this.status === "result") return this.drawResult(ctx);

    this.drawGame(ctx);
  }

  title(ctx, text, y) {
    ctx.fillStyle = "#f3c46b";
    ctx.font = "bold 34px Cinzel, Georgia, serif";
    ctx.fillText(text, 480, y);
  }

  copy(ctx, text, y, color = "#f7ead0", size = 20) {
    ctx.fillStyle = color;
    ctx.font = `600 ${size}px Cinzel, Georgia, serif`;
    ctx.fillText(text, 480, y);
  }

  drawIntro(ctx) {
    this.title(ctx, "PRUEBA DE CONSTITUCIÓN", 130);
    this.copy(ctx, "Evaluación de Pulso y Resistencia Vital del Gremio.", 200, "#f7ead0", 22);
    this.copy(ctx, "Haz CLIC o TOCA la pantalla para dar impulsos de pulso", 250, "#d3a658", 20);
    this.copy(ctx, "y mantener la aguja blanca dentro de la franja verde.", 280, "#d3a658", 20);
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para empezar.", 380, "#f7ead0", 22);
  }

  drawGame(ctx) {
    const cfg = roundConfig(this.round);
    const x = 430;
    const y = 145;
    const width = 100;
    const height = 250;

    this.title(ctx, `CONSTITUCIÓN DEL GREMIO — NIVEL ${cfg.level} DE ${TOTAL_ROUNDS}`, 90);
    this.copy(ctx, cfg.message, 128, "#bdb0b6", 19);

    // Medidor vertical de pulso
    ctx.fillStyle = "#362a3f";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(211, 166, 88, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // Zona verde de salud
    const zoneStartPixel = y + height * (1 - (this.zoneCenter + cfg.zoneSize / 2));
    const zoneHeightPixel = height * cfg.zoneSize;
    ctx.fillStyle = "#5b9c70";
    ctx.fillRect(x, zoneStartPixel, width, zoneHeightPixel);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, zoneStartPixel, width, zoneHeightPixel);

    // Aguja / Indicador de pulso del jugador
    if (this.isIndicatorVisible) {
      const indicatorY = y + height * (1 - this.health);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 10;
      ctx.fillRect(x - 12, indicatorY - 4, width + 24, 8);
      ctx.shadowBlur = 0;
    }

    // Aviso durante el período de gracia
    if (this.graceTimer > 0) {
      this.copy(ctx, "¡PREPÁRATE! HAZ CLIC PARA MANTENER EL RITMO", 420, "#f3c46b", 19);
    } else {
      this.copy(ctx, "HAZ CLIC / TOCA PARA DAR UN LATIDO Y SUBIR LA AGUJA", 420, "#f7ead0", 19);
    }

    // Barra de tiempo restante
    const progress = Math.max(0, this.timer / cfg.duration);
    ctx.fillStyle = "#362a3f";
    ctx.fillRect(230, 455, 500, 16);
    ctx.fillStyle = "#f3c46b";
    ctx.fillRect(230, 455, 500 * progress, 16);
    ctx.strokeStyle = "rgba(211, 166, 88, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(230, 455, 500, 16);
  }

  drawResult(ctx) {
    this.title(ctx, "RESULTADO OFICIAL", 130);
    ctx.fillStyle = "#f3c46b";
    ctx.font = "bold 32px Cinzel, Georgia, serif";
    ctx.fillText(`CONSTITUCIÓN  ${this.score} / 20`, 480, 210);

    let verdict = "";
    if (this.score <= 2) verdict = "Tu pulso se ha detenido. El médico recomienda descanso eterno.";
    else if (this.score <= 4) verdict = "Aritmia severa. Las fluctuaciones del Nivel 3 te han desmayado.";
    else if (this.score === 5) verdict = "¡A un paso del éxito! La Niebla Médica te ha desorientado.";
    else if (this.score <= 9) verdict = "¡RESISTENCIA DE HIERRO! Los Agentes anotan tu robustez.";
    else verdict = "¡INMORTAL REAL! Ni las pociones más oscuras pueden contigo.";

    this.copy(ctx, verdict, 280, this.score >= 6 ? "#f3c46b" : "#f7ead0", 21);
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para volver a las pruebas.", 390, "#bdb0b6", 20);
  }
}

