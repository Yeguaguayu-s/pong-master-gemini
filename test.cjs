const https = require('https');

function getBaiduPic(query) {
  const url = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}&tn=json`;
  // Let's use sogou pic directly instead, let's scrape HTML.
}
