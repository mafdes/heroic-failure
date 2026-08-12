// ─── PRUEBA DE AGILIDAD — ESQUIVA LOS BARRILES DEL ALMACÉN ─────────────────
// Score = oleadas esquivadas (máximo 20). El juego es deliberadamente absurdo.
// Ronda 0:  1 barril (única oleada "suave", es el nivel 1)
// Ronda 1:  2 barriles desfasados 0.30s en columnas distintas
// Ronda 2+: 3 barriles en rápida sucesión, empieza el caos real
// Ronda 5+: drift — los barriles cambian de carril mientras caen
// Ronda 10+: drift agresivo + velocidad brutal
// 1 impacto = fin inmediato.

const TOTAL_ROUNDS = 20;
const LANE_CENTERS = [16.66, 50, 83.33]; // % left dentro de la arena

const TRANSITION_PHRASES = [
  "Por los pelos. El roble rozó tus pantorrillas.",
  "Dos a la vez y aún respiras. El tribunal frunce el ceño.",
  "El aprendiz que empujó los barriles ha sido felicitado.",
  "Los barriles encadenados aceleran su descenso.",
  "Tres a la vez y sigues en pie. Sospechoso.",
  "Los barriles han consultado con sus abogados.",
  "Los toneles empiezan a cambiar de opinión... y de carril.",
  "El examinador jefe ha tirado el formulario al suelo.",
  "Un barril ha decidido perseguirte personalmente.",
  "El almacén entero ruge con la avalancha.",
  "Los examinadores han abandonado la sala. Esto ya no es normal.",
  "El gremio ha convocado refuerzos desde la bodega norte.",
  "Los toneles ruedan en zigzag. Heresiarca del almacén.",
  "Velocidad obscena. El escribiente no puede tomar notas.",
  "Los barriles ya no siguen las leyes de la física.",
  "El examinador ha pedido un médico. Para él.",
  "Nadie ha llegado aquí antes. Ni siquiera los propietarios.",
  "Los barriles se han rendido. Tú no.",
  "¡La última oleada del almacén más peligroso del gremio!",
];

function getAgilityVerdict(score) {
  if (score === 0) return "Dictamen del Tribunal: Aplastado por el primer barril. El almacén no le ha dado ni un segundo.";
  if (score === 1) return "Dictamen del Tribunal: Esquivó uno. Solo uno. El gremio no sabe si llorar o reír.";
  if (score <= 4) return "Dictamen del Tribunal: Agilidad de saco de papas. Los barriles le han ganado con facilidad ofensiva.";
  if (score <= 8) return "Dictamen del Tribunal: Reflejos pesados. Califica para guardia de entrada, sentado.";
  if (score <= 12) return "Dictamen del Tribunal: Movilidad aceptable. Lo justo para sobrevivir a un almacén sin desafío.";
  if (score <= 16) return "Dictamen del Tribunal: ¡Agilidad destacable! Los barriles drifting le han costado sudores fríos.";
  if (score <= 19) return "Dictamen del Tribunal: ¡Reflejos de sombra! El almacén entero ha quedado humillado.";
  return "Dictamen del Tribunal: ¡LEYENDA DE LA BODEGA! Perfección absurda. El tribunal investiga si es un fantasma.";
}

/**
 * Devuelve parámetros de dificultad ESTÁTICOS para un índice de ronda.
 * La asignación aleatoria de carriles ocurre en startRound().
 */
function getDifficulty(roundIndex) {
  // Ronda 0: 1 barril fácil (único nivel "amable")
  if (roundIndex === 0) {
    return { barrelCount: 1, stagger: 0, drift: false, dropDuration: 1.30 };
  }
  // Ronda 1: 2 barriles desfasados — ya hay que pensar
  if (roundIndex === 1) {
    return { barrelCount: 2, stagger: 0.30, drift: false, dropDuration: 1.10 };
  }
  // Ronda 2: 3 barriles en sucesión, empieza el caos
  if (roundIndex === 2) {
    return { barrelCount: 3, stagger: 0.22, drift: false, dropDuration: 0.95 };
  }
  // Ronda 3-4: 3 barriles rápidos
  if (roundIndex <= 4) {
    return { barrelCount: 3, stagger: 0.18, drift: false, dropDuration: 0.88 - (roundIndex - 3) * 0.04 };
  }
  // Ronda 5-7: 3 barriles + drift incipiente (1 de los 3 drifta)
  if (roundIndex <= 7) {
    return { barrelCount: 3, stagger: 0.16, drift: true, driftCount: 1, dropDuration: 0.82 - (roundIndex - 5) * 0.04 };
  }
  // Ronda 8-11: 3 barriles + 2 driftan, velocidad alta
  if (roundIndex <= 11) {
    return { barrelCount: 3, stagger: 0.13, drift: true, driftCount: 2, dropDuration: 0.72 - (roundIndex - 8) * 0.03 };
  }
  // Ronda 12-15: 3 barriles todos driftan, caos total
  if (roundIndex <= 15) {
    return { barrelCount: 3, stagger: 0.10, drift: true, driftCount: 3, dropDuration: 0.62 - (roundIndex - 12) * 0.03 };
  }
  // Ronda 16-19: velocidad brutal, 3 driftan agresivamente
  return { barrelCount: 3, stagger: 0.08, drift: true, driftCount: 3, dropDuration: 0.52 - (roundIndex - 16) * 0.025 };
}

const PHASE_MESSAGES = [
  "Fase 1 — Un barril. El único momento de tranquilidad que verás.",
  "Fase 1 — Dos barriles desfasados. Empieza a preocuparte.",
  "Fase 2 — ¡Tres seguidos! Aquí empieza el caos real.",
  "Fase 2 — Tres barriles rápidos. Muévete sin pensar.",
  "Fase 2 — Velocidad creciente. Reflejo puro.",
  "Fase 3 — Un barril ya cambia de carril mientras cae.",
  "Fase 3 — Finge que hay un plan. No lo hay.",
  "Fase 3 — Los toneles deciden su destino en el aire.",
  "Fase 4 — Dos de tres driftan. El almacén es un caos.",
  "Fase 4 — Lee el movimiento antes de que acabe.",
  "Fase 4 — Velocidad alta, todos engañando.",
  "Fase 4 — El carril seguro existe, pero se mueve.",
  "Fase 5 — Los tres barriles cambian de carril. Suerte.",
  "Fase 5 — No hay carril fijo. Solo reflejos.",
  "Fase 5 — El almacén ha perdido el control.",
  "Fase 5 — Cada barril miente sobre su destino.",
  "Fase 6 — Velocidad insana. El tribunal ha cerrado los ojos.",
  "Fase 6 — Ningún humano debería estar aquí.",
  "Fase 6 — El escribiente ha abandonado el formulario.",
  "Fase 6 — ¡ÚLTIMA OLEADA! Si sobrevives, el gremio te debe una explicación.",
];

export class AgilityScreen {
  constructor({ onComplete, onExit }) {
    this.onComplete = onComplete;
    this.onExit = onExit;

    this.root = document.querySelector("#agility-screen");
    this.chapter = document.querySelector("#agility-chapter");
    this.title = document.querySelector("#agility-title");
    this.message = document.querySelector("#agility-message");
    this.instructions = document.querySelector("#agility-instructions");
    this.arena = document.querySelector("#agility-arena");
    this.player = document.querySelector("#agility-player");
    this.footer = document.querySelector("#agility-footer");
    this.levelEl = document.querySelector("#agility-level");
    this.scoreEl = document.querySelector("#agility-score");
    this.backBtn = document.querySelector("#agility-back");

    this.laneEls = [
      document.querySelector("#agility-lane-0"),
      document.querySelector("#agility-lane-1"),
      document.querySelector("#agility-lane-2"),
    ];

    this.status = "intro";
    this.round = 0;
    this.scoreValue = 0;
    this.playerLane = 1;
    this.countdown = 3;
    this.lastCountdownNumber = 3;
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.resultTime = 0;
    this.currentDifficulty = null; // cached difficulty for current round

    this.activeBarrels = [];
    this.roundStartTime = 0;
    this.animFrame = null;
    this.lastTimestamp = null;

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
    this.playerLane = 1;
    this.countdown = 3;
    this.lastCountdownNumber = 3;
    this.transitionTimer = 0;
    this.transitionPhrase = "";
    this.resultTime = 0;
    this.currentDifficulty = null;
    this.lastTimestamp = null;
    this.clearBarrelEls();
    this.activeBarrels = [];
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
    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      event.preventDefault();
      this.handleActionInput(Math.max(0, this.playerLane - 1));
      return;
    }
    if (event.code === "ArrowRight" || event.code === "KeyD") {
      event.preventDefault();
      this.handleActionInput(Math.min(2, this.playerLane + 1));
      return;
    }
  }

  handlePointerDown(event) {
    if (this.backBtn && (event.target === this.backBtn || this.backBtn.contains(event.target))) return;
    if (this.status === "playing" && this.arena) {
      const rect = this.arena.getBoundingClientRect();
      const relX = event.clientX - rect.left;
      const laneWidth = rect.width / 3;
      let lane = Math.floor(relX / laneWidth);
      lane = Math.max(0, Math.min(2, lane));
      this.handleActionInput(lane);
      return;
    }
    this.handleActionInput(null);
  }

  handleActionInput(targetLane) {
    if (this.status === "intro") {
      this.status = "countdown";
      this.countdown = 3;
      this.lastCountdownNumber = 3;
      this.startCountdownLoop();
      return;
    }
    if (this.status === "countdown" || this.status === "level_transition") return;
    if (this.status === "result") {
      if (performance.now() - (this.resultTime || 0) < 600) return;
      if (this.onComplete) this.onComplete(this.scoreValue);
      return;
    }
    if (this.status === "playing" && targetLane !== null) {
      this.playerLane = targetLane;
      this.renderPlayer();
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

  // Build the barrel definitions for this round (random lane assignment)
  buildBarrelDefs(diff) {
    const { barrelCount, stagger, drift, driftCount = 0 } = diff;
    const barrelDefs = [];

    // Shuffle lanes and assign
    const shuffled = [0, 1, 2].sort(() => Math.random() - 0.5);

    for (let i = 0; i < barrelCount; i++) {
      const laneStart = shuffled[i % 3];
      let laneEnd = null;

      if (drift && i < driftCount) {
        // Drift: pick a different end lane
        const candidates = [0, 1, 2].filter((l) => l !== laneStart);
        laneEnd = candidates[Math.floor(Math.random() * candidates.length)];
      }

      barrelDefs.push({
        laneStart,
        laneEnd,
        startDelay: i * stagger,
      });
    }

    return barrelDefs;
  }

  startRound() {
    this.status = "playing";
    this.clearBarrelEls();
    this.activeBarrels = [];

    const diff = getDifficulty(this.round);
    this.currentDifficulty = diff;
    const barrelDefs = this.buildBarrelDefs(diff);
    this.roundStartTime = performance.now();

    for (const def of barrelDefs) {
      const el = document.createElement("div");
      el.className = "agility-obstacle";
      // Mark drifting barrels visually
      if (def.laneEnd !== null) el.classList.add("drifting");
      const inner = document.createElement("div");
      inner.className = "agility-obstacle-inner";
      el.appendChild(inner);
      el.style.top = "-12%";
      el.style.left = `${LANE_CENTERS[def.laneStart]}%`;
      el.style.transform = "translateX(-50%)";
      el.hidden = true;
      if (this.arena) this.arena.appendChild(el);

      this.activeBarrels.push({
        laneStart: def.laneStart,
        laneEnd: def.laneEnd,
        startDelay: def.startDelay,
        progress: 0,
        active: false,
        done: false,
        hit: false,
        el,
        currentLeft: LANE_CENTERS[def.laneStart],
      });
    }

    this.lastTimestamp = performance.now();
    this.render();
    this.startPlayLoop();
  }

  startPlayLoop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const step = (timestamp) => {
      if (this.status !== "playing") return;
      const elapsed = (timestamp - this.roundStartTime) / 1000;
      const delta = Math.min((timestamp - (this.lastTimestamp || timestamp)) / 1000, 0.05);
      this.lastTimestamp = timestamp;

      const diff = this.currentDifficulty;
      const speed = 1.0 / diff.dropDuration;

      let allDone = true;
      let roundFailed = false;

      for (const barrel of this.activeBarrels) {
        if (barrel.done) continue;

        if (!barrel.active) {
          if (elapsed >= barrel.startDelay) {
            barrel.active = true;
            barrel.el.hidden = false;
          } else {
            allDone = false;
            continue;
          }
        }

        barrel.progress += speed * delta;

        // Interpolate left position
        if (barrel.laneEnd !== null) {
          // Ease-in drift: starts slow, accelerates
          const t = Math.pow(Math.min(1, barrel.progress), 0.7);
          barrel.currentLeft = LANE_CENTERS[barrel.laneStart] +
            t * (LANE_CENTERS[barrel.laneEnd] - LANE_CENTERS[barrel.laneStart]);
        } else {
          barrel.currentLeft = LANE_CENTERS[barrel.laneStart];
        }

        barrel.el.style.top = `${Math.min(barrel.progress * 100, 106)}%`;
        barrel.el.style.left = `${barrel.currentLeft}%`;

        // Collision zone (progress 0.76 → 0.93)
        if (!barrel.hit && barrel.progress >= 0.76 && barrel.progress <= 0.93) {
          const barrelLane = barrel.currentLeft < 33.33 ? 0 : barrel.currentLeft < 66.66 ? 1 : 2;
          if (barrelLane === this.playerLane) {
            barrel.hit = true;
            roundFailed = true;
          }
        }

        if (barrel.progress >= 1.06) {
          barrel.done = true;
          barrel.el.hidden = true;
        } else {
          allDone = false;
        }
      }

      if (roundFailed) {
        this.status = "result";
        this.resultTime = performance.now();
        this.shakePlayer();
        this.render();
        return;
      }

      if (allDone) {
        this.round += 1;
        this.scoreValue = Math.min(TOTAL_ROUNDS, this.round);
        this.clearBarrelEls();
        this.activeBarrels = [];

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

  clearBarrelEls() {
    if (!this.arena) return;
    this.arena.querySelectorAll(".agility-obstacle").forEach((o) => o.remove());
  }

  shakePlayer() {
    if (!this.player) return;
    this.player.classList.remove("shake");
    void this.player.offsetWidth;
    this.player.classList.add("shake");
  }

  renderPlayer() {
    if (!this.player) return;
    this.player.dataset.lane = this.playerLane;
  }

  render() {
    const level = Math.min(TOTAL_ROUNDS, this.round + 1);
    this.root.dataset.status = this.status;

    if (this.chapter) this.chapter.textContent = "Prueba de agilidad";

    if (this.title) {
      this.title.textContent = this.status === "result"
        ? `RESULTADO: AGILIDAD ${this.scoreValue} / 20`
        : `AGILIDAD DEL GREMIO — NIVEL ${level} DE ${TOTAL_ROUNDS}`;
    }

    if (this.status === "intro") {
      this.message.textContent = "Los aprendices borrachos sueltan barriles. El primer nivel parece fácil. No lo es.";
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para empezar.";
    } else if (this.status === "countdown") {
      this.message.textContent = "Los examinadores sueltan la traba de la bodega...";
      const n = Math.ceil(this.countdown);
      this.instructions.textContent = String(n);
      if (n !== this.lastCountdownNumber) {
        this.lastCountdownNumber = n;
        this.instructions.classList.remove("pulse");
        void this.instructions.offsetWidth;
        this.instructions.classList.add("pulse");
      }
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
      this.message.textContent = getAgilityVerdict(this.scoreValue);
      this.instructions.textContent = "Pulsa ESPACIO, CLIC o TOCA para registrar tu nota en el expediente.";
    } else if (this.status === "playing") {
      this.message.textContent = PHASE_MESSAGES[Math.min(this.round, PHASE_MESSAGES.length - 1)];
      this.instructions.textContent = "TOCA EL CARRIL LIBRE O USA FLECHAS IZQ/DER";
    }

    if (this.levelEl) this.levelEl.textContent = `Nivel ${level}`;
    if (this.scoreEl) this.scoreEl.textContent = `${this.scoreValue} / 20`;

    const isPrestart = this.status === "intro" || this.status === "countdown";
    const isOverlay = isPrestart || this.status === "level_transition" || this.status === "result";

    if (this.backBtn) this.backBtn.hidden = this.status !== "result";
    if (this.footer) this.footer.hidden = isOverlay;
    if (this.arena) this.arena.hidden = isOverlay;

    this.renderPlayer();
  }
}
