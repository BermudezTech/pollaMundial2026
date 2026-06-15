import { useState, useMemo, useEffect } from 'react';
import { mockFases } from '../services/mockData';
import { Search, CheckCircle, Clock, RefreshCw, Save } from 'lucide-react';

interface AdminMatch {
  id: number;
  fase_id: number;
  equipo_a: string;
  equipo_b: string;
  equipo_a_placeholder?: string;
  equipo_b_placeholder?: string;
  equipo_a_real?: string | null;
  equipo_b_real?: string | null;
  fecha_hora: string;
  estado: 'PROGRAMADO' | 'FINALIZADO';
  score_a: number | null;
  score_b: number | null;
  clasifica_real: string | null;
}

const formatForInput = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function AdminMatches() {
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/matches/all');
      if (!response.ok) {
        throw new Error('Error al cargar partidos reales del servidor');
      }
      const data = await response.json();
      setMatches(data);
    } catch (err: any) {
      setError(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const [selectedFaseId, setSelectedFaseId] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter matches based on selected phase and search query
  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const matchesPhase = selectedFaseId === 'ALL' || match.fase_id === selectedFaseId;
      const matchesSearch =
        match.equipo_a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.equipo_b.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPhase && matchesSearch;
    });
  }, [matches, selectedFaseId, searchQuery]);

  const handleUpdateMatch = async (
    matchId: number,
    scoreAStr: string,
    scoreBStr: string,
    estado: 'PROGRAMADO' | 'FINALIZADO',
    equipoAReal?: string,
    equipoBReal?: string,
    fechaHora?: string
  ) => {
    const score_a = scoreAStr === '' ? null : parseInt(scoreAStr);
    const score_b = scoreBStr === '' ? null : parseInt(scoreBStr);

    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goles_a: score_a,
          goles_b: score_b,
          estado,
          equipo_a_real: equipoAReal,
          equipo_b_real: equipoBReal,
          fecha_hora: fechaHora ? new Date(fechaHora).toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el partido en el servidor');
      }

      setMatches(prev => prev.map(m => {
        if (m.id === matchId) {
          const finalAReal = equipoAReal !== undefined ? equipoAReal : m.equipo_a_real;
          const finalBReal = equipoBReal !== undefined ? equipoBReal : m.equipo_b_real;
          return {
            ...m,
            score_a,
            score_b,
            estado,
            equipo_a: finalAReal || m.equipo_a_placeholder || m.equipo_a,
            equipo_b: finalBReal || m.equipo_b_placeholder || m.equipo_b,
            equipo_a_real: finalAReal,
            equipo_b_real: finalBReal,
            fecha_hora: fechaHora ? new Date(fechaHora).toISOString() : m.fecha_hora,
          };
        }
        return m;
      }));

      alert(`Partido #${matchId} actualizado con éxito.`);
    } catch (err: any) {
      console.error(err);
      alert('Error al actualizar el partido: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Cargando partidos reales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4 max-w-xl mx-auto">
        <div className="text-destructive text-lg font-bold">Ocurrió un error al cargar los partidos</div>
        <p className="text-muted-foreground">{error}</p>
        <button 
          onClick={fetchMatches}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase px-3 py-1 rounded-full">
            Super Admin
          </span>
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Consola de Resultados Reales</h1>
        <p className="text-muted-foreground">Administra los marcadores finales de los partidos del torneo.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por equipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>

        {/* Phase Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select
            value={selectedFaseId}
            onChange={(e) => setSelectedFaseId(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
            className="bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold cursor-pointer w-full md:w-60"
          >
            <option value="ALL">Todas las Fases</option>
            {mockFases.map(fase => (
              <option key={fase.id} value={fase.id}>
                {fase.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matches Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMatches.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-border border-dashed rounded-2xl">
            No se encontraron partidos para los filtros seleccionados.
          </div>
        ) : (
          filteredMatches.map((match) => {
            const faseName = mockFases.find(f => f.id === match.fase_id)?.nombre || `Fase ${match.fase_id}`;
            const isElimination = match.fase_id >= 13;

            return (
              <div
                key={match.id}
                className={`bg-card border rounded-2xl overflow-hidden shadow-md transition-all flex flex-col justify-between ${match.estado === 'FINALIZADO' ? 'border-emerald-500/20 bg-emerald-500/[0.01]' : 'border-border'
                  }`}
              >
                {/* Header */}
                <div className="px-4 py-2 border-b border-border bg-muted/40 flex justify-between items-center text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-muted-foreground">#{match.id} - {faseName}</span>
                    <span className="text-[10px] text-primary font-semibold">
                      {new Date(match.fecha_hora).toLocaleString('es-ES', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <span className={`flex items-center gap-1 font-bold ${match.estado === 'FINALIZADO' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                    {match.estado === 'FINALIZADO' ? (
                      <>
                        <CheckCircle className="w-3 h-3" /> FINALIZADO
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> PROGRAMADO
                      </>
                    )}
                  </span>
                </div>

                {/* Date-time Row */}
                <div className="px-4 pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 bg-muted/10">
                  <span className="text-xs font-bold text-muted-foreground">Fecha y Hora:</span>
                  <input
                    type="datetime-local"
                    id={`admin-date-${match.id}`}
                    defaultValue={formatForInput(match.fecha_hora)}
                    className="text-xs font-bold text-foreground bg-background border border-border rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-auto"
                  />
                </div>

                {/* Score Input Body */}
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Team A */}
                    <div className="flex-1 flex flex-col items-center text-center gap-2">
                      {(() => {
                        const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E6}-\u{1F1FF}]{2}/u;
                        const matchEmoji = match.equipo_a.match(emojiRegex);
                        return matchEmoji ? (
                          <span className="text-2xl select-none">{matchEmoji[0]}</span>
                        ) : (
                          <span className="text-xs font-black text-primary">
                            {match.equipo_a.substring(0, 3).toUpperCase()}
                          </span>
                        );
                      })()}
                      
                      {isElimination ? (
                        <div className="w-full flex flex-col gap-1">
                          <input 
                            type="text"
                            id={`admin-team-a-${match.id}`}
                            defaultValue={match.equipo_a_real || ''}
                            placeholder={match.equipo_a_placeholder || match.equipo_a}
                            className="w-full text-center text-xs font-bold bg-background border border-border rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none"
                          />
                          <span className="text-[10px] text-muted-foreground italic truncate block">
                            Original: {match.equipo_a_placeholder}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-foreground line-clamp-1">{match.equipo_a}</span>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min="0"
                        id={`admin-score-a-${match.id}`}
                        defaultValue={match.score_a ?? ''}
                        className="w-12 h-12 bg-background border border-border rounded-xl text-center text-xl font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        placeholder="-"
                      />
                      <span className="text-xs text-muted-foreground font-bold">VS</span>
                      <input
                        type="number"
                        min="0"
                        id={`admin-score-b-${match.id}`}
                        defaultValue={match.score_b ?? ''}
                        className="w-12 h-12 bg-background border border-border rounded-xl text-center text-xl font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        placeholder="-"
                      />
                    </div>

                    {/* Team B */}
                    <div className="flex-1 flex flex-col items-center text-center gap-2">
                      {(() => {
                        const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E6}-\u{1F1FF}]{2}/u;
                        const matchEmoji = match.equipo_b.match(emojiRegex);
                        return matchEmoji ? (
                          <span className="text-2xl select-none">{matchEmoji[0]}</span>
                        ) : (
                          <span className="text-xs font-black text-primary">
                            {match.equipo_b.substring(0, 3).toUpperCase()}
                          </span>
                        );
                      })()}
                      
                      {isElimination ? (
                        <div className="w-full flex flex-col gap-1">
                          <input 
                            type="text"
                            id={`admin-team-b-${match.id}`}
                            defaultValue={match.equipo_b_real || ''}
                            placeholder={match.equipo_b_placeholder || match.equipo_b}
                            className="w-full text-center text-xs font-bold bg-background border border-border rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none"
                          />
                          <span className="text-[10px] text-muted-foreground italic truncate block">
                            Original: {match.equipo_b_placeholder}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-foreground line-clamp-1">{match.equipo_b}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-4 py-3 border-t border-border bg-muted/20 flex gap-2">
                  <button
                    onClick={() => {
                      const scoreA = (document.getElementById(`admin-score-a-${match.id}`) as HTMLInputElement)?.value || '';
                      const scoreB = (document.getElementById(`admin-score-b-${match.id}`) as HTMLInputElement)?.value || '';
                      const teamA = isElimination ? (document.getElementById(`admin-team-a-${match.id}`) as HTMLInputElement)?.value : undefined;
                      const teamB = isElimination ? (document.getElementById(`admin-team-b-${match.id}`) as HTMLInputElement)?.value : undefined;
                      const dateVal = (document.getElementById(`admin-date-${match.id}`) as HTMLInputElement)?.value || '';
                      handleUpdateMatch(match.id, scoreA, scoreB, match.estado, teamA, teamB, dateVal);
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Guardar Cambios
                  </button>

                  {match.estado === 'PROGRAMADO' ? (
                    <button
                      onClick={() => {
                        const scoreA = (document.getElementById(`admin-score-a-${match.id}`) as HTMLInputElement)?.value || '';
                        const scoreB = (document.getElementById(`admin-score-b-${match.id}`) as HTMLInputElement)?.value || '';
                        const teamA = isElimination ? (document.getElementById(`admin-team-a-${match.id}`) as HTMLInputElement)?.value : undefined;
                        const teamB = isElimination ? (document.getElementById(`admin-team-b-${match.id}`) as HTMLInputElement)?.value : undefined;
                        const dateVal = (document.getElementById(`admin-date-${match.id}`) as HTMLInputElement)?.value || '';
                        handleUpdateMatch(match.id, scoreA, scoreB, 'FINALIZADO', teamA, teamB, dateVal);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Finalizar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const scoreA = (document.getElementById(`admin-score-a-${match.id}`) as HTMLInputElement)?.value || '';
                        const scoreB = (document.getElementById(`admin-score-b-${match.id}`) as HTMLInputElement)?.value || '';
                        const teamA = isElimination ? (document.getElementById(`admin-team-a-${match.id}`) as HTMLInputElement)?.value : undefined;
                        const teamB = isElimination ? (document.getElementById(`admin-team-b-${match.id}`) as HTMLInputElement)?.value : undefined;
                        const dateVal = (document.getElementById(`admin-date-${match.id}`) as HTMLInputElement)?.value || '';
                        handleUpdateMatch(match.id, scoreA, scoreB, 'PROGRAMADO', teamA, teamB, dateVal);
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors"
                    >
                      Reabrir
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
