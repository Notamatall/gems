export class SpinEngine {
  async spinReels() {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const FALL_DURATION = 2000; // Duration for each symbol to fall
    const REEL_DELAY = 200; // Delay between each reel starting
    const SYMBOL_DELAY = 50; // Small delay between symbols in same reel
    const FALL_DISTANCE = this.reelContainer.height + 200; // How far symbols fall

    // Process each reel with delay
    for (let reelIndex = 0; reelIndex < REEL_WIDTH; reelIndex++) {
      setTimeout(() => {
        const reelContainer = this.reelContainer.children[
          reelIndex
        ] as Container;

        // Get all symbols in this reel
        const symbols = [...reelContainer.children] as Sprite[];

        // Animate each symbol in this reel
        symbols.forEach((symbol, symbolIndex) => {
          setTimeout(() => {
            // Store original position
            const originalY = symbol.y;

            // Create falling animation
            const fallTween = {
              target: symbol,
              startY: originalY,
              endY: originalY + FALL_DISTANCE,
              startTime: Date.now(),
              duration: FALL_DURATION,
              easing: this.easeInQuad, // Accelerating fall
            };

            // Add to animation queue
            this.addFallAnimation(fallTween, () => {
              // On complete: replace with new symbol
              this.replaceSymbolWithNew(reelContainer, symbol, originalY);
            });
          }, symbolIndex * SYMBOL_DELAY);
        });
      }, reelIndex * REEL_DELAY);
    }

    // Set spinning to false after all animations complete
    setTimeout(
      () => {
        this.isSpinning = false;
      },
      REEL_WIDTH * REEL_DELAY + FALL_DURATION + REEL_HEIGHT * SYMBOL_DELAY,
    );
  }

  // Animation system
  private fallAnimations: any[] = [];

  addFallAnimation(tween: any, onComplete: () => void) {
    tween.onComplete = onComplete;
    this.fallAnimations.push(tween);
  }

  // Add this to your game loop/ticker
  updateFallAnimations() {
    const now = Date.now();

    this.fallAnimations = this.fallAnimations.filter((tween) => {
      const elapsed = now - tween.startTime;
      const progress = Math.min(elapsed / tween.duration, 1);

      // Apply easing and update position
      const easedProgress = tween.easing(progress);
      tween.target.y =
        tween.startY + (tween.endY - tween.startY) * easedProgress;

      // Check if animation is complete
      if (progress >= 1) {
        tween.onComplete();
        return false; // Remove from array
      }

      return true; // Keep in array
    });
  }

  // Easing function for natural fall
  easeInQuad(t: number): number {
    return t * t;
  }

  // Replace fallen symbol with new one
  replaceSymbolWithNew(
    reelContainer: Container,
    fallenSymbol: Sprite,
    originalY: number,
  ) {
    // Remove the fallen symbol
    reelContainer.removeChild(fallenSymbol);

    // Create new symbol at top
    const newSymbol = this.getRandomSymbol();
    newSymbol.animationSpeed = 1 / 3;
    newSymbol.loop = false;
    newSymbol.x = SMALL_SYMBOL_SIZE_PX / 2 - ANIMATION_DIFFERENCE;
    newSymbol.y = originalY - FALL_DISTANCE; // Start above visible area

    newSymbol.onComplete = () => {
      reelContainer.removeChild(newSymbol);
    };

    reelContainer.addChild(newSymbol);

    // Animate new symbol falling into place
    const settleTween = {
      target: newSymbol,
      startY: newSymbol.y,
      endY: originalY,
      startTime: Date.now(),
      duration: 800,
      easing: this.easeOutBounce,
    };

    this.addFallAnimation(settleTween, () => {
      // Symbol is now in final position
    });
  }

  // Bounce easing for settling effect
  easeOutBounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
}
