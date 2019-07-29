//Update the settings and node run this file.
const userID = 'yourUserEmail@gmail.com';
const userPassword = 'yourPassword';
const pageUrl = 'https://iaqualink.zodiacpoolsystems.com/';
const outputFileName = './pool-temp.txt';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //Go to login page url.
    await page.goto(pageUrl, {waitUntil: 'load'});
    // Type our user name and password
    await page.focus('#userID');
    await page.type('#userID', userID);
    await page.focus('#userPassword');
    await page.type('#userPassword', userPassword);
    // Submit form
    await page.click('button');
    // Wait for logged in page to load
    await page.waitForNavigation({waitUntil: 'load'});
    // Wait for JS to build the page with location rows.
    await page.waitForSelector('.openLocation');
    // Clicks and opens new window modal.
    await page.evaluate(() => {
      let elements = document.getElementsByClassName('openLocation');
      for (let element of elements) {
        element.click();
      }
    });
    // Location takes a while to init and load page lets just wait awhile
    await page.waitFor(15000);
    // Get the browser tabs/pages
    const [tabOne, tabTwo, tabThree] = (await browser.pages());
    // Wait for the page to load the data point divs
    await tabThree.waitForSelector('.home_info_value');
    // Get Pool Temp
    const poolTxt = await tabThree.evaluate(() => document.querySelector("[id='1_25_0']").innerText);
    console.log('Pool Temp ', poolTxt);
    // Get Air Temp
    const airTxt = await tabThree.evaluate(() => document.querySelector("[id='1_25_1']").innerText);
    console.log('Air Temp ', airTxt);
    // Get the Y-m-d H:i:s Date
    let today = new Date()
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // Write to file
    let filePath = path.resolve(outputFileName);
    await fs.appendFile(filePath, (date + ' ' + time) + ',' + poolTxt + ',' + airTxt + '\n', function (err) {
      if (err) throw err;
      console.log('Saved to ' + filePath);
    });
    browser.close();
})();
