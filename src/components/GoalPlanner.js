import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TEAMS } from '../data';
import { setTeamId, setTarget, setRemaining } from '../features/goalSlice';
import { calcNeeded } from '../utils';

const GoalPlanner = ({ standings }) => {
  const { teamId, target, remaining } = useSelector((state) => state.goal);
  const dispatch = useDispatch();

  const resultMessage = useMemo(
    () => calcNeeded(standings, teamId, target, remaining),
    [standings, teamId, target, remaining]
  );

  return (
    <section className="section">
      <h2>Mục tiêu điểm</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="goal-team">Đội của bạn</label>
          <select
            id="goal-team"
            value={teamId}
            onChange={(e) => dispatch(setTeamId(e.target.value))}
          >
            {TEAMS.map((t) => (
              <option key={t.id} value={String(t.id)}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="goal-target">Số điểm mục tiêu</label>
          <input
            id="goal-target"
            type="number"
            min="0"
            value={target}
            onChange={(e) => dispatch(setTarget(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal-remaining">Số trận còn lại</label>
          <input
            id="goal-remaining"
            type="number"
            min="1"
            value={remaining}
            onChange={(e) => dispatch(setRemaining(e.target.value))}
          />
        </div>
      </div>
      <p style={{ marginTop: '12px', fontWeight: 500 }}>{resultMessage}</p>
    </section>
  );
};

export default GoalPlanner;