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
    document.querySelector("#dexterity-choice").addEventListener("click", onChallengeChosen);
  }
  showName() { this.home.hidden = true; this.nameForm.hidden = false; this.nameInput.focus(); }
  showSelection(name) { this.nameForm.hidden = true; this.picker.hidden = false; document.querySelector("#welcome-name").textContent = `${name}, el Estado necesita clasificarte.`; }
  hide() { this.root.hidden = true; }
  show() { this.root.hidden = false; this.picker.hidden = false; }
}
