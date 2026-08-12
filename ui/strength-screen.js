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
    message = "La pesa de hierro ordinario. Mantén pulsado y suelta en la zona.";
  } else if (level === 2) {
    zoneSize = 0.26;
    baseSpeed = 0.82;
    message = "Aumentando el pesaje para el expediente del gremio.";
  } else if (level === 3) {
    zoneSize = 0.16;
    baseSpeed = 1.20;
    isErratic = true;
    message = "Pesaje con hierro encantado. Controle el impulso de carga.";
  } else if (level === 4) {
    zoneSize = 0.11;
    baseSpeed = 1.60;
    isErratic = true;
    moveZone = true;
    message = "Evaluación de resistencia física avanzada. La franja se mueve.";
  } else if (level === 5) {
    zoneSize = 0.075;
    baseSpeed = 2.05;
    isErratic = true;
    moveZone = true;
    blink = true;
    message = "Tensión muscular extrema bajo supervisión de los Agentes.";
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

const TRANSITION_PHRASES = [
  "El yunque real no se rompió, pero tus muñecas piden compasión.",
  "Sorprendente. Un orco con lumbalgia habría doblado más el hierro.",
  "El tribunal del gremio anota que tus bíceps han superado la prueba de milagro.",
  "Tus fibras musculares acaban de ganar 2 gramos de dignidad administrativa.",
  "El gremio aconseja no intentar levantar jarras de cerveza con tanto ímpetu.",
  "Sobreviviste a la carga por los pelos de un enano minero.",
  "Un esfuerzo remarcable para alguien con tu complexión de junco seco.",
  "Los examinadores dudan si fue potencia física o pánico acumulado."
];

function getStrengthVerdict(score) {
  if (score <= 3) return "Dictamen del Tribunal: Brazos como fideos de taberna. El peso del formulario casi le quiebra la muñeca.";
  if (score <= 6) return "Dictamen del Tribunal: Fuerza ridícula. La pesa del Nivel 4 ha opinado sobre sus músculos.";
  if (score <= 10) return "Dictamen del Tribunal: Potencia bruta aceptable. Sirve para cargar sacos de carbón del gremio.";
  if (score <= 15) return "Dictamen del Tribunal: ¡Titánico! El tribunal ha tenido que apartarse de la mesa.";
  return "Dictamen del Tribunal: ¡Fuerza de Gigante! Ha levantado el gremio entero por los cimientos.";
}

export class StrengthScreen {
  constructor({ onComplete, onExit }) {
    this.onComplete = onComplete;
    this.onExit = onExit;
    this.root = document.querySelector("#strength-screen");
    this.chapter = document.querySelector("#strength-chapter");
    this.title = document.querySelector("#strength-title");
    this.message = document.querySelector("#strength-message");
    this.instructions = document.querySelector("#strength-instructions");
    this.rail = document.querySelector(".strength-rail");
    this.footer = document.querySelector(".strength-footer");
    this.zone = document.querySelector("#strength-zone");
    this.chargeBar = document.querySelector("#strength-charge");
    this.level = document.querySelector("#strength-level");
    this.score = document.querySelector("#strength-score");
    this.backBtn = document.querySelector("#strength-back");

    this.status = "intro";
    this.round = 0;
    this.scoreValue = 0;
    this.charge = 0;
    this.zoneCenter = 0.5;
    this.timeInRound = 0;
    this.isHolding = false;
    this.hasCharged = false;
    this.blinkTimer = 0;
    this.isChargeVisible = true;
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.countdown = 3;
    this.lastCountdownNumber = 3;
    this.resultTime = 0;
    this.lastTimestamp = null;
    this.animFrame = null;

    this.boundKeyDown = (e) => this.handleKeyDown(e);
    this.boundKeyUp = (e) => this.handleKeyUp(e);
    this.boundPointerDown = (e) => this.handlePointerDown(e);
    this.boundPointerUp = (e) => this.handlePointerUp(e);

    if (this.backBtn) {
      this.backBtn.addEventListener("click", () => this.exit());
    }
  }

  show() {
    this.root.hidden = false;
    this.reset();
    window.addEventListener("keydown", this.boundKeyDown);
    window.addEventListener("keyup", this.boundKeyUp);
    window.addEventListener("pointerdown", this.boundPointerDown);
    window.addEventListener("pointerup", this.boundPointerUp);
    this.render();
  }

  hide() {
    this.root.hidden = true;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    window.removeEventListener("keydown", this.boundKeyDown);
    window.removeEventListener("keyup", this.boundKeyUp);
    window.removeEventListener("pointerdown", this.boundPointerDown);
    window.removeEventListener("pointerup", this.boundPointerUp);
  }

  reset() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.round = 0;
    this.scoreValue = 0;
    this.charge = 0;
    this.zoneCenter = 0.5;
    this.timeInRound = 0;
    this.isHolding = false;
    this.hasCharged = false;
    this.blinkTimer = 0;
    this.isChargeVisible = true;
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.countdown = 3;
    this.lastCountdownNumber = 3;
    this.resultTime = 0;
    this.status = "intro";
    this.lastTimestamp = null;
    this.render();
  }

  exit() {
    const wasResult = this.status === "result";
    const finalScore = this.scoreValue;
    this.hide();
    if (wasResult && this.onComplete) {
      this.onComplete(finalScore);
    } else if (this.onExit) {
      this.onExit();
    }
  }

  handleKeyDown(event) {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      if (!this.isHolding) {
        this.isHolding = true;
        this.handlePressStart();
      }
    }
  }

  handleKeyUp(event) {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      if (this.isHolding) {
        this.isHolding = false;
        this.handlePressRelease();
      }
    }
  }

  handlePointerDown(event) {
    if (this.backBtn && (event.target === this.backBtn || this.backBtn.contains(event.target))) return;
    if (!this.isHolding) {
      this.isHolding = true;
      this.handlePressStart();
    }
  }

  handlePointerUp() {
    if (this.isHolding) {
      this.isHolding = false;
      this.handlePressRelease();
    }
  }

  handlePressStart() {
    if (this.status === "intro") {
      this.status = "countdown";
      this.countdown = 3;
      this.startCountdownLoop();
      return;
    }
    if (this.status === "countdown") return;
    if (this.status === "level_transition") return;
    if (this.status === "result") {
      if (performance.now() - (this.resultTime || 0) < 600) return;
      if (this.onComplete) this.onComplete(this.scoreValue);
      return;
    }
    if (this.status === "playing") {
      this.hasCharged = true;
    }
  }

  handlePressRelease() {
    if (this.status === "playing" && this.hasCharged) {
      const cfg = roundConfig(this.round);
      this.resolveRound(cfg);
    }
  }

  startCountdownLoop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const startedAt = performance.now();
    const step = () => {
      if (this.status !== "countdown") return;
      this.countdown = 3 - ((performance.now() - startedAt) / 1000);
      if (this.countdown <= 0) {
        this.status = "playing";
        this.timeInRound = 0;
        this.charge = 0;
        this.hasCharged = false;
        this.lastTimestamp = performance.now();
        this.render();
        this.startPlayLoop();
        return;
      }
      this.render();
      this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  }

  startPlayLoop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const step = (timestamp) => {
      if (this.status !== "playing") return;
      const delta = Math.min((timestamp - (this.lastTimestamp || timestamp)) / 1000, 0.05);
      this.lastTimestamp = timestamp;

      this.timeInRound += delta;
      const cfg = roundConfig(this.round);

      if (cfg.moveZone) {
        const wave = Math.sin(this.timeInRound * (2.2 + this.round * 0.35));
        const maxOffset = 0.36 - cfg.zoneSize / 2;
        this.zoneCenter = 0.5 + wave * maxOffset;
      } else {
        this.zoneCenter = 0.5;
      }

      let currentSpeed = cfg.baseSpeed;
      if (cfg.isErratic) {
        const pulse = 1 + 0.65 * Math.sin(this.timeInRound * 8) + 0.3 * Math.cos(this.timeInRound * 14);
        currentSpeed *= Math.max(0.2, pulse);
      }

      if (this.isHolding) {
        this.charge += currentSpeed * delta;
        this.hasCharged = this.hasCharged || this.charge > 0.02;
      }

      if (this.charge >= 1) {
        this.charge = 1;
        this.status = "result";
        this.resultTime = performance.now();
        this.render();
        return;
      }

      if (cfg.blink && this.isHolding) {
        this.blinkTimer += delta;
        if (this.blinkTimer >= 0.16) {
          this.blinkTimer = 0;
          this.isChargeVisible = !this.isChargeVisible;
        }
      } else {
        this.isChargeVisible = true;
      }

      this.render();
      this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  }

  resolveRound(cfg) {
    const zoneStart = this.zoneCenter - cfg.zoneSize / 2;
    const zoneEnd = this.zoneCenter + cfg.zoneSize / 2;

    if (this.charge < zoneStart || this.charge > zoneEnd) {
      this.status = "result";
      this.resultTime = performance.now();
      this.render();
      return;
    }

    this.round += 1;
    this.scoreValue = Math.min(TOTAL_ROUNDS, this.round + 1);
    this.charge = 0;
    this.hasCharged = false;

    if (this.round === TOTAL_ROUNDS) {
      this.status = "result";
      this.resultTime = performance.now();
    } else {
      this.status = "level_transition";
      this.transitionTimer = 2.4;
      this.transitionPhrase = TRANSITION_PHRASES[(this.round - 1) % TRANSITION_PHRASES.length];
      this.startTransitionLoop();
    }
    this.render();
  }

  startTransitionLoop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const startedAt = performance.now();
    const duration = 2400;
    const step = () => {
      if (this.status !== "level_transition") return;
      this.transitionTimer = Math.max(0, (duration - (performance.now() - startedAt)) / 1000);
      if (this.transitionTimer <= 0) {
        this.status = "playing";
        this.timeInRound = 0;
        this.charge = 0;
        this.hasCharged = false;
        this.lastTimestamp = performance.now();
        this.render();
        this.startPlayLoop();
        return;
      }
      this.render();
      this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  }

  render() {
    const cfg = roundConfig(this.round);
    this.root.dataset.status = this.status;
    this.chapter.textContent = "Prueba de fuerza";
    this.title.textContent = this.status === "result"
      ? `RESULTADO: FUERZA ${this.scoreValue} / 20`
      : `FUERZA DEL GREMIO — NIVEL ${cfg.level} DE ${TOTAL_ROUNDS}`;

    const isPrestart = this.status === "intro" || this.status === "countdown";

    if (this.status === "result") {
      this.message.textContent = getStrengthVerdict(this.scoreValue);
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para registrar tu nota en el expediente.";
    } else if (this.status === "level_transition") {
      this.message.textContent = `"${this.transitionPhrase}"`;
    } else {
      this.message.textContent = cfg.message;
    }

    if (this.status === "intro") {
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para empezar.";
    } else if (this.status === "countdown") {
      const countdownNumber = Math.ceil(this.countdown);
      this.instructions.textContent = String(countdownNumber);
      if (countdownNumber !== this.lastCountdownNumber) {
        this.lastCountdownNumber = countdownNumber;
        this.instructions.classList.remove("pulse");
        void this.instructions.offsetWidth;
        this.instructions.classList.add("pulse");
      }
    } else if (this.status === "level_transition") {
      const transitionNumber = Math.ceil(this.transitionTimer);
      this.instructions.textContent = String(transitionNumber);
      if (transitionNumber !== this.lastCountdownNumber) {
        this.lastCountdownNumber = transitionNumber;
        this.instructions.classList.remove("pulse");
        void this.instructions.offsetWidth;
        this.instructions.classList.add("pulse");
      }
    } else if (this.status === "playing") {
      this.instructions.textContent = "MANTÉN PULSADO para cargar y SUELTA en la zona objetivo.";
    }

    this.level.textContent = `Nivel ${cfg.level}`;
    this.score.textContent = `${this.scoreValue} / 20`;
    this.rail.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.footer.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.backBtn.hidden = this.status !== "result";
    this.level.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.score.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.zone.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.chargeBar.hidden = isPrestart || this.status === "level_transition" || this.status === "result";

    if (!isPrestart && this.status !== "level_transition" && this.status !== "result") {
      const zoneStartPct = (this.zoneCenter - cfg.zoneSize / 2) * 100;
      const zoneWidthPct = cfg.zoneSize * 100;
      const chargePct = this.charge * 100;

      this.zone.style.left = `${zoneStartPct}%`;
      this.zone.style.width = `${zoneWidthPct}%`;
      this.chargeBar.style.width = `${chargePct}%`;
      this.chargeBar.style.opacity = this.isChargeVisible ? "1" : "0.25";
    }
  }
}
