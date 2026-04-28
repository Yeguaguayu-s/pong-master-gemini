import fs from 'fs';

async function fetchWikiImage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=800`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data.query.pages;
  for (let key in pages) {
    if (pages[key].thumbnail) {
      console.log(title, pages[key].thumbnail.source);
    } else {
      console.log(title, 'No thumbnail');
    }
  }
}

async function main() {
  await fetchWikiImage('Ma_Long');
  await fetchWikiImage('Fan_Zhendong');
  await fetchWikiImage('Zhang_Jike');
  await fetchWikiImage('Xu_Xin');
  await fetchWikiImage('Wang_Chuqin');
  await fetchWikiImage('Sun_Yingsha');
}

main();
