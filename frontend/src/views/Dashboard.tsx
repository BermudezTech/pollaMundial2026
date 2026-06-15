import { Trophy, Medal, Star, RefreshCw, CalendarClock, Lock, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface LeaderboardUser {
  id: string;
  nombre: string;
  total_puntos: number;
  marcadores_exactos: number;
}

export default function Dashboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loggedInUserUuid = localStorage.getItem('user_uuid');

  const [todayMatches, setTodayMatches] = useState<any[]>([]);
  const [userPredictions, setUserPredictions] = useState<Record<number, any>>({});

  const scrollToTodayMatches = () => {
    const element = document.getElementById('today-matches-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [lbRes, todayRes, predRes] = await Promise.all([
        fetch('/api/users/leaderboard'),
        fetch('/api/matches/today'),
        loggedInUserUuid ? fetch(`/api/predictions/${loggedInUserUuid}`) : Promise.resolve(null)
      ]);

      if (!lbRes.ok) {
        throw new Error('Error al obtener la tabla de posiciones');
      }
      setLeaderboard(await lbRes.json());

      if (todayRes.ok) {
        setTodayMatches(await todayRes.json());
      }

      if (predRes && predRes.ok) {
        const preds = await predRes.json();
        const predMap: Record<number, any> = {};
        preds.forEach((p: any) => { predMap[p.partido_id] = p; });
        setUserPredictions(predMap);
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const userRankIdx = leaderboard.findIndex(u => u.id === loggedInUserUuid);
  const userStats = leaderboard[userRankIdx] || { total_puntos: 0, marcadores_exactos: 0 };
  const userPos = userRankIdx !== -1 ? `${userRankIdx + 1}°` : '-';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Cargando tabla de posiciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
        <div className="text-destructive text-lg font-bold">Ocurrió un error</div>
        <p className="text-muted-foreground">{error}</p>
        <button 
          onClick={fetchLeaderboard}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 justify-end w-full">
        <button 
          onClick={scrollToTodayMatches}
          className="shrink-0 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-4 py-2.5 rounded-xl transition-all border border-border shadow-sm flex items-center gap-2 text-sm justify-center cursor-pointer"
        >
          <CalendarClock className="w-4 h-4" />
          Partidos de Hoy
        </button>
        <Link 
          to="/reglas" 
          className="shrink-0 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-4 py-2.5 rounded-xl transition-all border border-border shadow-sm flex items-center gap-2 text-sm justify-center"
        >
          <BookOpen className="w-4 h-4" />
          Reglas
        </Link>
        <Link 
          to="/fases" 
          className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm justify-center"
        >
          <Trophy className="w-4 h-4" />
          Ver Partidos
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-3 sm:p-6 flex flex-col gap-1 sm:gap-2 justify-center text-center sm:text-left min-w-0">
          <div className="text-muted-foreground text-[10px] xs:text-xs sm:text-sm font-semibold truncate">Tu Posición</div>
          <div className="text-base xs:text-lg sm:text-3xl font-black text-primary truncate">{userPos}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 sm:p-6 flex flex-col gap-1 sm:gap-2 justify-center text-center sm:text-left min-w-0">
          <div className="text-muted-foreground text-[10px] xs:text-xs sm:text-sm font-semibold truncate">Tus Puntos</div>
          <div className="text-base xs:text-lg sm:text-3xl font-black text-primary truncate">{userStats.total_puntos} <span className="text-[10px] xs:text-xs sm:text-sm font-medium">pts</span></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 sm:p-6 flex flex-col gap-1 sm:gap-2 justify-center text-center sm:text-left min-w-0">
          <div className="text-muted-foreground text-[10px] xs:text-xs sm:text-sm font-semibold truncate">Exactos</div>
          <div className="text-base xs:text-lg sm:text-3xl font-black text-primary truncate">{userStats.marcadores_exactos}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500 w-6 h-6" />
            <h2 className="text-xl font-bold text-foreground">Leaderboard</h2>
          </div>
          <button 
            onClick={fetchLeaderboard}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title="Actualizar tabla"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No hay participantes registrados todavía.
            </div>
          ) : (
            <table className="w-full text-left border-collapse table-fixed sm:table-auto">
              <thead>
                <tr className="bg-muted/55 text-muted-foreground text-xs sm:text-sm font-medium border-b border-border">
                  <th className="px-2.5 py-3 sm:px-6 sm:py-4 w-[65px] sm:w-auto">
                    <span className="hidden sm:inline">Posición</span>
                    <span className="sm:hidden">Pos.</span>
                  </th>
                  <th className="px-2.5 py-3 sm:px-6 sm:py-4">Participante</th>
                  <th className="px-2.5 py-3 sm:px-6 sm:py-4 text-right w-[60px] sm:w-auto">Pts</th>
                  <th className="px-2.5 py-3 sm:px-6 sm:py-4 text-right w-[75px] sm:w-auto">
                    <span className="hidden sm:inline">Exactos</span>
                    <span className="sm:hidden">Ex.</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {leaderboard.map((user, index) => {
                  const isCurrentUser = user.id === loggedInUserUuid;
                  return (
                    <tr key={user.id} className={`hover:bg-muted/50 transition-colors ${isCurrentUser ? 'bg-primary/5 font-semibold' : ''}`}>
                      <td className="px-2.5 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {index === 0 && <Medal className="text-yellow-500 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                          {index === 1 && <Medal className="text-neutral-400 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                          {index === 2 && <Medal className="text-amber-700 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                          <span className={`font-black ${index < 3 ? 'text-base sm:text-lg text-foreground' : 'text-muted-foreground'}`}>
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-2.5 py-3 sm:px-6 sm:py-4 overflow-hidden">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-primary text-[10px] sm:text-xs shrink-0">
                            {user.nombre.charAt(0)}
                          </div>
                          <span className="font-semibold text-foreground truncate max-w-[85px] xs:max-w-[150px] sm:max-w-none">
                            {isCurrentUser ? `${user.nombre} (Tú)` : user.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-2.5 py-3 sm:px-6 sm:py-4 text-right">
                        <div className="inline-flex items-center gap-1 font-black text-primary bg-primary/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                          {user.total_puntos}
                        </div>
                      </td>
                      <td className="px-2.5 py-3 sm:px-6 sm:py-4 text-right">
                        <div className="inline-flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                          <Star className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          {user.marcadores_exactos}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div id="today-matches-section" className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl mt-8">
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarClock className="text-primary w-6 h-6" />
            <h2 className="text-xl font-bold text-foreground">Partidos de Hoy</h2>
          </div>
        </div>
        
        <div className="p-6">
          {todayMatches.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No hay partidos programados para hoy.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayMatches.map((match) => {
                const pred = userPredictions[match.id];
                const matchDate = new Date(match.fecha_hora);
                const isLocked = match.estado === 'FINALIZADO' || (matchDate.getTime() - new Date().getTime() <= 300000);
                
                return (
                  <div key={match.id} className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span className="uppercase tracking-wider">{match.fase_nombre}</span>
                      <span>{matchDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-background rounded-lg p-3 border border-border shadow-inner w-full">
                      <div className="flex flex-col items-center min-w-0 gap-1">
                        <span className="font-bold text-xs sm:text-sm text-foreground leading-tight text-center break-words w-full px-0.5">{match.equipo_a}</span>
                        {match.estado === 'FINALIZADO' && <span className="text-lg font-black text-primary">{match.score_a}</span>}
                      </div>
                      <div className="text-[10px] font-black text-muted-foreground px-1 self-center">VS</div>
                      <div className="flex flex-col items-center min-w-0 gap-1">
                        <span className="font-bold text-xs sm:text-sm text-foreground leading-tight text-center break-words w-full px-0.5">{match.equipo_b}</span>
                        {match.estado === 'FINALIZADO' && <span className="text-lg font-black text-primary">{match.score_b}</span>}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        {pred ? (
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Tu Predicción</span>
                            <span className="text-sm font-black text-primary">{pred.prediccion_goles_a} - {pred.prediccion_goles_b}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md">
                            Sin predecir
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        {isLocked ? (
                          <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Cerrado
                          </span>
                        ) : (
                          <Link to={`/fases?matchId=${match.id}&faseId=${match.fase_id}`} className="text-xs font-bold uppercase text-primary hover:underline">
                            {pred ? 'Editar' : 'Predecir ahora'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
