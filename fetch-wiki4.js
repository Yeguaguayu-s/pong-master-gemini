const urls = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Ma_Long_ATTC2017_29.jpeg/800px-Ma_Long_ATTC2017_29.jpeg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/ITTF_World_Tour_2017_German_Open_Fan_Zhendong_03.jpg/800px-ITTF_World_Tour_2017_German_Open_Fan_Zhendong_03.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mondial_Ping_-_Men%27s_Singles_-_Final_-_Zhang_Jike_vs_Wang_Hao_-_40.jpg/800px-Mondial_Ping_-_Men%27s_Singles_-_Final_-_Zhang_Jike_vs_Wang_Hao_-_40.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Table_tennis_at_the_2018_Summer_Youth_Olympics_%E2%80%93_Men%27s_Singles_Gold_Medal_Match_068_%28cropped%29.jpg/800px-Table_tennis_at_the_2018_Summer_Youth_Olympics_%E2%80%93_Men%27s_Singles_Gold_Medal_Match_068_%28cropped%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/16/Sun_Yingsha.png",
  "https://upload.wikimedia.org/wikipedia/commons/5/57/Xu_Xin_2012.jpg"
];

async function check() {
  for (let url of urls) {
     const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
     console.log(res.status, url);
  }
}
check();
