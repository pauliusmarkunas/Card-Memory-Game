// SELECTORS

// SECTiONS
const gameSection = document.querySelector(".game-container");
const statusSection = document.querySelector(".status-container");
const initialSection = document.querySelector(".game-rules");
const gameOverSection = document.querySelector(".game-over-container");
const levelWinSection = document.querySelector(".win-container");

// BUTTONS
const startGameBtn = document.querySelector(".start-game-btn");
const backToStartBtn = document.querySelector(".back-to-start-btn");
const nextLvlBtn = document.querySelector(".next-lvl-btn");

// STATUS
const level = document.querySelector(".level b");
const leftCards = document.querySelector(".left-card-pairs b");
const timeLeft = document.querySelector(".time-left b");

// ADDITIONAL FUNCTIONALITIES
const audioMuteBtn = document.querySelector("#music-toggle");
const bgAudioEl = document.querySelector("#background-audio");

// DATA

// card set number, time in sec, time to observe before game
const levelData = [
  [4, 10, 2],
  [4, 25, 5],
  [4, 20, 5],
  [6, 30, 5],
  [6, 25, 5],
  [8, 40, 5],
  [8, 35, 4],
  [8, 30, 4],
  [8, 25, 2],
  [8, 20, 2],
  [8, 15, 1],
];

const gameStats = {
  level: 0,
  pairsLeft: levelData[0][0],
  timeLeft: "?",
};
console.log(levelData);

// HELPER FUNCTIONS

// GENERATED RANDOMLY ALLOCATED NUMBERS ARRAY FROM 0 TO X
function createMixedArray(cardSetNumber) {
  // Create an array with two sets of numbers from 1 to cardSetNumber
  const array = [];
  for (let i = 1; i <= cardSetNumber; i++) {
    array.push(i, i);
  }

  // Shuffle the array randomly using Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }

  return array;
}

function insertNewCards(number) {
  gameSection.innerHTML = "";
  const randomArr = createMixedArray(number);
  randomArr.forEach((el) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const cardEl = document.createElement("img");
    cardEl.id = `el${el}`;
    cardEl.src = `/assets/cards/${el}.svg`;
    cardEl.classList.add("card-el");
    card.append(cardEl);
    gameSection.append(card);
  });
}

function turnOverCards() {
  Array.from(gameSection.querySelectorAll(".card-el")).forEach((e) =>
    e.classList.add("removed-el")
  );
}

function playNewMusic(name) {
  bgAudioEl.src = `/assets/music/${name}.mp3`;
  bgAudioEl.play();
}

function startGame() {
  playNewMusic(`${gameStats.level}`);
  initialSection.classList.add("removed-el");
  gameSection.classList.remove("removed-el");
  statusSection.classList.remove("removed-el");
  level.textContent = `${gameStats.level}`;
  leftCards.textContent = `${gameStats.pairsLeft}`;
  timeLeft.textContent = `${gameStats.timeLeft}`;
  insertNewCards(levelData[gameStats.level][0]);
  setTimeout(mainGamePart, levelData[gameStats.level][2] * 1000);
}

function mainGamePart() {
  turnOverCards();
  let timer = levelData[gameStats.level][1];
  const intervalId = setInterval(() => {
    if (timer > 0 && gameStats.pairsLeft > 0) {
      timer--;
      timeLeft.textContent = `${timer}`;
    } else if (gameStats.pairsLeft <= 0) clearInterval(intervalId);
    else {
      clearInterval(intervalId);
      gameOver();
    }
  }, 1000);
}

function gameOver() {
  playNewMusic("game-over");
  gameSection.classList.add("removed-el");
  statusSection.classList.add("removed-el");
  gameOverSection.classList.remove("removed-el");
}

// MAIN EVENT LISTENERS

// Initial setup:
window.addEventListener("load", () => {
  const audio = document.getElementById("background-audio");
  if (audio.paused) {
    audio.play();
  }
  gameSection.classList.add("removed-el");
  statusSection.classList.add("removed-el");
});

// STARTING THE GAME
startGameBtn.addEventListener("click", startGame);

// MAIN GAME LOGIC
let firstCard = true;
let firstCardEl;
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("card") &&
    e.target.firstElementChild.classList.contains("removed-el")
  ) {
    const clickedCardsChildEl = e.target.firstElementChild;
    clickedCardsChildEl.classList.remove("removed-el");
    // e.target.style.backgroundColor = "red";
    if (firstCard) {
      firstCard = false;
      firstCardEl = clickedCardsChildEl;
    } else {
      firstCard = true;
      const secondCardEl = clickedCardsChildEl;

      if (firstCardEl.id !== secondCardEl.id) {
        setTimeout(() => {
          firstCardEl.classList.add("removed-el");
          secondCardEl.classList.add("removed-el");
        }, 500);
      } else {
        gameStats.pairsLeft--;
        leftCards.textContent = `${gameStats.pairsLeft}`;
        firstCardEl.parentNode.style.backgroundColor = "green";
        secondCardEl.parentNode.style.backgroundColor = "green";
      }
    }
    if (gameStats.pairsLeft === 0) {
      playNewMusic("congrads");
      levelWinSection.classList.remove("removed-el");
      gameSection.classList.add("removed-el");
      statusSection.classList.add("removed-el");
      // THIS ALL PART SHOULD BE SEPARATED INTO DIFFERENT FUNCTIONS
      gameStats.level++;
    }
  }
});

// going back to main menu after loosing
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("back-to-start-btn")) {
    initialSection.classList.remove("removed-el");
    gameOverSection.classList.add("removed-el");
    playNewMusic("menu-audio");
    // dublicates
    levelWinSection.classList.add("removed-el");
  }
});

// start next level
nextLvlBtn.addEventListener("click", () => {
  startGame();
  levelWinSection.classList.add("removed-el");
  gameStats.pairsLeft = levelData[gameStats.level][0];
  gameStats.timeLeft = levelData[gameStats.level][1];
});

// OTHER EVENT LISTENERS

// audio toggle on off
audioMuteBtn.addEventListener("click", () => {
  if (!bgAudioEl.paused) {
    bgAudioEl.pause();
    audioMuteBtn.textContent = "Turn On Music";
  } else {
    bgAudioEl.play();
    audioMuteBtn.textContent = "Turn Off Music";
  }
});

// GAME LOGIC(main part)
// check for click event on any of the cards.
// if card is not opened, open it. If it is second card, compare it, if not, wait for 2nd
// how to identify cards. how to compare thema
