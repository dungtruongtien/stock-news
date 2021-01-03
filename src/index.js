import config from './config';
import {
  CHUNG_KHOAN_GIAO_DICH_LON_LINK,
  CHUNG_KHOAN_LINK,
  DOANH_NGHIEP_LINK,
  NDH_CHUNGKHOAN_CATE,
  NDH_DOANHNGHIEP_CATE,
  VIETSTOCK_CHUNGKHOAN_CHANNEL_ID,
  VIETSTOCK_COPHIEU_CHANNEL_ID,
  VIETSTOCK_GIAODICHNOIBO_CHANNEL_ID,
  VTV_KINHTE_CATE,
  VTV_TAICHINH_CATE,
  VTV_THITRUONG_CATE
} from './config/constant';
import { cafefNews } from './service/cafef';
import { ndhNews } from './service/ndh';
import { vietnambizChungKhoan } from './service/vietnambiz';
import { vietstockChungKhoan } from './service/vietstock';
import { vtvNews } from './service/vtv';

cafefNews(config.cafeChungKhoanDomain);
cafefNews(config.cafeThiTruongDomain);


ndhNews(NDH_DOANHNGHIEP_CATE);
ndhNews(NDH_CHUNGKHOAN_CATE);


vtvNews(VTV_KINHTE_CATE);
vtvNews(VTV_TAICHINH_CATE);
vtvNews(VTV_THITRUONG_CATE);


vietstockChungKhoan(VIETSTOCK_COPHIEU_CHANNEL_ID);
vietstockChungKhoan(VIETSTOCK_CHUNGKHOAN_CHANNEL_ID);
vietstockChungKhoan(VIETSTOCK_GIAODICHNOIBO_CHANNEL_ID);


vietnambizChungKhoan(CHUNG_KHOAN_LINK);
vietnambizChungKhoan(DOANH_NGHIEP_LINK);
vietnambizChungKhoan(CHUNG_KHOAN_GIAO_DICH_LON_LINK);
