
var elem = document.documentElement;
window.openFullscreen = function() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
  window.saveManager.saveEvent("FSC","entered_fullscreen");
};

window.closeFullscreen =function() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
};

window.addEventListener("closeFullscreen",()=>{closeFullscreen();});

window.addEventListener("openFullscreen",()=>{openFullscreen();});

window.drawWelcomePage = function(){
  let fancy_text = `<span style="font-size:50px; color:#280024; font-weight: bold ; font-family: 'Ink Free' ;"  > ${lang.homepage.title} </span>`
  // console.log(`${lang.homepage.overhead}`)
  let complete_title = (lang.homepage.overhead).format(fancy_text);
  
  $("body").append(
  `
  <div class="header_container">
      <span class="title">
          <div> ${complete_title} </div>
      </span>

      <div class="button_container" style="margin-right: 15%;">
        <a class="linkbutton" href="/">
            <span style="color:white ; font-family: fantasy;"> ${lang.homepage.go_home} </span>
        </a>
      </div>
  </div>


  <div class="main_text_container" style="position: relative;">
      <p style="margin-bottom: 1cm; margin-top: 1cm;"> 
          ${lang.homepage.welcome_message}
      </p>

      <p style="margin-bottom: 1cm; margin-top: 1cm;"> 
          ${lang.homepage.choose_lang_message}
      </p>

      <div style="display:flex;align-items:center;justify-content:center;">
        <button class="language_button" lang="en">
          <div class="language_cont">
            <img class="flag_img" src="/resources/EN_flag.png" alt="eng_lang" border="0" />
            <p> English </p>
          </div>
        </button>
        <button class="language_button" lang="fr">
          <div class="language_cont">
            <img class="flag_img" src="/resources/FR_flag.png" alt="fr_lang" border="0" />
            <p> Français </p>
          </div>
        </button>
        <button class="language_button" lang="es">
          <div class="language_cont">
            <img class="flag_img" src="/resources/ES_flag.png" alt="es_lang" border="0" />
            <p> Español </p>
          </div>
        </button>
      </div>
  </div>
  `);
  
  $(".language_button[lang='es']").remove();

  $(".language_button").click(function() {
    let language_demanded = $(this).attr('lang');
    reloadHomePageWithLang(language_demanded);
    // window.location.assign(`/fullscreen_master?lang=${d}`);
} );

  if(letTheSubjContinueAfterLang){
    $(".main_text_container").append(
    `
      <p style="margin-bottom: 1cm; margin-top: 1cm;"> 
          <b> ${lang.homepage.fullscreen_info} </b>
      </p>

      <div style="margin-right: 20%; margin-left: 20%;text-align: center;">
          <button id="launch_experiment">${lang.homepage.fullscreen_button}</button>
      </div>
      

      <p>${lang.homepage.fullscreen_error_message}</p>
      
      <p style="bottom:3px;font-size:10px; color:#9ea0a9;">${lang.homepage.problem_message}</p>
    `);

    $("#launch_experiment").click(function(){
        document.body.innerHTML="";
        openFullscreen();
        window.sendInstructions();
    });
  }
}