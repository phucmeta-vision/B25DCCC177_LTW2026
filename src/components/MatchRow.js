import React, { useRef } from 'react';
import { RESULT_LABELS } from '../data';
import { getTeamName, getResult, isValidGoals } from '../utils';

const MatchRow = React.memo(({ match, onGoals, onRemove }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);
  const result = getResult(match);

  const handleHomeChange = (e) => {
    const val = e.target.valueAsNumber;
    if (!isValidGoals(val)) return;
    onGoals(match.id, val, match.awayGoals);
  };

  const handleAwayChange = (e) => {
    const val = e.target.valueAsNumber;
    if (!isValidGoals(val)) return;
    onGoals(match.id, match.homeGoals, val);
  };

  return (
    <tr className={result === 'draw' ? 'draw-row' : undefined}>
      <td>{match.round}</td>
      <td>{homeName}</td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
          value={match.homeGoals}
          onChange={handleHomeChange}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
          value={match.awayGoals}
          onChange={handleAwayChange}
        />
      </td>
      <td>{awayName}</td>
      <td>{RESULT_LABELS[result]}</td>
      <td>{renderCount.current}</td>
      <td>
        <button type="button" onClick={() => onRemove(match)}>
          Xóa
        </button>
      </td>
    </tr>
  );
});

export default MatchRow;