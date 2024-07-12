/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.getElementById("fullscreen_this");

// elem = document.documentElement ;

// elem = document.getElementById("gauge_container");

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function exitFullScreen() {
  if (
    document.fullscreenElement ||
    document["mozFullScreenElement"] ||
    document["webkitFullscreenElement"]
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document["msExitFullscreen"]) {
      document["msExitFullscreen"]();
    } else if (document["mozCancelFullScreen"]) {
      document["mozCancelFullScreen"]();
    } else if (document["webkitExitFullscreen"]) {
      document["webkitExitFullscreen"]();
    }
  }
}

window.addEventListener("fullscreen_mode", function(event){
    openFullscreen();
    // window.gauge_anim.resetOscillatorOnScreenSizeChange();
},false);

window.addEventListener("close_fullscreen_mode", function(event){
    closeFullscreen();
    // window.gauge_anim.resetOscillatorOnScreenSizeChange();
},false);

const fullscreen_button = document.getElementById("toggle_fullscreen");
var fullscreen_bool = false;

fullscreen_button.addEventListener("click", function(event){
    if (fullscreen_bool){
        fullscreen_bool = false;
        window.dispatchEvent(new Event("close_fullscreen_mode"));
        fullscreen_button.children[0].innerHTML = "FULLSCREEN";
    } else {
        fullscreen_bool = true;
        window.dispatchEvent(new Event("fullscreen_mode"));
        fullscreen_button.children[0].innerHTML = "CLOSE FULLSCREEN";
    }
},false);