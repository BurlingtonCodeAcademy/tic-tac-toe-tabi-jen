let start = document.getElementById("start");
let compStart = document.getElementById("compStart");
let status = document.getElementById("status");
let cellButton = Array.from(document.getElementsByClassName("cellButton"));
let timer = document.getElementById("timer");

//define variables
let systemStatus = true; // whose turn it is
let winStatus = false;
let oStatus;
let cell; // cell from within cellButton array
let cellId; // actual div id from html
let interval; // shows the timer count in seconds
let playTimer; // the timer itself

let XMoves = []; // creates array of moves by player X
let OMoves = []; // creates array of moves by player O
let possibleMoves = [
  "cell-0",
  "cell-1",
  "cell-2",
  "cell-3",
  "cell-4",
  "cell-5",
  "cell-6",
  "cell-7",
  "cell-8",
]; // list of all cells

//start function, starts when player clicks 'start' button. timer starts at 1 second intervals. status changes to reflect which player's turn. each players move gets stored in an array. once a cell is chosen, it is disabled.
start.addEventListener("click", () => {
  start.disabled = true;
  interval = 0;
  playTimer = setInterval(timeFunction, 1000);
  status.innerText = "Player X's move..."; // can update later
  for (cell of cellButton) {
    cell.innerText = "";
    cell.disabled = false;
    XMoves = [];
    OMoves = [];
  }
  oStatus = "human"
  play(systemStatus);
});

compStart.addEventListener("click", () => {
  compStart.disabled = true;
  interval = 0;
  playTimer = setInterval(timeFunction, 1000);
  status.innerText = "Player X's move..."; // can update later
  for (cell of cellButton) {
    cell.innerText = "";
    cell.disabled = false;
    XMoves = [];
    OMoves = [];
  }
  oStatus = "computer"
  comPlay(systemStatus);
});

//timer function. starts at 0 and goes up by 1 second at a time. changing the inner text of the timer div to reflect the seconds passed.
function timeFunction() {
  interval += 1;
  timer.innerText = interval;
  // console.log(interval)
}
//play function, determines which player's turn it is.
function play(systemStatus) {
  if (systemStatus) {
    for (cell of cellButton) {
      cell.addEventListener("click", playerXTurn);
    }
  } else {
    for (cell of cellButton) {
      cell.addEventListener("click", playerOTurn);
    }
  }
  // }
}

function comPlay(systemStatus) {
  if (systemStatus) {
    for (cell of cellButton) {
      cell.addEventListener("click", playerXTurn);
    }
  } else {
    if (winStatus === false) {
      compTurn();
    }
  }
  // }
}

// play functions
function playerXTurn(event) {
  // event.target.disabled = true;
  cellId = event.target.parentNode.id;
  if (event.target.innerText.length > 0) {
    status.innerText = "Please pick valid move";
  } else {
    //  push X move to moves array
    XMoves.push(cellId);
    //  remove move from possible moves array
    possibleMoves = possibleMoves.filter((item) => item !== cellId);

    event.target.innerText = "X";
    for (cell of cellButton) {
      cell.removeEventListener("click", playerXTurn);
    }
    //   return systemStatus;
   status.innerText = "Player O's move...";
    systemStatus = false;
    hasWon(XMoves, winningCombinations);
    
    
    
  }
  if (oStatus === "human"){
    play(systemStatus);
  } else{
  comPlay(systemStatus);
  }
}

function playerOTurn(event) {
  // event.target.disabled = true;
  cellId = event.target.parentNode.id;
  if (event.target.innerText.length > 0) {
    status.innerText = "Please pick valid move";
  } else {
    // push move to moves array
    OMoves.push(cellId);
    // remove move from possible moves array
    possibleMoves = possibleMoves.filter((item) => item !== cellId);

    event.target.innerText = "O";
    console.log(event.target)
    
    for (cell of cellButton) {
      cell.removeEventListener("click", playerOTurn);
    }
    //   return systemStatus;
    status.innerText = "Player X's move...";
    systemStatus = true;

    hasWon(OMoves, winningCombinations);
  
  }
  play(systemStatus);
}

function compTurn() {
  // generate random number
  let randomCellInt = getRandomInt(possibleMoves.length);
  // index possible moves to get cell to play
  cellId = possibleMoves[randomCellInt];
  // push move to moves array
  OMoves.push(cellId);
  // remove move from possible moves array
  possibleMoves = possibleMoves.filter((item) => item !== cellId);

  let tempElement = document.getElementById(cellId);
  tempElement.children[0].innerText = "O";
  
  // for (cell of cellButton) {
  //   cell.removeEventListener("click", playerOTurn);
  // }
  //   return systemStatus;
  
  status.innerText = "Player X's move...";
  systemStatus = true;

  hasWon(OMoves, winningCombinations);

  comPlay(systemStatus);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//how to win..
// winning combos that are possible (array of arrays)
let winningCombinations = [
  ["cell-0", "cell-1", "cell-2"],
  ["cell-3", "cell-4", "cell-5"],
  ["cell-6", "cell-7", "cell-8"],
  ["cell-2", "cell-5", "cell-8"],
  ["cell-0", "cell-3", "cell-6"],
  ["cell-1", "cell-4", "cell-7"],
  ["cell-0", "cell-4", "cell-8"],
  ["cell-2", "cell-4", "cell-6"],
];

// function to determine if someone has won
function hasWon(moves, winningCombinations) {
  // create new array...
  let foundResults = winningCombinations.filter(
    // look at arrays inside winning combos array..
    (array) =>
      // for each small array look to see if each item is present.. if it is add it to the new array
      array.filter((item) => {
        // return what index in the players moves the winning combo item is.. if it exists in player moves, add to new array
        return moves.indexOf(item) > -1;
        // when lenght is three add this array to newly created array
      }).length === 3
  );

  // if foundResults includes an array of length three...
  if (foundResults.length > 0) {
    // announce someone won
    winStatus = true;

    if (systemStatus === false) {
      status.innerText = "Player X has won";
    } else if (systemStatus === true && oStatus === "computer" ) {
      status.innerText = "The computer has won";
    } else {
      status.innerText = "Player O won"
    };
    // status.innerText = "someone won";

    // disable all play board buttons so play cant continue
    for (cell of cellButton) {
      cell.disabled = true;
    }

    // re-enable start button so play can resume..
    start.disabled = false;
    compStart.disabled = false;

    // stop the timer
    clearInterval(playTimer);

    // if XMoves + OMoves = 9 then it is a draw and nobody wins (only triggered if nobody has won yet)
  } else if (XMoves.length + OMoves.length === 9) {
    status.innerText = "its a draw";

    // disable all play board buttons so play cant continue
    for (cell of cellButton) {
      cell.disabled = true;
    }

    // re-enable start button so play can resume..
    start.disabled = false;

    // stop the timer
    clearInterval(playTimer);
  }
}
