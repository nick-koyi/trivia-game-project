const API_URL = 'https://opentdb.com/api.php?amount=10&difficulty=easy';

let currentQuestionIndex = 0;
let questions = [];

const container = document.querySelector('.container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const resultElement = document.getElementById('result');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function fetchQuestions() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      questions = data.results;
      startGame();
      console.log(data);
    })
    .catch((error) => console.error('Error fetching questions:', error));
}

function startGame() {
  currentQuestionIndex = 0;
  shuffle(questions);
  showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
  const question = questions[index];
  questionElement.textContent = question.question;

  optionsElement.innerHTML = '';
  const allOptions = [...question.incorrect_answers, question.correct_answer];
  shuffle(allOptions);

  allOptions.forEach((option) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option');
    button.addEventListener('click', () =>
      checkAnswer(option, question.correct_answer)
    );
    optionsElement.appendChild(button);
  });
}

function checkAnswer(selectedOption, correctAnswer) {
  if (selectedOption === correctAnswer) {
    resultElement.textContent = 'Correct!';
  } else {
    resultElement.textContent = 'Incorrect!';
  }
}

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex);
    resultElement.textContent = '';
  } else {
    container.innerHTML = '<h2>Game Over!</h2>';
  }
});

fetchQuestions();
