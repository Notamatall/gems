//  startPlay() {
//     console.log("here");
//     if (this.isSpinning) return;
//     this.isSpinning = true;

//     for (let i = 0; i < this.reelContainers.length; i++) {
//       const r = this.reelContainers[i];
//       const extra = Math.floor(Math.random() * 3);
//       const target = r.position + 10 + i * 5 + extra;
//       const time = 500 + i * 100 + extra * 600;

//       this.tweenTo(
//         r,
//         "position",
//         target,
//         time,
//         this.backout(0.5),
//         null,
//         i === this.reelContainers.length - 1 ? this.reelsComplete : null,
//       );
//     }
//   }

//   tweenTo(object, property, target, time, easing, onchange, oncomplete) {
//     const tween = {
//       object,
//       property,
//       propertyBeginValue: object[property],
//       target,
//       easing,
//       time,
//       change: onchange,
//       complete: oncomplete,
//       start: Date.now(),
//     };

//     this.tweening.push(tween);
//     return tween;
//   }

//   // Reels done handler.
//   reelsComplete() {
//     this.isSpinning = false;
//   }
//   // Basic lerp function.
//   lerp(a1, a2, t) {
//     return a1 * (1 - t) + a2 * t;
//   }

//   // Backout function from tweenjs.
//   backout(amount) {
//     return (t) => --t * t * ((amount + 1) * t + amount) + 1;
//   }

//   runLoop(app: Application) {
//     // Animation loops
//     app.ticker.add(() => {
//       // Update the slots.
//       for (let i = 0; i < this.reelContainers.length; i++) {
//         const r = this.reelContainers[i];
//         r.previousPosition = r.position;

//         // Update symbol positions on reel.
//         for (let j = 0; j < r.symbols.length; j++) {
//           const s = r.symbols[j];

//           // s.y =
//           //   ((r.position + j) % r.symbols.length) * SMALL_SYMBOL_SIZE_PX -
//           //   SMALL_SYMBOL_SIZE_PX;
//         }
//       }

//       // Handle tweening
//       const now = Date.now();
//       const remove = [];

//       for (let i = 0; i < this.tweening.length; i++) {
//         const t = this.tweening[i];
//         const phase = Math.min(1, (now - t.start) / t.time);

//         t.object[t.property] = this.lerp(
//           t.propertyBeginValue,
//           t.target,
//           t.easing(phase),
//         );
//         if (t.change) t.change(t);
//         if (phase === 1) {
//           t.object[t.property] = t.target;
//           if (t.complete) t.complete(t);
//           remove.push(t);
//         }
//       }
//       for (let i = 0; i < remove.length; i++) {
//         this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
//       }
//     });
//   }
