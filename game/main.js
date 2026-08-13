import { CharacterSheet } from "../character/character-sheet.js";
import { preloadAssets } from "../engine/asset-loader.js";
import { GameLoop } from "../engine/game-loop.js";
import { Input } from "../engine/input.js";
import { StartMenu } from "../ui/start-menu.js";
import { getDefaultLanguage, getTexts, setLanguage } from "./i18n.js";
import { DexterityScreen } from "../ui/dexterity-screen.js";
import { ConstitutionScreen } from "../ui/constitution-screen.js";
import { StrengthScreen } from "../ui/strength-screen.js";
import { AgilityScreen } from "../ui/agility-screen.js";
import { IntelligenceScreen } from "../ui/intelligence-screen.js";
import { GuildReportScreen } from "../ui/guild-report.js";
import { ClassSelectionScreen } from "../ui/class-selection-screen.js";
import { ComingSoonScreen } from "../ui/coming-soon-screen.js";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const gameShell = document.querySelector(".game-shell");
const gameFrame = document.querySelector(".game-frame");
const loadingScreen = document.querySelector("#loading-screen");
const loadingBar = document.querySelector("#loading-bar");
const loadingText = document.querySelector("#loading-text");

gameFrame.addEventListener("contextmenu", (event) => event.preventDefault());

const preloadResult = await preloadAssets(undefined, ({ completed, total, progress }) => {
  if (loadingBar) loadingBar.style.width = `${Math.round(progress * 100)}%`;
  if (loadingText) loadingText.textContent = `Preparando sala ${completed} de ${total}...`;
});

if (preloadResult.failed.length > 0) {
  console.warn("Assets no cargados:", preloadResult.failed.map((asset) => asset.src));
}

if (loadingText) loadingText.textContent = "El tribunal abre las puertas.";
if (loadingScreen) loadingScreen.hidden = true;
document.body.classList.remove("app-loading");

const input = new Input(canvas);
const sheet = new CharacterSheet();

function hideAllScreens() {
  if (typeof startMenu !== "undefined") startMenu.hide();
  guildReportScreen.hide();
  dexterityScreen.hide();
  constitutionScreen.hide();
  strengthScreen.hide();
  agilityScreen.hide();
  intelligenceScreen.hide();
  classSelectionScreen.hide();
  comingSoonScreen.hide();
}

function openChallenge(id) {
  hideAllScreens();

  if (id === "dexterity") {
    screen = "dexterity";
    gameFrame.classList.add("dexterity-mode");
    dexterityScreen.show();
    return;
  }
  if (id === "constitution") {
    screen = "constitution";
    gameFrame.classList.add("dexterity-mode");
    constitutionScreen.show();
    return;
  }
  if (id === "strength") {
    screen = "strength";
    gameFrame.classList.add("dexterity-mode");
    strengthScreen.show();
    return;
  }
  if (id === "agility") {
    screen = "agility";
    gameFrame.classList.add("dexterity-mode");
    agilityScreen.show();
    return;
  }
  if (id === "intelligence") {
    screen = "intelligence";
    gameFrame.classList.add("dexterity-mode");
    intelligenceScreen.show();
    return;
  }

  gameFrame.classList.remove("dexterity-mode");
  screen = "challenge";
}

function returnToReport() {
  hideAllScreens();
  gameFrame.classList.add("dexterity-mode");
  screen = "report";
  guildReportScreen.show(playerName, sheet.attributes, sheet.characterClass);
}

const comingSoonScreen = new ComingSoonScreen({
  onReturnToMenu: () => {
    hideAllScreens();
    screen = "menu";
    startMenu.show();
  }
});

const classSelectionScreen = new ClassSelectionScreen({
  onClassSelected: (cls) => {
    sheet.characterClass = cls;
    returnToReport();
  },
  onExit: () => {
    returnToReport();
  }
});

const guildReportScreen = new GuildReportScreen({
  onChallengeChosen: (id) => {
    openChallenge(id);
  },
  onChallengeSelected: (id) => {
    openChallenge(id);
  },
  onClassRequested: () => {
    hideAllScreens();
    gameFrame.classList.add("dexterity-mode");
    screen = "class-selection";
    classSelectionScreen.show(playerName, sheet.attributes);
  },
  onAdventureRequested: () => {
    hideAllScreens();
    gameFrame.classList.add("dexterity-mode");
    screen = "coming-soon";
    comingSoonScreen.show(playerName, sheet.characterClass);
  },
  onTestFillRequested: () => {
    sheet.setAttribute("dexterity", Math.floor(Math.random() * 12) + 2);
    sheet.setAttribute("strength", Math.floor(Math.random() * 12) + 2);
    sheet.setAttribute("constitution", Math.floor(Math.random() * 12) + 2);
    sheet.setAttribute("intelligence", Math.floor(Math.random() * 12) + 2);
    sheet.setAttribute("agility", Math.floor(Math.random() * 12) + 2);
    guildReportScreen.update(playerName, sheet.attributes, sheet.characterClass);
  }
});

const dexterityScreen = new DexterityScreen({
  onComplete: (score) => {
    sheet.setAttribute("dexterity", score);
    returnToReport();
  },
  onExit: () => {
    returnToReport();
  },
});

const constitutionScreen = new ConstitutionScreen({
  onComplete: (score) => {
    sheet.setAttribute("constitution", score);
    returnToReport();
  },
  onExit: () => {
    returnToReport();
  },
});

const strengthScreen = new StrengthScreen({
  onComplete: (score) => {
    sheet.setAttribute("strength", score);
    returnToReport();
  },
  onExit: () => {
    returnToReport();
  },
});

const agilityScreen = new AgilityScreen({
  onComplete: (score) => {
    sheet.setAttribute("agility", score);
    returnToReport();
  },
  onExit: () => {
    returnToReport();
  },
});

const intelligenceScreen = new IntelligenceScreen({
  onComplete: (score) => {
    sheet.setAttribute("intelligence", score);
    returnToReport();
  },
  onExit: () => {
    returnToReport();
  },
});

let screen = "menu";
let playerName = "";
let activeChallenge = null;
let language = setLanguage(getDefaultLanguage());

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

const startMenu = new StartMenu({
  language,
  onLanguageChange: (nextLanguage) => {
    language = setLanguage(nextLanguage);
  },
  onNameSubmitted: (name) => {
    playerName = name;
    returnToReport();
  },
  onChallengeChosen: (id) => {
    openChallenge(id);
  },
});

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);
resizeCanvas();

new GameLoop((delta) => {
  return;
}, () => {}).start();
