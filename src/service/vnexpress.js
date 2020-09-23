/* eslint-disable func-names */
import cheerio from 'cheerio';
import config from '../config';
import { fetchData } from '../util/request';
import { sendToQueue } from '../util/queue';

const getDescription = (cheerioStatic) => {
  const bodyContent = cheerioStatic('body');
  return bodyContent.find('.description');
};

const pushData = async (data) => {
  sendToQueue({ ...data });
};

export const vnExpressKinhDoanhPage = () => {
  // Crawl from page 1 to 4.
  for (let i = 0; i <= 3; i++) {
    const originLink = `${config.vnexpressKinhdoanhPage}/p${i + 1}`;
    fetchData(originLink).then((res) => {
      const html = res.data;
      const cheerioStatic = cheerio.load(html);
      const description = getDescription(cheerioStatic);
      description.each(function () {
        const title = cheerioStatic(this).prev().text();
        if (title) {
          config.keywords.forEach((word) => {
            const matched = title.match(word);
            if (matched) {
              const shortDescription = cheerioStatic(this).find('a').text();
              const link = cheerioStatic(this).find('a').attr('href');
              // Handle push data to message queue
              pushData({ link, title, shortDescription, originLink });
            }
          });
        }
      });
    });
  }
};

export const vnExpressChungKhoanPage = () => {
  for (let i = 0; i <= 3; i++) {
    const originLink = `${config.vnexpressKinhdoanhPage}/p${i + 1}`;
    fetchData(originLink).then((res) => {
      const html = res.data;
      const cheerioStatic = cheerio.load(html);
      const description = getDescription(cheerioStatic);
      description.each(function () {
        const title = cheerioStatic(this).prev().text();
        if (title) {
          config.keywords.forEach((word) => {
            const matched = title.match(word);
            if (matched) {
              const shortDescription = cheerioStatic(this).find('a').text();
              const link = cheerioStatic(this).find('a').attr('href');
              // Handle push data to message queue
              pushData({ link, title, shortDescription, originLink });
            }
          });
        }
      });
    });
  }
};

vnExpressKinhDoanhPage();
vnExpressChungKhoanPage();
