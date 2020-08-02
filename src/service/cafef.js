const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://cafef.vn";

const keywords = ['hoaphat', 'Hòa Phát', 'thép', 'thep', 'evfta', 'Mazda6', 'EVFTA'];

fetchData(url).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  const statsTable = $("h3");
  statsTable.each(function () {
    keywords.forEach(word => {
      const matched = $(this).find('a').attr('title').match(word);
      if(matched) {
        console.log('a href---------', `https://cafef.vn${$(this).find('a').attr('href')}`);
      }
    })
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
