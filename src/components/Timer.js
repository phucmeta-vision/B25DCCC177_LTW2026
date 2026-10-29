const Timer = ({ timeLeft }) => (
  <div className={`timer${timeLeft <= 10 ? ' danger' : ''}`}>Còn {timeLeft} giây</div>
);

export default Timer;
