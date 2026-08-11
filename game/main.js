import { CharacterSheet } from "../character/character-sheet.js";
import { DexterityChallenge } from "../challenges/dexterity-challenge.js";
import { GameLoop } from "../engine/game-loop.js";
import { Input } from "../engine/input.js";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const input = new Input(canvas);
const sheet = new CharacterSheet();
const dexterity = new DexterityChallenge();
new GameLoop((delta) => { dexterity.update(delta, input.consumePress()); if (dexterity.status === "result") sheet.setAttribute("dexterity", dexterity.score); }, () => dexterity.draw(context)).start();
