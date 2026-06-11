import { Controller, Get, Put, Param, Body, ParseIntPipe } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async getMatches() {
    return this.matchesService.getMatchesByPhase();
  }

  @Get('all')
  async getAllMatches() {
    return this.matchesService.getAllMatches();
  }

  @Get('today')
  async getMatchesToday() {
    return this.matchesService.getMatchesToday();
  }

  @Put(':id')
  async updateMatch(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      goles_a: number | null;
      goles_b: number | null;
      estado: string;
      clasifica_real?: string | null;
    },
  ) {
    return this.matchesService.updateMatchScore(
      id,
      body.goles_a,
      body.goles_b,
      body.estado,
      body.clasifica_real,
    );
  }
}

