import { ScrollText, Trophy, Coins, AlertCircle } from 'lucide-react';

export default function Reglas() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <ScrollText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-black text-foreground tracking-tight">Reglas de la Polla</h1>
        </div>
        <p className="text-muted-foreground">Sistema de puntuación y distribución de premios.</p>
      </div>

      {/* Prize Pool Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border bg-muted/30 flex items-center gap-3">
          <Coins className="text-yellow-500 w-6 h-6" />
          <h2 className="text-xl font-bold text-foreground">Bolsa de Premios (Prize Pool)</h2>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-foreground leading-relaxed">
            Cada jugador realiza un aporte de <span className="font-bold text-emerald-500">100.000 COP</span> al inicio del torneo.
            Actualmente somos <span className="font-bold">8 participantes</span>, por lo que el pozo total acumulado es de <span className="font-bold text-emerald-500">800.000 COP</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center shadow-sm">
              <Trophy className="text-yellow-500 w-8 h-8" />
              <div className="text-muted-foreground font-medium text-sm">Primer Puesto</div>
              <div className="text-2xl font-black text-foreground">450.000 COP</div>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center shadow-sm">
              <Trophy className="text-neutral-400 w-8 h-8" />
              <div className="text-muted-foreground font-medium text-sm">Segundo Puesto</div>
              <div className="text-2xl font-black text-foreground">200.000 COP</div>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center shadow-sm">
              <Trophy className="text-amber-700 w-8 h-8" />
              <div className="text-muted-foreground font-medium text-sm">Tercer Puesto</div>
              <div className="text-2xl font-black text-foreground">150.000 COP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring System Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border bg-muted/30 flex items-center gap-3">
          <AlertCircle className="text-primary w-6 h-6" />
          <h2 className="text-xl font-bold text-foreground">Sistema de Puntuación</h2>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground mb-6">
            Los puntos se calculan de manera <span className="font-bold text-foreground">excluyente</span>. Se te asignará únicamente el puntaje más alto que logres alcanzar por cada partido.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-muted/50 text-foreground text-sm font-bold border-b border-border">
                  <th className="px-4 py-3">Situación</th>
                  <th className="px-4 py-3 text-center">Puntos</th>
                  <th className="px-4 py-3">Descripción y Ejemplo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-4 font-bold text-primary">Marcador Exacto</td>
                  <td className="px-4 py-4 text-center font-black text-lg">5</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    Acertaste el resultado idéntico del partido.<br />
                    <span className="italic text-xs">Ej: Real (2 - 1) | Tu Predicción (2 - 1)</span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-4 font-bold text-primary">Ganador o Empate Seco</td>
                  <td className="px-4 py-4 text-center font-black text-lg">3</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    Acertaste quién ganaba o si empataban, pero fallaste el marcador exacto.<br />
                    <span className="italic text-xs">Ej: Real (2 - 1) | Tu Predicción (1 - 0)</span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-4 font-bold text-primary">Acierto de Goles Individual</td>
                  <td className="px-4 py-4 text-center font-black text-lg">1</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    Fallaste ganador y empate, pero adivinaste la cantidad exacta de goles de uno de los equipos.<br />
                    <span className="italic text-xs">Ej: Real (0 - 2) | Tu Predicción (1 - 2) (Acertaste los 2 goles del visitante)</span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-4 font-bold text-muted-foreground">Sin Aciertos</td>
                  <td className="px-4 py-4 text-center font-black text-lg text-muted-foreground">0</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    No se cumple ninguna de las condiciones anteriores.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-primary/10 border border-primary/20 rounded-xl p-5">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
              ⚽ Regla Especial para Penaltis (Dieciseisavos en adelante)
            </h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>En fases de eliminación no hay empates reales, pero debes predecir un marcador (ej. 1 - 1) y <strong>seleccionar qué equipo clasifica</strong>.</li>
              <li>El marcador para cálculo de goles será el del tiempo reglamentario (ej. 1 - 1).</li>
              <li>Si aciertas qué equipo clasificaba por penaltis, se te otorgan <strong>2 puntos</strong> adicionales.</li>
            </ul>
          </div>

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">
            <h3 className="font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-2 mb-2">
              ⭐ Puntos de Bonus (Fase Eliminatoria - Dieciseisavos en adelante)
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Estos bonus adicionales se aplican acumulativamente únicamente a partir de la fase de dieciseisavos de final en adelante:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>
                <strong className="text-foreground">Goles Individuales en Ganador Seco (+1 pt):</strong> Si aciertas el ganador (3 pts base) y la cantidad exacta de goles de al menos uno de los dos equipos, recibes <span className="font-semibold text-primary">+1 punto de bonus</span>. <span className="italic text-xs text-muted-foreground">(No aplica en Marcador Exacto de 5 pts).</span>
              </li>
              <li>
                <strong className="text-foreground">Arco Invicto (+1 pt):</strong> Si aciertas el ganador y el equipo perdedor se queda en 0 goles, recibes <span className="font-semibold text-primary">+1 punto de bonus</span>.
              </li>
              <li>
                <strong className="text-foreground">Marcador Único (+2 pts):</strong> Si aciertas el Marcador Exacto (5 pts base) y eres el <strong>único participante</strong> de la polla que predijo ese resultado exacto, recibes <span className="font-semibold text-primary">+2 puntos de bonus</span>.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
