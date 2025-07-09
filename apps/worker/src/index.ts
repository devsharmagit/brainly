import dotenv from "dotenv";
dotenv.config();
import { createLinkMemory, createNoteMemory } from "./utils/memory";
import { createClient, RedisClientType } from 'redis';

export const redisClient: RedisClientType = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));



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
    console.log("Worker picked up the queue work")
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
  await redisClient.connect();
  console.log("Worker started...");
  while (true) {
    const res = await redisClient.brPop("task-queue", 0);
    if (res) {
      const task: TaskData = JSON.parse(res.element);
      await processTask(task);
    }
  }
}

startWorker().catch(console.error);
