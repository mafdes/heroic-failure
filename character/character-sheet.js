export const ATTRIBUTE_NAMES = { strength: "Fuerza", dexterity: "Destreza", constitution: "Constitución", intelligence: "Inteligencia", agility: "Agilidad" };
export class CharacterSheet {
  constructor() { this.attributes = Object.fromEntries(Object.keys(ATTRIBUTE_NAMES).map((id) => [id, null])); }
  setAttribute(id, value) { this.attributes[id] = value; }
}
