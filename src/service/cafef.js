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

const getATags = (cheerioStatic) => {
  const bodyContent = cheerioStatic('body');
  return bodyContent.find('a');
};

const cafefHompagePage = () => {
  // Crawl from page 1 to 4.
  fetchData(homepageLink).then((res) => {
    const html = res.data;
    const cheerioStatic = cheerio.load(html);
    const aTags = getATags(cheerioStatic);
    aTags.each(function () {
      const title = cheerioStatic(this).text();
      if (title) {
        config.keywords.forEach((word) => {
          const matched = title.match(word);
          if (matched) {
            const link = cheerioStatic(this).attr('href');
            const shortDescription = cheerioStatic(this).find('a').text();
            // Handle push data to message queue
            pushData({ link: `${homepageLink}${link}`, title, shortDescription, originLink: homepageLink });
          }
        });
      }
    });
  });
};

const cafefSubPageCrawler = (domain) => {
  for (let i = 0; i < 20; i++) {
    const originLink = `${domain}trang-${i + 1}.chn`;
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
              pushData({ link: `${homepageLink}${link}`, image, title, shortDescription, originLink, createdDate });
            }
          });
        }
      });
    });
  }
};

cafefSubPageCrawler(config.cafeChungKhoanDomain);
cafefSubPageCrawler(config.cafeThiTruongDomain);
cafefHompagePage();
