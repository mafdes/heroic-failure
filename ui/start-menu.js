const FIRST_NAMES = [
  "Paco", "Bobby", "Manolo", "Kevin", "Eustaquio", "Rigoberto", "Hermenegildo", "Berto",
  "Gervasio", "Agapito", "Sinforoso", "Casimiro", "Fulgencio", "Celedonio", "Calixto",
  "Venancio", "Teófilo", "Aurelio", "Tiburcio", "Guzmán", "Jacinto", "Wenceslao", "Barnabé",
  "Tarsicio", "Nicanor", "Raimundo", "Primitivo", "Toribio", "Gumersindo", "Saturnino"
];

const EPITHETS = [
  "el Débil", "el Pezuñas", "el Blandengue", "el Tropiezos", "el Alérgico", "el Calambres",
  "el Cobardica", "el Miedos", "el Torpe", "el Escurremanos", "el Miope", "el Fofo",
  "el Resbalones", "el Flatulento", "el Esguinces", "el Asustadizo", "el Blando", "el Despistao",
  "el Sin-Dientes", "el Asmático", "el Ojeras", "el Blandito", "el Sin-Sueldo", "el Calvo",
  "el Ratero", "el Caspa", "el Pupas", "el Patoso", "el Mofofeo"
];

function generateTerribleName() {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const epithet = EPITHETS[Math.floor(Math.random() * EPITHETS.length)];
  return `${firstName} ${epithet}`;
}

export class StartMenu {
  constructor({ onNameSubmitted, onChallengeChosen }) {
    this.frame = document.querySelector(".game-frame");
    this.root = document.querySelector("#start-menu");
    this.home = document.querySelector("#menu-home");
    this.nameForm = document.querySelector("#name-form");
    this.nameInput = document.querySelector("#player-name");
    this.diceBtn = document.querySelector("#random-name-btn");
    this.picker = document.querySelector("#challenge-picker");
    
    this.frame.classList.add("in-menu");

    document.querySelector("#new-game").addEventListener("click", () => this.showName());
    
    if (this.diceBtn) {
      let isRolling = false;
      const rollName = (event) => {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        if (isRolling) return;
        isRolling = true;
        setTimeout(() => { isRolling = false; }, 220);

        const newName = generateTerribleName();
        this.nameInput.value = newName;
        this.nameInput.focus();

        // Animación de giro del dado
        this.diceBtn.classList.remove("spinning");
        void this.diceBtn.offsetWidth; // Force reflow
        this.diceBtn.classList.add("spinning");
      };

      window.rollRandomName = rollName;
      this.diceBtn.addEventListener("click", rollName);
    }

    this.nameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      onNameSubmitted(this.nameInput.value.trim() || generateTerribleName());
    });

    document.querySelectorAll(".challenge-card").forEach((card) => card.addEventListener("click", () => onChallengeChosen(card.id.replace("-choice", ""))));
  }

  showName() {
    this.home.hidden = true;
    this.nameForm.hidden = false;
    // Autocompletar con un nombre pésimo por defecto
    if (!this.nameInput.value) {
      this.nameInput.value = generateTerribleName();
    }
    this.nameInput.focus();
    this.nameInput.select();
  }

  showSelection(name, attributes) {
    this.nameForm.hidden = true;
    this.picker.hidden = false;
    document.querySelector("#welcome-name").textContent = `${name}, el Estado necesita clasificarte.`;
    document.querySelectorAll(".challenge-card").forEach((card) => {
      const id = card.id.replace("-choice", "");
      const score = attributes[id];
      const action = card.querySelector(".card-action");
      card.disabled = score !== null;
      if (score !== null) {
        card.classList.add("completed");
        action.textContent = `Resultado: ${score} / 20 ✓`;
      } else {
        card.classList.remove("completed");
        action.textContent = "Presentarse al examen →";
      }
    });
  }

  hide() {
    this.root.hidden = true;
    this.frame.classList.remove("in-menu");
  }

  show(name, attributes) {
    this.root.hidden = false;
    this.frame.classList.add("in-menu");
    this.showSelection(name, attributes);
  }
}


