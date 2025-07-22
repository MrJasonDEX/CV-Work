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

// 2. Number Guess (already present as initGuess)

// 3. Memory Flip
function initMemory(containerId) {
  let memoryArr = ['🐶','🐶','🐱','🐱','🦊','🦊','🐸','🐸'].sort(() => 0.5 - Math.random());
  let memoryValues = [], memoryTiles = [], memoryFlipped = 0;
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary btn-lg mb-2';
    btn.style.width = '50px'; btn.style.height = '50px'; btn.style.fontSize = '1.5rem';
    btn.textContent = '❓';
    btn.onclick = (function(i) { return function() { memoryFlipTile(this, memoryArr[i]); }; })(i);
    container.appendChild(btn);
  }
  const result = document.createElement('div');
  result.id = 'memory-result';
  result.className = 'mt-2 fw-bold';
  container.appendChild(result);
  function memoryFlipTile(tile, val) {
    if (tile.textContent === '❓' && memoryValues.length < 2) {
      tile.textContent = val;
      memoryValues.push(val);
      memoryTiles.push(tile);
      if (memoryValues.length === 2) {
        if (memoryValues[0] === memoryValues[1]) {
          memoryFlipped += 2;
          memoryValues = [];
          memoryTiles = [];
          if (memoryFlipped === 8) result.textContent = "🎉 All matched!";
        } else {
          setTimeout(() => {
            memoryTiles[0].textContent = '❓';
            memoryTiles[1].textContent = '❓';
            memoryValues = [];
            memoryTiles = [];
          }, 800);
        }
      }
    }
  }
}

// 4. Tic Tac Toe
function initTTT(containerId) {
  let tttBoard = Array(9).fill('');
  let tttTurn = 'X';
  let tttOver = false;
  const container = document.getElementById(containerId);
  const emoji = {X:'❌', O:'⭕'};
  function drawTTT() {
    container.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline-primary btn-lg m-1';
      btn.style.width = '50px'; btn.style.height = '50px'; btn.style.fontSize = '1.5rem';
      btn.textContent = tttBoard[i] ? emoji[tttBoard[i]] : '';
      btn.disabled = tttBoard[i] !== '' || tttOver;
      btn.onclick = function() { tttMove(i); };
      container.appendChild(btn);
    }
    const result = document.createElement('div');
    result.id = 'ttt-result';
    result.className = 'mt-2 fw-bold';
    result.textContent = tttOver ? (tttWinner() ? `Winner: ${tttWinner()}` : "Draw!") : `Turn: ${emoji[tttTurn]}`;
    container.appendChild(result);
    const restart = document.createElement('button');
    restart.className = 'btn btn-outline-primary btn-sm mt-2';
    restart.textContent = 'Restart';
    restart.onclick = resetTTT;
    container.appendChild(restart);
  }
  function tttMove(i) {
    if (!tttBoard[i] && !tttOver) {
      tttBoard[i] = tttTurn;
      tttTurn = tttTurn === 'X' ? 'O' : 'X';
      tttOver = !!tttWinner() || tttBoard.every(x => x);
      drawTTT();
    }
  }
  function tttWinner() {
    const w = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let a of w) if (tttBoard[a[0]] && tttBoard[a[0]] === tttBoard[a[1]] && tttBoard[a[1]] === tttBoard[a[2]]) return tttBoard[a[0]] === 'X' ? '❌' : '⭕';
    return null;
  }
  function resetTTT() {
    tttBoard = Array(9).fill('');
    tttTurn = 'X';
    tttOver = false;
    drawTTT();
  }
  drawTTT();
}

// 5. Whack-a-Mole
function initWAM(containerId) {
  let wamScore = 0, wamActive = -1, wamTimer = null, wamTime = 0;
  const container = document.getElementById(containerId);
  function drawWAM() {
    container.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline-primary btn-lg m-1';
      btn.style.width = '45px'; btn.style.height = '45px'; btn.style.fontSize = '1.5rem';
      btn.textContent = wamActive === i ? '🐹' : '';
      btn.onclick = function() { if (wamActive === i) { wamScore++; wamActive = -1; drawWAM(); } };
      btn.disabled = wamTimer === null;
      container.appendChild(btn);
    }
    const score = document.createElement('div');
    score.id = 'wam-score';
    score.className = 'mt-2 fw-bold';
    score.textContent = wamTimer ? `Score: ${wamScore}` : '';
    container.appendChild(score);
    const timerbar = document.createElement('div');
    timerbar.className = 'progress my-2';
    timerbar.style.height = '10px';
    timerbar.innerHTML = `<div id='wam-timerbar' class='progress-bar bg-info' style='width:${(wamTime/15*100)}%'></div>`;
    container.appendChild(timerbar);
    const startBtn = document.createElement('button');
    startBtn.className = 'btn btn-outline-primary btn-sm mt-2';
    startBtn.textContent = wamTimer ? 'Running...' : 'Start';
    startBtn.disabled = wamTimer !== null;
    startBtn.onclick = startWAM;
    container.appendChild(startBtn);
  }
  function startWAM() {
    wamScore = 0; wamTime = 0; wamActive = -1;
    drawWAM();
    wamTimer = setInterval(() => {
      wamActive = Math.floor(Math.random() * 9);
      drawWAM();
      wamTime++;
      if (wamTime > 15) {
        clearInterval(wamTimer);
        wamTimer = null;
        wamActive = -1;
        drawWAM();
        container.querySelector('#wam-score').textContent = `Game over! Final score: ${wamScore}`;
        container.querySelector('#wam-timerbar').style.width = '0%';
      }
    }, 800);
  }
  drawWAM();
}

// 6. Simon Says (simple version)
function initSimon(containerId) {
  const colors = ['red','green','blue','yellow'];
  let sequence = [], userSeq = [], level = 0, playing = false;
  const container = document.getElementById(containerId);
  container.innerHTML = `<div id='simon-board' class='d-flex flex-wrap justify-content-center mb-3'></div><div id='simon-status' class='fw-bold mb-2'></div><button class='btn btn-primary' id='simon-start'>Start</button>`;
  const board = container.querySelector('#simon-board');
  function drawBoard() {
    board.innerHTML = '';
    colors.forEach((color,i) => {
      const btn = document.createElement('button');
      btn.className = 'btn m-1';
      btn.style.background = color;
      btn.style.width = '60px'; btn.style.height = '60px';
      btn.onclick = () => { if (playing) handleUser(i); };
      board.appendChild(btn);
    });
  }
  function nextLevel() {
    userSeq = [];
    sequence.push(Math.floor(Math.random()*4));
    level++;
    showSequence();
    container.querySelector('#simon-status').textContent = `Level ${level}`;
  }
  function showSequence() {
    let i = 0;
    playing = false;
    const interval = setInterval(() => {
      highlightBtn(sequence[i]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        playing = true;
      }
    }, 700);
  }
  function highlightBtn(idx) {
    const btns = board.querySelectorAll('button');
    btns[idx].style.opacity = '0.5';
    setTimeout(() => { btns[idx].style.opacity = '1'; }, 350);
  }
  function handleUser(idx) {
    userSeq.push(idx);
    if (userSeq[userSeq.length-1] !== sequence[userSeq.length-1]) {
      container.querySelector('#simon-status').textContent = `Game Over! Reached Level ${level}`;
      playing = false;
      return;
    }
    if (userSeq.length === sequence.length) {
      setTimeout(nextLevel, 800);
    }
  }
  container.querySelector('#simon-start').onclick = function() {
    sequence = [];
    userSeq = [];
    level = 0;
    playing = false;
    nextLevel();
  };
  drawBoard();
}

// 7. Snake (simple version)
function initSnake(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<canvas id='snake-canvas' width='300' height='300' style='background:#222;display:block;margin:auto;'></canvas><div id='snake-score' class='mt-2 text-center'></div>`;
  const canvas = container.querySelector('#snake-canvas');
  const ctx = canvas.getContext('2d');
  let snake = [{x:8,y:8}], dir = {x:1,y:0}, food = {x:5,y:5}, score = 0, running = true;
  function draw() {
    ctx.fillStyle = '#222'; ctx.fillRect(0,0,300,300);
    ctx.fillStyle = 'lime';
    snake.forEach(s => ctx.fillRect(s.x*15,s.y*15,15,15));
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x*15,food.y*15,15,15);
    container.querySelector('#snake-score').textContent = `Score: ${score}`;
  }
  function move() {
    if (!running) return;
    const head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
    if (head.x<0||head.x>19||head.y<0||head.y>19||snake.some(s=>s.x===head.x&&s.y===head.y)) {
      running = false;
      container.querySelector('#snake-score').textContent = `Game Over! Final Score: ${score}`;
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      food = {x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)};
    } else {
      snake.pop();
    }
    draw();
  }
  function key(e) {
    if (e.key==='ArrowUp'&&dir.y!==1) dir={x:0,y:-1};
    else if (e.key==='ArrowDown'&&dir.y!==-1) dir={x:0,y:1};
    else if (e.key==='ArrowLeft'&&dir.x!==1) dir={x:-1,y:0};
    else if (e.key==='ArrowRight'&&dir.x!==-1) dir={x:1,y:0};
  }
  document.addEventListener('keydown', key);
  draw();
  let interval = setInterval(move, 120);
  const modal = container.closest('.modal');
  if (modal) {
    modal.addEventListener('hidden.bs.modal', function() {
      clearInterval(interval);
      document.removeEventListener('keydown', key);
    }, {once:true});
  }
}

// 8. Wordle (very simple version)
function initWordle(containerId) {
  const words = ['APPLE','SNAKE','ROBOT','GAMES','WORLD','CHAIR','MOUSE','PLANT'];
  const answer = words[Math.floor(Math.random()*words.length)];
  let tries = 0;
  const container = document.getElementById(containerId);
  container.innerHTML = `<div id='wordle-board'></div><input id='wordle-input' maxlength='5' class='form-control text-uppercase text-center my-2' style='width:120px;display:inline-block;'><button class='btn btn-primary ms-2' id='wordle-guess'>Guess</button><div id='wordle-status' class='mt-2'></div>`;
  const board = container.querySelector('#wordle-board');
  function guess() {
    const val = container.querySelector('#wordle-input').value.toUpperCase();
    if (val.length !== 5) return;
    tries++;
    let row = '';
    for (let i=0;i<5;i++) {
      if (val[i] === answer[i]) row += `<span style='color:lime;font-weight:bold;'>${val[i]}</span>`;
      else if (answer.includes(val[i])) row += `<span style='color:gold;'>${val[i]}</span>`;
      else row += `<span style='color:#888;'>${val[i]}</span>`;
    }
    board.innerHTML += `<div>${row}</div>`;
    if (val === answer) {
      container.querySelector('#wordle-status').textContent = `🎉 Correct! The word was ${answer}`;
      container.querySelector('#wordle-guess').disabled = true;
    } else if (tries >= 6) {
      container.querySelector('#wordle-status').textContent = `Game Over! The word was ${answer}`;
      container.querySelector('#wordle-guess').disabled = true;
    }
    container.querySelector('#wordle-input').value = '';
  }
  container.querySelector('#wordle-guess').onclick = guess;
}

// 9. 2048 (very simple 4x4 version)
function init2048(containerId) {
  const container = document.getElementById(containerId);
  let board = Array(16).fill(0);
  function addTile() {
    let empty = board.map((v,i)=>v===0?i:null).filter(x=>x!==null);
    if (empty.length) board[empty[Math.floor(Math.random()*empty.length)]] = Math.random()<0.9?2:4;
  }
  function draw() {
    container.innerHTML = '<div class="d-flex flex-wrap" style="width:220px;">'+board.map((v,i)=>`<div style='width:50px;height:50px;line-height:50px;text-align:center;margin:2px;background:#eee;font-weight:bold;font-size:1.2rem;border-radius:6px;'>${v||''}</div>`).join('')+'</div>';
    container.innerHTML += '<div class="mt-2">Use arrow keys to move. Get to 2048!</div>';
  }
  function move(dir) {
    let moved = false;
    let rows = [0,4,8,12];
    let cols = [0,1,2,3];
    function slide(arr) {
      let vals = arr.map(i=>board[i]).filter(v=>v);
      for (let i=0;i<vals.length-1;i++) if (vals[i]===vals[i+1]) {vals[i]*=2;vals[i+1]=0;}
      vals = vals.filter(v=>v);
      while (vals.length<4) vals.push(0);
      return vals;
    }
    if (dir==='left') rows.forEach(r=>{let s=slide([r,r+1,r+2,r+3]);for(let i=0;i<4;i++)if(board[r+i]!==s[i]){moved=true;board[r+i]=s[i];}});
    if (dir==='right') rows.forEach(r=>{let s=slide([r+3,r+2,r+1,r]);s.reverse();for(let i=0;i<4;i++)if(board[r+i]!==s[i]){moved=true;board[r+i]=s[i];}});
    if (dir==='up') cols.forEach(c=>{let s=slide([c,c+4,c+8,c+12]);for(let i=0;i<4;i++)if(board[c+i*4]!==s[i]){moved=true;board[c+i*4]=s[i];}});
    if (dir==='down') cols.forEach(c=>{let s=slide([c+12,c+8,c+4,c]);s.reverse();for(let i=0;i<4;i++)if(board[c+i*4]!==s[i]){moved=true;board[c+i*4]=s[i];}});
    if (moved) addTile();
    draw();
  }
  function key(e) {
    if (e.key==='ArrowLeft') move('left');
    else if (e.key==='ArrowRight') move('right');
    else if (e.key==='ArrowUp') move('up');
    else if (e.key==='ArrowDown') move('down');
  }
  board = Array(16).fill(0); addTile(); addTile(); draw();
  document.addEventListener('keydown', key);
  const modal = container.closest('.modal');
  if (modal) {
    modal.addEventListener('hidden.bs.modal', function() {
      document.removeEventListener('keydown', key);
    }, {once:true});
  }
}

// 10. Minesweeper (very simple 5x5 version)
function initMinesweeper(containerId) {
  const size = 5, mines = 5;
  let board = Array(size*size).fill(0), revealed = Array(size*size).fill(false), mineSet = new Set();
  const container = document.getElementById(containerId);
  // Place mines
  while (mineSet.size < mines) mineSet.add(Math.floor(Math.random()*size*size));
  mineSet.forEach(i=>board[i]=-1);
  // Set numbers
  for (let i=0;i<size*size;i++) if (board[i]!==-1) {
    let n=0;[-1,0,1].forEach(dx=>[-1,0,1].forEach(dy=>{
      let x=i%size+dx,y=Math.floor(i/size)+dy;
      if(x>=0&&x<size&&y>=0&&y<size&&board[y*size+x]===-1)n++;
    }));
    board[i]=n;
  }
  function draw() {
    container.innerHTML = '<div class="d-flex flex-wrap" style="width:140px;">'+board.map((v,i)=>`<button class='btn btn-sm m-1' style='width:24px;height:24px;padding:0;font-size:1rem;' ${revealed[i]?'disabled':''}>${revealed[i]?(v===-1?'💣':(v||'')):'❓'}</button>`).join('')+'</div>';
    const btns = container.querySelectorAll('button');
    btns.forEach((btn,i)=>{
      btn.onclick = function() {
        revealed[i]=true;
        if (board[i]===-1) {
          btn.textContent = '💥';
          btn.classList.add('btn-danger');
          btn.disabled = true;
          setTimeout(()=>{draw();container.innerHTML+='<div class="mt-2">Game Over!</div>';},500);
        } else {
          draw();
          if (revealed.filter((v,idx)=>!v&&board[idx]!==-1).length===0) container.innerHTML+='<div class="mt-2">You Win!</div>';
        }
      };
    });
  }
  draw();
}

// --- MODAL INIT HANDLER ---
document.addEventListener('DOMContentLoaded', function() {
  // Rock Paper Scissors
  const rpsModal = document.getElementById('modalRPS');
  if (rpsModal) {
    rpsModal.addEventListener('shown.bs.modal', function() {
      initRPS('rps-modal-game');
    });
  }
  // Number Guess
  const guessModal = document.getElementById('modalGuess');
  if (guessModal) {
    guessModal.addEventListener('shown.bs.modal', function() {
      initGuess('guess-modal-game');
    });
  }
  // Memory Flip
  const memoryModal = document.getElementById('modalMemory');
  if (memoryModal) {
    memoryModal.addEventListener('shown.bs.modal', function() {
      initMemory('memory-modal-game');
    });
  }
  // Tic Tac Toe
  const tttModal = document.getElementById('modalTTT');
  if (tttModal) {
    tttModal.addEventListener('shown.bs.modal', function() {
      initTTT('ttt-modal-game');
    });
  }
  // Whack-a-Mole
  const wamModal = document.getElementById('modalWAM');
  if (wamModal) {
    wamModal.addEventListener('shown.bs.modal', function() {
      initWAM('wam-modal-game');
    });
  }
  // Simon Says
  const simonModal = document.getElementById('modalSimon');
  if (simonModal) {
    simonModal.addEventListener('shown.bs.modal', function() {
      initSimon('simon-modal-game');
    });
  }
  // Snake
  const snakeModal = document.getElementById('modalSnake');
  if (snakeModal) {
    snakeModal.addEventListener('shown.bs.modal', function() {
      initSnake('snake-modal-game');
    });
  }
  // Wordle
  const wordleModal = document.getElementById('modalWordle');
  if (wordleModal) {
    wordleModal.addEventListener('shown.bs.modal', function() {
      initWordle('wordle-modal-game');
    });
  }
  // 2048
  const g2048Modal = document.getElementById('modal2048');
  if (g2048Modal) {
    g2048Modal.addEventListener('shown.bs.modal', function() {
      init2048('game2048-modal-game');
    });
  }
  // Minesweeper
  const minesweeperModal = document.getElementById('modalMinesweeper');
  if (minesweeperModal) {
    minesweeperModal.addEventListener('shown.bs.modal', function() {
      initMinesweeper('minesweeper-modal-game');
    });
  }
});