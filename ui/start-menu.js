import { getTexts } from "../game/i18n.js";

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
  constructor({ language, onLanguageChange, onNameSubmitted, onChallengeChosen }) {
    this.language = language;
    this.onLanguageChange = onLanguageChange;
    this.frame = document.querySelector(".game-frame");
    this.root = document.querySelector("#start-menu");
    this.home = document.querySelector("#menu-home");
    this.settings = document.querySelector("#settings-menu");
    this.settingsBtn = document.querySelector("#settings-btn");
    this.settingsBackBtn = document.querySelector("#settings-back-btn");
    this.settingsSaveBtn = document.querySelector("#settings-save-btn");
    this.languagePills = Array.from(document.querySelectorAll(".language-pill"));
    this.nameForm = document.querySelector("#name-form");
    this.nameInput = document.querySelector("#player-name");
    this.diceBtn = document.querySelector("#random-name-btn");
    this.picker = document.querySelector("#challenge-picker");
    this.lastSelectedName = "";
    this.lastAttributes = null;

    this.frame.classList.add("in-menu");

    this.applyLanguage();
    this.syncLanguagePills();

    document.querySelector("#new-game").addEventListener("click", () => this.showName());
    this.settingsBtn.addEventListener("click", () => this.showSettings());
    this.settingsBackBtn.addEventListener("click", () => this.showHome());
    this.settingsSaveBtn.addEventListener("click", () => this.showHome());
    this.languagePills.forEach((pill) => pill.addEventListener("click", () => this.setLanguage(pill.dataset.language)));

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

  applyLanguage() {
    const texts = getTexts(this.language);
    document.querySelector("html").lang = texts.pageLang;
    document.querySelector(".eyebrow").textContent = texts.eyebrow;
    document.querySelector("#menu-home .chapter").textContent = texts.homeChapter;
    document.querySelector("#menu-home h2").textContent = texts.homeTitle;
    document.querySelector("#new-game").textContent = texts.newGame;
    document.querySelector("#settings-btn").textContent = texts.settings;
    document.querySelector("#settings-menu .chapter").textContent = texts.settingsChapter;
    document.querySelector("#settings-menu h2").textContent = texts.settingsTitle;
    document.querySelector(".settings-label").textContent = texts.languageLabel;
    document.querySelector("#settings-back-btn").textContent = texts.back;
    document.querySelector("#settings-save-btn").textContent = texts.save;
    document.querySelector("#name-form .chapter").textContent = texts.nameChapter;
    document.querySelector("label[for='player-name']").textContent = texts.nameLabel;
    document.querySelector("#player-name").placeholder = texts.namePlaceholder;
    document.querySelector("#name-form .ornate-button[type='submit']").textContent = texts.submitName;
    document.querySelector("#challenge-picker .chapter").textContent = texts.pickerChapter;
    document.querySelector("#dexterity-choice .card-title").textContent = texts.attributeNames.dexterity;
    document.querySelector("#strength-choice .card-title").textContent = texts.attributeNames.strength;
    document.querySelector("#intelligence-choice .card-title").textContent = texts.attributeNames.intelligence;
    document.querySelector("#constitution-choice .card-title").textContent = texts.attributeNames.constitution;
    document.querySelector("#agility-choice .card-title").textContent = texts.attributeNames.agility;
    document.querySelector("#dexterity-choice .card-copy").textContent = texts.dexterityCopy;
    document.querySelector("#strength-choice .card-copy").textContent = texts.strengthCopy;
    document.querySelector("#intelligence-choice .card-copy").textContent = texts.intelligenceCopy;
    document.querySelector("#constitution-choice .card-copy").textContent = texts.constitutionCopy;
    document.querySelector("#agility-choice .card-copy").textContent = texts.agilityCopy;
    document.querySelector(".availability").textContent = texts.availability;
    document.querySelector("#controls-hint").textContent = texts.controlsMenu;
    if (this.lastAttributes && this.lastSelectedName) {
      this.showSelection(this.lastSelectedName, this.lastAttributes);
    } else {
      document.querySelectorAll(".card-action").forEach((el) => { el.textContent = texts.enterTrial; });
    }
  }

  syncLanguagePills() {
    this.languagePills.forEach((pill) => {
      pill.classList.toggle("active", pill.dataset.language === this.language);
      pill.setAttribute("aria-pressed", pill.dataset.language === this.language ? "true" : "false");
    });
  }

  setLanguage(language) {
    this.language = language;
    this.syncLanguagePills();
    this.applyLanguage();
    if (this.onLanguageChange) this.onLanguageChange(language);
  }

  showHome() {
    this.home.hidden = false;
    this.settings.hidden = true;
    this.nameForm.hidden = true;
    this.picker.hidden = true;
  }

  showSettings() {
    this.home.hidden = true;
    this.settings.hidden = false;
    this.nameForm.hidden = true;
    this.picker.hidden = true;
    this.syncLanguagePills();
  }

  showName() {
    this.home.hidden = true;
    this.settings.hidden = true;
    this.nameForm.hidden = false;
    // Autocompletar con un nombre pésimo por defecto
    if (!this.nameInput.value) {
      this.nameInput.value = generateTerribleName();
    }
    this.nameInput.focus();
    this.nameInput.select();
  }

  showSelection(name, attributes) {
    this.lastSelectedName = name;
    this.lastAttributes = attributes;
    this.nameForm.hidden = true;
    this.settings.hidden = true;
    this.picker.hidden = false;
    const texts = getTexts(this.language);
    document.querySelector("#welcome-name").textContent = texts.welcome(name);
    document.querySelectorAll(".challenge-card").forEach((card) => {
      const id = card.id.replace("-choice", "");
      const score = attributes[id];
      const action = card.querySelector(".card-action");
      card.disabled = score !== null;
      if (score !== null) {
        card.classList.add("completed");
        action.textContent = texts.resultLabel(score);
      } else {
        card.classList.remove("completed");
        action.textContent = texts.enterTrial;
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
