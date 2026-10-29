const Lifelines = ({ used, disabled, onFifty, onAudience, onQuit }) => (
  <div className="lifelines">
    <button
      type="button"
      className="lifeline"
      disabled={disabled || used.fifty}
      onClick={onFifty}
    >
      50:50
    </button>
    <button
      type="button"
      className="lifeline"
      disabled={disabled || used.audience}
      onClick={onAudience}
    >
      Hỏi khán giả
    </button>
    <button type="button" className="lifeline quit" disabled={disabled} onClick={onQuit}>
      Dừng cuộc chơi
    </button>
  </div>
);

export default Lifelines;
