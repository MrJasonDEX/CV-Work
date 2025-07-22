// Smooth scroll for anchor links (ignore navbar toggler)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    // Only smooth scroll if not a navbar toggler
    if (!this.classList.contains('navbar-toggler')) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
  });
});

// Dynamic nav link highlighting on scroll
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));
window.addEventListener('scroll', () => {
  let current = sections[0];
  sections.forEach((section, i) => {
    if (section && window.scrollY >= section.offsetTop - 120) {
      current = section;
      navLinks.forEach(l => l.classList.remove('active'));
      if (navLinks[i]) navLinks[i].classList.add('active');
    }
  });
});

// Fade-in animation on scroll
const fadeEls = document.querySelectorAll('.section, .project-card, .about-card');
const fadeInOnScroll = () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('DOMContentLoaded', () => {
  fadeEls.forEach(el => el.classList.add('fade-in'));
  fadeInOnScroll();
});

// Modal accessibility (Bootstrap handles focus trap)
// Optionally, you can add more ARIA enhancements here

// --- MINI GAMES LOGIC FOR MODALS ---
// 1. Rock Paper Scissors
function initRPS(containerId) {
  let rpsScore = {win:0, lose:0, draw:0};
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class='mb-2'>
      <button class='btn btn-primary btn-lg mx-1' id='rps-rock'>✊</button>
      <button class='btn btn-primary btn-lg mx-1' id='rps-paper'>✋</button>
      <button class='btn btn-primary btn-lg mx-1' id='rps-scissors'>✌️</button>
    </div>
    <div id='rps-result' class='mt-2 fw-bold'></div>
    <div id='rps-score' class='mt-1 small'></div>
  `;
  function playRPS(user) {
    const choices = ['rock', 'paper', 'scissors'];
    const emoji = {rock:'✊', paper:'✋', scissors:'✌️'};
    const comp = choices[Math.floor(Math.random() * 3)];
    let result = '';
    if (user === comp) { result = "It's a draw!"; rpsScore.draw++; }
    else if ((user === 'rock' && comp === 'scissors') || (user === 'paper' && comp === 'rock') || (user === 'scissors' && comp === 'paper')) { result = 'You win!'; rpsScore.win++; }
    else { result = 'You lose!'; rpsScore.lose++; }
    container.querySelector('#rps-result').innerHTML = `You: <b>${emoji[user]}</b> | Computer: <b>${emoji[comp]}</b><br><b>${result}</b>`;
    container.querySelector('#rps-score').innerHTML = `Wins: ${rpsScore.win} | Losses: ${rpsScore.lose} | Draws: ${rpsScore.draw}`;
  }
  container.querySelector('#rps-rock').onclick = () => playRPS('rock');
  container.querySelector('#rps-paper').onclick = () => playRPS('paper');
  container.querySelector('#rps-scissors').onclick = () => playRPS('scissors');
}

// 2. Number Guess
function initGuess(containerId) {
  let guessNumber = Math.floor(Math.random() * 20) + 1;
  let guessTries = 0;
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <input type='number' id='guess-input' class='form-control form-control-lg mb-2 text-center' placeholder='1-20' min='1' max='20' style='width:100px;display:inline-block;'>
    <button class='btn btn-primary btn-lg' id='guess-btn'>Guess</button>
    <div id='guess-result' class='mt-2 fw-bold'></div>
    <button class='btn btn-outline-primary btn-sm mt-2' id='guess-restart'>Restart</button>
  `;
  function checkGuess() {
    const val = parseInt(container.querySelector('#guess-input').value, 10);
    guessTries++;
    if (val === guessNumber) {
      container.querySelector('#guess-result').innerHTML = `🎉 Correct in ${guessTries} tries! Number reset.`;
      resetGuess();
    } else if (val > guessNumber) {
      container.querySelector('#guess-result').innerHTML = "Too high!";
    } else if (val < guessNumber) {
      container.querySelector('#guess-result').innerHTML = "Too low!";
    } else {
      container.querySelector('#guess-result').innerHTML = "Enter a number 1-20.";
    }
  }
  function resetGuess() {
    guessNumber = Math.floor(Math.random() * 20) + 1;
    guessTries = 0;
    container.querySelector('#guess-input').value = '';
    container.querySelector('#guess-result').innerHTML = '';
  }
  container.querySelector('#guess-btn').onclick = checkGuess;
  container.querySelector('#guess-restart').onclick = resetGuess;
}

// TODO: Add similar modular functions for Memory Flip, Tic Tac Toe, Whack-a-Mole, and new games.

// --- MODAL INIT HANDLER ---
document.addEventListener('DOMContentLoaded', function() {
  // Rock Paper Scissors
  const rpsModal = document.getElementById('modalRPS');
  if (rpsModal) {
    rpsModal.addEventListener('shown.bs.modal', function() {
      initRPS('rps-modal-game');
    });
  }
  // Number Guess (if you add a modal for it)
  // const guessModal = document.getElementById('modalGuess');
  // if (guessModal) {
  //   guessModal.addEventListener('shown.bs.modal', function() {
  //     initGuess('guess-modal-game');
  //   });
  // }
  // TODO: Add event listeners for other games
});