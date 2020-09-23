/* eslint-disable func-names */
import cheerio from 'cheerio';
import config from '../config';
import { fetchData } from '../util/request';
import { sendToQueue } from '../util/queue';

const pushData = async (data) => {
  sendToQueue({ ...data });
};

const getATags = (cheerioStatic) => {
  const bodyContent = cheerioStatic('body');
  return bodyContent.find('a');
};

export const vietstockHompagePage = () => {
  const originLink = `${config.vietstockDomain}`;
  fetchData(originLink).then((res) => {
    const html = res.data;
    const cheerioStatic = cheerio.load(html);
    const aTags = getATags(cheerioStatic);
    aTags.each(function () {
      const title = cheerioStatic(this).text();
      if (title) {
        config.keywords.forEach((word) => {
          const matched = title.match(word);
          if (matched) {
            const shortDescription = cheerioStatic(this).text();
            const link = cheerioStatic(this).attr('href');
            // Handle push data to message queue
            pushData({ link, title, shortDescription, originLink });
          }
        });
      }
    });
  });
};

vietstockHompagePage();
