const puppeteer = require('puppeteer');
const fs = require('fs');

const telegramUrl = 'https://web.telegram.org';

(async () => {
  const browser = await puppeteer.launch({ headless: false, userDataDir: './user_data' });
  const page = await browser.newPage();
  await page.goto(telegramUrl);

  // Wait for the user to log in manually
  console.log('Please log in to Telegram manually.');
  await new Promise(resolve => setTimeout(resolve, 180000));

  // Save cookies and local storage
  const cookies = await page.cookies();
  const localStorage = await page.evaluate(() => JSON.stringify(localStorage));
  fs.writeFileSync('./cookies.json', JSON.stringify(cookies));
  fs.writeFileSync('./localStorage.json', localStorage);

  console.log('User data saved successfully.');

  await browser.close();
})();
