/**
 * LooksFacts end-to-end smoke tests.
 *
 * Drives the locally installed Microsoft Edge (or Chrome) via playwright-core,
 * so no browser download is needed.
 *
 *   npm run dev            # in one terminal
 *   npm run test:e2e       # in another (BASE_URL defaults to http://localhost:5173)
 *
 * Env: BASE_URL, BROWSER_CHANNEL (msedge | chrome), HEADED=1
 */
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const CHANNEL = process.env.BROWSER_CHANNEL ?? 'msedge'

const results = []
async function test(name, fn) {
  try {
    await fn()
    results.push({ name, ok: true })
    console.log(`  ✓ ${name}`)
  } catch (err) {
    results.push({ name, ok: false, err })
    console.log(`  ✗ ${name}\n      ${String(err.message ?? err).split('\n')[0]}`)
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}
const price = (s) => Number(String(s).replace(/[^0-9.]/g, ''))

const browser = await chromium.launch({ channel: CHANNEL, headless: !process.env.HEADED })
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await context.newPage()
const consoleErrors = []
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`))
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))

const go = (path) => page.goto(BASE + path, { waitUntil: 'networkidle' })

console.log(`LooksFacts e2e — ${BASE} (${CHANNEL})\n`)

/* ---------------------------- Layout & navigation ---------------------------- */
const ROUTES = ['/', '/skinfacts', '/skinfacts/cerave-moisturising-cream', '/routine', '/budget', '/learn/spf-explained', '/nope']
const WIDTHS = [375, 390, 768, 1024, 1280, 1440]

await test('every route has exactly one h1', async () => {
  for (const r of ROUTES) {
    await go(r)
    const n = await page.locator('h1').count()
    assert(n === 1, `${r} has ${n} h1 elements`)
  }
})

await test('no horizontal overflow at 375–1440px on any route', async () => {
  const bad = []
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 })
    for (const r of ROUTES) {
      await go(r)
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      if (over > 1) bad.push(`${r}@${w}px (+${over}px)`)
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 })
  assert(!bad.length, `overflow: ${bad.join(', ')}`)
})

await test('main navigation links reach each page', async () => {
  await go('/')
  for (const [label, path] of [
    ['SkinFacts', '/skinfacts'],
    ['Routine Builder', '/routine'],
    ['Budget Finder', '/budget'],
    ['Home', '/'],
  ]) {
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: label, exact: true }).click()
    await page.waitForURL(BASE + path)
  }
})

await test('all internal links resolve (no 404 page)', async () => {
  const seen = new Set()
  for (const r of ['/', '/skinfacts', '/budget', '/routine', '/learn/spf-explained']) {
    await go(r)
    const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')))
    hrefs.forEach((h) => seen.add(h.split('#')[0]))
  }
  const broken = []
  for (const h of seen) {
    await go(h)
    if (await page.getByText('We couldn’t find that page', { exact: false }).count()) broken.push(h)
    if (await page.getByText("We couldn't find that page", { exact: false }).count()) broken.push(h)
  }
  assert(!broken.length, `broken links: ${broken.join(', ')}`)
})

await test('mobile menu opens, navigates and closes', async () => {
  await page.setViewportSize({ width: 390, height: 800 })
  try {
    await go('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    const menu = page.getByRole('dialog', { name: 'Menu' })
    await menu.getByRole('link', { name: 'Budget Finder' }).click()
    await page.waitForURL(BASE + '/budget')
    await menu.waitFor({ state: 'detached', timeout: 2000 })
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.keyboard.press('Escape')
    await menu.waitFor({ state: 'detached', timeout: 2000 })
  } finally {
    await page.setViewportSize({ width: 1280, height: 900 })
  }
})

await test('account menu opens and closes with Escape', async () => {
  await go('/')
  await page.getByRole('button', { name: 'Account' }).click()
  await page.getByText('Accounts are coming soon').waitFor()
  await page.keyboard.press('Escape')
  assert((await page.getByText('Accounts are coming soon').count()) === 0, 'account menu did not close')
})

/* ---------------------------------- Search ---------------------------------- */
await test('search overlay: live results, view all, Escape and "/" shortcut', async () => {
  await go('/')
  await page.keyboard.press('/')
  const input = page.getByRole('dialog', { name: 'Search products' }).getByRole('searchbox')
  await input.fill('niacinamide')
  await page.getByText(/\d+ products?/).first().waitFor()
  const items = await page.getByRole('dialog', { name: 'Search products' }).getByRole('listitem').count()
  assert(items > 0, 'no live results for niacinamide')
  await page.keyboard.press('Escape')
  assert((await page.getByRole('dialog', { name: 'Search products' }).count()) === 0, 'Escape did not close search')
  await page.getByRole('button', { name: /Search products, brands, ingredients/ }).click()
  await page.getByRole('dialog', { name: 'Search products' }).getByRole('searchbox').fill('cerave')
  await page.getByRole('button', { name: 'View all results' }).click()
  await page.waitForURL(/\/skinfacts\?q=cerave/)
})

/* -------------------------------- Catalogue --------------------------------- */
await test('catalogue: category filter updates URL and back button restores', async () => {
  await go('/skinfacts')
  await page.getByRole('button', { name: /^Sunscreens/ }).click()
  await page.waitForURL(/category=sunscreen/)
  await page.getByRole('heading', { level: 1, name: 'Sunscreens' }).waitFor()
  await page.goBack()
  await page.getByRole('heading', { level: 1, name: 'All skincare products' }).waitFor()
})

await test('catalogue: price sort ascending is ordered', async () => {
  await go('/skinfacts?sort=price-asc')
  const prices = (await page.locator('article .tabular-nums').allTextContents()).map(price).filter(Boolean)
  assert(prices.length > 10, 'too few prices found')
  for (let i = 1; i < prices.length; i++) assert(prices[i] >= prices[i - 1], `not sorted at ${i}: ${prices[i - 1]} > ${prices[i]}`)
})

await test('catalogue: search with no matches shows empty state and clear works', async () => {
  await go('/skinfacts?q=zzzzzz')
  await page.getByText('No products found').waitFor()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await page.getByRole('heading', { level: 1, name: 'All skincare products' }).waitFor()
})

/* ------------------------------ Product detail ------------------------------ */
await test('product page: breadcrumb, alternatives and add-to-routine link', async () => {
  await go('/skinfacts/skinceuticals-c-e-ferulic')
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Serums' }).waitFor()
  await page.getByRole('heading', { name: 'Cheaper alternatives' }).waitFor()
  await page.getByRole('link', { name: 'Add to routine' }).click()
  await page.waitForURL(/\/routine\?add=skinceuticals-c-e-ferulic/)
})

await test('product page: 3D viewer loads with controls (or falls back to image)', async () => {
  await go('/skinfacts/cerave-moisturising-cream')
  const canvas = page.locator('canvas')
  const hasCanvas = await canvas.first().waitFor({ timeout: 15000 }).then(() => true, () => false)
  if (hasCanvas) {
    await page.getByRole('button', { name: 'Back', exact: true }).click()
    await page.getByRole('button', { name: 'Zoom in' }).click()
    await page.getByRole('button', { name: 'Reset' }).click()
    const box = await canvas.first().boundingBox()
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2, { steps: 8 })
    await page.mouse.up()
  } else {
    await page.getByRole('img', { name: /CeraVe/ }).first().waitFor()
  }
})

/* ----------------------------- Routine Builder ------------------------------ */
await test('routine: add via picker, reorder, remove, persist after reload', async () => {
  await go('/routine')
  await page.evaluate(() => localStorage.removeItem('lf.routine.v1'))
  await go('/routine')
  await page.getByRole('button', { name: 'Add product' }).click()
  const picker = page.getByRole('dialog', { name: /Add products to morning routine/ })
  await picker.getByRole('searchbox').fill('Hydrating Cleanser')
  await picker.getByRole('button', { name: 'Add', exact: true }).first().click()
  await picker.getByRole('searchbox').fill('Anthelios')
  await picker.getByRole('button', { name: 'Add', exact: true }).first().click()
  await page.keyboard.press('Escape')
  const items = page.locator('ol li').filter({ has: page.getByRole('button', { name: /^Remove / }) })
  assert((await items.count()) === 2, `expected 2 routine items, got ${await items.count()}`)
  const firstBefore = await items.first().textContent()
  await page.getByRole('button', { name: /^Move .* down$/ }).first().click()
  const firstAfter = await items.first().textContent()
  assert(firstBefore !== firstAfter, 'reorder did not change order')
  await page.reload({ waitUntil: 'networkidle' })
  assert((await items.count()) === 2, 'routine not persisted after reload')
  await page.getByRole('button', { name: /^Remove / }).first().click()
  assert((await items.count()) === 1, 'remove did not work')
})

await test('routine: retinoid + BHA in evening triggers caution note', async () => {
  await page.evaluate(() =>
    localStorage.setItem(
      'lf.routine.v1',
      JSON.stringify({ am: [], pm: ['the-ordinary-retinol-0-5-in-squalane', 'paula-s-choice-skin-perfecting-2-bha-liquid-exfoliant'] }),
    ),
  )
  await go('/routine')
  await page.getByText(/Retinoid and exfoliating acids in your evening routine/).waitFor()
  await page.getByText(/without daytime sun protection/).waitFor()
})

await test('routine: add-from-link bar adds to evening', async () => {
  await page.evaluate(() => localStorage.removeItem('lf.routine.v1'))
  await go('/routine?add=cerave-moisturising-cream')
  await page.getByRole('button', { name: 'Evening' }).first().click()
  await page.getByRole('button', { name: 'In evening' }).waitFor()
})

/* ------------------------------ Budget Finder ------------------------------- */
await test('budget: budget filter caps prices', async () => {
  await go('/budget')
  await page.getByLabel('Budget per product').fill('20')
  await page.getByText(/products? up to/).waitFor()
  const grid = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Shop within your budget' }) })
  const prices = (await grid.locator('article .tabular-nums').allTextContents()).map(price).filter(Boolean)
  assert(prices.length > 0, 'no products under budget')
  assert(prices.every((p) => p <= 20), `prices over budget: ${prices.filter((p) => p > 20)}`)
})

await test('budget: invalid min/max range shows warning', async () => {
  await page.getByLabel('Min price').fill('50')
  await page.getByText('The minimum price is higher than your maximum or budget.').waitFor()
  await page.getByRole('button', { name: 'Reset' }).first().click()
})

await test('budget: alternatives finder and comparison (max 4)', async () => {
  await go('/budget?compare=skinceuticals-c-e-ferulic')
  await page.getByText('Your product').waitFor()
  const compareBtns = page.locator('#alternatives').getByRole('button', { name: 'Compare' })
  const n = Math.min(await compareBtns.count(), 5)
  for (let i = 0; i < n; i++) await compareBtns.nth(i).click()
  await page.getByText(/4 of 4 selected/).first().waitFor()
  await page.getByRole('heading', { name: 'Compare products' }).waitFor()
  await page.getByText('Cheapest').first().waitFor()
})

/* ------------------------------- Currency ---------------------------------- */
await test('currency switch converts prices and persists', async () => {
  await go('/skinfacts/cerave-moisturising-cream')
  const sel = page.getByRole('banner').getByLabel('Currency')
  await sel.selectOption('USD')
  await page.getByText('≈').first().waitFor()
  await go('/budget')
  assert((await page.getByText(/entered and shown in USD/).count()) === 1, 'currency not persisted to budget page')
  await page.getByRole('banner').getByLabel('Currency').selectOption('AUD')
})

/* ------------------------------ Console errors ------------------------------ */
await test('no console or page errors', async () => {
  const relevant = consoleErrors.filter((e) => !/favicon|DevTools/i.test(e))
  assert(!relevant.length, relevant.slice(0, 5).join(' | '))
})

await browser.close()

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
