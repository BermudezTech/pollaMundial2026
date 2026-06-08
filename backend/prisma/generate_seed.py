import re
import json

md_path = 'docs/matches.MD'
with open(md_path, 'r', encoding='utf-8') as f:
    content = f.read()

matches = []
table_rows = re.findall(r'<tr>(.*?)</tr>', content)

# 1. Parse Group Stage
group_stage_matches = []
for row in table_rows:
    cells = re.findall(r'<td[^>]*>.*?<p>(?:<span>|<strong>|<code>)(.*?)(?:</span>|</strong>|</code>)</p>.*?</td>', row, re.IGNORECASE | re.DOTALL)
    cells = [re.sub(r'<[^>]+>', '', c).strip() for c in cells]
    
    if not cells or 'FECHA' in cells or 'CÓDIGO' in cells or 'PARTIDO' in cells[0]:
        continue
        
    if len(cells) == 5 and cells[2].isdigit():
        fecha, hora, jornada, grupo, partido_text = cells
        if 'vs' in partido_text:
            parts = partido_text.split(' vs ')
            eq_a = parts[0].strip()
            eq_b = parts[1].strip()
            fase_id = ord(grupo.upper().strip()) - ord('A') + 1
            group_stage_matches.append({
                'fase_id': fase_id,
                'equipo_a_placeholder': f'{eq_a}',
                'equipo_b_placeholder': f'{eq_b}',
                'fecha_hora_str': f'{fecha} {hora}',
                'estado': 'PROGRAMADO'
            })

# Add IDs 1 to 72 to Group Stage matches
for idx, match in enumerate(group_stage_matches):
    match['id'] = idx + 1
    matches.append(match)

# 2. Programmatically generate Round of 32 (Dieciseisavos) matches (IDs 73 to 88)
# Dates: June 28 to July 3, 2026
r32_dates = [
    ("domingo, 28 de junio de 2026", "2:00 p. m."),
    ("domingo, 28 de junio de 2026", "6:00 p. m."),
    ("lunes, 29 de junio de 2026", "2:00 p. m."),
    ("lunes, 29 de junio de 2026", "6:00 p. m."),
    ("martes, 30 de junio de 2026", "2:00 p. m."),
    ("martes, 30 de junio de 2026", "6:00 p. m."),
    ("miércoles, 1 de julio de 2026", "2:00 p. m."),
    ("miércoles, 1 de julio de 2026", "6:00 p. m."),
    ("jueves, 2 de julio de 2026", "2:00 p. m."),
    ("jueves, 2 de julio de 2026", "6:00 p. m."),
    ("viernes, 3 de julio de 2026", "2:00 p. m."),
    ("viernes, 3 de julio de 2026", "6:00 p. m."),
    # Extra times to fill 16 matches
    ("domingo, 28 de junio de 2026", "9:00 p. m."),
    ("lunes, 29 de junio de 2026", "9:00 p. m."),
    ("martes, 30 de junio de 2026", "9:00 p. m."),
    ("miércoles, 1 de julio de 2026", "9:00 p. m.")
]

r32_matchups = [
    ("1º Grupo A", "3º Grupo C/D/E"),
    ("1º Grupo B", "3º Grupo A/E/F"),
    ("1º Grupo C", "3º Grupo H/I/J"),
    ("1º Grupo D", "3º Grupo B/F/G"),
    ("1º Grupo E", "2º Grupo F"),
    ("1º Grupo F", "2º Grupo E"),
    ("1º Grupo G", "2º Grupo H"),
    ("1º Grupo H", "2º Grupo G"),
    ("1º Grupo I", "2º Grupo J"),
    ("1º Grupo J", "2º Grupo I"),
    ("1º Grupo K", "2º Grupo L"),
    ("1º Grupo L", "2º Grupo K"),
    ("2º Grupo A", "2º Grupo C"),
    ("2º Grupo B", "2º Grupo D"),
    ("2º Grupo I", "2º Grupo K"),
    ("2º Grupo J", "2º Grupo L")
]

for idx in range(16):
    fecha, hora = r32_dates[idx]
    eq_a, eq_b = r32_matchups[idx]
    matches.append({
        'id': 73 + idx,
        'fase_id': 13, # Dieciseisavos
        'equipo_a_placeholder': eq_a,
        'equipo_b_placeholder': eq_b,
        'fecha_hora_str': f'{fecha} {hora}',
        'estado': 'PROGRAMADO'
    })

# 3. Parse Knockout Stages
# Shift fase_ids: Octavos -> 14, Cuartos -> 15, Semis -> 16, Tercer Puesto -> 17, Final -> 18
for row in table_rows:
    cells = re.findall(r'<td[^>]*>.*?<p>(?:<span>|<strong>|<code>)(.*?)(?:</span>|</strong>|</code>)</p>.*?</td>', row, re.IGNORECASE | re.DOTALL)
    cells = [re.sub(r'<[^>]+>', '', c).strip() for c in cells]
    
    if not cells or 'FECHA' in cells or 'CÓDIGO' in cells or 'PARTIDO' in cells[0]:
        continue

    if len(cells) >= 5 and ('O' in cells[0] or 'C' in cells[0] or 'S' in cells[0]):
        codigo, partido_name, fecha, hora, encuentro, sede = cells[:6]
        if 'vs' in encuentro:
            parts = encuentro.split(' vs ')
            eq_a = parts[0].strip()
            eq_b = parts[1].strip()
            
            fase_id = 14
            if 'O' in codigo: fase_id = 14
            elif 'C' in codigo: fase_id = 15
            elif 'S' in codigo: fase_id = 16
            
            partido_num = int(re.search(r'\d+', partido_name).group())
            matches.append({
                'id': partido_num,
                'fase_id': fase_id,
                'equipo_a_placeholder': eq_a,
                'equipo_b_placeholder': eq_b,
                'fecha_hora_str': f'{fecha} {hora}',
                'estado': 'PROGRAMADO'
            })
    elif len(cells) >= 4 and 'Partido 103' in cells[0]:
        partido_name, fecha, hora, encuentro = cells[:4]
        if 'vs' in encuentro:
            parts = encuentro.split(' vs ')
            partido_num = int(re.search(r'\d+', partido_name).group())
            matches.append({
                'id': partido_num,
                'fase_id': 17,
                'equipo_a_placeholder': parts[0].strip(),
                'equipo_b_placeholder': parts[1].strip(),
                'fecha_hora_str': f'{fecha} {hora}',
                'estado': 'PROGRAMADO'
            })
    elif len(cells) >= 4 and 'Partido 104' in cells[0]:
        partido_name, fecha, hora, encuentro = cells[:4]
        if 'vs' in encuentro:
            parts = encuentro.split(' vs ')
            partido_num = int(re.search(r'\d+', partido_name).group())
            matches.append({
                'id': partido_num,
                'fase_id': 18,
                'equipo_a_placeholder': parts[0].strip(),
                'equipo_b_placeholder': parts[1].strip(),
                'fecha_hora_str': f'{fecha} {hora}',
                'estado': 'PROGRAMADO'
            })

print(json.dumps(matches, indent=2, ensure_ascii=False))
