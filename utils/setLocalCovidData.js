let localTotalConfirmedCases;
let localActiveCases;
let localRecoveredCases;
let localFatalCases;

class Covid19LocalData {
  constructor(
    country,
    localTotalConfirmedCases,
    localActiveCases,
    localRecoveredCases,
    localFatalCases
  ) {
    this.country = country;
    this.localTotalConfirmedCases = localTotalConfirmedCases;
    this.localActiveCases = localActiveCases;
    this.localRecoveredCases = localRecoveredCases;
    this.localFatalCases = localFatalCases;
  }
  setLocalData(covid19Data) {
    covid19Data.localData.push(this);
  }
}

async function setLocalCovidData(countryString, page, covid19Data) {
  localTotalConfirmedCases = await page.$eval(
    ".overview .infoTile .confirmed",
    el => el.textContent
  );

  const LocalSectionElementsBasedOnDescription = await page.$$(
    ".overview .infoTile .infoTileData .description"
  );

  for (const el of LocalSectionElementsBasedOnDescription) {
    const innerText = await el.evaluate(e => e.innerText);

    switch (innerText) {
      case "Active cases":
        localActiveCases = await el.evaluate(e => e.nextSibling.innerText);
        break;

      case "Recovered cases":
        localRecoveredCases = await el.evaluate(e => e.nextSibling.innerText);
        break;

      case "Fatal cases":
        localFatalCases = await el.evaluate(e => e.nextSibling.innerText);
        break;
    }
  }

  const localData = new Covid19LocalData(
    countryString.toLowerCase(),
    localTotalConfirmedCases,
    localActiveCases,
    localRecoveredCases,
    localFatalCases
  );

  localData.setLocalData(covid19Data);
}

module.exports = setLocalCovidData;
