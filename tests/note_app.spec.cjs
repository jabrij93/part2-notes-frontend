const { test, describe, expect } = require('@playwright/test')

describe('Note app', () => {
    test('front page can be opened', async ({ page }) => {
        await page.goto('http://localhost:5173')

        await page.getByRole('button', { name: 'log in' }).click()
    })
  })``