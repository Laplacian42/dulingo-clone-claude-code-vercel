export interface TeamDef {
  code: string
  name: string
  count: number
}

export const TEAMS: TeamDef[] = [
  // UEFA Euro 2024 teams
  { code: 'GER', name: 'Germany', count: 25 },
  { code: 'SCO', name: 'Scotland', count: 25 },
  { code: 'HUN', name: 'Hungary', count: 25 },
  { code: 'SUI', name: 'Switzerland', count: 25 },
  { code: 'ESP', name: 'Spain', count: 25 },
  { code: 'CRO', name: 'Croatia', count: 25 },
  { code: 'ITA', name: 'Italy', count: 25 },
  { code: 'ALB', name: 'Albania', count: 25 },
  { code: 'SVN', name: 'Slovenia', count: 25 },
  { code: 'DEN', name: 'Denmark', count: 25 },
  { code: 'SRB', name: 'Serbia', count: 25 },
  { code: 'ENG', name: 'England', count: 25 },
  { code: 'POL', name: 'Poland', count: 25 },
  { code: 'NED', name: 'Netherlands', count: 25 },
  { code: 'AUT', name: 'Austria', count: 25 },
  { code: 'FRA', name: 'France', count: 25 },
  { code: 'BEL', name: 'Belgium', count: 25 },
  { code: 'SVK', name: 'Slovakia', count: 25 },
  { code: 'ROU', name: 'Romania', count: 25 },
  { code: 'UKR', name: 'Ukraine', count: 25 },
  { code: 'TUR', name: 'Türkiye', count: 25 },
  { code: 'GEO', name: 'Georgia', count: 25 },
  { code: 'POR', name: 'Portugal', count: 25 },
  { code: 'CZE', name: 'Czechia', count: 25 },
  // World Cup additions
  { code: 'BRA', name: 'Brazil', count: 25 },
  { code: 'ARG', name: 'Argentina', count: 25 },
  { code: 'USA', name: 'USA', count: 25 },
  { code: 'JPN', name: 'Japan', count: 25 },
]

export function getAllStickerIds(): string[] {
  return TEAMS.flatMap(t => Array.from({ length: t.count }, (_, i) => `${t.code}-${i + 1}`))
}

export function getTeamForSticker(stickerId: string): TeamDef | undefined {
  const code = stickerId.split('-')[0]
  return TEAMS.find(t => t.code === code)
}
