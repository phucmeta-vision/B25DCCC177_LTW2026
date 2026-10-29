import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const FILTERS = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: LEVELS[1] },
  { value: 2, label: LEVELS[2] },
  { value: 3, label: LEVELS[3] },
];

const QuestionBank = ({ questions, loading, error }) => {
  const [level, setLevel] = useState(0);
  const [keyword, setKeyword] = useState('');

  if (loading) return <p className="notice">Đang tải câu hỏi...</p>;
  if (error) return <p className="notice error">{error}</p>;

  const kw = keyword.trim().toLowerCase();
  const filtered = questions.filter(
    (q) =>
      (level === 0 || q.level === level) && q.question.toLowerCase().includes(kw)
  );

  return (
    <div>
      <h1>Ngân hàng câu hỏi</h1>

      <div className="toolbar">
        <div className="filters" role="group" aria-label="Lọc theo mức độ">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`chip${level === f.value ? ' active' : ''}`}
              onClick={() => setLevel(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm"
          aria-label="Tìm kiếm câu hỏi"
        />
      </div>

      <p className="count">Có {filtered.length} câu hỏi</p>

      {filtered.length === 0 ? (
        <p className="notice">Không có câu hỏi nào</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mức độ</th>
                <th>Câu hỏi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr key={q.id}>
                  <td>{i + 1}</td>
                  <td>{LEVELS[q.level]}</td>
                  <td>
                    <Link to={`/questions/${q.id}`}>{q.question}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
