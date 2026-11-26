import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ROUNDS, RESULT_LABELS } from './data';
import { useFetch } from './hooks/useFetch';
import { selectMatches, setMatches, removeMatch, setGoals } from './features/matchesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { getTeamName, getResult, isValidGoals, calcStandings, calcMatchStats } from './utils';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';

const App = () => {
  const { data, loading, error } = useFetch('/data/matches.json');
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [roundFilter, setRoundFilter] = useState('all');

  useEffect(() => {
    if (data) {
      dispatch(setMatches(data));
    }
  }, [data, dispatch]);

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
    dispatch(
      setGoals({
        id,
        homeGoals: field === 'home' ? rawValue : currentMatch.homeGoals,
        awayGoals: field === 'away' ? rawValue : currentMatch.awayGoals,
      })
    );
  };

  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  };

  if (loading) {
    return (
      <div className={`app ${theme}`}>
        <div className="container">Đang tải lịch thi đấu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app ${theme}`}>
        <div className="container">Không tải được lịch thi đấu</div>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <div className="header-bar">
          <h1>Giải bóng đá khoa</h1>
          <button type="button" onClick={toggleTheme}>
            {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          </button>
        </div>

        <StandingsTable standings={standings} />

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
                        <button type="button" onClick={() => handleRemove(match)}>
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

        <AddMatchForm />

        <GoalPlanner standings={standings} />
      </div>
    </div>
  );
};

export default App;