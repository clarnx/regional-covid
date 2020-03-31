// MIT License

// Copyright (c) [2020] [Clarence Love]

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const express = require("express");

const redisDB = require("./utils/redisDB");
const init = require("./utils/init");

const HTTP_SERVER_PORT = process.env.HTTP_SERVER_PORT || 5000;

const app = express();

const homeResponse = `<h2>Regional Covid is a custom API that focuses on providing local or regional COVID-19 data based on data from <a href='https://bing.com/covid' target='_blank'>https://bing.com/covid</a>.</h2>
<p>Get the API data for your region by adding <i>/covid/[your_country]</i> at the end of the URL of this current page. <br> Note that <i>[your_country]</i> is the full name of your country without any spaces. Also typing any other country which is not your default country will redirect to the default country.</p>`;

app.get("/", (req, res) => res.send(homeResponse));

app.get("/covid/", (req, res) => res.redirect("/"));

app.get("/covid/:country", redisDB.serveCachedData, init);

app.listen(HTTP_SERVER_PORT, () => {
  console.log(`Server running on ${HTTP_SERVER_PORT}`);
});
