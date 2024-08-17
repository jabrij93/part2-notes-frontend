const { test, describe, expect, beforeEach, beforeAll } = require('@playwright/test')
const { loginWith, createNote } = require('./helper.cjs')

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

    test('user can log in', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    describe.only('when logged in', () => {
        beforeEach(async ({ page }) => {
          await loginWith(page, 'mluukkai', 'salainen')
        })
    
        test('a new note can be created', async ({ page }) => {
            await createNote(page, 'a note created by playwright')
            await expect(page.getByText('a note created by playwright')).toBeVisible()
          })
        })

        describe('and a note exists', () => {
          beforeEach(async ({ page }) => {
            await createNote(page, 'another note by playwright')
          })

          test('it can be made important', async ({ page }) => {
            await page.getByRole('button', { name: 'make not important' }).click()
            await expect(page.getByText('make important')).toBeVisible()
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