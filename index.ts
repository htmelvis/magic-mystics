// When Storybook is enabled, bypass expo-router entirely and render the
// Storybook UI as a standalone root component. This avoids the
// UnhandledLinkingContext / AuthApiError cascade that occurs when Storybook
// is rendered as a route inside the navigation tree.
if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  require('./.rnstorybook/entry');
} else {
  require('expo-router/entry');
}
