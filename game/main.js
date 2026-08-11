import { CharacterSheet } from "../character/character-sheet.js";
import { DexterityChallenge } from "../challenges/dexterity-challenge.js";
import { GameLoop } from "../engine/game-loop.js";
import { Input } from "../engine/input.js";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const input = new Input(canvas);
const sheet = new CharacterSheet();
const dexterity = new DexterityChallenge();
let screen = "menu";
let playerName = "";

function title(text, y) { context.fillStyle = "#f3c46b"; context.font = "bold 42px Georgia"; context.textAlign = "center"; context.fillText(text, 480, y); }
function copy(text, y, color = "#f7ead0") { context.fillStyle = color; context.font = "22px Georgia"; context.textAlign = "center"; context.fillText(text, 480, y); }
function drawScreen() {
  context.fillStyle = "#211d2a"; context.fillRect(0, 0, 960, 540);
  if (screen === "menu") { title("HEROIC FAILURE", 160); copy("Un RPG de aptitudes cuestionables.", 225); copy("NUEVA PARTIDA", 330, "#f3c46b"); copy("ESPACIO / CLIC para empezar a decepcionar a tu linaje.", 395, "#bdb0b6"); return; }
  title("ELIGE TU PRUEBA", 130); copy(`${playerName}, el Estado necesita clasificarte.`, 190); copy("DESTREZA", 290, "#f3c46b"); copy("Atina una zona móvil. Es la única prueba disponible por ahora.", 330); copy("ESPACIO / CLIC para elegirla.", 410, "#bdb0b6");
}

new GameLoop((delta) => {
  const pressed = input.consumePress();
  if (screen === "menu" && pressed) { playerName = window.prompt("¿Cómo se llama el aspirante?", "")?.trim() || "Sin Nombre"; screen = "selection"; return; }
  if (screen === "selection" && pressed) { dexterity.reset(); screen = "challenge"; return; }
  if (screen === "challenge") {
    if (dexterity.status === "result" && pressed) { screen = "selection"; return; }
    dexterity.update(delta, pressed);
    if (dexterity.status === "result") sheet.setAttribute("dexterity", dexterity.score);
  }
}, () => (screen === "challenge" ? dexterity.draw(context) : drawScreen())).start();
