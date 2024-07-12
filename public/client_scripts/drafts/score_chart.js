var MAX_MARKER_SIZE = 30;
var GOBACKNPOINTS = 5;
var update_interval_id_scorechart = null;

window.drawChart = function(){
    $('body').append("<div id='chartContainer'></div>") ;
    var dps = []; // dataPoints

    var chart = new CanvasJS.Chart("chartContainer", {
        title :{
            text: "Dynamic Trial Data"
        },
        data: [{
            type: "scatter",
            toolTipContent: "<b>Trial: </b>{x}<br/><b>Score: </b>{y}%",
            dataPoints: dps
        }],
        axisY:{
            title: "Score",
            minimum: 0,
            maximum: 100,
            gridColor: "lightgrey",
            interval: 25,
            gridThickness: 2
            },
        axisX:{
            title : "Trials",
            minimum: 0,
            maximum: 50,
            gridColor: "lightgrey",
            interval: 5,
            gridThickness: 2   
        }
    });

    var datas = [30,24,40,55,80,60,25,89,90]; // number of dataPoints visible at any point
    
    var markerSize = 0;
    var pointOfInterest = Math.max(datas.length - GOBACKNPOINTS,0);
    var current_pt = pointOfInterest;
    
    var updateChart = function () {
        let cnt = datas.length;
        let pcolor= null;
        let mymarkerSize = 0;
        let opac = 1.0;
        for (var j = 0; j < cnt; j++) {
            if ((j>=pointOfInterest)&&(j<current_pt)){
                pcolor = "red";
                mymarkerSize = MAX_MARKER_SIZE;
                if (markerSize==0){
                    opac = 0;
                }
            } else if(j==current_pt) {
                pcolor = "red";
                mymarkerSize = markerSize;
                if (markerSize==0){
                    opac = 0;
                }
            } else if (j>current_pt){
                mymarkerSize = 0;
                pcolor = "#FFFFFF";
            } else {
                pcolor = "LightSeaGreen";
                mymarkerSize = 20;
            };
            dps.push({
                x: j+1,
                y: datas[j],
                color:pcolor,
                markerSize:mymarkerSize,
                fillOpacity:opac
            });
        }
        markerSize += 1;
        console.log(markerSize)
        if (markerSize >= MAX_MARKER_SIZE){
            current_pt = current_pt + 1;
            markerSize = 0;
        }

        if (current_pt>=cnt){
            window.clearInterval(update_interval_id_scorechart);
            dispatchEvent(new Event("scorechart_animover"));
            typeof callback === 'function' && callback(); 
        }

        chart.render();
    };

    updateChart(0);

    delay(1000).then(()=>{
        update_interval_id_scorechart = setInterval(function(){updateChart()}, 10);
    })


}


window.pauseAndShowChart = function(pauseFor){
    
}