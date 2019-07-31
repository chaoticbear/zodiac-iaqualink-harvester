const userID = 'yourEmailUser';
const userPassword = 'yourPassword';
const pageUrl = 'https://iaqualink.zodiacpoolsystems.com/';
const outputFileName = './pool-temp.txt';
const openWeatherMapAPIKey = 'YourLongApiId';
// Can select a city Id on a Dallas TX one right now.
// https://openweathermap.org/find?q=
const openWeatherCityId = '4684888';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const weather = require('openweather-apis');
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
    //console.log('Tabs ', (await browser.pages()).length);
    const [tabOne, tabTwo, tabThree] = (await browser.pages());
    // Wait for the page to load the data point divs
    await tabThree.waitForSelector('.home_info_value');
    // Get Pool Temp
    let poolTxt = await tabThree.evaluate(() => document.querySelector("[id='1_25_0']").innerText);
    if (poolTxt != '--') {
      poolTxt = poolTxt.replace(/\D/g,'');
    }
    console.log('Pool Temp ', poolTxt);
    // Get Air Temp
    let airTxt = await tabThree.evaluate(() => document.querySelector("[id='1_25_1']").innerText);
    if (airTxt != '--') {
      airTxt = airTxt.replace(/\D/g,'');
    }
    console.log('Air Temp ', airTxt);
    browser.close();
    //Hard part is done lets get current weather data from open weather api
    await weather.setLang('en');
    await weather.setCityId(openWeatherCityId);
    await weather.setAPPID(openWeatherMapAPIKey);
    let tempTxt = ''
    let humidTxt = ''
    // Get the current Temperature
    await weather.getTemperature(function (err, temp) {
      if (err) console.log('Err: ', err);
      tempTxt = temp;
      // Convert to F
      tempTxt = (tempTxt * 9/5) + 32;
      tempTxt = tempTxt.toFixed(2);
      console.log('Current Temp ', tempTxt);
      // Get the current Humidity
      weather.getHumidity(function (err, humid) {
        if (err) console.log('Err: ', err);
        humidTxt = humid;
        console.log('Current Humidity ', humidTxt);
        // Get the Y-md H:i:s Date
        let today = new Date()
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + ' ' + time
        // Write to file
        let filePath = path.resolve(outputFileName);
        fs.appendFile(filePath, dateTime + ',' + poolTxt + ',' + airTxt + ',' + tempTxt + ',' + humidTxt + '\n', function (err) {
          if (err) throw err;
          console.log('Saved to ' + filePath);
        });
      });
    });
})();
