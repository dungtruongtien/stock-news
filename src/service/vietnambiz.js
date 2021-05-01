/* eslint-disable func-names */
import cheerio from 'cheerio';
import config from '../config';
import { fetchData } from '../util/request';
import { sendToQueue } from '../util/queue';

const pushData = async (data) => {
  sendToQueue({ ...data });
};

const getNewsOnTopPage = (cheerioStatic) => {
  const bodyContent = cheerioStatic('body');
  return bodyContent.find('.w510.fl');
};

export const vietnambizChungKhoan = (apiLink) => {
  const originLink = 'https://vietnambiz.vn';
  for (let i = 1; i <= 5; i++) {
    fetchData(`${originLink}/${apiLink}/trang-${i}.htm`).then((res) => {
      const html = res.data;
      const cheerioStatic = cheerio.load(html);
      const newsOnTopPage = getNewsOnTopPage(cheerioStatic);
      const newstreams = newsOnTopPage.find('.news-stream');
      const listNews = newstreams.find('.listnews li');
      listNews.each(function () {
        const image = cheerioStatic(this).find('img');
        const description = cheerioStatic(this).find('.description');
        const title = description.find('h3.title a').text();
        if (title) {
          config.keywords.forEach((word) => {
            const matched = title.match(new RegExp(word, 'i'));
            if (matched) {
              const link = `${originLink}${description.find('a').attr('href')}`;
              const imageLink = image.attr('src');
              const shortDescription = description.find('.sapo').text();
              const date = description.find('.need-get-timeago').attr('title');
              // Handle push data to message queue
              pushData({
                link,
                createdDate: new Date(date),
                title,
                shortDescription,
                originLink,
                image: imageLink,
                publishedDate: new Date()
              });
            }
          });
        }
      });
    });
  }
};

