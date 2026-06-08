import { Trophy, Medal, Star } from 'lucide-react';
import { mockLeaderboard } from '../services/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido a la Polla Mundial. Aquí está la tabla de posiciones actual.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <div className="text-muted-foreground font-medium">Tu Posición</div>
          <div className="text-3xl font-black text-primary">14th</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <div className="text-muted-foreground font-medium">Tus Puntos</div>
          <div className="text-3xl font-black text-primary">42</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <div className="text-muted-foreground font-medium">Marcadores Exactos</div>
          <div className="text-3xl font-black text-primary">3</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border bg-muted/30 flex items-center gap-3">
          <Trophy className="text-yellow-500 w-6 h-6" />
          <h2 className="text-xl font-bold text-foreground">Leaderboard</h2>
        </div>
        
        <div className="overflow-x-auto">
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
              {mockLeaderboard.map((user, index) => (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
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
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1 font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {user.points}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1 text-muted-foreground">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      {user.exactScores}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
