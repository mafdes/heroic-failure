import { CharacterSheet } from "../character/character-sheet.js";
import { DexterityChallenge } from "../challenges/dexterity-challenge.js";
import { GameLoop } from "../engine/game-loop.js";
import { Input } from "../engine/input.js";
import { StartMenu } from "../ui/start-menu.js";
import { StrengthChallenge } from "../challenges/strength-challenge.js";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const input = new Input(canvas);
const sheet = new CharacterSheet();
const dexterity = new DexterityChallenge();
const strength = new StrengthChallenge();
const challenges = { dexterity, strength };
let screen = "menu";
let playerName = "";
let activeChallenge = null;
const startMenu = new StartMenu({
  onNameSubmitted: (name) => { playerName = name; startMenu.showSelection(name, sheet.attributes); },
  onChallengeChosen: (id) => { activeChallenge = challenges[id]; activeChallenge.reset(); startMenu.hide(); screen = "challenge"; },
});

new GameLoop((delta) => {
  const pressed = input.consumePress();
  if (screen === "challenge") {
    if (activeChallenge.status === "result" && pressed) { startMenu.show(playerName, sheet.attributes); screen = "menu"; return; }
    activeChallenge.update(delta, pressed, input.held, input.consumeRelease());
    if (activeChallenge.status === "result") sheet.setAttribute(activeChallenge === strength ? "strength" : "dexterity", activeChallenge.score);
  }
}, () => { if (screen === "challenge") activeChallenge.draw(context); }).start();
