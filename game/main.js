import { CharacterSheet } from "../character/character-sheet.js";
import { DexterityChallenge } from "../challenges/dexterity-challenge.js";
import { GameLoop } from "../engine/game-loop.js";
import { Input } from "../engine/input.js";
import { StartMenu } from "../ui/start-menu.js";
import { StrengthChallenge } from "../challenges/strength-challenge.js";
import { IntelligenceChallenge } from "../challenges/intelligence-challenge.js";
import { ConstitutionChallenge } from "../challenges/constitution-challenge.js";
import { AgilityChallenge } from "../challenges/agility-challenge.js";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const input = new Input(canvas);
const sheet = new CharacterSheet();
const dexterity = new DexterityChallenge();
const strength = new StrengthChallenge();
const intelligence = new IntelligenceChallenge();
const constitution = new ConstitutionChallenge();
const agility = new AgilityChallenge();
const challenges = { dexterity, strength, intelligence, constitution, agility };
let screen = "menu";
let playerName = "";
let activeChallenge = null;
const controlsHint = document.querySelector("#controls-hint");
const CHALLENGE_HINTS = {
  dexterity: "Destreza: Pulsa ESPACIO, ENTER o TOCA la pantalla para detener el indicador.",
  strength: "Fuerza: MANTÉN ESPACIO/CLIC o TOCA la pantalla para cargar y suelta en la zona.",
  intelligence: "Inteligencia: TOCA la tarjeta correcta o usa las teclas 1, 2, 3.",
  constitution: "Constitución: Usa las flechas ← → o TOCA los lados del área de juego.",
  agility: "Agilidad: Usa las flechas ← → o TOCA un carril para esquivar los obstáculos."
};

function updateControlsHint() {
  if (screen === "menu") {
    controlsHint.textContent = "Selecciona un examen de aptitud para clasificar a tu personaje.";
  } else if (activeChallenge) {
    controlsHint.textContent = CHALLENGE_HINTS[activeChallenge.attributeId] || "";
  }
}

const startMenu = new StartMenu({
  onNameSubmitted: (name) => { playerName = name; startMenu.showSelection(name, sheet.attributes); updateControlsHint(); },
  onChallengeChosen: (id) => {
    activeChallenge = challenges[id];
    activeChallenge.reset();
    startMenu.hide();
    screen = "challenge";
    updateControlsHint();
  },
});

new GameLoop((delta) => {
  const pressed = input.consumePress();
  const choice = input.consumeChoice();
  const tap = input.consumeTap();
  const direction = input.consumeDirection();
  if (screen === "challenge") {
    if (activeChallenge.status === "result" && pressed) {
      startMenu.show(playerName, sheet.attributes);
      screen = "menu";
      updateControlsHint();
      return;
    }
    activeChallenge.update(delta, pressed, input.held, input.consumeRelease(), choice, tap, direction);
    if (activeChallenge.status === "result") sheet.setAttribute(activeChallenge.attributeId, activeChallenge.score);
  }
}, () => { if (screen === "challenge") activeChallenge.draw(context); }).start();

