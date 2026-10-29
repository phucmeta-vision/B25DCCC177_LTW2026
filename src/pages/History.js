import { formatMoney } from '../data';

const History = ({ history, onClear }) => {
  if (history.length === 0) {
    return (
      <div>
        <h1>Lịch sử chơi</h1>
        <p className="notice">Chưa có lượt chơi nào</p>
      </div>
    );
  }

  // Sắp xếp trên bản sao, tiền thưởng giảm dần
  const sorted = [...history].sort((a, b) => b.prize - a.prize);
  const total = history.reduce((sum, h) => sum + h.prize, 0);
  const highest = history.reduce((max, h) => Math.max(max, h.prize), 0);

  return (
    <div>
      <div className="page-head">
        <h1>Lịch sử chơi</h1>
        <button type="button" className="btn danger" onClick={onClear}>
          Xóa lịch sử
        </button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Người chơi</th>
              <th>Số câu đúng</th>
              <th>Tiền thưởng</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h) => (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{h.correctCount}</td>
                <td>{formatMoney(h.prize)}</td>
                <td>{h.playedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="stats">
        <div>
          <dt>Số lượt chơi:</dt>
          <dd>{history.length}</dd>
        </div>
        <div>
          <dt>Tiền thưởng cao nhất:</dt>
          <dd>{formatMoney(highest)}</dd>
        </div>
        <div>
          <dt>Tổng tiền thưởng:</dt>
          <dd>{formatMoney(total)}</dd>
        </div>
      </dl>
    </div>
  );
};

export default History;
