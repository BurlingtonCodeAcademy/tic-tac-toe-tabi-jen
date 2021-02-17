let start = document.getElementById("start");
let status = document.getElementById("status");
let cellButton = Array.from(document.getElementsByClassName("cellButton"));

let systemStatus = true;

start.addEventListener("click", () => {
  start.disabled = true;
  status.innerText = "Player X's move..."; // can update later
  // add timer start here

  if (systemStatus) {
    for (let cell of cellButton) {
      cell.addEventListener("click", playerXTurn);
    }
  } else {
    for (let cell of cellButton) {
      cell.addEventListener("click", playerOTurn);
    }
  }
});

// play functions
function playerXTurn(event) {
  event.target.disabled = true;
  event.target.innerText = "X";
  status.innerText = "Player O's move...";
  systemStatus = true;
};

function playerOTurn(event) {
  event.target.disabled = true;
  event.target.innerText = "O";
  status.innerText = "Player X's move...";
  systemStatus = false;
};
