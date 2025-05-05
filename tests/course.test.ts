import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:5173/learning-oe-solidjs/menu');
    await page.getByText('UK Constitutional Law').click();
    await page.getByRole('button', { name: 'Introduction' }).click();
    await page.getByRole('button', { name: 'Begin' }).click();

    await page.getByRole('button', { name: 'Setting taxes' }).click();

    const actionButton = page.getByRole('button', { name: 'action-button' });
    await expect(actionButton).toHaveClass('next-button');
    await actionButton.click();
    await expect(actionButton).toHaveClass('incorrect-next-button');

    await page.getByRole('button', { name: 'Cancel lesson' }).click();
    await page.getByRole('button', { name: '✔' }).click();
});
