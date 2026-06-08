export interface UserRanking {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  exactScores: number;
}

export const mockLeaderboard: UserRanking[] = [
  { id: '1', name: 'Carlos Díaz', points: 15, exactScores: 2 },
  { id: '2', name: 'Ana Gómez', points: 12, exactScores: 1 },
  { id: '3', name: 'Pedro Sánchez', points: 10, exactScores: 1 },
  { id: '4', name: 'Luis Martínez', points: 8, exactScores: 0 },
  { id: '5', name: 'Marta Ríos', points: 5, exactScores: 0 },
];

export interface MatchMock {
  id: number;
  fase_id: number;
  equipo_a: string;
  equipo_b: string;
  fecha_hora: string;
  score_a?: number;
  score_b?: number;
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

export const mockMatches: MatchMock[] = [
  // Grupo A
  { id: 1, fase_id: 1, equipo_a: 'Mexico', equipo_b: 'A2', fecha_hora: '2026-06-11T12:00:00Z' },
  { id: 2, fase_id: 1, equipo_a: 'A3', equipo_b: 'A4', fecha_hora: '2026-06-11T15:00:00Z' },
  // Grupo B
  { id: 3, fase_id: 2, equipo_a: 'Canada', equipo_b: 'B2', fecha_hora: '2026-06-12T12:00:00Z' },
  { id: 4, fase_id: 2, equipo_a: 'B3', equipo_b: 'B4', fecha_hora: '2026-06-12T15:00:00Z' },
  // Dieciseisavos
  { id: 5, fase_id: 13, equipo_a: '1A', equipo_b: '3C/D/E', fecha_hora: '2026-06-28T12:00:00Z' },
  // Final
  { id: 6, fase_id: 18, equipo_a: 'Ganador Semifinal 1', equipo_b: 'Ganador Semifinal 2', fecha_hora: '2026-07-19T12:00:00Z' }
];
