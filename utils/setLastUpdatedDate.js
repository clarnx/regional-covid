async function setLastUpdatedDate(page, covid19Data) {
  const dataInformationIcon = await page.$(
    '.headerButtons div[title="Data information"] svg'
  );

  await dataInformationIcon.click();

  await page.waitForSelector(".infoCallout p br");

  const dataInformationIconInnerText = await page.$eval(
    ".infoCallout p br",
    el => el.nextSibling.textContent
  );

  covid19Data.dataLastUpdated = dataInformationIconInnerText;
}

module.exports = setLastUpdatedDate;
