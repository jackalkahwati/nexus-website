import { test, expect } from '@playwright/test'

test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  })

  test('should display real-time metrics', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    
    // Wait for metrics to load
    await page.waitForSelector('[data-testid="metrics-chart"]')
    
    // Check if real-time metrics are displayed
    const activeUsers = await page.textContent('[data-testid="active-users-metric"]')
    expect(activeUsers).toBeTruthy()
    
    // Check if metrics are updating
    const initialValue = activeUsers
    await page.waitForTimeout(5000) // Wait for metrics to update
    const updatedValue = await page.textContent('[data-testid="active-users-metric"]')
    expect(updatedValue).not.toBe(initialValue)
  })

  test('should filter metrics by date range', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    
    // Open date picker
    await page.click('[data-testid="date-range-picker"]')
    
    // Select last 7 days
    await page.click('[data-testid="last-7-days"]')
    
    // Wait for metrics to update
    await page.waitForResponse(response => 
      response.url().includes('/api/analytics/metrics') && 
      response.status() === 200
    )
    
    // Check if metrics are filtered
    const chart = await page.locator('[data-testid="metrics-chart"]')
    expect(await chart.screenshot()).toMatchSnapshot('7-days-metrics.png')
  })

  test('should display funnel analysis', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    
    // Switch to funnel view
    await page.click('text=Funnel Analysis')
    
    // Wait for funnel chart to load
    await page.waitForSelector('[data-testid="funnel-chart"]')
    
    // Check funnel stages
    const stages = await page.locator('[data-testid="funnel-stage"]').count()
    expect(stages).toBeGreaterThan(0)
    
    // Check conversion rates
    const conversionRates = await page.locator('[data-testid="conversion-rate"]').count()
    expect(conversionRates).toBe(stages - 1)
  })

  test('should export analytics data', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    
    // Click export button
    await page.click('[data-testid="export-button"]')
    
    // Select export format
    await page.click('[data-testid="export-format-json"]')
    
    // Start export
    const downloadPromise = page.waitForEvent('download')
    await page.click('[data-testid="start-export-button"]')
    
    // Wait for download to complete
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/analytics-export.*\.json/)
  })

  test('should customize dashboard layout', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    
    // Open customization menu
    await page.click('[data-testid="customize-dashboard"]')
    
    // Toggle metric visibility
    await page.click('[data-testid="toggle-metric-pageviews"]')
    
    // Save layout
    await page.click('[data-testid="save-layout"]')
    
    // Verify changes persist after reload
    await page.reload()
    const pageViewsMetric = await page.locator('[data-testid="metric-pageviews"]')
    expect(await pageViewsMetric.isVisible()).toBe(false)
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/analytics/metrics', route => 
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    )
    
    await page.goto('/dashboard/analytics')
    
    // Check if error message is displayed
    const errorMessage = await page.textContent('[data-testid="error-message"]')
    expect(errorMessage).toContain('Error loading metrics')
    
    // Check if retry button is available
    const retryButton = await page.locator('[data-testid="retry-button"]')
    expect(await retryButton.isVisible()).toBe(true)
  })

  test('should maintain state between navigation', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    
    // Set date range
    await page.click('[data-testid="date-range-picker"]')
    await page.click('[data-testid="last-30-days"]')
    
    // Navigate away
    await page.click('[data-testid="dashboard-link"]')
    
    // Navigate back
    await page.click('[data-testid="analytics-link"]')
    
    // Check if date range is preserved
    const dateRange = await page.textContent('[data-testid="date-range-display"]')
    expect(dateRange).toContain('Last 30 days')
  })
}) 