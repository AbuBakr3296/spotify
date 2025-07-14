import { secToMin } from "./utility.js";

async function main() {
  let songsList = await getSongs();
  renderHtml(songsList);

  let currSong = new Audio();
  let currSongIndex = 0;
  currSong.src = songsList[currSongIndex];

  let currTimeDiv = document.querySelector(".current-time");
  let durationDiv = document.querySelector(".duration");
  let hasMoved = document.querySelector(".has-moved");
  let circle = document.querySelector(".circle");

  currSong.addEventListener("timeupdate", () => {
    //shows current Time and total Duration on the playBar
    let currTime = currSong.currentTime || 0;
    let duration = currSong.duration || 0;
    currTimeDiv.textContent = secToMin(currTime);
    durationDiv.textContent = secToMin(duration);

    //seekbar moves according to playtime.
    let speed = (currTime / duration) * 100;
    hasMoved.style.width = speed + "%";
    circle.style.left = speed + "%";
  });

  let previousBtn = document.querySelectorAll(".nav-btn")[1].firstElementChild;
  let playBtn = previousBtn.nextElementSibling;
  let nextBtn = playBtn.nextElementSibling;
  let playIcon = "/4-images/svg/play-circle.svg";
  let pauseIcon = "/4-images/svg/pause-circle.svg";

  //Song plays by clicking on the list of Library
  document.querySelectorAll(".song-list-container li")
  .forEach((item, index) => {
    item.addEventListener("click", () => {
      currSongIndex = index;
      currSong.src = songsList[currSongIndex];
      currSong.play();

      renderSongName(songsList, currSongIndex);
      playBtn.src = pauseIcon;
      disableCheck();
    });
  });
  //nav-btn is served at two places, one at the hamburger's nav
  // and 2nd spot is this, In order to prevent clutter used [1] to select these btns.

  // made play/pause button interactive
  playBtn.addEventListener("click", () => {
    if (currSong.paused) {
      currSong.play();
      playBtn.src = pauseIcon;
    } else {
      currSong.pause();
      playBtn.src = playIcon;
    }
  });

  // made the previousBtn interactive
  previousBtn.addEventListener("click", () => {
    if (currSongIndex > 0) {
      currSongIndex -= 1;
      currSong.src = songsList[currSongIndex];
      currSong.play();
      playBtn.src = pauseIcon;
    }
    renderSongName(songsList, currSongIndex);
    disableCheck();
  });

  //made the nextBtn interactive
  nextBtn.addEventListener("click", () => {
    if (currSongIndex < songsList.length - 1) {
      currSongIndex += 1;
      currSong.src = songsList[currSongIndex];
      currSong.play();
      playBtn.src = pauseIcon;
    }
    renderSongName(songsList, currSongIndex);
    disableCheck();
  });
  interactiveSeekbar(currSong);
  renderSongName(songsList,currSongIndex);
  disableCheck();


  // "disable" is a class adds opacity 0.5 to create a disabling effect.
  function disableCheck() {
    if (!currSongIndex) {
      previousBtn.classList.add("disable");
    } else {
      previousBtn.classList.remove("disable");
    }

   if (currSongIndex === songsList.length-1) {
      nextBtn.classList.add("disable");
    } else{
      nextBtn.classList.remove("disable");      
    }
  }
  //this would disable previous btn at inception bcz currSongIndex is 0;
}
main();

async function getSongs() {
  let a = await fetch("/5-Songs");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let songsList = [];
  div.querySelectorAll("a").forEach((a) => {
    if (a.href.endsWith(".mp3")) {
      songsList.push(a.href.split("http://127.0.0.1:5500")[1]);
    }
  });
  // rendering the Html to the library on the basics of songsList
  return songsList;
}

function renderHtml(songsList) {
  let html = "";
  songsList.forEach((song) => {
    //when spliting it would choose the last part containing mp3 extension
    let index = song.split("/").length - 1;
    html += `
            <li>
              <img class="invert" src="/4-images/svg/music-note.svg" alt="" />
              <div class="song-bio">
                <div class="song-name stop-overflow">${
                  song.split("/")[index]
                }</div>
                <div class="artist-name">This would be the artist name</div>
              </div>
            </li>
    `;
  });

  document.querySelector(".song-list-container").innerHTML = html;
}

function interactiveSeekbar(currSong) {
  let isPlaying;
  let hasMoved = document.querySelector(".has-moved");
  let circle = document.querySelector(".circle");
  let seekbar = document.querySelector(".seekbar");

  //move circle and hasMoved to where it is clicked
  seekbar.addEventListener("click", (evt) => calcPercent(evt.clientX));

  //In case if the circle is clicked and dragged.
  circle.addEventListener("mousedown", (evt) => {
    evt.preventDefault();
    isPlaying = !currSong.paused;
    document.addEventListener("mousemove", handleDrag);
    if (isPlaying) {
      currSong.pause();
    }
  });
  document.addEventListener("mouseup", (evt) => {
    document.removeEventListener("mousemove", handleDrag);
    if (isPlaying) {
      currSong.play();
    }
  });

  function calcPercent(clientX) {
    let rect = seekbar.getBoundingClientRect();
    let deltaX = clientX - rect.left;
    let precentage = (deltaX / rect.width) * 100;

    currSong.currentTime = (precentage * currSong.duration) / 100;
  }

  function handleDrag(e) {
    calcPercent(e.clientX);
  }
}
function renderSongName(songsList, currSongIndex) {
  let name = document.querySelector(".playbar-nav").firstElementChild;
  name.textContent = songsList[currSongIndex].split("Songs/")[1];
}

function hamburger() {
  let hamburger = document.querySelector(".hamburger");
  let close = document.querySelector(".close");
  let leftBox = document.querySelector(".left");

  hamburger.addEventListener("click", () => {
    leftBox.style.left = "0%";
  });
  close.addEventListener("click", () => {
    leftBox.style.left = "-100%";
  });
}
hamburger();
