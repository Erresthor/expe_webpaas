// function delay(time) {
//     return new Promise(resolve => setTimeout(resolve, time));
// }

var destroyChart = function(){
    $('#chartMaster').remove();
}

var keep_trying_to_remove_hyperlink = function(current_retry=0){
    let MAX_RETRY = 10;
    if (current_retry > MAX_RETRY) {
        return;
    } else {
        if($(".canvasjs-chart-container").children('a').length===0){
            console.log("Couldn't find chart, retrying...");
            delay(250).then(()=>{keep_trying_to_remove_hyperlink(current_retry+1);});
        } else {
            $(".canvasjs-chart-container").children('a').css('font-size','0px');   
        }
    }
}


window.drawChart = function (task_scores,optionalBonusTime=0) {
    let mean_last_scores = 0 ;
    let counter = 0; 
    for (let i=task_scores.length-SHOW_GRAPH_EVERY; i<task_scores.length; i++){
        mean_last_scores = mean_last_scores + task_scores[i];
        counter = counter+1;
    }
    mean_last_scores = Math.floor(mean_last_scores/counter);
    let end_string = lang.chart.nice;
    if (mean_last_scores<30){
        end_string = lang.chart.bad;
    } else if (mean_last_scores<67){
        end_string = lang.chart.bof;
    }
    let belowChartString = `
    <div id="belowChart">
        <div id="belowChartText">
            ${lang.chart.message} <br>
            <span id="smol_message_chart">${end_string}</span>
        </div>
    </div>
    `.format("<b>"+SHOW_GRAPH_EVERY+"</b>","<b>"+mean_last_scores+"</b>");

    $("body").append('<div id="chartMaster"></div>');
    $('#chartMaster').append("<div id='chartContainer'></div>") ;
    $("#chartMaster").append(belowChartString);
    

    var datas = task_scores;
    let cnt = datas.length;
    let duration = Math.round(350*cnt);
    let dps = [];
    for (let j = 0; j < cnt; j++) {
        let pcolor = "LightSeaGreen";
        if(j>=cnt-SHOW_GRAPH_EVERY){pcolor="red";};
        dps.push({
            x: j+1,
            y: datas[j],
            color:pcolor,
            markerSize:20
        });
    };

    let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        animationDuration: duration, 
        theme: "light2",
        title :{
            text: lang.chart.title
        },
        axisY:{
            title: lang.chart.ylabel,
            minimum: 0,
            maximum: 100,
            gridColor: "lightgrey",
            interval: 25,
            gridThickness: 2
            },
        axisX:{
            title : lang.chart.xlabel,
            minimum: 0,
            maximum: MAX_TRIALS+1,
            gridColor: "lightgrey",
            interval: 5,
            gridThickness: 2   
        },
        data: [{        
            type: "line",
            toolTipContent: "<b>Trial: </b>{x}<br/><b>Score: </b>{y}%",
            dataPoints: dps
        }]
    });

    return new Promise(function(resolve,reject){
        delay(500).then(()=>{
            chart.render();
            console.log("My chart rendered ...")
        });

        keep_trying_to_remove_hyperlink();

        delay(500+duration+CHART_VISUALIZATION_TIME+optionalBonusTime).then(()=>{
            $("#belowChart").append(
            `
            <div id='leaveChartButton'> 
                ${lang.chart.leave}
            </div>
            `
            )
            $("#leaveChartButton").click(()=>{
                destroyChart();
                resolve("Chart_correctly_displayed_and_destroyed");
            })
        })
    })
}


window.pauseAndShowChart = function(task_scores,pauseFor=0){
    return new Promise((resolve,reject)=>{
        console.log("hide");
        window.hideTrialView();
        window.delay(250)
            .then(()=>{
                window.saveManager.saveEvent("CHA","chart_shown");
                return window.drawChart(task_scores,pauseFor);
            },(err)=>{
                console.log("Error when plotting chart");
                console.log(err);
            })
            .then(()=>{
                window.saveManager.saveEvent("CHA","chart_disappeared");
                window.showTrialView();
                resolve();
            },(err)=>{
                console.log("Error when plotting chart");
                console.log(err);
            });
    })
}