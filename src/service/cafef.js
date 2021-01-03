/* eslint-disable func-names */
import cheerio from 'cheerio';
import config from '../config';
import { fetchData } from '../util/request';
import { sendToQueue } from '../util/queue';

const homepageLink = `${config.cafefDomain}`;

const convertStrToCreatedDate = (data) => {
  const year = data.substring(0, 4);
  const month = data.substring(4, 6);
  const day = data.substring(6, 8);
  return new Date(`${year}-${month}-${day}`);
};

const pushData = async (data) => {
  sendToQueue({ ...data });
};

const getLiTags = (cheerioStatic) => {
  const bodyContent = cheerioStatic('body');
  return bodyContent.find('.tlitem');
};

export const cafefNews = (domain) => {
  for (let i = 1; i <= 10; i++) {
    const originLink = `${domain}trang-${i}.chn`;
    fetchData(originLink).then((res) => {
      const html = res.data;
      const cheerioStatic = cheerio.load(html);
      const liTags = getLiTags(cheerioStatic);
      liTags.each(function () {
        const aTag = cheerioStatic(this).find('.avatar');
        const title = aTag.attr('title');
        if (title) {
          config.keywords.forEach((word) => {
            const matched = title.match(word);
            if (matched) {
              const dateAttr = cheerioStatic(this).attr('data-newsid');
              const createdDate = convertStrToCreatedDate(dateAttr);
              const shortDescription = cheerioStatic(this).find('.knswli-right').find('.sapo').text();
              const link = aTag.attr('href');
              const image = aTag.find('img').attr('src');
              // Handle push data to message queue
              pushData({
                publishedDate: new Date(),
                link: `${homepageLink}${link}`,
                image,
                title,
                shortDescription,
                originLink,
                createdDate
              });
            }
          });
        }
      });
    });
  }
};
