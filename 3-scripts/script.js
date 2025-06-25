import { secToMin } from "./utility.js";

async function main() {
  let songs = await getSongs();

  let currSong = new Audio();
  let currSongIndex = 0
  currSong.src = songs[currSongIndex];

  let timer = document.querySelector(".timer");
  let hasMoved = document.querySelector(".has-moved");
  let circle = document.querySelector(".circle");

  currSong.addEventListener("timeupdate", () => {
    //shows the timer on the playBar
    let currentTime = currSong.currentTime || 0;
    let duration = currSong.duration || 0;
    timer.textContent = `${secToMin(currentTime)}/${secToMin(duration)}`

    //seekbar moves according to playtime.
    let speed = currentTime / duration * 100;
    hasMoved.style.width = speed + "%";
    circle.style.left = speed + "%";
  })

  //Song plays by clicking on the list of Library
  let items = document.querySelectorAll(".song-list-container ul li");
  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      currSongIndex = index;
      currSong.src = songs[currSongIndex];
      currSong.play();
      appendSongName(songs,currSongIndex);
    })
  });

  var previousBtn = document.querySelector(".nav-btn").firstElementChild;
  let playBtn = previousBtn.nextElementSibling;
  let nextBtn = playBtn.nextElementSibling;

  let playIcon = "/4-images/svg/play-circle.svg"
  let pauseIcon = "/4-images/svg/pause-circle.svg"

  // "disable" is a class adds opacity 0.5 to create a disabling effect.
  // disable effect currSongIndex is 0 at inception.
  previousBtn.classList.add("disable");

  // made play/pause button work
  playBtn.addEventListener("click", () => {
    if (currSong.paused) {
      currSong.play();
      playBtn.src = pauseIcon;
    } else {
      currSong.pause();
      playBtn.src = playIcon;
    }
    appendSongName(songs,currSongIndex);
  })

  // made the previousBtn work
  previousBtn.addEventListener("click", () => {
    nextBtn.classList.remove("disable");
    console.log(currSongIndex, songs.length)
    if (currSongIndex > 0) {
      currSongIndex -= 1;
      currSong.src = songs[currSongIndex];
      currSong.play();
      playBtn.src = pauseIcon;
    }
    if (currSongIndex == 0) {
      previousBtn.classList.add("disable");
    }
    appendSongName(songs,currSongIndex);
  })

  //made the nextBtn work
  nextBtn.addEventListener("click", () => {
    previousBtn.classList.remove("disable");
    if (currSongIndex < songs.length - 1) {
      currSongIndex += 1;
      currSong.src = songs[currSongIndex];
      currSong.play();
      playBtn.src = pauseIcon;
    }
    if (currSongIndex == songs.length - 1) {
      nextBtn.classList.add("disable");
    }
    appendSongName(songs,currSongIndex);
  })
  interactiveSeekbar(currSong);
  appendSongName(songs,currSongIndex);

}
main();

async function getSongs() {
  let a = await fetch("/5-Songs");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let songsList = [];
  div.querySelectorAll("a").forEach(a => {
    if (a.href.endsWith(".mp3")) {
      songsList.push(a.href.split("http://127.0.0.1:5500")[1]);
    }

  });
  // rendering the Html to the library on the basics of songsList
  songsList.forEach(song => {

  })
  renderHtml(songsList);
  return songsList;

}

// function renderHtml(songsList) {
//   let html = '';
//   songsList.forEach(song => {
//     //when spliting it would choose the last part containing mp3 extension
//     let index = song.split("/").length - 1;
//     html += `
//             <li>
//               <img class="invert" src="/4-images/svg/music-note.svg" alt="" />
//               <div class="song-bio">
//                 <div class="song-name stop-overflow">${song.split("/")[index]}</div>
//                 <div class="artist-name">This would be the artist name</div>
//               </div>
//             </li>
//     `
//   })

//   document.querySelector(".song-list-container ul").innerHTML = html;
// }

function interactiveSeekbar(currSong) {
  let isPlaying;
  let hasMoved = document.querySelector(".has-moved");
  let circle = document.querySelector(".circle");
  let seekbar = document.querySelector(".seekbar");

  //move circle and hasMoved to where it is clicked
  seekbar.addEventListener("click", evt => calcPercent(evt.clientX));

  //In case if the circle is clicked and dragged.
  circle.addEventListener("mousedown", evt => {
    evt.preventDefault();
    isPlaying =  !currSong.paused;
    document.addEventListener("mousemove", handleDrag);
    if(isPlaying){
      currSong.pause();
    }
  });
  document.addEventListener("mouseup", evt => {
    document.removeEventListener("mousemove", handleDrag);
    if(isPlaying){
      currSong.play();
    }
   
  })

  function calcPercent(clientX) {
    let rect = seekbar.getBoundingClientRect();
    let deltaX = clientX - rect.left;
    let precentage = deltaX / rect.width * 100;

    currSong.currentTime = precentage * currSong.duration / 100;
  }

  function handleDrag(e) {
    calcPercent(e.clientX)
  }
}
function appendSongName(songs,currSongIndex){
  let name = document.querySelector(".playbar-flex").firstElementChild;
  name.textContent = songs[currSongIndex].split("Songs/")[1];

}

function hamburger(){
  let hamburger = document.querySelector(".hamburger");
  let close = document.querySelector(".close");
  let leftBox = document.querySelector(".left");

  hamburger.addEventListener("click",() => {
    leftBox.style.left = '0%'
  })
  close.addEventListener("click",() => {
    leftBox.style.left = "-100%"
  })

}
hamburger();

