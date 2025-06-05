// const REELS = 6;
// const ROWS = 5;
// const TOTAL_CELLS = REELS * ROWS;
// const SPINS = 100000;

// const symbols = ['A','B','C','D','E','F','G','H','SCATTER','MULTIPLIER'];

// const symbolWeights = {
//   A: 140, B: 130, C: 120, D: 110,
//   E: 100, F: 90, G: 80, H: 70,
//   SCATTER: 30, MULTIPLIER: 30
// };

// // Helper: build payouts (8+ only)
// const buildPayout = (...values) => Array(8).fill(0).concat(values);

// const payoutTable = {
//   A: buildPayout(0.18, 0.36, 0.9, 1.8, 3.6, 9, 18, 36),
//   B: buildPayout(0.144, 0.288, 0.72, 1.44, 2.88, 7.2, 14.4, 28.8),
//   C: buildPayout(0.126, 0.252, 0.63, 1.26, 2.52, 6.3, 12.6, 25.2),
//   D: buildPayout(0.108, 0.216, 0.54, 1.08, 2.16, 5.4, 10.8, 21.6),
//   E: buildPayout(0.09, 0.18, 0.45, 0.9, 1.8, 4.5, 9, 18),
//   F: buildPayout(0.072, 0.144, 0.36, 0.72, 1.44, 3.6, 7.2, 14.4),
//   G: buildPayout(0.054, 0.108, 0.27, 0.54, 1.08, 2.7, 5.4, 10.8),
//   H: buildPayout(0.036, 0.072, 0.18, 0.36, 0.72, 1.8, 3.6, 7.2),
// };

// const symbolPool = symbols.flatMap(s => Array(symbolWeights[s]).fill(s));

// let totalPayout = 0;
// let multiplierTotal = 0;
// let multiplierHits = 0;
// let freeSpinTriggers = 0;

// for (let i = 0; i < SPINS; i++) {
//   const board = Array.from({ length: TOTAL_CELLS }, () =>
//     symbolPool[Math.floor(Math.random() * symbolPool.length)]
//   );

//   const counts = {};
//   board.forEach(sym => counts[sym] = (counts[sym] || 0) + 1);

//   const multCount = counts.MULTIPLIER || 0;
//   const scatterCount = counts.SCATTER || 0;
//   if (scatterCount >= 3) freeSpinTriggers++;

//   const roundMultiplier = Array.from({ length: multCount }, () => Math.floor(Math.random() * 99) + 2)
//                                .reduce((sum, m) => sum + m, 0);

//   multiplierHits += multCount;
//   multiplierTotal += roundMultiplier;

//   let baseWin = 0;

//   for (const sym of Object.keys(payoutTable)) {
//     const matchCount = counts[sym] || 0;
//     if (matchCount >= 8) {
//       const index = Math.min(matchCount, payoutTable[sym].length - 1);
//       baseWin += payoutTable[sym][index];
//     }
//   }

//   const finalWin = baseWin * (1 + roundMultiplier / 100);
//   totalPayout += finalWin;
// }

// const rtp = (totalPayout / SPINS) * 100;

// console.table({
//   'Spins': SPINS,
//   'RTP (%)': rtp.toFixed(2),
//   'Free Spin Triggers': freeSpinTriggers,
//   'Multiplier Hits': multiplierHits,
//   'Avg Multiplier Impact (%)': (multiplierTotal / SPINS).toFixed(2),
// });
