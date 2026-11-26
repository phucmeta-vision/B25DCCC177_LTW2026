import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ROUNDS, RESULT_LABELS } from './data';
import { hasSaved } from './store';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { selectMatches, setMatches, removeMatch, setGoals } from './features/matchesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { getTeamName, calcStandings, calcMatchStats } from './utils';
import StandingsTable from './components/StandingsTable';
import MatchRow from './components/MatchRow';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = 'TH03-2026';

const App = () => {
  const { data, loading, error } = useFetch('/data/matches.json');
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [roundFilter, setRoundFilter] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const searchInputRef = useRef(null);
  const initializedRef = useRef(hasSaved);

  useEffect(() => {
    if (!initializedRef.current && data) {
      initializedRef.current = true;
      dispatch(setMatches(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target.tagName;
      const isInput = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const roundMatches = useMemo(() => {
    if (roundFilter === 'all') return matches;
    return matches.filter((m) => m.round === Number(roundFilter));
  }, [matches, roundFilter]);

  const visibleMatches = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();
    if (!keyword) return roundMatches;
    return roundMatches.filter((m) => {
      const homeName = getTeamName(m.home).toLowerCase();
      const awayName = getTeamName(m.away).toLowerCase();
      return homeName.includes(keyword) || awayName.includes(keyword);
    });
  }, [roundMatches, debouncedSearch]);

  const roundStats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);

  const leaderText = useMemo(() => {
    if (matches.length === 0) return '-';
    const top = standings[0];
    return `${top.name} (${top.points} điểm)`;
  }, [matches.length, standings]);

  useEffect(() => {
    if (matches.length === 0) {
      document.title = 'Giải bóng đá khoa';
    } else {
      document.title = `${standings[0].name} dẫn đầu – Giải bóng đá khoa`;
    }
  }, [matches.length, standings]);

  const handleGoals = useCallback(
    (id, homeGoals, awayGoals) => {
      dispatch(setGoals({ id, homeGoals, awayGoals }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (match) => {
      dispatch(removeMatch(match.id));
      showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
    },
    [dispatch, showNotice]
  );

  const handleTeamShift = (e) => {
    setSearch(e.target.value);
  };

  const handleResetSample = () => {
    if (data) {
      dispatch(setMatches(data));
      showNotice('Đã đặt lại dữ liệu mẫu');
    }
  };

  if (!hasSaved && loading) {
    return (
      <div className={`app ${theme}`} data-build={BUILD_TAG}>
        <div className="container">Đang tải lịch thi đấu...</div>
      </div>
    );
  }

  if (!hasSaved && error) {
    return (
      <div className={`app ${theme}`} data-build={BUILD_TAG}>
        <div className="container">Không tải được lịch thi đấu</div>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
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
          <p>Số trận: {roundStats.count}</p>
          <p>Tổng số bàn thắng: {roundStats.goals}</p>
          <p>Bàn thắng mỗi trận: {roundStats.average}</p>
          <p>Đội dẫn đầu: {leaderText}</p>
          <h3>Phân bố kết quả</h3>
          <ul className="dist-list">
            {Object.keys(RESULT_LABELS).map((key) => {
              const count = roundStats.counts[key];
              return (
                <li key={key}>
                  <span>
                    {RESULT_LABELS[key]}: {count}
                  </span>
                  <span
                    className="dist-bar"
                    style={{ width: `${24 * count}px` }}
                  />
                </li>
              );
            })}
          </ul>
        </section>

        <section className="section">
          <h2>Lịch thi đấu</h2>
          <div className="controls-bar">
            <div>
              <label htmlFor="round-filter">Xem vòng: </label>
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

            <div>
              <label htmlFor="team-search">Tìm đội: </label>
              <input
                id="team-search"
                ref={searchInputRef}
                type="text"
                placeholder="Nhấn / để tìm..."
                value={search}
                onChange={handleTeamShift}
              />
            </div>
          </div>

          <p>Tìm thấy {visibleMatches.length} trận</p>

          {visibleMatches.length === 0 ? (
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
                  <th>Số lần render</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {visibleMatches.map((match) => (
                  <MatchRow
                    key={match.id}
                    match={match}
                    onGoals={handleGoals}
                    onRemove={handleRemove}
                  />
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: '12px' }}>
            <button type="button" onClick={handleResetSample} disabled={!data}>
              Đặt lại dữ liệu mẫu
            </button>
          </div>
        </section>

        <AddMatchForm />

        <GoalPlanner standings={standings} />
      </div>
    </div>
  );
};

export default App;