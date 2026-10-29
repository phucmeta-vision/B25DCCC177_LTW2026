import { PRIZES, MILESTONES } from './data';

// Tiền thưởng theo số câu đã trả lời đúng và lý do kết thúc:
// "win" | "wrong" | "timeout" | "quit"
export const calcPrize = (correctCount, reason) => {
  if (reason === 'win' || correctCount >= PRIZES.length) {
    return PRIZES[PRIZES.length - 1];
  }
  if (reason === 'quit') {
    return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  }
  // Sai hoặc hết giờ: chỉ giữ mốc an toàn cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[Math.max(...passed) - 1] : 0;
};

// 50:50 - chọn ngẫu nhiên 2 đáp án sai để ẩn
export const pickHidden = (answer) => {
  const wrong = [0, 1, 2, 3].filter((i) => i !== answer);
  return [...wrong].sort(() => Math.random() - 0.5).slice(0, 2);
};

// Hỏi khán giả: trả về mảng 4 phần trăm, tổng = 100.
// Đáp án đúng 40-70% và luôn cao nhất; đáp án đã bị 50:50 ẩn thì 0%.
export const audienceVotes = (answer, hidden) => {
  const others = [0, 1, 2, 3].filter((i) => i !== answer && !hidden.includes(i));

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const correct = 40 + Math.floor(Math.random() * 31);
    const rest = 100 - correct;
    const weights = others.map(() => Math.random() + 0.2);
    const total = weights.reduce((sum, w) => sum + w, 0);
    const shares = weights.map((w) => Math.floor((rest * w) / total));
    shares[shares.length - 1] += rest - shares.reduce((sum, s) => sum + s, 0);

    if (Math.max(...shares) < correct) {
      const votes = [0, 0, 0, 0];
      votes[answer] = correct;
      others.forEach((optionIndex, k) => {
        votes[optionIndex] = shares[k];
      });
      return votes;
    }
  }

  // Dự phòng (hầu như không bao giờ chạy tới)
  const votes = [0, 0, 0, 0];
  votes[answer] = 70;
  others.forEach((optionIndex, k) => {
    votes[optionIndex] = k === others.length - 1 ? 30 - Math.floor(30 / others.length) * (others.length - 1) : Math.floor(30 / others.length);
  });
  return votes;
};