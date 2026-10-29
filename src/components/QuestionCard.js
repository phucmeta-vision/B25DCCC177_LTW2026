import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({ number, total, question, status, selected, hidden, onChoose }) => {
  const getState = (i) => {
    if (status === 'locked' && i === selected) return 'chosen';
    if (status === 'revealed') {
      if (i === question.answer) return 'correct';
      if (i === selected) return 'wrong';
    }
    return '';
  };

  return (
    <section className="question-card">
      <p className="question-number">
        Câu {number}/{total}
      </p>
      <h2 className="question-text">{question.question}</h2>
      <div className="answers">
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            hidden={hidden.includes(i)}
            disabled={status !== 'answering'}
            onClick={() => onChoose(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default QuestionCard;