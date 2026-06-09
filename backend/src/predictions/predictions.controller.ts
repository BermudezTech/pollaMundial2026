import { Controller, Get, Put, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PredictionsService } from './predictions.service';

@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get('match/:matchId')
  async getPredictionsByMatch(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.predictionsService.getPredictionsByMatchId(matchId);
  }

  @Get(':uuid')
  async getPredictions(@Param('uuid') uuid: string) {
    return this.predictionsService.getPredictionsByUserId(uuid);
  }

  @Put()
  async savePrediction(
    @Body()
    body: {
      usuario_id: string;
      partido_id: number;
      prediccion_goles_a: number;
      prediccion_goles_b: number;
      prediccion_clasifica?: string | null;
    },
  ) {
    return this.predictionsService.upsertPrediction(
      body.usuario_id,
      body.partido_id,
      body.prediccion_goles_a,
      body.prediccion_goles_b,
      body.prediccion_clasifica,
    );
  }
}
