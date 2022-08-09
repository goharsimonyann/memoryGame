const startButton = document.querySelector("#start-btn");
const btnContainer = document.getElementById("btn-container");
const cells = document.querySelectorAll(".grid-cells");

let setContainer = new Set(),
  randomCells = [];

let level = 0,
  score = 0;

// generates random number from 0 to 11 and
function randomizer(size) {
  if (size < 6) {
    for (let i = 0; setContainer.size < size; ++i) {
      let random = Math.floor(Math.random() * 12);
      setContainer.add(random);
    }
  } else {
    for (let i = 0; setContainer.size !== 6; ++i) {
      let random = Math.floor(Math.random() * 12);
      setContainer.add(random);
    }
  }
}

//  resolves given argument after 1000ms
async function timeout(i) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(i), 1000);
  });
}

//  lights up cells with already randomly generated ids
async function draw() {
  //  removes start button and instead displays score calculator
  btnContainer.innerHTML = "";
  btnContainer.innerHTML = `<span class="score-details">Score: ${score}</span>`;

  //  every time being invoked clears the set and increases the level count
  setContainer.clear();
  level++;

  //  by invoking randomizer function generates level "hat" random number
  randomizer(level);
  //  converting set to an array as it is easier to work with an array
  randomCells = [...setContainer];

  //  this is the part where the cells light up randomly
  for (let i = 0; i < randomCells.length; ++i) {
    let id = await timeout(randomCells[i]);
    //  awaits the id to be resolved after 1000ms and lights it up
    cells[id].style.backgroundColor = "rgb(64, 64, 64)";

    //  turns off the light after 500ms
    setTimeout(
      () => (cells[id].style.backgroundColor = "rgba(34, 34, 34, 0.125)"),
      500
    );
  }

  //  adds pointer to the cells
  cells.forEach((cell) => {
    cell.addEventListener("mousemove", () => {
      cell.style.cursor = "pointer";
    });
  });
}

//  for each cell in cells node list adds event listener passing as a callback function checkMatches which will take place on every click
cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    checkMatches(cell.id, randomCells);
  });
});

//  checks if the clicked cell id is equal to generated id
function checkMatches(clickedId, randomCells) {
  if (Number(clickedId) === Number(randomCells[0])) {
    // if equal adds a score and displays it immediately
    score++;
    document.querySelector(".score-details").innerHTML = `Score: ${score}`;
    //  turns the cell green if they're equal and turns off the green light after 500ms
    cells[clickedId].style.backgroundColor = "rgb(0,204,0)";
    setTimeout(
      () =>
        (cells[clickedId].style.backgroundColor = "rgba(34, 34, 34, 0.125)"),
      500
    );
  } else {
    //  if clicked cell is wrong, cell turns red(turns off after 500ms) and stops the game
    cells[clickedId].style.backgroundColor = "rgb(210, 43, 43)";
    btnContainer.innerHTML = `<span class="score-details">Game over...Your score is: ${score}</span>`;
    cells.forEach((cell) => (cell.style.pointerEvents = "none"));
    setTimeout(
      () =>
        (cells[clickedId].style.backgroundColor = "rgba(34, 34, 34, 0.125)"),
      500
    );
  }
  //  removes the checked id which is the first element of the array
  randomCells.shift();
  //  if all cases are passed starts new level automatically
  if (randomCells.length === 0) draw();
}
