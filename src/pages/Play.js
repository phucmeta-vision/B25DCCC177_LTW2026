import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import { PRIZES, TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';

const TOTAL = PRIZES.length;

const Game = ({ playerName, questions }) => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0); // câu hiện tại (0-14)
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const question = questions[index];

  // Kết thúc lượt chơi: tính tiền rồi sang trang kết quả
  const finish = (reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
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
        }
      }, 2000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [status, selected, question, index]);

  const handleChoose = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
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
          onChoose={handleChoose}
        />
      </section>

      <MoneyLadder current={index} />
    </div>
  );
};

const Play = ({ playerName, questions, loading, error }) => {
  // Chặn vào thẳng trang chơi khi chưa nhập tên
  if (!playerName) return <Navigate to="/" replace />;
  if (loading) return <p className="notice">Đang tải câu hỏi...</p>;
  if (error) return <p className="notice error">{error}</p>;
  if (questions.length < TOTAL) {
    return <p className="notice error">Ngân hàng câu hỏi cần ít nhất {TOTAL} câu.</p>;
  }

  return <Game playerName={playerName} questions={questions} />;
};

export default Play;
