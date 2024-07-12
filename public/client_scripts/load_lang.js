// Let's avoid too many calls to the server ... 
// Preloading all languages and redrawing the welcome
// page on language change

// NO LONGER GETTING DATA PASSED ON THE URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
window.languageId = urlParams.get('lang');
console.log("REQUESTED LANGUAGE "+ languageId);

window.letTheSubjContinueAfterLang = false;
switch (window.languageId) {
    case 'en':
        window.lang = window.lang_en;
        break;
    case 'fr' : 
        window.lang = window.lang_fr;
        break;
    default:
        window.lang = window.lang_en;
        window.languageId = 'en';
        break;  
}
window.langstr = window.languageId; 


let newLanguageLoad = function (languageid_var){
    window.saveManager.main_save_object.languageId = languageid_var;
    window.langstr = languageid_var;
    switch(languageid_var){
        case 'en':
            window.lang = window.lang_en;
            break;
        case 'fr':
            window.lang = window.lang_fr;
            break;
        case 'es':
            window.lang = window.lang_es;
            break;
        default:    
    }
}

window.reloadHomePageWithLang = function(languageid_var){
    document.body.innerHTML="";
    newLanguageLoad(languageid_var);
    letTheSubjContinueAfterLang = true;
    console.log("Loaded, should draw welcome page ...")
    window.drawWelcomePage();
}