
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
        if(document.getElementsByClassName("control-button spoticon-pause-16 control-button--circled") === undefined){
            return "Playing";
        }else{
            return "Paused"
        }
    }

    getDuration(){
        var textTime = document.getElementsByClassName("playback-bar__progress-time")[0].innerHTML;
        var resultTimeinSecs = 0;
        var split = textTime.split(":");
        resultTimeinSecs += parseInt(split[0],10) * 60;
        resultTimeinSecs += parseInt(split[1],10);
        return resultTimeinSecs;
    }

    getVolume(){
        var volumeText = document.getElementsByClassName("progress-bar__fg")[1].innerHTML;
        var number = parseFloat(volumeText.match(/[\d\.]+/));
        return Math.floor(number);
    }

    getPageUrl(){
        return window.location.href;
    }

    getVideoSrc(){
        return document.getElementsByClassName("react-contextmenu-wrapper").getElementsByTagName("a")[0].href;
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
export default spotify