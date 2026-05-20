import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { resolve } from 'path';

export default defineConfig(async () => ({
  plugins: [
    await storybookTest({ configDir: '.storybook' }),
  ],
  resolve: {
    alias: {
      'altaforge-ui/themes': resolve(process.cwd(), 'src/themes.ts'),
      'altaforge-ui/charts': resolve(process.cwd(), 'src/charts.ts'),
      '../themes': resolve(process.cwd(), 'src/themes.ts'),
      '../charts': resolve(process.cwd(), 'src/charts.ts'),
    },
  },
  test: {
    name: 'storybook',
    include: ['src/**/*.stories.?(c|m)[jt]s?(x)'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
}));
