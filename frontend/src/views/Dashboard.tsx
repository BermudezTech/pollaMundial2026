import { Trophy, Medal, Star, RefreshCw } from 'lucide-react';
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

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/leaderboard');
      if (!response.ok) {
        throw new Error('Error al obtener la tabla de posiciones');
      }
      const data = await response.json();
      setLeaderboard(data);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido a la Polla Mundial. Aquí está la tabla de posiciones actual.</p>
        </div>
        <Link 
          to="/fases" 
          className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm justify-center"
        >
          <Trophy className="w-4 h-4" />
          Ver Partidos
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <div className="text-muted-foreground font-medium">Tu Posición</div>
          <div className="text-3xl font-black text-primary">{userPos}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <div className="text-muted-foreground font-medium">Tus Puntos</div>
          <div className="text-3xl font-black text-primary">{userStats.total_puntos} pts</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <div className="text-muted-foreground font-medium">Marcadores Exactos</div>
          <div className="text-3xl font-black text-primary">{userStats.marcadores_exactos}</div>
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-sm font-medium border-b border-border">
                  <th className="px-6 py-4">Posición</th>
                  <th className="px-6 py-4">Participante</th>
                  <th className="px-6 py-4 text-right">Pts</th>
                  <th className="px-6 py-4 text-right">Exactos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboard.map((user, index) => {
                  const isCurrentUser = user.id === loggedInUserUuid;
                  return (
                    <tr key={user.id} className={`hover:bg-muted/50 transition-colors ${isCurrentUser ? 'bg-primary/5 font-semibold' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Medal className="text-yellow-500 w-5 h-5" />}
                          {index === 1 && <Medal className="text-neutral-400 w-5 h-5" />}
                          {index === 2 && <Medal className="text-amber-700 w-5 h-5" />}
                          <span className={`font-black ${index < 3 ? 'text-lg text-foreground' : 'text-muted-foreground'}`}>
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-primary text-xs">
                            {user.nombre.charAt(0)}
                          </div>
                          <span className="font-semibold text-foreground">
                            {isCurrentUser ? `${user.nombre} (Tú)` : user.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1 font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {user.total_puntos}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1 text-muted-foreground">
                          <Star className="w-4 h-4 text-muted-foreground" />
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
    </div>
  );
}
