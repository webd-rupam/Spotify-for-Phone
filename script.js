alert("Some features are not available right now. It's a small project which is dedicated for personal Practice.")
alert("Only 'Trending Songs' are playable. And you can use the Menu button too.")
alert("If u want to play a song then tap on the menu icon.")
alert("You can tap on the play button too for playing the songs which are available.")


let currentsong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch('/Projects/SpotifyCloneHtmlCssJs/songs/');
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;

    let songs = [];

    let as = div.getElementsByTagName("a");

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split("/songs/")[1]));
        }
    }
    return songs;
}

async function playMusic(track, pause = false) {
    let audioUrl = "/Projects/SpotifyCloneHtmlCssJs/songs/" + encodeURIComponent(track);
    
    // Check if track already ends with .mp3, and if not, append it
    if (!track.endsWith(".mp3")) {
        audioUrl += ".mp3";
    }

    console.log("Attempting to play:", audioUrl); // Log the URL to debug

    currentsong.src = audioUrl; // Set the src of currentsong

    currentsong.addEventListener('error', (e) => {
        console.error("Audio error:", e);
        console.error("Failed URL:", audioUrl);
    });

    try {
        if (!pause) {
            await currentsong.play();
            play.src = "pause.svg"; // Update play button icon
        }
        document.querySelector(".songinfo").innerHTML = decodeURIComponent(track); // Update song info
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"; // Update song time
    } catch (e) {
        console.error("Error playing audio:", e);
    }
}


async function main() {
    songs = await getSongs();
    console.log(songs);

    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList ul");

    for (const iterator of songs) {
        let songName = iterator.replace(/%20/g, " ").replace(".mp3", "");
        songUL.innerHTML += `<li> 
            <div class="temp">
                <img class="musicsvg" src="music.svg" alt="">
                <div class="info">
                    <div>${songName}</div>
                </div>
                <img class="playNow" src="play.svg" alt="">
            </div>
        </li>`;
    }

    document.querySelectorAll(".songList li").forEach(e => {
        e.addEventListener("click", element => {
            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            console.log("Selected song:", songName);
            playMusic(songName);
        });
    });


    // functions of playbar
    play.addEventListener("click", ()=> {
        if(currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }

        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    // update time and song duration
currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
});

// seekbar duration

document.querySelector(".seekbar").addEventListener("click", e=> {
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%"

    currentsong.currentTime = ((currentsong.duration) * percent)/100
})

// Add event listeners for dragging the circle
let isDragging = false;

document.querySelector(".circle").addEventListener("mousedown", () => {
    isDragging = true;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const seekbar = document.querySelector(".seekbar");
        const rect = seekbar.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;

        // Ensure percent is between 0 and 1
        percent = Math.max(0, Math.min(1, percent));

        document.querySelector(".circle").style.left = percent * 100 + "%";
        currentsong.currentTime = currentsong.duration * percent;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});



// For dragging the seekbar circle with touch
document.querySelector(".circle").addEventListener("touchstart", () => {
    isDragging = true;
});

document.addEventListener("touchmove", (e) => {
    if (isDragging) {
        const seekbar = document.querySelector(".seekbar");
        const rect = seekbar.getBoundingClientRect();
        let percent = (e.touches[0].clientX - rect.left) / rect.width;

        // Ensure percent is between 0 and 1
        percent = Math.max(0, Math.min(1, percent));

        document.querySelector(".circle").style.left = percent * 100 + "%";
        currentsong.currentTime = currentsong.duration * percent;
    }
});

document.addEventListener("touchend", () => {
    isDragging = false;
});



// for hamburger
document.querySelector(".hamburger").addEventListener("click", ()=> {
    document.querySelector(".left").style.right = "0"
})

// for close
document.querySelector(".close").addEventListener("click", ()=> {
    document.querySelector(".left").style.right = "-100%"
})

// for prev and next
prev.addEventListener("click", () => {
    let currentSrc = decodeURIComponent(currentsong.src);
    let index = songs.findIndex(song => currentSrc.includes(song));

    if (index - 1 >= 0) {
        playMusic(songs[index - 1]);
    }
});

next.addEventListener("click", () => {
    let currentSrc = decodeURIComponent(currentsong.src);
    let index = songs.findIndex(song => currentSrc.includes(song));

    if (index + 1 < songs.length) {
        playMusic(songs[index + 1]);
    }
});




}


main();
