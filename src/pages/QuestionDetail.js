import { useNavigate, useParams } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) return <p className="notice">Đang tải câu hỏi...</p>;
  if (error) return <p className="notice error">{error}</p>;

  const question = questions.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <div>
        <p className="notice error">Không tìm thấy câu hỏi</p>
        <button type="button" className="btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>
        Câu hỏi số {question.id} ({LEVELS[question.level]})
      </h1>
      <p className="detail-question">{question.question}</p>
      <ul className="detail-options">
        {question.options.map((option, i) => (
          <li key={i} className={i === question.answer ? 'right' : ''}>
            {LETTERS[i]}. {option}
            {i === question.answer && <strong> (Đáp án đúng)</strong>}
          </li>
        ))}
      </ul>
      <button type="button" className="btn" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </div>
  );
};

export default QuestionDetail;
