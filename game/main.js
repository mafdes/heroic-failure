import { CharacterSheet } from "../character/character-sheet.js";
import { DexterityChallenge } from "../challenges/dexterity-challenge.js";
import { GameLoop } from "../engine/game-loop.js";
import { Input } from "../engine/input.js";
import { StartMenu } from "../ui/start-menu.js";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const input = new Input(canvas);
const sheet = new CharacterSheet();
const dexterity = new DexterityChallenge();
let screen = "menu";
let playerName = "";
const startMenu = new StartMenu({
  onNameSubmitted: (name) => { playerName = name; startMenu.showSelection(name); },
  onChallengeChosen: () => { dexterity.reset(); startMenu.hide(); screen = "challenge"; },
});

new GameLoop((delta) => {
  const pressed = input.consumePress();
  if (screen === "challenge") {
    if (dexterity.status === "result" && pressed) { startMenu.show(); screen = "menu"; return; }
    dexterity.update(delta, pressed);
    if (dexterity.status === "result") sheet.setAttribute("dexterity", dexterity.score);
  }
}, () => { if (screen === "challenge") dexterity.draw(context); }).start();
