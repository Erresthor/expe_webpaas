import { addVector,createGrid,minimum_steps,showGrid } from "./utils.js";

window.myBackend = undefined;

var hidden_grid = {
    scorelist :[],
    sizeX : GRID_X,
    sizeY : GRID_Y,
    gridObj : null,
    gridMinStepObj : null,
    current_char_pos : null,
    linked_gauge_animator : null,
    
    character_moved_event : new Event("character_moved"),
    grid_ready_event : new Event("grid_ready_for_trial"),
    
    initializeGrid:function(){
        this.gridObj = createGrid(this.sizeX,this.sizeY);
        for (const start_pos of STARTING_POSITIONS){
            this.gridObj[start_pos[0]][start_pos[1]] = 1
        }
        for (const end_pos of END_POSITIONS){
            this.gridObj[end_pos[0]][end_pos[1]] = 2
        }
        for (const obst of OBSTACLES){
            this.gridObj[obst[0]][obst[1]] = 3
        }
        this.gridMinStepObj = minimum_steps(this);
        window.saveManager.updateTrialMap(this.gridObj);
    },

    isCoordinateInGrid(coordinates){
        return ((coordinates[0]>=0)&&(coordinates[1]>=0)&&(coordinates[0]<this.sizeX)&&(coordinates[1]<this.sizeY));
    },

    spawnCharacter:function(){
        // When the character spawns, the outcome becomes undefined
        var randomStartingPos = STARTING_POSITIONS[Math.floor(Math.random() * STARTING_POSITIONS.length)];
        this.current_char_pos = randomStartingPos;
        // console.log("Character was spawned at " + this.current_char_pos);
        window.dispatchEvent(myBackend.grid_ready_event)
    },

    getGridPosition:function(){
        return myBackend.current_char_pos;
    },

    reinitTrialGrid:function(){
        this.spawnCharacter();
    },

    showGrid:function(){
        // let dispArr = this.gridObj.map((x)=>(x.toString(10)));
        let dispArr = this.gridObj.map( 
            function( row ) {
                return row.map( 
                    function( cell ) { 
                        return cell.toString(10); 
                    } 
                );
            }
        )
        if (this.current_char_pos != null){
            dispArr[this.current_char_pos[0]][this.current_char_pos[1]] = 'X';
        }
        // showGrid(this.gridMinStepObj);
        console.log(dispArr);
    },
    
    moveCharacter:function(movement_string,send_event=true){
        // console.log("Updating character position from " + this.current_char_pos + " " + movement_string+"-wards.");
        let potential_nextpos = null;
        // console.log(potential_nextpos);
        // potential_nextpos = addVector(this.current_char_pos,[-1,0]);
        // console.log(potential_nextpos);
        switch(movement_string){
            case 'same':
                potential_nextpos = this.current_char_pos;break;
            case 'up':
                potential_nextpos = addVector(this.current_char_pos,[-1,0]);break;
            case 'up-left':
                potential_nextpos = addVector(this.current_char_pos,[-1,-1]);break;
            case 'up-right':
                potential_nextpos = addVector(this.current_char_pos,[-1,1]);break;
            case 'down':
                potential_nextpos = addVector(this.current_char_pos,[1,0]);break;
            case 'down-left':
                potential_nextpos = addVector(this.current_char_pos,[1,-1]);break;
            case 'down-right':
                potential_nextpos = addVector(this.current_char_pos,[1,1]);break;
            case 'right':
                potential_nextpos = addVector(this.current_char_pos,[0,1]);break;
            case 'left':
                potential_nextpos = addVector(this.current_char_pos,[0,-1]);break;
        };

        // Check if potential_nextpos is a viable option : 
        // Is it in the grid ?
        if (this.isCoordinateInGrid(potential_nextpos)){
            // If it is, is there any obstacles ?
            // console.log(potential_nextpos);
            // console.log(this.gridObj[potential_nextpos[0],potential_nextpos[1]]);
            if (this.gridObj[potential_nextpos[0]][potential_nextpos[1]]==3){
                // Then do not update the character position ;D
                console.log("Hit a mountain.") ;
            } else {
                this.current_char_pos = potential_nextpos;
            }
        }
        
        // Should we send an event ?
        // console.log("--->  " + this.linearDistanceToGoal());
        if(send_event){
            dispatchEvent(this.character_moved_event);   
        }  
    },

    linearDistanceToGoal : function(){
        let h = this.sizeX - 1;
        let w = this.sizeY - 1;
        let maxdist = Math.sqrt(h*h+w*w);
        let returnThis = maxdist;
        for (const endpos of END_POSITIONS){
            let x2 = (this.current_char_pos[0]-endpos[0]);
            let y2 = (this.current_char_pos[1]-endpos[1]);
            let d = Math.sqrt(x2*x2+y2*y2);
            if (d < returnThis){
                returnThis = d;
            }
        }
        return (returnThis/maxdist);
    },

    getCharacterMinStepToGoal:function(){
        return this.gridMinStepObj[this.current_char_pos[0]][this.current_char_pos[1]]
    },

    getCompleteTimestepScore:function(){
        return [this.linearDistanceToGoal(),this.getCharacterMinStepToGoal()]
    },

    getMaximumStepNeeded:function(){
        var maxRow = this.gridMinStepObj.map(function(row){ return Math.max.apply(Math, row); });
        var max = Math.max.apply(null, maxRow);
        return max;
    },

    getSuccessBool : function(){
        return (this.gridObj[this.current_char_pos[0]][this.current_char_pos[1]]==2)
    }
}

// Initialize the grid as soon as the gauge is loaded
window.addEventListener("initialize_backend_order",function(event){
    window.myBackend = hidden_grid;
    myBackend.initializeGrid();
    myBackend.spawnCharacter();
    myBackend.showGrid();
    window.dispatchEvent(new Event("initialize_dboard_order"));
},false);