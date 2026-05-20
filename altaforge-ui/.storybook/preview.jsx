import React from 'react';
import { Theme } from '../src/themes';
import '@radix-ui/themes/styles.css';
import '../src/base.css';

export const decorators = [
  (Story) => (
    <Theme accentColor="cyan" grayColor="slate" radius="medium" panelBackground="translucent" style={{ minHeight: 'auto' }}>
      <Story />
    </Theme>
  ),
];

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  docs: {
    canvas: { withToolbar: false },
  },
};
