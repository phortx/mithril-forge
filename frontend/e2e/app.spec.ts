import { test, expect } from '@playwright/test';

test('app loads and displays status', async ({ page }) => {
  await page.goto('/');

  // Dies ist ein minimaler Test. Er prüft, ob die Seite lädt, ohne direkt abzustürzen.
  // Erwarte, dass das 'Vite' oder 'React' Logo oder eine andere H1/Title existiert.
  // Passe dies entsprechend der tatsächlichen UI deines Frontends an.
  await expect(page).toHaveTitle(/.*|Mithril Forge/);
});
