let start = document.getElementById("start");
let status = document.getElementById("status");
let cellButton = Array.from(document.getElementsByClassName("cellButton"));
let timer = document.getElementById("timer");

//define variables
let systemStatus = true;
let win = false;
let cell;
let cellId;
let interval;
let XMoves = [];
let OMoves = [];
let playTimer;

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
  play(systemStatus);
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
// play functions
function playerXTurn(event) {
  // event.target.disabled = true;
  cellId = event.target.parentNode.id;
  if (event.target.innerText.length > 0) {
    status.innerText = "Please pick valid move";
  } else {
    XMoves.push(cellId);
    event.target.innerText = "X";
    status.innerText = "Player O's move...";
    systemStatus = false;
    for (cell of cellButton) {
      cell.removeEventListener("click", playerXTurn);
    }
    //   return systemStatus;
    hasWon(XMoves, winningCombinations);
  }
  play(systemStatus);
}

function playerOTurn(event) {
  // event.target.disabled = true;
  cellId = event.target.parentNode.id;
  if (event.target.innerText.length > 0) {
    status.innerText = "Please pick valid move";
  } else {
    OMoves.push(cellId);
    console.log(OMoves);
    event.target.innerText = "O";
    status.innerText = "Player X's move...";
    systemStatus = true;
    console.log(systemStatus);
    for (cell of cellButton) {
      cell.removeEventListener("click", playerOTurn);
    }
    //   return systemStatus;
    hasWon(OMoves, winningCombinations);
  }
  play(systemStatus);
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
        console.log(item);
        // return what index in the players moves the winning combo item is.. if it exists in player moves, add to new array
        return moves.indexOf(item) > -1;
        // when lenght is three add this array to newly created array
      }).length === 3
  );

  // if foundResults includes an array of length three...
  if (foundResults.length > 0) {
    // annouce someone won
    status.innerText = "someone won";

    // disable all play board buttons so play cant continue
    for (cell of cellButton) {
      cell.disabled = true;
    }

    // re-enable start button so play can resume..
    start.disabled = false;

    // stop the timer
    clearInterval(playTimer);

    // if (whoseTurn === "computer") {
    //   displayResult("You won");
    // } else if (whoseTurn === "player") {
    //   displayResult("The computer has won");
    // }
    // didSomeoneWin = true;

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
