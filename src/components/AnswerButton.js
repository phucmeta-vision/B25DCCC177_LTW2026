// state: "" | "chosen" (đang chốt) | "correct" | "wrong"
const AnswerButton = ({ letter, text, state = '', hidden = false, disabled, onClick }) => (
  <button
    type="button"
    className={`answer ${state}${hidden ? ' is-hidden' : ''}`}
    disabled={disabled || hidden}
    onClick={onClick}
  >
    <span className="answer-letter">{letter}.</span>
    <span className="answer-text">{text}</span>
  </button>
);

export default AnswerButton;
