const puppeteer = require("puppeteer");

const setLocalCovidData = require("./setLocalCovidData");
const setGlobalCovidData = require("./setGlobalCovidData");
const setLastUpdatedDate = require("./setLastUpdatedDate");

//Comment out code below if you are lauching browser locally.
const BROWSER_ENDPOINT = process.env.BROWSER_ENDPOINT;

async function fetchCovid19Data(country, response) {
  const covid19Data = {
    globalTotalConfirmedCases: null,
    globalActiveCases: null,
    globalRecoveredCases: null,
    globalFatalCases: null,
    localData: [],
    dataLastUpdated: null
  };

  return (async () => {
    const countryInputSearchValue = country;
    //Uncomment code below for launching browser locally
    // const browser = await puppeteer.launch();

    //Code below for launching remote browser endpoint. Comment out code below if you want to lauch browser locally.
    const browser = await puppeteer.connect({
      browserWSEndpoint: BROWSER_ENDPOINT
    });

    const page = await browser.newPage();
    await page.goto("https://bing.com/covid");
    await page.waitForNavigation();

    try {
      const searchInput = await page.$("input.area");
      await searchInput.click();
      await searchInput.type(countryInputSearchValue);

      await page.waitForSelector(".suggestion div.suggArea");

      const firstSuggestedDiv = await page.$(".suggestion div.suggArea");

      const firstSuggestedDivInnerText = await page.evaluate(
        el => el.textContent,
        firstSuggestedDiv
      );
      const countryString = firstSuggestedDivInnerText;

      if (
        RegExp(countryInputSearchValue, "i").test(
          countryString.replace(/\s+/g, "")
        )
      ) {
        await firstSuggestedDiv.click();
      }

      await page.waitForSelector(".overview .infoTile");

      await setLocalCovidData(countryString, page, covid19Data);

      await setGlobalCovidData(page, covid19Data);

      await setLastUpdatedDate(page, covid19Data);

      await browser.close();

      return covid19Data;
    } catch (error) {
      await browser.close();

      console.log(error.message);

      if (response) {
        response
          .status(500)
          .send(
            "Sorry server could  not process request. Make sure the correct country name is used in the URL path"
          );
      }
    }
  })();
}

module.exports = fetchCovid19Data;
