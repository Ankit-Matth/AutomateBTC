const puppeteer = require("puppeteer");
const fs = require("fs");

const telegramUrl = "https://web.telegram.org";

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // Use headless: false to see the browser
  const page = await browser.newPage();
  await page.goto(telegramUrl);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Load cookies and local storage
  const cookies = JSON.parse(fs.readFileSync("./cookies.json", "utf8"));
  const localStorage = JSON.parse(fs.readFileSync("./localStorage.json", "utf8"));

  await page.setCookie(...cookies);
  await page.evaluate((data) => {
    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(key, value);
    }
  }, localStorage);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Logged in automatically.");

  await page.goto("https://web.telegram.org/k/#@earnbtcbywatchingads_bot");

  await new Promise((resolve) => setTimeout(resolve, 50000));

  let counter = 1;

  const clickViewAds = async () => {
    try {
      // Send the /start command to the bot
      const inputField = await page.$('div.input-message-input[contenteditable="true"]');
      await inputField.focus();
      await page.keyboard.type('/start');
      await page.keyboard.press('Enter');
      console.log("Sent /start command to the bot");
      
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for the command to be processed
      
      while (true) {
        // Select all elements with the class `.reply-markup`
        const elements = await page.$$('.reply-markup');
    
        if (elements.length > 0) {
          // Get the last element from the array
          const lastElement = elements[elements.length - 1];
    
          // Select the first child `.reply-markup-row` of the last element
          const replyMarkupRow = await lastElement.$('.reply-markup-row');
    
          if (replyMarkupRow) {
            // Select the element with the class `.reply-markup-button-text` inside the `.reply-markup-row`
            const buttonTextElement = await replyMarkupRow.$('.reply-markup-button-text');
    
            if (buttonTextElement) {
              // Evaluate the innerText of the targeted element
              let buttonText = await page.evaluate(el => el.innerText, buttonTextElement);

              // Normalize whitespace and trim the text
              buttonText = buttonText.replace(/\s+/g, ' ').trim();

              console.log("Clicked: "+buttonText);
              await buttonTextElement.click();

              if (buttonText=="View Ads(1)") {
                console.log('Turn completed: '+counter)
                counter++;
                break;
              }
            }
          }
        }
    
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      console.log('Waiting for 10.5 minutes...');
      setTimeout(async () => {
        await clickViewAds();
      }, 10.5 * 60 * 1000);
    
    } catch (error) {
      console.log('Error clicking "View ads" button:', error);
    }
  };

  await clickViewAds();
})();