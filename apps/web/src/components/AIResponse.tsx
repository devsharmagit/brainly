import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";

const AIResponse = ({ response }: { response: string }) => {
  return (
    <div className={cn("flex gap-2 max-w-[75%]")}>
      <div className="relative w-8 h-8 min-w-8">
        <Image
          src="/gemini.png"
          alt="Gemini AI"
          className="object-contain h-10 w-10"
         height={32}
         width={32}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Gemini&apos;s Response</span>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-base whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              a: ({  ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                />
              ),
              ul: ({ ...props }) => (
                <ul {...props} className="list-disc pl-4" />
              ),
            }}
          >
            {response}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default AIResponse;
