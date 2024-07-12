// General save objects
window.prompt_tracker = null;

function downloadObjectAsJson(exportName, jsonObject){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonObject);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("id",     "dlNode");
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function checkBrowser() {
    // Get the user-agent string
    let text_browser = "";

    let userAgentString = 
        navigator.userAgent;
  
    // Detect Chrome
    let chromeAgent = 
        userAgentString.indexOf("Chrome") > -1;
  
    // Detect Internet Explorer
    let IExplorerAgent = 
        userAgentString.indexOf("MSIE") > -1 || 
        userAgentString.indexOf("rv:") > -1;
  
    // Detect Firefox
    let firefoxAgent = 
        userAgentString.indexOf("Firefox") > -1;
  
    // Detect Safari
    let safariAgent = 
        userAgentString.indexOf("Safari") > -1;
          
    // Discard Safari since it also matches Chrome
    if ((chromeAgent) && (safariAgent)) 
        safariAgent = false;
  
    // Detect Opera
    let operaAgent = 
        userAgentString.indexOf("OP") > -1;
          
    // Discard Chrome since it also matches Opera     
    if ((chromeAgent) && (operaAgent)) 
        chromeAgent = false;

    if (chromeAgent){
        text_browser += "CHROME ";
    }
    if (operaAgent){
        text_browser += "OPERA ";
    }
    if (safariAgent){
        text_browser += "SAFARI ";
    }
    if (firefoxAgent){
        text_browser += "FIREFOX ";
    }
    if (IExplorerAgent){
        text_browser += "IExplorerAgent ";
    }
    if (text_browser==""){
        text_browser = "OTHER";
    }
    return text_browser;
};


// console.log(browserName);
window.saveManager = {
    save_trial_outcome : null,
    save_trial_scores : [],
    save_task_scores : [],
    save_timestep_object : [],

    main_save_object : {
        detected_browser : checkBrowser(),
        expe_start_time:null,
        expe_end_time:null,
        early_save_time : null,
        maxTMSTPS : window.MAX_TMSTPS,
        maxTRIALS : window.MAX_TRIALS,
        languageId : null,
        firstTime : null,
        subjectId : null,
        object_save_date : null,
        explore_canvas_input_times : [],
        explore_canvas_points : [], 
        map : null,
        bruh : "bruh_indeed", // key ? :p
        feedbackRTValues : [],
        events:{
            fullscreen : [],
            instructions : [],
            charts : [],
            trials : [],
            timesteps : [],
            wait : [],
            gauge:[],
            flashes: [],
            prompts : [],
            misc : []
        },
        trialData :[],
        feedback_control_est_question : null,
        feedback_control_text_question: null,
        design_q1:null,
        design_q2:null,
        design_q3:null
    },

    initializeTrainingTime : function(){
        this.main_save_object.expe_start_time = Date.now();
        console.log("Detected browser --> " + this.main_save_object.detected_browser);
    },

    updateTrialMap : function(varmap){
        this.main_save_object.map = varmap;
    },

    add_new_set_of_explore_canvas_points:function(t,newSet){
        this.main_save_object.explore_canvas_input_times.push(t-this.main_save_object.expe_start_time);
        this.main_save_object.explore_canvas_points.push(newSet);
    },

    saveEvent:function(eventCode,value=null){
        console.log(" [/] : " + this.main_save_object.expe_start_time + " + " + (Date.now()-this.main_save_object.expe_start_time))
        console.log("     >Recorded event : " + eventCode + " - " + value);
        switch(eventCode){
            case 'FSC' :
                this.main_save_object.events.fullscreen.push(
                {
                    t : Date.now()-this.main_save_object.expe_start_time,
                    val : value
                }
                );
                break;
            case 'INS' : 
                this.main_save_object.events.instructions.push(
                    {
                        t : Date.now()-this.main_save_object.expe_start_time,
                        val : value
                    }
                );
                break;
            case 'PRM' : 
                this.main_save_object.events.prompts.push(
                    {
                        t : Date.now()-this.main_save_object.expe_start_time,
                        val : value
                    }
                );
                break;
            case 'CHA':
                this.main_save_object.events.charts.push(
                    {
                        t : Date.now()-this.main_save_object.expe_start_time,
                        val : value
                    }
                );
                break;
            case 'TRI':
                this.main_save_object.events.trials.push(
                    {
                        t : Date.now()-this.main_save_object.expe_start_time,
                        val : value
                    }
                );
                break;
            case 'TST':
                this.main_save_object.events.timesteps.push(
                    {
                        t : Date.now()-this.main_save_object.expe_start_time,
                        val : value
                    }
                );
                break;
            case 'WAI':
                this.main_save_object.events.wait.push(
                    {
                        t : Date.now()-this.main_save_object.expe_start_time,
                        val : value
                    }
                );
                break;
            case 'GAU':
                this.main_save_object.events.gauge.push(
                    {
                        t : Date.now()-this.main_save_object.expe_start_time,
                        val : value
                    }
                );
                break;
            case "FLA" : 
                this.main_save_object.events.flashes.push(
                    {
                        t : Date.now()-this.main_save_object.expe_start_time,
                        val : value
                    }
                );
                break;
            default : 
                console.log("Did not recognize event code, saving in miscellaneous.")
                this.main_save_object.events.misc.push(
                    {
                        t : Date.now()-this.main_save_object.expe_start_time,
                        val : value
                    }
                ); 
                break;
                return false;
        }
    },

    fullTimestepSave : function(tmstp_tracker,prompt_tracker){
        this.save_timestep_object.push({
            infered_grid_movement : tmstp_tracker.infered_action,
            prompted: null,
            time_start : tmstp_tracker.start-this.main_save_object.expe_start_time,
            action_start : tmstp_tracker.act_start-this.main_save_object.expe_start_time,
            action_end : tmstp_tracker.act_end-this.main_save_object.expe_start_time,
            gauge_animation_end : tmstp_tracker.gauge_end-this.main_save_object.expe_start_time,
            time_end : tmstp_tracker.end-this.main_save_object.expe_start_time,
            step : tmstp_tracker.step, 
            pointsData : tmstp_tracker.pointsData.slice(),         // The action input at that time (u_t)
            grid_position : tmstp_tracker.grid_position.slice(),
            feedbackValue : tmstp_tracker.feedbackValue // The feedback value at that time (x_t)
        });
        
        // The timestep object was added before, update the final variables 
        // This is very convoluted and should be improved
        if(prompt_tracker != null){
            this.save_timestep_object[this.save_timestep_object.length - 1].prompted = {
                prompt_correct : prompt_tracker.prompt_correct,
                true_val : prompt_tracker.true_val,
                subj_pred : prompt_tracker.subj_pred,
                prompt_showtime : prompt_tracker.prompt_showtime- this.main_save_object.expe_start_time,
                prompt_clicktime : prompt_tracker.prompt_clicktime - this.main_save_object.expe_start_time
            }
        } else {
            this.save_timestep_object[this.save_timestep_object.length - 1].prompted = null;
        }
    },

    saveTrial : function(){
        let save_trial_object = {
            start_trial_time : window.timerTrialStart-this.main_save_object.expe_start_time,
            end_trial_time : window.timerTrialEnd-this.main_save_object.expe_start_time,
            trialNumber: window.trial_counter,
            outcome: this.save_trial_outcome,
            last_tick_obs : window.gauge_anim.static_gauge_level, // We do not save the last timestep in the same way as the others
            last_tick_pos : window.myBackend.getGridPosition(),
            finalScore: this.save_task_scores[window.trial_counter],
            n_timesteps : this.save_timestep_object.length,
            timesteps : this.save_timestep_object
        }
        this.main_save_object.trialData.push(save_trial_object)
        this.save_timestep_object = []; // Reset the timesteps saver
    },

    sendSavedDataToDatabase : function(){
        let local_savemanager = this;
        return new Promise(function(resolve, reject){
            // MAKE DATABASE QUERY :D
            var date = new Date();
            date = date.toISOString()
            console.log("Date " + date);

            local_savemanager.main_save_object.expe_end_time = Date.now() - local_savemanager.main_save_object.expe_start_time;
            local_savemanager.main_save_object.object_save_date = date;
            local_savemanager.main_save_object.subjectId = window.subjid;
            var JSONTaskResults = JSON.stringify(local_savemanager.main_save_object);
            
            const size = new TextEncoder().encode(JSONTaskResults).length
            const kiloBytes = size / 1024;
            const megaBytes = kiloBytes / 1024;
            console.log("Sending the training object with POST query ...");
            console.log("Size: " + megaBytes + " Mbs");

            $.ajax({
                type: "POST",
                url: "/api/data/",
                data : JSONTaskResults,
                contentType: 'application/json'
            })
            .then(()=>{
                    console.log("Data upload successful !");
                    resolve();
                },()=>{
                    console.log("Data upload failed : this isn't good ...");
                    reject();
                });
        });
    },

    downloadDataLocally: function(){
        downloadObjectAsJson("my_experiment_data", JSONTaskResults);
    },

    sendPartialDataToDatabase : function(){
        let local_savemanager = this;
        return new Promise(function(resolve, reject){
            // MAKE DATABASE QUERY :D
            var date = new Date();
            date = date.toISOString()
            console.log("Date " + date);

            let main_save_object_copy = _.cloneDeep(local_savemanager.main_save_object);

            main_save_object_copy.early_save_time = Date.now() - local_savemanager.main_save_object.expe_start_time;
            main_save_object_copy.object_save_date = date;
            main_save_object_copy.subjectId = window.subjid;
            var JSONTaskResults = JSON.stringify(main_save_object_copy);
            
            
            const size = new TextEncoder().encode(JSONTaskResults).length
            const kiloBytes = size / 1024;
            const megaBytes = kiloBytes / 1024;
            console.log("Sending the training object with POST query ...");
            console.log("Size: " + megaBytes + " Mbs");

            $.ajax({
                type: "POST",
                url: "/api/data/inc/",
                data : JSONTaskResults,
                contentType: 'application/json'
            }).then(()=>{
                console.log("Emergency save successful !");
                resolve();
            },()=>{
                console.log("Emergency save failed, situation critical !");
                reject();
            });
        });
    },

    addNewFeedbackValueSave : function(current_f_value,current_mean_value){
        // console.log("recording " + (Math.round(current_f_value * 1000) / 1000) + " -- " + (Math.round(current_mean_value * 1000) / 1000));
        this.main_save_object.feedbackRTValues.push(
            {
                t : Date.now()-this.main_save_object.expe_start_time,
                value : Math.round(current_f_value * 1000) / 1000,
                real_value : Math.round(current_mean_value * 1000) / 1000
            }
        )
    },

    saveParticipantPostAnswers : function(estimate,text){
        this.main_save_object.feedback_control_est_question = estimate;
        this.main_save_object.feedback_control_text_question = text;
    },

    saveParticipantDesignAnswers : function(q1,q2,q3){
        this.main_save_object.design_q1 = q1;
        this.main_save_object.design_q2 = q2;
        this.main_save_object.design_q3 = q3;
    }
}

