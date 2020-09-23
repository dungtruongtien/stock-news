import config from './config';
import { NDH_CHUNGKHOAN_CATE, NDH_DOANHNGHIEP_CATE } from './config/constant';
import { cafefSubPageCrawler } from './service/cafef';
import { ndhNews } from './service/ndh';
import { vtcKinhTe } from './service/vtc';

cafefSubPageCrawler(config.cafeChungKhoanDomain);
cafefSubPageCrawler(config.cafeThiTruongDomain);
ndhNews(NDH_DOANHNGHIEP_CATE);
ndhNews(NDH_CHUNGKHOAN_CATE);
vtcKinhTe();
