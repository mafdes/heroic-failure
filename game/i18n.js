const STORAGE_KEY = "heroic-failure-language";

const TEXTS = {
  es: {
    pageLang: "es",
    eyebrow: "Examen satírico del gremio de aventureros",
    homeChapter: "Convocatoria del gremio",
    homeTitle: "¿Listo para fingir que mereces entrar en una mazmorra?",
    newGame: "Nueva partida",
    settings: "Configuración",
    settingsChapter: "Idioma del tablón",
    settingsTitle: "Escoge cómo te insulta el gremio.",
    languageLabel: "Idioma",
    back: "Volver",
    save: "Guardar",
    nameChapter: "Registro del aspirante",
    nameLabel: "¿Cómo se llama la futura decepción del gremio?",
    namePlaceholder: "Nombre gloriosamente mediocre",
    submitName: "Presentar la solicitud",
    pickerChapter: "Pruebas de admisión",
    welcome: (name) => `${name}, el gremio necesita clasificarte antes de dejarte oler una mazmorra.`,
    dexterityCopy: "Atina una zona móvil. Veinte niveles. La dignidad se descuenta aparte.",
    strengthCopy: "Carga una pesa sin acabar en una camilla con escudo heráldico.",
    intelligenceCopy: "Memoriza sellos antes de que el gremio los declare demasiado peligrosos para ti.",
    constitutionCopy: "Mantén el pulso en su sitio durante el reconocimiento del gremio.",
    agilityCopy: "Esquiva trampas antes de que el suelo decida opinar.",
    enterTrial: "Entrar en la prueba →",
    resultLabel: (score) => `Resultado gremial: ${score} / 20 ✓`,
    availability: "Más pruebas llegarán cuando el gremio encuentre presupuesto y ganas.",
    attributeNames: {
      strength: "Fuerza",
      dexterity: "Destreza",
      constitution: "Constitución",
      intelligence: "Inteligencia",
      agility: "Agilidad"
    },
    controls: {
      dexterity: "Destreza: Pulsa ESPACIO, ENTER o TOCA la pantalla para detener el indicador.",
      strength: "Fuerza: MANTÉN ESPACIO/CLIC o TOCA la pantalla para cargar y suelta en la zona.",
      intelligence: "Inteligencia: TOCA la tarjeta correcta o usa las teclas 1, 2, 3.",
      constitution: "Constitución: Usa las flechas ← → o TOCA los lados del área de juego.",
      agility: "Agilidad: Usa las flechas ← → o TOCA un carril para esquivar los obstáculos."
    }
  },
  ca: {
    pageLang: "ca",
    eyebrow: "Examen satíric del gremi d'aventurers",
    homeChapter: "Convocatòria del gremi",
    homeTitle: "Preparat per fingir que mereixes entrar en una masmorra?",
    newGame: "Nova partida",
    settings: "Configuració",
    settingsChapter: "Idioma del tauler",
    settingsTitle: "Tria com t'insulta el gremi.",
    languageLabel: "Idioma",
    back: "Torna",
    save: "Desa",
    nameChapter: "Registre de l'aspirant",
    nameLabel: "Com es diu la futura decepció del gremi?",
    namePlaceholder: "Nom gloriosament mediocre",
    submitName: "Presentar la sol·licitud",
    pickerChapter: "Proves d'admissió",
    welcome: (name) => `${name}, el gremi t'ha de classificar abans de deixar-te olorar una masmorra.`,
    dexterityCopy: "Encerta una zona mòbil. Vint nivells. La dignitat es descompta a part.",
    strengthCopy: "Carrega una pesa sense acabar en una llitera amb escut heràldic.",
    intelligenceCopy: "Memoritza segells abans que el gremi els declari massa perillosos per a tu.",
    constitutionCopy: "Mantén el pols al seu lloc durant el reconeixement del gremi.",
    agilityCopy: "Esquiva trampes abans que el terra decideixi opinar.",
    enterTrial: "Entrar a la prova →",
    resultLabel: (score) => `Resultat gremial: ${score} / 20 ✓`,
    availability: "Més proves arribaran quan el gremi trobi pressupost i ganes.",
    attributeNames: {
      strength: "Força",
      dexterity: "Destresa",
      constitution: "Constitució",
      intelligence: "Intel·ligència",
      agility: "Agilitat"
    },
    controls: {
      dexterity: "Destresa: Prem ESPAI, ENTER o TOCA la pantalla per aturar l'indicador.",
      strength: "Força: MANTÉ ESPAI/CLIC o TOCA la pantalla per carregar i deixa anar dins la zona.",
      intelligence: "Intel·ligència: TOCA la carta correcta o usa les tecles 1, 2, 3.",
      constitution: "Constitució: Fes servir les fletxes ← → o TOCA els laterals de l'àrea de joc.",
      agility: "Agilitat: Fes servir les fletxes ← → o TOCA un carril per esquivar els obstacles."
    }
  },
  en: {
    pageLang: "en",
    eyebrow: "Satirical Guild Adventurer Exam",
    homeChapter: "Guild summons",
    homeTitle: "Ready to pretend you deserve a dungeon?",
    newGame: "New game",
    settings: "Settings",
    settingsChapter: "Board language",
    settingsTitle: "Choose how the guild insults you.",
    languageLabel: "Language",
    back: "Back",
    save: "Save",
    nameChapter: "Applicant record",
    nameLabel: "What is the guild's next disappointment called?",
    namePlaceholder: "Gloriously mediocre name",
    submitName: "Submit request",
    pickerChapter: "Admission trials",
    welcome: (name) => `${name}, the guild needs to classify you before letting you near a dungeon.`,
    dexterityCopy: "Hit a moving zone. Twenty levels. Dignity sold separately.",
    strengthCopy: "Lift the weight without ending up on a stretcher with a coat of arms.",
    intelligenceCopy: "Memorize seals before the guild declares them too dangerous for you.",
    constitutionCopy: "Keep your pulse where it belongs during the guild checkup.",
    agilityCopy: "Dodge traps before the floor decides to weigh in.",
    enterTrial: "Enter trial →",
    resultLabel: (score) => `Guild result: ${score} / 20 ✓`,
    availability: "More trials will arrive once the guild finds budget and motivation.",
    attributeNames: {
      strength: "Strength",
      dexterity: "Dexterity",
      constitution: "Constitution",
      intelligence: "Intelligence",
      agility: "Agility"
    },
    controls: {
      dexterity: "Dexterity: Press SPACE, ENTER or TAP the screen to stop the indicator.",
      strength: "Strength: HOLD SPACE/CLICK or TAP the screen to charge and release inside the zone.",
      intelligence: "Intelligence: TAP the correct card or use keys 1, 2, 3.",
      constitution: "Constitution: Use ← → arrows or TAP the sides of the play area.",
      agility: "Agility: Use ← → arrows or TAP a lane to dodge the obstacles."
    }
  }
};

function normalizeLanguage(lang) {
  if (!lang) return "es";
  const code = String(lang).toLowerCase();
  if (code.startsWith("ca")) return "ca";
  if (code.startsWith("en")) return "en";
  return "es";
}

export function getDefaultLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return normalizeLanguage(saved);
  return normalizeLanguage(navigator.language || navigator.userLanguage);
}

export function setLanguage(lang) {
  const normalized = normalizeLanguage(lang);
  localStorage.setItem(STORAGE_KEY, normalized);
  document.documentElement.lang = TEXTS[normalized].pageLang;
  return normalized;
}

export function t(lang, key, ...args) {
  const normalized = normalizeLanguage(lang);
  const value = TEXTS[normalized][key];
  return typeof value === "function" ? value(...args) : value;
}

export function getTexts(lang) {
  return TEXTS[normalizeLanguage(lang)];
}

export const SUPPORTED_LANGUAGES = [
  { value: "es", label: "Castellano" },
  { value: "ca", label: "Català" },
  { value: "en", label: "English" }
];
