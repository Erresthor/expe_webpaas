window.lang_en = {
    // Homepage : 
    homepage : {
        title : "Homepage",
        overhead : "Welcome to the {0}",
        welcome_message : "Welcome to our behavioural experiment !",
        choose_lang_message : "Please choose your prefered language :",
        fullscreen_info : "The experiment will proceed in fullscreen mode. Please click the button when you are ready to proceed :",
        fullscreen_button : "Open Fullscreen and start the experiment",
        fullscreen_error_message : "Note: If you can't go fullscreen, please check that your browser supports our experiment...",
        problem_message : "If you encounter a problem, please contact us @ <a href='mailto: annicchiarico.come@gmail.com'> (Mail) </a>"
    }, 

    instructions : {
        feedback : "feedback",
        action : "action",
        actions : "actions",
        action_cap : "Action",
        feedback_cap : "Feedback",
        navigate : {
            next : "NEXT {0}",
            previous : "PREVIOUS {0}",
            instructions : "instructions",
            read_and_understood :"I've read and understood the instructions ! ",
            confirm_answers : "Confirm my answers"
        },
        a : {
            a1 : "<b> Welcome to this experiment, here are some instructions</b>",
            a2 : "<b> Please read carefully </b>",
            a3 : "<i> (Note that to make sure you’ve understood the instructions, you'll be performing a short test before starting the experiment)</i>"
        },
        b: {
            b1 : "You will perform the same task {3} times ({3} trials), for a total duration of around 15 minutes.",
            b2 : "In this task, there is a hidden goal. To reach it, you will have to perform a series of {2} on a dedicated screen.",
            b3 : "A {0} will constantly be provided, telling you how far you are from your goal.",
            b4 : "In each trial, you will have a maximum of {4} {2}."
        },
        c: {
            c1 : "<b> This is how the task will look like</b>",
            c2 : "You will perform {2} on the grey area (on the <i>left</i> of your screen) and you will see the {0} as a gauge (on the <i>right</i> of your screen)."
        },
        d:{
            d1 : "{5}",
            d2 : "The grey screen records an action when you left-click on.",
            d3 : "If you do not act within <b> 10 </b> seconds, the action will be lost. If this happens too much, you will be disqualified.",
            d4 : "Upon clicking, you will have 1 second to complete your action."
            
        },
        d_2:{
            d1 : "{5}",
            d2 : "You can make an action by placing <b>up to</b> {7} points on the grey screen.",
            d3 : "Upon placing the first point, you will have {8} second(s) to place your remaining points if you wish.",
            d4 : "If you do not place any points within <b> {9} </b> seconds, the action will be lost. If this happens too much, you will be disqualified."
        },
        e : {
            e1 : "Your goal and the {6} gauge",
            e2 : "If you reach the hidden goal before the end of the trial, a <span class='flashprompt' id='greenrectprompt' style='color:green;'><b>green screen</b></span> will flash and the trial will be over. Congrats !",
            e3 : "Otherwise, a <span class='flashprompt' id='redrectprompt' style='color:red;'><b>red screen</b></span> will flash to indicate the end of the trial.",
            e4 : "To help you reach your goal, you are provided with a {0} : <b>the higher the gauge level, the better.</b>",
            e5 : "<i> Feel free to click on the underlined words to get a grasp of the flashes </i>",
        },
        f : {
            f1 : "<b> Prompts. </b>",
            f2 : "From time to time, <b> after an {1}</b> ,the {0} will be frozen and you will be asked to predict how your <b>last</b> {1] will change the gauge level.",
            f3 : "You will answer by clicking either the <b>up</b> , <b>down</b> or <b>equal</b> button if you believe that your {1} will make the {0} go <b>up</b> , <b>down</b> or <b>stay the same</b>."
        },
        g : {
            g1 : "<b> Final instructions. </b>",
            g2 : "You will get feedback on your overall performance so far, in the form of a graph like the one below: "
        },
        h : {
            h1 : "<b> Quick check ! (1) </b>",
            h2 : "<b> Question 1 : </b> What should you do during this task ?",
            h3 : "Save the world",
            h4 : "Make the gauge level go up",
            h5 : "Predict the next visual input",
            h6 : "<b> Question 2 : </b> How can you do that ?",
            h7 : "By clicking when you hear a sound",
            h8 : "By using the action screen",
            h9 : "By correctly answering the questions"
        },
        i : {
            i1 : "<b> Quick check ! (2) </b>",
            i2 : "<b> Question 1 : </b> What other task will you sometimes be asked to perform ?",
            i3 : "Predict how the feedback will evolve after an action",
            i4 : "Predict the size of the next visual input",
            i5 : "Press on spacebar when you hear a *bip* sound",
            i6 : "<b> Question 2 : </b> When will the action pad record your input ?",
            i7 : "When you left-click on it",
            i8 : "When you right-click on it",
            i9 : "When you hover over it",
            i10 : "When the mouse left-click is pressed over it",
            i11 : "When the mouse right-click is pressed over it"
        },
        i2 : {
            i1 : "<b> Quick check ! (2) </b>",
            i2 : "<b> Question 1 : </b> What other task will you sometimes be asked to perform ?",
            i3 : "Predict how the feedback will evolve after an action",
            i4 : "Predict the size of the next visual input",
            i5 : "Press on spacebar when you hear a *bip* sound",
            i6 : "<b> Question 2 : </b> When does the action screen record your actions ?",
            i7 : "When you draw on it",
            i8 : "When you hover over it",
            i9 : "After you place only one point on it",
            i10 : "After you place all your available points on it",
            i11 : "After you've placed at least one point on it"
        },
        j : {
            j1 : "Testing the {1} pad.",
            j2 : "Please take a few seconds to get familiar with the pad."
        }
    },

    transitions : {
        prep_for_task : "Get ready for the task ! Good luck!",
        failed_check : "Ouch, you made an error. Please read the instructions again ! ",
        action_screen_intro : "Well Done ! Now, before starting, you will have a few seconds to get familiar with the action pad."
    }, 

    infraction : {
        warning_message : "Warning ! This experiment requires you to stay on fullscreen mode. Failure to proceed will result in immediate disqualification !",
        leave_screen_counter : "You have left fullscreen {0} times",
        back_to_fs : "Back to fullscreen"
    },

    task : {
        TRIAL : "TRIAL",
        TIMESTEP : "ACTION",
        hurry : "Action skipped ! Act faster !",
        trial_won : "Trial won !",
        trial_lost : "Trial lost !"
    },

    chart : {
        xlabel : "Trials",
        ylabel : "Your score",
        title : "Your score evolution across trials",
        message : "Your average score on the last {0} trials was {1} %.",
        nice : "Well done !",
        bof : "Not bad !",
        bad : "Keep trying !",
        leave : "Continue"
    },

    final_questions : {
        title : "<b>A last question</b>",
        question1text : "According to you, on a scale of 0 to 10, how controllable was the feedback jauge ?",
        question2text : "According to you, what was the strategy that best allowed you to control the feedback ?",
        textarea_placeholder : 'Your answer here !',
        errortext : "You haven't answered the questions yet !",
        confirmbutton_text : "Confirm my answers & end the experiment"
    },

    end : {
        sending_data :  "Sending experiment data : please wait ...",
        goodbye:  "The experience is done ! Thank you for your participation.",
        data_problem : "A problem occurred while uploading to the database. A file named <b>my_experiment_data.json</b> has been downloaded to your computer. Please send it to the experimenter at: <i>come.annicchiarico@inserm.fr</i>",
        exit_experiment :"Leave the experience"
    }
}