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
}
