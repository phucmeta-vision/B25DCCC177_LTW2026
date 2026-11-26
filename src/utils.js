import { TEAMS, POINTS, MAX_GOALS } from './data';

export const getTeamName = (id) => {
  const team = TEAMS.find((t) => t.id === Number(id));
  return team ? team.name : '';
};

export const getResult = (match) => {
  if (match.homeGoals > match.awayGoals) return 'home';
  if (match.homeGoals < match.awayGoals) return 'away';
  return 'draw';
};

export const isValidGoals = (n) => {
  return typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;
};

export const calcStandings = (matches) => {
  const table = TEAMS.map((t) => ({
    id: t.id,
    name: t.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    diff: 0,
    points: 0,
  }));

  matches.forEach((m) => {
    const homeTeam = table.find((t) => t.id === m.home);
    const awayTeam = table.find((t) => t.id === m.away);
    if (!homeTeam || !awayTeam) return;

    homeTeam.played += 1;
    awayTeam.played += 1;
    homeTeam.gf += m.homeGoals;
    homeTeam.ga += m.awayGoals;
    awayTeam.gf += m.awayGoals;
    awayTeam.ga += m.homeGoals;

    const result = getResult(m);
    if (result === 'home') {
      homeTeam.won += 1;
      homeTeam.points += POINTS.win;
      awayTeam.lost += 1;
      awayTeam.points += POINTS.loss;
    } else if (result === 'away') {
      awayTeam.won += 1;
      awayTeam.points += POINTS.win;
      homeTeam.lost += 1;
      homeTeam.points += POINTS.loss;
    } else {
      homeTeam.drawn += 1;
      awayTeam.drawn += 1;
      homeTeam.points += POINTS.draw;
      awayTeam.points += POINTS.draw;
    }
  });

  table.forEach((t) => {
    t.diff = t.gf - t.ga;
  });

  return [...table].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.diff !== a.diff) return b.diff - a.diff;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name, 'vi');
  });
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;

  matches.forEach((m) => {
    goals += m.homeGoals + m.awayGoals;
    const res = getResult(m);
    counts[res] += 1;
  });

  const count = matches.length;
  const average = count === 0 ? '0.00' : (Math.round((goals / count) * 100) / 100).toFixed(2);

  return { count, goals, average, counts };
};