
var drawLinedotMouseFollower = function(addto='body'){
    return new Promise((resolve, reject) =>{
        let loader_counter = 0;
        let onImageLoad = function() {
            loader_counter++;
            if (loader_counter>=2){
                resolve(); 
            }
        };

        $(addto).append(`
            <div id="follow_pin">
                <img id="follow_pin_img"></img>
                <div id="follow_pin_cnter"></div>
            </div>
        `);
        $("#follow_pin").css("visibility", "hidden");

        let followpin_img = $("#follow_pin_img")[0]
        followpin_img.onload = onImageLoad;
        window.point_image_cache.onload = onImageLoad;

        followpin_img.setAttribute('src','resources/new_pin.png');
        window.point_image_cache.src = 'resources/new_pin.png';
    })
}

var drawACanvas = function(topper,leftper,addto='body'){
    return new Promise((resolve, reject) => {
        let loader_counter = 0;
        $(addto).append(`
        <span id='fullscreen_canvas_container' style='top:` + topper + `%;left:`+ leftper +`%;' class='trial_elt'>
            <canvas id='canvas' class='trial_elt'>
            </canvas>
            <object id='canvas_timer_svg' type='image/svg+xml'></object>
        </span>
        `);

        let pb_fill = null;
        let pb_max_height=null;

        window.point_image_cache = new Image();

        $('#canvas_timer_svg')[0].addEventListener('load', function() {
            let svg_obj = document.getElementById("canvas_timer_svg");
            let content_doc = svg_obj.contentDocument;
            let pb_bckg = content_doc.getElementById("progress_bar_background");
            pb_max_height = pb_bckg.width.baseVal.value;
            pb_fill = content_doc.getElementById("progress_bar_fill");
            
            if (window.CANVAS_MODE=="linedot"){
                drawLinedotMouseFollower(addto).then(()=>{
                    resolve([pb_fill, pb_max_height]); 
                })
            } else {
                resolve([pb_fill, pb_max_height]); 
            }
        }, true);
        
        $('#canvas_timer_svg')[0].data = 'resources/progressbar.svg' ;      
    });
};

var drawAGauge =function(topper,leftper,addto='body') {
    return new Promise((resolve, reject) => {
        $(addto).append("<span id='fullscreen_gauge_container' style='top:" + topper + "%;left:"+ leftper +"%;' class='trial_elt'><object id='svg1' type='image/svg+xml'></object></span>");
        $('#svg1')[0].addEventListener('load', function() {
            resolve("gauge_loaded");    
        }, true);

        $('#svg1')[0].data = 'resources/gauge.svg' ;
    });
}

var drawTrialTracker = function(topper,leftper,addto='body'){
    $(addto).append(`<div id='trial_disp' style='top:${topper}%;left:${leftper}%;' class='trial_elt'> ${lang.task.TRIAL} 1 / ${MAX_TRIALS} -- ${lang.task.TIMESTEP} 1 / ${MAX_TMSTPS} </div>`) ;
    window.disp_element = document.getElementById("trial_disp");
    // console.log("element_noticed ! "); 
    // console.log(window.disp_element);
}

window.updateTrialDisp = function(trialC,tmstpC){
    window.disp_element.innerHTML = `${lang.task.TRIAL} ${(trialC+1)} / ${MAX_TRIALS} -- ${lang.task.TIMESTEP} ${(tmstpC+1)} / ${MAX_TMSTPS}`;
}

var drawPromptButtons = function(posTop,posLeft,size,addto='body'){
    return new Promise((resolve, reject) => {
        $(addto).append(`
        <div id="promptButtonsContainer" style="z-index:100;">
            <div id="prompt_up" class="promptButton" style="top:`+ posTop[0]+`%;left:`+posLeft+`%;height:`+size+`%;">
                <img dir="up" class='promptSymbol'></img>
            </div>
            <div id="prompt_same" class="promptButton" style="top:`+ posTop[1]+`%;left:`+posLeft+`%;height:`+size+`%;">
                <img dir="same" class='promptSymbol'></img>
            </div>
            <div id="prompt_down" class="promptButton" style="top:`+ posTop[2]+`%;left:`+posLeft+`%;height:`+size+`%;">
                <img dir="down" class='promptSymbol'></img>
            </div>
        </div>
        `);

        let up_arrow_obj =  $('.promptSymbol[dir="up"]')[0] ;
        let down_arrow_obj = $('.promptSymbol[dir="down"]')[0] ;
        let same_arrow_obj = $('.promptSymbol[dir="same"]')[0];

        let count_imgs = 0;
        let onImageLoad = function() {
            count_imgs += 1;
            // console.log(up_arrow_obj.data)
            // console.log(down_arrow_obj.data)
            // console.log(same_arrow_obj.data)
            if (count_imgs==3){
                // console.log("Prompt images have loaded !")
                resolve([up_arrow_obj,same_arrow_obj,down_arrow_obj]);
            }
        };
        
        // console.log(up_arrow_obj)
        // console.log(down_arrow_obj)
        // console.log(same_arrow_obj)
        up_arrow_obj.onload = onImageLoad;
        down_arrow_obj.onload = onImageLoad;
        same_arrow_obj.onload = onImageLoad;

        up_arrow_obj.setAttribute('src','resources/arrow.png');
        down_arrow_obj.setAttribute('src','resources/arrow.png');
        same_arrow_obj.setAttribute('src','resources/equal.png');
    });
}

window.drawGaugeOnly=function(heightpos=50,widthpos=30,addto='body'){
    return new Promise(function(resolve,reject){
        drawAGauge(heightpos,widthpos,addto)
        .then(function(){
            window.dispatchEvent(new Event("initialize_gauge_only_order"));
            resolve();
        })
    });
}

window.drawCanvasOnly=function(heightpos=50,widthpos=30,addto){
    drawACanvas(heightpos,widthpos,addto)
        .then(()=>{
            window.dispatchEvent(new Event("initialize_dboard_only_order"))
        });
}

//PROMPT BUTTONS
window.winDrawPromptButtons = function(heightpos=[20,50,80],widthpos=75,size=20,addto='body'){
    window.saveManager.saveEvent("PRM","drawing_prompt");
    return drawPromptButtons(heightpos,widthpos,size,addto) ;
};

window.drawFullTrialView=function(){
    
    window.current_task_step_id = 3 ;  // We are doing the actual task
    console.log(window.current_task_step_id);
    console.log("DRAW ONCE")

    drawTrialTracker(5,50); // Immediate
    Promise.all([
        drawACanvas(50,25),  // NOT Immediate
        drawAGauge(50,75)    // NOT Immediate
    ])
        .then(function(){
            window.dispatchEvent(new Event("initial_load"));
        })
        .catch(error => {
            // TODO : send to an abort page
            console.log(error);
        });
    // window.winDrawPromptButtons().then((obj)=>{console.log(obj);});
};

window.erasePromptButtons = function(){
    $("#promptButtonsContainer").remove();
};


// SHOW / HIDE
window.hideTrialView=function(){
    $('.trial_elt').css({visibility: 'hidden'});
};

window.showTrialView=function(){
    $('.trial_elt').css({visibility: 'visible'});
};