let board = null;
let game = new Chess();
let stockfish = STOCKFISH();
let skill = 5;

document.getElementById('skill').oninput = e => {
  skill = e.target.value;
  document.getElementById('skillLabel').textContent = skill;
};

document.getElementById('startBtn').onclick = startGame;

function startGame() {
  game.reset();
  board.start();
  stockfish.postMessage('uci');
  stockfish.postMessage('setoption name Skill Level value ' + skill);
  stockfish.postMessage('ucinewgame');
}

function onDragStart(source, piece) {
  if (game.game_over() || piece.search(/^b/) !== -1) return false;
}

function makeBestMove() {
  stockfish.postMessage('position fen ' + game.fen());
  stockfish.postMessage('go depth 15');
}

stockfish.onmessage = function(event) {
  const line = event.data || event;
  if (line.startsWith('bestmove')) {
    const move = line.split(' ')[1];
    game.move({ from: move.substring(0, 2), to: move.substring(2, 4), promotion: 'q' });
    board.position(game.fen());
  }
};

function onDrop(source, target) {
  let move = game.move({ from: source, to: target, promotion: 'q' });

  if (move === null) return 'snapback';
  board.position(game.fen());
  window.setTimeout(makeBestMove, 250);
}

function onSnapEnd() {
  board.position(game.fen());
}

const config = {
  draggable: true,
  position: 'start',
  onDragStart,
  onDrop,
  onSnapEnd
};

board = Chessboard('board', config);
