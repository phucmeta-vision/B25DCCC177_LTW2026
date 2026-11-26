import React, { useReducer, useEffect, useState, useMemo, useRef } from 'react';
import { TEAMS, ROUNDS, RESULT_LABELS, formatDiff } from './data';
import { useFetch } from './hooks/useFetch';
import { matchesReducer } from './matchesReducer';
import { getTeamName, getResult, isValidGoals, calcStandings, calcMatchStats } from './utils';

const App = () => {
  const { data, loading, error } = useFetch('/data/matches.json');
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const [roundFilter, setRoundFilter] = useState('all');

  const [roundInput, setRoundInput] = useState('1');
  const [homeInput, setHomeInput] = useState('');
  const [awayInput, setAwayInput] = useState('');
  const [homeGoalsInput, setHomeGoalsInput] = useState('');
  const [awayGoalsInput, setAwayGoalsInput] = useState('');
  const [errors, setErrors] = useState({});

  const homeSelectRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const filteredMatches = useMemo(() => {
    if (roundFilter === 'all') return matches;
    return matches.filter((m) => m.round === Number(roundFilter));
  }, [matches, roundFilter]);

  const filteredStats = useMemo(() => calcMatchStats(filteredMatches), [filteredMatches]);

  const leaderText = useMemo(() => {
    if (matches.length === 0) return '-';
    const top = standings[0];
    return `${top.name} (${top.points} điểm)`;
  }, [matches.length, standings]);

  const handleGoalsChange = (id, field, rawValue, currentMatch) => {
    if (!isValidGoals(rawValue)) return;
    const updated = {
      id,
      homeGoals: field === 'home' ? rawValue : currentMatch.homeGoals,
      awayGoals: field === 'away' ? rawValue : currentMatch.awayGoals,
    };
    dispatch({ type: 'SET_GOALS', payload: updated });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!homeInput) {
      newErrors.home = 'Hãy chọn đội nhà';
    }

    if (!awayInput) {
      newErrors.away = 'Hãy chọn đội khách';
    } else if (homeInput && homeInput === awayInput) {
      newErrors.away = 'Hai đội phải khác nhau';
    } else if (homeInput && awayInput) {
      const hId = Number(homeInput);
      const aId = Number(awayInput);
      const played = matches.some(
        (m) => (m.home === hId && m.away === aId) || (m.home === aId && m.away === hId)
      );
      if (played) {
        newErrors.away = 'Hai đội đã đá với nhau rồi';
      }
    }

    const parsedHomeGoals = homeGoalsInput === '' ? NaN : Number(homeGoalsInput);
    const parsedAwayGoals = awayGoalsInput === '' ? NaN : Number(awayGoalsInput);

    if (!isValidGoals(parsedHomeGoals)) {
      newErrors.homeGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }

    if (!isValidGoals(parsedAwayGoals)) {
      newErrors.awayGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    dispatch({
      type: 'ADD',
      payload: {
        round: Number(roundInput),
        home: Number(homeInput),
        away: Number(awayInput),
        homeGoals: parsedHomeGoals,
        awayGoals: parsedAwayGoals,
      },
    });

    setRoundInput('1');
    setHomeInput('');
    setAwayInput('');
    setHomeGoalsInput('');
    setAwayGoalsInput('');
    setErrors({});
    if (homeSelectRef.current) {
      homeSelectRef.current.focus();
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="container">Đang tải lịch thi đấu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="container">Không tải được lịch thi đấu</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Giải bóng đá khoa</h1>

        <section className="section">
          <h2>Bảng xếp hạng</h2>
          <table>
            <thead>
              <tr>
                <th>Hạng</th>
                <th className="text-left">Đội</th>
                <th>Trận</th>
                <th>Thắng</th>
                <th>Hòa</th>
                <th>Thua</th>
                <th>BT</th>
                <th>BB</th>
                <th>HS</th>
                <th>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => {
                const isLast = index === standings.length - 1;
                return (
                  <tr key={team.id} className={isLast ? 'last-place' : undefined}>
                    <td>{index + 1}</td>
                    <td className="text-left">{team.name}</td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.drawn}</td>
                    <td>{team.lost}</td>
                    <td>{team.gf}</td>
                    <td>{team.ga}</td>
                    <td>{formatDiff(team.diff)}</td>
                    <td>{team.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="section">
          <h2>Thống kê</h2>
          <p>Số trận: {filteredStats.count}</p>
          <p>Tổng số bàn thắng: {filteredStats.goals}</p>
          <p>Bàn thắng mỗi trận: {filteredStats.average}</p>
          <p>Đội dẫn đầu: {leaderText}</p>
        </section>

        <section className="section">
          <h2>Lịch thi đấu</h2>
          <div className="controls-bar">
            <label htmlFor="round-filter">Xem vòng:</label>
            <select
              id="round-filter"
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {ROUNDS.map((r) => (
                <option key={r} value={r}>
                  Vòng {r}
                </option>
              ))}
            </select>
          </div>

          {filteredMatches.length === 0 ? (
            <p>Chưa có trận đấu nào</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Vòng</th>
                  <th>Đội nhà</th>
                  <th>BT nhà</th>
                  <th>BT khách</th>
                  <th>Đội khách</th>
                  <th>Kết quả</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((match) => {
                  const homeName = getTeamName(match.home);
                  const awayName = getTeamName(match.away);
                  const result = getResult(match);
                  return (
                    <tr key={match.id} className={result === 'draw' ? 'draw-row' : undefined}>
                      <td>{match.round}</td>
                      <td>{homeName}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
                          value={match.homeGoals}
                          onChange={(e) =>
                            handleGoalsChange(match.id, 'home', e.target.valueAsNumber, match)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
                          value={match.awayGoals}
                          onChange={(e) =>
                            handleGoalsChange(match.id, 'away', e.target.valueAsNumber, match)
                          }
                        />
                      </td>
                      <td>{awayName}</td>
                      <td>{RESULT_LABELS[result]}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'REMOVE', payload: match.id })}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <section className="section">
          <h2>Thêm trận đấu</h2>
          <form onSubmit={handleAddSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="add-round">Vòng</label>
                <select
                  id="add-round"
                  value={roundInput}
                  onChange={(e) => setRoundInput(e.target.value)}
                >
                  {ROUNDS.map((r) => (
                    <option key={r} value={r}>
                      Vòng {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="add-home">Đội nhà</label>
                <select
                  id="add-home"
                  ref={homeSelectRef}
                  value={homeInput}
                  onChange={(e) => setHomeInput(e.target.value)}
                >
                  <option value="">-- Chọn đội --</option>
                  {TEAMS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.home && (
                  <span role="alert" className="error-msg">
                    {errors.home}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="add-away">Đội khách</label>
                <select
                  id="add-away"
                  value={awayInput}
                  onChange={(e) => setAwayInput(e.target.value)}
                >
                  <option value="">-- Chọn đội --</option>
                  {TEAMS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.away && (
                  <span role="alert" className="error-msg">
                    {errors.away}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="add-home-goals">Bàn thắng đội nhà</label>
                <input
                  id="add-home-goals"
                  type="number"
                  min="0"
                  max="20"
                  value={homeGoalsInput}
                  onChange={(e) => setHomeGoalsInput(e.target.value)}
                />
                {errors.homeGoals && (
                  <span role="alert" className="error-msg">
                    {errors.homeGoals}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="add-away-goals">Bàn thắng đội khách</label>
                <input
                  id="add-away-goals"
                  type="number"
                  min="0"
                  max="20"
                  value={awayGoalsInput}
                  onChange={(e) => setAwayGoalsInput(e.target.value)}
                />
                {errors.awayGoals && (
                  <span role="alert" className="error-msg">
                    {errors.awayGoals}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>&nbsp;</label>
                <button type="submit">Thêm trận</button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default App;