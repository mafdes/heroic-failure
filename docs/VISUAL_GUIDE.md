# Guia visual de Heroic Failure

## Concepto principal

El juego ocurre dentro del Gremio de Aventureros. Cada prueba es una sala distinta, pero todas deben parecer parte del mismo edificio: archivo oscuro, tribunal decadente, burocracia fantastica y humor seco.

La interfaz no debe sentirse como pantallas flotando sobre un fondo vacio. Siempre debe existir una de estas tres capas:

1. **Escenario base del gremio:** fondo comun dentro de `.game-frame`.
2. **Sala concreta:** imagen propia de la prueba cuando la pantalla representa una estancia especifica.
3. **Mesa o expediente:** soporte visual para documentos, fichas, clase y decisiones del tribunal.

## Jerarquia de fondos

Cada pantalla debe seguir este orden visual:

1. Fondo ambiental.
2. Overlay oscuro con vineta para unificar contraste.
3. Sombra baja o apoyo visual para que el panel no flote.
4. Panel o pergamino principal.
5. Controles y feedback del minijuego.

Las pruebas pueden tener fondos diferentes, pero el overlay, el borde dorado, la sombra y la densidad del panel deben repetirse.

## Reglas para nuevas salas

- Usar una imagen de fondo en `assets/images/challenges/` si la pantalla es una prueba jugable.
- Mantener el panel principal con borde dorado, fondo oscuro translúcido y sombra profunda.
- No dejar pantallas con `background: transparent` si no hay una capa base visible debajo.
- Reservar pergamino para documentos oficiales: expediente, veredictos, dictamen de admision.
- Mantener los botones como controles del gremio: dorados para acciones principales, oscuros para secundarias.
- Evitar emojis en UI final; usar SVG, CSS o imagen dedicada.

## Precarga de assets

Los assets criticos se declaran en `engine/asset-loader.js`.

Debe incluir:

- Fondos de pruebas.
- Pergamino del expediente.
- Iconos de clase usados al inicio.
- Runas de inteligencia.
- Iconos interactivos visibles antes de la primera prueba.

Si se anade una nueva sala con fondo propio, debe agregarse a `CRITICAL_ASSETS` para que no aparezca tarde durante el cambio de pantalla.

## Pantallas actuales

- **Menu:** vive dentro del escenario base del gremio.
- **Expediente:** documento sobre archivo/sala del tribunal, nunca sobre vacio.
- **Destreza, Fuerza, Constitucion, Agilidad, Inteligencia:** salas de examen con fondo propio y marco comun.
- **Seleccion de clase:** tribunal/archivo arcano usando el fondo comun de inteligencia hasta que exista arte propio.
- **Proximamente:** comunicado oficial del gremio sobre el mismo entorno del tribunal.
