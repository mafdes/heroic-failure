// ─── PANTALLA DE SELECCIÓN DE CLASES POR ESCALONES ─────────────────────────
import { CLASS_TIERS } from "../data/classes.js";

export class ClassSelectionScreen {
  constructor({ onClassSelected, onExit }) {
    this.onClassSelected = onClassSelected;
    this.onExit = onExit;

    this.root = document.querySelector("#class-selection-screen");
    this.chapter = document.querySelector("#class-chapter");
    this.title = document.querySelector("#class-title");
    this.subtitle = document.querySelector("#class-subtitle");
    this.grid = document.querySelector("#class-grid");
    this.giveUpBtn = document.querySelector("#class-giveup-btn");
    this.modal = document.querySelector("#class-modal");
    this.modalTitle = document.querySelector("#class-modal-title");
    this.modalIcon = document.querySelector("#class-modal-icon");
    this.modalText = document.querySelector("#class-modal-text");
    this.modalOkBtn = document.querySelector("#class-modal-ok");

    this.currentTierIndex = 0;
    this.attributes = null;
    this.playerName = "";
    this.rejectedClassIds = new Set();
    this.pendingModalAction = null;

    if (this.giveUpBtn) {
      this.giveUpBtn.addEventListener("click", () => this.nextTier());
    }
    if (this.modalOkBtn) {
      this.modalOkBtn.addEventListener("click", () => this.closeModal());
    }
  }

  show(playerName, attributes) {
    this.root.hidden = false;
    this.playerName = playerName || "Aspirante";
    this.attributes = attributes || {};
    this.currentTierIndex = 0;
    this.rejectedClassIds.clear();
    this.render();
  }

  hide() {
    this.root.hidden = true;
    this.closeModal();
  }

  nextTier() {
    if (this.currentTierIndex < CLASS_TIERS.length - 1) {
      this.currentTierIndex += 1;
      this.render();
    }
  }

  evaluateClass(cls) {
    // Tier 4 classes (or no requirements) -> Acceptance Confirmation Toast!
    if (!cls.requirements || Object.keys(cls.requirements).length === 0) {
      this.showModal({
        title: "¡CLASE OTORGADA OFICIALMENTE!",
        iconSvg: cls.svg,
        text: `El Gremio te asigna la clase:\n\n✨ ${cls.name.toUpperCase()} ✨\n\n"${cls.description}"`,
        buttonText: "Aceptar Título y Confirmar Expediente",
        onOk: () => {
          this.hide();
          if (this.onClassSelected) this.onClassSelected(cls);
        }
      });
      return;
    }

    // Check requirements against applicant attributes
    const failures = [];
    for (const [attr, minVal] of Object.entries(cls.requirements)) {
      const userVal = this.attributes[attr] ?? 0;
      if (userVal < minVal) {
        failures.push({ attr, minVal, userVal });
      }
    }

    if (failures.length === 0) {
      // Met requirements (rare)
      this.showModal({
        title: "¡SORPRESA DEL TRIBUNAL!",
        iconSvg: cls.svg,
        text: `¡Milagro administrativo! Cumples los requisitos para ser:\n\n⚔️ ${cls.name.toUpperCase()} ⚔️\n\n"${cls.description}"`,
        buttonText: "Aceptar y Confirmar Expediente",
        onOk: () => {
          this.hide();
          if (this.onClassSelected) this.onClassSelected(cls);
        }
      });
    } else {
      // Failed requirements -> REJECTED!
      this.rejectedClassIds.add(cls.id);
      this.render();
      this.showModal({
        title: "Dictamen de Rechazo del Tribunal",
        iconSvg: cls.svg,
        text: cls.rejection,
        buttonText: "Entendido",
        onOk: null
      });
    }
  }

  showModal({ title, iconSvg, text, buttonText = "Entendido", onOk = null }) {
    if (!this.modal || !this.modalText) return;

    if (this.modalTitle) this.modalTitle.textContent = title || "Dictamen del Tribunal";
    if (this.modalIcon) this.modalIcon.innerHTML = iconSvg || "";
    if (this.modalOkBtn) this.modalOkBtn.textContent = buttonText;
    this.modalText.textContent = text;

    this.modal.hidden = false;
    this.pendingModalAction = onOk;
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.hidden = true;
    if (this.pendingModalAction) {
      const action = this.pendingModalAction;
      this.pendingModalAction = null;
      action();
    }
  }

  render() {
    const tierData = CLASS_TIERS[this.currentTierIndex];
    if (!tierData) return;

    if (this.chapter) this.chapter.textContent = `Elección de Clase — ${this.playerName}`;
    if (this.title) this.title.textContent = tierData.title;
    if (this.subtitle) this.subtitle.textContent = tierData.subtitle;

    if (this.giveUpBtn) {
      if (tierData.giveUpText) {
        this.giveUpBtn.hidden = false;
        this.giveUpBtn.textContent = tierData.giveUpText;
      } else {
        this.giveUpBtn.hidden = true;
      }
    }

    if (!this.grid) return;
    this.grid.innerHTML = "";

    tierData.classes.forEach((cls) => {
      const isRejected = this.rejectedClassIds.has(cls.id);
      const imgPath = cls.image || "assets/images/classes/dummy.png";

      const card = document.createElement("div");
      card.className = `class-card ${isRejected ? "rejected" : ""}`;
      card.dataset.classId = cls.id;

      card.innerHTML = `
        <div class="class-card-header">
          <div class="class-icon">${cls.svg}</div>
          <h3 class="class-name">${cls.name}</h3>
        </div>
        <div class="class-art-frame">
          <img src="${imgPath}" class="class-art-img" alt="${cls.name}" />
        </div>
        <p class="class-req">${cls.reqText}</p>
        <p class="class-desc">${cls.description}</p>
        ${isRejected ? `<div class="stamp-rejected">RECHAZADO</div>` : `<button type="button" class="ornate-button class-apply-btn">Solicitar Clase</button>`}
      `;

      if (!isRejected) {
        const btn = card.querySelector(".class-apply-btn");
        if (btn) {
          btn.addEventListener("click", () => this.evaluateClass(cls));
        }
      }

      this.grid.appendChild(card);
    });
  }
}
