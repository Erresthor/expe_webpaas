
window.greenFlash = function(flashtime=FLASH_DURATION,addTo = "body"){
    return new Promise(function(resolve, reject){
        window.saveManager.saveEvent("FLA","flash_green_start");
        $(addTo).append(`
        <div class="flash">
            <div class='flash_circle' color='green'>
                <div style='width:150%'>
                    ${lang.task.trial_won}
                </div>
            </div>
        </div>
        `);
        setTimeout(()=>{
            try {
                window.saveManager.saveEvent("FLA","flash_green_end");
                $(".flash").remove();
            } catch(e){
                // ignore
            }
            resolve();
        },flashtime);
    });
}

window.redFlash = function(flashtime=FLASH_DURATION,addTo = "body"){
    return new Promise(function(resolve, reject){
        window.saveManager.saveEvent("FLA","flash_red_start");
        $(addTo).append(`
        <div class="flash">
            <div class='flash_circle' color='red'>
                <div style='width:150%'>
                    ${lang.task.trial_lost}
                </div>
            </div>
        </div>
        `);
            setTimeout(()=>{
                try {
                    window.saveManager.saveEvent("FLA","flash_red_end");
                    $(".flash").remove();
                } catch(e){
                    // ignore
                }
                resolve();
            },flashtime);
    });
}

var white_flash_dur =  FLASH_DURATION+1000;
window.whiteFlash = function(flashtime=white_flash_dur,addTo = "body"){
    return new Promise(function(resolve, reject){
        window.saveManager.saveEvent("FLA","flash_white_start");
        $(addTo).append(`
        <div class="flash">
            <div class='flash_circle' color='white'>
                <div style='width:100%'>
                    ${lang.task.hurry}
                </div>
            </div>
        </div>
        `);

        setTimeout(()=>{
            try {
                window.saveManager.saveEvent("FLA","flash_white_end");
                $(".flash").remove();
            } catch(e){
                // ignore
            }
            resolve();
        },flashtime);
        // white_flash_dur = white_flash_dur + 500;
    });
}
