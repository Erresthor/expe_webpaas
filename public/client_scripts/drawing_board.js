//SOURCE : https://dev.to/0shuvo0/lets-create-a-drawing-app-with-js-4ej3

// The canvas is a fixed object initialized only once
// It is listening to inputs on itself and 

import regression from "./regression.js";

// IF FIXED SIZED CANVAS : 
const fixed_size_canvas_bool = true;
const fixed_canvas_width = 750;
const fixed_canvas_height = 750;

window.since_last_prompt = 0;

var dist = function(arr1,arr2){
  return Math.sqrt((arr1[0]-arr2[0])*(arr1[0]-arr2[0])+(arr1[1]-arr2[1])*(arr1[1]-arr2[1]))
}

var distAreSpacedEnough = function(array){
  let n = array.length;
  for (let i = 1; i < n;i++){
    if (dist(array[0],array[i]) > CANVAS_POINT_MIN_DIST){
      return true ;
    }
  }
  return false;
}

// MONITOR MOUSE CLICK STATE
var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

// FUNCTIONS TO TRANSLATE SUBJECT POINTS INPUT TO GRID ACTIONS
function getMousePos(canvas_obj, evt) {
  var rect = canvas_obj.getBoundingClientRect(), 
  scaleX = canvas_obj.width / rect.width, 
  scaleY = canvas_obj.height / rect.height;

return {
  x: (evt.clientX - rect.left) * scaleX,
  y: (evt.clientY - rect.top) * scaleY
}
}

function angleToDirection(angle){
  let pion8 = Math.PI/8 ;
  if (angle <= pion8 && angle >= -pion8) {
      return "right" ;
  } else if (angle <= 3*pion8 && angle >= pion8) {
      return "up-right" ;
  } else if (angle <= 5*pion8 && angle >= 3*pion8) {
      return "up" ;
  } else if (angle <= 7*pion8 && angle >= 5*pion8) {
      return "up-left";
  } else if (angle <= -pion8 && angle >= -3*pion8) {
      return "down-right";
  } else if (angle <= -3*pion8 && angle >= -5*pion8) {
      return "down";
  } else if (angle <= -5*pion8 && angle >= -7*pion8) {
      return "down-left";
  } else if (angle <= -7*pion8 || angle >= 7*pion8) {
      return "left";
  } else {
      return "bruh";
  }
}

function regressionPoints(points_array, draw_arrow_bool=false){
  let xy = points_array.map(function(value,index) {return [value[0],value[1]];})
  let tx = points_array.map(function(value,index) {return [value[2],value[0]];})
  let ty = points_array.map(function(value,index) {return [value[2],value[1]];})
  let results = [regression.linear(xy).equation[0],regression.linear(tx).equation[0],regression.linear(ty).equation[0]];

  let resulting_angle = getAngle(results);
  let res_angle_deg = resulting_angle*360/(2*Math.PI);
  // console.log("Linear regression infered that subject input the angle " + res_angle_deg + " ----> " + angleToDirection(resulting_angle));
  if (draw_arrow_bool) {
    let ray = height/4.0
    let middle_of_canvas_x =height/2;
    let middle_of_canvas_y =width/2;
    
    let fromxx = middle_of_canvas_x + ray*Math.cos(resulting_angle - Math.PI);
    let toxx = middle_of_canvas_x + ray*Math.cos(resulting_angle);

    let fromyy = middle_of_canvas_y + ray*Math.sin(resulting_angle - Math.PI);
    let toyy = middle_of_canvas_y + ray*Math.sin(resulting_angle);

    canvas_arrow(ctx,fromxx,width-fromyy,toxx,width-toyy); // Invert y axis due to canvas coordinates system
    ctx.stroke()
  }
  return resulting_angle;
}

function getAngle(slopes){
  let [slopexy,slopetx,slopety] = slopes;
  let subj_line_rad = Math.atan(slopexy);
  if (slopetx<0){
    if(slopety>0){
      subj_line_rad += Math.PI;
    }else{
      subj_line_rad -= Math.PI;
    }
  }
  return -subj_line_rad;
}


const points_input_complete_event = new Event("points_received");

var drawing_board = {
  canvas_element : null,
  last_action_start_t : 0,
  context : null,
  trial_point_data : [],
  start_draw_time : null,
  linked_backend_grid : null,

  subject_wants_to_draw : false,
  actual_drawing_started : false,
  drawing_time_over : false,
  
  prevX : null,
  prevY : null,

  onMouseUp : null,
  onMouseMove : null,
  onPointsSaved : null,

  connected_canvas : true,

  pb_max_width : null,
  pb_fill : null,
  pb_interval_id : null,

  initializeDrawingBoard:function(grid_pointer,connect_canvs = true) {
    let dboardloc= this;
    this.connected_canvas = connect_canvs;
    this.cleanDrawingBoard(); // In case it has been initialized before
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = true;
    this.linked_backend_grid = grid_pointer;

    // IF FIXED SIZED CANVAS : 
    if (fixed_size_canvas_bool){
      this.canvas.height = fixed_canvas_height;
      this.canvas.width = fixed_canvas_width;
    }

    // THE PROGRESS BAR
    let svg_obj = document.getElementById("canvas_timer_svg");
    let content_doc = svg_obj.contentDocument;
    let pb_bckg = content_doc.getElementById("progress_bar_background");
    // console.log(pb_bckg)
    this.pb_max_width = pb_bckg.width.baseVal.value;
    this.pb_fill = content_doc.getElementById("progress_bar_fill");
    this.pb_fill.width.baseVal.value = 0;
    // EVENT LISTENERS THAT MAKE THE CANVAS INTERACTIVE
    
    // Set draw to true when mouse is pressed
    // The subject has DRAWING_TIME_DELAY ms to draw before the 
    // canvas is turned off
    dboardloc.onMouseDown = function(event){
      dboardloc.subject_wants_to_draw = true ;
      if (!dboardloc.actual_drawing_started){
        try {
          window.hurry_up_timer.pauseTimer();
        } catch (e){
          console.log("No hurry_up_timer -- canvas try ?");
        }

        window.timestepTracker.act_start = Date.now();
        dboardloc.last_action_start_t = Date.now();
        dboardloc.actual_drawing_started = true;

        // SETTING UP PROGRESS BAR
        dboardloc.start_draw_time = Date.now();
        
        dboardloc.pb_interval_id = setInterval(()=>{
          let progress = (Date.now() - dboardloc.start_draw_time)/DRAWING_TIME_DELAY
          let newValue = Math.floor(dboardloc.pb_max_width*progress);
          dboardloc.pb_fill.width.baseVal.value = newValue;
          if (progress >= 1){
            
            window.timestepTracker.act_end = Date.now();

            window.clearInterval(dboardloc.pb_interval_id);
            dboardloc.turnOffCanvas();
            dboardloc.pb_fill.width.baseVal.value = 0;
          }
        },10);
        // setTimeout(()=>{dboardloc.turnOffCanvas();}, DRAWING_TIME_DELAY);
      }

      if (!dboardloc.drawing_time_over){
        let canvasMousePos = getMousePos(dboardloc.canvas, event);
        dboardloc.trial_point_data.push([canvasMousePos.x,canvasMousePos.y,Date.now()-dboardloc.start_draw_time,1]);
      }
    };

    // Set draw to true when mouse is stops pressing
    dboardloc.onMouseUp = function(event){
      dboardloc.subject_wants_to_draw = false;

      if (dboardloc.drawing_time_over){
        return;
      }
    
      if (!dboardloc.actual_drawing_started){
        return;
      }

      let canvasMousePos = getMousePos(dboardloc.canvas, event);
      dboardloc.trial_point_data.push([canvasMousePos.x,canvasMousePos.y,Date.now()-dboardloc.start_draw_time,0]);
    };

    // When the mouse is pressed over the canvas,
    // Update the point coordinates & draw the resulting line
    // Then save the points
    dboardloc.onMouseMove = function(event){
      let canvasMousePos = getMousePos(dboardloc.canvas, event);
      
      if (dboardloc.drawing_time_over){
        return;
      }
    
      if((dboardloc.prevX == null || dboardloc.prevY == null || !dboardloc.subject_wants_to_draw)){
        // Set the previous mouse positions to the current mouse positions
        dboardloc.prevX = canvasMousePos.x
        dboardloc.prevY = canvasMousePos.y
        return
      } 
    
      if (!dboardloc.actual_drawing_started){
        return;
      }
    
      // Current mouse position
      let currentX = canvasMousePos.x
      let currentY = canvasMousePos.y
    
      // Drawing a line from the previous mouse position to the current mouse position
      dboardloc.context.lineWidth = 5;
      dboardloc.context.strokeStyle = '#000000';
      dboardloc.context.beginPath()
      dboardloc.context.moveTo(dboardloc.prevX, dboardloc.prevY)
      dboardloc.context.lineTo(currentX, currentY)
      dboardloc.context.stroke()

      // Saving the new point
      dboardloc.trial_point_data.push([canvasMousePos.x,canvasMousePos.y, Date.now()-dboardloc.start_draw_time,2]);
    
      // Update previous mouse position
      dboardloc.prevX = currentX
      dboardloc.prevY = currentY
    };

    // When the points are saved,
    // Update the point coordinates & draw the resulting line
    // Then save the points
    dboardloc.onPointsSaved = function(event){
      // ONLY WHEN points & feedback is saved do we change their values !
      dboardloc.afterInput(dboardloc.trial_point_data);
      dboardloc.clearSavedPoints();
    };

    this.canvas.addEventListener("mousedown", dboardloc.onMouseDown);

    window.addEventListener("mouseup",dboardloc.onMouseUp);
    
    this.canvas.addEventListener("mousemove", dboardloc.onMouseMove);

    window.addEventListener("points_saved", dboardloc.onPointsSaved);
  },

  cleanDrawingBoard: function(){
    // Manually clear event listeners:
    let dboardloc = this;
    window.removeEventListener("mouseup",dboardloc.onMouseUp);
    window.removeEventListener("points_saved", dboardloc.onPointsSaved);
    try {
      dboardloc.canvas.removeEventListener("mousedown", dboardloc.onMouseDown);
      
      dboardloc.canvas.removeEventListener("mousemove", dboardloc.onMouseMove);
    }catch (e){
      // console.log("Removing events from undefined.")
    }
  },

  draw_canvas_arrow : function(fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    this.context.moveTo(fromx, fromy);
    this.context.lineTo(tox, toy);
    this.context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    this.context.moveTo(tox, toy);
    this.context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  },

  clearCanvas: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  clearSavedPoints: function() {
    this.trial_point_data = [];
  },

  turnOffCanvas:function(){
    this.clearCanvas();
    this.drawing_time_over = true;
    let myobj = this;

    let savepoints_and_proceed = function(){
      if (myobj.connected_canvas){
        window.canvasPointData = myobj.trial_point_data;
        window.dispatchEvent(points_input_complete_event);
      }else{
        window.saveManager.add_new_set_of_explore_canvas_points(myobj.last_action_start_t,myobj.trial_point_data);
        window.dispatchEvent(new Event("points_saved"));
      }
    }

    window.retry_until_unpaused(savepoints_and_proceed);
  },
  
  afterInput:function(){
    let temporary_points_only = this.trial_point_data.filter(pointData=>{return(pointData[3]!=0);})

    // 1 : draw the saved data points
    for (const point of temporary_points_only){
        // console.log(point);
        this.context.beginPath();
        this.context.arc(point[0], point[1], 10, 0, 2*Math.PI);
        this.context.strokeStyle = '#00FF00';
        this.context.stroke();
        this.context.fillStyle = '#827e7ec5';
        this.context.fill();
    }

    //1.5 : If the canvas isnt connected to any backend, just reset it after some time
    if (!this.connected_canvas){
      setTimeout(()=>{this.resetCanvas();},AFTER_INPUT_DELAY);
      return;
    }

    // Else, get the effect of the input point to the  backend : 
    // 2 : calculate the new position of the character
    let prev_dist = this.linked_backend_grid.linearDistanceToGoal();
    let next_dir = null;
    let stayed_the_same_flag = false;
    console.log(this.trial_point_data.length + " points detected");

    

    if ((temporary_points_only <= 1)||(!distAreSpacedEnough(temporary_points_only))){
      // this.linked_backend_grid.moveCharacter('same'); // If the subject just clicked, the character does not move
      stayed_the_same_flag = true;
      next_dir = 'same'
    } else {
      // console.log(regression);
      let res_angle = regressionPoints(temporary_points_only);
      next_dir = angleToDirection(res_angle);
    }
    console.log("You did the following action : " + next_dir);

    window.timestepTracker.infered_action = next_dir;

    this.linked_backend_grid.moveCharacter(next_dir);

    // 2.5 possible prompts :
    // window.winDrawPromptButtons();
    let tempDrawingBoard = this;
    

    // Choose if this timestep will be prompted
    let prompt_now_bool = function(){
      if ((since_last_prompt >= PROMPT_MIN_INTERTIME) && (Math.random() > (1-PROMPT_PROB))) {
        since_last_prompt = 0;
        return true;
      }
      since_last_prompt = since_last_prompt + 1;
      return false;
    }
    let prompt_tmstp = prompt_now_bool();
    
    let on_prompt_request = function(prompt_request){
      return new Promise((resolve, reject) =>{
        if (prompt_request){
          console.log("Showing prompt");
          let raw_promptshowtime_var = Date.now()
          let new_dist = tempDrawingBoard.linked_backend_grid.linearDistanceToGoal();
          let true_value = null;
          if (prev_dist < new_dist){
            true_value = "down";
          } else if (prev_dist > new_dist){
            true_value = "up";
          } else {
            true_value = "same";
          }

          window.manage_prompts(true_value)
            .then((subj_resps)=>{
              let raw_promptanwsertime_var = Date.now()
              window.prompt_tracker = {
                prompt_showtime : raw_promptshowtime_var,
                prompt_clicktime : raw_promptanwsertime_var,
                true_val : true_value,
                subj_pred : subj_resps[1],
                prompt_correct : subj_resps[0]
              }
              if (subj_resps[0]){
                // The subject answered correctly
                console.log("Correct prompt :D   --> " + subj_resps[1]);
              } else {
                // The subject did not answer correctly
                console.log("Incorrect prompt >:( --> "+ subj_resps[1] + " instead of  --> " + true_value);
              }
              resolve();
            });
        } else {
          window.prompt_tracker = null;
          resolve();
        }
      });
    }

    on_prompt_request(prompt_tmstp).then(()=>{
      // Console : show the current state of the grid
      this.linked_backend_grid.showGrid();

      // 3 : reset the canvas after some time
      setTimeout(()=>{this.resetCanvas();},AFTER_INPUT_DELAY);
    })
  },

  resetCanvas:function(){
    // After checking if the points placeholder was empty (a.k.a were saved)
    // We reset the canvas for use in another timestep
    console.log("Attempting canvas reset")
    if (this.trial_point_data.length ===0){
      this.clearCanvas();
      this.drawing_time_over = false;
      this.actual_drawing_started = false;
      this.subject_wants_to_draw=false;
      this.prevX = null ;
      this.prevY == null ;
    } else {
      setTimeout(()=>{this.resetCanvas();},500);
    }
  }
}

// Initialize our drawing_board object on page load: 
var my_draw_board = drawing_board;

// Initialize the component on expe load
window.addEventListener("grid_ready_for_trial", onGridReady);
function onGridReady(){
  return;
}

window.InitializeDrawingboard = function(grindPointer,connect_the_canvas=true){
  my_draw_board.initializeDrawingBoard(grindPointer,connect_the_canvas);
  my_draw_board.canvas.style.visibility = "visible";
}
window.addEventListener("initialize_dboard_order", ()=>{InitializeDrawingboard(window.myBackend);});
window.addEventListener("initialize_dboard_only_order", ()=>{InitializeDrawingboard(window.myBackend,false);});