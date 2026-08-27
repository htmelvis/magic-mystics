import type { Preview } from '@storybook/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationIndependentTree } from '@react-navigation/core';

const preview: Preview = {
  decorators: [
    (Story) => (
      <NavigationIndependentTree>
        <NavigationContainer>
          <Story />
        </NavigationContainer>
      </NavigationIndependentTree>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
