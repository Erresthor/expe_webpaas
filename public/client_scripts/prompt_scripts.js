
window.manage_prompts = function(true_value){
    window.gauge_anim.pauseAnim();
    let promptPromise = window.winDrawPromptButtons()
            .then((prompt_symbols_list)=>{
                return new Promise((resolve, reject)=>{
                    // console.log(prompt_symbols_list[0].parentNode);
                    // console.log(prompt_symbols_list[1].parentNode);
                    // console.log(prompt_symbols_list[2].parentNode);
                    // console.log(prompt_symbols_list);
                    
                    prompt_symbols_list[0].parentNode.addEventListener("click", ()=>{resolve("up");});
                    prompt_symbols_list[1].parentNode.addEventListener("click", ()=>{resolve("same");});
                    prompt_symbols_list[2].parentNode.addEventListener("click", ()=>{resolve("down");});
                });
            })
            .then((subj_answ)=>{
                console.log("You just clicked " + subj_answ);
                return new Promise((resolve, reject)=>{
                    window.erasePromptButtons();
                    window.gauge_anim.resumeAnim();
                    resolve([(subj_answ==true_value),subj_answ]);
                });
            });
    return promptPromise
}
