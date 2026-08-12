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
    message = "Mantenga el pulso en la zona verde con toques acompasados.";
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

const TRANSITION_PHRASES = [
  "Los examinadores médicos dudan de que tengas pulso humano.",
  "Sorprendente. Un topo con soplo en el corazón lo habría hecho igual.",
  "El gremio anota en tu ficha: 'Sujeto milagrosamente con vida'.",
  "El estetoscopio del examinador acaba de pedir la baja laboral.",
  "Mantuviste el ritmo por pura cabezonería burocrática.",
  "Tu corazón resiste más que tu sentido de la dignidad.",
  "La camilla de urgencias esperará al siguiente nivel.",
  "El gremio consulta si tu sangre contiene poción o pura suerte."
];

function getConstitutionVerdict(score) {
  if (score <= 3) return "Dictamen del Tribunal: Salud de lechuga marchita. Un estornudo de trasgo le causaría la muerte.";
  if (score <= 6) return "Dictamen del Tribunal: Resistencia raquítica. El tribunal le receta sopa de ortigas y no molestar.";
  if (score <= 10) return "Dictamen del Tribunal: Pulso vital estable. Puede aguantar un golpe de barra de taberna sin morir.";
  if (score <= 15) return "Dictamen del Tribunal: Constitución de mulo. Aguanta la peste de mazmorra sin inmutarse.";
  return "Dictamen del Tribunal: Inmortalidad sospechosa. Se investigará si es un no-muerto camuflado.";
}

export class ConstitutionScreen {
  constructor({ onComplete, onExit }) {
    this.onComplete = onComplete;
    this.onExit = onExit;
    this.root = document.querySelector("#constitution-screen");
    this.chapter = document.querySelector("#constitution-chapter");
    this.title = document.querySelector("#constitution-title");
    this.message = document.querySelector("#constitution-message");
    this.instructions = document.querySelector("#constitution-instructions");
    this.meter = document.querySelector(".pulse-meter");
    this.zone = document.querySelector("#pulse-zone");
    this.needle = document.querySelector("#pulse-needle");
    this.footer = document.querySelector(".constitution-footer");
    this.levelEl = document.querySelector("#constitution-level");
    this.scoreEl = document.querySelector("#constitution-score");
    this.timerBar = document.querySelector("#constitution-timer-bar");
    this.backBtn = document.querySelector("#constitution-back");

    this.status = "intro";
    this.round = 0;
    this.scoreValue = 0;
    this.health = 0.5;
    this.zoneCenter = 0.5;
    this.timer = 0;
    this.timeInRound = 0;
    this.graceTimer = 0;
    this.blinkTimer = 0;
    this.isIndicatorVisible = true;
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.countdown = 3;
    this.lastCountdownNumber = 3;
    this.resultTime = 0;

    this.boundHandleKey = (event) => this.handleKey(event);
    this.boundHandlePointer = (event) => this.handlePointer(event);
    this.boundHandleAction = () => this.handleAction();

    this.backBtn.addEventListener("click", () => this.exit());
  }

  show() {
    this.root.hidden = false;
    this.reset();
    window.addEventListener("keydown", this.boundHandleKey);
    window.addEventListener("pointerdown", this.boundHandlePointer);
    this.root.addEventListener("click", this.boundHandleAction);
    this.render();
  }

  hide() {
    this.root.hidden = true;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    window.removeEventListener("keydown", this.boundHandleKey);
    window.removeEventListener("pointerdown", this.boundHandlePointer);
    this.root.removeEventListener("click", this.boundHandleAction);
  }

  reset() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.round = 0;
    this.scoreValue = 0;
    this.health = 0.5;
    this.zoneCenter = 0.5;
    this.timer = 0;
    this.timeInRound = 0;
    this.graceTimer = 0;
    this.blinkTimer = 0;
    this.isIndicatorVisible = true;
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

  handleKey(event) {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      this.handleAction();
    }
  }

  handlePointer(event) {
    if (event.target === this.backBtn || this.backBtn.contains(event.target)) return;
    this.handleAction();
  }

  handleAction() {
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
      const cfg = roundConfig(this.round);
      this.health = Math.min(1.0, this.health + cfg.impulse);
    }
  }

  startCountdownLoop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const startedAt = performance.now();
    const step = () => {
      if (this.status !== "countdown") return;
      this.countdown = 3 - ((performance.now() - startedAt) / 1000);
      if (this.countdown <= 0) {
        this.startRound();
        return;
      }
      this.render();
      this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  }

  startRound() {
    const cfg = roundConfig(this.round);
    this.health = 0.5;
    this.zoneCenter = 0.5;
    this.timer = cfg.duration;
    this.timeInRound = 0;
    this.graceTimer = 1.3;
    this.blinkTimer = 0;
    this.isIndicatorVisible = true;
    this.status = "playing";
    this.lastTimestamp = performance.now();
    this.startPlayLoop();
  }

  startPlayLoop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const step = (timestamp) => {
      if (this.status !== "playing") return;
      const delta = Math.min((timestamp - (this.lastTimestamp || timestamp)) / 1000, 0.05);
      this.lastTimestamp = timestamp;

      this.timeInRound += delta;
      this.timer -= delta;
      const cfg = roundConfig(this.round);

      if (this.graceTimer > 0) {
        this.graceTimer -= delta;
      }

      if (cfg.moveZone) {
        const wave = Math.sin(this.timeInRound * (2.2 + this.round * 0.4));
        const maxOffset = 0.36 - cfg.zoneSize / 2;
        this.zoneCenter = 0.5 + wave * maxOffset;
      } else {
        this.zoneCenter = 0.5;
      }

      let currentGravity = this.graceTimer > 0 ? cfg.gravity * 0.4 : cfg.gravity;
      if (cfg.isErratic && this.graceTimer <= 0) {
        const pulse = 1 + 0.6 * Math.sin(this.timeInRound * 7) + 0.3 * Math.cos(this.timeInRound * 13);
        currentGravity *= Math.max(0.3, pulse);
      }
      this.health -= currentGravity * delta;

      if (cfg.blink && this.graceTimer <= 0) {
        this.blinkTimer += delta;
        if (this.blinkTimer >= 0.18) {
          this.blinkTimer = 0;
          this.isIndicatorVisible = !this.isIndicatorVisible;
        }
      } else {
        this.isIndicatorVisible = true;
      }

      if (this.graceTimer <= 0) {
        const zoneStart = this.zoneCenter - cfg.zoneSize / 2;
        const zoneEnd = this.zoneCenter + cfg.zoneSize / 2;

        if (this.health < zoneStart || this.health > zoneEnd) {
          this.status = "result";
          this.resultTime = performance.now();
          this.render();
          return;
        }
      }

      if (this.timer <= 0) {
        this.round += 1;
        this.scoreValue = Math.min(TOTAL_ROUNDS, this.round + 1);
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
        return;
      }

      this.render();
      this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  }

  startTransitionLoop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const startedAt = performance.now();
    const duration = 2400;
    const step = () => {
      if (this.status !== "level_transition") return;
      this.transitionTimer = Math.max(0, (duration - (performance.now() - startedAt)) / 1000);
      if (this.transitionTimer <= 0) {
        this.startRound();
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
    this.chapter.textContent = "Prueba de constitución";
    this.title.textContent = this.status === "result"
      ? `RESULTADO: CONSTITUCIÓN ${this.scoreValue} / 20`
      : `CONSTITUCIÓN DEL GREMIO — NIVEL ${cfg.level} DE ${TOTAL_ROUNDS}`;

    if (this.status === "intro") {
      this.message.textContent = "Evaluación de pulso y resistencia vital del gremio.";
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para empezar.";
    } else if (this.status === "countdown") {
      this.message.textContent = "Los médicos del gremio preparan el estetoscopio...";
      const countdownNumber = Math.ceil(this.countdown);
      this.instructions.textContent = String(countdownNumber);
      if (countdownNumber !== this.lastCountdownNumber) {
        this.lastCountdownNumber = countdownNumber;
        this.instructions.classList.remove("pulse");
        void this.instructions.offsetWidth;
        this.instructions.classList.add("pulse");
      }
    } else if (this.status === "level_transition") {
      this.message.textContent = `"${this.transitionPhrase}"`;
      const transitionNumber = Math.ceil(this.transitionTimer);
      this.instructions.textContent = String(transitionNumber);
      if (transitionNumber !== this.lastCountdownNumber) {
        this.lastCountdownNumber = transitionNumber;
        this.instructions.classList.remove("pulse");
        void this.instructions.offsetWidth;
        this.instructions.classList.add("pulse");
      }
    } else if (this.status === "result") {
      this.message.textContent = getConstitutionVerdict(this.scoreValue);
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para registrar tu nota en el expediente.";
    } else {
      this.message.textContent = cfg.message;
      this.instructions.textContent = this.graceTimer > 0
        ? "¡PREPÁRATE! TOCA / CLIC PARA MANTENER EL PULSO EN LA ZONA VERDE"
        : "TOCA / CLIC / ESPACIO PARA DAR UN LATIDO Y SUBIR LA AGUJA";
    }

    this.levelEl.textContent = `Nivel ${cfg.level}`;
    this.scoreEl.textContent = `${this.scoreValue} / 20`;

    const isPlaying = this.status === "playing";
    this.meter.hidden = !isPlaying;
    this.footer.hidden = !isPlaying;
    if (this.timerBar) this.timerBar.hidden = !isPlaying;
    this.backBtn.hidden = this.status !== "result";

    if (isPlaying) {
      const zoneStartPct = (1 - (this.zoneCenter + cfg.zoneSize / 2)) * 100;
      const zoneHeightPct = cfg.zoneSize * 100;
      const needleTopPct = (1 - this.health) * 100;
      const progressPct = Math.max(0, (this.timer / cfg.duration) * 100);

      this.zone.style.top = `${zoneStartPct}%`;
      this.zone.style.height = `${zoneHeightPct}%`;
      this.needle.style.top = `calc(${needleTopPct}% - 4px)`;
      this.needle.style.opacity = this.isIndicatorVisible ? "1" : "0.25";

      if (this.timerBar) {
        this.timerBar.style.width = `${progressPct}%`;
      }
    }
  }
}
