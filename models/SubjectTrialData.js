const mongoose = require('mongoose');

const SubjectDataSchema = new mongoose.Schema({
    detected_browser : String,
    subjectId:String,
    languageId : String,
    firstTime : Date,
    expe_start_time : Number,
    expe_end_time : Number,
    early_save_time : Number,
    object_save_date : Date,
    maxTMSTPS : Number,
    maxTRIALS : Number,
    bruh:String,
    feedback_control_est_question : Number,
    feedback_control_text_question : String,
    design_q1:String,
    design_q2:String,
    design_q3:String,
    feedbackRTValues : [{
        t : Number,
        value : Number,
        real_value : Number
    }],
    map : [[Number]],
    explore_canvas_points : [[[Number]]],
    explore_canvas_input_times : [Number],
    events :{
        fullscreen : [{t:Number,val:String}],
        instructions : [{t:Number,val:String}],
        charts : [{t:Number,val:String}],
        trials : [{t:Number,val:String}],
        timesteps : [{t:Number,val:String}],
        wait:[{t:Number,val:String}],
        gauge : [{t:Number,val:String}],
        flashes : [{t:Number,val:String}],
        prompts : [{t:Number,val:String}],
        misc : [{t:Number,val:String}]
    },
    trialData:[
        {
            start_trial_time:Number,
            end_trial_time:Number,
            trialNumber:Number,
            outcome:String,
            finalScore:Number,
            last_tick_obs : Number,
            last_tick_pos : [Number],
            n_timesteps : Number,
            timesteps:[
                {   
                    prompted : {
                        prompt_showtime : Number,
                        prompt_clicktime : Number,
                        true_val : String,
                        subj_pred : String,
                        prompt_correct :Boolean
                    },
                    time_start : Number,
                    action_start : Number,
                    action_end : Number,
                    gauge_animation_end : Number,
                    time_end : Number,
                    step : Number,
                    pointsData:[[Number]],
                    infered_grid_movement : String,
                    grid_position : [Number],
                    feedbackValue: Number
                }
            ]
        }
    ]
});

if (false){
    // For a single database
    const SubjectDataModel = mongoose.model('SubjectData', SubjectDataSchema);
    const SubjectDataModelIncomplete = mongoose.model('SubjectDataInc', SubjectDataSchema);
    module.exports=  {SubjectDataModel,SubjectDataModelIncomplete}
}else {
    module.exports = {SubjectDataSchema}
}
  
