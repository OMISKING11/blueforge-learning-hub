import { requireChatGPTUser, chatGPTSignOutPath } from "./chatgpt-auth";
import LearningHub from "./learning-hub";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await requireChatGPTUser("/");
  return <LearningHub displayName={user.fullName?.split(" ")[0] ?? "Defender"} signOutPath={chatGPTSignOutPath("/")} />;
}
