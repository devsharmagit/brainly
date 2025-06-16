import Redis from "ioredis";
import { createLinkMemory, createNoteMemory } from "./utils/memory";

const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL!, {
  password: process.env.UPSTASH_REDIS_REST_TOKEN!,
  tls: {},
});

enum DATA_TYPE {
  LINK,
  NOTE,
}

interface TaskData {
  processId: number;
  data: string;
  userId: number;
  type: DATA_TYPE;
}

async function processTask(task: TaskData) {
    console.log("Worker pickked up the queue work")
  if (task.type == DATA_TYPE.LINK) {
    await createLinkMemory({
      processId: task.processId,
      link: task.data,
      userId: task.userId,
    });
  } else {
    await createNoteMemory({
      processId: task.processId,
      note: task.data,
      userId: task.userId,
    });
  }
}

async function startWorker() {
  console.log("Worker started...");
  while (true) {
    const res = await redis.brpop("task-queue", 0);
    if (res) {
      const task: TaskData = JSON.parse(res[1]);
      await processTask(task);
    }
  }
}

startWorker().catch(console.error);
