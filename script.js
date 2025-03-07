
console.log("Lets write javascript")
let currentsong=new Audio()
let songs;
let currfolder;


function stms(seconds){
    if(isNaN(seconds)|| seconds<0){
        return "00:00"
    }

    const minutes=Math.floor(seconds/60)
    const remainingseconds=Math.floor(seconds%60)

    const formattedminutes=String(minutes).padStart(2,'0');
    const formattedseconds=String(remainingseconds).padStart(2,'0')

return `${formattedminutes}:${formattedseconds}`
}

async function getsongs(folder) {
    currfolder=folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
  songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
   


        //Show all the songs in playlist
        let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
        songUL.innerHTML=""
      for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML + `<li> 
        
        <img class="invert" width="34" src="img/music.svg" alt="">
        <div class="info">
            <div>S${song.replaceAll("%20"," ")}</div>
            <div>Aryan</div>
        </div>
        <div class="playnow">
      <span>play now</span>
            <img class="invert" src="img/play.svg" alt="">
        </div></li>`
      }
    
        //Play the first songs
      Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
          
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
       
      })
 return songs;
}

const playmusic =(track,pause=false)=>{
    
   currentsong.src=`/${currfolder}/`+track
   if(!pause){
   currentsong.play()
   play.src="img/pause.svg"
   }
   document.querySelector(".songinfo").innerHTML=decodeURI(track)
   document.querySelector(".songtime").innerHTML="00:00/00:00"

   
}
async function displayAlbums(){
    let a = await fetch(`/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
   let anchors= div.getElementsByTagName("a")
   let cardcontainer=document.querySelector(".card-container")
   let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
   
    if(e.href.includes("/songs")){
       let folder=(e.href.split("/").slice(-2)[0])
       //Get the meta datata of the folder
       let a = await fetch(`/songs/${folder}/info.json`)
       let response = await a.json()
       console.log(response)
       cardcontainer.innerHTML = cardcontainer.innerHTML + `    <div class="card "  data-folder="${folder}">
       <div  class="play">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
               fill="#black">
               <circle cx="50%" cy="50%" r="50%" fill="#1fdf64" />
               <path
                   d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                   stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
           </svg>


       </div>
       <img src="/songs/${folder}/cover.jpg" alt="">
       <h2>${response.title}</h2>
       <p>${response.description} </p>
   </div>`
    }
   }
   
//Load card whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playmusic(songs[0])
    })
})
}

async function main() {

    //Get the list of all songs 
    await getsongs("songs/ncs")
      playmusic(songs[0],true)
    
      //Display all the albums
     displayAlbums()

  //Attach an event listener to play,next and previous
  play.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play()
        play.src="img/pause.svg"
    }
    else{
        currentsong.pause()
        play.src="img/play.svg"
    }
  })

  currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration)
    document.querySelector(".songtime").innerHTML=`${stms(currentsong.currentTime)}/${
        stms(currentsong.duration)
    }`
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
  })

document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
document.querySelector(".circle").style.left=percent+"%"
currentsong.currentTime=((currentsong.duration)*percent)/100
})

//Add an event listner for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
})

//Add an event listner for close button
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"
})

//Add an event listner for previous and next
previous.addEventListener("click",()=>{
    console.log("previous clicked")
  
    let index=songs.indexOf( (currentsong.src.split("/").slice(-1)[0])
)
if((index-1)>=0){
   playmusic(songs[index-1])
}
})


next.addEventListener("click",()=>{
    currentsong.pause()
    console.log("next clicked")
    let index=songs.indexOf( (currentsong.src.split("/").slice(-1)[0])
    )
   if((index+1)<songs.length){
       playmusic(songs[index+1])
    }

})

//Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log("setting value to",e.target.value,"out of 100")
    currentsong.volume=parseInt(e.target.value)/100
    if (currentsong.volume>0){
      document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
    }
})






function getRandomColor() {
    // Generate a random color in hexadecimal format
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeColor() {
    const colorBox = document.querySelector('.seekbar');
    colorBox.style.backgroundColor = getRandomColor();
}

// Change color every second (1000 milliseconds)
setInterval(changeColor, 500);

// Initial color change to start with a color
changeColor();


//Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src= e.target.src.replace("volume.svg","mute.svg")
        currentsong.volume=0
        document.querySelector(".range").getElementsByTagName("input")[0].value=0    }
        else{
            e.target.src=  e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume=.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
})

//Add Event listener to search bar
document.querySelector(".new").addEventListener("click",e=>{
    console.log("clicked")
   prompt("Enter music to be searched")
})
document.querySelector(".signupbtn").addEventListener("click",e=>{
    console.log("clicked")
   prompt("Enter G-mail")
   prompt("Create Password")
})
document.querySelector(".loginbtn").addEventListener("click",e=>{
    console.log("clicked")
   prompt("Enter Phone Number")
   prompt("Enter OTP")
})





}













main()





//Din dhaliyo aji raat aayi,
//ab to aajao harjaai
//yaad thari mne atave
//bat jove aankhyan mhari