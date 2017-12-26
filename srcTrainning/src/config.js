// require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  hasHeader: false,
  hasMobile: true,
  domain: '',
  code: '9090',
  type: 'web',
  img: '//vipn.net/styles/app/9090',
  version: '4.1',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: '',
    description: '',
    head: {
      titleTemplate: '%s',
      meta: [
        { name: 'description', content: '' },
        { charset: 'utf-8' }
      ]
    }
  },
  defaultAvatar: 'http://img.umbala.vn/noimage/avatardefault.jpg',
  defaultCover: 'http://img.umbala.vn/noimage/coverdefault.jpg',
  imageSelectorOrigin: 'https://www.img.umbala.vn',
}, environment);
