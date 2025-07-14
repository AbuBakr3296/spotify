
async function getSongs(folder) {
  let a = await fetch(`/5-Songs/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let songsList = [];
  div.querySelectorAll("a").forEach((a) => {
    if (a.href.endsWith(".mp3")) {
      songsList.push(a.href.split(`http://127.0.0.1:5500`)[1]);
    }
  });
  // rendering the Html to the library on the basics of songsList
  let html = "";
  songsList.forEach((song) => {
    //when spliting it would choose the last part containing mp3 extension
    let index = song.split("/").length - 1;
    html += `
            <li>
              <img src="/4-images/svg/music-note.svg" alt="" />
              <div class="song-bio">
                <div class="song-name stop-overflow">${song.split("/")[index]
      }</div>
                <div class="artist-name">This would be the artist name</div>
              </div>
            </li>
    `;
  });

  document.querySelector(".song-list-container").innerHTML = html;
}
function songListFunc(folder) {
  let songsList = [];
  document.querySelectorAll(".song-list-container li").forEach(li => {
    let name = li.querySelector(".song-name").textContent;
    songsList.push(`/5-Songs/${folder}/${name}`);
    // console.log(songsList);
  })
  return songsList;
}




main();
async function main() {

}






function loopFunc(Plist, index, btn) {
  
}