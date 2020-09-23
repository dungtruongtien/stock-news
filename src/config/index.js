require('dotenv').config();

export default {
  vnexpressKinhdoanhPage: process.env.VNEXPRESS_KINHDOANH_DOMAIN || '',
  vnexpressChungkhoanPage: process.env.VNEXPRESS_CHUNGKHOAN_DOMAIN || '',
  vietstockDomain: process.env.VIETSTOCK_DOMAIN || '',
  cafefDomain: process.env.CAFEF_DOMAIN || '',
  vtvDomain: process.env.VTV_DOMAIN || '',
  cafeChungKhoanDomain: process.env.CAFEF_CHUNGKHOAN_DOMAIN || '',
  cafeThiTruongDomain: process.env.CAFEF_THITRUONG_DOMAIN || '',
  keywords: process.env.KEYWORDS ? process.env.KEYWORDS.split('|') : ['']
};
