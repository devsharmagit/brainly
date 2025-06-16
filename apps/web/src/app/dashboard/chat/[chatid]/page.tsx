import { getChatById } from "@/app/action/chat";
import ChatInterface from "@/components/ChatInterface";
import Context from "@/components/Context";
import { Separator } from "@/components/ui/separator"

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
    <div className="flex m-auto justify-center h-[90vh]">
      {/* ALL Chat component */}
      <ChatInterface chat={chat.data.chat} messages={chat.data.messages} />
      {/* context */}
      <Separator orientation="vertical" className="border-red-500"/>
      <Context memories={chat.data.chat.context} />
    </div>
  );
}
