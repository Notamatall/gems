export class SlotMathEngine{

function combinations(n, k) {
  if (k > n) return 0;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res *= (n - i + 1) / i;
  }
  return res;
}

function binomialProbability(n, k, p) {
  const comb = combinations(n, k);
  return comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Probability of K or more
function probabilityAtLeastK(n, k, p) {
  let sum = 0;
  for (let i = k; i <= n; i++) {
    sum += binomialProbability(n, i, p);
  }
  return sum;
}

// Example usage:
console.log('P(8 or more out of 30, p=0.15):', probabilityAtLeastK(30, 8, 0.15));

}
