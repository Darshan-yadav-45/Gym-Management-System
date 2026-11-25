import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch (e1) {
  try {
    ({ chromium } = await import('./frontend/node_modules/playwright/index.mjs'));
  } catch (e2) {
    console.error('Failed to import playwright:', e1, e2);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const screenshotsDir = path.resolve(__dirname, 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('Screenshots destination folder:', screenshotsDir);

const VIEWPORT = { width: 1440, height: 900 };
const BASE_URL = 'http://localhost:5173';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  const capture = async (page, filename, description) => {
    const filePath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: filePath, fullPage: true });
    const stat = fs.statSync(filePath);
    console.log(`[SUCCESS] Saved ${filename} (${stat.size} bytes) - ${description}`);
    results.push({ filename, size: stat.size, description, status: 'OK' });
  };

  try {
    // -------------------------------------------------------------
    // Context 1: Public & Member Session
    // -------------------------------------------------------------
    console.log('\n--- Starting Public & Member Context ---');
    const memberContext = await browser.newContext({ viewport: VIEWPORT });
    const page = await memberContext.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.warn(`[Browser Console Error]: ${msg.text()}`);
      }
    });

    // 1. fig3-2_home.png -> http://localhost:5173/
    console.log('\n1. Navigating to Home (http://localhost:5173/)...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500); // Allow hero crossfade & layout initialization
    await capture(page, 'fig3-2_home.png', 'Home Page');

    // 2. fig3-3_register.png -> /register
    console.log('\n2. Navigating to Register (/register)...');
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await capture(page, 'fig3-3_register.png', 'Register Page');

    // 3. fig3-4_login.png -> /login
    console.log('\n3. Navigating to Login (/login)...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await capture(page, 'fig3-4_login.png', 'Member Login Page');

    // 4. fig3-5_onboarding.png -> /onboarding
    console.log('\n4. Navigating to Onboarding (/onboarding)...');
    await page.goto(`${BASE_URL}/onboarding`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.onboarding-title, .cards-grid', { timeout: 10000 });
    // Click 'Male' selection to highlight user choice
    const maleCard = page.locator('.selection-card').first();
    if (await maleCard.isVisible()) {
      await maleCard.click();
    }
    await page.waitForTimeout(1000);
    await capture(page, 'fig3-5_onboarding.png', 'Onboarding Step (Fitness Profile Setup)');

    // 5. fig3-6_member_dashboard.png -> login as member@fitflow.com / member123 -> /dashboard/routines
    console.log('\n5. Logging in as member@fitflow.com / member123...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[name="email"]', 'member@fitflow.com');
    await page.fill('input[name="password"]', 'member123');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard routines
    await page.waitForURL('**/dashboard/**', { timeout: 15000 }).catch(() => { });
    if (!page.url().includes('/dashboard/routines')) {
      await page.goto(`${BASE_URL}/dashboard/routines`, { waitUntil: 'networkidle', timeout: 30000 });
    } else {
      await page.waitForLoadState('networkidle');
    }
    await page.waitForTimeout(1500); // Allow counters and metrics to render
    await capture(page, 'fig3-6_member_dashboard.png', 'Member Dashboard - Daily Routines & Tracking');

    // 6. fig3-7_exercises.png -> /dashboard/exercises (same member session)
    console.log('\n6. Navigating to Exercises (/dashboard/exercises)...');
    await page.goto(`${BASE_URL}/dashboard/exercises`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('input[placeholder*="Search exercises"], .grid', { timeout: 15000 });
    await page.waitForTimeout(2000); // Allow 3D viewer & illustrations to settle
    await capture(page, 'fig3-7_exercises.png', 'Exercise Library with 3D Biomechanics');

    // 10. fig3-11_careers.png -> /careers/trainers
    console.log('\n7. Navigating to Careers (/careers/trainers)...');
    await page.goto(`${BASE_URL}/careers/trainers`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    await capture(page, 'fig3-11_careers.png', 'Trainer Careers & Recruitment Portal');

    await memberContext.close();

    // -------------------------------------------------------------
    // Context 2: Admin Session
    // -------------------------------------------------------------
    console.log('\n--- Starting Clean Admin Context ---');
    const adminContext = await browser.newContext({ viewport: VIEWPORT });
    const adminPage = await adminContext.newPage();

    adminPage.on('console', msg => {
      if (msg.type() === 'error') {
        console.warn(`[Admin Browser Console Error]: ${msg.text()}`);
      }
    });

    // 7. fig3-8_admin_login.png -> /admin/login
    console.log('\n8. Navigating to Admin Login (/admin/login)...');
    await adminPage.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await adminPage.waitForSelector('input[name="email"]', { timeout: 10000 });
    await adminPage.waitForTimeout(500);
    await capture(adminPage, 'fig3-8_admin_login.png', 'Dedicated Administrator Login');

    // 8. fig3-9_admin_overview.png -> log in as admin -> /admin
    console.log('\n9. Logging in as Admin (admin@fitflow.com / admin123)...');
    await adminPage.fill('input[name="email"]', 'admin@fitflow.com');
    await adminPage.fill('input[name="password"]', 'admin123');
    await adminPage.click('button[type="submit"]');

    await adminPage.waitForURL('**/admin/**', { timeout: 15000 });
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(2000); // Allow KPI cards and charts to render
    await capture(adminPage, 'fig3-9_admin_overview.png', 'Admin Console - Platform Overview & KPIs');

    // 9. fig3-10_staff_schedules.png -> in /admin, click "Staff Schedules" -> trigger overlapping shift conflict
    console.log('\n10. Testing Staff Schedules with Overlapping Shift Conflict...');
    const staffScheduleTab = adminPage.locator('button:has-text("Staff Schedules")').first();
    await staffScheduleTab.click();
    await adminPage.waitForTimeout(1500);

    // Open "Assign Shift" modal
    const assignShiftBtn = adminPage.locator('button:has-text("Assign Shift")').first();
    await assignShiftBtn.click();
    await adminPage.waitForTimeout(1000);

    // Explicitly select Marcus Vance (id = 1), who already has Morning Shift (06:00 - 14:00) on Monday
    const staffSelect = adminPage.locator('form select').first();
    await staffSelect.selectOption('1');
    await adminPage.waitForTimeout(500);

    // Submitting this form directly triggers the overlap conflict detection from the backend
    const modalSubmitBtn = adminPage.locator('form button[type="submit"]:has-text("Assign Shift")').first();
    await modalSubmitBtn.click();

    // Wait for the red conflict alert to appear
    console.log('Waiting for conflict detection alert...');
    await adminPage.waitForSelector('text=Conflict Detected', { timeout: 8000 });
    await adminPage.waitForTimeout(1000);
    await capture(adminPage, 'fig3-10_staff_schedules.png', 'Staff Schedules with Conflict Warning');

    // 11. optional: fig3-13_db_explorer.png -> /admin/db
    console.log('\n11. Navigating to Database Explorer (/admin/db)...');
    await adminPage.goto(`${BASE_URL}/admin/db`, { waitUntil: 'networkidle', timeout: 30000 });
    await adminPage.waitForTimeout(2000); // Wait for PostgreSQL table schema and rows to populate
    await capture(adminPage, 'fig3-13_db_explorer.png', 'Admin Database Explorer');

    await adminContext.close();

  } catch (err) {
    console.error('\n[FATAL ERROR during screenshot run]:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log('             SCREENSHOT CAPTURE SUMMARY               ');
  console.log('======================================================');
  let hasFailure = false;
  results.forEach(r => {
    const isSmall = r.size < 5000;
    const flag = isSmall ? ' [FLAG: Possibly Blank / Under 5KB]' : '';
    console.log(`- ${r.filename.padEnd(28)} | ${String(r.size).padStart(8)} bytes | ${r.description}${flag}`);
    if (isSmall) hasFailure = true;
  });

  if (hasFailure) {
    console.warn('\nWarning: Some screenshots were smaller than expected. Please inspect them.');
  } else {
    console.log('\nAll screenshots captured successfully with valid, non-blank dimensions!');
  }
}

run();
