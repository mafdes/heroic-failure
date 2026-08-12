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
    speed = 1.3;
    hasDecoy = true;
    message = "Nadie confía en su pulso.";
  } else if (level === 4) {
    zoneSize = 0.12;
    speed = 1.7;
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

export class DexterityScreen {
  constructor({ onComplete, onExit }) {
    this.onComplete = onComplete;
    this.onExit = onExit;
    this.root = document.querySelector("#dexterity-screen");
    this.chapter = document.querySelector("#dexterity-chapter");
    this.title = document.querySelector("#dexterity-title");
    this.message = document.querySelector("#dexterity-message");
    this.instructions = document.querySelector("#dexterity-instructions");
    this.rail = document.querySelector(".dexterity-rail");
    this.footer = document.querySelector(".dexterity-footer");
    this.zone = document.querySelector("#dexterity-zone");
    this.decoy1 = document.querySelector("#dexterity-decoy-1");
    this.decoy2 = document.querySelector("#dexterity-decoy-2");
    this.cursor = document.querySelector("#dexterity-cursor");
    this.level = document.querySelector("#dexterity-level");
    this.score = document.querySelector("#dexterity-score");
    this.backBtn = document.querySelector("#dexterity-back");
    this.status = "intro";
    this.round = 0;
    this.scoreValue = 1;
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
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.countdown = 3;
    this.lastCountdownNumber = 3;
    this.boundHandleKey = (event) => this.handleKey(event);
    this.boundHandlePointer = (event) => this.handlePointer(event);
    this.boundHandleClick = () => this.handleAction();
    this.backBtn.addEventListener("click", () => this.exit());
  }

  show() {
    this.root.hidden = false;
    this.reset();
    window.addEventListener("keydown", this.boundHandleKey);
    window.addEventListener("pointerdown", this.boundHandlePointer);
    this.root.addEventListener("click", this.boundHandleClick);
    this.render();
  }

  hide() {
    this.root.hidden = true;
    clearInterval(this.loop);
    window.removeEventListener("keydown", this.boundHandleKey);
    window.removeEventListener("pointerdown", this.boundHandlePointer);
    this.root.removeEventListener("click", this.boundHandleClick);
  }

  reset() {
    this.round = 0;
    this.scoreValue = 1;
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
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.countdown = 3;
    this.lastCountdownNumber = 3;
    this.status = "intro";
    this.render();
  }

  exit() {
    this.hide();
    if (this.onExit) this.onExit();
  }

  handleKey(event) {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      this.handleAction();
    }
  }

  handlePointer() {
    this.handleAction();
  }

  handleAction() {
    if (this.status === "intro") {
      this.status = "countdown";
      this.countdown = 3;
      this.tickCountdown();
      return;
    }
    if (this.status === "countdown") return;
    if (this.status === "level_transition") return;
    if (this.status === "result") {
      if (this.onComplete) this.onComplete(this.scoreValue);
      return;
    }
    this.resolveRound(roundConfig(this.round));
  }

  tickCountdown() {
    const startedAt = performance.now();
    const step = () => {
      if (this.status !== "countdown") return;
      this.countdown = 3 - ((performance.now() - startedAt) / 1000);
      if (this.countdown <= 0) {
        this.status = "playing";
        this.timeInRound = 0;
        this.position = 0;
        this.render();
        this.loop = setInterval(() => this.tickPlay(), 16);
        return;
      }
      this.render();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  tickPlay() {
    if (this.status !== "playing") return;
    const cfg = roundConfig(this.round);
    this.timeInRound += 0.016;
    this.position += this.direction * cfg.speed * 0.016;
    if (this.position >= 1 || this.position <= 0) {
      this.position = Math.max(0, Math.min(1, this.position));
      this.direction *= -1;
    }
    if (cfg.moveZone) {
      const wave = Math.sin(this.timeInRound * (2.4 + this.round * 0.45));
      const maxOffset = 0.38 - cfg.zoneSize / 2;
      this.zoneCenter = 0.5 + wave * maxOffset;
    } else {
      this.zoneCenter = 0.5;
    }
    if (cfg.hasDecoy) {
      this.decoy1Position += this.decoy1Direction * (cfg.speed * 1.35 + 0.25) * 0.016;
      if (this.decoy1Position >= 1 || this.decoy1Position <= 0) {
        this.decoy1Position = Math.max(0, Math.min(1, this.decoy1Position));
        this.decoy1Direction *= -1;
      }
    }
    if (cfg.hasSecondDecoy) {
      this.decoy2Position += this.decoy2Direction * (cfg.speed * 0.85 + 0.45) * 0.016;
      if (this.decoy2Position >= 1 || this.decoy2Position <= 0) {
        this.decoy2Position = Math.max(0, Math.min(1, this.decoy2Position));
        this.decoy2Direction *= -1;
      }
    }
    if (cfg.blink) {
      this.blinkTimer += 0.016;
      if (this.blinkTimer >= 0.18) {
        this.blinkTimer = 0;
        this.isIndicatorVisible = !this.isIndicatorVisible;
      }
    } else {
      this.isIndicatorVisible = true;
    }
    this.render();
  }

  resolveRound(cfg) {
    const zoneStart = this.zoneCenter - cfg.zoneSize / 2;
    const zoneEnd = this.zoneCenter + cfg.zoneSize / 2;
    if (this.position < zoneStart || this.position > zoneEnd) {
      this.status = "result";
      this.render();
      return;
    }
    this.round += 1;
    this.scoreValue = Math.min(TOTAL_ROUNDS, this.round + 1);
    if (this.round === TOTAL_ROUNDS) {
      this.status = "result";
    } else {
      this.status = "level_transition";
      this.transitionTimer = 2.4;
      this.transitionPhrase = TRANSITION_PHRASES[(this.round - 1) % TRANSITION_PHRASES.length];
      this.tickTransition();
    }
    this.render();
  }

  tickTransition() {
    const startedAt = performance.now();
    const duration = 2400;
    const step = () => {
      if (this.status !== "level_transition") return;
      this.transitionTimer = Math.max(0, (duration - (performance.now() - startedAt)) / 1000);
      if (this.transitionTimer <= 0) {
        this.status = "playing";
        this.render();
        return;
      }
      this.render();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  render() {
    const cfg = roundConfig(this.round);
    this.root.dataset.status = this.status;
    this.chapter.textContent = "Prueba de destreza";
    this.title.textContent = `DESTREZA DEL GREMIO — NIVEL ${cfg.level} DE ${TOTAL_ROUNDS}`;
    const isPrestart = this.status === "intro" || this.status === "countdown";
    this.message.textContent = this.status === "level_transition" ? `"${this.transitionPhrase}"` : cfg.message;
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
    } else if (this.status === "result") {
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para volver a las pruebas.";
    } else if (this.status === "level_transition") {
      const transitionNumber = Math.ceil(this.transitionTimer);
      this.instructions.textContent = String(transitionNumber);
      if (transitionNumber !== this.lastCountdownNumber) {
        this.lastCountdownNumber = transitionNumber;
        this.instructions.classList.remove("pulse");
        void this.instructions.offsetWidth;
        this.instructions.classList.add("pulse");
      }
    } else {
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para detener el indicador.";
    }
    this.level.textContent = `Nivel ${cfg.level}`;
    this.score.textContent = `${this.scoreValue} / 20`;
    this.rail.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.footer.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.backBtn.hidden = this.status !== "result";
    this.level.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.score.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.zone.hidden = isPrestart || this.status === "level_transition" || this.status === "result";
    this.decoy1.hidden = isPrestart || !cfg.hasDecoy || this.status === "level_transition" || this.status === "result";
    this.decoy2.hidden = isPrestart || !cfg.hasSecondDecoy || this.status === "level_transition" || this.status === "result";
    this.cursor.hidden = isPrestart || this.status === "level_transition" || this.status === "result";

    if (!isPrestart && this.status !== "level_transition" && this.status !== "result") {
      const railWidth = this.root.querySelector(".dexterity-rail").clientWidth || 760;
      const cursorX = this.position * railWidth;
      const zoneStart = (this.zoneCenter - cfg.zoneSize / 2) * railWidth;
      const zoneWidth = cfg.zoneSize * railWidth;
      const decoy1X = this.decoy1Position * railWidth;
      const decoy2X = this.decoy2Position * railWidth;
      this.zone.style.left = `${zoneStart}px`;
      this.zone.style.width = `${zoneWidth}px`;
      this.cursor.style.left = `${cursorX - 7}px`;
      this.decoy1.style.left = `${decoy1X - 6}px`;
      this.decoy2.style.left = `${decoy2X - 6}px`;
      this.cursor.style.opacity = this.isIndicatorVisible ? "1" : "0.25";
    }
  }
}
