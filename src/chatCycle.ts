import { initChatSession, promptLLM } from './client';
import { buildTree } from './components';
import { Component, UserPromptSubmitHandler } from './models';

export async function startChatCycle(root: HTMLElement): Promise<void> {
  await initChatSession();
  // Auto-submit an initial prompt on load
  await handleUserSubmit(
    root,
    'Please initialise conversation with detailed UI template.',
  );
}

async function handleUserSubmit(
  root: HTMLElement,
  userInput: string,
): Promise<void> {
  // Clear root and display a loading indicator
  root.innerHTML = '';
  const loadingEl = document.createElement('p');
  loadingEl.textContent = 'Loading...';
  root.appendChild(loadingEl);

  // Get response from the LLM via client.ts
  const response = await promptLLM(userInput);
  let tree: Component | Component[];
  try {
    tree = JSON.parse(response);
  } catch (error) {
    tree = { type: 'text-node', content: 'Error parsing response' };
  }

  // Rebuild the UI with the new tree and attach a submit handler to sustain conversation
  buildTree(root, tree, {
    onSubmit: async (data) => {
      // Pass the submitted data (as JSON) back into the chat cycle
      await handleUserSubmit(root, JSON.stringify(data));
    },
  });
}
