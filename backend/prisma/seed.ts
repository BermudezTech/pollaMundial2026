import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function parseSpanishDate(dateStr: string): Date {
  const cleanStr = dateStr.replace(/\s+/g, ' ').trim();
  // Regex to extract day, month, year, hour, minute, and AM/PM
  const match = cleanStr.match(/(?:[a-z]+,\s+)?(\d+)\s+de\s+([a-z]+)\s+de\s+(\d{4})\s+(\d+):(\d+)\s+(a\.\s*m\.|p\.\s*m\.)/i);
  if (!match) {
    console.warn(`Could not parse date string: "${dateStr}". Using current date.`);
    return new Date();
  }
  const day = parseInt(match[1], 10);
  const monthStr = match[2].toLowerCase();
  const year = parseInt(match[3], 10);
  let hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);
  const ampm = match[6].toLowerCase().replace(/\s/g, '');

  const months: { [key: string]: number } = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
  };
  const month = months[monthStr] ?? 0;

  if (ampm.includes('p') && hour < 12) {
    hour += 12;
  } else if (ampm.includes('a') && hour === 12) {
    hour = 0;
  }

  // Create date and adjust for Colombia's Timezone (UTC-5)
  // UTC Time = Colombia Local Time + 5 hours
  const utcDate = new Date(Date.UTC(year, month, day, hour, minute));
  utcDate.setUTCHours(utcDate.getUTCHours() + 5);
  return utcDate;
}

async function main() {
  console.log('Iniciando el proceso de seed...');

  // 1. Crear las Fases
  const fases = [
    // Grupos del A al L
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
    // Eliminación directa
    { id: 13, nombre: 'Dieciseisavos de Final', permite_empate: false },
    { id: 14, nombre: 'Octavos de Final', permite_empate: false },
    { id: 15, nombre: 'Cuartos de Final', permite_empate: false },
    { id: 16, nombre: 'Semifinales', permite_empate: false },
    { id: 17, nombre: 'Tercer Puesto', permite_empate: false },
    { id: 18, nombre: 'Final', permite_empate: false },
  ];

  for (const fase of fases) {
    await prisma.fase.upsert({
      where: { id: fase.id },
      update: { nombre: fase.nombre, permite_empate: fase.permite_empate },
      create: fase,
    });
  }
  console.log('Fases insertadas correctamente.');

  // 2. Insertar los Partidos
  const matchesPath = path.join(__dirname, 'matches.json');
  if (fs.existsSync(matchesPath)) {
    const matchesRaw = fs.readFileSync(matchesPath, 'utf-8');
    const matches = JSON.parse(matchesRaw);

    for (const match of matches) {
      const parsedDate = parseSpanishDate(match.fecha_hora_str);
      await prisma.partido.upsert({
        where: { id: match.id },
        update: {
          fase_id: match.fase_id,
          equipo_a_placeholder: match.equipo_a_placeholder,
          equipo_b_placeholder: match.equipo_b_placeholder,
          fecha_hora: parsedDate,
        },
        create: {
          id: match.id,
          fase_id: match.fase_id,
          equipo_a_placeholder: match.equipo_a_placeholder,
          equipo_b_placeholder: match.equipo_b_placeholder,
          estado: match.estado,
          fecha_hora: parsedDate,
        },
      });
    }
    console.log(`Se insertaron/actualizaron ${matches.length} partidos correctamente.`);
  } else {
    console.log('No se encontró matches.json, saltando inserción de partidos.');
  }

  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
