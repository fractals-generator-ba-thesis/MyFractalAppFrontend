type Task = {
    data: object;
    resolve: (buf: ArrayBuffer) => void;
};

export class WorkerPool {
    // private workers: Worker[] = [];
    private queue: Task[] = [];
    private idle: Worker[] = [];

    constructor(size: number, workerUrl: string) {
        for (let i = 0; i < size; i++) {
            const w = new Worker(new URL(workerUrl, import.meta.url),
                { type: "module" });
            w.onmessage = (e) => {
                const { buffer } = e.data;
                const task = (w as any)._currentTask;
                if (task) task.resolve(buffer);
                this.idle.push(w);
                this.dispatch();
            };
            this.idle.push(w);
        }
    }

    post(data: object): Promise<ArrayBuffer> {
        return new Promise((resolve) => {
            this.queue.push({ data, resolve });
            this.dispatch();
        });
    }

    private dispatch() {
        while (this.queue.length > 0 && this.idle.length > 0) {
            const worker = this.idle.pop()!;
            const task = this.queue.shift()!;
            (worker as any)._currentTask = task;
            worker.postMessage(task.data);
        }
    }
}