import { PRIZES, MILESTONES, formatMoney } from '../data';

// current: chỉ số (0-14) của câu đang chơi
const MoneyLadder = ({ current }) => {
  const rows = PRIZES.map((prize, i) => ({ prize, i })).reverse(); // câu 15 ở trên cùng

  return (
    <aside className="ladder" aria-label="Thang tiền thưởng">
      <ol>
        {rows.map(({ prize, i }) => {
          const classes = ['ladder-row'];
          if (i === current) classes.push('current');
          if (i < current) classes.push('passed');
          if (MILESTONES.includes(i + 1)) classes.push('milestone');
          return (
            <li key={i} className={classes.join(' ')}>
              <span className="ladder-no">{i + 1}</span>
              <span className="ladder-prize">{formatMoney(prize)}</span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
};

export default MoneyLadder;
