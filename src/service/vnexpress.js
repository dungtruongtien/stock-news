import config from "../config";
import axios from "axios";
import cheerio from "cheerio";
const url = config.expressDomain;

const keywords = [
  "hoaphat",
  "Hòa Phát",
  "thép",
  "thep",
  "evfta",
  "Mazda6",
  "EVFTA",
  "nCoV",
];

fetchData(url).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  const statsTable = $(".title-news");
  statsTable.each(function (stat) {
    keywords.forEach((word) => {
      const matched = $(this).find("a").attr("title").match(word);
      if (matched) {
        const link = $(this).find("a").attr("href");
        console.log("link------", link);
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
