# Heroic Failure

## Concepto

**Heroic Failure** es un RPG 2D satírico. Antes de empezar la aventura, el jugador no reparte puntos: debe demostrar mediante minijuegos qué clase de héroe (o de inútil) es.

El resultado de esas pruebas forma la ficha inicial del personaje. Con ella, el jugador intenta elegir una clase y juega después una aventura breve de estética y estructura cercanas a un *Zelda* clásico.

El fracaso no debe sentirse como una pantalla de error: debe abrir opciones cómicas y clases alternativas absurdas.

## Tono

- Humor satírico, seco y autoconsciente.
- Los mensajes deben reaccionar a los resultados del jugador, especialmente a los malos.
- Una clase no disponible no termina la elección: deriva en alternativas ridículas con valor jugable y narrativo.
- Ser excepcionalmente malo puede llegar a desbloquear clases especiales.

## Atributos

Los atributos definitivos para V0.1 son:

1. Fuerza
2. Destreza
3. Constitución
4. Inteligencia
5. Agilidad

Carisma queda excluido: no añade suficiente a una aventura corta. Percepción tampoco forma parte del conjunto inicial; sus posibles usos quedan cubiertos por Inteligencia y Agilidad.

Destreza mide precisión, sincronización y control fino. Agilidad mide velocidad de movimiento, esquiva, sigilo y la capacidad de cruzar peligros rápidos.

Ejemplo de ficha deseada:

```text
FUERZA        13
DESTREZA       4
CONSTITUCIÓN   9
INTELIGENCIA  12
AGILIDAD       7
```

## Pruebas de creación

Cada atributo se obtiene en una prueba jugable; no se asignan puntos manualmente.

Las pruebas deben aumentar progresivamente de dificultad. Las puntuaciones altas deben ser poco frecuentes: obtener un valor de 18 debe ser extraordinario.

### Ejemplo: prueba de Destreza

Una barra horizontal contiene una zona de acierto y un indicador móvil. El jugador debe detenerlo dentro de la zona.

- Nivel 1: zona amplia y fácil.
- Desde el nivel 2: la ventana se encoge y el indicador acelera de forma agresiva.
- Nivel 20: prácticamente absurdo.

No alcanzar determinados niveles deja una puntuación baja. Para V0.1, la prueba usa una escala de 1 a 20, inspirada en un d20: fallar antes del primer acierto da 1; cada éxito permite avanzar un punto hasta 20. Superar los 20 niveles debe ser extraordinariamente raro.

## Clases

Las clases normales tienen requisitos de atributos. Ejemplo:

```text
BÁRBARO
FUERZA >= 14
CONSTITUCIÓN >= 12
```

Si el jugador no cumple los requisitos, recibe una respuesta humorística y se le ofrecen alternativas, en lugar de un bloqueo sin salida.

Ejemplo de alternativa:

```text
No puedes ser bárbaro.
Vaya.
No puedes ser bárbaro.
Pero puedes ser campesino con lepra.
```

Pendiente definir:

- Lista de clases normales.
- Requisitos de cada clase.
- Lista de clases absurdas y sus condiciones.
- Clases desbloqueadas por resultados especialmente malos.
- Efecto jugable de cada clase.

## Aventura

Tras crear el personaje, el jugador entra en una aventura 2D corta.

Elementos previstos:

- Mundo 2D sobre Canvas.
- Movimiento.
- Enemigos.
- Cofres.
- Puertas y llaves.
- Puzles.
- Comprobaciones de atributos durante la aventura.
- Combate sencillo.
- Entre 3 y 5 niveles aproximadamente.

La duración objetivo es una partida corta. La historia, los niveles concretos, los enemigos y la forma precisa de combate aún no están definidos.

## Tecnología y arquitectura

- HTML, CSS y JavaScript puro.
- Sin Unity, Godot ni framework inicial.
- Canvas para el renderizado y un mini motor 2D propio.

Estructura objetivo:

```text
engine/       # Bucle, Canvas, renderizado, entrada, colisiones y utilidades base.
character/    # Ficha del personaje, atributos y clases.
challenges/   # Minijuegos de creación de personaje.
game/         # Aventura: estados, niveles, entidades y reglas jugables.
ui/           # Pantallas, HUD, menús y diálogos.
data/         # Datos declarativos del juego.
```

Datos previstos:

```text
data/
  attributes.json
  classes.json
  enemies.json
  levels.json
  messages.json
```

El motor, la lógica RPG y los datos del juego deben mantenerse separados.

## Enfoque de desarrollo

Se construirá de forma incremental:

1. Crear el esqueleto del proyecto.
2. Implementar una única prueba de atributo y validarla jugablemente.
4. Añadir las demás pruebas una a una.
5. Conectar la ficha resultante con clases y, después, con la aventura.

V0.1 empieza con Destreza: su prueba de indicador móvil es clara, rápida de probar y valida el flujo de creación de personaje.

El flujo de V0.1 es: Nueva partida, nombre del personaje, elección de prueba y prueba de Destreza. Mientras solo exista una prueba, la pantalla de elección la mostrará como única opción disponible para conservar el flujo que usarán las demás.
