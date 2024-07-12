window.delay = function(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
            ;
        });
    };
}

export function addVector(a,b){
    let c = [];
    for (let i = 0; i < a.length; i++){
        c.push(a[i]+b[i]);
    }
    // console.log(a+"  +  "+b+"  =  "+c);
    return c;
}

window.deepCopy = (arr) => {
    let copy = [];
    arr.forEach(elem => {
      if(Array.isArray(elem)){
        copy.push(deepCopy(elem))
      }else{
        if (typeof elem === 'object') {
          copy.push(deepCopyObject(elem))
      } else {
          copy.push(elem)
        }
      }
    })
    return copy;
}


// A quick & dirty set of functions to 
// calculate the minimum number of steps to reach the
// goal in a 2D grid depending on the starting position
let oneInThis2DGridIsEmpty = function(grid){
    let sx = grid.length;
    let sy = grid[0].length;
    for (let i = 0; i < sx; i++) {
        for (let j = 0; j < sy; j++) {
            if (grid[i][j] == -1) {
                return true;
            }
        }
    }
    return false;
}

let is_a_neighbor = function(x,grid,i,j){
    let sx = grid.length;
    let sy = grid[0].length;
    for (let k = -1; k<= 1;k++){
        for (let kk = -1; kk<= 1; kk++){
            if ((i+k >= 0)&&(i+k < sx)&&(j+kk >= 0)&&(j+kk<sy)) {
                if (grid[i+k][j+kk]==x){
                    return true;
                }
            }
        }
    }
    return false;
}

export function minimum_steps(hidden_grid){
    let sx = hidden_grid.sizeX;
    let sy = hidden_grid.sizeY;
    let end_pos = END_POSITIONS;

    // Matrix of 0s
    let grid_of_distances_to_goal = [];
    for (let i = 0; i < sx; i++) {
        grid_of_distances_to_goal.push([]);
        for (let j = 0; j < sy; j++) {
            grid_of_distances_to_goal[i].push(-1);
        }
    }

    // Seed the 0s : 
    for (let k=0; k < end_pos.length; k++){
        let endposx = end_pos[k][0];
        let endposy = end_pos[k][1];
        grid_of_distances_to_goal[endposx][endposy] = 0;
    }

    let max_interruptor = 0 ;
    while ((oneInThis2DGridIsEmpty(grid_of_distances_to_goal)) && (max_interruptor < 100)){
        let static_grid = deepCopy(grid_of_distances_to_goal);
        for (let i = 0; i < sx; i++) {
            for (let j = 0; j < sy; j++) {
                // First : is it an empty cell ?
                let cond1 = (static_grid[i][j] == -1) 
                
                if (cond1){
                    // Second : grid[i,j] is a ,neighbor of the previous :
                    let cond2 =  (is_a_neighbor(max_interruptor,static_grid,i,j))
                    // console.log(i,j,is_a_neighbor(max_interruptor,static_grid,i,j))
                    if (cond2) {
                        let grid_value  = hidden_grid.gridObj[i][j];
                        
                        if (grid_value == 3){
                            // This is an obstacle ! 
                            // Set to max value : 
                            grid_of_distances_to_goal[i][j] = 999;
                        } else {
                            grid_of_distances_to_goal[i][j] = max_interruptor + 1;
                        }
                    }
                }
                // grid_of_distances_to_goal[i][j] = max_interruptor + 1;
            }
        }
        max_interruptor = max_interruptor + 1;
    }

    return grid_of_distances_to_goal;
}

export function showGrid(grid){
    let dispArr = grid.map( 
        function( row ) {
            return row.map( 
                function( cell ) { 
                    return cell.toString(10); 
                } 
            );
        }
    )
    // if (this.current_char_pos != null){
    //     dispArr[this.current_char_pos[0]][this.current_char_pos[1]] = 'X';
    // }
    console.log(dispArr);
}
// module.exports = {addvector};

export function createGrid(sizex,sizey){
    let grid = [];
    for (let i = 0; i < sizex; i++){
        grid.push([]);
        for(let j = 0; j < sizey; j++){
            grid[i].push(0)
        }
    }
    return grid;
}


// Script loading tools :
// Load a script from given `url`
const loadScript = function (url) {
    return new Promise(function (resolve, reject) {
        const script = document.createElement('script');
        script.src = url;
        script.type = 'module'

        script.addEventListener('load', function () {
            // The script is loaded completely
            resolve(true);
        });

        document.head.appendChild(script);
    });
};

// Perform all promises in the order
const waterfall = function (promises) {
    return promises.reduce(
        function (p, c) {
            // Waiting for `p` completed
            return p.then(function () {
                // and then `c`
                return c.then(function (result) {
                    return true;
                });
            });
        },
        // The initial value passed to the reduce method
        Promise.resolve([])
    );
};

// Load an array of scripts in order
window.loadScriptsInOrder = function(arrayOfJs) {
    const promises = arrayOfJs.map(function (url) {
        return loadScript(url);
    });
    return waterfall(promises);
};