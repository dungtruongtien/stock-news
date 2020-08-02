require('dotenv').config();

export default {
    expressDomain: process.env.VNEXPRESS_DOMAIN ||  '',
    vietstockDomain: process.env.VIETSTOCK_DOMAIN ||  '',
    cafefDomain: process.env.CAFEF_DOMAIN ||  '',
}