import { LETTERS } from '../data';

// votes: mảng 4 phần trăm, tổng bằng 100
const AudienceChart = ({ votes }) => (
  <div className="chart" aria-label="Biểu đồ khán giả bình chọn">
    {votes.map((percent, i) => (
      <div key={i} className="chart-col">
        <div className="chart-track">
          <div className="chart-bar" style={{ height: `${percent}%` }} />
        </div>
        <span className="chart-letter">
          {LETTERS[i]}: {percent}%
        </span>
      </div>
    ))}
  </div>
);

export default AudienceChart;
