import { secToMin } from "./utility.js";

main();
async function main() {
  let currSong = new Audio();
  let currSongIdx;
  let songsList;

  await renderPlayLists(); // load playlists first

  //load songs on the basis of the clicked playlist
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", async () => {
      let currFolder = card.dataset.folder;
      await getSongs(currFolder);
      songsList = songListFunc(currFolder);

      currSongIdx = 0; // reset index to 0 for new playlist
      currSong.src = songsList[currSongIdx];

      updateUI();
    })
  });

  let loopBtnDiv = document.querySelector(".loop-btns");
  let btnsArr = Array.from(loopBtnDiv.children);
  let activeBtn = btnsArr[0]; //default-btn = loop-playlist
  setActiveBtn();

  currSong.addEventListener("ended", () => {
    console.log(activeBtn);
    if (activeBtn === btnsArr[0]) {
      if (currSongIdx < songsList.length - 1) {
        currSongIdx++;
      } else {
        currSongIdx = 0;
      }
      //there is no need to check the loop-song btn.

    } else if (activeBtn === btnsArr[2]) {
      currSongIdx = Math.floor(Math.random() * songsList.length);
    }
    currSong.src = songsList[currSongIdx];
    currSong.play();
    updateUI();
  })


  let previousBtn = document.querySelector(".nav-btn").firstElementChild;
  let playBtn = previousBtn.nextElementSibling;
  let nextBtn = playBtn.nextElementSibling;

  //Song plays by clicking on the list of Library
  //Used Event Delegation in place of forEach + eventListener.
  document.querySelector(".song-list-container").addEventListener("click", (evt) => {
    let li = evt.target.closest("li");
    let indexOfLi = Array.from(li.parentElement.children).indexOf(li);
    currSongIdx = indexOfLi;
    currSong.src = songsList[currSongIdx];
    currSong.play();

    // selectEffect();
    updateUI();
  });


  // play/pause button interactivity
  playBtn.addEventListener("click", () => {
    if (currSong.paused) {
      currSong.play();
    } else {
      currSong.pause();
    }
    updateUI();
  });

  // previousBtn interactivity
  previousBtn.addEventListener("click", () => {
    if (currSongIdx > 0) {
      currSongIdx -= 1;
      currSong.src = songsList[currSongIdx];
      currSong.play();
    }

    updateUI();
  });

  // nextBtn interactivity
  nextBtn.addEventListener("click", () => {
    if (currSongIdx < songsList.length - 1) {
      currSongIdx += 1;
      currSong.src = songsList[currSongIdx];
      currSong.play();
    }

    updateUI();
  });


  interactiveSeekbar(currSong);
  setVol();



  async function renderPlayLists() {
    let a = await fetch(`/5-Songs/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let playLists = [];

    div.querySelectorAll("a").forEach((a) => {
      //we will remove https part 1st in order to check that the ele contains any ext.
      let name = decodeURI(a.href.split(`/`)[a.href.split(`/`).length - 1]);
      if ((!name.includes(".") && name !== "") && name !== "5-Songs") {
        playLists.push(name);
      }
    });
    let html = '';
    playLists.forEach(item => {
      html += `<div class="card" data-folder="${item}">
            <div class="card-wraper">
              <img src="/4-images/images/cart-img.jpeg" alt="" />
              <button class="play-btn btn">
                <img src="/4-images/svg/play.svg" width="23px" alt="" />
              </button>
              <h2>${item}</h2>
              <p>unknown</p>
            </div>
          </div>`
    })
    document.querySelector(".card-container").innerHTML = html;
  }

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
  //this returns songsList of the current folder, when user clicks on the playlist.
  function songListFunc(folder) {
    let songsList = [];
    document.querySelectorAll(".song-list-container li").forEach(li => {
      let name = li.querySelector(".song-name").textContent;
      songsList.push(`/5-Songs/${folder}/${name}`);
      // console.log(songsList);
    })
    return songsList;
  }
  //this creates selected effect on the song list.
  function selectEffect() {
    let greenIcon = "/4-images/svg/music-note green.svg"
    let whiteIcon = "/4-images/svg/music-note.svg"
    let liArr = Array.from(document.querySelector(".song-list-container").children);

    liArr.forEach((li, index) => {
      let img = li.querySelector("img");
      if (currSongIdx === index) {
        img.src = greenIcon;
        li.classList.add("selected");
      } else {
        img.src = whiteIcon;
        li.classList.remove("selected");
      }
    })

  }
  //changes the UI according to the current song, play/pause, next/previous.
  //also uses the selectEffect(), to update selection according to the current song.
  function updateUI() {
    // "disable" is a class adds opacity 0.5 to create a disabling effect.
    if (!currSongIdx) {
      previousBtn.classList.add("disable");
    } else {
      previousBtn.classList.remove("disable");
    }

    if (currSongIdx === songsList.length - 1) {
      nextBtn.classList.add("disable");
    } else {
      nextBtn.classList.remove("disable");
    }

    if (!currSong.paused) {
      playBtn.src = "/4-images/svg/pause-circle.svg";
    } else {
      playBtn.src = "/4-images/svg/play-circle.svg";
    }
    selectEffect();
  }

  function setVol() {
    let soundBtn = document.querySelector(".sound-btn");
    let volSlider = document.querySelector(".volume-slider");
    let active = false;
    soundBtn.addEventListener("click", () => {
      if (!active) {
        soundBtn.style.left = "0%";
        volSlider.style.opacity = "1";
        soundBtn.style.transition = "all 0.6s";
        volSlider.style.transition = "all 1.3s";
        active = !active;
      } else {
        soundBtn.style.left = "80%";
        volSlider.style.opacity = "0";
        soundBtn.style.transition = "all 1s";
        volSlider.style.transition = "all 0.5s";
        active = !active;
      }
    });

    volSlider.addEventListener("input", () => {
      currSong.volume = volSlider.value / 100;
    });
  }

  //this function handles the seekbar functionality.
  function interactiveSeekbar(currSong) {
    let isPlaying;
    let seekbar = document.querySelector(".seekbar");
    let hasMoved = document.querySelector(".has-moved");
    let circle = document.querySelector(".circle");
    let currTimeDiv = document.querySelector(".current-time");
    let durationDiv = document.querySelector(".duration");

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

    //move circle and hasMoved-Div to where it is clicked
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

    //defined so that we can remove it later from listener.
    function handleDrag(e) {
      calcPercent(e.clientX);
    }
  }
  // this is the animation controler for the hamburger menu(only-in mobile).
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
  function setActiveBtn () {
    
    let loopPLBtn = document.querySelector(".loop-playlist");
    let loopSongBtn = document.querySelector(".loop-song");
    let playRandomBtn = document.querySelector(".play-random");
  
    
      btnsArr.forEach((btn, index) => {
        btn.addEventListener("click", () => {
          if (getComputedStyle(loopPLBtn).display === "none" || 
          getComputedStyle(loopSongBtn).display === "none" || 
          getComputedStyle(playRandomBtn).display === "none") {
            if (index === 2) {
              activeBtn = btnsArr[0];
            } else {
              activeBtn = btnsArr[index + 1];
            }
            btnsArr.forEach((btn) => {
              if (btn === activeBtn) {
                btn.style.display = "inline";
                btn.classList.add("btn-select");
              } else {
                btn.style.display = "none";
                btn.classList.remove("btn-select");
              }
            })
          } else {
            activeBtn = btn;
              //color the clicked btn
              btnsArr.forEach(btn => {
                if (btn === activeBtn) {
                  btn.classList.add("btn-select");
                } else {
                  btn.classList.remove("btn-select");
                }
              })
  
           }
        })
      })
  
  }
  hamburger();
}
