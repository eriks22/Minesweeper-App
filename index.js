//"use strict";
window.addEventListener('load', main);


function prepare_dom(s) {
    $(document).ready(function() {
        console.log("preparing DOM");
        const grid = document.querySelector(".grid");
        const nCards = 20 * 24; // max grid size
        for (let i = 0; i < nCards; i++) {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("data-cardInd", i);
            // card.addEventListener("click", () => {
            //     card_click_cb( s, card, i);
            // });
            // card.addEventListener("contextmenu", () => {
            //     card_right_click_cb(s, card, i);
            // });
            grid.appendChild(card);



            const recentlyAddedCard = grid.children[i];
            const cardDisplay = document.createElement("div");
            cardDisplay.className = "cardDisplay";
            recentlyAddedCard.appendChild(cardDisplay);

            // console.log("appended child at " + i);
        }

        // bind functions with JQuery
        console.log("adding jQuery click functions");
        // $(".card").on({
        //     click: function() {
        //         // console.log("adding function with jquery");
        //         card_click_cb( s, $(this).attr('data-cardInd'));
        //         },
        //     "taphold": function() {
        //         card_right_click_cb(s, $(this).attr('data-cardInd'));
        //     }
        // });
        $(document).on("mousedown",".card",function(e){
            $(this).removeClass("taphold_Flag");

            switch(e.which) {
                case 1:
                    // left click
                    console.log("I am a left mousedown event!");
                    if( ! $(this).hasClass("flagged") ) {
                        if ( ! $(this).hasClass("taphold_Flag") ) {
                            card_click_cb(s, $(this).attr('data-cardInd'));
                        }
                    }
                    break;
                case 2:
                    break;
                case 3:
                    // console.log("I am a taphold event!");
                    // card_div.classList.toggle("flagged");
                    // toggle flag class
                    $(this).toggleClass("flagged");
                    // $(this).addClass("taphold_Flag");
                    card_right_click_cb(s, $(this).attr('data-cardInd'));
                    break;
                default:
                    console.log("error in mousedown events");
            }

            // make sure this works for desktop too..

        });

        console.log("adding left click function with jquery");
        $(document).on("tap",".card",function(){
            console.log("I am a tap event!");
            // console.log($(this).hasClass("flagged"));
            // console.log("taphold_Flag: " + !$(this).has("taphold_Flag"));
            if( ! $(this).hasClass("flagged") ) {
                if ( ! $(this).hasClass("taphold_Flag") ) {
                    card_click_cb(s, $(this).attr('data-cardInd'));
                }
            }
        });
        console.log("adding right click function with jquery");
        $(document).on("taphold",".card",function(){
            console.log("I am a taphold event!");
            // card_div.classList.toggle("flagged");
            // toggle flag class
            $(this).toggleClass("flagged");
            $(this).addClass("taphold_Flag");
            card_right_click_cb(s, $(this).attr('data-cardInd'));
        });
    });
}

function render(s) {
    const grid = document.querySelector(".grid");
    grid.style.gridTemplateColumns = `repeat(${s.cols}, 1fr)`;
    let gameRendering = s.game.getRendering().join("");
    console.log("Game is currently:\n" + gameRendering);
    for (let i = 0; i < grid.children.length; i++) {
        // console.log("grid.children.length is: " + grid.children.length);
        const card = grid.children[i];
        const ind = Number(card.getAttribute("data-cardInd"));
        const cardDisplay = card.lastElementChild;

        if (ind >= s.rows * s.cols) {
            card.style.display = "none";
        } else {
            card.style.display = "block";
            if (gameRendering.charAt(ind) !== "H") {
                if (gameRendering.charAt(ind) === "F") {
                    // If square has been flagged
                    card.classList.add("flagged");
                }
                else {
                // Square has not been flagged

                //console.log("flipping card at index" + ind + "that engine shows" + gameRendering.charAt(ind));
                card.classList.remove("flagged");
                card.classList.add("flipped");
                let newChar = gameRendering.charAt(ind);
                if (newChar !== "0")
                    cardDisplay.innerHTML = `${gameRendering.charAt(ind)}`;
                }
            }
            // else
            //     card.classList.remove("flipped");
        }
    }
    // this updates the move counter text at the bottom
    document.querySelectorAll(".moveCount").forEach(
        (e) => {
            e.textContent = String(s.game.getStatus().nmines - s.game.getStatus().nmarked);
            // s.game.getStatus().nmines - s.game.getStatus().nmarked
            // nmarked

        });
}

// uncovers square
function flip( s, col, row) {
    console.log("uncovering at column: " + col);
    console.log("uncovering at row: " + row);
    if( col >= 0 && col < s.cols && row >= 0 && row < s.rows)
        s.onoff[row * s.cols + col] = ! s.onoff[row * s.cols + col];
    //uncover square in game engine
    s.game.uncover(row, col);

}

// add as flag to the current map
function addFlag(s, col, row) {
    s.game.mark(row, col);
}

function make_solvable(s) {
    // Start new game
    s.moves = 0;
    s.onoff = [];
    for ( let i = 0; i < s.rows * s.cols; i++)
        s.onoff[i] = false;

    // unflip cards
    const grid = document.querySelector(".grid");
    grid.style.gridTemplateColumns = `repeat(${s.cols}, 1fr)`;
    for (let i = 0; i < grid.children.length; i++) {
        const card = grid.children[i];
        const cardDisplay = grid.children[i].lastChild;
        const ind = Number(card.getAttribute("data-cardInd"));

        if (ind >= s.rows * s.cols) {
            card.style.display = "none";
        } else {
            card.style.display = "block";

            card.classList.remove("flipped");
            card.classList.remove("flagged");
            cardDisplay.innerHTML = `${""}`;
            //card.innerHTML = `${""}`;


        }
    }
    // const music = document.querySelector("audio");
    // music.play();
}

// Handle right-clicking a square
// function card_right_click_cb(s, card_div, ind) {
function card_right_click_cb(s, ind ) {
    console.log("i am a taphold event");
    const col = ind % s.cols;
    const row = Math.floor(ind / s.cols);
    console.log("right click happened at index " + ind);

    // card_div.classList.toggle("flagged");
    addFlag(s, col, row);
    render(s);

}

// Handle left-clicking a square
// function card_click_cb(s, card_div, ind) {
function card_click_cb(s, ind) {
    s.mySound.play();
    // let ind = $(this).attr('data-cardInd');
    console.log("ind is: "+ind);

    const col = ind % s.cols;
    // const col = s.cols;
    const row = Math.floor(ind / s.cols);
    // const row = s.rows;
    // card_div.classList.add("flipped");
    // if square not flagged
    if(s.game.getRendering().join("").charAt(ind) !== "F")
        flip(s, col, row);
    s.moves ++;
    render(s);
    // check if we won and activate overlay if we did
    console.log(s.game.getStatus());
    if( s.game.getStatus().exploded === true) {
        document.querySelector("#overlay-lose").classList.toggle("active");
    } else if (s.game.getStatus().done) {
        document.querySelector("#overlay-win").classList.toggle("active");
    }
    // TODO re-enable this for sound
    //clickSound.play();
}

/**
 * callback for the top button
 *  - set the state to the requested size
 *  - generate a map
 *  - render a map
 * @param s
 * @param cols
 * @param rows
 */
function button_cb(s, rows, cols) {

    s.game = new MSGame();
    s.game.init(rows,cols, Math.floor(rows*cols/8));
    console.log("initializing game!");
    s.cols = cols;
    s.rows = rows;
    make_solvable(s);
    render(s)
    s.mySound.play();
}

// Starts background music
// With help from https://www.w3schools.com/graphics/game_sound.asp
function startBackgroundMusic(s, src) {
    this.sound = document.createElement("audio");
    console.log(src);
    this.sound.src = src;
    // this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.sound.play();
    this.play = function() {
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }

}

function main() {

    // create state object
    let state = {
        cols: null,
        rows: null,
        nmines: null,
        moves: 0,
        onoff: [],
        game: MSGame,
        mySound: null,
        timer: null
    }

    // get browser dimensions - not used in this code
    // TODO implement? e.g. detect mobile
    let html = document.querySelector("html");
    console.log("Your render area:", html.clientWidth, "x", html.clientHeight)

    // Register callbacks for buttons
    document.querySelectorAll(".menuButton").forEach((button) => {
        // make row and column dimensions from the "NxM" text found in the menu icon ???
        [rows, cols] = button.getAttribute("data-size").split("x").map(s=>Number(s));
        let gameMode;
        if (rows > 19) {
            gameMode = "hard";
            state.nmines = 25;
        } else if (rows > 13) {
            gameMode = "medium";
            state.nmines = 18;
        } else {
            gameMode = "easy";
            state.nmines = 10;
        }
        button.innerHTML = `${gameMode}`;
        button.addEventListener("click", button_cb.bind(null, state, rows, cols));
        // button.bind("click", button_cb(null, state, rows, cols));

    });

    // Callback for overlay click - hide overlay and regen game
    // TODO
    document.querySelector("#overlay-win").addEventListener("click", () => {
        document.querySelector("#overlay-win").classList.remove("active");
        button_cb(state, state.rows, state.cols);
    });

    document.querySelector("#overlay-lose").addEventListener("click", () => {
        document.querySelector("#overlay-lose").classList.remove("active");
        button_cb(state, state.rows, state.cols);
    });

    //start music


    // sound callback
    // TODO Implement this (sound callback) when (if) I implement sound
    let mySound = document.createElement('audio');
    mySound.setAttribute('src', "ultralight-beam-instrumentalfx.mp3");
    mySound.setAttribute('muted', "true");
    // let mySound = new Audio("ultralight-beam-instrumentalfx.m4a");
    // startBackgroundMusic(state, mySound);
    state.mySound = mySound

    // code for timer
    let ss = document.getElementsByClassName("timer");
    state.timer = ss;



    // let timerArr = [];
    [].forEach.call(ss,function(s) {
        let currentTime = 0,
            interval = 0,
            lastUpdateTime = new Date().getTime(),
            start = document.querySelector('.gridWrapper'),
            // stop = document.querySelector('.menuButton'),
            reset = document.querySelector('.menu .menuButton'),
            reset2 = document.querySelector('#overlay-lose'),
            reset3 = document.querySelector('#overlay-win'),
            secs = document.querySelector('span.seconds')

            console.log("start is: "+ start);
        start.addEventListener('click',startTimer);
        // stop.addEventListener('click',stopTimer);
        reset.addEventListener('click',resetTimer);
        reset2.addEventListener('click',resetTimer);
        reset3.addEventListener('click',resetTimer);
        function pad(n){
            return('00' + n).substr(-2);
        }
        function update(){
            var now = new Date().getTime(),
                dt = now - lastUpdateTime;
            currentTime = currentTime + dt;
            var time = new Date(currentTime);
            secs.innerHTML = pad(time.getSeconds());
            lastUpdateTime = now;
        }
        function startTimer(){
            if(!interval){
                lastUpdateTime = new Date().getTime();
                interval = setInterval(update,1);
            }
        }
        function stopTimer(){
            clearInterval(interval);
            interval = 0;
        }
        function resetTimer(){
            currentTime = 0;
        }
    });



    // Create enough squares for largest game and register click callbacks

    prepare_dom(state);

    // simulate pressing Easy button to start new game
    button_cb(state, 8, 10);

}

// Minesweeper game engine from Pavol
let MSGame = (function(){
    "use strict";
    // private constants
    const STATE_HIDDEN = "hidden";
    const STATE_SHOWN = "shown";
    const STATE_MARKED = "marked";

    function array2d( nrows, ncols, val) {
        const res = [];
        for( let row = 0 ; row < nrows ; row ++) {
            res[row] = [];
            for( let col = 0 ; col < ncols ; col ++)
                res[row][col] = val(row,col);
        }
        return res;
    }

    // returns random integer in range [min, max]
    function rndInt(min, max) {
        [min,max] = [Math.ceil(min), Math.floor(max)]
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    class _MSGame {
        constructor() {
            console.log("calling MSGame constructor!");
            this.init(8,10,10); // easy by default
        }

        validCoord(row, col) {
            return row >= 0 && row < this.nrows && col >= 0 && col < this.ncols;
        }

        init(nrows, ncols, nmines) {
            console.log("calling MSGame init!");
            this.nrows = nrows;
            this.ncols = ncols;
            this.nmines = nmines;
            this.nmarked = 0;
            this.nuncovered = 0;
            this.exploded = false;
            // create an array
            this.arr = array2d(
                nrows, ncols,
                () => ({mine: false, state: STATE_HIDDEN, count: 0}));
        }

        count(row,col) {
            const c = (r,c) =>
                (this.validCoord(r,c) && this.arr[r][c].mine ? 1 : 0);
            let res = 0;
            for( let dr = -1 ; dr <= 1 ; dr ++ )
                for( let dc = -1 ; dc <= 1 ; dc ++ )
                    res += c(row+dr,col+dc);
            return res;
        }
        sprinkleMines(row, col) {
            // prepare a list of allowed coordinates for mine placement
            let allowed = [];
            for(let r = 0 ; r < this.nrows ; r ++ ) {
                for( let c = 0 ; c < this.ncols ; c ++ ) {
                    if(Math.abs(row-r) > 2 || Math.abs(col-c) > 2)
                        allowed.push([r,c]);
                }
            }
            this.nmines = Math.min(this.nmines, allowed.length);
            for( let i = 0 ; i < this.nmines ; i ++ ) {
                let j = rndInt(i, allowed.length-1);
                [allowed[i], allowed[j]] = [allowed[j], allowed[i]];
                let [r,c] = allowed[i];
                this.arr[r][c].mine = true;
            }
            // erase any marks (in case user placed them) and update counts
            for(let r = 0 ; r < this.nrows ; r ++ ) {
                for( let c = 0 ; c < this.ncols ; c ++ ) {
                    if(this.arr[r][c].state == STATE_MARKED)
                        this.arr[r][c].state = STATE_HIDDEN;
                    this.arr[r][c].count = this.count(r,c);
                }
            }
            let mines = []; //let counts = [];
            for(let row = 0 ; row < this.nrows ; row ++ ) {
                let s = "";
                for( let col = 0 ; col < this.ncols ; col ++ ) {
                    s += this.arr[row][col].mine ? "B" : ".";
                }
                s += "  |  ";
                for( let col = 0 ; col < this.ncols ; col ++ ) {
                    s += this.arr[row][col].count.toString();
                }
                mines[row] = s;
            }
            console.log("Mines and counts after sprinkling:");
            console.log(mines.join("\n"), "\n");
        }
        // uncovers a cell at a given coordinate
        // this is the 'left-click' functionality
        uncover(row, col) {
            console.log("uncover", row, col);
            // if coordinates invalid, refuse this request
            if( ! this.validCoord(row,col)) return false;
            // if this is the very first move, populate the mines, but make
            // sure the current cell does not get a mine
            if( this.nuncovered === 0)
                this.sprinkleMines(row, col);
            // if cell is not hidden, ignore this move
            if( this.arr[row][col].state !== STATE_HIDDEN) return false;
            // floodfill all 0-count cells
            const ff = (r,c) => {
                if( ! this.validCoord(r,c)) return;
                if( this.arr[r][c].state !== STATE_HIDDEN) return;
                this.arr[r][c].state = STATE_SHOWN;
                this.nuncovered ++;
                if( this.arr[r][c].count !== 0) return;
                ff(r-1,c-1);ff(r-1,c);ff(r-1,c+1);
                ff(r  ,c-1);         ff(r  ,c+1);
                ff(r+1,c-1);ff(r+1,c);ff(r+1,c+1);
            };
            ff(row,col);
            // have we hit a mine?
            if( this.arr[row][col].mine) {
                this.exploded = true;
            }
            return true;
        }
        // puts a flag on a cell
        // this is the 'right-click' or 'long-tap' functionality
        mark(row, col) {
            console.log("mark", row, col);
            // if coordinates invalid, refuse this request
            if( ! this.validCoord(row,col)) return false;
            // if cell already uncovered, refuse this
            console.log("marking previous state=", this.arr[row][col].state);
            if( this.arr[row][col].state === STATE_SHOWN) return false;
            // accept the move and flip the marked status
            this.nmarked += this.arr[row][col].state == STATE_MARKED ? -1 : 1;
            this.arr[row][col].state = this.arr[row][col].state == STATE_MARKED ?
                STATE_HIDDEN : STATE_MARKED;
            return true;
        }
        // returns array of strings representing the rendering of the board
        //      "H" = hidden cell - no bomb
        //      "F" = hidden cell with a mark / flag
        //      "M" = uncovered mine (game should be over now)
        // '0'..'9' = number of mines in adjacent cells
        getRendering() {
            const res = [];
            for( let row = 0 ; row < this.nrows ; row ++) {
                let s = "";
                for( let col = 0 ; col < this.ncols ; col ++ ) {
                    let a = this.arr[row][col];
                    if( this.exploded && a.mine) s += "M";
                    else if( a.state === STATE_HIDDEN) s += "H";
                    else if( a.state === STATE_MARKED) s += "F";
                    else if( a.mine) s += "M";
                    else s += a.count.toString();
                }
                res[row] = s;
            }
            return res;
        }
        getStatus() {
            let done = this.exploded ||
                this.nuncovered === this.nrows * this.ncols - this.nmines;
            return {
                done: done,
                exploded: this.exploded,
                nrows: this.nrows,
                ncols: this.ncols,
                nmarked: this.nmarked,
                nuncovered: this.nuncovered,
                nmines: this.nmines
            }
        }
    }

    return _MSGame;

})();
