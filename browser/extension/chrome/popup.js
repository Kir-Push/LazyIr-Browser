
var MyJasechvideo;
var MultipleVideos;
var isSingleVideo;
var JAsechCount = 0;
var jasechResponse = false;
var jasechInterval = 5000; // 1000 is one second;
var workthroughbackhround = false;;
var backgroundFailed;
var jasechIntervalId;
var pingId;
var pingInterval = 1000;
var setted;

function setCheckServerInterval() {
    if(jasechResponse === true)
        return;

    clearInterval(jasechIntervalId);
    jasechIntervalId = setInterval(function() {
        if(workthroughbackhround !== true)
        checkServer();
        else{
            clearInterval(pingId);
            pingId = setInterval(function() {
                chrome.runtime.sendMessage({message: "ping"},function (response) {
                });
            },pingInterval);
        }
    }, jasechInterval);
}

var onopen = function() {

    jasechResponse = true;
    workthroughbackhround = false;
};

var onclose = function(event) {

    jasechResponse = false;
    jasechsocket.close();
    jasechsocket = undefined;
};

var onerror = function(error) {
    if(jasechsocket.readyState === 3 && backgroundFailed !== true){
        jasechResponse = false;
       // clearInterval(jasechIntervalId);
       // clearInterval(pingId);
        setted = false;
    
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if(!sender.tab){
                    if(request.resp === "connected"){
                         workthroughbackhround = true;
                    }else if(request.resp === "Not connected"){
                        workthroughbackhround = false;
                        backgroundFailed = true;
                        jasechResponse = false;
                     //   setCheckServerInterval();
                      //  clearInterval(pingId);
                    }else
                    parseResponse(request.resp);
                }
            });
         sendMessage("try connect");
    }
};


// receive message from server
var onmg = function(event) {
    var incomingMessage = event.data;
    parseResponse(incomingMessage);
};

var sendMessage = function (msg) {
    console.log(workthroughbackhround + "  " + jasechResponse + "    " + jasechsocket);
    if(workthroughbackhround !== true && jasechResponse === true && jasechsocket !== undefined) {
        jasechsocket.send(msg);
    }
    else{
     chrome.runtime.sendMessage({message: msg},function (response) {
     });
    }
};


var jasechsocket;

var connectingPeople = function () {

    if(!jasechResponse) {
        jasechsocket = new WebSocket('ws:127.0.0.1:11520/lazyir/v1');
        jasechsocket.onclose = onclose;
        jasechsocket.onopen = onopen;
        jasechsocket.onerror = onerror;
        jasechsocket.onmessage = onmg;
    }
};

function checkServer() {
    var tempMultipleVideos = document.getElementsByTagName("video");
    var tempMultipleAudios = document.getElementsByTagName("audio");

    if(tempMultipleVideos.length === 1){
        isSingleVideo = true;
    }
    MultipleVideos = [];
    var arrayLength = tempMultipleVideos.length;
    for (var i = 0; i < arrayLength; i++) {
       if(tempMultipleVideos[i].currentSrc !== "" &&  tempMultipleVideos[i].currentSrc !== "undefined" && tempMultipleVideos[i].currentSrc !== "null"){
           MultipleVideos.push(tempMultipleVideos[i]);
       }
    }

    arrayLength = tempMultipleAudios.length;
    for (var i = 0; i < arrayLength; i++) {
        if(tempMultipleAudios[i].currentSrc !== "" &&  tempMultipleAudios[i].currentSrc !== "undefined" && tempMultipleAudios[i].currentSrc !== "null"){
            MultipleVideos.push(tempMultipleAudios[i]);
        }
    }
    if(MultipleVideos.length === 0)
        return;

    if(MyJasechvideo === undefined) {
        MyJasechvideo = MultipleVideos[0];
    }

    if(MyJasechvideo !== undefined)
    {
        connectingPeople();
    }
}


init();
//$(youtubePageChange);

function init() {
    checkServer();
    setCheckServerInterval();
}

// parse message, receive from server
function parseResponse(data)
 {
     console.log(data);
     var networkPackage = JSON.parse(data);
     if (networkPackage.command === "getInfo") {
         sendInfo();
     }  else {
         if (networkPackage.type === "Web") {
             var json = networkPackage.data;
             var playerId = json.jsId;
             for (var i = 0; i < MultipleVideos.length; i++) {
                 if (MultipleVideos[i].lazyIrId == playerId) {
                     MyJasechvideo = MultipleVideos[i];
                     break;
                 }
             }

             if (json.command === "pause") {
                 pause();
             } else if (json.command === "play") {
                 play();
             }
             else if (json.command === "playPause") {
                 playPause();
             }
             else if (json.command === "setTime") {
                 setTime(json.dValue);
             }
             else if (json.command === "setVolume") {
                 setVolume(json.dValue);
             }
             else if (json.command === "next") {
                 sendNext();
             }
             else if (json.command === "loop") {
                 loop();
             }
         }
     }
 }

function loop() {
    if (typeof MyJasechvideo.loop == 'boolean') { // loop supported
        MyJasechvideo.loop = true;
    } else { // loop property not supported
        MyJasechvideo.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    }
}


 function sendStatus() {

 }


 function sendDuration() {

 }


 function sendTime() {

 }

function playPause() {
   var status = getStatus();
   if(status === "playing")
   {
       pause();
   }
   else
   {
       play();
   }
}


function sendNext() {
    MyJasechvideo.currentTime = getDuration();

}

 function sendInfo() {

     var arrayLength = MultipleVideos.length;
    if(arrayLength === 1) {
        if(MyJasechvideo.lazyIrId === undefined || MyJasechvideo.lazyIrId === null || MyJasechvideo.lazyIrId === 0)
        MyJasechvideo.lazyIrId = Math.random() * (999999 - 1) + 1;
        mprisDto.jsId =   MyJasechvideo.lazyIrId;
        mprisDto.players[0].currTime =  getTime();
        mprisDto.players[0].title = getTitle();
        mprisDto.players[0].name = getTitle();
        mprisDto.players[0].status = getStatus();
        mprisDto.players[0].length = getDuration();
        mprisDto.players[0].volume = getVolume();
        mprisDto.players[0].id = MyJasechvideo.lazyIrId;
        mprisDto.players[0].url = getPageUrl();
        mprisDto.players[0].ip = getVideoSrc();

    }else{
        for (var i = 0; i < arrayLength; i++) {
            MyJasechvideo = MultipleVideos[i];
            if(MyJasechvideo.lazyIrId === undefined || MyJasechvideo.lazyIrId === null || MyJasechvideo.lazyIrId === 0)
            MyJasechvideo.lazyIrId = Math.random() * (999999 - 1) + 1;
            mprisDto.jsId =   MyJasechvideo.lazyIrId;
            mprisDto.players[i].currTime =  getTime();
            mprisDto.players[i].title = getTitle();
            mprisDto.players[i].name = getTitle();
            mprisDto.players[i].status = getStatus();
            mprisDto.players[i].length = getDuration();
            mprisDto.players[i].volume = getVolume();
            mprisDto.players[i].id = MyJasechvideo.lazyIrId;
            mprisDto.players[i].url = getPageUrl();
            mprisDto.players[i].ip = getVideoSrc();
        }
        MyJasechvideo = MultipleVideos[0];
    }
    NetworkPackage.data = mprisDto;
     var myJSON = JSON.stringify(NetworkPackage);
     sendMessage(myJSON);
 }

 function getVideoSrc() {
     if(!MyJasechvideo.currentSrc.startsWith("blob:") && !MyJasechvideo.currentSrc.startsWith("\"blob:\"") && MyJasechvideo.currentSrc !== "" &&  MyJasechvideo.currentSrc !== "undefined" && MyJasechvideo.currentSrc !== "null"){
         return MyJasechvideo.currentSrc;
     }
     else if(MyJasechvideo.src !== undefined && !MyJasechvideo.src.startsWith("blob:") && !MyJasechvideo.src.startsWith("\"blob:\"" && MyJasechvideo.src !== "" &&  MyJasechvideo.src !== "undefined" && MyJasechvideo.src !== null )){
         return MyJasechvideo.src;
     } else{
         return getPageUrl();
     }
 }

 function getPageUrl() {
     return MyJasechvideo.baseURI;
 }

function sendTitle() {
  //  document.title;
}

 function sendVolume() {

 }

 function getTitle() {
     return document.title;
 }

 function getStatus() {
    if(MyJasechvideo.paused)
        return "paused";
    else
        return "playing";
 }

 function getVolume() {
     return MyJasechvideo.volume;
 }

function getDuration()
{
    return MyJasechvideo.duration;
}

function setTime(sec)
{
    MyJasechvideo.currentTime = sec;
}

function setVolume(vol) {
  MyJasechvideo.volume = vol;
}


function pause() {
    MyJasechvideo.pause();
}

function play() {
    MyJasechvideo.play();
}

function getTime() {
    return MyJasechvideo.currentTime;
}




function youtubePageChange()
{
    $('body').on('transitionend', function(event)
    {
        if (event.target.id !== 'progress') return false;
        init();
    });
}

var NetworkPackage ={
    id : "",
    name : "",
    deviceType : "",
    type : "",
    isModule : false,
    data : null
}


var mprisDto = {
    command : "",
    player: "",
    jsIp: "",
    jsId: "",
    playerType : "",
    value: "",
    dValue: 0,
    className : "Mpris",
    isModule : true,
    players: [
        {
            name: "",
            status: "",
            title: "",
            length: 0,
            volume: 0,
            currTime: 0,
            id: "",
            url: "",
            ip: ""
        }
    ]
};

