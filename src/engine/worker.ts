import { SimulationEngine } from "./simulation";

// simulation.types.ts
export interface SimulationParams {
  id: string;
  iterations: number;
  seed?: number;
  // Add your specific simulation parameters here
  [key: string]: any;
}

export interface SimulationResult {
  id: string;
  duration: number;
  result: any;
  error?: string;
}

export interface WorkerMessage {
  type: "run" | "result" | "error";
  data: SimulationParams | SimulationResult;
}

// simulation.worker.ts
// This is the worker file that runs in a separate thread
self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  if (event.data.type === "run") {
    const params = event.data.data as SimulationParams;

    try {
      const startTime = performance.now();
      const result = runSimulation(params);
      const duration = performance.now() - startTime;

      self.postMessage({
        type: "result",
        data: {
          id: params.id,
          duration,
          result,
        },
      } as WorkerMessage);
    } catch (error) {
      self.postMessage({
        type: "error",
        data: {
          id: params.id,
          duration: 0,
          result: null,
          error: error instanceof Error ? error.message : String(error),
        },
      } as WorkerMessage);
    }
  }
});

function runSimulation(params: SimulationParams): any {
  const iterations = params.iterations || 1000000;
  const engine = new SimulationEngine();
  engine.startSimulation(iterations);
}

// simulation-runner.ts
// Main class to manage parallel simulations
export class ParallelSimulationRunner {
  private workers: Worker[] = [];
  private workerPool: Worker[] = [];
  private maxWorkers: number;
  private activeJobs: Map<string, (result: SimulationResult) => void> =
    new Map();
  private jobQueue: Array<{
    params: SimulationParams;
    resolve: (result: SimulationResult) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor(maxWorkers?: number) {
    this.maxWorkers = maxWorkers || navigator.hardwareConcurrency || 4;
    this.initializeWorkers();
  }

  private initializeWorkers(): void {
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker(
        new URL("./simulation.worker.ts", import.meta.url),
      );

      worker.addEventListener(
        "message",
        (event: MessageEvent<WorkerMessage>) => {
          const message = event.data;

          if (message.type === "result" || message.type === "error") {
            const result = message.data as SimulationResult;
            const callback = this.activeJobs.get(result.id);

            if (callback) {
              callback(result);
              this.activeJobs.delete(result.id);
            }

            // Return worker to pool and process next job
            this.workerPool.push(worker);
            this.processQueue();
          }
        },
      );

      this.workers.push(worker);
      this.workerPool.push(worker);
    }
  }

  async runSimulation(params: SimulationParams): Promise<SimulationResult> {
    return new Promise((resolve, reject) => {
      this.jobQueue.push({ params, resolve, reject });
      this.processQueue();
    });
  }

  async runBatch(paramsList: SimulationParams[]): Promise<SimulationResult[]> {
    const promises = paramsList.map((params) => this.runSimulation(params));
    return Promise.all(promises);
  }

  private processQueue(): void {
    while (this.jobQueue.length > 0 && this.workerPool.length > 0) {
      const job = this.jobQueue.shift()!;
      const worker = this.workerPool.shift()!;

      this.activeJobs.set(job.params.id, (result) => {
        if (result.error) {
          job.reject(new Error(result.error));
        } else {
          job.resolve(result);
        }
      });

      worker.postMessage({
        type: "run",
        data: job.params,
      } as WorkerMessage);
    }
  }

  getStatus(): {
    totalWorkers: number;
    availableWorkers: number;
    queuedJobs: number;
    activeJobs: number;
  } {
    return {
      totalWorkers: this.maxWorkers,
      availableWorkers: this.workerPool.length,
      queuedJobs: this.jobQueue.length,
      activeJobs: this.activeJobs.size,
    };
  }

  terminate(): void {
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
    this.workerPool = [];
    this.activeJobs.clear();
    this.jobQueue = [];
  }
}

// example-usage.ts
// Example of how to use the parallel simulation runner
async function runExample() {
  // Create runner with 4 workers
  const runner = new ParallelSimulationRunner(4);

  // Run a single simulation
  const singleResult = await runner.runSimulation({
    id: "sim-1",
    iterations: 1000000,
    seed: 12345,
  });
  console.log("Single simulation result:", singleResult);

  // Run multiple simulations in parallel
  const simulations: SimulationParams[] = [];
  for (let i = 0; i < 20; i++) {
    simulations.push({
      id: `batch-sim-${i}`,
      iterations: 500000,
      seed: i * 1000,
    });
  }

  console.log("Starting batch simulation...");
  const startTime = performance.now();
  const results = await runner.runBatch(simulations);
  const totalTime = performance.now() - startTime;

  console.log(
    `Completed ${results.length} simulations in ${totalTime.toFixed(2)}ms`,
  );
  console.log(
    "Average time per simulation:",
    (totalTime / results.length).toFixed(2),
    "ms",
  );

  // Check status
  console.log("Runner status:", runner.getStatus());

  // Clean up
  runner.terminate();
}

// For Webpack or other bundlers, you might need this configuration:
// webpack.config.js snippet
/*
module.exports = {
  // ... other config
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        use: { loader: 'worker-loader' }
      }
    ]
  }
};
*/

// For Vite, workers are supported out of the box with the import.meta.url syntax

// Export for use in other modules
export { runExample };
