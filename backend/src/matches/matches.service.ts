import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMatchesByPhase() {
    const fases = await this.prisma.fase.findMany({
      include: {
        partidos: {
          select: {
            id: true,
            equipo_a_placeholder: true,
            equipo_b_placeholder: true,
            equipo_a_real: true,
            equipo_b_real: true,
            goles_a: true,
            goles_b: true,
            fecha_hora: true,
            clasifica_real: true,
            estado: true,
          },
          orderBy: {
            fecha_hora: 'asc',
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return fases;
  }

  async getAllMatches() {
    const partidos = await this.prisma.partido.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return partidos.map((p) => ({
      id: p.id,
      fase_id: p.fase_id,
      equipo_a: p.equipo_a_real || p.equipo_a_placeholder,
      equipo_b: p.equipo_b_real || p.equipo_b_placeholder,
      equipo_a_placeholder: p.equipo_a_placeholder,
      equipo_b_placeholder: p.equipo_b_placeholder,
      equipo_a_real: p.equipo_a_real,
      equipo_b_real: p.equipo_b_real,
      fecha_hora: p.fecha_hora.toISOString(),
      estado: p.estado,
      score_a: p.goles_a,
      score_b: p.goles_b,
      clasifica_real: p.clasifica_real,
    }));
  }

  async getMatchesToday() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' });
    const todayStr = formatter.format(now);

    const partidos = await this.prisma.partido.findMany({
      orderBy: { fecha_hora: 'asc' },
      include: { fase: { select: { nombre: true } } }
    });

    const todayMatches = partidos.filter(p => {
      const matchDateStr = formatter.format(p.fecha_hora);
      return matchDateStr === todayStr;
    });

    return todayMatches.map((p) => ({
      id: p.id,
      fase_nombre: p.fase.nombre,
      fase_id: p.fase_id,
      equipo_a: p.equipo_a_real || p.equipo_a_placeholder,
      equipo_b: p.equipo_b_real || p.equipo_b_placeholder,
      fecha_hora: p.fecha_hora.toISOString(),
      estado: p.estado,
      score_a: p.goles_a,
      score_b: p.goles_b,
    }));
  }

  async updateMatchScore(
    id: number,
    golesA: number | null,
    golesB: number | null,
    estado: string,
    clasificaReal?: string | null,
    equipoAReal?: string | null,
    equipoBReal?: string | null,
    fechaHora?: string | null,
  ) {
    return this.prisma.partido.update({
      where: { id },
      data: {
        goles_a: golesA,
        goles_b: golesB,
        estado,
        clasifica_real: clasificaReal ?? null,
        equipo_a_real: equipoAReal !== undefined ? equipoAReal : undefined,
        equipo_b_real: equipoBReal !== undefined ? equipoBReal : undefined,
        fecha_hora: fechaHora ? new Date(fechaHora) : undefined,
      },
    });
  }
}

