### Tabla: `Usuarios`

Guarda el perfil del usuario y sus credenciales de acceso.

- `id` (UUID / Primary Key)

- `nombre` (VARCHAR)

- `email` (VARCHAR, Único)

- `contraseña_hash` (VARCHAR) — *Almacena la contraseña cifrada para seguridad.*

### Tabla: `Fases`

Clasifica las etapas del torneo y define sus reglas.

- `id` (INT / Primary Key)

- `nombre` (VARCHAR) — *Ej: "Grupo A", "Octavos de Final", "Final"*

- `permite_empate` (BOOLEAN) — `TRUE` *en grupos,* `FALSE` *en eliminación directa.*

### Tabla: `Partidos`

El calendario real de partidos administrado por la plataforma.

- `id` (INT / Primary Key)

- `fase_id` (INT / Foreign Key -&gt; Fases)

- `equipo_a_placeholder` (VARCHAR) — *Ej: "1º Grupo A"*

- `equipo_b_placeholder` (VARCHAR) — *Ej: "2º Grupo B"*

- `equipo_a_real` (VARCHAR, Nullable) — *Ej: "Argentina"*

- `equipo_b_real` (VARCHAR, Nullable) — *Ej: "Francia"*

- `goles_a` (INT, Nullable)

- `goles_b` (INT, Nullable)

- `clasifica_real` (VARCHAR, Nullable) — `"A"` *o* `"B"` *(para desempates por penaltis).*

- `fecha_hora` (DATETIME / TIMESTAMP) — *Fecha y hora de inicio del partido para bloquear predicciones a tiempo.*

- `estado` (VARCHAR) — *Valores:* `"PROGRAMADO"`*,* `"EN_VIVO"`*,* `"FINALIZADO"`

### Tabla: `Predicciones`

Las apuestas realizadas por cada usuario para cada partido.

- `id` (UUID / Primary Key)

- `usuario_id` (UUID / Foreign Key -&gt; Usuarios)

- `partido_id` (INT / Foreign Key -&gt; Partidos)

- `prediccion_goles_a` (INT)

- `prediccion_goles_b` (INT)

- `prediccion_clasifica` (VARCHAR, Nullable) — `"A"` *o* `"B"` *(obligatorio en eliminación directa).*

- `puntos_ganados` (INT, Default: 0) — *Se calcula y actualiza cuando el partido pasa a* `"FINALIZADO"`.