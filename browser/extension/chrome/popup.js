
class spotify{
    sendInfo(mprisDto){
        mprisDto.jsId = "spotifyId";
        mprisDto.players[0].currTime = this.getTime();
        mprisDto.players[0].title = this.getTitle();
        mprisDto.players[0].name = this.getTitle();
        mprisDto.players[0].status =this.getStatus();
        mprisDto.players[0].length = this.getDuration();
        mprisDto.players[0].volume = this.getVolume();
        mprisDto.players[0].id = "spotifyId";
        mprisDto.players[0].url = this.getPageUrl();
        mprisDto.players[0].ip = this.getVideoSrc();
        return mprisDto;
    }

    getTime(){
        var textTime = document.getElementsByClassName("playback-bar__progress-time")[0].innerHTML;
        var resultTimeinSecs = 0;
        var split = textTime.split(":");
        resultTimeinSecs += parseInt(split[0],10) * 60;
        resultTimeinSecs += parseInt(split[1],10);
        return resultTimeinSecs;
    }

    getTitle(){
        return document.title;
    }

    getStatus(){
        if(document.getElementsByClassName("control-button spoticon-pause-16 control-button--circled").length > 0){
            return "Playing";
        }else{
            return "Paused"
        }
    }

    getDuration(){
        var textTime = document.getElementsByClassName("playback-bar__progress-time")[1].innerHTML;
        var resultTimeinSecs = 0;
        var split = textTime.split(":");
        resultTimeinSecs += parseInt(split[0],10) * 60;
        resultTimeinSecs += parseInt(split[1],10);
        return resultTimeinSecs;
    }

    getVolume(){
        var volumeText = document.getElementsByClassName("progress-bar__fg")[1].style.cssText;
        var number = parseFloat(volumeText.match(/[\d\.]+/));
        return Math.floor(number);
    }

    getPageUrl(){
        return window.location.href;
    }

    getVideoSrc(){
        return document.getElementsByClassName("react-contextmenu-wrapper")[0].getElementsByTagName("a")[0].href;
    }

    pause(){
        document.getElementsByClassName("control-button spoticon-pause-16 control-button--circled")[0].click();
    }

    play(){
        document.getElementsByClassName("control-button spoticon-play-16 control-button--circled")[0].click();
    }

    playPause(){
        if(this.getStatus() === "Playing"){
            this.pause();
        }else{
            this.play();
        }
    }
    sendNext(){
        document.getElementsByClassName("control-button spoticon-skip-forward-16")[0].click();
    }
    loop(){
        document.getElementsByClassName("control-button spoticon-repeat-16")[0].click();
    }
    setTime(sec){
    }
    setVolume(vol){
    }
}

class vk{
    sendInfo(mprisDto){
        mprisDto.jsId = "vkId";
        mprisDto.players[0].currTime = this.getTime();
        mprisDto.players[0].title = this.getTitle();
        mprisDto.players[0].name = this.getTitle();
        mprisDto.players[0].status =this.getStatus();
        mprisDto.players[0].length = this.getDuration();
        mprisDto.players[0].currTime = this.getTime();
        mprisDto.players[0].volume = this.getVolume();
        mprisDto.players[0].id = "vkId";
        mprisDto.players[0].url = this.getPageUrl();
        mprisDto.players[0].ip = this.getVideoSrc();
        return mprisDto;
    }

    getTitle(){
        var elem = document.getElementsByClassName("top_audio_player_title_wrap")[0];
        if(elem === undefined){
            elem = document.getElementsByClassName("audio_page_player_title_song_title")[0];
            return elem.innerHTML;
        } else {
            return elem.firstElementChild.innerHTML;
        }
    }

    getTime(){
        var elem = document.getElementsByClassName("audio_page_player_duration")[0];
        if(elem !== undefined) {
            var textTime = elem.textContent;
            var resultTimeinSecs = 0;
            var split = textTime.split(":");
            resultTimeinSecs += parseInt(split[0],10) * 60;
            resultTimeinSecs += parseInt(split[1],10);
            return resultTimeinSecs;
        } else {
            return 0;
        }
    }

    getDuration(){
    return this.getTime();
    }

    getStatus(){
        if(document.getElementsByClassName("top_audio_player top_audio_player_enabled top_audio_player_playing").length > 0){
            return "Playing";
        }else {
            return "Paused"
        }
    }

    getVolume(){
        var elem = document.getElementsByClassName("slider_amount")[0];
        if(elem !== undefined) {
            var volumeText = elem.style.cssText;
            var number = parseFloat(volumeText.match(/[\d\.]+/));
            return Math.floor(number);
        }
        return 0;
    }

    getPageUrl(){
        return window.location.href;
    }

    getVideoSrc(){
        return window.location.href;
    }

    pause(){
        document.getElementsByClassName("top_audio_player_btn top_audio_player_play _top_audio_player_play")[0].click();
    }

    play(){
        document.getElementsByClassName("top_audio_player_btn top_audio_player_play _top_audio_player_play")[0].click();
    }

    playPause(){
        if(this.getStatus() === "Playing"){
            this.pause();
        }else{
            this.play();
        }
    }
    sendNext(){
        document.getElementsByClassName("top_audio_player_btn top_audio_player_next")[0].click();
    }
    loop(){
        var elem =  document.getElementsByClassName("audio_page_player_btn audio_page_player_repeat _audio_page_player_repeat")[0];
        if(elem !== undefined) {
            elem.click();
        }
    }
    setTime(sec){
    }
    setVolume(vol){
    }
}

var MyJasechvideo;
var MultipleVideos;
var isSingleVideo;
var jasechResponse = false;
var jasechInterval = 5000; // 5 seconds;
var workthroughbackhround = false;;
var backgroundFailed;
var jasechIntervalId;
var pingId;
var pingInterval = 1000;
var setted;
var started = false;

var strategies = new Object();
strategies['open.spotify.com'] = new spotify();
strategies['vk.com'] = new vk();
var curStrategie;

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
var onMessageFromServer = function(event) {
    var incomingMessage = event.data;
    parseResponse(incomingMessage);
};

var sendMessage = function (msg) {
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
        jasechsocket.onmessage = onMessageFromServer;
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
    // if(MultipleVideos.length === 0)
    //     return;

    if(MyJasechvideo === undefined && MultipleVideos.length > 0) {
        MyJasechvideo = MultipleVideos[0];
    }

    if(MyJasechvideo !== undefined) {
        connectingPeople();
    }else{
       var keys = Object.keys(strategies);
       for(var i = 0;i<keys.length;i++){
         if(keys[i] === window.location.hostname){
             curStrategie = strategies[keys[i]];
             connectingPeople();
             break;
         }
       }

    }
}

 initLazyExtension();
 
function initLazyExtension() {
    started = true;
    checkServer();
    setCheckServerInterval();
}

// parse message, receive from server
function parseResponse(data)
 {
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
    if(curStrategie !== undefined){
        curStrategie.loop();
    }else {
        if (typeof MyJasechvideo.loop == 'boolean') { // loop supported
            MyJasechvideo.loop = true;
        } else { // loop property not supported
            MyJasechvideo.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }
    }
}
function playPause() {
    if(curStrategie !== undefined){
        curStrategie.playPause();
    }else {
        var status = getStatus();
        if (status === "playing") {
            pause();
        } else {
            play();
        }
    }
}

function sendNext() {
    if(curStrategie !== undefined){
        curStrategie.sendNext();
    }else {
        MyJasechvideo.currentTime = getDuration();
    }
}
 function sendInfo() {
    if(curStrategie !== undefined){
        mprisDto =  curStrategie.sendInfo(mprisDto);
    }else {
        var arrayLength = MultipleVideos.length;
        if (arrayLength === 1) {
            mprisDto.players = [{
                name: "",
                status: "",
                title: "",
                length: 0,
                volume: 0,
                currTime: 0,
                id: "",
                url: "",
                ip: ""
            }];
            if (MyJasechvideo.lazyIrId === undefined || MyJasechvideo.lazyIrId === null || MyJasechvideo.lazyIrId === 0) {
                MyJasechvideo.lazyIrId = Math.random() * (999999 - 1) + 1;
            }
            mprisDto.jsId = MyJasechvideo.lazyIrId;
            mprisDto.players[0].currTime = getTime();
            mprisDto.players[0].title = getTitle();
            mprisDto.players[0].name = getTitle();
            mprisDto.players[0].status = getStatus();
            mprisDto.players[0].length = getDuration();
            mprisDto.players[0].volume = getVolume();
            mprisDto.players[0].id = MyJasechvideo.lazyIrId;
            mprisDto.players[0].url = getPageUrl();
            mprisDto.players[0].ip = getVideoSrc();

        } else {
            mprisDto.players = [];
            for (var i = 0; i < arrayLength; i++) {
                MyJasechvideo = MultipleVideos[i];
                if (MyJasechvideo.lazyIrId === undefined || MyJasechvideo.lazyIrId === null || MyJasechvideo.lazyIrId === 0) {
                    MyJasechvideo.lazyIrId = Math.random() * (999999 - 1) + 1;
                }
                var number = mprisDto.players.length;
                var addNewBool = true;
                mprisDto.jsId = MyJasechvideo.lazyIrId;
                for (var c = 0; c < mprisDto.players.length; c++) {
                    if (mprisDto.players[c].url === getPageUrl()) {
                        if (mprisDto.players[c].length <= getDuration()) {
                            number = c;
                            addNewBool = false;
                        } else {
                            break;
                        }
                    }
                }
                if (addNewBool) {
                    mprisDto.players.push({
                        name: "",
                        status: "",
                        title: "",
                        length: 0,
                        volume: 0,
                        currTime: 0,
                        id: "",
                        url: "",
                        ip: ""
                    });
                }
                mprisDto.players[number].currTime = getTime();
                mprisDto.players[number].title = getTitle();
                mprisDto.players[number].name = getTitle();
                mprisDto.players[number].status = getStatus();
                mprisDto.players[number].length = getDuration();
                mprisDto.players[number].volume = getVolume();
                mprisDto.players[number].id = MyJasechvideo.lazyIrId;
                mprisDto.players[number].url = getPageUrl();
                mprisDto.players[number].ip = getVideoSrc();
            }
            MyJasechvideo = MultipleVideos[0];

        }
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

function setTime(sec) {
    if(curStrategie !== undefined){
        curStrategie.setTime(sec);
    }else {
        MyJasechvideo.currentTime = sec;
    }
}

function setVolume(vol) {
    if(curStrategie !== undefined){
        curStrategie.setVolume(vol)
    }else {
        MyJasechvideo.volume = vol;
    }
}


function pause() {
    if(curStrategie !== undefined){
        curStrategie.pause();
    }else {
        MyJasechvideo.pause();
    }
}

function play() {
    if(curStrategie !== undefined){
        curStrategie.play();
    }else {
        MyJasechvideo.play();
    }
}

function getTime() {
    return MyJasechvideo.currentTime;
}

var NetworkPackage ={
    id : "",
    name : "",
    deviceType : "",
    type : "",
    isModule : false,
    data : null
};
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




