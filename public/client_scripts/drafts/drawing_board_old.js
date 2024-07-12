//SOURCE : https://dev.to/0shuvo0/lets-create-a-drawing-app-with-js-4ej3

// The canvas is a fixed object initialized only once
// It is listening to inputs on itself and 

import regression from "./regression.js";

// MONITOR MOUSE CLICK STATE
var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

// const container = document.getElementById("canvas-container");
const canvas = document.getElementById("canvas");
const width = 750;
const height = 750;
var trial_point_data = [];
var start_draw_time = Date.now();

// context of the canvas
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = true;

// resize canvas (CSS does scale it up or down)
canvas.height = height;
canvas.width = width;

canvas.style.visibility = "hidden";
const ctx = canvas.getContext("2d");
var grid = null;
const points_input_complete_event = new Event("points_received");

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

window.addEventListener("grid_ready", onGridReady);
function onGridReady(){
  grid = window.myBackend;
  console.log("Showing canvas !");
  grid.showGrid();
  canvas.style.visibility = "visible";
}


function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

// They will be null initially
let prevX = null;
let prevY = null;
ctx.lineWidth = 5;


let draw = false;
let draw_has_begun = false;
let end_draw = false;

function turnOffCanvas(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  end_draw = true;
  afterInput(trial_point_data);
  setTimeout(resetCanvas,1000);
  window.canvasPointData = trial_point_data;
  window.dispatchEvent(points_input_complete_event);
}

window.addEventListener("points_saved", function(event){
  trial_point_data = [];
},false);


function resetCanvas(){
  if (trial_point_data.length ===0){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    end_draw = false;
    draw_has_begun = false;
    if(mouseDown === 1){
      draw=false;
    }
  } else {
    setTimeout(resetCanvas,500);
  }
}

// Set draw to true when mouse is pressed
canvas.addEventListener("mousedown", (e) => {
  draw = true ;
  if (!draw_has_begun){
    draw_has_begun = true;
    setTimeout(turnOffCanvas, 1000);
  }
  if (!end_draw){
    let canvasMousePos = getMousePos(canvas, e);
    trial_point_data.push([canvasMousePos.x,canvasMousePos.y,Date.now()-start_draw_time]);
  }
})

// Set draw to false when mouse is released
window.addEventListener("mouseup", (e) => draw = false)

canvas.addEventListener("mousemove", (e) => {
  let canvasMousePos = getMousePos(canvas, e);
  
  if (end_draw){
    return;
  }

  if((prevX == null || prevY == null || !draw)){
    // Set the previous mouse positions to the current mouse positions
    prevX = canvasMousePos.x
    prevY = canvasMousePos.y
    return
  } 

  if (!draw_has_begun){
    return;
  }

  // Current mouse position
  let currentX = canvasMousePos.x
  let currentY = canvasMousePos.y

  // Drawing a line from the previous mouse position to the current mouse position
  ctx.beginPath()
  ctx.moveTo(prevX, prevY)
  ctx.lineTo(currentX, currentY)
  ctx.stroke()

  // coords.push(canvasMousePos);
  trial_point_data.push([canvasMousePos.x,canvasMousePos.y, Date.now()-start_draw_time]);

  // Update previous mouse position
  prevX = currentX
  prevY = currentY
})

function afterInput(points){
  for (const point of points){
      // console.log(point);
      ctx.beginPath();
      ctx.arc(point[0], point[1], 10, 0, 2*Math.PI);
      ctx.strokeStyle = '#00FF00';
      ctx.stroke();
      ctx.fillStyle = '#827e7ec5';
      ctx.fill();
  }

  if (points.length === 1){
    grid.moveCharacter('same'); // If the subject just clicked, the character does not move
  } else {
    // console.log(regression);
    let res_angle = regressionPoints(trial_point_data);
    let next_direction = angleToDirection(res_angle);
    grid.moveCharacter(next_direction);
  }
  grid.showGrid();
}

function regressionPoints(points_array, draw_arrow_bool=false){
  let xy = points_array.map(function(value,index) {return [value[0],value[1]];})
  let tx = points_array.map(function(value,index) {return [value[2],value[0]];})
  let ty = points_array.map(function(value,index) {return [value[2],value[1]];})
  let results = [regression.linear(xy).equation[0],regression.linear(tx).equation[0],regression.linear(ty).equation[0]];

  let resulting_angle = getAngle(results);
  let res_angle_deg = resulting_angle*360/(2*Math.PI);
  console.log("Linear regression infered that subject input the angle " + res_angle_deg + " ----> " + angleToDirection(resulting_angle));
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

