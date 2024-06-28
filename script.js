// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreTimes = {};

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time

let startTime

// check correct answers

const checkAnswers = () => {
  let wrong = 0
  for (let i=0; i < questionAmount; i++) {
    if (playerGuessArray[i] != equationsArray[i].evaluated) {
      wrong++
    }
  }
  return wrong
}

// Scroll

let valueY = 0

const select = (right) => {
  if (playerGuessArray.length < questionAmount - 1) {
    valueY += 80
    itemContainer.scroll(0, valueY)
    right ? playerGuessArray.push('true') : playerGuessArray.push('false')
  } else {
    right ? playerGuessArray.push('true') : playerGuessArray.push('false')
    showScorePage();
  }
}


// Create Correct/Incorrect Random Equations

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const shuffleArray = (array) => {
  for (let i=0; i<array.length; i++) {
    const j = getRandomInt(array.length)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function createEquations() {
  playerGuessArray = []
  equationsArray = []
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount)
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(10)
    secondNumber = getRandomInt(10)
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(10)
    secondNumber = getRandomInt(10)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue + 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  valueY = 0
  shuffleArray(equationsArray)
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.scroll(0, 0)
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();

  equationsArray.forEach((equation) => {
    const curItem = document.createElement('div')
    curItem.classList.add('item')
    const curItemEq = document.createElement('h1')
    curItemEq.textContent = equation.value
    curItem.appendChild(curItemEq)
    itemContainer.appendChild(curItem)
  })
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}


// Form that takes number of selected questions

const getRadioValue = () => {
  for (const radioEl of radioInputs) {
    if (radioEl.checked) {
      return radioEl.value
    }
  }
}

// Display Countdown 3, 2, 1, Go!

const displayTime = () =>{
  for (let i=3; i>0; i--) {
    setTimeout(() => {countdown.textContent = i}, (3-i) * 1000)
  }
  setTimeout(() => {countdown.textContent = 'GO!'}, 3000)
}

// Switch to Countdow Page
const showCountdownPage = () => {
  if (questionAmount) {
    splashPage.hidden = true
    countdownPage.hidden = false
    displayTime()
  }
}

const selectQuestionAmount = (event) => {
  event.preventDefault();
  questionAmount = getRadioValue();
  console.log(questionAmount)
  showCountdownPage();
  setTimeout(showGamePage, 4000);
}

// Show Game Page populated with equations

const showGamePage = () => {
  countdownPage.hidden = true
  gamePage.hidden = false
  populateGamePage();
  startTime = Date.now()
}

// Show Score Page

const showScorePage = () => {
  const elapsedTime = ((Date.now() - startTime)/1000);
  const wrongAnswers = checkAnswers();
  const penaltyTime = (wrongAnswers/2);
  const totalTime = (elapsedTime+penaltyTime).toFixed(1);
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime.toFixed(1)} s`
  baseTimeEl.textContent = `Time needed: ${elapsedTime.toFixed(1)} s`;
  finalTimeEl.textContent = `${totalTime} s`
  gamePage.hidden = true;
  scorePage.hidden = false;
  switch (questionAmount) {
    case '10':
      if (!bestScoreTimes.ten || bestScoreTimes.ten > totalTime) {
        bestScoreTimes.ten = totalTime
        bestScores[0].textContent = `${totalTime} s`
        console.log(bestScoreTimes)
      }
      break
      case '25':
        if (!bestScoreTimes.twentyfive || bestScoreTimes.twentyfive > totalTime) {
          bestScoreTimes.twentyfive = totalTime
          bestScores[1].textContent = `${totalTime} s`
          console.log(bestScoreTimes)
        }
        break
      case '50':
        if (!bestScoreTimes.fifty || bestScoreTimes.fifty > totalTime) {
          bestScoreTimes.fifty = totalTime
          bestScores[2].textContent = `${totalTime} s`
          console.log(bestScoreTimes)
        }
        break
      case '99':
        if (!bestScoreTimes.ninetynine || bestScoreTimes.ninetynine > totalTime) {
          bestScoreTimes.ninetynine = totalTime
          bestScores[3].textContent = `${totalTime} s`
          console.log(bestScoreTimes)
        }
        break
    default:
      break
  }
}

// Event Listeners

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    radioEl.classList.remove('selected-label')
    if(radioEl.children[1].checked) {
      radioEl.classList.add('selected-label')
    }
  })
})

startForm.addEventListener('submit', selectQuestionAmount)

playAgainBtn.addEventListener('click', () => {
  scorePage.hidden = true;
  splashPage.hidden = false;
})
