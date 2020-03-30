async function setGlobalCovidData(page, covid19Data) {
  covid19Data.globalTotalConfirmedCases = await page.$eval(
    ".country.tab .confirmed",
    el => el.textContent
  );

  const GlobalSectionElementsBasedOnDescription = await page.$$(
    ".country.tab .description"
  );

  for (const el of GlobalSectionElementsBasedOnDescription) {
    const innerText = await el.evaluate(e => e.innerText);

    switch (innerText) {
      case "Active cases":
        covid19Data.globalActiveCases = await el.evaluate(
          e => e.nextSibling.innerText
        );
        break;

      case "Recovered cases":
        covid19Data.globalRecoveredCases = await el.evaluate(
          e => e.nextSibling.innerText
        );
        break;

      case "Fatal cases":
        covid19Data.globalFatalCases = await el.evaluate(
          e => e.nextSibling.innerText
        );
        break;
    }
  }
}

module.exports = setGlobalCovidData;
