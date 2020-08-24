/* eslint-disable camelcase */
import { format } from 'date-fns';
import config from '../config';
import { fetchData } from '../util/request';
import { sendToQueue } from '../util/queue';

const NDH_CHUNGKHOAN_CATE = '1000527';
const NDH_DOANHNGHIEP_CATE = '1000595';

const originLink = 'https://ndh.vn/lazyload-more';

const pushData = async (data) => {
  sendToQueue({ ...data });
};

const ndhNews = async (cateId) => {
  for (let i = 0; i < 10; i++) {
    const news = await fetchData(originLink, {
      params: { data: { page: i, cate_id: cateId } }
    });
    const { data: { data: newsData } } = news;
    newsData.forEach((newData) => {
      const { title, share_url, lead, thumbnail_url, publish_time } = newData;
      const matched = config.keywords.find((keyword) => !!title.match(keyword));
      if (matched) {
        pushData({
          link: `${originLink}${share_url}`,
          createdDate: new Date(publish_time * 1000),
          title,
          shortDescription: lead,
          originLink,
          image: thumbnail_url
        });
      }
    });
  }
};

ndhNews(NDH_DOANHNGHIEP_CATE);
ndhNews(NDH_CHUNGKHOAN_CATE);
