let start = document.getElementById("start");
let compStart = document.getElementById("compStart");
let status = document.getElementById("status");
let cellButton = Array.from(document.getElementsByClassName("cellButton"));
let timer = document.getElementById("timer");
let replay = document.getElementById("replay");

//define variables
let systemStatus = true; // whose turn it is
let winStatus = false;
let oStatus; // is player O a human or the computer
let cell; // cell from within cellButton array
let cellId; // actual div id from html
let interval; // shows the timer count in seconds
let playTimer; // the timer itself
let userName; // name user chooses / if not defaults to X
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
]; // list of all cells - updated throughout play so computer cannot guess duplicate play

//2 player start function:

// starts when player clicks 'start' button. timer starts, 1 second intervals. status changes to reflect which player's turn. each players move gets stored in an array. once a cell is chosen, it is disabled.
start.addEventListener("click", () => {
  // window prompts user to choose their name. if they hit 'cancel', defaults to X and O.
  userName = window.prompt("Would you like to enter a name for player X?...");
  userOName = window.prompt("Would you like to enter a name for player O?...");

  if (!userName) {
    userName = "X";
  }

  if (!userOName) {
    userOName = "O";
  }
  // when game begins, buttons become disabled. Timer starts counting in second intervals until someone wins
  start.disabled = true;
  compStart.disabled = true;
  interval = 0;
  playTimer = setInterval(timeFunction, 1000);
  status.innerText = `${userName}'s move..`; // status shows us whose turn it is

  //  FOR JEN: dont think we need this because of how we refresh now :)
  // for (cell of cellButton) {
  //   cell.innerText = "";
  //   cell.disabled = false;
  //   XMoves = [];
  //   OMoves = [];
  // }

  oStatus = "human"; // tell rest of system that o is a human
  play(systemStatus); // call play function
});

// Computer start function:

// if they choose to play the computer, they can choose their own name, computer defaults to player O. Timer works as it did above, as does status.
compStart.addEventListener("click", () => {
  userName = window.prompt("Would you like to enter a name for player X?...");

  if (!userName) {
    userName = "X";
  }

  userOName = "O";

  compStart.disabled = true;
  start.disabled = true;
  interval = 0;
  playTimer = setInterval(timeFunction, 1000);
  status.innerText = `${userName}'s move..`;
  // for (cell of cellButton) {
  //   cell.innerText = "";
  //   cell.disabled = false;
  //   XMoves = [];
  //   OMoves = [];
  // }
  oStatus = "computer";
  comPlay(systemStatus);
});

// replay button, becomes activated after win scenario.. reloads page if pressed
replay.addEventListener("click", () => {
  document.location.reload();
});

//timer function. starts at 0 and goes up by 1 second at a time. changing the inner text of the timer div to reflect the seconds passed.
function timeFunction() {
  interval += 1;
  timer.innerText = "Time elapsed " + interval + " seconds.";
}
//play function, determines which player's turn it is.
function play(systemStatus) {
  if (systemStatus) {
    // adds event listener to all the buttons in play board, based on who's turn
    for (cell of cellButton) {
      cell.addEventListener("click", playerXTurn);
    }
  } else {
    for (cell of cellButton) {
      cell.addEventListener("click", playerOTurn);
    }
  }
}
// FOR JEN: we could combine these two functions by extending our conditionals to include the oStatus variable into it.. think on it :)

// if playing the computer, after player X moves, triggers computer's turn. set a timeOut delay of 2 seconds for computer to make their move.
function comPlay(systemStatus) {
  if (systemStatus) {
    for (cell of cellButton) {
      cell.addEventListener("click", playerXTurn);
    }
  } else {
    if (winStatus === false) {
      //call function until someones won
      setTimeout(compTurn, 2000); // delay function so that it isn't too fast
    }
  }
}

// play functions
function playerXTurn(event) {
  // event.target.disabled = true;
  cellId = event.target.parentNode.id; // which cell was targeted
  if (event.target.innerText.length > 0) {
    // if the player chooses a cell that is already chosen, does not work.
    status.innerText = "Please select an empty cell";
  } else {
    //  push X move to moves array
    XMoves.push(cellId);
    //  remove move from possible moves array
    possibleMoves = possibleMoves.filter((item) => item !== cellId);
    // FOR JEN: should we change X here to be the name of the player?
    event.target.innerText = "X";
    for (cell of cellButton) {
      cell.removeEventListener("click", playerXTurn); // make buttons un-clickable.. without disabling
    }
    status.innerText = `${userOName}'s move...`; //   update systemStatus
    systemStatus = false;
    hasWon(XMoves, winningCombinations); //check if anyone's one
  }
  if (oStatus === "human") {
    // call appropriate play function based on opponent
    play(systemStatus);
  } else {
    comPlay(systemStatus);
  }
}

// if two player game, same as player X but for player O
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
    console.log(event.target);

    for (cell of cellButton) {
      cell.removeEventListener("click", playerOTurn);
    }
    status.innerText = `${userName}'s move..`;
    systemStatus = true;

    hasWon(OMoves, winningCombinations);
  }
  play(systemStatus); // only needs to call 2player function because not active in comp scenario
}

// function for the computer to play. generates a random cell from the possibleMoves array, and populates it/removes it from possibleMoves.
function compTurn() {
  let randomCellInt = getRandomInt(possibleMoves.length); // generate random number
  cellId = possibleMoves[randomCellInt]; // index possible moves to get cell to play
  OMoves.push(cellId); // push move to moves array
  possibleMoves = possibleMoves.filter((item) => item !== cellId); // remove move from possible moves array
  let tempElement = document.getElementById(cellId); //target cell using id
  tempElement.children[0].innerText = "O"; // change button's (first child of cell) text
  status.innerText = `${userName}'s move..`; //update status
  systemStatus = true;
  hasWon(OMoves, winningCombinations); //check for winner
  comPlay(systemStatus); //call function
}

// function to get a random integer for the computer to make a 'random' move
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
        // when length is three add this array to newly created array
      }).length === 3
  );

  // if foundResults includes an array (1) of length three...
  if (foundResults.length > 0) {
    // announce someone won, so that comPlay isn't called
    winStatus = true;
    // change border color item.setAttribute("id", "winningCell"); so appropriate css is applied
    foundResults[0].forEach((item) => {
      tempElement = document.getElementById(item);
      console.log(tempElement);
      tempElement.id = "winningCell";
    });

    //alerts who has won if somebody wins
    if (systemStatus === false) {
      status.innerText = `${userName} has won!`;
    } else if (systemStatus === true && oStatus === "computer") {
      status.innerText = "The computer has won";
    } else {
      status.innerText = `${userOName} won`;
    }

    // disable all play board buttons so play cant continue
    for (cell of cellButton) {
      cell.disabled = true;
    }

    // enable replay button so play can start over..
    replay.disabled = false;
    // stop the timer
    clearInterval(playTimer);

    // DRAW SCENARIO
    // if XMoves + OMoves = 9 then it is a draw and nobody wins (only triggered if nobody has won yet)
  } else if (XMoves.length + OMoves.length === 9) {
    status.innerText = "it's a draw";
    let drawArray = XMoves.concat(OMoves); //combine all moves back into one array
    drawArray.forEach((item) => { //make all cells have rainbow border css
      tempElement = document.getElementById(item);
      console.log(tempElement);
      tempElement.id = "winningCell";
    });

    // disable all play board buttons so play cant continue
    for (cell of cellButton) {
      cell.disabled = true;
    }

    // enable replay button so play can resume..
    replay.disabled = false;

    // stop the timer
    clearInterval(playTimer);
  }
}
