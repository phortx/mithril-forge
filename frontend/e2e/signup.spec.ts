import { test, expect, request } from '@playwright/test';

test.describe('Registration and Confirmation', () => {
  const testEmail = `e2e-test-${Date.now()}@example.com`;
  const testPassword = 'securepassword123';

  test.beforeAll(async () => {
    // Clean up all messages in Mailpit before running the test to ensure we grab the right email
    const reqContext = await request.newContext();
    try {
      await reqContext.delete('http://localhost:8026/api/v1/messages');
    } catch {
      console.error('Failed to clean up Mailpit. Make sure Mailpit is running on port 8026.');
    }
  });

  test('should register a new user and confirm the email via Mailpit', async ({ page }) => {
    // --- 1. Sign Up ---
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: /Join the Forge/i })).toBeVisible();

    await page.fill('label:has-text("Email") + input, input[type="email"]', testEmail);
    await page.fill('label:has-text("Password") + input, input[type="password"]', testPassword);
    
    // Click the Create Account button
    await page.getByRole('button', { name: /Create Account/i }).click();

    // Verify success toast appears
    await expect(page.getByText(/Registration successful! Please check your email/i)).toBeVisible({ timeout: 10000 });

    // --- 2. Retrieve Email from Mailpit ---
    const reqContext = await request.newContext();
    let messageId: string | null = null;
    
    // Poll the Mailpit API for the new message
    for (let i = 0; i < 15; i++) {
      try {
        const response = await reqContext.get('http://localhost:8026/api/v1/messages');
        if (response.ok()) {
          const data = await response.json();
          const messages = data.messages || [];
          const msg = messages.find((m: { To?: { Address: string }[] }) => m.To && m.To[0] && m.To[0].Address === testEmail);
          
          if (msg) {
            messageId = msg.ID as string;
            break;
          }
        }
      } catch {
        // Ignore fetch errors during polling
      }
      await page.waitForTimeout(1000);
    }
    
    expect(messageId, 'Expected to find a confirmation email in Mailpit').toBeTruthy();

    // --- 3. Extract Token from Email ---
    const msgResponse = await reqContext.get(`http://localhost:8026/api/v1/message/${messageId}`);
    expect(msgResponse.ok()).toBeTruthy();
    
    const msgData = await msgResponse.json();
    const textContent = msgData.Text || '';
    
    // The email body contains: "Click here to confirm your account: https://$url/users/confirm?token=$token"
    const tokenMatch = textContent.match(/token=([a-zA-Z0-9._-]+)/);
    expect(tokenMatch, 'Expected email to contain a confirmation token').toBeTruthy();
    
    const token = tokenMatch![1];

    // --- 4. Confirm Account ---
    // Navigate to the confirmation URL with the extracted token
    await page.goto(`/users/confirm?token=${token}`);

    // Wait for the confirmation logic to complete and show the success toast
    await expect(page.getByText(/Account successfully confirmed!/i)).toBeVisible({ timeout: 10000 });
    
    // Verify it navigates back to home (DM Screen or Player Screen)
    await expect(page).toHaveURL(/.*\/dm.*/);
  });
});
