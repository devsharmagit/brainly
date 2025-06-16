import Redis from "ioredis";

export const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL!, {
  password: process.env.UPSTASH_REDIS_REST_TOKEN!,
  tls: {},
});
