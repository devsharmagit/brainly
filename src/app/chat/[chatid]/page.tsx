import { getChatById } from "@/app/action/chat";
import ChatInterface from "@/components/ChatInterface";
import Context from "@/components/Context";

export default async function Page({
  params,
}: {
  params: Promise<{ chatid: string }>;
}) {
  const { chatid } = await params;

  const chat = await getChatById({ chatId: Number(chatid) });

  if (!chat.success) {
    return null;
  }

  return (
    <div className="flex m-auto justify-center">
      {/* ALL Chat component */}
      <ChatInterface chat={chat.data.chat} messages={chat.data.messages} />
      {/* context */}
      <Context memories={chat.data.chat.context} />
    </div>
  );
}
