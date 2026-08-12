// ─── PRUEBA DE INTELIGENCIA — EL ARCHIVISTA CORRUPTO (SABOTAJE TOTAL) ───────
// Simon Says medieval con giros de trolleo progresivos:
//  - Sin textos en los botones (solo símbolos de runas arcanas).
//  - Nivel 1-2: Memorización limpia (3 y 4 pasos).
//  - Nivel 3-4: Trampas Rojas (luz roja = NO pulsar).
//  - Nivel 5-6: Mezcla (reordenado de posiciones tras la demostración).
//  - Nivel 7-8: Inversión ("¡Repítela AL REVÉS!").
//  - Nivel 9-11: Cartas Boca Abajo (las baldosas se tapan cuando te toca pulsar).
//  - Nivel 12-15: Combinación de Trampas Rojas + Mezcla + Inverso.
//  - Nivel 16-20: CAOS SUPREMO (Trampas rojas + Mezcla + Inverso + Cartas boca abajo).
// 1 fallo = Fin inmediato de la prueba.

const TOTAL_ROUNDS = 20;

const RUNES = [
  { id: 0, image: "assets/images/runes/rune-sun.svg", alt: "Runa Sol" },
  { id: 1, image: "assets/images/runes/rune-moon.svg", alt: "Runa Luna" },
  { id: 2, image: "assets/images/runes/rune-star.svg", alt: "Runa Estrella" },
  { id: 3, image: "assets/images/runes/rune-eye.svg", alt: "Runa Ojo" },
  { id: 4, image: "assets/images/runes/rune-gem.svg", alt: "Runa Gema" },
  { id: 5, image: "assets/images/runes/rune-crown.svg", alt: "Runa Corona" },
];

const FACE_DOWN_SVG = `<svg viewBox="0 0 64 64" width="44" height="44" fill="none" stroke="#d3a658" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="10" width="44" height="44" rx="8" stroke-dasharray="5 3"/><path d="M32 20v24M20 32h24"/></svg>`;

const TRANSITION_PHRASES = [
  "El archivista sonríe. La primera trampa ya ha caído.",
  "El tablero acaba de mezclarse en tu cara. ¿Recordabas la runa o el sitio?",
  "Has esquivado la luz roja por milímetros.",
  "El archivista exige repetir la secuencia AL REVÉS.",
  "Luces apagadas. Las baldosas están boca abajo.",
  "Los libros del anaquel susurran secuencias falsas.",
  "El examinador suspira: 'Lástima, casi se equivoca'.",
  "¡Sorpresa! Repite en orden inverso y con baldosas movidas.",
  "Memorizar baldosas boca abajo en tu cabeza. Suerte.",
  "Memoria de bibliotecario legendario... o pura flor.",
  "Las trampas rojas y la memoria inversa se combinan.",
  "El tribunal consulta si esto ya roza la ilegalidad.",
  "Las baldosas se reordenan y se quedan boca abajo.",
  "Repetir al revés a ciegas con mezcla. Traición pura.",
  "A tres niveles de humillar al mismísimo archivista.",
  "Los sabios del Consejo han bajado a ver la masacre.",
  "Penúltima emboscada del laberinto del conocimiento.",
  "¡ÚLTIMA PRUEBA! Caos mental absoluto en el archivo.",
];

function getIntelligenceVerdict(score) {
  if (score === 0) return "Dictamen del Tribunal: Memoria de pez hervido. No recuerda ni su propio nombre al entrar.";
  if (score === 1) return "Dictamen del Tribunal: Superó el calentamiento. La primera trampa del Nivel 2 le aniquiló.";
  if (score <= 3) return "Dictamen del Tribunal: Amnesia administrativa. En cuanto las baldosas cambiaron de sitio se perdió.";
  if (score <= 6) return "Dictamen del Tribunal: Mente pesada. Cae en cuanto le piden repetir al revés.";
  if (score <= 10) return "Dictamen del Tribunal: Memoria aceptable para copiar pergaminos sencillos.";
  if (score <= 14) return "Dictamen del Tribunal: ¡Mente prodigiosa! Ha superado las cartas a ciegas y el orden inverso.";
  if (score <= 19) return "Dictamen del Tribunal: ¡SABIO DEL CONSEJO! Ha resistido todos los sabotajes del archivista.";
  return "Dictamen del Tribunal: ¡ARCHIMAGO SUPREMO! Perfección legendaria ante el troleo total del gremio.";
}

function roundConfig(roundIndex) {
  const level = Math.min(TOTAL_ROUNDS, roundIndex + 1);

  // Nivel 1: Única ronda tranquila
  if (roundIndex === 0) {
    return { level, length: 3, showSpeed: 0.48, hasRedTraps: false, shuffleAfterShow: false, isReverse: false, hideTilesOnPlay: false, message: "Nivel 1: Memoriza la secuencia de 3 runas y repítela." };
  }
  // Nivel 2: ¡Trampas rojas inmediatas!
  if (roundIndex === 1) {
    return { level, length: 4, showSpeed: 0.42, hasRedTraps: true, shuffleAfterShow: false, isReverse: false, hideTilesOnPlay: false, message: "Nivel 2: ¡ATENCIÓN! Las luces ROJAS son trampas. No las pulses." };
  }
  // Nivel 3: ¡SABOTAJE MEZCLA! (Las baldosas cambian de sitio)
  if (roundIndex === 2) {
    return { level, length: 4, showSpeed: 0.38, hasRedTraps: true, shuffleAfterShow: true, isReverse: false, hideTilesOnPlay: false, message: "Nivel 3: ¡MEZCLA! Las baldosas cambian de posición tras la demostración." };
  }
  // Nivel 4: ¡SABOTAJE INVERSIÓN! (Orden inverso)
  if (roundIndex === 3) {
    return { level, length: 4, showSpeed: 0.35, hasRedTraps: true, shuffleAfterShow: false, isReverse: true, hideTilesOnPlay: false, message: "Nivel 4: ¡INVERSIÓN! Repite la secuencia en orden INVERSO (del final al principio)." };
  }
  // Nivel 5: ¡SABOTAJE CARTAS BOCA ABAJO! (Blind)
  if (roundIndex === 4) {
    return { level, length: 4, showSpeed: 0.32, hasRedTraps: false, shuffleAfterShow: true, isReverse: false, hideTilesOnPlay: true, message: "Nivel 5: ¡BOCA ABAJO! Las baldosas se tapan cuando llega tu turno." };
  }
  // Nivel 6-9: Trampas Rojas + Mezcla + Inverso
  if (roundIndex <= 8) {
    return { level, length: 5, showSpeed: 0.30, hasRedTraps: true, shuffleAfterShow: true, isReverse: true, hideTilesOnPlay: false, message: `Nivel ${level}: Trampas rojas + Mezcla de baldosas + Orden inverso.` };
  }
  // Nivel 10-20: CAOS ABSOLUTO (Rojas + Mezcla + Inverso + Boca Abajo)
  return { level, length: 5 + Math.floor((roundIndex - 9) / 2), showSpeed: 0.25, hasRedTraps: true, shuffleAfterShow: true, isReverse: true, hideTilesOnPlay: true, message: `Nivel ${level}: ¡CAOS ABSOLUTO! Trampas rojas, orden inverso, mezcla y baldosas a ciegas.` };
}

export class IntelligenceScreen {
  constructor({ onComplete, onExit }) {
    this.onComplete = onComplete;
    this.onExit = onExit;

    this.root = document.querySelector("#intelligence-screen");
    this.chapter = document.querySelector("#intelligence-chapter");
    this.title = document.querySelector("#intelligence-title");
    this.message = document.querySelector("#intelligence-message");
    this.instructions = document.querySelector("#intelligence-instructions");
    this.board = document.querySelector("#intelligence-board");
    this.footer = document.querySelector("#intelligence-footer");
    this.levelEl = document.querySelector("#intelligence-level");
    this.scoreEl = document.querySelector("#intelligence-score");
    this.backBtn = document.querySelector("#intelligence-back");

    this.status = "intro";
    this.round = 0;
    this.scoreValue = 0;
    this.countdown = 3;
    this.lastCountdownNumber = 3;
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.resultTime = 0;

    this.sequence = [];
    this.expectedInput = [];
    this.playerInput = [];
    this.displayedTileOrder = [0, 1, 2, 3, 4, 5];
    this.isBoardFaceDown = false;

    this.animFrame = null;

    this.boundHandleKey = (e) => this.handleKeyDown(e);
    this.boundHandlePointer = (e) => this.handlePointerDown(e);

    if (this.backBtn) this.backBtn.addEventListener("click", () => this.exit());
  }

  show() {
    this.root.hidden = false;
    this.reset();
    window.addEventListener("keydown", this.boundHandleKey);
    window.addEventListener("pointerdown", this.boundHandlePointer);
    this.render();
  }

  hide() {
    this.root.hidden = true;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    window.removeEventListener("keydown", this.boundHandleKey);
    window.removeEventListener("pointerdown", this.boundHandlePointer);
  }

  reset() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.status = "intro";
    this.round = 0;
    this.scoreValue = 0;
    this.countdown = 3;
    this.lastCountdownNumber = 3;
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.resultTime = 0;
    this.displayedTileOrder = [0, 1, 2, 3, 4, 5];
    this.isBoardFaceDown = false;
    this.sequence = [];
    this.expectedInput = [];
    this.playerInput = [];
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
      this.handleActionInput(null);
      return;
    }
    const num = parseInt(event.key, 10);
    if (!isNaN(num) && num >= 1 && num <= 6) {
      event.preventDefault();
      const runeId = this.displayedTileOrder[num - 1];
      this.handleTileClick(runeId);
    }
  }

  handlePointerDown(event) {
    if (this.backBtn && (event.target === this.backBtn || this.backBtn.contains(event.target))) return;

    const tileBtn = event.target.closest(".intelligence-tile");
    if (tileBtn && this.status === "playing") {
      const runeId = parseInt(tileBtn.dataset.runeId, 10);
      this.handleTileClick(runeId);
      return;
    }

    this.handleActionInput(null);
  }

  handleActionInput(targetTileId) {
    if (this.status === "intro") {
      this.status = "countdown";
      this.countdown = 3;
      this.lastCountdownNumber = 3;
      this.startCountdownLoop();
      return;
    }
    if (this.status === "countdown" || this.status === "showing" || this.status === "level_transition") return;

    if (this.status === "result") {
      if (performance.now() - (this.resultTime || 0) < 600) return;
      if (this.onComplete) this.onComplete(this.scoreValue);
      return;
    }
  }

  handleTileClick(runeId) {
    if (this.status !== "playing") return;

    this.flashTile(runeId, "user-tap", 180);

    const expectedRuneId = this.expectedInput[this.playerInput.length];

    if (runeId === expectedRuneId) {
      this.playerInput.push(runeId);

      if (this.playerInput.length === this.expectedInput.length) {
        this.round += 1;
        this.scoreValue = Math.min(TOTAL_ROUNDS, this.round);

        if (this.round >= TOTAL_ROUNDS) {
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
    } else {
      // MISTAKE -> Instant failure!
      this.status = "result";
      this.resultTime = performance.now();
      this.flashTile(runeId, "wrong", 400);
      this.render();
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
    this.displayedTileOrder = [0, 1, 2, 3, 4, 5];
    this.isBoardFaceDown = false;

    // Generate random sequence
    this.sequence = [];
    for (let i = 0; i < cfg.length; i++) {
      const runeId = Math.floor(Math.random() * RUNES.length);
      const isTrap = cfg.hasRedTraps && Math.random() < 0.35;
      this.sequence.push({ runeId, isTrap });
    }

    const validItems = this.sequence.filter((item) => !item.isTrap).map((item) => item.runeId);
    this.expectedInput = cfg.isReverse ? validItems.reverse() : validItems;
    this.playerInput = [];

    this.status = "showing";
    this.render();
    this.playSequence(cfg);
  }

  playSequence(cfg) {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);

    let stepIndex = 0;
    const showDuration = cfg.showSpeed * 1000;
    const gapDuration = 160;

    const nextStep = () => {
      if (this.status !== "showing") return;

      if (stepIndex >= this.sequence.length) {
        if (cfg.shuffleAfterShow) {
          this.displayedTileOrder.sort(() => Math.random() - 0.5);
        }
        if (cfg.hideTilesOnPlay) {
          this.isBoardFaceDown = true;
        }
        this.status = "playing";
        this.render();
        return;
      }

      const item = this.sequence[stepIndex];
      const flashClass = item.isTrap ? "trap-flash" : "active-flash";
      this.flashTile(item.runeId, flashClass, showDuration);

      stepIndex += 1;
      setTimeout(nextStep, showDuration + gapDuration);
    };

    setTimeout(nextStep, 400);
  }

  flashTile(runeId, cssClass, durationMs) {
    if (!this.board) return;
    const btn = this.board.querySelector(`.intelligence-tile[data-rune-id="${runeId}"]`);
    if (!btn) return;

    btn.classList.add(cssClass);
    setTimeout(() => {
      btn.classList.remove(cssClass);
    }, durationMs);
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

  renderBoard() {
    if (!this.board) return;
    this.board.innerHTML = "";

    this.displayedTileOrder.forEach((runeId) => {
      const rune = RUNES[runeId];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "intelligence-tile ornate-button";
      btn.dataset.runeId = String(runeId);

      if (this.isBoardFaceDown) {
        btn.classList.add("face-down");
        btn.innerHTML = `<span class="intelligence-rune-icon">${FACE_DOWN_SVG}</span>`;
      } else {
        btn.innerHTML = `<img src="${rune.image}" alt="${rune.alt}" class="rune-asset-img" />`;
      }

      this.board.appendChild(btn);
    });
  }

  render() {
    const level = Math.min(TOTAL_ROUNDS, this.round + 1);
    const cfg = roundConfig(this.round);
    this.root.dataset.status = this.status;

    if (this.chapter) this.chapter.textContent = "Prueba de inteligencia";

    if (this.title) {
      this.title.textContent = this.status === "result"
        ? `RESULTADO: INTELIGENCIA ${this.scoreValue} / 20`
        : `INTELIGENCIA DEL GREMIO — NIVEL ${level} DE ${TOTAL_ROUNDS}`;
    }

    if (this.status === "intro") {
      this.message.textContent = "El archivista del gremio probará tu memoria arcana. Prepárate para sus trampas.";
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para empezar.";
    } else if (this.status === "countdown") {
      this.message.textContent = "El archivista baraja las losas de piedra...";
      const n = Math.ceil(this.countdown);
      this.instructions.textContent = String(n);
      if (n !== this.lastCountdownNumber) {
        this.lastCountdownNumber = n;
        this.instructions.classList.remove("pulse");
        void this.instructions.offsetWidth;
        this.instructions.classList.add("pulse");
      }
    } else if (this.status === "showing") {
      this.message.textContent = cfg.message;
      this.instructions.textContent = "MEMORIZA LA SECUENCIA DE RUNAS...";
    } else if (this.status === "level_transition") {
      this.message.textContent = `"${this.transitionPhrase}"`;
      const n = Math.ceil(this.transitionTimer);
      this.instructions.textContent = String(n);
      if (n !== this.lastCountdownNumber) {
        this.lastCountdownNumber = n;
        this.instructions.classList.remove("pulse");
        void this.instructions.offsetWidth;
        this.instructions.classList.add("pulse");
      }
    } else if (this.status === "result") {
      this.message.textContent = getIntelligenceVerdict(this.scoreValue);
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para registrar tu nota en el expediente.";
    } else if (this.status === "playing") {
      this.message.textContent = cfg.message;
      this.instructions.textContent = cfg.isReverse
        ? "¡REPETIR EN ORDEN INVERSO (DEL FINAL AL PRINCIPIO)!"
        : "¡REPITE LA SECUENCIA AHORA!";
    }

    if (this.levelEl) this.levelEl.textContent = `Nivel ${level}`;
    if (this.scoreEl) this.scoreEl.textContent = `${this.scoreValue} / 20`;

    const isPrestart = this.status === "intro" || this.status === "countdown";
    const isOverlay = isPrestart || this.status === "level_transition" || this.status === "result";

    if (this.backBtn) this.backBtn.hidden = this.status !== "result";
    if (this.footer) this.footer.hidden = isOverlay;
    if (this.board) this.board.hidden = isOverlay;

    this.renderBoard();
  }
}
