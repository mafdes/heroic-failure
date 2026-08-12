// ─── PANTALLA DE PROXIMAMENTE (FASE V0.3 AVENTURA 2D) ──────────────────────

export class ComingSoonScreen {
  constructor({ onReturnToMenu }) {
    this.onReturnToMenu = onReturnToMenu;

    this.root = document.querySelector("#coming-soon-screen");
    this.candidateNameEl = document.querySelector("#coming-soon-name");
    this.classNameEl = document.querySelector("#coming-soon-class");
    this.classDescEl = document.querySelector("#coming-soon-desc");
    this.classIconEl = document.querySelector("#coming-soon-icon");
    this.menuBtn = document.querySelector("#coming-soon-menu-btn");

    if (this.menuBtn) {
      this.menuBtn.addEventListener("click", () => {
        this.hide();
        if (this.onReturnToMenu) this.onReturnToMenu();
      });
    }
  }

  show(playerName, characterClass) {
    this.root.hidden = false;

    if (this.candidateNameEl) {
      this.candidateNameEl.textContent = playerName || "Aspirante";
    }

    if (characterClass) {
      if (this.classNameEl) this.classNameEl.textContent = characterClass.name;
      if (this.classDescEl) this.classDescEl.textContent = `"${characterClass.description}"`;
      if (this.classIconEl) this.classIconEl.innerHTML = characterClass.svg || "";
    } else {
      if (this.classNameEl) this.classNameEl.textContent = "Héroe sin Clase";
      if (this.classDescEl) this.classDescEl.textContent = "El tribunal ha sellado tu expediente.";
      if (this.classIconEl) this.classIconEl.innerHTML = "";
    }
  }

  hide() {
    this.root.hidden = true;
  }
}
