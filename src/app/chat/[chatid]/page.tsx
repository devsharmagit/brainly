import { getChatById } from "@/app/action/chat";
import ChatInterface from "@/components/ChatInterface";

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
    <div>
      {/* ALL Chat component */}
      <ChatInterface chat={chat.data.chat} messages={chat.data.messages} />
    </div>
  );
}
