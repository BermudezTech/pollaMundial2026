import { useState, useMemo } from 'react';
import { mockFases, getSavedMatches, saveSavedMatches, calculateMatchPoints } from '../services/mockData';
import { CalendarClock, ChevronDown, ChevronUp, Users, Lock } from 'lucide-react';

function calculatePoints(realA: number, realB: number, predA: number, predB: number): number {
  return calculateMatchPoints(realA, realB, predA, predB);
}

const getPlayerPredictionsForMatch = (matchId: number, scoreA: number, scoreB: number) => {
  if (matchId === 2) {
    return [
      { name: 'Carlos Díaz', predA: 1, predB: 1 },
      { name: 'Ana Gómez', predA: 0, predB: 0 },
      { name: 'Pedro Sánchez', predA: 2, predB: 1 },
      { name: 'Luis Martínez', predA: 1, predB: 2 },
      { name: 'Marta Ríos', predA: 0, predB: 0 },
      { name: 'Juan Pérez', predA: 1, predB: 1 },
      { name: 'Sofía Torres', predA: 2, predB: 0 },
      { name: 'Diego Gómez', predA: 0, predB: 1 },
    ];
  }

  return [
    { name: 'Carlos Díaz', predA: 2, predB: 1 },
    { name: 'Ana Gómez', predA: 1, predB: 0 },
    { name: 'Pedro Sánchez', predA: 0, predB: 2 },
    { name: 'Luis Martínez', predA: 2, predB: 0 },
    { name: 'Marta Ríos', predA: 1, predB: 1 },
    { name: 'Juan Pérez', predA: 3, predB: 1 },
    { name: 'Sofía Torres', predA: 0, predB: 0 },
    { name: 'Diego Gómez', predA: 2, predB: 2 },
  ];
};

export default function Fases() {
  const [selectedFaseId, setSelectedFaseId] = useState<number>(mockFases[0].id);
  const [expandedMatches, setExpandedMatches] = useState<Record<number, boolean>>({});
  const [matches, setMatches] = useState(() => getSavedMatches());

  const selectedFase = useMemo(() => mockFases.find(f => f.id === selectedFaseId), [selectedFaseId]);
  const phaseMatches = useMemo(() => matches.filter(m => m.fase_id === selectedFaseId), [selectedFaseId, matches]);

  const toggleDetails = (matchId: number) => {
    setExpandedMatches(prev => ({ ...prev, [matchId]: !prev[matchId] }));
  };

  const handleSavePrediction = (matchId: number, predAStr: string, predBStr: string) => {
    const predA = predAStr === '' ? null : parseInt(predAStr);
    const predB = predBStr === '' ? null : parseInt(predBStr);

    const updated = matches.map(m => {
      if (m.id === matchId) {
        // If match is finished, we don't allow prediction change normally, but update points if applicable
        let puntos_ganados = undefined;
        if (m.estado === 'FINALIZADO' && m.score_a !== null && m.score_b !== null && predA !== null && predB !== null) {
          puntos_ganados = calculatePoints(m.score_a!, m.score_b!, predA, predB);
        }
        return { ...m, user_pred_a: predA, user_pred_b: predB, puntos_ganados };
      }
      return m;
    });

    setMatches(updated);
    saveSavedMatches(updated);
    alert('Predicción guardada correctamente.');
  };

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
              <div key={match.id} className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
                {/* Lock Overlay for Playoff Stages */}
                {selectedFaseId >= 13 && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px] z-30 flex flex-col items-center justify-center text-center p-6 select-none">
                    <div className="bg-card/90 border border-border rounded-2xl p-6 shadow-xl max-w-xs flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                      <h3 className="font-bold text-foreground">Fase No Activa</h3>
                      <p className="text-xs text-muted-foreground leading-normal">
                        Esta fase aún no está disponible para predicciones. Se activará cuando finalice la fase de grupos.
                      </p>
                    </div>
                  </div>
                )}

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

                  {/* Score Display (Programado vs Finalizado) */}
                  {match.estado === 'PROGRAMADO' ? (
                    <div className="flex items-center gap-3 shrink-0 bg-muted/30 px-4 py-3 rounded-2xl border border-border shadow-inner w-full sm:w-auto justify-center z-20">
                      <input 
                        type="number" 
                        min="0"
                        id={`pred-a-${match.id}`}
                        defaultValue={match.user_pred_a ?? ''}
                        className="w-14 h-14 bg-background border border-border rounded-xl text-center text-2xl font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
                        placeholder="0"
                      />
                      <div className="bg-muted border border-border text-muted-foreground font-black text-xs px-2 py-1 rounded-md">
                        VS
                      </div>
                      <input 
                        type="number" 
                        min="0"
                        id={`pred-b-${match.id}`}
                        defaultValue={match.user_pred_b ?? ''}
                        className="w-14 h-14 bg-background border border-border rounded-xl text-center text-2xl font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
                        placeholder="0"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 shrink-0 z-20">
                      {/* Marcador Real */}
                      <div className="flex items-center gap-4 bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20 shadow-inner w-full sm:w-auto justify-center">
                        <div className="flex items-center justify-center text-4xl font-black text-primary">
                          {match.score_a}
                        </div>
                        <div className="bg-primary/20 text-primary font-black text-xs px-2 py-1 rounded-md">
                          FINAL
                        </div>
                        <div className="flex items-center justify-center text-4xl font-black text-primary">
                          {match.score_b}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team B */}
                  <div className="flex flex-1 flex-col items-center gap-3 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center font-black text-xl text-primary shadow-inner">
                      {match.equipo_b.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="text-lg font-bold text-foreground text-center leading-tight truncate w-full px-2">{match.equipo_b}</span>
                  </div>
                </div>
                
                {/* Match Footer */}
                <div className="px-6 py-4 bg-card border-t border-border flex flex-col gap-4">
                  {match.estado === 'PROGRAMADO' ? (
                    <button 
                      onClick={() => {
                        const predA = (document.getElementById(`pred-a-${match.id}`) as HTMLInputElement)?.value || '';
                        const predB = (document.getElementById(`pred-b-${match.id}`) as HTMLInputElement)?.value || '';
                        handleSavePrediction(match.id, predA, predB);
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-colors"
                    >
                      Guardar Predicción
                    </button>
                  ) : (
                    <>
                      <div className="w-full flex justify-between items-center bg-muted/30 rounded-xl px-4 py-3 border border-border">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tu Predicción</span>
                          <span className="text-lg font-black text-foreground tracking-widest">{match.user_pred_a ?? '-'} - {match.user_pred_b ?? '-'}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Puntos Obtenidos</span>
                          <div className="flex items-center gap-1">
                            <span className={`text-xl font-black ${match.puntos_ganados && match.puntos_ganados > 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                              +{match.puntos_ganados || 0}
                            </span>
                            <span className="text-sm font-bold text-muted-foreground">pts</span>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown toggle for player details */}
                      <button
                        onClick={() => toggleDetails(match.id)}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors border border-dashed border-border"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-4.5 h-4.5 text-primary" />
                          Ver predicciones de los demás jugadores
                        </span>
                        {expandedMatches[match.id] ? (
                          <ChevronUp className="w-4 h-4 transition-transform" />
                        ) : (
                          <ChevronDown className="w-4 h-4 transition-transform" />
                        )}
                      </button>

                      {/* Expanded Panel */}
                      {expandedMatches[match.id] && (
                        <div className="mt-2 space-y-2 border-t border-border pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Detalle de Puntuación por Jugador</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {getPlayerPredictionsForMatch(match.id, match.score_a || 0, match.score_b || 0).map((player) => {
                              const pts = calculatePoints(match.score_a || 0, match.score_b || 0, player.predA, player.predB);
                              return (
                                <div key={player.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/70 transition-all">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">{player.name}</span>
                                    <span className="text-xs text-muted-foreground">Predijo: <span className="font-mono font-semibold text-foreground">{player.predA} - {player.predB}</span></span>
                                  </div>
                                  <span className={`text-sm font-black px-2 py-1 rounded-md ${
                                    pts === 5 
                                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                      : pts === 3
                                      ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                                      : pts === 2
                                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                      : pts === 1
                                      ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                      : 'bg-muted text-muted-foreground'
                                  }`}>
                                    +{pts} pts
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
