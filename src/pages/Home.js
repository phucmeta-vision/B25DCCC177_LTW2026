import { useNavigate } from 'react-router-dom';
import { MILESTONES, PRIZES, TIME_PER_QUESTION, formatMoney } from '../data';

const Home = ({ playerName, onNameChange, history }) => {
  const navigate = useNavigate();
  const canStart = playerName.trim() !== '';

  // Kỷ lục: lượt chơi có tiền thưởng cao nhất
  const best = history.reduce((b, h) => (!b || h.prize > b.prize ? h : b), null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canStart) navigate('/play');
  };

  return (
    <div className="home">
      <h1 className="title">Ai là triệu phú</h1>
      

      {best && (
        <p className="record">
          Kỷ lục: {formatMoney(best.prize)} – {best.name}
        </p>
      )}

      <section className="panel">
        <h2>Luật chơi</h2>
        <ul className="rules">
          <li>
            Trả lời lần lượt {PRIZES.length} câu hỏi trắc nghiệm, mỗi câu có{' '}
            {TIME_PER_QUESTION} giây.
          </li>
          <li>
            Trả lời đúng thì lên bậc thưởng tiếp theo; câu cuối trị giá{' '}
            {formatMoney(PRIZES[PRIZES.length - 1])}.
          </li>
          <li>
            Mốc an toàn: {MILESTONES.map((m) => `câu ${m} (${formatMoney(PRIZES[m - 1])})`).join(', ')}.
            Trả lời sai hoặc hết giờ thì bạn chỉ nhận tiền của mốc cao nhất đã vượt qua.
          </li>
          <li>
            Có 3 quyền trợ giúp, mỗi quyền dùng một lần: 50:50, Hỏi khán giả và Dừng cuộc chơi
            để mang tiền về.
          </li>
          <li>Bấm phím A, B, C, D trên bàn phím để chọn đáp án nhanh.</li>
        </ul>
      </section>

      <form className="start-form" onSubmit={handleSubmit}>
        <label htmlFor="player-name">Tên người chơi</label>
        <input
          id="player-name"
          type="text"
          value={playerName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Nhập tên của bạn"
          autoComplete="off"
        />
        <button type="submit" className="btn primary" disabled={!canStart}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;
