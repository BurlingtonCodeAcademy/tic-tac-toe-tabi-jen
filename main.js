let start = document.getElementById("start");
let status = document.getElementById("status");
let cellButton = Array.from(document.getElementsByClassName("cellButton"));

let systemStatus = true;
let win = false;
let cell;
let cellId;
let XMoves =[];
let OMoves = [];

start.addEventListener("click", () => {
  start.disabled = true;
  status.innerText = "Player X's move..."; // can update later
  // add timer start here
  play(systemStatus)
});

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
}
// play functions
function playerXTurn(event) {
  // event.target.disabled = true;
  cellId = event.target.parentNode.id
  XMoves.push(cellId)
  console.log(XMoves)
  event.target.innerText = "X";
  status.innerText = "Player O's move...";
  systemStatus = false;
  console.log(systemStatus);
  for (cell of cellButton) {
    cell.removeEventListener("click", playerXTurn);
  }
//   return systemStatus;
hasWon(XMoves, winningCombinations);
play(systemStatus);
}


function playerOTurn(event) {
  // event.target.disabled = true;
  cellId = event.target.parentNode.id
  OMoves.push(cellId)
  console.log(OMoves)
  event.target.innerText = "O";
  status.innerText = "Player X's move...";
  systemStatus = true;
  console.log(systemStatus);
  for (cell of cellButton) {
    cell.removeEventListener("click", playerOTurn);
  }
//   return systemStatus;
hasWon(OMoves, winningCombinations);
play(systemStatus);
}

//how to win
let winningCombinations = [
  ["cell-0","cell-1", "cell-2"],
  ["cell-3", "cell-4", "cell-5"],
  ["cell-6", "cell-7", "cell-8"],
  ["cell-2", "cell-5", "cell-8"],
  ["cell-0", "cell-3", "cell-6"],
  ["cell-1", "cell-4", "cell-7"],
  ["cell-0", "cell-4", "cell-8"],
  ["cell-2", "cell-4", "cell-6"]
];

function hasWon(moves, winningCombinations) {
  let foundResults = winningCombinations.filter(
    array =>
      array.filter(item => {
        return moves.indexOf(item) > -1;
      }).length === 3
  );
if (foundResults.length > 0) {

  console.log("someone won")
    // if (whoseTurn === "computer") {
    //   displayResult("You won");
    // } else if (whoseTurn === "player") {
    //   displayResult("The computer has won");
    // }
    // didSomeoneWin = true;
  }
}