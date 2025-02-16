import {
  TextNode,
  Heading,
  Container,
  ListItem,
  List,
  Dialog,
  DialogButton,
  Form,
  FormField,
  FormSubmitButton,
  DialogPromptRequestValue,
  FormPromptRequestValue,
  UserPromptSubmitHandler,
  Component,
} from './models.ts';
import { promptLLM } from './client.ts';

const createEl = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  return el;
};

export const createTextNode = ({ content }: TextNode): HTMLElement =>
  createEl('span', content);

export const createHeading = ({ content }: Heading): HTMLElement =>
  createEl('h2', content);

// Container may have interactive children so we pass submitHandler recursively.
export const createContainer = (
  container: Container,
  submitHandler: UserPromptSubmitHandler,
): HTMLElement => {
  const div = createEl('div');
  container.children.forEach((child) =>
    div.appendChild(createComponent(child, submitHandler)),
  );
  return div;
};

export const createListItem = ({ content }: ListItem): HTMLElement =>
  createEl('li', content);

// Lists are non-interactive, so they don't need a submitHandler.
export const createList = (list: List): HTMLElement => {
  const ul = createEl('ul');
  list.children.forEach((item) => ul.appendChild(createListItem(item)));
  return ul;
};

export const createDialogButton = (
  { value }: DialogButton,
  onClick: (value: string) => void,
): HTMLElement => {
  const button = createEl('button', value);
  button.addEventListener('click', () => onClick(value));
  return button;
};

export const createDialog = (
  { id, heading, request, choices }: Dialog,
  onSubmit: (data: DialogPromptRequestValue) => void,
): HTMLElement => {
  const dialog = createEl('div');
  if (heading) {
    dialog.appendChild(createEl('h2', heading));
    dialog.appendChild(createEl('br'));
  }
  dialog.appendChild(createEl('p', request));
  const choicesContainer = createEl('div');
  choices.forEach((btn) =>
    choicesContainer.appendChild(
      createDialogButton(btn, () => onSubmit({ id, value: btn.value })),
    ),
  );
  dialog.appendChild(choicesContainer);
  return dialog;
};

export const createForm = (
  { id, fields, submitButton }: Form,
  onSubmit: (data: FormPromptRequestValue) => void,
): HTMLFormElement => {
  const form = createEl('form') as HTMLFormElement;
  form.id = id;

  fields.forEach(({ id, label }) => {
    const fieldContainer = createEl('div');
    const labelEl = createEl('label', label) as HTMLLabelElement;
    labelEl.htmlFor = id;
    const input = createEl('input') as HTMLInputElement;
    input.type = 'text';
    input.id = id;
    input.name = id;
    fieldContainer.append(labelEl, input);
    form.appendChild(fieldContainer);
  });

  const submitBtn = createEl('button', submitButton.label) as HTMLButtonElement;
  submitBtn.type = 'submit';
  form.appendChild(submitBtn);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data: FormPromptRequestValue = { id } as FormPromptRequestValue;
    formData.forEach((value, key) => (data[key] = value.toString()));
    onSubmit(data);
  });

  return form;
};

export const createComponent = (
  component: Component,
  submitHandler: UserPromptSubmitHandler,
): HTMLElement => {
  const type = component.type.toLowerCase();
  switch (type) {
    case 'text-node':
      return createTextNode(component as TextNode);
    case 'heading':
      return createHeading(component as Heading);
    case 'container':
      return createContainer(component as Container, submitHandler);
    case 'list-item':
      return createListItem(component as ListItem);
    case 'list':
      return createList(component as List);
    case 'dialog':
      return createDialog(component as Dialog, submitHandler.onSubmit);
    case 'dialog-button':
      return createDialogButton(component as DialogButton, () => {});
    case 'form':
      return createForm(component as Form, submitHandler.onSubmit);
    case 'form-field':
    case 'form-submit-button':
      throw new Error(
        `Component type ${component.type} must be nested inside a form.`,
      );
    default:
      throw new Error(`Unknown component type: ${component.type}`);
  }
};

export const buildTree = (
  root: HTMLElement,
  tree: Component | Component[],
  submitHandler: UserPromptSubmitHandler,
): void => {
  root.innerHTML = '';
  const components = Array.isArray(tree) ? tree : [tree];
  components.forEach((comp) => {
    root.appendChild(createComponent(comp, submitHandler));
  });
};
