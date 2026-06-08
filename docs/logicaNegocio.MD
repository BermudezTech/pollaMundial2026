# Lógica de Negocio - App de Polla Mundial ⚽🏆

Este documento contiene la especificación completa para el desarrollo de la aplicación de polla (quiniela). Define la estructura del torneo, las reglas de puntuación y el modelo de datos.

## 1. Estructura y Funcionamiento del Torneo

El torneo se divide en dos grandes etapas: la Fase de Grupos y la Fase de Eliminación Directa.

### A. Fase de Grupos

- **Formato:** 8 grupos de 4 equipos (Grupos A al H).

- **Regla de juego:** Se permiten los **empates**. Los partidos se definen a los 90 minutos reglamentarios.

- **Clasificación:** Los 2 equipos con mayor puntaje de cada grupo avanzan a Octavos de Final.

### B. Fase de Eliminación Directa

- **Fases:** Octavos de Final, Cuartos de Final, Semifinales, Tercer Puesto y Gran Final.

- **Regla de juego:** **NO existen los empates**. Si hay empate en el tiempo reglamentario (o prórroga), el partido se define por penaltis.

- **Lógica de Llaves (Bracket):** Los enfrentamientos se definen de forma automática mediante marcadores de posición (*placeholders*):

  - **Octavos:** Cruzado directo entre grupos (ej. `1º Grupo A` vs `2º Grupo B`).

  - **Cuartos en adelante:** Conexión directa de ganadores anteriores (ej. `Ganador Octavos 1` vs `Ganador Octavos 2`).

  - **Final y Tercer Puesto:** Los ganadores de semifinales van a la Gran Final; los perdedores juegan por el Tercer Puesto.

## 2. Sistema de Puntuación (Reglas de la Polla)

Los puntos que suma un usuario se calculan de manera **excluyente** (se asigna únicamente el puntaje más alto alcanzado en un solo partido).

<table style="min-width: 75px;">
<colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Situación</p></th><th colspan="1" rowspan="1"><p>Puntos</p></th><th colspan="1" rowspan="1"><p>Descripción / Ejemplo</p></th></tr><tr><td colspan="1" rowspan="1"><p><strong>Marcador Exacto</strong></p></td><td colspan="1" rowspan="1"><p><strong>5</strong></p></td><td colspan="1" rowspan="1"><p>El usuario acertó el resultado idéntico del partido.</p><p></p><p><em>Ejemplo: Real:</em> $2 - 1$ <em>| Predicción:</em> $$2 -$</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Ganador/Empate + Diferencia</strong></p></td><td colspan="1" rowspan="1"><p><strong>3</strong></p></td><td colspan="1" rowspan="1"><p>Acertó el ganador y la diferencia exacta de goles, pero no el marcador.</p><p></p><p><em>Ejemplo: Real:</em> $2 - 1$ <em>(diferencia </em>$+1$<em>) | Predicción:</em> $$3 -$ <em>(diferencia </em>$$+$<em>)</em></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Ganador o Empate Seco</strong></p></td><td colspan="1" rowspan="1"><p><strong>2</strong></p></td><td colspan="1" rowspan="1"><p>Acertó quién ganaba o que empataban, pero falló la diferencia y los goles.</p><p></p><p><em>Ejemplo: Real:</em> $2 - 1$ <em>| Predicción:</em> $$1 -$</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Acierto de Goles Individual</strong></p></td><td colspan="1" rowspan="1"><p><strong>1</strong></p></td><td colspan="1" rowspan="1"><p>No acertó el ganador ni el empate, pero adivinó la cantidad exacta de goles de uno de los dos equipos.</p><p></p><p><em>Ejemplo: Real:</em> $0 - 2$ <em>| Predicción:</em> $$1 -$ <em>(acertó los </em>$$$<em> goles del visitante)</em></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Sin Aciertos</strong></p></td><td colspan="1" rowspan="1"><p><strong>0</strong></p></td><td colspan="1" rowspan="1"><p>No se cumple ninguna de las condiciones anteriores.</p></td></tr></tbody>
</table>

### 🥅 Regla Especial para Penaltis (Octavos de Final en adelante)

- En fase de eliminación directa, el usuario debe predecir un marcador de fútbol (ej. $1 - 1$) y, adicionalmente, **seleccionar obligatoriamente qué equipo clasifica** (`LOCAL` o `VISITANTE`).

- Si el partido real termina en empate y se define en penaltis:

  - El marcador oficial de la polla para el cálculo de goles es el del tiempo de juego (ej. $1 - 1$).

  - Si el usuario acertó qué equipo clasificaba a la siguiente ronda, se le otorgan **2 puntos** (equivalente a "Ganador Seco" por haber acertado el desenlace final del encuentro).