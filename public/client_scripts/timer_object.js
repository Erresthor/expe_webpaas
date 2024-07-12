// We set up a general timer and an exit timer object, 
// these object give the subject time to perform an action and provide a graphical interface
// They may be used as a timer to tell the subject to get ready,
// to force him / her to wait
// or to make him / her perform actions faster 

// The fact that we have two separate objects
// is very ugly and should be done better (these are the same type of objects but 
// they should run in parrallel ...)

window.generalTimerObject = {
    localTimeLimit : TIME_LIMIT,
    timeLeft: TIME_LIMIT,
    timePassed : 0,
    remainingPathColor : COLOR_CODES.info.color,
    abortTimer : false,
    timeInterval : null,
    changeColorOption : null,
    visibleOption : true,
    paused : false,
    unpause_instance : false,
    showDigits:true,

    manual_pause : false,

    drawTimer:function(timerHeight,timerTop,timerLeft,changeCol=true,addTo="body"){
        // IF 50 % <=> 100 px for the label
        // THEN labelPix = percentage*2
        try{
            this.removeHtmlTimer(); // Can't draw 2 at the same time
        }catch(e){
            console.log(e);
        }
        this.changeColorOption = changeCol;
        let label_font_size = Math.floor(timerHeight*4.0);
        let stroke_size = 10;        
        // <div class="base-timer-general" style="height:`+timerHeight+`%;left:`+timerLeft+`%;top:`+timerTop+`%;">
        $(addTo).append(`
        <div id="timer-general">
            <div class="base-timer-general" style="height:`+timerHeight+`%;left:`+timerLeft+`%;top:`+timerTop+`%;">
                <svg class="base-timer-general__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer-general__circle">
                    <circle class="base-timer-general__path-elapsed" cx="50" cy="50" r="45" style="stroke-width: `+stroke_size+`px;"></circle>
                    <path
                        id="base-timer-general-path-remaining"
                        stroke-dasharray="283"
                        class="base-timer-general__path-remaining ${this.remainingPathColor}"
                        style="stroke-width: `+stroke_size+`px;"
                        d="
                        M 50, 50
                        m -45, 0
                        a 45,45 0 1,0 90,0
                        a 45,45 0 1,0 -90,0
                        "
                    ></path>
                </g>
                </svg>
                <span id="base-timer-general-label" class="base-timer-general__label" style="font-size: `+label_font_size+`px;">
                    ${formatTime(this.timeLeft)}
                </span>
            </div>
        </div>
        `);
        if (!this.showDigits){
            $("#base-timer-general-label").remove();
        }
    },

    timerToZero:function(){
        this.paused = false;
        this.timeLeft = this.localTimeLimit
        this.timePassed = 0;
        this.timeInterval = null;
        this.abortTimer = false;
    },

    startTimer:function(autoReinit = true) {
        if (autoReinit) {
            try{
                clearInterval(this.timeInterval);
            }catch (error){
                console.log(error);
            }
            this.timerToZero();
        }

        let timerObject = this;
        return new Promise(function (resolve, reject) {
            timerObject.timeInterval = setInterval(() => {

                // If the exit fullscreen timer is already running, pause this timer immediately
                // When it's not running anymore, unpause the timer
                // Also, check if there is already an instance trying to unpause the timer
                if (window.pause_current_process){
                    // The subject has done something wrong
                    
                    // If the pause was caused by exiting the screen
                    // AND no instance trying to unpause already exists
                    // Then unpause when pause_current_process=false
                    if (!timerObject.unpause_instance){
                        timerObject.unpause_instance = true;
                        timerObject.paused = true;
                        window.retry_until_unpaused(()=>{
                            if (!timerObject.manual_pause){
                                timerObject.paused = false;
                            }else {
                                console.log("Attempting to unpause but a manual pause is already established.")
                            }
                            timerObject.unpause_instance = false;
                        },500);
                    }
                }

                if (!timerObject.paused){
                    // The amount of time passed increments by one
                    timerObject.timePassed = timerObject.timePassed += 1;
                    timerObject.timeLeft = timerObject.localTimeLimit - timerObject.timePassed;
                    if (timerObject.timeLeft < 0){
                        timerObject.timeLeft = 0;
                    }
                    // console.log(timerObject.timeLeft);
                    
                    if (timerObject.visibleOption){
                        try {
                            setCircleDasharrayGeneral(timerObject.timeLeft,timerObject.localTimeLimit);
                            if (timerObject.changeColorOption){
                                setRemainingPathColorGeneral(timerObject.timeLeft);
                            }
                            if (timerObject.showDigits){
                                document.getElementById("base-timer-general-label").innerHTML = formatTime(timerObject.timeLeft);
                            }
                        } catch (e){
                            // Last timer element was probably interrupted
                            // Let's just destroy the timeInterval object 
                            clearInterval(timerObject.timeInterval);
                            timerObject.timeInterval = null;
                            timerObject.timerToZero();
                        }
                    }

                    if(timerObject.abortTimer){
                        clearInterval(timerObject.timeInterval);
                        timerObject.timeInterval = null;
                        timerObject.timerToZero();
                        reject();
                    }

                    if (timerObject.timeLeft <= 0) {
                        clearInterval(timerObject.timeInterval);
                        timerObject.timeInterval = null;
                        resolve();
                    }
                }
            }, 1000);
        });
    },

    stopTimer:function(){
        this.abortTimer = true;
    },

    killTimer:function(){
        clearInterval(timerObject.timeInterval);
        timerObject.timeInterval = null;
        this.removeHtmlTimer();
    },

    pauseTimer:function(){
        // This is a manual pause
        this.paused = !(this.paused);
        this.manual_pause = !(this.manual_pause);
    },

    removeHtmlTimer:function(){
        $("#timer-general").remove();
    },

    instantiateTimer:function(timeLimitVar,onTimerEnd,onTimerInterupt=(()=>{}),
                                addToElement='body',sizeVar=50,xPosVar=50,yPosVar=50,
                                changeColOpt=true,onFinishDisappear=true,
                                visible=true,showDig=true){        
        let timerobj= this;
        timerobj.showDigits = showDig;

        let cleanUp = function(){
            if (onFinishDisappear){
                timerobj.removeHtmlTimer();
            }
        };

        this.localTimeLimit = timeLimitVar;
        this.timeLeft = this.localTimeLimit;
        this.visibleOption = visible;

        if (this.visibleOption){
            this.drawTimer(sizeVar,xPosVar,yPosVar,changeColOpt,addToElement);
        }

        if (timeLimitVar == 0){
            onTimerEnd();
        } else {
            this.startTimer()
                .then(()=>{cleanUp();onTimerEnd();     },
                    ()=>{cleanUp();onTimerInterupt();});
        }
    }
}

// Update the dasharray value as time passes, starting with 283
function setCircleDasharrayGeneral(timeLeftVar,timeLimitVar) {
    const circleDasharray = `${(
    calculateTimeFraction(timeLeftVar,timeLimitVar) * 283
    ).toFixed(0)} 283`;
    document
    .getElementById("base-timer-general-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
};

function setRemainingPathColorGeneral(timeLeftVar) {
    const { alert, warning, info } = COLOR_CODES; // from window constants
    
    // If the remaining time is less than or equal to 5, remove the "warning" class and apply the "alert" class.
    if (timeLeftVar <= alert.threshold) {
        document
        .getElementById("base-timer-general-path-remaining")
        .classList.remove(warning.color);
        document
        .getElementById("base-timer-general-path-remaining")
        .classList.add(alert.color);
    
    // If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
    } else if (timeLeftVar <= warning.threshold) {
        document
        .getElementById("base-timer-general-path-remaining")
        .classList.remove(info.color);
        document
        .getElementById("base-timer-general-path-remaining")
        .classList.add(warning.color);
    }
};

window.exitFullscreenTimerObject = {
    localTimeLimit : TIME_LIMIT,
    timeLeft: TIME_LIMIT,
    timePassed : 0,
    remainingPathColor : COLOR_CODES.info.color,
    abortTimer : false,
    timeInterval : null,
    changeColorOption : null,
    visibleOption : true,
    paused : false,

    drawTimer:function(timerHeight,timerTop,timerLeft,changeCol=true,addTo="body"){
        // IF 50 % <=> 100 px for the label
        // THEN labelPix = percentage*2
        try{
            this.removeHtmlTimer(); // Can't draw 2 at the same time
        }catch(e){
            console.log(e);
        }
        this.changeColorOption = changeCol;
        let label_font_size = Math.floor(timerHeight*4.0);
        let stroke_size = 10;        
        // <div class="base-timer-general" style="height:`+timerHeight+`%;left:`+timerLeft+`%;top:`+timerTop+`%;">
        $(addTo).append(`
        <div id="timer-exitfs">
            <div class="base-timer-exitfs" style="height:`+timerHeight+`%;left:`+timerLeft+`%;top:`+timerTop+`%;">
                <svg class="base-timer-exitfs__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer-exitfs__circle">
                    <circle class="base-timer-exitfs__path-elapsed" cx="50" cy="50" r="45" style="stroke-width: `+stroke_size+`px;"></circle>
                    <path
                        id="base-timer-exitfs-path-remaining"
                        stroke-dasharray="283"
                        class="base-timer-exitfs__path-remaining ${this.remainingPathColor}"
                        style="stroke-width: `+stroke_size+`px;"
                        d="
                        M 50, 50
                        m -45, 0
                        a 45,45 0 1,0 90,0
                        a 45,45 0 1,0 -90,0
                        "
                    ></path>
                </g>
                </svg>
                <span id="base-timer-exitfs-label" class="base-timer-exitfs__label" style="font-size: `+label_font_size+`px;">
                    ${formatTime(this.timeLeft)}
                </span>
            </div>
        </div>
        `);
    },

    timerToZero:function(){
        this.paused = false;
        this.timeLeft = this.localTimeLimit
        this.timePassed = 0;
        this.timeInterval = null;
        this.abortTimer = false;
    },

    startTimer:function(autoReinit = true) {
        if (autoReinit) {
            try{
                clearInterval(this.timeInterval);
            }catch (error){
                console.log(error);
            }
            this.timerToZero();
        }

        let timerObject = this;
        return new Promise(function (resolve, reject) {
            timerObject.timeInterval = setInterval(() => {
                if (!timerObject.paused){
                    // The amount of time passed increments by one
                    timerObject.timePassed = timerObject.timePassed += 1;
                    timerObject.timeLeft = timerObject.localTimeLimit - timerObject.timePassed;
                    if (timerObject.timeLeft < 0){
                        timerObject.timeLeft = 0;
                    }
                    // console.log(timerObject.timeLeft);
                    
                    if (timerObject.visibleOption){
                        try {
                            setCircleDasharrayExitFs(timerObject.timeLeft,timerObject.localTimeLimit);
                            if (timerObject.changeColorOption){
                                setRemainingPathColorExitFs(timerObject.timeLeft);
                            }
                            document.getElementById("base-timer-exitfs-label").innerHTML = formatTime(timerObject.timeLeft);
                        } catch (e){
                            // Last timer element was probably interrupted
                            // Let's just destroy the timeInterval object 
                            clearInterval(timerObject.timeInterval);
                            timerObject.timeInterval = null;
                            timerObject.timerToZero();
                        }
                    }

                    if(timerObject.abortTimer){
                        clearInterval(timerObject.timeInterval);
                        timerObject.timeInterval = null;
                        timerObject.timerToZero();
                        reject();
                    }

                    if (timerObject.timeLeft <= 0) {
                        clearInterval(timerObject.timeInterval);
                        timerObject.timeInterval = null;
                        resolve();
                    }
                }
            }, 1000);
        });
    },

    stopTimer:function(){
        this.abortTimer = true;
    },

    killTimer:function(){
        clearInterval(timerObject.timeInterval);
        timerObject.timeInterval = null;
        this.removeHtmlTimer();
    },

    pauseTimer:function(){
        this.paused = !(this.paused);
    },

    removeHtmlTimer:function(){
        $("#timer-exitfs").remove();
    },

    instantiateTimer:function(timeLimitVar,onTimerEnd,onTimerInterupt=(()=>{}),
                                addToElement='body',sizeVar=50,xPosVar=50,yPosVar=50,
                                changeColOpt=true,onFinishDisappear=true,
                                visible=true){        
        let timerobj= this;

        let cleanUp = function(){
            if (onFinishDisappear){
                timerobj.removeHtmlTimer();
            }
        };

        this.localTimeLimit = timeLimitVar;
        this.timeLeft = this.localTimeLimit;
        this.visibleOption = visible;

        if (this.visibleOption){
            this.drawTimer(sizeVar,xPosVar,yPosVar,changeColOpt,addToElement);
        }

        if (timeLimitVar == 0){
            onTimerEnd();
        } else {
            this.startTimer()
                .then(()=>{cleanUp();onTimerEnd();     },
                    ()=>{cleanUp();onTimerInterupt();});
        }
    }
}

// Update the dasharray value as time passes, starting with 283
function setCircleDasharrayExitFs(timeLeftVar,timeLimitVar) {
    const circleDasharray = `${(
    calculateTimeFraction(timeLeftVar,timeLimitVar) * 283
    ).toFixed(0)} 283`;
    document
    .getElementById("base-timer-exitfs-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
};

function setRemainingPathColorExitFs(timeLeftVar) {
    const { alert, warning, info } = COLOR_CODES; // from window constants
    
    // If the remaining time is less than or equal to 5, remove the "warning" class and apply the "alert" class.
    if (timeLeftVar <= alert.threshold) {
        document
        .getElementById("base-timer-exitfs-path-remaining")
        .classList.remove(warning.color);
        document
        .getElementById("base-timer-exitfs-path-remaining")
        .classList.add(alert.color);
    
    // If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
    } else if (timeLeftVar <= warning.threshold) {
        document
        .getElementById("base-timer-exitfs-path-remaining")
        .classList.remove(info.color);
        document
        .getElementById("base-timer-exitfs-path-remaining")
        .classList.add(warning.color);
    }
};

function formatTime(time) {
    // The largest round integer less than or equal to the result of time divided being by 60.
    const minutes = Math.floor(time / 60);

    // Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds = time % 60;

    // If the value of seconds is less than 10, then display seconds with a leading zero
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    // The output in MM:SS format
    return `${minutes}:${seconds}`;
}

// Divides time left by the defined time limit.
function calculateTimeFraction(timeLeftVar, timeLimitVar) {
    const rawTimeFraction = timeLeftVar / timeLimitVar;
    return rawTimeFraction - (1 / timeLimitVar) * (1 - rawTimeFraction);
};
