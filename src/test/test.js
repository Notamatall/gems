const symbols = [1, 1, 1, 2];
const reelCnt = 2;

const payoutRate = {
  1: 0.75,
  2: 2,
};
let bet = 100;
let won = 0;
for (let index = 0; index < 10000; index++) {
  won -= bet;
  const symb = [];

  for (let r = 0; r < reelCnt; r++) {
    symb.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  if (symb[0] === symb[1]) won += bet * payoutRate[symb[0]];
}
console.log(won);
