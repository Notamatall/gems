// const TOTAL_SPINS = 100000;
// const REELS = 6;
// const ROWS = 5;
// const TOTAL_CELLS = REELS * ROWS;

// // Adjusted weights — regular symbols more common
// const symbolWeights = {
//   A: 160,
//   B: 150,
//   C: 140,
//   D: 130,
//   E: 120,
//   F: 110,
//   G: 100,
//   H: 90,
//   SCATTER: 30,
//   MULTIPLIER: 30,
// };

// const symbols = Object.entries(symbolWeights).flatMap(([symbol, weight]) =>
//   Array(weight).fill(symbol),
// );

// // Payout table — payouts only for 8+
// const payout = (base) =>
//   Array(8)
//     .fill(0)
//     .concat([
//       base * 2.5,
//       base * 4,
//       base * 7,
//       base * 15,
//       base * 25,
//       base * 55,
//       base * 110,
//       base * 175,
//       base * 210,
//     ]);

// const payoutTable = {
//   A: payout(1),
//   B: payout(0.9),
//   C: payout(0.85),
//   D: payout(0.8),
//   E: payout(0.7),
//   F: payout(0.6),
//   G: payout(0.5),
//   H: payout(0.4),
// };

// // Simulation state
// let totalWin = 0;
// let multiplierHits = 0;
// let totalMultiplierAdded = 0;
// let freeSpinTriggers = 0;

// for (let spin = 0; spin < TOTAL_SPINS; spin++) {
//   const board = Array.from({ length: TOTAL_CELLS }, () => {
//     return symbols[Math.floor(Math.random() * symbols.length)];
//   });

//   const counts = {};
//   board.forEach((s) => (counts[s] = (counts[s] || 0) + 1));

//   // Multiplier effect
//   let roundMultiplier = 0;
//   if (counts["MULTIPLIER"]) {
//     multiplierHits += counts["MULTIPLIER"];
//     for (let i = 0; i < counts["MULTIPLIER"]; i++) {
//       roundMultiplier += Math.floor(Math.random() * 99 + 2); // [2–100]
//     }
//     totalMultiplierAdded += roundMultiplier;
//   }

//   // Free spin trigger
//   if ((counts["SCATTER"] || 0) >= 3) {
//     freeSpinTriggers++;
//   }

//   // Base win
//   let baseWin = 0;
//   for (let symbol of Object.keys(payoutTable)) {
//     const count = counts[symbol] || 0;
//     if (count >= 8) {
//       const safeIndex = Math.min(count, payoutTable[symbol].length - 1);
//       baseWin += payoutTable[symbol][safeIndex];
//     }
//   }

//   totalWin += baseWin * (1 + roundMultiplier / 100);
// }

// // 📊 Output
// console.log("--- SLOT MATH MODEL RESULT ---");
// console.log("Total Spins:", TOTAL_SPINS);
// console.log("Total Payout:", totalWin.toFixed(2));
// console.log("RTP (%):", ((totalWin / TOTAL_SPINS) * 100).toFixed(2));
// console.log("Free Spin Triggers:", freeSpinTriggers);
// console.log("Multiplier Hits:", multiplierHits);
// console.log(
//   "Avg Multiplier per Spin (%):",
//   (totalMultiplierAdded / TOTAL_SPINS).toFixed(2),
// );
