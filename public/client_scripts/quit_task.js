var saveAndQuit = function(){
    attempt_database_query()
        .then(()=>{goodbye_onSaveSuccess();},
            ()=>{goodbye_onSaveFail();})
}
window.saveAndQuitGlobal = saveAndQuit

var preliQuit = function(){
    onExperimentPreliminaryExit();
}
window.preliminaryQuitGlobal = preliQuit

var onExperimentExit = function(){
    window.location.assign("/");
}

var onExperimentPreliminaryExit = function(){
    window.location.replace(window.ON_FAIL_RETURN_TASK_ADDRESS);
}

var attempt_database_query = function(){
    window.timerExpeEnd = Date.now();
    $('body').find('*').remove();
    $('body').append(`
    <div id="wait_please"> 
        <span id="wait_container"> ${lang.end.sending_data} </span>
    </div>
    `)
    return window.saveManager.sendSavedDataToDatabase()
}

var goodbye_onSaveSuccess = function(){
    console.log("This was sent to the database :")
    console.log(window.saveManager.main_save_object);

    $("body").find("*").remove();
    $("body").append(`
    <div id="wait_please"> 
        <div id="wait_container"> ${lang.end.goodbye} </div>
    </div>
    <div id="leave_the_exp"> 
        ${lang.end.exit_experiment}
    </div>
    `)

    $("#leave_the_exp").click(()=>{
        onExperimentExit();
    });
}

var goodbye_onSaveFail = function(){
    console.log("This was NOT sent to the database :")
    console.log(window.saveManager.main_save_object);

    $("body").find("*").remove();
    $("body").append(`
        <div id="wait_please"> 
            <div id="wait_container"> ${lang.end.data_problem} </div>
        </div>
        <div id="leave_the_exp"> 
            ${lang.end.exit_experiment}
        </div>
    `)
    window.saveManager.downloadDataLocally();
    $("#leave_the_exp").click(()=>{
        onExperimentExit();
    });
}

