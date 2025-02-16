import OpenAI, { Configuration, OpenAIApi } from 'openai';

const key = 'temp_key';
const id = 'asst_32yWmTvd4zmRkwJxpDS9kJr6';

const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });

let threadId: string | null = null;
let assistantId: string = id;

export async function initChatSession(newAssistantId?: string): Promise<void> {
  if (newAssistantId) assistantId = newAssistantId;
  const thread = await openai.beta.threads.create();
  threadId = thread.id;
}

export async function promptLLM(userMessage: string): Promise<string> {
  if (!threadId) {
    throw new Error(
      'Chat session not initialized. Call initChatSession first.',
    );
  }

  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: userMessage,
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });
  let runStatus;

  do {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  } while (runStatus.status !== 'completed');

  const messagesResponse = await openai.beta.threads.messages.list(threadId);

  const assistantMsg = messagesResponse.data.find(
    (msg) => msg.role === 'assistant',
  );

  return assistantMsg ? assistantMsg.content[0].text.value : '{}';
}
