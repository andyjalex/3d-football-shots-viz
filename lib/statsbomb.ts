// lib/statsbomb.ts
const BASE = "https://raw.githubusercontent.com/statsbomb/open-data/master/data";

interface StatsBombMatch {
  match_id: number;
  competition: { competition_id: number; competition_name: string };
  season: { season_id: number; season_name: string };
  competition_stage: { name: string };
  home_team: { home_team_name: string };
  away_team: { away_team_name: string };
}

interface ShotEvent {
  type: { name: string };
  period: number;
  minute: number;
  player: { name: string };
  team: { name: string };
  location: [number, number]; // [x, y] on 120x80 pitch
  shot: {
    statsbomb_xg: number;
    outcome: { name: string }; // "Goal", "Saved", "Blocked", "Off T", etc.
  };
}


export async function getWorldCup2022FinalShots(): Promise<{
  shots: ShotEvent[];
  homeTeamName: string;
  awayTeamName: string;
  }> {
  // 1. Find the World Cup 2022 competition/season ids
  const competitions = await fetch(`${BASE}/competitions.json`).then(r => r.json());
  const wc2022 = competitions.find(
    (c: any) => c.competition_name === "FIFA World Cup" && c.season_name === "2022"
  );

  // 2. Find the Final within that competition/season
  const matches: StatsBombMatch[] = await fetch(
    `${BASE}/matches/${wc2022.competition_id}/${wc2022.season_id}.json`
  ).then(r => r.json());
  const final = matches.find(m => m.competition_stage.name === "Final");

  if (!final) {
  throw new Error("Could not find World Cup 2022 Final in match data");
}

  // 3. Pull events for that match, filter to second-half shots
  const events: ShotEvent[] = await fetch(`${BASE}/events/${final.match_id}.json`).then(r => r.json());
  const shots = events.filter(e => e.type.name === "Shot" && e.period === 2);
  return {
    shots,
    homeTeamName: final.home_team.home_team_name,
    awayTeamName: final.away_team.away_team_name,
  };
}