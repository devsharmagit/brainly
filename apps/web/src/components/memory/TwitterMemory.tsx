import { Memory } from "@repo/db/client";
import React, { Suspense } from "react";
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { TwitterComponents, EmbeddedTweet, TweetSkeleton } from "react-tweet";
import { getTweet as _getTweet } from "react-tweet/api";
import TweetNotFound from "../TweetNotFound";
import { extractTweetId } from "@/lib/utils";
import DeleteMemory from "../DeleteMemory";

const getTweet = unstable_cache(
  async (id: string) => _getTweet(id),
  ["tweet"],
  { revalidate: 3600 * 24 }
);

export const components: TwitterComponents = {
  AvatarImg: (props) => <Image {...props} alt="avatar" />,
  MediaImg: (props) => <Image {...props} fill unoptimized alt="tweet media" />,
  TweetNotFound: TweetNotFound,
};


const TweetPage = async ({ id }: { id: string }) => {
  try {
    const tweet = await getTweet(id);
    return tweet ? (
      <EmbeddedTweet tweet={tweet} components={components} />
    ) : (
      <TweetNotFound />
    );
  } catch (error) {
    console.error("Error fetching tweet:", error);
    return <TweetNotFound />;
  }
};

const TwitterMemory = ({ memory, isForDisplay }: { memory: Memory, isForDisplay : boolean | undefined }) => {
  if (!memory.link) return null;

  const tweetId = extractTweetId(memory.link);

  if (!tweetId) return null;

  return (
    <Suspense fallback={<TweetSkeleton />}>
      <div className="relative">
      {!isForDisplay && <DeleteMemory id={memory.id} /> } 
      <TweetPage id={tweetId} />
      </div>
    </Suspense>
  );
};

export default TwitterMemory;
