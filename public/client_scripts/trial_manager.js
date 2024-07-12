// GETTING DATA PASSED ON THE URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
window.subjid = urlParams.get('subjectId');
console.log("Recorded subject id --> "+ subjid);

// USED EVENTS
const reininit_trial_event = new Event("reinitialize_trial");
const trial_started_event = new Event("trial_started");
const trial_ended_event = new Event("trial_ended");
const task_ended_event = new Event("task_ended");

// GLOBAL TRIAL DATA
window.trial_counter = 0; 
window.tmstps_counter = 0;

// TIMERS
window.timerTrialStart = 0;
window.timerTrialEnd = 0;
window.timerExpeStart = 0;
window.timerExpeEnd = 0;

let reinit_tmstptracker = function(){
    window.timestepTracker = {
        infered_action : "null",
        start : undefined,
        act_start : undefined,
        act_end : undefined,
        gauge_end : undefined,
        end : undefined,
        step :undefined,
        pointsData : [],
        grid_position : [],
        feedbackValue : undefined,
    }
}
reinit_tmstptracker();
window.saveManager.initializeTrainingTime();

window.timerExpeStart = window.saveManager.main_save_object.expe_start_time;
console.log(" [/] Initial starting time : " + window.saveManager.main_save_object.expe_start_time);

// HURRYUPTIMER
window.hurry_up_timer = null;

// UTILITARIES -----------------------------------------------
function calculateTrialScore(a_list){
    let total_subj_timesteps = a_list.length;
    let max_allowable_timesteps = MAX_TMSTPS+1; // +1 because MAX_TMSTPS is th emax number of ACTIONS, not feedbacks
    let total_dist = 0;
    // Give a feedback to the subject concerning its performance
    // Either : 
    // 1. Based on the feedback level he received : 
    //          Problem : scores should weighted depending on how
    //                     many trials happened before 
    // 2. Based on how far they were from the objective 
    //          Problem : this is a hidden variable for the subject DURING the 
    //                     task

    // TODO : take into account the N+1 th trial 
    if (CHART_BASED_ON_FEEDBACK_LEVELS){
        // TODO: this is a fake measure of success because the linear distance is an imperfect
        // measure of objective "closeness" in our grid. We can approximate 
        // by making the "optimal" the longest possible path (aka the diagonal) 
        // in the grid :
        for (let t=0;t<max_allowable_timesteps;t++){

            let optimal_step_dist_t = function(tvar){
                let max_linear_distance_n_away = Math.sqrt(2)*a_list[0][1] ;
                let max_linear_distance_t_away = Math.sqrt(2)*tvar;
                return Math.max(0,(max_linear_distance_n_away - max_linear_distance_t_away)/GRID_MAX_DIST);
            }

            if (t>=total_subj_timesteps){
                total_dist = total_dist + 0;
            } else {
                let my_step_dist_t = a_list[t][0];
                let diff = Math.max(0,my_step_dist_t - optimal_step_dist_t(t));
                let normalized_diff = diff/(1 - optimal_step_dist_t(t)); 
                console.log("Linear distance to goal : " + my_step_dist_t + " -- optimal distance to goal : " + optimal_step_dist_t(t))
                console.log("Resulting score : " + normalized_diff)
                total_dist = total_dist + normalized_diff;
            }
        }
        return (1 - (total_dist/MAX_TMSTPS))*100
    }else {
        // This is closer to the truth, but contains information
        // hidden from the subject during trial
        for (let t=0;t<max_allowable_timesteps;t++){
            if (t>=total_subj_timesteps){
                total_dist = total_dist + 0;
            } else {
                let optimal_step_dist_t = Math.max(0,a_list[0][1] - t);
                let my_step_dist_t = a_list[t][1];
                let diff = my_step_dist_t - optimal_step_dist_t;

                let normalized_diff = 0;
                if (window.myBackend.getMaximumStepNeeded() - optimal_step_dist_t > 0){
                    normalized_diff = diff/(window.myBackend.getMaximumStepNeeded() - optimal_step_dist_t);
                } else {
                    normalized_diff = 0;
                }
                console.log(t + "  :   optimal dist: " + optimal_step_dist_t + " -- current dist : " + my_step_dist_t); 
                console.log("Difference after norm : " + normalized_diff);
                total_dist = total_dist + normalized_diff;
            }
        }
        return (1 - (total_dist/MAX_TMSTPS))*100
    }
} 

// INTERRUPT TRIAL FUNCTION
window.looseAction = function(){
    whiteFlash().then(()=>{
        timestepTracker.step = tmstps_counter ; 
        timestepTracker.grid_position = window.myBackend.getGridPosition();
        timestepTracker.feedbackValue = window.gauge_anim.static_gauge_level;
        window.saveManager.saveEvent("TST","subject_took_too_long__trial-" +trial_counter+"_timestep-"+tmstps_counter);
        window.dispatchEvent(new Event("end_timestep"));
    });
}


// TIMESTEP-SCALE EVENT LISTENERS :
window.addEventListener("points_received",function(){
    // Save a few elements in the timesteps tracker : 
    timestepTracker.step = tmstps_counter ; 
    timestepTracker.pointsData = window.canvasPointData.slice();
    timestepTracker.grid_position = window.myBackend.getGridPosition();
    timestepTracker.feedbackValue = window.gauge_anim.static_gauge_level;
    window.dispatchEvent(new Event("points_saved"));
},false);

window.addEventListener("start_timestep",function(event){
    window.drawingBoard.resetCanvas();

    updateTrialDisp(trial_counter,tmstps_counter);
    reinit_tmstptracker();
    timestepTracker.start = Date.now();
    
    // $("#canvas").css({visibility: 'visible'});
    // $("#follow_pin").css("visibility", "visible");
    // $("#follow_pin_cnter").text(1 + "/" + LINEDOT_MAX_POINTS);
    
    // CREATE A TIMER HERE 
    window.hurry_up_timer = window.generalTimerObject;
    let remaining_timer = MAX_TIME_BEFORE_ACTION;
    let timerTop = 10;
    let timerLeft = 90;
    let timerSize = 18;
    window.hurry_up_timer.instantiateTimer(remaining_timer,looseAction,undefined,
        "body",timerSize,timerTop,timerLeft, // Size OR position parameters
        true,true,true,false);
});

// TIMESTEP SCALE
window.addEventListener("end_timestep",function(event){
    $("#timer-general").css({visibility: 'hidden'});
    $("#canvas").css({visibility: 'hidden'});
    timestepTracker.end = Date.now();

    window.saveManager.fullTimestepSave(timestepTracker,window.prompt_tracker);

    // Check if the grid task is finished
    // If it is, store it in the saveManager save_trial_outcome
    window.saveManager.save_trial_outcome = null;
    
    let after_trial_end_flash = null;
    if (window.myBackend.getSuccessBool()){
        // We achieved our goal !!
        window.saveManager.save_trial_outcome = "success";
        console.log("--TRIAL WON--");
        after_trial_end_flash = window.greenFlash;
    } else if (tmstps_counter == MAX_TMSTPS-1){
        // We failed :'(
        window.saveManager.save_trial_outcome = "failure";
        console.log("--TRIAL LOST--");
        after_trial_end_flash = window.redFlash;
    };

    // Update our trial_score for this trial
    window.saveManager.save_trial_scores[trial_counter].push(window.myBackend.getCompleteTimestepScore());
    
    // Continue the timestep if no outcome yet
    if (window.saveManager.save_trial_outcome != null){
        window.gauge_anim.pauseRecording();
        after_trial_end_flash().then(()=>{
            window.dispatchEvent(new Event("trial_ended"));
        });
    } else {
        tmstps_counter ++;
        window.dispatchEvent(new Event("start_timestep"));
    };
},false);


// TRIAL SCALE
window.addEventListener("trial_started",function(event){
    window.timerTrialStart = Date.now();
    window.saveManager.saveEvent("TRI","trial_"+trial_counter+"_started");
    
    window.saveManager.save_trial_scores.push([]);
    window.saveManager.save_trial_scores[trial_counter].push(window.myBackend.getCompleteTimestepScore()); // Push the current observation to the trial scores

    window.dispatchEvent(new Event("start_timestep"));
},false);

window.addEventListener("trial_ended",function(event){

    window.timerTrialEnd = Date.now();
    window.saveManager.saveEvent("TRI","trial_"+trial_counter+"_ended");

    window.saveManager.save_task_scores.push(calculateTrialScore(window.saveManager.save_trial_scores[trial_counter]));
    // $("#canvas").css({visibility: 'hidden'});
    
    window.saveManager.saveTrial();
    console.log(window.saveManager.main_save_object);
    window.timerTrialEnd = 0;
    window.timerTrialStart = 0;

    let continue_trial = function(){
        // Check if the grid task is finished, if not go to next trial
        if (trial_counter == MAX_TRIALS-1){
            window.dispatchEvent(task_ended_event);
        } else {
            tmstps_counter = 0;
            trial_counter ++;
            updateTrialDisp(trial_counter,tmstps_counter);
            window.dispatchEvent(reininit_trial_event);
            window.gauge_anim.startRecording();
        }
    }
    window.gauge_anim.pauseRecording();
    window.delay(10).then(()=>{
        if ((trial_counter!=(MAX_TRIALS-1))&&(((trial_counter+1)%SHOW_GRAPH_EVERY) == 0)){
            window.pauseAndShowChart(window.saveManager.save_task_scores).then(()=>{
                continue_trial();
            });
        } else {
            continue_trial();
        }
    });
},false);

function between_trial_screen(afterTimer=(()=>{})){
    $('body').find('*').hide() ;
    let timer = window.generalTimerObject;
    window.saveManager.saveEvent("WAI","task_betweentrials");
    timer.instantiateTimer(INTER_TRIAL_SCREEN_DURATION,()=>{
            window.saveManager.saveEvent("WAI","end_rereadinstr");
            $('body').find('*').show() ;
            afterTimer();
        },
        undefined,undefined,70,50,50, // Size OR position parameters
        false,true,true);
    $("#timer-general").append(
    `
    <div id="transition"> 
        <b>${lang.transitions.prep_for_new_trial}</b>
    </div>
    `
    );
}

window.addEventListener("reinitialize_trial",function(event){
    between_trial_screen(()=>{
        window.myBackend.spawnCharacter();
    })
},false);

// TRAINING SCALE
window.addEventListener("task_ended",function(event){
    window.pauseAndShowChart(window.saveManager.save_task_scores)
        .then(()=>{
            window.drawPostTaskScreen();
        });
},false);
