import { drawCountdown } from "../engine/countdown.js";

const TOTAL_ROUNDS = 20;

const heroImg = new Image();
heroImg.src = "/Users/marcosfernandezsole/.gemini/antigravity/brain/7838775a-d166-423d-8e84-0d9aa8543429/medieval_hero_emblem_1786468900185.jpg";

const trapImg = new Image();
trapImg.src = "/Users/marcosfernandezsole/.gemini/antigravity/brain/7838775a-d166-423d-8e84-0d9aa8543429/medieval_trap_rune_1786468914251.jpg";

const coinImg = new Image();
coinImg.src = "/Users/marcosfernandezsole/.gemini/antigravity/brain/7838775a-d166-423d-8e84-0d9aa8543429/medieval_gold_coin_1786468926839.jpg";

function roundConfig(round) {
  const level = round + 1;
  let trapsNeeded = 5;
  let reactionTime = 1.05;
  let hasFakes = false;
  let moveTargets = false;
  let blink = false;
  let message = "";

  if (level === 1) {
    trapsNeeded = 5;
    reactionTime = 1.05;
    message = "Toque las trampas rojas antes de que exploten.";
  } else if (level === 2) {
    trapsNeeded = 6;
    reactionTime = 0.85;
    message = "Evaluación de reflejos burocráticos.";
  } else if (level === 3) {
    trapsNeeded = 7;
    reactionTime = 0.68;
    hasFakes = true;
    message = "¡Atención! NO toque las monedas de oro falsas.";
  } else if (level === 4) {
    trapsNeeded = 8;
    reactionTime = 0.55;
    hasFakes = true;
    moveTargets = true;
    message = "Las dianas del reino se desplazan.";
  } else if (level === 5) {
    trapsNeeded = 9;
    reactionTime = 0.45;
    hasFakes = true;
    moveTargets = true;
    blink = true;
    message = "Niebla de distracción en el campo.";
  } else {
    const extra = level - 5;
    trapsNeeded = Math.min(15, 9 + extra);
    reactionTime = Math.max(0.22, 0.40 - extra * 0.02);
    hasFakes = true;
    moveTargets = true;
    blink = true;
    message = `Reflejos de Leyenda — Nivel ${level}.`;
  }

  return { level, trapsNeeded, reactionTime, hasFakes, moveTargets, blink, message };
}

export class AgilityChallenge {
  constructor() {
    this.attributeId = "agility";
    this.reset();
  }

  reset() {
    this.round = 0;
    this.score = 1;
    this.status = "intro";
    this.activeTrap = null;
    this.trapTimer = 0;
    this.clearedTraps = 0;
    this.timeInRound = 0;
    this.targets = [];
    this.blinkTimer = 0;
    this.isBoardVisible = true;
  }

  startRound() {
    const cfg = roundConfig(this.round);
    this.clearedTraps = 0;
    this.timeInRound = 0;
    this.blinkTimer = 0;
    this.isBoardVisible = true;
    this.buildTargets();
    this.spawnNextTrap(cfg);
    this.status = "playing";
  }

  buildTargets() {
    // 4 dianas bien separadas del centro (480, 310) sin solapamiento
    const center = { x: 480, y: 310 };
    const tw = 130;
    const th = 75;

    this.targets = [
      { id: 0, label: "ARRIBA", baseX: center.x - tw / 2, baseY: 155, x: center.x - tw / 2, y: 155, w: tw, h: th },
      { id: 1, label: "DERECHA", baseX: 650, baseY: center.y - th / 2, x: 650, y: center.y - th / 2, w: tw, h: th },
      { id: 2, label: "ABAJO", baseX: center.x - tw / 2, baseY: 395, x: center.x - tw / 2, y: 395, w: tw, h: th },
      { id: 3, label: "IZQUIERDA", baseX: 180, baseY: center.y - th / 2, x: 180, y: center.y - th / 2, w: tw, h: th }
    ];
  }

  spawnNextTrap(cfg) {
    const targetIndex = Math.floor(Math.random() * this.targets.length);
    // Si la ronda admite falsas alarmas, 30% de probabilidad de trampa falsa (moneda)
    const isFake = cfg.hasFakes && Math.random() < 0.30;

    this.activeTrap = {
      targetId: targetIndex,
      isFake: isFake,
      timer: cfg.reactionTime,
      maxTime: cfg.reactionTime
    };
  }

  update(delta, pressed, _held, _released, _choice, tap) {
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
    const cfg = roundConfig(this.round);

    // Oscilación suave de dianas en Nivel 4+ sin salirse de los márgenes
    if (cfg.moveTargets) {
      this.targets.forEach((t) => {
        const offset = Math.sin(this.timeInRound * 2.8 + t.id * 1.5) * 12;
        if (t.id === 0 || t.id === 2) t.x = t.baseX + offset;
        else t.y = t.baseY + offset;
      });
    }

    // Parpadeo de niebla en Nivel 5+
    if (cfg.blink) {
      this.blinkTimer += delta;
      if (this.blinkTimer >= 0.18) {
        this.blinkTimer = 0;
        this.isBoardVisible = !this.isBoardVisible;
      }
    } else {
      this.isBoardVisible = true;
    }

    // Actualizar temporizador de la trampa activa
    if (this.activeTrap) {
      this.activeTrap.timer -= delta;

      // Si expira una trampa real -> ¡Explosión! Pierdes.
      if (this.activeTrap.timer <= 0) {
        if (!this.activeTrap.isFake) {
          this.status = "result";
          return;
        } else {
          // Si expira una trampa falsa sin tocarla -> ¡Correcto!
          this.clearedTraps += 1;
          if (this.clearedTraps >= cfg.trapsNeeded) {
            this.roundCleared();
          } else {
            this.spawnNextTrap(cfg);
          }
          return;
        }
      }
    }

    // Detectar clic/toque en dianas
    const clickedTarget = this.targetAt(tap);
    if (clickedTarget !== null && this.activeTrap) {
      this.handleTargetClick(clickedTarget, cfg);
    }
  }

  targetAt(tap) {
    if (!tap) return null;
    const target = this.targets.find(t =>
      tap.x >= t.x && tap.x <= t.x + t.w &&
      tap.y >= t.y && tap.y <= t.y + t.h
    );
    return target ? target.id : null;
  }

  handleTargetClick(targetId, cfg) {
    if (targetId === this.activeTrap.targetId) {
      if (this.activeTrap.isFake) {
        // ¡Has tocado la moneda trampa! Fallo.
        this.status = "result";
      } else {
        // ¡Esquiva / Desactivación correcta!
        this.clearedTraps += 1;
        if (this.clearedTraps >= cfg.trapsNeeded) {
          this.roundCleared();
        } else {
          this.spawnNextTrap(cfg);
        }
      }
    }
  }

  roundCleared() {
    this.round += 1;
    this.score = Math.min(TOTAL_ROUNDS, this.round + 1);
    if (this.round === TOTAL_ROUNDS) {
      this.status = "result";
    } else {
      this.startRound();
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#1a1622";
    ctx.fillRect(0, 0, 960, 540);
    ctx.textAlign = "center";

    if (this.status === "intro") return this.drawIntro(ctx);
    if (this.status === "countdown") return drawCountdown(ctx, this.timer, "Afilando los reflejos del héroe...");
    if (this.status === "result") return this.drawResult(ctx);

    this.drawGame(ctx);
  }

  title(ctx, text, y) {
    ctx.fillStyle = "#f3c46b";
    ctx.font = "bold 32px Cinzel, Georgia, serif";
    ctx.fillText(text, 480, y);
  }

  copy(ctx, text, y, color = "#f7ead0", size = 19) {
    ctx.fillStyle = color;
    ctx.font = `600 ${size}px Cinzel, Georgia, serif`;
    ctx.fillText(text, 480, y);
  }

  drawIntro(ctx) {
    this.title(ctx, "PRUEBA DE AGILIDAD", 130);
    this.copy(ctx, "Examen de Reflejos Rápidos de la Cancillería.", 200, "#f7ead0", 22);
    this.copy(ctx, "Haz CLIC o TOCA inmediatamente las trampas rojas cuando aparezcan.", 250, "#d3a658", 20);
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para empezar.", 370, "#f7ead0", 22);
  }

  drawGame(ctx) {
    const cfg = roundConfig(this.round);

    // Cabecera sin solapamiento
    this.title(ctx, `AGILIDAD — NIVEL ${cfg.level} DE ${TOTAL_ROUNDS}`, 45);
    this.copy(ctx, cfg.message, 82, "#bdb0b6", 18);
    this.copy(ctx, `Trampas desvanecidas: ${this.clearedTraps} / ${cfg.trapsNeeded}`, 110, "#f7ead0", 18);

    // Héroe central (Emblema de Caballero del Reino)
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(480, 310, 42, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(heroImg, 438, 268, 84, 84);
      ctx.restore();

      ctx.strokeStyle = "#f3c46b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(480, 310, 42, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#f3c46b";
      ctx.font = "36px Georgia, serif";
      ctx.textBaseline = "middle";
      ctx.fillText("🛡️", 480, 310);
      ctx.textBaseline = "alphabetic";
    }

    if (!this.isBoardVisible) return;

    // Dibujar dianas
    this.targets.forEach((t) => {
      const isTargetActive = this.activeTrap && this.activeTrap.targetId === t.id;
      const isFake = isTargetActive && this.activeTrap.isFake;

      if (isTargetActive) {
        // Diana con amenaza activa
        ctx.fillStyle = isFake ? "rgba(211, 166, 88, 0.25)" : "rgba(201, 91, 116, 0.25)";
        ctx.fillRect(t.x, t.y, t.w, t.h);
        ctx.strokeStyle = isFake ? "#f3c46b" : "#e05252";
        ctx.lineWidth = 3;
        ctx.strokeRect(t.x, t.y, t.w, t.h);

        // Icono de amenaza o trampa falsa
        const activeImg = isFake ? coinImg : trapImg;
        if (activeImg.complete && activeImg.naturalWidth > 0) {
          const imgSize = 56;
          ctx.save();
          ctx.beginPath();
          ctx.arc(t.x + t.w / 2, t.y + t.h / 2, imgSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(activeImg, t.x + t.w / 2 - imgSize / 2, t.y + t.h / 2 - imgSize / 2, imgSize, imgSize);
          ctx.restore();

          ctx.strokeStyle = isFake ? "#f3c46b" : "#ff4d4d";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(t.x + t.w / 2, t.y + t.h / 2, imgSize / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.font = "32px Georgia, serif";
          ctx.textBaseline = "middle";
          ctx.fillText(isFake ? "💰" : "💥", t.x + t.w / 2, t.y + t.h / 2);
          ctx.textBaseline = "alphabetic";
        }

        // Temporizador circular de la trampa
        const progress = Math.max(0, this.activeTrap.timer / this.activeTrap.maxTime);
        ctx.strokeStyle = isFake ? "#f3c46b" : "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(t.x + t.w - 16, t.y + 16, 9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();

      } else {
        // Diana inactiva
        ctx.fillStyle = "#2a1f33";
        ctx.fillRect(t.x, t.y, t.w, t.h);
        ctx.strokeStyle = "rgba(211, 166, 88, 0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(t.x, t.y, t.w, t.h);

        ctx.fillStyle = "#a89aa2";
        ctx.font = "700 15px Cinzel, serif";
        ctx.textBaseline = "middle";
        ctx.fillText(t.label, t.x + t.w / 2, t.y + t.h / 2);
        ctx.textBaseline = "alphabetic";
      }
    });
  }

  drawResult(ctx) {
    this.title(ctx, "RESULTADO OFICIAL", 130);
    ctx.fillStyle = "#f3c46b";
    ctx.font = "bold 32px Cinzel, Georgia, serif";
    ctx.fillText(`AGILIDAD  ${this.score} / 20`, 480, 210);

    let verdict = "";
    if (this.score <= 2) verdict = "Reflejos de estatua de piedra. Te ha atropellado todo.";
    else if (this.score <= 4) verdict = "Lento. Las trampas rojas del Nivel 3 te han cazado.";
    else if (this.score === 5) verdict = "¡Casi insuperable! La Niebla de Distracción te ha confundido.";
    else if (this.score <= 9) verdict = "¡FELINO REAL! Esquivas los ataques con gracia legendaria.";
    else verdict = "¡SOMBRA INALCANZABLE! El Rey no puede ni tocarte.";

    this.copy(ctx, verdict, 280, this.score >= 6 ? "#f3c46b" : "#f7ead0", 21);
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para volver a las pruebas.", 390, "#bdb0b6", 20);
  }
}


