let questions = [];
let currentPrize = 0;
let level = 1;
let currentQuestionIndex = 0;

const currentQuestion = {
  level: 0,
  question: "",
  options: ["", "", "", ""],
  correct: 0,
  prize: 0
};

// Fetch questions from API
async function fetchQuestions() {
  try {
    const response = await fetch('http://localhost:3000/api/questions');
    questions = await response.json();
    showQuestion();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Shuffle questions within the current level
function shuffleQuestionsInLevel() {
  const currentLevelQuestions = questions.filter(q => q.level === level);
  shuffleArray(currentLevelQuestions);
  return currentLevelQuestions[0];
}

// Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Show a question on the UI
function showQuestion() {
  const temp = shuffleQuestionsInLevel();
  
  if (!temp) {
    alert("Congratulations! You've won the game!");
    resetGame();
    return;
  }

  currentQuestion.level = temp.level;
  currentQuestion.question = temp.question;
  currentQuestion.options = temp.options;
  currentQuestion.correct = temp.correct;
  currentQuestion.prize = temp.prize;

  document.getElementById('question').textContent = currentQuestion.question;
  document.getElementById('current-prize').textContent = currentPrize;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  currentQuestion.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    optionElement.onclick = () => checkAnswer(index);
    optionsContainer.appendChild(optionElement);
  });
}

// Check the selected answer
function checkAnswer(selectedIndex) {
  if (selectedIndex === currentQuestion.correct) {
    currentPrize = currentQuestion.prize;
    if (level >= 15) {
      alert('Congratulations! You\'ve won the game!');
      resetGame();
    } else {
      level++;
      setTimeout(showQuestion, 1000);
      alert('Correct!');
    }
  } else {
    alert('Game Over!');
    resetGame();
  }
}

// Reset the game
function resetGame() {
  level = 1;
  currentPrize = 0;
  showQuestion();

  // Reset lifelines
  document.getElementById('fifty-fifty').style.backgroundColor = "#000099"; 
  document.getElementById('phone-friend').style.backgroundColor = "#000099"; 
  document.getElementById('ask-audience').style.backgroundColor = "#000099"; 
  document.getElementById('fifty-fifty').disabled = false;
  document.getElementById('phone-friend').disabled = false;
  document.getElementById('ask-audience').disabled = false;
}

// Lifeline implementations
document.getElementById('fifty-fifty').onclick = () => {
  const options = document.querySelectorAll('.option');
  let removed = 0;
  const correctIndex = currentQuestion.correct;

  options.forEach((option, index) => {
    if (index !== correctIndex && removed < 2) {
      option.style.visibility = 'hidden';
      removed++;
    }
  });
  document.getElementById('fifty-fifty').style.backgroundColor = "lightgray";
  document.getElementById('fifty-fifty').disabled = true;
};

document.getElementById('phone-friend').onclick = () => {
  const isCorrect = Math.random() < 0.75; // 75% chance to be correct
  const guessedAnswer = isCorrect ? currentQuestion.correct : (currentQuestion.correct + 1) % 4;
  alert(`Your friend thinks the answer is ${String.fromCharCode(65 + guessedAnswer)}`);
  document.getElementById('phone-friend').style.backgroundColor = "lightgray";
  document.getElementById('phone-friend').disabled = true;
};

document.getElementById('ask-audience').onclick = () => {
  const audienceResponse = generateAudienceResponse(currentQuestion.correct);
  alert(`Audience Response:\nA: ${audienceResponse[0]}%\nB: ${audienceResponse[1]}%\nC: ${audienceResponse[2]}%\nD: ${audienceResponse[3]}%`);
  document.getElementById('ask-audience').style.backgroundColor = "lightgray";
  document.getElementById('ask-audience').disabled = true;
};

function generateAudienceResponse(correctIndex) {
  const response = [0,0,0,0];
  for(var i = 0; i < 100; i++) {
    const num = Math.floor(Math.random() * 100);
    if (num <= 30) response[correctIndex]++;
    else {
      const num2 = Math.floor(Math.random() * 4);
      if (num2 != correctIndex) response[num2]++;
      else i--;
    }
  }
  return response;
}

// Initialize the game
fetchQuestions();
