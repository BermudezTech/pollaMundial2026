import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PredictionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPredictionsByUserId(userId: string) {
    return this.prisma.prediccion.findMany({
      where: { usuario_id: userId },
    });
  }

  async upsertPrediction(
    userId: string,
    matchId: number,
    golesA: number,
    golesB: number,
    clasifica?: string | null,
  ) {
    const match = await this.prisma.partido.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new BadRequestException('Partido no encontrado');
    }

    if (match.estado === 'FINALIZADO') {
      throw new BadRequestException('El partido ya ha finalizado');
    }

    const matchDate = new Date(match.fecha_hora);
    const now = new Date();
    if (matchDate.getTime() - now.getTime() <= 300000) {
      throw new BadRequestException('El tiempo para predecir este partido ha expirado');
    }
    const existing = await this.prisma.prediccion.findFirst({
      where: {
        usuario_id: userId,
        partido_id: matchId,
      },
    });

    if (existing) {
      return this.prisma.prediccion.update({
        where: { id: existing.id },
        data: {
          prediccion_goles_a: golesA,
          prediccion_goles_b: golesB,
          prediccion_clasifica: clasifica ?? null,
        },
      });
    }

    return this.prisma.prediccion.create({
      data: {
        usuario_id: userId,
        partido_id: matchId,
        prediccion_goles_a: golesA,
        prediccion_goles_b: golesB,
        prediccion_clasifica: clasifica ?? null,
      },
    });
  }

  async getPredictionsByMatchId(matchId: number) {
    const predictions = await this.prisma.prediccion.findMany({
      where: { partido_id: matchId },
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
      },
    });

    return predictions.map((p) => ({
      name: p.usuario.nombre,
      predA: p.prediccion_goles_a,
      predB: p.prediccion_goles_b,
      prediccion_clasifica: p.prediccion_clasifica,
      puntos_ganados: p.puntos_ganados,
    }));
  }
}

