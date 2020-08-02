const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://vietstock.vn";

const keywords = ["Dragon"];

fetchData(url).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  const statsTable = $("h1.title, h4.title, li>h5>a");
  statsTable.each(function () {
    const element = $(this).find("a");
    keywords.forEach((word) => {
      const title = element.text();
      if (title) {
        const matched = title.match(word);
        if (matched) {
          const link = `https://vietstock.vn${element.attr("href")}`;
          console.log("link========", link);
        }
      }
    });
  });
});

async function fetchData(url) {
  console.log("Crawling data...");
  // make http call to url
  let response = await axios(url).catch((err) => console.log(err));

  if (response.status !== 200) {
    console.log("Error occurred while fetching data");
    return;
  }
  return response;
}
