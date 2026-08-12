import { CharacterSheet } from "../character/character-sheet.js";
import { DexterityChallenge } from "../challenges/dexterity-challenge.js";
import { GameLoop } from "../engine/game-loop.js";
import { Input } from "../engine/input.js";
import { StartMenu } from "../ui/start-menu.js";
import { StrengthChallenge } from "../challenges/strength-challenge.js";
import { IntelligenceChallenge } from "../challenges/intelligence-challenge.js";
import { ConstitutionChallenge } from "../challenges/constitution-challenge.js";
import { AgilityChallenge } from "../challenges/agility-challenge.js";
import { getDefaultLanguage, getTexts, setLanguage } from "./i18n.js";
import { DexterityScreen } from "../ui/dexterity-screen.js";

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
const dexterityScreen = new DexterityScreen({
  onComplete: (score) => {
    sheet.setAttribute("dexterity", score);
    startMenu.show(playerName, sheet.attributes);
    screen = "menu";
    updateControlsHint();
  },
  onExit: () => {
    startMenu.show(playerName, sheet.attributes);
    screen = "menu";
    updateControlsHint();
  },
});
let screen = "menu";
let playerName = "";
let activeChallenge = null;
let language = setLanguage(getDefaultLanguage());
const controlsHint = document.querySelector("#controls-hint");
const gameShell = document.querySelector(".game-shell");
const gameFrame = document.querySelector(".game-frame");

function resizeCanvas() {
  const frameRect = gameFrame.getBoundingClientRect();
  const shellRect = gameShell.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const availableWidth = Math.max(320, frameRect.width);
  const availableHeight = Math.max(240, Math.min(frameRect.height || frameRect.width * 9 / 16, window.innerHeight - shellRect.top - 24));
  const targetWidth = Math.floor(availableWidth * dpr);
  const targetHeight = Math.floor(availableHeight * dpr);
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const scaleX = targetWidth / 960;
  const scaleY = targetHeight / 540;
  context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
}

function updateControlsHint() {
  const texts = getTexts(language);
  if (screen === "menu") {
    controlsHint.textContent = texts.controlsMenu;
  } else if (activeChallenge) {
    controlsHint.textContent = texts.controls[activeChallenge.attributeId] || "";
  }
}

const startMenu = new StartMenu({
  language,
  onLanguageChange: (nextLanguage) => {
    language = setLanguage(nextLanguage);
    updateControlsHint();
  },
  onNameSubmitted: (name) => { playerName = name; startMenu.showSelection(name, sheet.attributes); updateControlsHint(); },
  onChallengeChosen: (id) => {
    if (id === "dexterity") {
      screen = "dexterity";
      gameFrame.classList.add("dexterity-mode");
      startMenu.hide();
      dexterityScreen.show();
      updateControlsHint();
      return;
    }
    gameFrame.classList.remove("dexterity-mode");
    activeChallenge = challenges[id];
    activeChallenge.reset();
    startMenu.hide();
    screen = "challenge";
    updateControlsHint();
  },
});

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);
resizeCanvas();

new GameLoop((delta) => {
  const pressed = input.consumePress();
  const choice = input.consumeChoice();
  const tap = input.consumeTap();
  const direction = input.consumeDirection();
  if (screen === "dexterity") {
    return;
  }
  if (screen === "challenge") {
    if (activeChallenge.status === "result" && pressed) {
      gameFrame.classList.remove("dexterity-mode");
      startMenu.show(playerName, sheet.attributes);
      screen = "menu";
      updateControlsHint();
      return;
    }
    activeChallenge.update(delta, pressed, input.held, input.consumeRelease(), choice, tap, direction);
    if (activeChallenge.status === "result") sheet.setAttribute(activeChallenge.attributeId, activeChallenge.score);
  }
}, () => { if (screen === "challenge") activeChallenge.draw(context); }).start();
