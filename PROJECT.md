# Heroic Failure — Documentación del Proyecto

## 🎯 Visión del Juego
Un RPG satírico donde el aspirante a héroe fracasa estrepitosamente en las pruebas de admisión del Gremio antes de ser asignado a clases absurdas.

---

## 🎨 Reglas de Estilo Visual y UI
1. **Estrictamente Prohibido el uso de Emojis:** Todo elemento gráfico debe utilizar iconos SVG, assets vectoriales o ilustraciones reales.
2. **Alto Contraste Obligatorio:** Texto oscuro sobre fondos pergamino o texto claro sobre losetas oscuras. Prohibido texto dorado sobre fondo amarillo.
3. **Cartas RPG Coleccionables:** Plantillas estilo *Hearthstone* con imagen en 4:3, cabecera dorada y pergamino satírico.
4. **Modal Gótica del Juego:** Cero `alert()` nativos del navegador.

---

## 🖼️ Prompts e Ilustraciones para Cartas (Guardar en `assets/images/classes/`)
- **Fuentes Recomendadas:** [OpenGameArt.org](https://opengameart.org) (Arte 2D RPG) e [Itch.io Fantasy Assets](https://itch.io/game-assets/free/tag-fantasy) (Packs de retratos de cartas RPG). (Unsplash NO sirve por ser fotografía de stock real).
- **Caballero Real (`knight.jpg`):** `Hearthstone style RPG card illustration of a noble knight standing in polished gold plate armor, holding a broadsword, heroic pose, dark castle background, detailed fantasy digital painting, 4:3 aspect ratio`
- **Archimago Supremo (`mage.jpg`):** `Hearthstone style RPG card concept art of a powerful archmage in dark purple arcane robes, holding a crystal staff, summoning magic energy, 4:3 aspect ratio`
- **Bárbaro (`barbarian.jpg`):** `Hearthstone style RPG card art of a fierce barbarian warrior with double-bitted axe in snowstorm, 4:3 aspect ratio`
- **Pícaro (`rogue.jpg`):** `Hearthstone style RPG card concept art of a hooded rogue assassin emerging from shadows, twin daggers, 4:3 aspect ratio`
- **Leproso Afortunado (`leper.jpg`):** `Hearthstone style humorous RPG card illustration of a lucky scruffy peasant covered in tattered bandages, comic fantasy art style, 4:3 aspect ratio`

El fracaso no es una pantalla de error; es la esencia del juego. Sacar notas nefastas desbloquea clases absurdas, veredictos satíricos y opciones narrativas únicas.

---

## 2. Reglas de Diseño e Interfaz (MANDATORIAS)

### ⛔ PROHIBICIÓN ABSOLUTA DE EMOJIS
- **NUNCA usar emojis unicode** (`🧙`, `🪣`, `🔮`, `📜`, `🔑`, `🧪`, `👑`, `💎`, `❤️❤️❤️`, etc.) en controles, botones ni gráficos del juego.
- **Motivo:** Los emojis restan seriedad al apartado gráfico y se perciben como cutres.
- **Estándar:** Toda la interfaz debe utilizar **componentes HTML/CSS vectoriales limpios**, SVGs estilizados o archivos de arte dedicados (`assets/images/...`).

### 🏛️ Tono y Burocracia del Gremio
- Humor satírico, seco, burocrático y autoconsciente.
- Los examinadores sabotean activamente al aspirante y se mofan de sus fallos.
- **Sin repetición de pruebas (CRÍTICO):** Una vez evaluado un atributo, la nota queda registrada en la ficha (de 0 a 20), el botón del expediente muestra `COMPLETADO` y queda **deshabilitado permanentemente**. No hay segundas oportunidades.
- **Nota 0 es una nota válida:** Si el aspirante cae en la primera ronda, saca `0 / 20` y la prueba cuenta como finalizada y registrada en el expediente.
- **Protección contra saltos accidentales:** Cada pantalla de resultado incluye un cooldown de **600 ms** antes de aceptar clics o toques para volver al expediente.

### 🎨 Estilo Visual y Componentes UI
- **Mobile-First & Responsive:** Todas las pantallas usan posicionamiento adaptable (`position: absolute; inset: 0; display: grid; place-items: center`).
- **Panel Gótico Glassmorphism:** Fondo gótico oscuro `rgba(22, 16, 28, 0.88)` con `backdrop-filter: blur(10px)` y borde dorado `rgba(211, 166, 88, 0.3)`.
- **Tipografía:** Fuente *Cinzel* para títulos y números de cuenta atrás.
- **Números Gigantes de Transición:** Durante `countdown` y `level_transition`, el número de la cuenta atrás utiliza `clamp(3.5rem, 12vw, 6.5rem)` con la animación de rebote `countdown-pop`.
- **Pie de Pantalla Estandarizado:** Muestra `<span id="...-level">Nivel X</span>` e `<span id="...-score">X / 20</span>`.

---

## 3. Las 5 Pruebas del Gremio

Las 5 pruebas están completamente integradas como módulos HTML/CSS dedicados:

### 🎯 1. Destreza (`DexterityScreen`)
- **Mecánica:** Barra de precisión horizontal con indicador en movimiento constante.
- **Objetivo:** Pulsa en el momento exacto en que el cursor cruce la zona dorada.
- **Dificultad:** La zona dorada encoge, acelera, se desplaza por la barra y aparecen señuelos falsos en niveles altos.

### 🫀 2. Constitución (`ConstitutionScreen`)
- **Mecánica:** Medidor de pulso / resistencia vertical.
- **Objetivo:** Pulsa de forma rítmica para mantener la aguja de pulso dentro de la zona verde antes de que se agote el tiempo del temporizador.
- **Dificultad:** La zona verde se desplaza, encoge y la aguja gana inercia resbaladiza.

### 🏋️ 3. Fuerza (`StrengthScreen`)
- **Mecánica:** Medidor de carga y soltado horizontal.
- **Objetivo:** Mantén pulsado para cargar la barra de energía y **suelta exactamente** dentro de la zona dorada.
- **Dificultad:** Carga ultra-rápida, zonas móviles y rebote de sobrecarga.

### 🏃 4. Agilidad (`AgilityScreen`)
- **Mecánica:** Almacén de barriles en 3 carriles verticales (Izquierda, Centro, Derecha). Toca un carril para moverte a él.
- **Objetivo:** Esquiva las oleadas de barriles de roble que caen desde arriba.
- **Dificultad:**
  - *Desde Nivel 1:* Caída de 2 barriles simultáneos dejando un único carril seguro.
  - *Niveles 6+:* **Barriles Drifting** que cambian de carril a mitad de caída (resplandor naranja pulsante).
  - *1 solo impacto:* Fin inmediato de la prueba.

### 🧠 5. Inteligencia (`IntelligenceScreen`)
- **Mecánica:** *"El Archivista Corrupto"* — Juego Simon Says con sabotajes deliberados en un mazo de 6 medallas con runas SVG (Sol, Luna, Estrella, Ojo, Gema, Corona) sin textos.
- **Dificultad y Sabotajes:**
  - *Nivel 1:* Memorización básica de 3 runas.
  - *Nivel 2 (Putada 1):* **Trampas Rojas** (sellos rojos intercalados que NO deben pulsarse).
  - *Nivel 3 (Putada 2):* **Mezcla (Shuffle)** (las medallas cambian de sitio en la pantalla tras la demostración).
  - *Nivel 4 (Putada 3):* **Inversión** ("¡Repítela AL REVÉS!", del final al principio).
  - *Nivel 5 (Putada 4):* **Cartas Boca Abajo (Blind)** (las baldosas se dan la vuelta y se tapan al llegar tu turno).
  - *Niveles 6-20:* **Caos Supremo** combinando trampas rojas + mezcla + orden inverso + cartas boca abajo a velocidad máxima.

---

## 4. Estructura de Ficheros y Código

- `index.html`: Estructura principal con las 5 secciones de pruebas y el expediente de admisión.
- `styles.css`: Sistema de diseño unificado, tokens visuales, animaciones (`countdown-pop`, `agility-player-shake`, `tile-shake`) y layouts responsive.
- `game/main.js`: Orquestador principal, flujo entre menús, expediente y pantallas de pruebas.
- `ui/`:
  - `dexterity-screen.js`
  - `constitution-screen.js`
  - `strength-screen.js`
  - `agility-screen.js`
  - `intelligence-screen.js`
  - `guild-report.js`
  - `start-menu.js`
- `assets/images/runes/`: Arte vectorial SVG para las 6 runas de inteligencia (`rune-sun.svg`, `rune-moon.svg`, `rune-star.svg`, `rune-eye.svg`, `rune-gem.svg`, `rune-crown.svg`).
- `character/character-sheet.js`: Registro de los 5 atributos del personaje.
