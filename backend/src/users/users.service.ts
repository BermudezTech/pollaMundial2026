import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard() {
    const users = await this.prisma.usuario.findMany({
      include: {
        predicciones: {
          include: {
            partido: {
              include: {
                fase: true,
              },
            },
          },
        },
      },
    });

    const leaderboard = [];
    const prediccionesAActualizar = [];

    for (const user of users) {
      let totalPuntos = 0;
      let marcadoresExactos = 0;

      for (const prediccion of user.predicciones) {
        const partido = prediccion.partido;

        // Solo procesamos si el partido tiene resultado ingresado
        if (partido.goles_a !== null && partido.goles_b !== null) {
          let puntos = 0;
          let esMarcadorExacto = false;

          const golesAReal = partido.goles_a;
          const golesBReal = partido.goles_b;
          const golesAPred = prediccion.prediccion_goles_a;
          const golesBPred = prediccion.prediccion_goles_b;

          const diffReal = golesAReal - golesBReal;
          const diffPred = golesAPred - golesBPred;

          const ganadorReal =
            diffReal > 0 ? 'A' : diffReal < 0 ? 'B' : 'EMPATE';
          const ganadorPred =
            diffPred > 0 ? 'A' : diffPred < 0 ? 'B' : 'EMPATE';

          // Reglas excluyentes base
          if (golesAReal === golesAPred && golesBReal === golesBPred) {
            puntos = 5;
            esMarcadorExacto = true;
          } else if (ganadorReal === ganadorPred && diffReal === diffPred) {
            puntos = 3;
          } else if (ganadorReal === ganadorPred) {
            puntos = 2;
          } else if (golesAReal === golesAPred || golesBReal === golesBPred) {
            puntos = 1;
          }

          // Regla Especial para Penaltis (Fase Eliminatoria)
          if (!partido.fase.permite_empate) {
            // Solo otorgamos puntos extra si el partido real terminó en empate 
            // y se definió en penaltis/clasificación.
            if (
              ganadorReal === 'EMPATE' &&
              partido.clasifica_real &&
              prediccion.prediccion_clasifica
            ) {
              if (partido.clasifica_real === prediccion.prediccion_clasifica) {
                puntos += 2;
              }
            }
          }

          totalPuntos += puntos;
          if (esMarcadorExacto) {
            marcadoresExactos++;
          }

          // Actualizamos la base de datos si los puntos de la predicción cambiaron
          if (prediccion.puntos_ganados !== puntos) {
            prediccionesAActualizar.push(
              this.prisma.prediccion.update({
                where: { id: prediccion.id },
                data: { puntos_ganados: puntos },
              }),
            );
          }
        }
      }

      leaderboard.push({
        id: user.id,
        nombre: user.nombre,
        total_puntos: totalPuntos,
        marcadores_exactos: marcadoresExactos,
      });
    }

    // Ejecutamos las actualizaciones de DB en una transacción
    if (prediccionesAActualizar.length > 0) {
      await this.prisma.$transaction(prediccionesAActualizar);
    }

    // Ordenamos por puntos (descendente) y luego por marcadores exactos (descendente)
    leaderboard.sort((a, b) => {
      if (b.total_puntos !== a.total_puntos) {
        return b.total_puntos - a.total_puntos;
      }
      return b.marcadores_exactos - a.marcadores_exactos;
    });

    return leaderboard;
  }
}
