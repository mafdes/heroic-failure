import { drawCountdown } from "../engine/countdown.js";

const TOTAL_ROUNDS = 20;
const ALL_RUNES = ["📜", "🔮", "🗝️", "🧪", "⚔️", "👑", "💎", "🍄"];

function roundConfig(round) {
  const level = round + 1;
  let numPairs = 2;
  let timeLimit = 9.0;
  let shuffleOnMismatch = false;
  let moveCards = false;
  let blink = false;
  let message = "";

  if (level === 1) {
    numPairs = 2; // 4 cartas
    timeLimit = 9.5;
    message = "Encuentre las 2 parejas de runas.";
  } else if (level === 2) {
    numPairs = 3; // 6 cartas
    timeLimit = 11.0;
    message = "Encuentre las 3 parejas de runas.";
  } else if (level === 3) {
    numPairs = 4; // 8 cartas
    timeLimit = 12.0;
    shuffleOnMismatch = true;
    message = "El registro se reorganiza tras cada fallo.";
  } else if (level === 4) {
    numPairs = 5; // 10 cartas
    timeLimit = 13.0;
    shuffleOnMismatch = true;
    moveCards = true;
    message = "Las cartas del grimorio se desplazan.";
  } else if (level === 5) {
    numPairs = 6; // 12 cartas
    timeLimit = 13.5;
    shuffleOnMismatch = true;
    moveCards = true;
    blink = true;
    message = "Niebla Arcana en el registro del reino.";
  } else {
    const extra = level - 5;
    numPairs = Math.min(8, 6 + Math.floor(extra / 3)); // hasta 16 cartas
    timeLimit = Math.max(8.0, 14.0 - extra * 0.4);
    shuffleOnMismatch = true;
    moveCards = true;
    blink = true;
    message = `Prueba de Gran Mago — Nivel ${level}.`;
  }

  return { level, numPairs, numCards: numPairs * 2, timeLimit, shuffleOnMismatch, moveCards, blink, message };
}

export class IntelligenceChallenge {
  constructor() {
    this.attributeId = "intelligence";
    this.reset();
  }

  reset() {
    this.round = 0;
    this.score = 1;
    this.status = "intro";
    this.timer = 0;
    this.cards = [];
    this.selectedCards = [];
    this.mismatchTimer = 0;
    this.timeInRound = 0;
    this.blinkTimer = 0;
    this.isBoardVisible = true;
  }

  startRound() {
    const cfg = roundConfig(this.round);
    this.timer = cfg.timeLimit;
    this.selectedCards = [];
    this.mismatchTimer = 0;
    this.timeInRound = 0;
    this.blinkTimer = 0;
    this.isBoardVisible = true;

    // Seleccionar parejas de runas
    const selectedRunes = ALL_RUNES.slice(0, cfg.numPairs);
    const deck = [...selectedRunes, ...selectedRunes];
    // Barajar mazo
    deck.sort(() => Math.random() - 0.5);

    // Crear objetos de cartas
    this.buildBoard(deck, cfg.numCards);
    this.status = "playing";
  }

  buildBoard(deck, numCards) {
    this.cards = [];
    let cols = 4;
    let rows = Math.ceil(numCards / cols);
    if (numCards === 6) { cols = 3; rows = 2; }

    const cardWidth = Math.min(130, Math.floor(700 / cols));
    const cardHeight = Math.min(125, Math.floor(320 / rows));
    const gap = 16;

    const totalWidth = cols * cardWidth + (cols - 1) * gap;
    const totalHeight = rows * cardHeight + (rows - 1) * gap;
    const startX = 480 - totalWidth / 2;
    const startY = 270 - totalHeight / 2 + 25;

    for (let i = 0; i < numCards; i += 1) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const bx = startX + c * (cardWidth + gap);
      const by = startY + r * (cardHeight + gap);

      this.cards.push({
        id: i,
        rune: deck[i],
        baseX: bx,
        baseY: by,
        x: bx,
        y: by,
        w: cardWidth,
        h: cardHeight,
        isFlipped: false,
        isMatched: false
      });
    }
  }

  update(delta, pressed, _held, _released, choice, tap) {
    if (this.status === "intro" && pressed) {
      this.status = "countdown";
      this.timer = 3;
      return;
    }
    if (this.status === "countdown") {
      this.timer -= delta;
      if (this.timer <= 0) this.startRound();
      return;
    }
    if (this.status !== "playing") return;

    this.timeInRound += delta;
    const cfg = roundConfig(this.round);

    // Temporizador global del nivel
    this.timer -= delta;
    if (this.timer <= 0) {
      this.status = "result";
      return;
    }

    // Bloqueo temporal por desajuste (espera 0.4s antes de voltear atrás)
    if (this.mismatchTimer > 0) {
      this.mismatchTimer -= delta;
      if (this.mismatchTimer <= 0) {
        this.resolveMismatch(cfg);
      }
      return;
    }

    // Movimiento continuo de cartas si el nivel lo requiere
    if (cfg.moveCards) {
      this.cards.forEach((card) => {
        if (!card.isMatched) {
          const offset = Math.sin(this.timeInRound * 2.2 + card.id * 1.4) * 18;
          card.x = card.baseX + offset;
        }
      });
    }

    // Parpadeo de niebla arcana
    if (cfg.blink) {
      this.blinkTimer += delta;
      if (this.blinkTimer >= 0.20) {
        this.blinkTimer = 0;
        this.isBoardVisible = !this.isBoardVisible;
      }
    } else {
      this.isBoardVisible = true;
    }

    // Detectar clic/toque en cartas
    const clickedCard = this.cardAt(tap);
    if (clickedCard) {
      this.handleCardClick(clickedCard, cfg);
    }
  }

  cardAt(tap) {
    if (!tap) return null;
    return this.cards.find(c =>
      !c.isFlipped && !c.isMatched &&
      tap.x >= c.x && tap.x <= c.x + c.w &&
      tap.y >= c.y && tap.y <= c.y + c.h
    );
  }

  handleCardClick(card, cfg) {
    if (this.selectedCards.length >= 2) return;

    card.isFlipped = true;
    this.selectedCards.push(card);

    if (this.selectedCards.length === 2) {
      const [c1, c2] = this.selectedCards;
      if (c1.rune === c2.rune) {
        // ¡PAREJA ENCONTRADA!
        c1.isMatched = true;
        c2.isMatched = true;
        this.selectedCards = [];

        // Comprobar si ha encontrado todas las parejas
        if (this.cards.every(c => c.isMatched)) {
          this.round += 1;
          this.score = Math.min(TOTAL_ROUNDS, this.round + 1);
          if (this.round === TOTAL_ROUNDS) {
            this.status = "result";
          } else {
            this.startRound();
          }
        }
      } else {
        // ¡NO COINCIDEN! Esperar breve tiempo para mostrar el fallo
        this.mismatchTimer = 0.45;
      }
    }
  }

  resolveMismatch(cfg) {
    const [c1, c2] = this.selectedCards;
    if (c1) c1.isFlipped = false;
    if (c2) c2.isFlipped = false;
    this.selectedCards = [];

    // Si el nivel tiene barajado al fallar, intercambia las posiciones de 2 cartas no emparejadas
    if (cfg.shuffleOnMismatch) {
      const unmatched = this.cards.filter(c => !c.isMatched);
      if (unmatched.length >= 2) {
        const i1 = Math.floor(Math.random() * unmatched.length);
        let i2 = Math.floor(Math.random() * unmatched.length);
        while (i2 === i1) i2 = Math.floor(Math.random() * unmatched.length);

        // Intercambiar posiciones base
        const tempX = unmatched[i1].baseX;
        const tempY = unmatched[i1].baseY;
        unmatched[i1].baseX = unmatched[i2].baseX;
        unmatched[i1].baseY = unmatched[i2].baseY;
        unmatched[i2].baseX = tempX;
        unmatched[i2].baseY = tempY;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#1a1622";
    ctx.fillRect(0, 0, 960, 540);
    ctx.textAlign = "center";

    if (this.status === "intro") return this.drawIntro(ctx);
    if (this.status === "countdown") return drawCountdown(ctx, this.timer, "Mezclando el mazo del registro...");
    if (this.status === "result") return this.drawResult(ctx);

    this.drawGame(ctx);
  }

  title(ctx, text, y) {
    ctx.fillStyle = "#f3c46b";
    ctx.font = "bold 40px Cinzel, Georgia, serif";
    ctx.fillText(text, 480, y);
  }

  copy(ctx, text, y, color = "#f7ead0") {
    ctx.fillStyle = color;
    ctx.font = "600 24px Cinzel, Georgia, serif";
    ctx.fillText(text, 480, y);
  }

  drawIntro(ctx) {
    this.title(ctx, "PRUEBA DE INTELIGENCIA", 135);
    this.copy(ctx, "El Registro de Parejas Mágicas del Reino.", 215);
    this.copy(ctx, "Toca las cartas boca abajo para emparejar todas las runas.", 265, "#d3a658");
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para empezar.", 370);
  }

  drawGame(ctx) {
    const cfg = roundConfig(this.round);

    this.title(ctx, `INTELIGENCIA — NIVEL ${cfg.level} DE ${TOTAL_ROUNDS}`, 95);
    this.copy(ctx, cfg.message, 145, "#bdb0b6");

    // Barra de tiempo
    const progress = Math.max(0, this.timer / cfg.timeLimit);
    ctx.fillStyle = "#362a3f";
    ctx.fillRect(230, 475, 500, 16);
    ctx.fillStyle = progress > 0.3 ? "#f3c46b" : "#c95b74";
    ctx.fillRect(230, 475, 500 * progress, 16);
    ctx.strokeStyle = "rgba(211, 166, 88, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(230, 475, 500, 16);

    // Dibujar cartas
    this.cards.forEach((card) => {
      // Si parpadea y la carta no está volteada ni emparejada
      if (cfg.blink && !this.isBoardVisible && !card.isFlipped && !card.isMatched) {
        return;
      }
      this.drawCard(ctx, card);
    });
  }

  drawCard(ctx, card) {
    // Si ya está emparejada
    if (card.isMatched) {
      ctx.fillStyle = "#2d4535";
      ctx.fillRect(card.x, card.y, card.w, card.h);
      ctx.strokeStyle = "#5b9c70";
      ctx.lineWidth = 3;
      ctx.strokeRect(card.x, card.y, card.w, card.h);

      ctx.fillStyle = "#ffffff";
      ctx.font = "46px Georgia, serif";
      ctx.textBaseline = "middle";
      ctx.fillText(card.rune, card.x + card.w / 2, card.y + card.h / 2);
      ctx.textBaseline = "alphabetic";
      return;
    }

    // Si está volteada (mostrando cara)
    if (card.isFlipped) {
      ctx.fillStyle = "#4a3044";
      ctx.fillRect(card.x, card.y, card.w, card.h);
      ctx.strokeStyle = "#f3c46b";
      ctx.lineWidth = 4;
      ctx.strokeRect(card.x, card.y, card.w, card.h);

      ctx.fillStyle = "#f3c46b";
      ctx.font = "46px Georgia, serif";
      ctx.textBaseline = "middle";
      ctx.fillText(card.rune, card.x + card.w / 2, card.y + card.h / 2);
      ctx.textBaseline = "alphabetic";
      return;
    }

    // Si está boca abajo (reverso)
    ctx.fillStyle = "#2a1f33";
    ctx.fillRect(card.x, card.y, card.w, card.h);
    ctx.strokeStyle = "rgba(211, 166, 88, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(card.x, card.y, card.w, card.h);

    // Sello del reino en el reverso
    ctx.fillStyle = "#d3a658";
    ctx.font = "28px Georgia, serif";
    ctx.textBaseline = "middle";
    ctx.fillText("✦", card.x + card.w / 2, card.y + card.h / 2);
    ctx.textBaseline = "alphabetic";
  }

  drawResult(ctx) {
    this.title(ctx, "RESULTADO OFICIAL", 130);
    ctx.fillStyle = "#f3c46b";
    ctx.font = "bold 34px Cinzel, Georgia, serif";
    ctx.fillText(`INTELIGENCIA  ${this.score} / 20`, 480, 220);

    let verdict = "";
    if (this.score <= 2) verdict = "Tu memoria es como la de un pez hervido.";
    else if (this.score <= 4) verdict = "Apenas recuerdas lo que cenaste ayer.";
    else if (this.score === 5) verdict = "¡Casas de Magos! La Niebla del Grimorio te ha confundido.";
    else if (this.score <= 9) verdict = "¡MENTE PRODIGIOSA! Has emparejado todo el Registro.";
    else verdict = "¡ARCHIMAGO SUPREMO! El Consejo solicita tu sabiduría.";

    this.copy(ctx, verdict, 290, this.score >= 6 ? "#f3c46b" : "#f7ead0");
    this.copy(ctx, "Pulsa ESPACIO, CLIC o TOCA para volver a las pruebas.", 395, "#bdb0b6");
  }
}


