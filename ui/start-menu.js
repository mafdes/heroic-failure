export class StartMenu {
  constructor({ onNameSubmitted, onChallengeChosen }) {
    this.root = document.querySelector("#start-menu");
    this.home = document.querySelector("#menu-home");
    this.nameForm = document.querySelector("#name-form");
    this.nameInput = document.querySelector("#player-name");
    this.picker = document.querySelector("#challenge-picker");
    document.querySelector("#new-game").addEventListener("click", () => this.showName());
    this.nameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      onNameSubmitted(this.nameInput.value.trim() || "Sin Nombre");
    });
    document.querySelectorAll(".challenge-card").forEach((card) => card.addEventListener("click", () => onChallengeChosen(card.id.replace("-choice", ""))));
  }
  showName() { this.home.hidden = true; this.nameForm.hidden = false; this.nameInput.focus(); }
  showSelection(name, attributes) {
    this.nameForm.hidden = true; this.picker.hidden = false; document.querySelector("#welcome-name").textContent = `${name}, el Estado necesita clasificarte.`;
    document.querySelectorAll(".challenge-card").forEach((card) => {
      const id = card.id.replace("-choice", ""); const score = attributes[id]; const action = card.querySelector(".card-action");
      card.disabled = score !== null; action.textContent = score === null ? "Presentarse al examen →" : `Resultado registrado: ${score} / 20`;
    });
  }
  hide() { this.root.hidden = true; }
  show(name, attributes) { this.root.hidden = false; this.showSelection(name, attributes); }
}
