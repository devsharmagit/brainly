"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MessageForm = () => {
  const [prompt, setPrompt] = useState<string>("");
  return (
    <>
      <div className="border-0 bg-gray-500/20 rounded-xl overflow-hidden flex gap-4 px-2 py-3">
        <Input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          placeholder="Ask anything to AI."
          className="!text-lg text-gray-200 font-medium !ring-0 !outline-0 !border-0"
        />
        <Link
          href={{
            pathname: "/chat",
            query: {
              prompt,
            },
          }}
        >
          <Button
            type="submit"
            className="bg-green-800 border-gray-600 text-white font-semibold hover:bg-green-700"
          >
            <SendHorizontal /> <span> Send </span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default MessageForm;
