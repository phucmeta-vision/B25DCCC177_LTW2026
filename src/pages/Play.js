import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { PRIZES, TIME_PER_QUESTION } from '../data';
import { audienceVotes, calcPrize, pickHidden } from '../utils';

const TOTAL = PRIZES.length;
const DEFAULT_TITLE = 'Ai là triệu phú';

const Game = ({ playerName, questions, onFinish }) => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0); // câu hiện tại (0-14)
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]); // đáp án bị 50:50 ẩn
  const [votes, setVotes] = useState(null); // kết quả hỏi khán giả
  const [used, setUsed] = useState({ fifty: false, audience: false });

  const question = questions[index];

  // Kết thúc lượt chơi: tính tiền, lưu lịch sử, sang trang kết quả
  const finish = (reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
    onFinish({
      id: Date.now(),
      name: playerName,
      prize,
      correctCount,
      playedAt: new Date().toLocaleString('vi-VN'),
    });
    navigate('/result', {
      replace: true,
      state: { reason, prize, correctCount, name: playerName },
    });
  };

  // Luôn giữ bản finish mới nhất để các timer gọi tới
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  });

  // Đồng hồ 30 giây: chạy khi đang chờ người chơi chọn đáp án
  useEffect(() => {
    if (status !== 'answering') return undefined;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Hết giờ
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) {
      finishRef.current('timeout', index);
    }
  }, [status, timeLeft, index]);

  // Chờ 1 giây lộ kết quả, thêm 2 giây rồi sang câu tiếp / kết thúc
  useEffect(() => {
    if (status === 'locked') {
      const id = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(id);
    }
    if (status === 'revealed') {
      const isCorrect = selected === question.answer;
      const id = setTimeout(() => {
        if (!isCorrect) {
          finishRef.current('wrong', index);
        } else if (index === TOTAL - 1) {
          finishRef.current('win', TOTAL);
        } else {
          setIndex((i) => i + 1);
          setStatus('answering');
          setSelected(null);
          setTimeLeft(TIME_PER_QUESTION);
          setHidden([]);
          setVotes(null);
        }
      }, 2000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [status, selected, question, index]);

  // Phím tắt A-D
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const i = ['A', 'B', 'C', 'D'].indexOf(e.key.toUpperCase());
      if (e.key.length !== 1 || i < 0) return;
      if (status !== 'answering' || hidden.includes(i)) return;
      setSelected(i);
      setStatus('locked');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, hidden]);

  // Tiêu đề tab
  useEffect(() => {
    document.title = `Câu ${index + 1}/${TOTAL} – ${playerName}`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [index, playerName]);

  const handleChoose = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
  };

  const handleFifty = () => {
    if (used.fifty || status !== 'answering') return;
    setHidden(pickHidden(question.answer));
    setUsed((u) => ({ ...u, fifty: true }));
  };

  const handleAudience = () => {
    if (used.audience || status !== 'answering') return;
    setVotes(audienceVotes(question.answer, hidden));
    setUsed((u) => ({ ...u, audience: true }));
  };

  // Dừng cuộc chơi: nhận tiền của câu vừa trả lời đúng gần nhất
  const handleQuit = () => {
    if (status !== 'answering') return;
    finish('quit', index);
  };

  return (
    <div className="play">
      <section className="play-main">
        <div className="play-top">
          <Timer timeLeft={timeLeft} />
          <span className="player">{playerName}</span>
        </div>

        <QuestionCard
          number={index + 1}
          total={TOTAL}
          question={question}
          status={status}
          selected={selected}
          hidden={hidden}
          onChoose={handleChoose}
        />

        {votes && <AudienceChart votes={votes} />}

        <Lifelines
          used={used}
          disabled={status !== 'answering'}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onQuit={handleQuit}
        />
      </section>

      <MoneyLadder current={index} />
    </div>
  );
};

const Play = ({ playerName, questions, loading, error, onFinish }) => {
  // Chặn vào thẳng trang chơi khi chưa nhập tên
  if (!playerName) return <Navigate to="/" replace />;
  if (loading) return <p className="notice">Đang tải câu hỏi...</p>;
  if (error) return <p className="notice error">{error}</p>;
  if (questions.length < TOTAL) {
    return <p className="notice error">Ngân hàng câu hỏi cần ít nhất {TOTAL} câu.</p>;
  }

  return <Game playerName={playerName} questions={questions} onFinish={onFinish} />;
};

export default Play;
