// SELECTORS

// SECTiONS
const gameSection = document.querySelector(".game-container");
const statusSection = document.querySelector(".status-container");
const initialSection = document.querySelector(".game-rules");
const gameOverSection = document.querySelector(".game-over-container");
const levelWinSection = document.querySelector(".win-container");
const gameWinSection = document.querySelector(".game-win-container");

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
const root = document.documentElement;

// DATA

// card set number, time in sec, time to observe before game
const levelData = [
  [4, 20, 3],
  [4, 15, 3],
  [4, 10, 3],
  [6, 25, 5],
  [6, 20, 5],
  [8, 40, 5],
  [8, 35, 5],
  [8, 30, 4],
  [8, 25, 4],
  [8, 20, 3],
  [8, 15, 2],
  [12, 40, 4],
  [12, 30, 4],
  [16, 30, 3],
  [16, 25, 2],
];

const gameStats = {};
console.log(levelData);

// HELPER FUNCTIONS
function gameStatsSet(level) {
  Object.assign(gameStats, {
    level: level,
    leftCards: levelData[level][0],
    timeLeft: levelData[level][1],
    countdown: levelData[level][2],
  });
}

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

function setGridNum(number) {
  if (number >= 6 && number < 8) {
    root.style.setProperty("--mobile-grid-columns", "repeat(4, 1fr)");
  } else if (number >= 8 && number < 12) {
    root.style.setProperty("--mobile-grid-columns", "repeat(4, 1fr)");
  } else if (number >= 12) {
    root.style.setProperty("--desktop-grid-columns", "repeat(8, 1fr)");
  }
}

function insertNewCards(number) {
  setGridNum(number);
  gameSection.innerHTML = "";
  const randomArr = createMixedArray(number);
  randomArr.forEach((el) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const cardEl = document.createElement("img");
    cardEl.id = `el${el}`;
    cardEl.src = `assets/cards/${el}.svg`;
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

// add argument for attribute 'loop', by deffault it should be on
function playNewMusic(name, isLoop = true) {
  bgAudioEl.loop = isLoop;
  bgAudioEl.src = `assets/music/${name}.mp3`;
  bgAudioEl.play();
}

function startGame() {
  playNewMusic(`${gameStats.level}`);
  initialSection.classList.add("removed-el");
  gameSection.classList.remove("removed-el");
  statusSection.classList.remove("removed-el");
  level.textContent = `${gameStats.level}`;
  leftCards.textContent = `${gameStats.leftCards}`;
  timeLeft.textContent = `${gameStats.timeLeft}`;
  insertNewCards(gameStats.leftCards);
  setTimeout(mainGamePart, gameStats.countdown * 1000);
}

function mainGamePart() {
  turnOverCards();
  let timer = gameStats.timeLeft;
  const intervalId = setInterval(() => {
    if (timer > 0 && gameStats.leftCards > 0) {
      timer--;
      timeLeft.textContent = `${timer}`;
    } else if (gameStats.leftCards <= 0) clearInterval(intervalId);
    else {
      clearInterval(intervalId);
      gameOver();
    }
  }, 1000);
}

function gameOver() {
  playNewMusic("game-over", false);
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
startGameBtn.addEventListener("click", () => {
  gameStatsSet(0);
  startGame();
});

// MAIN GAME LOGIC
let firstCard = true;
let firstCardEl = null;
let isLocked = false;
document.addEventListener("click", (e) => {
  if (isLocked) return 0;
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
      isLocked = true;
      if (firstCardEl.id !== secondCardEl.id) {
        setTimeout(() => {
          firstCardEl.classList.add("removed-el");
          secondCardEl.classList.add("removed-el");
          isLocked = false;
        }, 300);
      } else {
        gameStats.leftCards--;
        leftCards.textContent = `${gameStats.leftCards}`;
        firstCardEl.parentNode.style.backgroundColor = "green";
        secondCardEl.parentNode.style.backgroundColor = "green";
        isLocked = false;
      }
    }
    if (gameStats.leftCards === 0) {
      gameStats.level++;
      if (gameStats.level === levelData.length) {
        gameWinSection.classList.remove("removed-el");
        gameSection.classList.add("removed-el");
        statusSection.classList.add("removed-el");
      } else {
        playNewMusic("congrads", false);
        levelWinSection.classList.remove("removed-el");
        gameSection.classList.add("removed-el");
        statusSection.classList.add("removed-el");
        // THIS ALL PART SHOULD BE SEPARATED INTO DIFFERENT FUNCTIONS
      }
    }
  }
});

// going back to main menu
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("back-to-start-btn")) {
    initialSection.classList.remove("removed-el");
    gameOverSection.classList.add("removed-el");
    playNewMusic("menu-audio");
    // dublicates
    levelWinSection.classList.add("removed-el");
    gameWinSection.classList.add("removed-el");
  }
});

// start next level
nextLvlBtn.addEventListener("click", () => {
  gameStatsSet(gameStats.level);
  startGame();
  levelWinSection.classList.add("removed-el");
  gameStats.leftCards = levelData[gameStats.level][0];
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

// BUGS:
// condition: when player selects incorrect card pair and selects other one right awway
//outcome: one of the cards opens and stays open during the game
// Expected outcome: Both incorrect cards should be closed every time.
