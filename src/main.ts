import './style.css';
import { startChatCycle } from './chatCycle';
import type { Component, UserPromptSubmitHandler } from './models';
import { buildTree } from './components';

import { choices, complexInput } from './exampleTemplates';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="root"></div>
  </div>
`;

//const submitHandler: UserPromptSubmitHandler = {
//  onSubmit: (value) => alert(JSON.stringify(value)),
//};
//
//const root = document.getElementById('root');
//buildTree(root, complexInput, submitHandler);

startChatCycle(root);
