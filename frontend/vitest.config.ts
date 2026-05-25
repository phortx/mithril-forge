import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    // Node 25 enables experimental Web Storage by default and installs a
    // non-configurable broken `localStorage` on globalThis before jsdom can
    // attach its own. Disable it so jsdom's localStorage wins.
    // See: https://github.com/vitest-dev/vitest/issues/8757
    execArgv: ['--no-experimental-webstorage'],
  },
})
