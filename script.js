console.log(`Lets start javascript`)

let currentSong = new Audio
let songs;
let currFolder;

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    // Add leading zero if seconds < 10
    secs = secs < 10 ? '0' + secs : secs;
    return `${Math.floor(mins)}:${Math.floor(secs)}`;
}






async function getSongs(folder) {
    currFolder=folder

    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
        songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `   <li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div style="width: 90px;" >${song.replaceAll("%20", " ")}</div>
                                <div style="width: 90px;" >Harry</div>

                            </div>
                            <div class="playnow">
                                <span>Play Now</span>

                                <img class="invert" src="play.svg" alt="">
                            </div>


                        </li>`;

    }
    //attah a event listener to eah song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML)
            playMusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim())
        })
    })
    
}

const playMusic = (track,pause=false) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    
    
    document.querySelector(".songinfo").innerHTML =  track.replace(/%20/g, "");
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}






async function main() {
    //get the list of all song


     await getSongs("songs/ncs")
    playMusic(songs[0],true)
   

    console.log(songs)

    //attach a an event listener next and previous
    let play = document.getElementById("play")
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }

    })
    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)

            }`
            document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })
    // add an event listener to seekbaar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=`${percent}%`
        currentSong.currentTime=((currentSong.duration)*percent)/100
    })
    //add ana event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.getElementsByClassName("card")[0].addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    
    document.getElementsByClassName("card")[1].addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    
    document.getElementsByClassName("card")[2].addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    
    //for close button
    document.getElementById("close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-110%"
    })
    //add an event listener to previous and next
    previous.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1>-1)){

         playMusic(songs[index-1])
     }
        
    })
    next.addEventListener("click",()=>{
        currentSong.pause()
     console.log("clicked next")
     let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      
     console.log(songs,index)
     if((index+1<songs.length)){

         playMusic(songs[index+1])
     }
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
         currentSong.volume=parseInt(e.target.value)/100
    })
    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs= await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })
    



}
main()