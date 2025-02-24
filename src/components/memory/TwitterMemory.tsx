import { Memory } from "@prisma/client";
import React from "react";
import { Tweet } from "react-tweet";

const extractTweetId = (link: string) => {
  const match = link.match(/status\/(\d+)/);
  return match ? match[1] : null;
};

const TwitterMemory = ({ memory }: { memory: Memory }) => {
  if (!memory.link) return null;

  const tweetId = extractTweetId(memory.link);
  if (!tweetId) return null;

  return <Tweet id={tweetId} />;
};

export default TwitterMemory;
