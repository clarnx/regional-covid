# regional-covid
Regional Covid is a custom API that focuses on providing local or regional COVID-19 data based on data from https://bing.com/covid

# How The API Works

Once the default country is set, **Total Global** data, **Regional** OR **Local** data is scraped from https://bing.com/covid by Puppeteer and then saved to a Redis Database which is an in-memory data structure store, used as a database, cache and message broker. Redis is *wicked fast* hence the choice of database for this project.

When End-users consume the API which has been set to the default country or region by you(API admin), a cached version of the data is served. Any subsequent visit to the API endpoint also result in a cached version of the data served.
A Cron Job is scheduled to update the Redis Datastore every **hour**(*you can change the update frequency. check the getting started guide below*). Therefore End-users will be served an updated cached version of the data after every hour.

<ins>**Sample JSON Data Served**</ins>

```json
{
   "globalTotalConfirmedCases":"803,313",
   "globalActiveCases":"601,362",
   "globalRecoveredCases":"162,937",
   "globalFatalCases":"39,014",
   "localData":[
      {
         "country":"united states",
         "localTotalConfirmedCases":"174,410",
         "localActiveCases":"165,023",
         "localRecoveredCases":"5,995",
         "localFatalCases":"3,392"
      }
   ],
   "dataLastUpdated":"3/31/2020, 4:36:41 PM"
}
```
<ins>**API Routes**</ins>
1. `/`
2. `/covid/[country]` [country] is the name of your country or region e.g: `/covid/australia`
3. `/covid` redirects to `/`
4. Any other routes apart from the above results in a 404 error

# Motive For This Project

The motive for this project is due to the fact that most API's out there serving COVID-19 data, serve data that is too cluttered and not focused on Local OR Regional data. Recently infomation out there indicates that South Koreans are using apps to avoid someone who’s had Covid-19 nearby based on local data. 
Local or Regional data will help other developers build data focused applications to help fight the current pandemic.
It's also a way for me to improve upon my skills by learning something new during a self quarantine period. LOL.

Anyone is welcomed to also add features or contribute to this project if you are interested and have the time.

# Getting started

This project is a **[Node.js](https://nodejs.org/en/)** application that uses the dependencies **[Express](https://github.com/expressjs/express)**, **[Node Cron](https://github.com/node-cron/node-cron)**, **[Puppeteer](https://github.com/puppeteer/puppeteer)**, and **[Node Redis](https://github.com/NodeRedis/node-redis)**

To get started with the project on your computer locally, set the following Environmental Variables on your computer.

## 1. Setting Environmental Variables

|Environmental Variable| Sample Value |
|--|--|
|COVID_DATA_DB_KEYNAME | covid19_redis_database_key  |
|REDIS_DB_PORT | 6379  |
|REDIS_DB_ENDPOINT | 127.0.0.1 |
|REDIS_DB_PASSWORD | rkkjg985e4jgw0t9jsgooiss  |

> **Note:** The Environmental Variable **REDIS_DB_PASSWORD** is only needed when you have access to a remote redis database server. If the value of **COVID_DATA_DB_KEYNAME** is not set, the value defaults to **covid19_data**. Also you can ignore **REDIS_DB_PORT**, **REDIS_DB_ENDPOINT**, and **REDIS_DB_PASSWORD** since it will default and connect your local installation of a Redis Server. Make sure to install redis locally to prevent any errors.

## 2. Start The Application

Once you have a cloned version of this repo on your computer, you can run `npm install` to install dependencies and then `npm run start` to start the application.

## 3. Set The Default Region

Once the application is running you can initialize and set the default country or region by visiting the URL:
  ------------------------------------
**127.0.0.1:[port]/covid/[your_country]**
  ------------------------------------
[port] is the port of the express server which is **5000** by default. You can change the value of the port in the **index.js** file. [your_country] is the full name of your country without any spaces.
**e.g:** *127.0.0.1:5000/covid/unitedstates*

> **Note:** You can set the default region or country **only!!! once**. Once you set the default country or region the data is cached in the Redis Database. Any subsequent visit to the same URL will result in a response of the cached version of the data. Also once the region or country is set trying to get data for a different country by visiting a different country will result in a redirect to the homepage. **You as an *API admin* or *Redis Server Admin* can only change the default country by deleting the data in the Redis Server and then visit the URL again with the new name of the country or region**. End users will only get a cached version of the data which is *wicked fast!!!*. 

Data is scheduled to be updated every hour by the help of the node.js package **node-cron**. 
> **Note:** You can change the update frequency value in **/utils/init.js** file. 

Project sample hosted by [opeNode.io](https://www.openode.io/)
