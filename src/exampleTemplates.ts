import type { Component } from './models';

export const choices: Component = {
  type: 'container',
  children: [
    { type: 'heading', content: 'A heading' },
    {
      type: 'text-node',
      content:
        'Literally DIY bespoke, aesthetic locavore hammock fingerstache deep v helvetica skateboard banjo organic fam XOXO fixie.',
    },
    {
      type: 'list',
      children: [
        { type: 'list-item', content: 'First content.' },
        { type: 'list-item', content: 'Second content.' },
        { type: 'list-item', content: 'Third content.' },
        {
          type: 'list-item',
          content:
            'Banjo prism shoreditch tote bag. Next level craft beer art party 3 wolf moon vibecession letterpress. Occupy jawn everyday carry adaptogen same vape narwhal kale chips. Marxism live-edge ramps hoodie adaptogen..',
        },
        { type: 'list-item', content: 'Last item.' },
      ],
    },
    {
      type: 'dialog',
      id: 'id',
      heading: 'Make a choice',
      request: 'Here are your choices:',
      choices: [
        {
          type: 'dialog-button',
          value: 'Do this',
        },
        {
          type: 'dialog-button',
          value: 'Do that',
        },
        {
          type: 'dialog-button',
          value: 'Do this other thing',
        },
      ],
    },
  ],
};

export const complexInput: Component = {
  type: 'container',
  children: [
    { type: 'heading', content: 'A heading' },
    {
      type: 'text-node',
      content: 'Enter your details below to get your refund.',
    },
    {
      type: 'form',
      id: 'form-id',
      fields: [
        { type: 'form-field', id: 'name-id', label: 'name' },
        { type: 'form-field', id: 'email-id', label: 'email' },
        { type: 'form-field', id: 'address-id', label: 'address' },
      ],
      submitButton: {
        type: 'form-submit-button',
        label: 'Submit details now',
      },
    },
  ],
};
