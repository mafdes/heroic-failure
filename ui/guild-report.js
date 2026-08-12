export class GuildReportScreen {
  constructor({ onChallengeChosen, onChallengeSelected, onClassRequested, onAdventureRequested, onTestFillRequested }) {
    this.onChallengeChosen = onChallengeChosen || onChallengeSelected;
    this.onClassRequested = onClassRequested;
    this.onAdventureRequested = onAdventureRequested;
    this.onTestFillRequested = onTestFillRequested;

    this.root = document.querySelector("#guild-report-screen");
    this.container = document.querySelector(".parchment-container");
    this.nameEl = document.querySelector("#report-player-name");
    this.verdictEl = document.querySelector("#report-verdict-text");
    this.classBtn = document.querySelector("#report-class-btn");
    this.lockedEl = document.querySelector("#report-class-locked");
    this.testFillBtn = document.querySelector("#report-test-fill");

    this.sealedBadge = document.querySelector("#report-sealed-badge");
    this.sealedIcon = document.querySelector("#report-sealed-icon");
    this.sealedTitle = document.querySelector("#report-sealed-title");

    this.characterClass = null;

    this.scoreEls = {
      dexterity: document.querySelector("#report-score-dexterity"),
      strength: document.querySelector("#report-score-strength"),
      constitution: document.querySelector("#report-score-constitution"),
      intelligence: document.querySelector("#report-score-intelligence"),
      agility: document.querySelector("#report-score-agility"),
    };

    this.buttons = Array.from(document.querySelectorAll(".parchment-btn"));

    this.buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const challengeId = btn.dataset.challenge;
        if (this.onChallengeChosen) this.onChallengeChosen(challengeId);
      });
    });

    if (this.classBtn) {
      this.classBtn.addEventListener("click", () => {
        if (this.characterClass) {
          if (this.onAdventureRequested) this.onAdventureRequested();
        } else {
          if (this.onClassRequested) this.onClassRequested();
        }
      });
    }

    if (this.testFillBtn) {
      this.testFillBtn.addEventListener("click", () => {
        this.testFillBtn.style.display = "none";
        if (this.onTestFillRequested) this.onTestFillRequested();
      });
    }
  }

  show(playerName, attributes, characterClass = null) {
    this.root.hidden = false;
    this.update(playerName, attributes, characterClass);
  }

  hide() {
    this.root.hidden = true;
  }

  update(playerName, attributes, characterClass = null) {
    this.characterClass = characterClass;
    const isSealed = Boolean(characterClass);

    if (this.container) {
      this.container.classList.toggle("sealed-mode", isSealed);
    }

    if (this.nameEl) {
      this.nameEl.textContent = `Aspirante: ${playerName || "Sin Registro"}`;
    }

    if (this.sealedBadge) {
      this.sealedBadge.hidden = !isSealed;
      if (isSealed && characterClass) {
        if (this.sealedIcon) this.sealedIcon.innerHTML = characterClass.svg || "";
        if (this.sealedTitle) this.sealedTitle.textContent = characterClass.name;
      }
    }

    let completedCount = 0;
    let totalScore = 0;

    Object.keys(this.scoreEls).forEach((attrId) => {
      const score = attributes ? attributes[attrId] : null;
      const scoreEl = this.scoreEls[attrId];
      const btn = this.buttons.find((b) => b.dataset.challenge === attrId);

      if (score !== null && score !== undefined) {
        completedCount += 1;
        totalScore += score;
        if (scoreEl) {
          if (isSealed) {
            scoreEl.innerHTML = `<span class="sealed-num">${score}</span><span class="sealed-max"> / 20</span>`;
          } else {
            scoreEl.textContent = `${score} / 20`;
          }
          scoreEl.classList.add("completed");
        }
        if (btn) {
          btn.style.display = isSealed ? "none" : "";
          btn.textContent = "COMPLETADO";
          btn.disabled = true;
          btn.classList.add("completed");
        }
      } else {
        if (scoreEl) {
          scoreEl.textContent = "PENDIENTE";
          scoreEl.classList.remove("completed");
        }
        if (btn) {
          btn.style.display = isSealed ? "none" : "";
          btn.textContent = "Examinar";
          btn.disabled = false;
          btn.classList.remove("completed");
        }
      }
    });

    if (this.verdictEl) {
      if (isSealed && characterClass) {
        this.verdictEl.textContent = `Dictamen Oficial: Expediente sellado y archivado. Se concede el título de '${characterClass.name}'. Tu registro de atributos ha quedado fijado para la aventura 2D.`;
      } else if (completedCount === 0) {
        this.verdictEl.textContent = "Presente a su primera evaluación para que el gremio juzgue su ineptitud.";
      } else if (completedCount < 5) {
        this.verdictEl.textContent = `Ha completado ${completedCount} de 5 pruebas. El tribunal espera el resto de su vergonzosa ficha.`;
      } else {
        const avg = totalScore / 5;
        if (avg <= 4) {
          this.verdictEl.textContent = "Dictamen oficial: Aspirante desastroso. Califica únicamente para Clases Absurdas y Títulos de Decepción.";
        } else if (avg <= 10) {
          this.verdictEl.textContent = "Dictamen oficial: Mediocridad aceptable. El gremio le concede permiso para acercarse a una mazmorra fácil.";
        } else {
          this.verdictEl.textContent = "Dictamen oficial: Heroísmo sospechoso. El tribunal investigará si ha hecho trampas en las pruebas.";
        }
      }
    }

    const allCompleted = completedCount === 5;
    if (this.classBtn) {
      this.classBtn.hidden = !allCompleted;
      this.classBtn.disabled = !allCompleted;

      if (isSealed) {
        this.classBtn.textContent = "⚔️ ¡EMPEZAR AVENTURA EN LA MAZMORRA 2D! →";
        this.classBtn.classList.add("start-adventure-btn");
      } else {
        this.classBtn.textContent = "Presentar solicitud de clase →";
        this.classBtn.classList.remove("start-adventure-btn");
      }
    }
    if (this.lockedEl) {
      this.lockedEl.hidden = allCompleted;
    }
    if (this.testFillBtn && isSealed) {
      this.testFillBtn.style.display = "none";
    }
  }
}
