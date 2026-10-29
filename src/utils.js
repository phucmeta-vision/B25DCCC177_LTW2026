import { PRIZES, MILESTONES } from './data';

// Tiền thưởng theo số câu đã trả lời đúng và lý do kết thúc:
// "win" | "wrong" | "timeout"
export const calcPrize = (correctCount, reason) => {
  if (reason === 'win' || correctCount >= PRIZES.length) {
    return PRIZES[PRIZES.length - 1];
  }
  // Sai hoặc hết giờ: chỉ giữ mốc an toàn cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[Math.max(...passed) - 1] : 0;
};
