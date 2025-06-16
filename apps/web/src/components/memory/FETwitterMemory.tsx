import { extractTweetId } from "@/lib/utils";
import { Memory } from "@repo/db/client";
import React from "react";
import { Tweet, TwitterComponents } from "react-tweet";
import TweetNotFound from "../TweetNotFound";

const components: TwitterComponents = {
  TweetNotFound: TweetNotFound,
};

const FETwitterMemory = ({ memory }: { memory: Memory }) => {
  if (!memory.link) return null;

  const tweetId = extractTweetId(memory.link);

  if (!tweetId) return null;

  return <Tweet id={tweetId} components={components} />;
};

export default FETwitterMemory;
