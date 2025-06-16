import { createLinkMemory, createNoteMemory } from "./utils/memory";
import { createClient } from 'redis';

export const redis = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!)
    }
});

redis.on('error', err => console.log('Redis Client Error', err));



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
  await redis.connect();
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
