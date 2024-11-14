let currentQuestion = 0;
let questions = [];
let currentPrize = 0;


async function fetchQuestions() {
  try {
    const response = await fetch('http://localhost:3000/api/questions');
    questions = await response.json();
    showQuestion();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}
function shuffleQuestionsInLevel() {
  const currentLevelQuestions = questions.find(q => q.level === level).variants;
  shuffleArray(currentLevelQuestions);
  questions[level - 1].variants = currentLevelQuestions;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showQuestion() {
  if (currentQuestion >= 10) {
    shuffleQuestionsInLevel();
  }
  if (currentQuestion >= questions.length) {
    alert('Congratulations! You\'ve won the game!');
    return;
  }

  const question = questions[currentQuestion];
  document.getElementById('question').textContent = question.question;
  document.getElementById('current-prize').textContent = currentPrize;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    optionElement.onclick = () => checkAnswer(index);
    optionsContainer.appendChild(optionElement);
  });
}

function checkAnswer(selectedIndex) {
  const question = questions[currentQuestion];
  if (selectedIndex == question.correct) {
    currentPrize = question.prize;
    currentQuestion++;
    setTimeout(showQuestion, 1000);
    alert('Correct!');
  } else {
    alert('Game Over!');
    resetGame();
  }
}

function resetGame() {
  currentQuestion = 0;
  currentPrize = 0;
  showQuestion();

  document.getElementById('fifty-fifty').disabled = false;
  document.getElementById('phone-friend').disabled = false;
  document.getElementById('ask-audience').disabled = false;
}

// Lifeline implementations
document.getElementById('fifty-fifty').onclick = () => {
  const question = questions[currentQuestion];
  const options = document.querySelectorAll('.option');
  let removed = 0;
  let correctIndex = question.correct;

  options.forEach((option, index) => {
    if (index !== correctIndex && removed < 2) {
      option.style.visibility = 'hidden';
      removed++;
    }
  });
  
  document.getElementById('fifty-fifty').disabled = true;
};

document.getElementById('phone-friend').onclick = () => {
  const question = questions[currentQuestion];
  alert(`Your friend thinks the answer is ${String.fromCharCode(65 + question.correct)}`);
  document.getElementById('phone-friend').disabled = true;
};

document.getElementById('ask-audience').onclick = () => {
  const question = questions[currentQuestion];
  const audienceResponse = generateAudienceResponse(question.correct);
  alert(`Audience Response:\nA: ${audienceResponse[0]}%\nB: ${audienceResponse[1]}%\nC: ${audienceResponse[2]}%\nD: ${audienceResponse[3]}%`);
  document.getElementById('ask-audience').disabled = true;
};

function generateAudienceResponse(correctIndex) {
  const response = [20, 20, 20, 20];
  response[correctIndex] = 40;
  return response;
}

// Initialize the game
fetchQuestions();
