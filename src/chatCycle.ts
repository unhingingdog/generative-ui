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

const createLoadingComponent = (
  content: string,
  parentEl: HTMLElement,
): (() => void) => {
  let ellipsisCount = 0;
  const loadingEl = document.createElement('p');
  loadingEl.classList.add('loading');
  loadingEl.textContent = content + '.'.repeat(ellipsisCount);
  parentEl.appendChild(loadingEl);

  const interval = setInterval(() => {
    ellipsisCount = (ellipsisCount + 1) % 4;
    loadingEl.textContent = content + '.'.repeat(ellipsisCount);
  }, 600);

  const remove = () => {
    parentEl.removeChild(loadingEl);
    clearInterval(interval);
  };
};

async function handleUserSubmit(
  root: HTMLElement,
  userInput: string,
): Promise<void> {
  // Clear root and display a loading indicator
  root.innerHTML = '';
  createLoadingComponent('Thinking', root);

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
