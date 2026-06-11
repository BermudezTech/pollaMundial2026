export interface UserRanking {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  exactScores: number;
}

export interface MatchMock {
  id: number;
  fase_id: number;
  equipo_a: string;
  equipo_b: string;
  fecha_hora: string;
  estado: 'PROGRAMADO' | 'FINALIZADO';
  score_a?: number | null;
  score_b?: number | null;
  user_pred_a?: number | null;
  user_pred_b?: number | null;
  puntos_ganados?: number;
}

export interface FaseMock {
  id: number;
  nombre: string;
  permite_empate: boolean;
}

export const mockFases: FaseMock[] = [
  { id: 1, nombre: 'Grupo A', permite_empate: true },
  { id: 2, nombre: 'Grupo B', permite_empate: true },
  { id: 3, nombre: 'Grupo C', permite_empate: true },
  { id: 4, nombre: 'Grupo D', permite_empate: true },
  { id: 5, nombre: 'Grupo E', permite_empate: true },
  { id: 6, nombre: 'Grupo F', permite_empate: true },
  { id: 7, nombre: 'Grupo G', permite_empate: true },
  { id: 8, nombre: 'Grupo H', permite_empate: true },
  { id: 9, nombre: 'Grupo I', permite_empate: true },
  { id: 10, nombre: 'Grupo J', permite_empate: true },
  { id: 11, nombre: 'Grupo K', permite_empate: true },
  { id: 12, nombre: 'Grupo L', permite_empate: true },
  { id: 13, nombre: 'Dieciseisavos de Final', permite_empate: false },
  { id: 14, nombre: 'Octavos de Final', permite_empate: false },
  { id: 15, nombre: 'Cuartos de Final', permite_empate: false },
  { id: 16, nombre: 'Semifinales', permite_empate: false },
  { id: 17, nombre: 'Tercer Puesto', permite_empate: false },
  { id: 18, nombre: 'Final', permite_empate: false },
];

// List of other players in the pool (9 participants total: 8 simulated + 1 user)
export const participants = [
  { id: 'user', name: 'Tú (Usuario)' },
  { id: '1', name: 'Carlos Díaz' },
  { id: '2', name: 'Ana Gómez' },
  { id: '3', name: 'Pedro Sánchez' },
  { id: '4', name: 'Luis Martínez' },
  { id: '5', name: 'Marta Ríos' },
  { id: '6', name: 'Juan Pérez' },
  { id: '7', name: 'Sofía Torres' },
  { id: '8', name: 'Diego Gómez' }
];

// Simple deterministic prediction generator for simulated users
export function getPlayerPrediction(playerId: string, matchId: number): { predA: number; predB: number } {
  // Use simple string hash to make predictions deterministic but look natural
  const hash = playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + matchId;
  const predA = hash % 4;
  const predB = (hash * 3) % 4;
  return { predA, predB };
}

export function calculateMatchPoints(realA: number, realB: number, predA: number, predB: number): number {
  if (realA === predA && realB === predB) return 5; // Exact Score
  
  const realDiff = realA - realB;
  const predDiff = predA - predB;
  
  const realWinner = realDiff > 0 ? 1 : realDiff < 0 ? -1 : 0;
  const predWinner = predDiff > 0 ? 1 : predDiff < 0 ? -1 : 0;
  
  if (realWinner === predWinner) {
    return 3; // Correct winner or draw
  }
  
  if (realA === predA || realB === predB) return 1; // Individual goals
  
  return 0;
}

// Generate the list of 108 matches
function generateMatches(): MatchMock[] {
  const matchesList: MatchMock[] = [];
  let currentMatchId = 1;

  // 12 Groups (A to L), 6 matches per group = 72 matches
  const groupTeams: Record<number, string[]> = {
    1: ['México', 'Ecuador', 'Senegal', 'Países Bajos'],
    2: ['Inglaterra', 'Irán', 'EE.UU.', 'Gales'],
    3: ['Argentina', 'Arabia Saudita', 'Polonia', 'Canadá'],
    4: ['Francia', 'Australia', 'Dinamarca', 'Túnez'],
    5: ['España', 'Costa Rica', 'Alemania', 'Japón'],
    6: ['Bélgica', 'Marruecos', 'Croacia', 'Canadá'],
    7: ['Brasil', 'Serbia', 'Suiza', 'Camerún'],
    8: ['Portugal', 'Ghana', 'Uruguay', 'Corea del Sur'],
    9: ['Italia', 'Colombia', 'Suecia', 'Chile'],
    10: ['Nigeria', 'Argelia', 'Egipto', 'Marruecos'],
    11: ['Japón', 'Australia', 'Corea del Sur', 'Arabia Saudita'],
    12: ['Perú', 'Paraguay', 'Venezuela', 'Bolivia'],
  };

  // Generate Group Stage Matches (1 to 72)
  for (let groupIdx = 1; groupIdx <= 12; groupIdx++) {
    const teams = groupTeams[groupIdx] || [`Grupo ${groupIdx} T1`, `Grupo ${groupIdx} T2`, `Grupo ${groupIdx} T3`, `Grupo ${groupIdx} T4`];
    const matchups = [
      [teams[0], teams[1]],
      [teams[2], teams[3]],
      [teams[0], teams[2]],
      [teams[1], teams[3]],
      [teams[3], teams[0]],
      [teams[1], teams[2]]
    ];

    matchups.forEach((teams) => {
      // Simulate first few matches as finished
      const isFinished = currentMatchId <= 4;
      const score_a = isFinished ? (currentMatchId % 2 === 0 ? 0 : 2) : null;
      const score_b = isFinished ? (currentMatchId % 2 === 0 ? 0 : 1) : null;
      const user_pred_a = currentMatchId <= 6 ? (currentMatchId % 2 === 0 ? 1 : 2) : null;
      const user_pred_b = currentMatchId <= 6 ? (currentMatchId % 2 === 0 ? 1 : 1) : null;

      // Calculate earned points for the user
      let puntos_ganados = undefined;
      if (isFinished && user_pred_a !== null && user_pred_b !== null && score_a !== null && score_b !== null) {
        puntos_ganados = calculateMatchPoints(score_a, score_b, user_pred_a, user_pred_b);
      }

      matchesList.push({
        id: currentMatchId,
        fase_id: groupIdx,
        equipo_a: teams[0],
        equipo_b: teams[1],
        fecha_hora: new Date(2026, 5, 11 + Math.floor((currentMatchId - 1) / 4), 12 + (currentMatchId % 3) * 3).toISOString(),
        estado: isFinished ? 'FINALIZADO' : 'PROGRAMADO',
        score_a,
        score_b,
        user_pred_a,
        user_pred_b,
        puntos_ganados
      });
      currentMatchId++;
    });
  }

  // Playoff phase sizes up to 108 matches
  // Phase 13 (Dieciseisavos): 16 matches (73 to 88)
  for (let i = 1; i <= 16; i++) {
    matchesList.push({
      id: currentMatchId,
      fase_id: 13,
      equipo_a: `Clasificado ${2*i - 1}`,
      equipo_b: `Clasificado ${2*i}`,
      fecha_hora: new Date(2026, 5, 28 + Math.floor(i / 4), 12 + (i % 3) * 3).toISOString(),
      estado: 'PROGRAMADO'
    });
    currentMatchId++;
  }

  // Phase 14 (Octavos): 8 matches (89 to 96)
  for (let i = 1; i <= 8; i++) {
    matchesList.push({
      id: currentMatchId,
      fase_id: 14,
      equipo_a: `Ganador D${2*i - 1}`,
      equipo_b: `Ganador D${2*i}`,
      fecha_hora: new Date(2026, 6, 4 + Math.floor(i / 4), 12 + (i % 3) * 3).toISOString(),
      estado: 'PROGRAMADO'
    });
    currentMatchId++;
  }

  // Phase 15 (Cuartos): 4 matches (97 to 100)
  for (let i = 1; i <= 4; i++) {
    matchesList.push({
      id: currentMatchId,
      fase_id: 15,
      equipo_a: `Ganador O${2*i - 1}`,
      equipo_b: `Ganador O${2*i}`,
      fecha_hora: new Date(2026, 6, 8, 12 + (i % 2) * 4).toISOString(),
      estado: 'PROGRAMADO'
    });
    currentMatchId++;
  }

  // Phase 16 (Semifinales): 4 matches (101 to 104)
  for (let i = 1; i <= 4; i++) {
    matchesList.push({
      id: currentMatchId,
      fase_id: 16,
      equipo_a: `Ganador C${2*i - 1}`,
      equipo_b: `Ganador C${2*i}`,
      fecha_hora: new Date(2026, 6, 12, 15).toISOString(),
      estado: 'PROGRAMADO'
    });
    currentMatchId++;
  }

  // Phase 17 (Tercer Puesto): 2 matches (105 to 106)
  for (let i = 1; i <= 2; i++) {
    matchesList.push({
      id: currentMatchId,
      fase_id: 17,
      equipo_a: `Perdedor S${2*i - 1}`,
      equipo_b: `Perdedor S${2*i}`,
      fecha_hora: new Date(2026, 6, 18, 15).toISOString(),
      estado: 'PROGRAMADO'
    });
    currentMatchId++;
  }

  // Phase 18 (Final): 2 matches (107 to 108)
  for (let i = 1; i <= 2; i++) {
    matchesList.push({
      id: currentMatchId,
      fase_id: 18,
      equipo_a: `Ganador S${2*i - 1}`,
      equipo_b: `Ganador S${2*i}`,
      fecha_hora: new Date(2026, 6, 19, 15).toISOString(),
      estado: 'PROGRAMADO'
    });
    currentMatchId++;
  }

  return matchesList;
}

// Get the initial matches list
export const initialMatches = generateMatches();

// Local Storage helpers
const MATCHES_STORAGE_KEY = 'polla_matches';

export function getSavedMatches(): MatchMock[] {
  const data = localStorage.getItem(MATCHES_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(initialMatches));
    return initialMatches;
  }
  return JSON.parse(data);
}

export function saveSavedMatches(matches: MatchMock[]) {
  localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
}

// Calculate player rankings dynamically based on saved matches and predictions
export function getLeaderboard(): UserRanking[] {
  const matches = getSavedMatches();
  
  // Initialize scores for all participants
  const standings: Record<string, { name: string; points: number; exactScores: number }> = {};
  participants.forEach(p => {
    standings[p.id] = { name: p.name, points: 0, exactScores: 0 };
  });

  // Calculate points for each finished match
  matches.forEach(match => {
    if (match.estado === 'FINALIZADO' && match.score_a !== null && match.score_b !== null) {
      participants.forEach(p => {
        let predA = 0;
        let predB = 0;

        if (p.id === 'user') {
          // User prediction
          if (match.user_pred_a !== null && match.user_pred_b !== null) {
            predA = match.user_pred_a!;
            predB = match.user_pred_b!;
          } else {
            return; // Skip if user didn't predict
          }
        } else {
          // Simulated player prediction
          const pred = getPlayerPrediction(p.id, match.id);
          predA = pred.predA;
          predB = pred.predB;
        }

        const pts = calculateMatchPoints(match.score_a!, match.score_b!, predA, predB);
        standings[p.id].points += pts;
        if (pts === 5) {
          standings[p.id].exactScores += 1;
        }
      });
    }
  });

  // Convert map to sorted array
  return Object.entries(standings).map(([id, info]) => ({
    id,
    name: info.name,
    points: info.points,
    exactScores: info.exactScores
  })).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.exactScores - a.exactScores;
  });
}

// Helper compatibility exports
export const mockLeaderboard = getLeaderboard();
export const mockMatches = getSavedMatches();
