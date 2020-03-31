var cron = require("node-cron");
const fetchCovid19Data = require("./fetchCovid19Data");

async function scheduleDbUpdate(countryName, redisDB, updateFrequencyInHours) {
  cron.schedule(`* */${updateFrequencyInHours} * * *`, async () => {
    const covid19Data = await fetchCovid19Data(countryName);
    await redisDB.saveDataInCache(covid19Data);
  });
}

module.exports = scheduleDbUpdate;
