import { useState, useMemo } from 'react';
import { mockFases, mockMatches } from '../services/mockData';
import { CalendarClock } from 'lucide-react';

export default function Fases() {
  const [selectedFaseId, setSelectedFaseId] = useState<number>(mockFases[0].id);

  const selectedFase = useMemo(() => mockFases.find(f => f.id === selectedFaseId), [selectedFaseId]);
  const phaseMatches = useMemo(() => mockMatches.filter(m => m.fase_id === selectedFaseId), [selectedFaseId]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Fases y Partidos</h1>
        <p className="text-muted-foreground">Predice los resultados de cada partido.</p>
      </div>

      {/* Tabs / Select for Mobile */}
      <div className="bg-card border border-border rounded-xl p-3 flex flex-wrap gap-2 justify-center">
        {mockFases.map((fase) => (
          <button
            key={fase.id}
            onClick={() => setSelectedFaseId(fase.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFaseId === fase.id 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {fase.nombre}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="flex-1 bg-background rounded-2xl flex justify-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {phaseMatches.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No hay partidos simulados para esta fase todavía.
            </div>
          ) : (
            phaseMatches.map((match) => (
              <div key={match.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
                {/* Match Header */}
                <div className="bg-muted/50 px-4 py-3 border-b border-border flex justify-between items-center text-sm">
                  <span className="font-semibold text-foreground">{selectedFase?.nombre}</span>
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-md font-medium">
                    <CalendarClock className="w-4 h-4" />
                    <span>{new Date(match.fecha_hora).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Match Body */}
                <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
                  {/* Team A */}
                  <div className="flex flex-1 flex-col items-center gap-3 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center font-black text-xl text-primary shadow-inner">
                      {match.equipo_a.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="text-lg font-bold text-foreground text-center leading-tight truncate w-full px-2">{match.equipo_a}</span>
                  </div>

                  {/* Score Inputs */}
                  <div className="flex items-center gap-3 shrink-0 bg-muted/30 px-4 py-3 rounded-2xl border border-border shadow-inner w-full sm:w-auto justify-center z-20">
                    <input 
                      type="number" 
                      min="0"
                      className="w-14 h-14 bg-background border border-border rounded-xl text-center text-2xl font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
                      placeholder="0"
                    />
                    <div className="bg-muted border border-border text-muted-foreground font-black text-xs px-2 py-1 rounded-md">
                      VS
                    </div>
                    <input 
                      type="number" 
                      min="0"
                      className="w-14 h-14 bg-background border border-border rounded-xl text-center text-2xl font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
                      placeholder="0"
                    />
                  </div>

                  {/* Team B */}
                  <div className="flex flex-1 flex-col items-center gap-3 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center font-black text-xl text-primary shadow-inner">
                      {match.equipo_b.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="text-lg font-bold text-foreground text-center leading-tight truncate w-full px-2">{match.equipo_b}</span>
                  </div>
                </div>
                
                {/* Match Footer */}
                <div className="px-6 py-4 bg-card border-t border-border">
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-colors">
                    Guardar Predicción
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
