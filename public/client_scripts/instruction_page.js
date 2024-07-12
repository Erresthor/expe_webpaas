// INSTRUCTION PAGE VARIABLES
var subj_has_seen_all_instr = false;

function removeInstructions(show_the_rest = true){
    if (show_the_rest){
        $('body').find('*').show() ;
    }
    $("#draw_instructions_object").remove();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function getInstructionsContent(promptCode){
    let content_text = null ;
    let prompt_for_switch = promptCode;
        
    let feedbackcolor = "#ff1493";
    let actioncolor = "#daa520";
    let feedback_text = `<span style='color:${feedbackcolor};'><b>${lang.instructions.feedback} </b></span>`
    let action_text = `<span style='color:${actioncolor};'><b>${lang.instructions.action} </b></span>`
    let actions_text = `<span style='color:${actioncolor};'><b>${lang.instructions.actions} </b></span>`
    let action_cap_text = `<span style='color:${actioncolor};'><b>${lang.instructions.action_cap} </b></span>`
    let feedback_cap_text = `<span style='color:${feedbackcolor};'><b>${lang.instructions.feedback_cap} </b></span>`
    switch (prompt_for_switch){
        case "INSTRUCTIONS_0": // GENERAL TASK WELCOME
            content_text=
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_container"> 
                        <div style="display:flex;flex-direction: column;flex-wrap: nowrap;align-content: center;align-items: center;">
                            <div class="instruction_p"> ${lang.instructions.a.a1} </div>
                            <div class="instruction_p"> ${lang.instructions.a.a2} </div>
                            <div class="instruction_p"  style='color:red'> ${lang.instructions.a.a3} </div>
                        </div>                   
                    </div>
                </div>
            </div>
            `;
            break;
        case "INSTRUCTIONS_1": // GENERAL TASK INFORMATIONS
            content_text = 
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_container"> 
                        <div style="display:flex;flex-direction: column;flex-wrap: nowrap;align-content: center;align-items: center;">
                            <div class="instruction_p"> ${lang.instructions.b.b1} </div>
                            <div class="instruction_p"> ${lang.instructions.b.b2} </div>
                            <div class="instruction_p"> ${lang.instructions.b.b3} </div>
                            <div class="instruction_p"> ${lang.instructions.b.b4} </div> 
                        </div>                   
                    </div>
                </div>
            </div>
            `;
            break;
        case "INSTRUCTIONS_2": // TASK VIEWS
            content_text = 
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_container"> 
                        <div style="display:flex;flex-direction: column;flex-wrap: nowrap;align-content: center;align-items: center;">
                            <div class="instruction_p"> ${lang.instructions.c.c1} </div>
                            <div class="instruction_p"> ${lang.instructions.c.c2} </div>                    
                        </div>         
                    </div>
                </div>
                <img id="trial_view_container" src="resources/trial_view.png" alt="Trial view">
            </div>
            `;
            break;
        case "INSTRUCTIONS_3": // ACTION SCREEN INFORMATIONS
            if (CANVAS_MODE==="linedot"){
                lang.instructions.d = lang.instructions.d_2;
            }
            content_text = 
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_container">
                        <div class="instruction_title" style='margin-right:100px;margin-left:40%;'> ${lang.instructions.d.d1} </div>
                        <ul class="instruction_txt" style='list-style-type: circle;margin-right:100px;margin-left:40%;'>
                            <li> ${lang.instructions.d.d2} <br></li> 
                            <li> ${lang.instructions.d.d3} <br></li>
                            <li> ${lang.instructions.d.d4} </li>
                            <li> ${lang.instructions.d.d5} </li>
                        </ul>
                    </div>
                </div>
            </div>
            `;
            break; 
        case "INSTRUCTIONS_4":
            content_text = 
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_container" style="margin-right:100px;margin-left:60%;">
                        <div class="instruction_title"> ${lang.instructions.j.j1} </div>
                        <ul class="instruction_txt" style='list-style-type: circle;'>
                            <li> ${lang.instructions.j.j2} </div>
                        </ul>
                    </div>
                </div>
            </div>
            `;
            break;
        case "INSTRUCTIONS_5": // GAUGE INFORMATIONS
            content_text = 
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_container">
                        <div class="instruction_title"> ${lang.instructions.e.e1} </div>
                        <ul class="instruction_txt" style='list-style-type: circle;margin-left:100px;margin-right:35%;'>
                            <li> ${lang.instructions.e.e2} </li>
                            <li> ${lang.instructions.e.e3} </li>
                            <li> ${lang.instructions.e.e4} </li>
                            <li> ${lang.instructions.e.e41} </li>
                        </ul>
                        <br>
                        <div style="margin-left:100px;margin-right:35%;font-size:2vh;"> ${lang.instructions.e.e5} </div>
                    </div>
                </div>
            </div>
            `;
            break;      
        case "INSTRUCTIONS_6": // PROMPTS
            content_text = 
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_container">
                        <div class="instruction_title"> ${lang.instructions.f.f1} </div>
                        <br>
                        <ul class="instruction_txt" style='list-style-type: circle;margin-left:100px;margin-right:35%;'>
                            <li> ${lang.instructions.f.f2} </li>
                            <li> ${lang.instructions.f.f3} </li>
                        </ul>
                    </div>
                </div>
            </div>
            `;
            break;      
        case "INSTRUCTIONS_7": // GRAPHS
            subj_has_seen_all_instr = true;
            content_text = 
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_container"> 
                        <div style="display:flex;flex-direction: column;flex-wrap: nowrap;align-content: center;align-items: center;">
                            <div class="instruction_p"> ${lang.instructions.g.g1} </div>
                            <div class="instruction_p"> ${lang.instructions.g.g2} </div>
                        </div>                   
                    </div>
                </div>
                <img id="chart_view_container" src="resources/chart_view_${window.langstr}.png" alt="Chart view">
            </div>
            `;
            break;
        case "CHECK_A":
            // INSTRUCTIONS CHECK 1
            content_text = 
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_check_container">
                        <div class="instruction_title"> ${lang.instructions.h.h1} </div><br>

                        <div class="instruction_txt"> ${lang.instructions.h.h2} </div><br>

                        <div class="checkbox_group">
                            <input class="instruction_txt" type="checkbox" idx="1" name="prompt1" value="false"> ${lang.instructions.h.h3} <br>
                            <input class="instruction_txt" type="checkbox" idx="2" name="prompt1" value="true"> ${lang.instructions.h.h4}<br>
                            <input class="instruction_txt" type="checkbox" idx="3" name="prompt1" value="false"> ${lang.instructions.h.h5}<br>
                        </div><br>
                        
                        <div class="instruction_txt"> ${lang.instructions.h.h6} </div><br>
                        
                        <div class="checkbox_group">
                            <input class="instruction_txt" type="checkbox" idx="1" name="prompt2" value="false"> ${lang.instructions.h.h7} <br>
                            <input class="instruction_txt" type="checkbox" idx="2" name="prompt2" value="true"> ${lang.instructions.h.h8} <br>
                            <input class="instruction_txt" type="checkbox" idx="3" name="prompt2" value="false"> ${lang.instructions.h.h9} <br>
                        </div><br>
                    </div>
                </div>
            </div>
            `;
            break;
        case "CHECK_B":
            if (CANVAS_MODE==="linedot"){
                lang.instructions.i = lang.instructions.i2;
            }
            content_text = 
            `
            <div id="draw_instructions_object">
                <div id="instructions_div">
                    <div id="instructions_check_container">
                        <div class="instruction_title"> ${lang.instructions.i.i1} </div><br>

                        <div class="instruction_txt"> ${lang.instructions.i.i2} </div><br>
                        
                        <div class="checkbox_group">
                            <input class="instruction_txt" type="checkbox" idx="1" name="prompt1" value="true"> ${lang.instructions.i.i3} <br>
                            <input class="instruction_txt" type="checkbox" idx="2" name="prompt1" value="false"> ${lang.instructions.i.i4} <br>
                            <input class="instruction_txt" type="checkbox" idx="3" name="prompt1" value="false"> ${lang.instructions.i.i5} <br>
                        </div><br>

                        <div class="instruction_txt"> ${lang.instructions.i.i6} </div><br>
                        
                        <div class="checkbox_group">
                            <input class="instruction_txt" type="checkbox" idx="1" name="prompt2" value="false"> ${lang.instructions.i.i7} <br>
                            <input class="instruction_txt" type="checkbox" idx="2" name="prompt2" value="false"> ${lang.instructions.i.i8} <br>
                            <input class="instruction_txt" type="checkbox" idx="3" name="prompt2" value="false"> ${lang.instructions.i.i9} <br>
                            <input class="instruction_txt" type="checkbox" idx="4" name="prompt2" value="false"> ${lang.instructions.i.i10} <br>
                            <input class="instruction_txt" type="checkbox" idx="5" name="prompt2" value="true"> ${lang.instructions.i.i11} <br>
                        </div><br>
                    </div>
                </div>
            </div>
            `;
            break;
        default:
            break;
    };
    return content_text.format(feedback_text,action_text,actions_text,"<b>"+MAX_TRIALS+"</b>","<b>"+MAX_TMSTPS+"</b>",
    action_cap_text,feedback_cap_text,LINEDOT_MIN_POINTS,(DRAWING_TIME_DELAY/1000),
    (MAX_TIME_BEFORE_ACTION));
}

function drawInstructions(promptCode,timeBeforeShowConfirmButton,hide_the_rest = true,showTimer=false){
    return new Promise((resolve, reject) =>{
        window.saveManager.saveEvent("INS","requested_instruction_" +promptCode);
        let end_check_if_success = false;
        let t0 = Date.now();
        
        let prompt_for_switch = promptCode;
        
        let potentialTimeout = null; 
        let killtimeout = function(){
            try{
                clearTimeout(potentialTimeout);
            } catch(e){
                // Ignore
            };
        };
        

        let isACheck = promptCode.includes("CHECK");
        let isAInstruction = promptCode.includes("INSTRUCTIONS");
        
        removeInstructions(true); // remove the instructions if they were drawn before
        if (hide_the_rest){
            $('body').find('*').hide() ;
        };
        
        $("body").append(getInstructionsContent(prompt_for_switch));
        
        let onEnd = (()=>{});
        // Special elements
        switch (prompt_for_switch){
            case "INSTRUCTIONS_3":// ACTION SCREEN INFORMATIONS
                if (CANVAS_MODE==="linedot"){
                    $("#draw_instructions_object").append(
                    `
                    <div id="action_explainer">
                        <img id="action_explainer_img" src="resources/pin_example.png" alt="Action point" />
                    </div>
                    `
                    );
                } else {
                    // Action video
                    $("#draw_instructions_object").append(
                    `
                    <div id="video_container" style="position:absolute;top:5%;left:10%;">
                        <video id="autoplay" style="aspect-ratio : 1/1 ;width:45%;" loop muted playsinline controls>
                            <source id="videosource" type="video/mp4">
                        </video>
                    </div>
                    `
                    );
                    let videosource_obj = document.getElementById("videosource");
                    let video_obj = document.getElementById("autoplay");
                    
                    videosource_obj.setAttribute("src","resources/canvas_example_squared.mp4");
                    video_obj.addEventListener('loadeddata', function() {
                        // Video is loaded and can be played
                        video_obj.play();
                    }, false); 
                }
                
                break;
            case "INSTRUCTIONS_4":
                window.drawCanvasOnly(45,35,"#draw_instructions_object");
                break;
            case "INSTRUCTIONS_5":    // GAUGE INFORMATIONS
                // Gauge            
                // $("#redrectprompt").click(()=>{
                //     window.redFlash(undefined,"#draw_instructions_object");
                // });
                $("span[flash='red']").click(()=>{
                    window.redFlash(undefined,"#draw_instructions_object");
                });
                $("span[flash='green']").click(()=>{
                    window.greenFlash(undefined,"#draw_instructions_object");
                });

                window.drawGaugeOnly(55,75,"#draw_instructions_object")
                    .then(()=>{window.gauge_anim.startRecording()});
                onEnd = (()=>{window.gauge_anim.killGauge()});
                break; 
            case "INSTRUCTIONS_6": // PROMPTS         
                let gaugePromptAnimation = function(reload=false){
                    try{
                        $("#promptButtonsContainer").remove();
                    }catch(e){
                        //Bruh
                    }
                    window.gauge_anim.resumeAnim();
                    if(reload){
                        window.gauge_anim.setGaugeToZero();
                    }
                    window.gauge_anim.updateGaugeLevel(Math.random());
                    potentialTimeout = window.setTimeout(()=>{
                        window.gauge_anim.pauseAnim();
                        window.winDrawPromptButtons([15,45,75],70,20,"#draw_instructions_object")
                            .then(()=>{
                                $(".promptButton").click(()=>{gaugePromptAnimation();return;})
                            });
                    },1500);
                }

                window.drawGaugeOnly(45,75,"#draw_instructions_object")
                    .then(()=>{
                        gaugePromptAnimation(true);
                        window.gauge_anim.startRecording();
                    });
                    onEnd = (()=>{window.gauge_anim.killGauge()});                
                break;      
            case "INSTRUCTIONS_7": // GRAPHS
                subj_has_seen_all_instr = true;
                break;
            case "CHECK_B":
                end_check_if_success  = true;
                break;
            default:
                break;
        };

        
        // Checkbox mechanics
        if (isACheck){
            // Then we add the ckeckbox script to ensure only one choice possible
            $("input:checkbox").on('click', function() {
                // in the handler, 'this' refers to the box clicked on
                var $box = $(this);
                var $siblings = $box.siblings();
        
                $box.prop('checked', true);
                $siblings.prop('checked', false);
            });
        }

        function getCheckboxResponse(){
            let prompt1_true = ($("input[type='checkbox'][name='prompt1']:checked").val()=="true");
            let prompt2_true = ($("input[type='checkbox'][name='prompt2']:checked").val()=="true");
            let prompt1_idx = $("input[type='checkbox'][name='prompt1']:checked").attr("idx");
            let prompt2_idx = $("input[type='checkbox'][name='prompt2']:checked").attr("idx");
            console.log(prompt1_idx,prompt2_idx)
            return [(prompt1_true&&prompt2_true),prompt1_true,prompt2_true,prompt1_idx,prompt2_idx];
        }
        
        function introduce_confirm_button(isACheckVar,isAInstructionVar){
            if (isACheckVar){
                $("#draw_instructions_object").append(
                `                      
                <div id="submit_qcm_button" class="clickme">
                    <div id="submit_qcm_text">
                        ${lang.instructions.navigate.confirm_answers}
                    </div>
                </div>
                `
                );
                $("#submit_qcm_button").css("visibility", "hidden");
            } else if (isAInstructionVar) {
                let index = Number(promptCode.split("_")[1]);
                // This is an instruction page : 
                // Show the next button or the confrim read button ?
                let smol_inst = `<div style="font-size:50%;">
                    ${lang.instructions.navigate.instructions} 
                </div>`
                $("#draw_instructions_object").append(
                `
                <div id="confirm_read_container" class="clickme"> 
                    <span id="previous" class="navigate_instr">
                        <div>
                            <b>${lang.instructions.navigate.previous}</b>
                        </div>
                    </span>
                    <span id="next" class="navigate_instr">
                        <div>
                            <b>${lang.instructions.navigate.next} </b>
                        </div>
                    </span>
                    <span id="confirm_read_instructions" class="navigate_instr"> 
                        ${lang.instructions.navigate.read_and_understood} 
                    </span>
                </div>
                `.format(smol_inst)
                );
                
                if (index==0){
                    // Make previous invisible
                    $("#previous").css("visibility", "hidden");
                }
                if (index==7){
                    // Make next invisible
                    $("#next").css("visibility", "hidden");
                }
                $("#confirm_read_instructions").css("visibility", "hidden");

                // INSTRUCTIONS HANDLER
                
                $("#next").click(()=>{
                    window.spent_time_reading += (Date.now()-t0);
                    onEnd();
                    killtimeout();
                    drawInstructions("INSTRUCTIONS_"+(index+1),timeBeforeShowConfirmButton,true,true).then(()=>{
                        resolve();
                    })
                });
                $("#previous").click(()=>{
                    window.spent_time_reading += (Date.now()-t0);
                    onEnd();
                    killtimeout();
                    drawInstructions("INSTRUCTIONS_"+(index-1),timeBeforeShowConfirmButton,true,true).then(()=>{
                        resolve();
                    })
                });
            } else {
                console.log("No confirm button")
            }   
        }
        
        function showConfirmButton(isACheckVar,isAInstructionVar){
            if (isACheckVar){
                // CHECK HANDLER
                $("#submit_qcm_button").click(()=>{
                    console.log("Submit answers :")
                    // console.log($("input[type='checkbox'][name='prompt1']:checked"));
                    let ckbx_resps = getCheckboxResponse();
                    let Goodanswer = ckbx_resps[0];
                    if (Goodanswer){
                        console.log("You read well ! Congrats !");
                        window.saveManager.saveEvent("INS","prompt_success_at_" +promptCode);
                        onEnd();
                        console.log("I was here")
                        resolve();
                        // if (end_check_if_success) {
                        //     after_check_success(()=>{
                        //         onEnd();
                        //         resolve();
                        //     });
                        // } else {
                        //     onEnd();
                        //     resolve();
                        // }
                    } else {
                        console.log("Boooh ! Read again you sly dog >:(");
                        let code_1 = ckbx_resps[1] ? "T" : "F"+ckbx_resps[3];
                        let code_2 = ckbx_resps[2] ? "T" : "F"+ckbx_resps[4];
                        window.saveManager.saveEvent("INS","prompt_failed_at_" +promptCode + "_" + code_1+"."+code_2);
                        onEnd();
                        reject();
                    }
                });
                $("#submit_qcm_button").css("visibility", "visible");

            } else if (isAInstructionVar){

                $("#confirm_read_instructions").click(()=>{
                    console.log("Launch check");
                    removeInstructions();
                    onEnd();
                    resolve();
                    killtimeout();
                });


                if (subj_has_seen_all_instr){
                    $("#confirm_read_instructions").css("visibility", "visible");
                } else {
                    $("#confirm_read_instructions").css("visibility", "hidden");
                }
            } else {
                console.log("No confirm button needed.")
            }
        }

        introduce_confirm_button(isACheck,isAInstruction);
        
        let timer = window.generalTimerObject;
        let timerTop = 90;
        let timerLeft = 5;
        let timerSize = 15;
        if (isACheck||isAInstruction){
            let remaining_timer = Math.max(0,(timeBeforeShowConfirmButton-window.spent_time_reading/1000));
            if (remaining_timer>-1){
                if (remaining_timer>0.01) {
                    remaining_timer = remaining_timer + 1
                }
                timer.instantiateTimer(Math.floor(remaining_timer),()=>{showConfirmButton(isACheck,isAInstruction);},undefined,
                "#draw_instructions_object",timerSize,timerTop,timerLeft, // Size OR position parameters
                false,false,showTimer);
            }else {
                showConfirmButton(isACheck,isAInstruction);
            }
        } else {
            console.log("Timer for canvas try")
            timer.instantiateTimer(timeBeforeShowConfirmButton,()=>{window.saveManager.saveEvent("INS","end_"+promptCode);onEnd();resolve();},undefined,
            "#draw_instructions_object",timerSize,timerTop,timerLeft, // Size OR position parameters
            false,false,showTimer);
        }
    });
}

function checkParticipantComprehensionPageX(page_str){
    return new Promise((resolve,reject)=>{
        if (CHECK_OPTION) {
            // return drawInstructions("CHECK_A",CHECK_MIN_TIME);
            drawInstructions("CHECK_"+page_str,CHECK_MIN_TIME).then(
                ()=>{resolve();},
                ()=>{reject();}
            );
        } else {
            resolve();
        }
    });
}

function checkParticipantComprehension(){
    return new Promise((resolve,reject)=>{
        window.current_task_step_id = 2 ;  // We are answering a check

        checkParticipantComprehensionPageX("A")
            .then(()=>{
                    return checkParticipantComprehensionPageX("B");
                },(err)=>{
                    return Promise.reject(err)
                }).then(()=>{
                        console.log("Noice, you did it !")
                        resolve();
                    },(err)=>{
                        console.log(err);
                        reject();
                });
    });
};
window.directToComprehensionCheck = checkParticipantComprehension

function one_instruction_essai(instructions_delay,skip_check=false){
    return new Promise((resolve, reject)=>{
        subj_has_seen_all_instr = false;
        window.spent_time_reading = 0;
        
        window.current_task_step_id = 1 ; // We are reading the instructions
        console.log(window.current_task_step_id);
        

        drawInstructions("INSTRUCTIONS_0",instructions_delay,true,true) // Draw all the instructions
            .then(()=>{
                if (skip_check){
                    return Promise.resolve();
                } else{
                    return checkParticipantComprehension();
                };
            })   // When done, check the participant comprehensions
            .then(()=>{resolve();},()=>{reject();})

        // drawInstructions("INSTRUCTIONS_0",instructions_delay,true,true) // Draw all the instructions
        //     .then(()=>{return checkParticipantComprehension();})   // When done, check the participant comprehensions
        //     .then(()=>{resolve();},()=>{reject();})
    });
}

function old_one_instruction_essai(instructions_delay){
    return new Promise((resolve, reject)=>{
        subj_has_seen_all_instr = false;
        window.spent_time_reading = 0;
        let checkpromise = null;
        
        let chainError = function(err) {
            return Promise.reject(err)
        }; // If any rejection during the following promise chain, reject immediately
        drawInstructions("INSTRUCTIONS_0",instructions_delay,true,true)
            .then(()=>{
                if (CHECK_OPTION) {
                    // return drawInstructions("CHECK_A",CHECK_MIN_TIME);
                    checkpromise = drawInstructions("CHECK_A",CHECK_MIN_TIME);
                    // console.log(checkpromise);
                    return checkpromise
                } else {
                    return Promise.resolve();
                }})
            .then(()=>{
                if (CHECK_OPTION) {
                    // console.log("Drawing check B");
                    return drawInstructions("CHECK_B",CHECK_MIN_TIME);
                } else {
                    return Promise.resolve();
                }},chainError) // If check A failed, let's reject the 
            .then(
                ()=>{resolve();},
                (err)=>{console.log("-------------" + err +"--------");reject();}
            );
    });
}

function instructionsReadAndCheck(instructions_delay_var,skip_check=false){
    return new Promise((resolve, reject)=>{
        window.saveManager.saveEvent("INS","start_instructions");
        
        let perform_essai=function(){
            one_instruction_essai(instructions_delay_var,skip_check)
                .then(()=>{  // If the whole instruction pipeline succeeded
                            window.saveManager.saveEvent("INS","end_instructions");
                            resolve();
                    },()=>{
                            console.log("REJECTED >:(")
                            instructions_delay_var=Math.round(instructions_delay_var*1.25);
                            // jump_to_check = false; // After a failed check, the subject will go to instructions anyways
                            reload_instructions(perform_essai);
                    })
        };
        perform_essai();
    })
}

function reload_instructions(afterTimer=(()=>{})){
    removeInstructions();
    $('body').find('*').hide() ;
    let timer = window.generalTimerObject;
    window.saveManager.saveEvent("WAI","start_rereadinstr");
    timer.instantiateTimer(5,()=>{window.saveManager.saveEvent("WAI","end_rereadinstr");$('body').find('*').show() ;afterTimer();},undefined,
                            undefined,70,50,50, // Size OR position parameters
                            false,true,true);
    $("#timer-general").append(
    `
    <div id="transition"> 
        ${lang.transitions.failed_check}
    </div>
    `
    );
}

function prepareForTaskTimer(afterTimer=(()=>{})){
    // Remove all the instructions from the subject screen
    // Then, create a timer of 10 seconds, and then let the subject start the task
    removeInstructions();
    $('body').find('*').hide() ;
    
    let timer = window.generalTimerObject;
    window.saveManager.saveEvent("WAI","start_proceedtomaintask");
    timer.instantiateTimer(10,()=>{console.log("Lessgow");window.saveManager.saveEvent("WAI","end_proceedtomaintask");$('body').find('*').show() ;afterTimer();},undefined,
                            undefined,70,50,50, // Size OR position parameters
                            false,true,true);
    $("#timer-general").append(
    `
    <div id="transition">  
        ${lang.transitions.prep_for_task}  
    </div>
    `
    );
}

window.sendInstructions = function(skip_check=false){
    instructionsReadAndCheck(INITIAL_INSTR_MIN_TIME,skip_check)
        .then(()=>{
            console.log("Instruction & check step over !")
            prepareForTaskTimer((()=>{
                window.drawFullTrialView();
            }));
        });
};