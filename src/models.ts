/**
 * A standalone text component.
 *
 * Usage: Paragraph copy or any necessary text content that cannot be placed in the
 * content or value field of another component.
 */
export interface TextNode {
  type: 'text-node';
  content: string;
}

/**
 * Heading.
 *
 * Usage: Used to summarize the purpose of the UI being displayed to the user.
 * Do not use this if the purpose is clear from the context of
 * the other components.
 */
export interface Heading {
  type: 'heading';
  content: string;
}

/**
 * A general purpose container to group related content.
 *
 * Usage: For building up complex, nested interfaces in an organised way.
 */
export interface Container {
  type: 'container';
  children: (TextNode | Heading | List | Form | Dialog)[];
}

/**
 * ListItem holds arbitrary listed text content.
 *
 * Usage: used inside a List component only.
 */
export interface ListItem {
  type: 'list-item';
  content: string;
}

/**
 * List holds arbitrary groups of related data.
 *
 * Usage: Presenting complex, informative data which does not require a user input in response.
 * Use to make responses more structured and readable.
 */
export interface List {
  type: 'list';
  children: ListItem[];
}

/**
 * A button for a user response to a dialog. Value will be displayed as button text content.
 * When clicked, the UI dialog element will submit the displayed value in association
 * with the parent dialog's id.
 */
export interface DialogButton {
  type: 'dialog-button';
  value: string;
}

/**
 * Dialog element presented to the user to select one of many options.
 * When the button UI element is clicked, its value is sent to the LLM to answer
 * the question posed in the Dialog's request field.
 *
 * Usage: Guiding the user to extract information in order to assist them. Pose a question
 * or summarize choices to the user via the request field. Answers or choices to be selected
 * by the user are to be placed in the dialog button content.
 *
 * To be preferred to free-text form inputs, where possible.
 * The heading is optional. Only include it if the request field is long or complicated.
 *
 * Resulting user prompt format:
 * { id: <dialog id>, value: <value of dialog button clicked> }
 */
export interface Dialog {
  type: 'dialog';
  id: string;
  heading?: string;
  request: string;
  choices: DialogButton[];
}

/**
 * A form field for structured inputs to the LLM. Field data is submitted to the LLM
 * in the form, with id as field key, and values as the current UI element input state.
 */
export interface FormField {
  type: 'form-field';
  id: string;
  label: string;
}

/**
 * A button to submit a form. This will trigger the form UI element's submit function.
 */
export interface FormSubmitButton {
  type: 'form-submit-button';
  label: string;
}

/**
 * A form for gathering free-text input from the user, in a structured form,
 * based on one or more form fields.
 *
 * Usage: Extracting a complex response from the user when more information is required
 * to effectively and helpfully assist them. Favor a Dialog for this purpose where possible.
 *
 * Resulting user prompt format:
 * { id: <form id>, <form field id>: <form field value> }
 */
export interface Form {
  type: 'form';
  id: string;
  fields: FormField[];
  submitButton: FormSubmitButton;
}

export type Component =
  | TextNode
  | Heading
  | Container
  | ListItem
  | List
  | DialogButton
  | Dialog
  | FormField
  | FormSubmitButton
  | Form;

//
// User input formats.
//

export interface DialogPromptRequestValue {
  id: string;
  // Where value is the content displayed on the selected button.
  value: string;
}

export interface FormPromptRequestValue {
  id: string;
  // For each form field, where key is the form field id.
  [key: string]: string;
}

// User will either interact with a dialog or form. Handles both.
export interface UserPromptSubmitHandler {
  onSubmit(
    data: DialogPromptRequestValue | FormPromptRequestValue,
  ): Promise<void>;
}
