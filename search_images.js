async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&gsrlimit=15`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data.query?.pages;
  const urls = [];
  if (pages) {
    for (let key in pages) {
      if (pages[key].imageinfo && pages[key].imageinfo[0].url.match(/\.(jpg|jpeg|png)$/i)) {
        urls.push(pages[key].imageinfo[0].url);
      }
    }
  }
  console.log(query, urls.slice(0, 5));
}

searchCommons("Wang Chuqin");
searchCommons("Sun Yingsha");
