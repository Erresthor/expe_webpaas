// DEBUG / TEST MODE
window.CAN_SKIP_STEPS = false; 
window.SHOW_REMARK_PAGE = true;

// GENERAL PARAMETERS: 
window.MAX_TRIALS = 15;
window.MAX_TMSTPS = 10;
window.CHART_VISUALIZATION_TIME= 3000; // ms
window.CHART_BASED_ON_FEEDBACK_LEVELS = false;
window.SHOW_GRAPH_EVERY = 5;
    // Are there keyboard shortcuts available to skip instructions / task / etc  ? 
    // Useful for debug
window.INTER_TRIAL_SCREEN_DURATION = 2.0; 
    // Timer between trials duration

// GAUGE PARAMETERS:
window.FRAME_VAL = 30;
window.PERLIN_FREQ = 30;
window.PERLIN_INT =  0.2 ; // 0.0 ;

// INSTRUCTIONS PARAMETERS:
window.CHECK_OPTION = true ;
window.INITIAL_INSTR_MIN_TIME = 3;
window.CHECK_MIN_TIME = 1;
// window.CANVAS_TRY_TIME = 30;

// CANVAS OPTIONS
window.CANVAS_MODE= "linedot"
window.LINEDOT_NEEDS_TIMER = true;
window.MAX_TIME_BEFORE_ACTION = 10;
window.CANVAS_POINT_MIN_DIST = 7.5;
window.AFTER_INPUT_DELAY = 1000;
window.DRAWING_TIME_DELAY = 5000;
window.LINEDOT_MIN_POINTS = 2;
window.LINEDOT_MAX_POINTS = 2;

// FLASHES : 
window.FLASH_DURATION = 1000;

// Grid navigation thing
window.GRID_X = 7;
window.GRID_Y = 7;
window.GRID_MAX_DIST = Math.sqrt(GRID_X*GRID_X + GRID_Y*GRID_Y);
window.STARTING_POSITIONS = [[5,1],[5,2],[4,1]];
window.OBSTACLES = [] ;
window.END_POSITIONS = [[0,6]];

// PROMPTS OPTIONS
window.PROMPT_MIN_INTERTIME = 4; // minimum number of trials between prompts
window.PROMPT_PROB = 0.25;

// Time left for subjects to go back to fullscreen if they left
// window.ON_FAIL_RETURN_TASK_ADDRESS = "https://youtu.be/BgwsvPiD6YM?t=11s"
window.ON_FAIL_RETURN_TASK_ADDRESS = "/"
window.TIME_LIMIT = 20;
const WARNING_THRESHOLD = 7;
const ALERT_THRESHOLD = 3;
window.COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};