import perlin from "./perlin.js";


// Animation class variables
window.gauge_anim = null;
const MEAN_CHANGE_FRAMES_N = 100;

// Clamp functions
// set a number between two values with the following line:
const clamp = (num, mini, maxi) => Math.min(Math.max(num, mini), maxi);
const clamp01 = (num) => clamp(num, 0, 1);

// Event variables
const gauge_ready_for_trial_event = new Event("gauge_ready_for_trial");
const gauge_finished_animation_event = new Event("gauge_finished_animation");

// The gauge animator class
var gauge_animator = {
    static_gauge_level : 0.0,
    gauge_max_height : 0.0,
    gauge_hider_element : null, 
    gauge_body_element : null,
    gauge_max_height : null,

    existing_interval_id : null,
    periodic_mean_change_interval_id : null,

    button_new_mean : null,
    backend_element : null,
    paused:false,

    linked_backend_element : null,

    perlin_int : null,
    perlin_freq : null,

    record_now : false,
    pauseRecording:function(){this.record_now=false;},
    startRecording:function(){this.record_now=true;},

    loadElements:function(){
        // Initialize the perlin noise
        perlin.seed();
        this.perlin_freq = PERLIN_FREQ;
        this.perlin_int = PERLIN_INT ;
        
        // Initialize the various components of the gauge
        const svg_obj = document.getElementById("svg1");
        var content_doc = svg_obj.contentDocument;
        this.gauge_hider_element = content_doc.getElementById("bar_hider");
        this.gauge_body_element = content_doc.getElementById("gauge_body");
        this.gauge_max_height = this.gauge_body_element.width.baseVal.value;
    },

    changeGaugeLevel:function(value) {
        // Value between 0 and 1
        this.gauge_hider_element.height.baseVal.value = (1-value) * this.gauge_max_height;
    },

    oscillateAroundMean:function(mean){
        this.resumeAnim();
        var animator = this;
        var frameCounter = 0;

        if (this.existing_interval_id !==  null){
            clearInterval(animator.existing_interval_id);
        }

        if (mean !== undefined){
            // console.log("New mean value : " + mean);
            animator.static_gauge_level = mean;
        }

        function frame() {
            var int_value = clamp01(animator.static_gauge_level + animator.perlin_int*perlin.get(0,frameCounter*animator.perlin_freq/1000));
            if (!animator.paused){
                animator.changeGaugeLevel(int_value);
                frameCounter++;
            }
            if (animator.record_now){
                window.saveManager.addNewFeedbackValueSave(int_value,animator.static_gauge_level);
            }
        }
        this.existing_interval_id = setInterval(frame, FRAME_VAL);
    },

    resetOscillatorOnScreenSizeChange:function(){
        this.oscillateAroundMean(this.static_gauge_level);
    },

    pauseAnim:function(){
        // console.log("PAUSED ANIMATION");
        this.paused = true;
    },

    resumeAnim:function(){
        this.paused = false;
    },

    updateGaugeLevel:function(new_gauge_level,callback){
        var gaugeObj = this;
        var old_gauge_level = this.static_gauge_level;
        var new_gauge_level = new_gauge_level
        var update_interval_id = null;

        var updateFrameCounter = 0;
        var animator = this;

        function frame_update_mean() {
            if (!animator.paused){
                updateFrameCounter++;
                animator.static_gauge_level = (updateFrameCounter/MEAN_CHANGE_FRAMES_N) * (new_gauge_level - old_gauge_level) + old_gauge_level;
                if (updateFrameCounter >= MEAN_CHANGE_FRAMES_N){
                    window.clearInterval(update_interval_id);
                    dispatchEvent(gauge_finished_animation_event);

                    window.timestepTracker.gauge_end = Date.now();
                    window.saveManager.saveEvent("GAU","anim_end");
                    typeof callback === 'function' && callback(); 
                }
            }
        }
        window.saveManager.saveEvent("GAU","anim_start");
        update_interval_id = setInterval(frame_update_mean, 10);
    },

    // Update gauge mean velue to backend distance
    updateBackendDist:function(callback){
        this.clearExistingIntervals();
        // console.log("Updating gauge level to " + (1-this.linked_backend_element.linearDistanceToGoal()) + " ...");
        this.updateGaugeLevel(1-this.linked_backend_element.linearDistanceToGoal(),callback);       
    },

    setGaugeToZero:function(){   
        this.clearExistingIntervals();
        this.oscillateAroundMean(0.0);
    },

    killGauge:function(){
        this.pauseRecording();
        this.clearExistingIntervals(true);
        window.gauge_anim = null;
    },

    setGaugeToRandom:function(){
        this.clearExistingIntervals();
        this.oscillateAroundMean(Math.random());
    },

    periodicValueChange:function(period){
        this.clearExistingIntervals();
        let gauge_obj = this;
        function frame_new_mean() {
            gauge_obj.updateGaugeLevel(Math.random(),()=>{});
        }
        this.periodic_mean_change_interval_id = setInterval(frame_new_mean, 3000);
    },

    clearExistingIntervals:function(main_included=false){
        // Only the periodic one
        try {
            window.clearInterval(this.periodic_mean_change_interval_id);
            this.periodic_mean_change_interval_id = null;
            if(main_included){
                window.clearInterval(this.existing_interval_id);
            }
        } catch(e){
            console.log("No existing periodic value change");
        }
    }
}

// LISTENERS 
function initializeGauge(initialize_backend_on_callback=true,autoset_to_0=true){
    // console.log("Initial load : gauge");
    window.gauge_anim = gauge_animator;
    window.gauge_anim.loadElements(); 
    if (autoset_to_0){
        window.gauge_anim.setGaugeToZero();
    }
    window.gauge_anim.startRecording();
    if (initialize_backend_on_callback){
        window.dispatchEvent(new Event("initialize_backend_order"));
    }
    return window.gauge_anim
};
window.addEventListener("initialize_gauge_order",()=>{initializeGauge();},false);
window.addEventListener("initialize_gauge_only_order",()=>{
    let gau = initializeGauge(false,true);
    gau.periodicValueChange();
},false);

function gaugeOnGridReady(){
    // console.log("[EVENT] GRID READY FOR NEW TRIAL");
    window.gauge_anim.linked_backend_element = window.myBackend;
    window.gauge_anim.updateBackendDist(()=>{window.dispatchEvent(gauge_ready_for_trial_event)});
};
window.addEventListener("grid_ready_for_trial", gaugeOnGridReady);

window.addEventListener("character_moved",function(event){
    window.gauge_anim.updateBackendDist(()=>{
        window.dispatchEvent(new Event("gauge_ready_for_timestep"))});
},false);

window.addEventListener("initial_load",()=>{window.dispatchEvent(new Event("initialize_gauge_order"));},false);

window.addEventListener("gauge_ready_for_trial",function(event){
    // Only start a trial when the gauge animation completes
    // Only fires in the first timestep of a trial
    window.retry_until_unpaused(()=>{
        window.dispatchEvent(new Event("trial_started"));
    });
},false);


window.addEventListener("gauge_ready_for_timestep",function(event){
    // Only end a timestep when the gauge animation completes
    // Only fires during the trial, not in the first timestep 
    window.retry_until_unpaused(()=>{
        window.dispatchEvent(new Event("end_timestep"));
    });
},false);