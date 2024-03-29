const { beforeEach, describe, test, expect } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {

    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {

        const locator = await page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
    })

    test('login form can be opened', async ({ page }) => {

        loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })

        test('a new note can be created', async ({ page }) => {
            createNote(page, 'a note created by playwright')
            await expect(page.getByText('a note created by playwright')).toBeVisible()
        })

        describe('and a note exists', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'first note', true)
                await createNote(page, 'second note', true)
                await createNote(page, 'third note', true)
            })

            test.only('importance can be changed', async ({ page }) => {
                await page.pause()
                const otherNoteText = await page.getByText('second note')
                const otherdNoteElement = await otherNoteText.locator('..')

                await otherdNoteElement.getByRole('button', { name: 'make not important' }).click()
                await expect(otherdNoteElement.getByText('make important')).toBeVisible()
            })
        })

        describe('and several notes exists', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'first note', true)
                await createNote(page, 'second note', tr)
            })

            test('one of those can be made nonimportant', async ({ page }) => {
                const secondNoteElement = await page.getByText('first note').locator('..')
                await secondNoteElement.getByRole('button', { name: 'make not important' }).click()
                await expect(secondNoteElement.getByText('make important')).toBeVisible()
            })
        })
    })

    test('login fails with wrong password', async ({ page }) => {
        loginWith(page, 'mluukkai', 'wrong')

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
})