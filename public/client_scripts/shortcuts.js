window.current_task_step_id = 0 ; // 0 if welcome page, 1 for instructions, 2 for quiz, 3 for task, 4 for post task

// FOR DEBUG MODE ONLY !
window.initSkipSectionOnEnter = function(){
    $(document).keypress((e) => { 
        if (e.keyCode == 13){
            console.log("Pressed skip key !")
            switch (current_task_step_id){
                case 0:
                    // Nothing lol
                    break;
                case 1: 
                    // Manually go to the check
                    document.body.innerHTML="";
                    window.directToComprehensionCheck();
                    break;
                case 2:
                    // Manually go to the main task directly
                    document.body.innerHTML="";
                    window.drawFullTrialView();
                    break;
                case 3:
                    document.body.innerHTML="";
                    window.drawPostTaskScreen();
                    break;
                case 4:
                    if (window.SHOW_REMARK_PAGE){
                        window.drawPostTaskDesignRemarks();
                    }
                    break;
                default:
                    break;
            }
        }
    });
};

