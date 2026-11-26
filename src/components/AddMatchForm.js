import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TEAMS, ROUNDS } from '../data';
import { selectMatches, addMatch } from '../features/matchesSlice';
import { useNotice } from '../context/NoticeContext';
import { getTeamName, isValidGoals } from '../utils';

const AddMatchForm = () => {
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const showNotice = useNotice();

  const [roundInput, setRoundInput] = useState('1');
  const [homeInput, setHomeInput] = useState('');
  const [awayInput, setAwayInput] = useState('');
  const [homeGoalsInput, setHomeGoalsInput] = useState('');
  const [awayGoalsInput, setAwayGoalsInput] = useState('');
  const [errors, setErrors] = useState({});

  const homeSelectRef = useRef(null);

  const handleSubmit = (e) => {
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

    const hId = Number(homeInput);
    const aId = Number(awayInput);

    dispatch(
      addMatch({
        round: Number(roundInput),
        home: hId,
        away: aId,
        homeGoals: parsedHomeGoals,
        awayGoals: parsedAwayGoals,
      })
    );

    showNotice(`Đã thêm trận ${getTeamName(hId)} - ${getTeamName(aId)}`);

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

  return (
    <section className="section">
      <h2>Thêm trận đấu</h2>
      <form onSubmit={handleSubmit} noValidate>
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
  );
};

export default AddMatchForm;