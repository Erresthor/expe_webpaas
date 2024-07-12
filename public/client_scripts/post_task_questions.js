
window.drawPostTaskScreen = function(){
    window.current_task_step_id = 4 ; // We are answering the final prompts
    $("body").find("*").remove();
    drawTextInput();
}

window.drawPostTaskDesignRemarks = function(){
    window.current_task_step_id = 5 ; // We are answering the final prompts
    $("body").find("*").remove();
    drawDesignTextInput();
}

var drawTextInput = function(addto='body'){
    $(addto).append(`
        <div id="postquestions">
            <div class="instruction_title"> ${lang.final_questions.title} </div><br>
            <div id="question1" class="questionbox">
                <div class="postquestion"> ${lang.final_questions.question1text} </div>
                <!-- A SLIDER ELEMENT HERE -->
                <div class="feedback_control_slider_cont">
                    <div class="slider">
                        <input id="subjectcontrolperceptionslider" type="range" min="0" max="10" value="5" step="1" list="volsettings">
                        <datalist id="volsettings">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </datalist>
                    </div> 
                    <span id="controlnumberindicator">
                        5
                    </span>
                </div>
            </div>
            <div id="question2" class="questionbox">
                <div class="postquestion"> ${lang.final_questions.question2text} </div>
                <textarea class="textinput" id="answerQuestion2" 
                        rows="10"
                        cols="75"
                        placeholder=${lang.final_questions.textarea_placeholder}></textarea> 
            </div>
        </div>
        <div id="confirm_and_quit_cont" class="clickme"> 
            <div id="question_not_filled_message">
                ${lang.final_questions.errortext}
            </div>
            <div id="confirm_and_quit" class="end_task_button">
                <div>
                    <b>${lang.final_questions.confirmbutton_text}</b>
                </div>
            </div>
        </div>
    `);
    $(".textinput").attr("placeholder",lang.final_questions.textarea_placeholder);

    $("#subjectcontrolperceptionslider").on("input", function() {
            console.log("Slider value changed")
            $("#controlnumberindicator").text($(this).val())
    }).trigger("change");

    // $("#question_not_filled_message").css("visibility", "visible");
    $("#confirm_and_quit_cont").click(()=>{
        console.log("Attempting to quit the task ...");
        if (!$.trim($("#answerQuestion2").val())) {
            console.log("... but the answer was not given >:(");
            $("#question_not_filled_message").css("visibility", "visible");
        } else {
            let estimate = parseInt($("#subjectcontrolperceptionslider").val())
            let text = $("#answerQuestion2").val()
            window.saveManager.saveParticipantPostAnswers(estimate,text);
            if (window.SHOW_REMARK_PAGE){
                window.drawPostTaskDesignRemarks();
            } else {
                window.saveAndQuitGlobal();
            }
        }
    });
};

var drawDesignTextInput = function(addto='body'){
    $(addto).append(`
        <div id="postquestionsdesign">
            <div class="instruction_title"> ${lang.design_questions.title} </div><br>
            <div class="designtext">
                <div class="postquestiondesign"> ${lang.design_questions.presentation_text} </div>
            </div>
            <div id="question1" class="questionboxdesign">
                <div class="postquestiondesign"> ${lang.design_questions.question1text} </div>
                <textarea class="textinputdesign" id="answerQuestion1" 
                        rows="5"
                        cols="110"
                        placeholder=${lang.design_questions.textarea_placeholder}></textarea> 
            </div>
            <div id="question2" class="questionboxdesign">
                <div class="postquestiondesign"> ${lang.design_questions.question2text} </div>
                <textarea class="textinputdesign" id="answerQuestion2" 
                        rows="5"
                        cols="110"
                        placeholder=${lang.design_questions.textarea_placeholder}></textarea> 
            </div>
            <div id="question3" class="questionboxdesign">
                <div class="postquestiondesign"> ${lang.design_questions.question3text} </div>
                <textarea class="textinputdesign" id="answerQuestion3" 
                        rows="5"
                        cols="110"
                        placeholder=${lang.design_questions.textarea_placeholder}></textarea> 
            </div>
        </div>
        <div id="confirm_and_quit_cont" class="clickme"> 
            <div id="question_not_filled_message">
                ${lang.final_questions.errortext}
            </div>
            <div id="confirm_and_quit" class="end_task_button">
                <div>
                    <b>${lang.final_questions.confirmbutton_text}</b>
                </div>
            </div>
        </div>
    `);
    // fill_placeholder(".textinputdesign",lang.design_questions.textarea_placeholder)
    $(".textinputdesign").attr("placeholder",lang.design_questions.textarea_placeholder);

    // $("#question_not_filled_message").css("visibility", "visible");
    $("#confirm_and_quit_cont").click(()=>{
        console.log("Attempting to quit the task ...");

        let missing_answer = (!$.trim($("#answerQuestion1").val()))||(!$.trim($("#answerQuestion2").val()))||(!$.trim($("#answerQuestion3").val()))

        if (missing_answer) {
            console.log("... but the answer was not given >:(");
            $("#question_not_filled_message").css("visibility", "visible");
        } else {
            let text1 = $("#answerQuestion1").val()
            let text2 = $("#answerQuestion2").val()
            let text3 = $("#answerQuestion3").val()
            window.saveManager.saveParticipantDesignAnswers(text1,text2,text3);
            window.saveAndQuitGlobal();
        }
    });
};
