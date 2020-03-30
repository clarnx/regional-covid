const redisDB = require("./redisDB");
const fetchCovid19Data = require("./fetchCovid19Data");
const scheduleDbUpdate = require("./scheduleDbUpdate");

const init = (req, res) => {
  (async () => {
    try {
      const { country } = req.params;

      const covid19Data = await fetchCovid19Data(country, res);

      if (covid19Data !== undefined) {
        await redisDB.saveDataInCache(covid19Data);

        await scheduleDbUpdate(country, redisDB, 1);
      }

      res.json(covid19Data);
    } catch (error) {
      console.log(error.message);
      response.status(500).send("Sorry server could  not process request.");
    }
  })();
};

module.exports = init;
