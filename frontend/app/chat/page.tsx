import { Suspense } from "react";
import { ChatContainer } from "./_components/ChatContainer";

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContainer />
    </Suspense>
  );
}
