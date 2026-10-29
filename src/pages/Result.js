import { Link, Navigate, useLocation } from 'react-router-dom';
import { formatMoney } from '../data';

const TITLES = {
  win: 'Chúc mừng! Bạn đã trở thành triệu phú',
  wrong: 'Rất tiếc, bạn đã trả lời sai',
  timeout: 'Hết giờ!',
};

const Result = () => {
  const { state } = useLocation();

  // Mở trực tiếp /result (không có state) thì về trang chủ
  if (!state) return <Navigate to="/" replace />;

  const { reason, prize, correctCount, name } = state;

  return (
    <div className="result">
      <h1 className={`result-title ${reason}`}>{TITLES[reason]}</h1>
      <dl className="result-info">
        <div>
          <dt>Người chơi:</dt>
          <dd>{name}</dd>
        </div>
        <div>
          <dt>Số câu trả lời đúng:</dt>
          <dd>{correctCount}</dd>
        </div>
        <div>
          <dt>Tiền thưởng:</dt>
          <dd className="money">{formatMoney(prize)}</dd>
        </div>
      </dl>
      <div className="actions">
        <Link to="/play" className="btn primary">
          Chơi lại
        </Link>
        <Link to="/" className="btn">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Result;
