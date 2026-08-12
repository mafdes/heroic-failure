import { drawCountdown } from "../engine/countdown.js";

const TOTAL_ROUNDS = 20;

function roundConfig(round) {
  const level = round + 1;
  let zoneSize = 0.35;
  let speed = 0.5;
  let hasDecoy = false;
  let moveZone = false;
  let blink = false;
  let hasSecondDecoy = false;
  let message = "";

  if (level === 1) {
    zoneSize = 0.34;
    speed = 0.55;
    message = "Calentamiento administrativo.";
  } else if (level === 2) {
    zoneSize = 0.24;
    speed = 0.85;
    message = "Prosiga con la solicitud del gremio.";
  } else if (level === 3) {
    zoneSize = 0.17;
    speed = 1.30;
    hasDecoy = true;
    message = "Nadie confía en su pulso.";
  } else if (level === 4) {
    zoneSize = 0.12;
    speed = 1.70;
    hasDecoy = true;
    moveZone = true;
    message = "Mantenga la compostura.";
  } else if (level === 5) {
    zoneSize = 0.085;
    speed = 2.15;
    hasDecoy = true;
    moveZone = true;
    blink = true;
    message = "El formulario no admite dudas.";
  } else {
    const extra = level - 5;
    zoneSize = Math.max(0.015, 0.065 - extra * 0.007);
    speed = 2.45 + extra * 0.28;
    hasDecoy = true;
    moveZone = true;
    blink = true;
    hasSecondDecoy = extra >= 2;
    message = `Evaluación gremial — Nivel ${level}.`;
  }

  return { level, zoneSize, speed, hasDecoy, moveZone, blink, hasSecondDecoy, message };
}

const TRANSITION_PHRASES = [
  "Los examinadores del gremio no esperaban que siguieras entero.",
  "Sorprendente. Un topo con resaca lo habría hecho peor, así que enhorabuena.",
  "La mazmorra toma nota de tu ridículo margen de supervivencia.",
  "Tu expediente acaba de ganar 2 miligramos de respeto administrativo.",
  "El gremio solicita, con mucha educación, que no te vengas arriba.",
  "Has superado el nivel por los pelos de un trasgo mal pagado.",
  "Un logro remarcable para alguien con tu coordinación de cubo roto.",
  "La mesa de admisiones consulta si esto fue habilidad o pura chiripa."
];

export class DexterityChallenge {
  constructor() {
    this.attributeId = "dexterity";
    this.reset();
  }

  reset() {
    this.round = 0;
    this.clearedLevel = 0;
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.position = 0;
    this.direction = 1;
    this.decoy1Position = 0.9;
    this.decoy1Direction = -1;
    this.decoy2Position = 0.1;
    this.decoy2Direction = 1;
    this.zoneCenter = 0.5;
    this.timeInRound = 0;
    this.blinkTimer = 0;
    this.isIndicatorVisible = true;
    this.score = 1;
    this.status = "intro";
  }

  update(delta, pressed) {
    if (this.status === "intro" && pressed) {
      this.status = "countdown";
      this.countdown = 3;
      return;
    }
    if (this.status === "countdown") {
      this.countdown -= delta;
      if (this.countdown <= 0) {
        this.position = 0;
        this.status = "playing";
        this.timeInRound = 0;
      }
      return;
    }
    if (this.status === "level_transition") {
      this.transitionTimer -= delta;
      if (this.transitionTimer <= 0) {
        this.position = 0;
        this.decoy1Position = 0.88;
        this.decoy2Position = 0.12;
        this.timeInRound = 0;
        this.blinkTimer = 0;
        this.isIndicatorVisible = true;
        this.status = "playing";
      }
      return;
    }
    if (this.status !== "playing") return;

    this.timeInRound += delta;
    const cfg = roundConfig(this.round);

    // 1. Movimiento del indicador del jugador
    this.position += this.direction * cfg.speed * delta;
    if (this.position >= 1 || this.position <= 0) {
      this.position = Math.max(0, Math.min(1, this.position));
      this.direction *= -1;
    }

    // 2. Movimiento de la zona dorada
    if (cfg.moveZone) {
      const wave = Math.sin(this.timeInRound * (2.4 + this.round * 0.45));
      const maxOffset = 0.38 - cfg.zoneSize / 2;
      this.zoneCenter = 0.5 + wave * maxOffset;
    } else {
      this.zoneCenter = 0.5;
    }

    // 3. Movimiento del Señuelo 1 (Rosa)
    if (cfg.hasDecoy) {
      this.decoy1Position += this.decoy1Direction * (cfg.speed * 1.35 + 0.25) * delta;
      if (this.decoy1Position >= 1 || this.decoy1Position <= 0) {
        this.decoy1Position = Math.max(0, Math.min(1, this.decoy1Position));
        this.decoy1Direction *= -1;
      }
    }

    // 4. Movimiento del Señuelo 2 (Cian para nivel 7+)
    if (cfg.hasSecondDecoy) {
      this.decoy2Position += this.decoy2Direction * (cfg.speed * 0.85 + 0.45) * delta;
      if (this.decoy2Position >= 1 || this.decoy2Position <= 0) {
        this.decoy2Position = Math.max(0, Math.min(1, this.decoy2Position));
        this.decoy2Direction *= -1;
      }
    }

    // 5. Parpadeo del indicador
    if (cfg.blink) {
      this.blinkTimer += delta;
      if (this.blinkTimer >= 0.18) {
        this.blinkTimer = 0;
        this.isIndicatorVisible = !this.isIndicatorVisible;
      }
    } else {
      this.isIndicatorVisible = true;
    }

    if (pressed) this.resolveRound(cfg);
  }

  resolveRound(cfg) {
    const zoneStart = this.zoneCenter - cfg.zoneSize / 2;
    const zoneEnd = this.zoneCenter + cfg.zoneSize / 2;

    if (this.position < zoneStart || this.position > zoneEnd) {
      this.status = "result";
      return;
    }

    this.clearedLevel = this.round + 1;
    this.round += 1;
    this.score = Math.min(TOTAL_ROUNDS, this.round + 1);

    if (this.round === TOTAL_ROUNDS) {
      this.status = "result";
    } else {
      this.status = "level_transition";
      this.transitionTimer = 2.4;
      this.transitionPhrase = TRANSITION_PHRASES[(this.clearedLevel - 1) % TRANSITION_PHRASES.length];
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#1a1622";
    ctx.fillRect(0, 0, 960, 540);
    ctx.textAlign = "center";

    if (this.status === "intro") return this.drawIntro(ctx);
    if (this.status === "countdown") return this.drawCountdown(ctx);
    if (this.status === "level_transition") {
      this.title(ctx, `¡NIVEL ${this.clearedLevel} SUPERADO!`, 130);
      this.copy(ctx, `"${this.transitionPhrase}"`, 210, "#d3a658", 20);
      drawCountdown(ctx, this.transitionTimer, `Preparando Nivel ${this.round + 1}...`);
      return;
    }
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
    this.title(ctx, "PRUEBA DE DESTREZA", 135);
    this.copy(ctx, "20 niveles. Una barra dorada. Cero garantías de ingreso.", 215);
    this.copy(ctx, "El gremio no notificará los cambios de normativa ni pedirá perdón.", 265, "#d3a658");
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para empezar.", 370);
  }

  drawCountdown(ctx) {
    drawCountdown(ctx, this.countdown, "Mantén la concentración...");
  }

  drawRound(ctx) {
    const cfg = roundConfig(this.round);
    const x = 110;
    const y = 260;
    const width = 740;
    const height = 46;

    this.title(ctx, `DESTREZA DEL GREMIO — NIVEL ${cfg.level} DE ${TOTAL_ROUNDS}`, 115);
    this.copy(ctx, cfg.message, 175, "#bdb0b6");

    // Track principal
    ctx.fillStyle = "#362a3f";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(211, 166, 88, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // Zona dorada móvil o fija
    const zoneStartPixel = x + width * (this.zoneCenter - cfg.zoneSize / 2);
    const zoneWidthPixel = width * cfg.zoneSize;
    ctx.fillStyle = "#f3c46b";
    ctx.fillRect(zoneStartPixel, y, zoneWidthPixel, height);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(zoneStartPixel, y, zoneWidthPixel, height);

    // Señuelo 1 (Rosa)
    if (cfg.hasDecoy) {
      ctx.fillStyle = "#ff4081";
      ctx.fillRect(x + width * this.decoy1Position - 6, y - 14, 12, height + 28);
    }

    // Señuelo 2 (Cian - Nivel 7+)
    if (cfg.hasSecondDecoy) {
      ctx.fillStyle = "#00e5ff";
      ctx.fillRect(x + width * this.decoy2Position - 6, y - 14, 12, height + 28);
    }

    // Indicador del jugador (Blanco)
    if (this.isIndicatorVisible) {
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 12;
      ctx.fillRect(x + width * this.position - 7, y - 16, 14, height + 32);
      ctx.shadowBlur = 0;
    }

    // Leyenda inferior totalmente neutra
    this.copy(ctx, "ESPACIO / CLIC / TOQUE: Detener el indicador antes de hacer el ridículo", 410, "#f7ead0");
  }

  drawResult(ctx) {
    this.title(ctx, "RESULTADO OFICIAL", 130);
    ctx.fillStyle = "#f3c46b";
    ctx.font = "bold 34px Cinzel, Georgia, serif";
    ctx.fillText(`DESTREZA  ${this.score} / 20`, 480, 220);

    let verdict = "";
    if (this.score <= 2) verdict = "Tu destreza da lástima. Ni para abrir una carta.";
    else if (this.score <= 4) verdict = "Decepcionante. Las irregularidades te han superado.";
    else if (this.score === 5) verdict = "¡Muy cerca de la gloria! El parpadeo te ha cazado.";
    else if (this.score <= 9) verdict = "¡HEROICO! Has sobrevivido al caos burocrático.";
    else verdict = "¡NIVEL DIVINO! El Ministerio de Destreza se rinde ante ti.";

    this.copy(ctx, verdict, 290, this.score >= 6 ? "#f3c46b" : "#f7ead0");
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para volver a las pruebas.", 395, "#bdb0b6");
  }
}

