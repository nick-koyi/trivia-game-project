
// API URL for fetching trivia questions
const API_URL = 'https://opentdb.com/api.php?amount=10&difficulty=easy';

// Initialize variables
let currentQuestionIndex = 0;
let questions = [];
let score = 0; // Initialize score

// Select DOM elements
const container = document.querySelector('.container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const resultElement = document.getElementById('result');
const scoreElement = document.getElementById('score');

// Function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to fetch trivia questions from the API
function fetchQuestions() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      questions = data.results;
      startGame(); // Start the game after fetching questions
    })
    .catch((error) => console.error('Error fetching questions:', error));
}

// Function to start the game
function startGame() {
  currentQuestionIndex = 0;
  score = 0; // Reset score
  shuffle(questions);
  showQuestion(currentQuestionIndex); // Show the first question
  updateScore(); // Update score display
}

// Function to display a question
function showQuestion(index) {
  const question = decodeHtml(questions[index].question); // Decode HTML entities in question
  questionElement.textContent = question;

  optionsElement.innerHTML = ''; // Clear previous options
  const allOptions = [...questions[index].incorrect_answers, questions[index].correct_answer];
  shuffle(allOptions); // Shuffle options

  // Create a button for each option
  allOptions.forEach((option) => {
    const button = document.createElement('button');
    button.textContent = decodeHtml(option); // Decode HTML entities in options
    button.classList.add('option');
    button.addEventListener('click', () =>
      checkAnswer(option, questions[index].correct_answer)
    );
    optionsElement.appendChild(button);
  });
}

// Event listener for right arrow key to move to the next question
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    // Move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion(currentQuestionIndex);
      resultElement.textContent = '';
    } else {
      endGame(); // End the game if all questions are answered
    }
  }
});

// Function to check if the selected answer is correct
function checkAnswer(selectedOption, correctAnswer) {
  if (selectedOption === correctAnswer) {
    resultElement.textContent = 'Correct!';
    score++; // Increment score for correct answer
  } else {
    resultElement.textContent = 'Incorrect!';
  }
  updateScore(); // Update score display
}

// Function to update the score display
function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

// Function to end the game
function endGame() {
  // Display the final score
  questionElement.textContent = `Game Over! Your final score is: ${score}`;
  optionsElement.innerHTML = '';
  resultElement.textContent = '';
}

// Function to decode HTML entities
function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Event listener for the next button to move to the next question
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex);
    resultElement.textContent = '';
  } else {
    endGame(); // End the game if all questions are answered
  }
});

// Fetch trivia questions when the page loads
fetchQuestions();
