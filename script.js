let currentsong = new Audio()
let songindex = 0;
let songarray;

// function to conver seconds in minute-seconds
function secondstominute(secondsindecimal) {
    let totalseconds = Math.floor(secondsindecimal)
    let minute = Math.floor(totalseconds / 60)
    let seconds = totalseconds % 60
    return `${minute}:${seconds}`
}
// function gives the cards of songs
async function card(playlistname, coverhrf) {
    playlistname = playlistname.trim()
    let response = await fetch(`/songs/${playlistname}/info.json`)
    let info = await response.json()
    //  onerror set the default image below
    let str = `<div class="card ">
                    <div class="greenbtn ">
                        <img class="playingreen" src="logos/greenbtn.svg" alt="">
                    </div>
                     <img src="${coverhrf}" onerror="this.src='logos/basic cover.jpeg';" alt="">
                    <h3 class="directory">${playlistname}</h3>

                    <p>${info.singername}</p>
                </div>`

    document.querySelector(".songs").innerHTML = document.querySelector(".songs").innerHTML + str
}


// function to get playlistname array
async function getplaylistnamearray() {
    let response = await fetch("/songs/")
    let htm = await response.text()
    let arr = []
    let div = document.createElement("div")
    div.innerHTML = htm
    let anchor = div.getElementsByTagName("a")
    for (let i = 0; i < anchor.length; i++) {
        let hrf = anchor[i].href
        if (hrf.includes("/songs") && !hrf.includes(".htaccess")) {
            let n = hrf.split("/songs/")[1]
            arr.push(n)
        }
    }
    return arr;
}

// function to get playlist cover
async function getplaylistcover(folder) {
    let response = await fetch(`/songs/${folder}`)

    let htm = await response.text()

    let div = document.createElement("div")
    div.innerHTML = htm
    let anchor = div.getElementsByTagName("a")

    for (let i = 0; i < anchor.length; i++) {
        let hrf = anchor[i].href

        if (hrf.includes(".jpg") || hrf.includes(".png")) {

            return hrf;

        }
    }
}

//function gives the array of links of songs 
async function arrayoflinks(folder) {
    let response = await fetch(`/songs/${folder}`)

    let htm = await response.text()

    let arr = []
    let div = document.createElement("div")
    div.innerHTML = htm
    let anchor = div.getElementsByTagName("a")
    for (let i = 0; i < anchor.length; i++) {
        let hrf = anchor[i].href
        if (hrf.endsWith(".mp3")) {

            arr.push(hrf)

        }

    }

    if (arr.length == 0) {
        console.log("no songs in playlist");

        return songarray;
    }
    else {

        return arr;
    }
}

// function which play song
function playsong(songlink) {
    currentsong.src = songlink
    currentsong.play()

}

// function which  play/pause the song and changes button in the playbar
function setplaypause() {
    let source = document.querySelector(".play").src
    console.log(source);
    if (source.includes("playsong")) {
        document.querySelector(".play").src = "/logos/pause.svg"
        currentsong.pause()
    }
    else {
        document.querySelector(".play").src = "/logos/playsong.svg"
        currentsong.play()
    }
}

function settitle(infostring) {
    document.querySelector(".title").innerHTML = infostring
}

function updatesongindex(link, songarray) {
    for (let i = 0; i < songarray.length; i++) {
        if (songarray[i] == link) {
            songindex = i;
        }
    }
}

// create a list-library of our all songs 
async function createlistlibrary() {
    document.querySelector(".songul").innerHTML = " "

    for (const element of songarray) {
        let list = document.createElement("li")
        list.className = "listtag"
        let e = element.split("/songs/")
        let title = e[1].replaceAll("%20", " ")
        list.innerHTML = list.innerHTML + `<img class="invert" src="logos/music.svg" alt="musicicon">
                        <div class="info">${title}</div>
                        <img class="invert" src="logos/pause.svg" alt="playmusic">`
        document.querySelector(".songul").append(list)

        // set default title in the playbar
        document.querySelector(".title").innerHTML = document.querySelector(".info").innerHTML
    }
}


async function main() {

    // creating new cards when new playlist are made in fileexplorer
    let arrayofplaylist = await getplaylistnamearray()
    for (let i = 0; i < arrayofplaylist.length; i++) {
        let str = arrayofplaylist[i].replace("/", " ")
        let coverhrf = await getplaylistcover(str);
        card(str, coverhrf);

    }

    // array of links of songs
    songarray = await arrayoflinks(arrayofplaylist[0])

    currentsong.src = songarray[songindex]
    createlistlibrary()


    // addEventListener for updating songarray and songlist when a card is clicked
    let cardsarray = document.querySelectorAll(".card")

    for (let i = 0; i < cardsarray.length; i++) {

        cardsarray[i].addEventListener("click", async () => {
            let directoryhtml = cardsarray[i].querySelector(".directory").innerHTML

            songarray = await arrayoflinks(directoryhtml)
            currentsong.src = songarray[0]
            // to play first song automatically when any playlist is clicked
            currentsong.play()
            document.querySelector(".play").src = "/logos/pause.svg"
            setplaypause();
            console.log(songarray);
            createlistlibrary();


            // eventlistener to play a song when an element in list is clicked
            let linkarr = document.querySelectorAll(".listtag")

            linkarr.forEach(element => {
                element.addEventListener("click", () => {

                    let infostring = element.querySelector(".info").innerHTML

                    //  here we are making our link workable
                    let string2 = "/songs/"

                    let string1 = infostring.replaceAll(" ", "%20")
                    let resultedlink = string2.concat(string1)

                    updatesongindex(resultedlink, songarray);

                    playsong(resultedlink);

                    // to make play/pause icon to default when new song clicked
                    document.querySelector(".play").src = "/logos/pause.svg"
                    setplaypause();

                    settitle(infostring);

                })
            });

        })
    }


    // here we we run this eventlistener two times because after playlist clicked we are unable
    // to target lists tag inside songul

    // eventlistener to play a song when an element in list is clicked
    let linkarr = document.querySelectorAll(".listtag")

    linkarr.forEach(element => {
        element.addEventListener("click", () => {

            let infostring = element.querySelector(".info").innerHTML

            //  here we are making our link workable
            let string2 = "/songs/"

            let string1 = infostring.replaceAll(" ", "%20")
            let resultedlink = string2.concat(string1)

            updatesongindex(resultedlink, songarray);

            playsong(resultedlink);

            // to make play/pause icon to default when new song clicked
            document.querySelector(".play").src = "/logos/pause.svg"
            setplaypause();

            settitle(infostring);

        })
    });


    // eventlistener which  play/pause the song and changes button
    // in the playbar
    document.querySelector(".play").addEventListener("click", () => {
        console.log('helo');

        setplaypause();
    })


    // eventlistener for making nextsong-icon workable in playbar
    document.querySelector(".next").addEventListener("click", () => {
        if (songindex < songarray.length - 1) {
            songindex++;
            let newlink = songarray[songindex]
            playsong(newlink);
            document.querySelector(".play").src = "/logos/pause.svg"
            setplaypause();

            let e = songarray[songindex].split("/songs/")
            let link = e[1].replaceAll("%20", " ")
            settitle(link);
        }
        else {
            songindex = 0
            let newlink = songarray[songindex]
            playsong(newlink);
            document.querySelector(".play").src = "/logos/pause.svg"
            setplaypause();

            let e = songarray[songindex].split("/songs/")
            let link = e[1].replaceAll("%20", " ")
            settitle(link);
        }


    })


    // eventlistener for making previoussong-icon workable in playbar
    document.querySelector(".previous").addEventListener("click", () => {
        if (songindex > 0) {
            songindex--;
            let newlink = songarray[songindex]
            playsong(newlink);
            document.querySelector(".play").src = "/logos/pause.svg"
            setplaypause();

            let e = songarray[songindex].split("/songs/")
            let link = e[1].replaceAll("%20", " ")
            settitle(link);
        }
    })




    // eventlistener for updation of time in playbar and circle in seekbar 
    currentsong.addEventListener("timeupdate", () => {
        // for updation of time

        let time = `${secondstominute(currentsong.currentTime)} / ${secondstominute(currentsong.duration)}`
        document.querySelector(".duration").innerHTML = time

        // for updation of circle in seekbar 
        let distancecover = (currentsong.currentTime / currentsong.duration) * 100
        document.querySelector(".circle").style.left = distancecover + "%"
    })

    // eventlistener
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // move circle to left when seekbar clicked
        // here we find distancex totalwidth ka kitna percent hai(say20%)
        let distancex = e.offsetX
        let totalwidth = e.target.getBoundingClientRect().width
        let percent = (distancex / totalwidth) * 100
        document.querySelector(".circle").style.left = percent + "%"

        // change currenttime when seekbar clicked
        // here we calculate percent(that we calculate above (20%))  of duration
        let digit = ((currentsong.duration) * percent) / 100
        currentsong.currentTime = digit

    })


    // eventlistener for hamburger to display left
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })


    // eventlistener for hamburger to hide left
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })


    //   eventlistener to change volume in .soundrange
    document.querySelector(".soundrange").addEventListener("change", (e) => {
        let val = e.target.value
        currentsong.volume = (val / 100)

        if (currentsong.volume > 0) {
            let imagetag = document.querySelector(".sound>img")
            imagetag.src = "/logos/sound.svg"
        }
    })


    // eventlistener to mute and unmute sound
    document.querySelector(".sound>img").addEventListener("click", (e) => {
        let source = e.target.src

        if (source.includes("sound")) {

            let newsource = source.replace("sound", "mute")
            e.target.src = newsource
            document.querySelector(".soundrange").value = 0
            currentsong.volume = 0
        }
        else {
            let newsource = source.replace("mute", "sound")
            e.target.src = newsource
            document.querySelector(".soundrange").value = 40
            currentsong.volume = 0.4
        }
    })

}

main();










