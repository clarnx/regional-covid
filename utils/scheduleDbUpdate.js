const fetchCovid19Data = require("./fetchCovid19Data");

async function scheduleDbUpdate(countryName, redisDB, updateFrequency) {
  const intervalID = setInterval(async () => {
    const covid19Data = await fetchCovid19Data(countryName);
    await redisDB.saveDataInCache(covid19Data);
  }, updateFrequency * 3600000);
}

module.exports = scheduleDbUpdate;
