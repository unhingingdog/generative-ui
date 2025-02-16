// main.ts
import './style.css';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';
import { startChatCycle } from './chatCycle';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="root"></div>
  </div>
`;

const root = document.getElementById('root');
startChatCycle(root);
