const https = require('https');
const urls = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ma_Long_Rio_2016.jpg/800px-Ma_Long_Rio_2016.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ma_Long_Rio_2016.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/d4/Fan_Zhendong_2016.png",
  "https://upload.wikimedia.org/wikipedia/commons/d/d9/Zhang_Jike_Rio_2016.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/d4/Xu_Xin_Rio_2016.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/e3/Wang_Chuqin_2019.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Sun_Yingsha_2019.jpg"
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(url, res.statusCode);
  });
});
