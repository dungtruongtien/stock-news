/* eslint-disable func-names */
import cheerio from 'cheerio';
import config from '../config';
import { fetchData } from '../util/request';
import { sendToQueue } from '../util/queue';

const apiLink = 'https://vietstock.vn/StartPage/ChannelContentPage';

const pushData = async (data) => {
  sendToQueue({ ...data });
};

const getSectionTag = (cheerioStatic) => {
  const bodyContent = cheerioStatic('body');
  return bodyContent.find('section');
};

export const vietstockChungKhoan = (channelId) => {
  const originLink = 'https://vietstock.vn/chung-khoan.htm';
  for (let i = 1; i <= 1; i++) {
    fetchData(apiLink, { method: 'POST', data: { channelID: channelId, page: i } }).then((res) => {
      const html = res.data;
      const cheerioStatic = cheerio.load(html);
      const sections = getSectionTag(cheerioStatic);
      sections.each(function () {
        const title = cheerioStatic(this).find('.channel-title').text();
        if (title) {
          config.keywords.forEach((word) => {
            const matched = title.match(new RegExp(word, 'i'));
            if (matched) {
              const date = cheerioStatic(this).find('.date').text();
              const convertedDate = date.split(' ')[0].split('/');
              const dateFormat = new Date(`${convertedDate[2]}-${convertedDate[1]}-${convertedDate[0]}`);
              const shortDescription = cheerioStatic(this).find('.visible-md.visible-lg').text();
              // eslint-disable-next-line max-len
              const link = `${config.vietstockDomain}${cheerioStatic(this).find('.channel-title').find('a').attr('href')}`;
              const image = cheerioStatic(this).find('.thumb').find('img').attr('src');
              // Handle push data to message queue
              pushData({
                link,
                createdDate: new Date(dateFormat),
                title,
                shortDescription,
                originLink,
                image,
                publishedDate: new Date()
              });
            }
          });
        }
      });
    });
  }
};
