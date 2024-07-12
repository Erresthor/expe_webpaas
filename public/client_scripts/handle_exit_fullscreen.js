// Exit fullscreen handler variables 
var infullscreen_bool = true;
var abort_timer = false;
var fullscreen_exits_counter = 0;


window.pause_current_process = false;
window.retry_until_unpaused = function(callback,retry_every=500) {
    // A general function that tries to launch a callback
    // If the current process is paused, it waits for [retry_every] milliseconds
    // then tries again
    if (window.pause_current_process) {
        let retryInterval = setInterval(
          ()=>{
            console.log("Still paused : retrying...")
            if (!window.pause_current_process) {
              clearInterval(retryInterval);
              callback();
            }
          },retry_every
        )
    } else {
        callback();
    }
}

if (document.addEventListener)
{
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
}

function exitHandler()
{
    // This function is called every time the subject exits fullscreen.
    // It pauses every process, saves the partial data and instantiates a timer
    // If the subject has not returned to fullscren by its end, it will fail the 
    // task. Every time the subject exits fullscreen, the time given to return to
    // fullscreen will be decreased (T_return = TIME_LIMIT/number_of_fs_exits)
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
    {
        infullscreen_bool = false;
        abort_timer = false;
        fullscreen_exits_counter++;

        console.log("FULLSCREEN EXITED >:( NOT GOOD FRIENDO")
        window.saveManager.saveEvent("FSC","exited_fullscreen");
        window.saveManager.sendPartialDataToDatabase()
            .catch((err)=>{
                console.log("Failed to save partial data ...");
                console.log(err);
            })
        // Run code on exit
        
        window.pause_current_process = true;
        try {
            window.hurry_up_timer.killTimer();
            console.log("Killing preexisting timer")
        } catch(e){
            // DO nothing
        }      
        
        $('body').find('*').hide() ;
        
        // let timer = timerObject;
        let timeLimit = Math.floor(TIME_LIMIT/fullscreen_exits_counter);

        let onTimerEnd = window.preliminaryQuitGlobal;
        let onTimerInterupt = returnToExpeHandler;

        let timer = window.exitFullscreenTimerObject;

        timer.instantiateTimer(timeLimit,onTimerEnd,onTimerInterupt,
            undefined,50,50,50, // Size OR position parameters
            true,true);

        $('body').append(
        `
        <div id='back_to_fullscreen_message_cont'>
            <p id='back_to_fullscreen_message'>${lang.infraction.warning_message}</p><br>
            <p id='back_to_fullscreen_message_smol'>${lang.infraction.leave_screen_counter}</p>
        </div>
        <div id='back_to_fullscreen'>
            <p id='backtofull_text'>${lang.infraction.back_to_fs}</p>
        </div>
        `.format(fullscreen_exits_counter)) ;
        
        $('#back_to_fullscreen').click(()=>{
            // STOP THE COUNT !!!
            timer.stopTimer();
        })
    }
}

function returnToExpeHandler(){
    // Return to the fullscreen and unpause the experiment
    window.dispatchEvent(new Event("openFullscreen"));
    infullscreen_bool = true;

    // If the subject entered fullscreen again
    $('#back_to_fullscreen').remove() ;
    $('#back_to_fullscreen_message_cont').remove();
    window.delay(500).then(()=>{
        window.pause_current_process = false;
        if (infullscreen_bool) { // To make sure the subject is still fullscreen
            $('body').find('*').show() ;
        };
    });
}
