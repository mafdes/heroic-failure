// ─── BASE DE DATOS DE CLASES POR ESCALONES (TIERS) ───────────────────────────
// Clases puramente narrativas y cómicas. Cero bonus mecánicos.

export const CLASS_TIERS = [
  {
    tier: 1,
    title: "Escalón I: Las Leyendas del Gremio",
    subtitle: "Clases reservadas para héroes de leyenda. Requisitos desorbitados que casi nadie cumple.",
    giveUpText: "Rendirse y mirar Clases Inferiores",
    classes: [
      {
        id: "knight",
        name: "Caballero Real",
        reqText: "Fuerza >= 14 | Constitución >= 13",
        requirements: { strength: 14, constitution: 13 },
        description: "Portador de armadura de plomo reluciente y defensor del honor administrativo.",
        rejection: "El Tribunal estampa el rechazo: 'Firmeza física insuficiente para soportar el peto de plomo sin doblarse por la cintura'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4l12 6v14c0 10-12 18-12 18S12 34 12 24V10l12-6z"/><path d="M24 12v16M16 20h16"/></svg>`
      },
      {
        id: "archmage",
        name: "Archimago Supremo",
        reqText: "Inteligencia >= 15",
        requirements: { intelligence: 15 },
        description: "Dominador de las artes oscuras, del fuego estelar y de la memoria sin límites.",
        rejection: "El Tribunal estampa el rechazo: 'Cerebro con masa crítica insuficiente. Tropezó con el pergamino de bienvenida'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4l5 12 13 2-9 9 2 13-11-6-11 6 2-13-9-9 13-2 5-12z"/><circle cx="24" cy="24" r="5"/></svg>`
      },
      {
        id: "barbarian",
        name: "Bárbaro de las Estepas",
        reqText: "Fuerza >= 15 | Constitución >= 14",
        requirements: { strength: 15, constitution: 14 },
        description: "Aplastador de rocas y devorador de jabalíes crudos en medio de la ventisca.",
        rejection: "El Tribunal estampa el rechazo: 'Espalda de juncos secos. El hacha de combate doble le partiría la columna al levantarla'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8l32 32M40 8L8 40M24 14l10-6M24 34l10 6M14 24l-6 10M34 24l6 10"/></svg>`
      },
      {
        id: "rogue",
        name: "Pícaro Sombrío",
        reqText: "Destreza >= 14 | Agilidad >= 14",
        requirements: { dexterity: 14, agility: 14 },
        description: "Fantasma nocturno capaz de vaciar bolsillos ajenos sin alterar el aire.",
        rejection: "El Tribunal estampa el rechazo: 'Sigilo nulo. Sus botas chirrían sobre la alfombra del gremio como dos cerdos asustados'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4l-14 20h28L24 4z"/><path d="M14 24l10 20 10-20"/><circle cx="24" cy="24" r="3"/></svg>`
      },
      {
        id: "paladin",
        name: "Paladín Sagrado",
        reqText: "Fuerza >= 13 | Constitución >= 13 | Inteligencia >= 12",
        requirements: { strength: 13, constitution: 13, intelligence: 12 },
        description: "Faro de fe inviolable, devoción de hierro y sabiduría celestial.",
        rejection: "El Tribunal estampa el rechazo: 'La luz divina le ciega y se confunde de puerta al salir del confesionario'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4v38M10 18h28M6 42h36"/></svg>`
      }
    ]
  },
  {
    tier: 2,
    title: "Escalón II: Los Aspirantes del Gremio",
    subtitle: "Estudiantes y auxiliares. Requisitos moderados pero que el tribunal sigue considerando excesivos para ti.",
    giveUpText: "Reconocer incapacidad y bajar de escalón",
    classes: [
      {
        id: "mage_apprentice",
        name: "Aprendiz de Mago",
        reqText: "Inteligencia >= 10",
        requirements: { intelligence: 10 },
        description: "Encargado de barrer el polvo de las túnicas y encender las velas de la biblioteca.",
        rejection: "El Archivista niega con la cabeza: 'Confunde las palabras de los hechizos con recetas de sopa de col'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 40l24-24M30 10l6 6M18 34l6 6"/><circle cx="36" cy="12" r="4"/></svg>`
      },
      {
        id: "squire",
        name: "Escudero de Guardia",
        reqText: "Fuerza >= 9 | Constitución >= 9",
        requirements: { strength: 9, constitution: 9 },
        description: "Pulidor oficial de hebillas y cargador del saco de avena de la caballería.",
        rejection: "El Instructor se burla: 'No aguantaría tres pasos cargando el peto de repuesto'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 6h16v12H16zM24 18v24M12 30h24"/></svg>`
      },
      {
        id: "pickpocket",
        name: "Ratero de Callejón",
        reqText: "Destreza >= 9 | Agilidad >= 9",
        requirements: { dexterity: 9, agility: 9 },
        description: "Especialista en hurgar en sacos abiertos y huir despavorido ante la guardia.",
        rejection: "El Tribunal anota: 'Torpeza de dedos. Logró meterse la mano en su propio bolsillo por accidente'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14l20 20M34 14L14 34"/><circle cx="24" cy="24" r="8"/></svg>`
      },
      {
        id: "torchbearer",
        name: "Portador de Antorchas",
        reqText: "Constitución >= 8",
        requirements: { constitution: 8 },
        description: "El primero en entrar en la mazmorra oscura y el último en ser recordado.",
        rejection: "El Capitán sentencia: 'Se le apaga la antorcha con su propio aliento agitado'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 24v18M18 12l6-8 6 8-6 4z"/><path d="M16 24h16"/></svg>`
      }
    ]
  },
  {
    tier: 3,
    title: "Escalón III: Oficios Comunes del Reino",
    subtitle: "Puestos del día a día. El gremio tampoco cree que tengas la compostura necesaria.",
    giveUpText: "Descender a las clases absurdas finales",
    classes: [
      {
        id: "peasant",
        name: "Campesino con Azadón",
        reqText: "Fuerza >= 7",
        requirements: { strength: 7 },
        description: "Cultivador de nabos y espectador profesional del paso de caballeros verdaderos.",
        rejection: "El Examinador suspira: 'Los nabos se le darían mejor que las armas, pero ni para eso hay agarre'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6l20 20M34 6h8v8M14 26v16"/></svg>`
      },
      {
        id: "latrine_cleaner",
        name: "Limpiador de Letrinas",
        reqText: "Constitución >= 7",
        requirements: { constitution: 7 },
        description: "Héroe anónimo del alcantarillado del gremio. Su estómago es legendario.",
        rejection: "El Gremio rechaza la solicitud: 'Mareos prematuros al acercarse al foso del establo'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12h24v24H12zM24 36v8M18 44h12"/></svg>`
      },
      {
        id: "gate_guard",
        name: "Guardia Sentado de Puerta",
        reqText: "Constitución >= 6",
        requirements: { constitution: 6 },
        description: "Encargado de pedir el salvoconducto y dormitar al sol sobre un taburete.",
        rejection: "El Oficial anota: 'Se cae del taburete antes del segundo ronquido'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 40h24M24 10v30M16 18h16"/></svg>`
      },
      {
        id: "potato_peeler",
        name: "Pelador de Patatas",
        reqText: "Destreza >= 6",
        requirements: { dexterity: 6 },
        description: "Pilar fundamental de las sopas de la cocina del gremio.",
        rejection: "El Cocinero Jefe le echa: 'Corta más piel de sus dedos que de las patatas'.",
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="14"/><path d="M14 24h20"/></svg>`
      }
    ]
  },
  {
    tier: 4,
    title: "Escalón IV: Clases Absurdas y Desesperadas (¡ASIGNACIÓN FINAL!)",
    subtitle: "Sin requisitos. El gremio ha tirado la toalla y te concede una de estas identidades de consolación.",
    giveUpText: null,
    classes: [
      {
        id: "lucky_leper",
        name: "Leproso Afortunado",
        reqText: "Aceptación Inmediata",
        requirements: {},
        description: "Nadie se le acerca demasiado por precaución. La suerte le sonríe donde la salud le falló.",
        rejection: null,
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="18" r="10"/><path d="M14 40c0-6 4-10 10-10s10 4 10 10M18 14h.01M30 14h.01M24 22h.01"/></svg>`
      },
      {
        id: "mystic_limper",
        name: "Cojo Místico",
        reqText: "Aceptación Inmediata",
        requirements: {},
        description: "Avanza despacio y tropezando con estilo. Su andar errático confunde a los monstruos.",
        rejection: null,
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10a4 4 0 1 0 8 0 4 4 0 0 0-8 0zM18 42l4-16 6 6M26 26l8 16M14 24h16"/></svg>`
      },
      {
        id: "one_eyed_bard",
        name: "Tavernero Tuerto",
        reqText: "Aceptación Inmediata",
        requirements: {},
        description: "No ve venir los hachazos, pero sus gritos de dolor asustan a los roedores de la mazmorra.",
        rejection: null,
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="16"/><path d="M14 20l10 8M24 20l-10 8M34 24a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/></svg>`
      },
      {
        id: "barrel_survivor",
        name: "Superviviente de Barriles",
        reqText: "Aceptación Inmediata",
        requirements: {},
        description: "Ha esquivado y recibido tantos toneles que su cuerpo vive en alerta permanente.",
        rejection: null,
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="8" width="24" height="32" rx="6"/><path d="M12 18h24M12 30h24"/></svg>`
      },
      {
        id: "ghost_bureaucrat",
        name: "Fantasma Administrativo",
        reqText: "Aceptación Inmediata",
        requirements: {},
        description: "Nadie sabe si sigue con vida o si solo olvidaron borrar su sello de la lista de espera del gremio.",
        rejection: null,
        svg: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 40V20a12 12 0 1 1 24 0v20l-6-4-6 4-6-4-6 4z"/><circle cx="18" cy="20" r="2"/><circle cx="30" cy="20" r="2"/></svg>`
      }
    ]
  }
];
