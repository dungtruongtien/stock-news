/* eslint-disable camelcase */
import cheerio from 'cheerio';
import config from '../config';
import { fetchData } from '../util/request';
import { sendToQueue } from '../util/queue';

const homepageLink = `${config.vtcDomain}`;
const originLink = 'https://vtv.vn/timeline/90/';
// https://vtv.vn/timeline/90/trang-4.htm

const convertStrToCreatedDate = (data) => {
  const year = data.substring(0, 4);
  const month = data.substring(4, 6);
  const day = data.substring(6, 8);
  return new Date(`${year}-${month}-${day}`);
};

const getLiTags = (cheerioStatic) => {
  const bodyContent = cheerioStatic('body');
  return bodyContent.find('.tlitem');
};

const pushData = async (data) => {
  sendToQueue({ ...data });
};

export const vtcKinhTe = async () => {
  for (let i = 0; i < 20; i++) {
    const news = await fetchData(`${originLink}/trang-${i + 1}.htm`);
    const html = news.data;
    const cheerioStatic = cheerio.load(html);
    const liTags = getLiTags(cheerioStatic);
    liTags.each(function () {
      const aTag = cheerioStatic(this).find('a');
      const title = aTag.attr('title');
      if (title) {
        config.keywords.forEach((word) => {
          const matched = title.match(word);
          if (matched) {
            const dateAttr = cheerioStatic(this).attr('data-newsid');
            const createdDate = convertStrToCreatedDate(dateAttr);
            const shortDescription = cheerioStatic(this).find('.sapo').text();
            const link = aTag.attr('href');
            const image = aTag.find('img').attr('src');
              // Handle push data to message queue
            pushData({ link: `${homepageLink}${link}`, image, title, shortDescription, originLink, createdDate });
          }
        });
      }
    });
  }
};
