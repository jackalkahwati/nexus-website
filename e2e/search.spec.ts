import { test, expect, type Page } from '@playwright/test'

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/')
  })

  test('should perform a basic search', async ({ page }: { page: Page }) => {
    // Type into search input
    await page.fill('[data-testid="search-input"]', 'test query')
    await page.press('[data-testid="search-input"]', 'Enter')

    // Wait for search results to load
    await page.waitForSelector('[data-testid="search-results"]')

    // Verify search results are displayed
    const results = await page.$$('[data-testid="search-result-item"]')
    expect(results.length).toBeGreaterThan(0)

    // Verify search result content
    const firstResult = results[0]
    const title = await firstResult.textContent()
    expect(title).toBeTruthy()
  })

  test('should handle no results state', async ({ page }: { page: Page }) => {
    // Search for something that should return no results
    await page.fill('[data-testid="search-input"]', 'xyznonexistentquery123')
    await page.press('[data-testid="search-input"]', 'Enter')

    // Wait for no results message
    const noResults = await page.waitForSelector('[data-testid="no-results"]')
    expect(await noResults.isVisible()).toBe(true)
  })

  test('should handle search filters', async ({ page }: { page: Page }) => {
    // Open filters
    await page.click('[data-testid="filter-button"]')

    // Select a category filter
    await page.click('[data-testid="category-filter-docs"]')

    // Perform search
    await page.fill('[data-testid="search-input"]', 'test')
    await page.press('[data-testid="search-input"]', 'Enter')

    // Verify filtered results
    const activeFilters = await page.$$('[data-testid="active-filter"]')
    expect(activeFilters.length).toBe(1)
  })

  test('should handle pagination', async ({ page }: { page: Page }) => {
    // Perform search that returns multiple pages
    await page.fill('[data-testid="search-input"]', 'common')
    await page.press('[data-testid="search-input"]', 'Enter')

    // Wait for initial results
    await page.waitForSelector('[data-testid="search-results"]')

    // Get initial results
    const initialResults = await page.$$('[data-testid="search-result-item"]')

    // Click next page
    await page.click('[data-testid="next-page"]')

    // Wait for new results
    await page.waitForSelector('[data-testid="search-results"]')

    // Get new results
    const newResults = await page.$$('[data-testid="search-result-item"]')

    // Verify different results are shown
    expect(newResults.length).toBeGreaterThan(0)
    expect(newResults[0]).not.toEqual(initialResults[0])
  })

  test('should be responsive', async ({ page }: { page: Page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify search input is visible
    expect(await page.isVisible('[data-testid="search-input"]')).toBe(true)

    // Open mobile filters
    await page.click('[data-testid="mobile-filter-button"]')
    
    // Verify filter menu is visible
    expect(await page.isVisible('[data-testid="mobile-filter-menu"]')).toBe(true)

    // Close filter menu
    await page.click('[data-testid="close-filter-menu"]')
  })
}) 