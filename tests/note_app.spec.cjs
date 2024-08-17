const { test, describe, expect, beforeEach, beforeAll } = require('@playwright/test')
const { loginWith } = require('./helper.cjs')

describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3001/api/testing/reset')
      await request.post('http://localhost:3001/api/users', {
        data: {
          name: 'Matti Luukkainen',
          username: 'mluukkai',
          password: 'salainen'
        }
      })

      await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({ page }) => {
        await page.goto('http://localhost:5173')
    
        const locator = await page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
    })

    test.only('user can log in', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
          await loginWith(page, 'mluukkai', 'salainen')
        })
    
        test('a new note can be created', async ({ page }) => {
          await page.getByRole('button', { name: 'add note' }).click()
          await page.getByRole('textbox').fill('a note created by playwright3')
          await page.getByRole('button', { name: 'save' }).click()
          await expect(page.getByText('a note created by playwright3')).toBeVisible()
        })
      })
      
    test('login fails with wrong password', async ({ page }) => { 
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()
    
        const errorMessage = page.getByText('wrong credentials');

        // Ensure the error message is visible first
        await expect(errorMessage).toBeVisible();

        // Check that the element has the correct CSS styles
        await expect(errorMessage).toHaveCSS('border-style', 'solid');
        await expect(errorMessage).toHaveCSS('color', 'rgb(255, 0, 0)'); // 'red' in RGB format

        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
      })  
})