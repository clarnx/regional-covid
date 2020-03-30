const redis = require("redis");

const REDIS_DB_PORT = process.env.REDIS_DB_PORT;
const REDIS_DB_ENDPOINT = process.env.REDIS_DB_ENDPOINT;
const REDIS_DB_PASSWORD = process.env.REDIS_DB_PASSWORD;

const COVID_DATA_DB_KEYNAME = process.env.COVID_DATA_DB_KEYNAME || "covid19Data";

const client = redis.createClient({
  port: REDIS_DB_PORT, // replace with your port
  host: REDIS_DB_ENDPOINT, // replace with your hostanme or IP address
  password: REDIS_DB_PASSWORD
});

client
  .on("connect", () => {
    console.log("redis connected");
  })
  .on("error", error => {
    console.error(error);
  });

async function getData(cb) {
  let dbData;
  client.get(COVID_DATA_DB_KEYNAME, function(err, reply) {
    if (err) throw err.message;

    dbData = JSON.parse(reply);

    cb(dbData);
  });
}

function serveCachedData(req, res, next) {
  client.get(COVID_DATA_DB_KEYNAME, function(err, reply) {
    // reply is null when the key is missing
    if (err) throw err.message;

    if (reply !== null) {
      const currentCountryInCache = JSON.parse(reply).localData[0].country;

      const requestCountry = req.params.country;

      if (currentCountryInCache.replace(/\s+/g, "") === requestCountry) {
        res.json(JSON.parse(reply));
      } else {
        res.redirect(`/covid/${currentCountryInCache.replace(/\s+/g, "")}`);
      }
    } else {
      next();
    }
  });
}

async function saveDataInCache(covid19Data) {
  client.set(COVID_DATA_DB_KEYNAME, JSON.stringify(covid19Data));
}

module.exports = { serveCachedData, saveDataInCache, getData };
