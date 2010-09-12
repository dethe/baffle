//  Baffle is like Boggle with a hexagonal board:
//
//     0  1  2
//   3  4   5  6
// 7  8   9  10  11
//  12 13  14  15
//    16  17 18
// fisherYates shuffle from http://sedition.com/perl/javascript-fy.html

function random(a,b){
    // 'Returns an integer between a and b, inclusive';
    // 'If b is not specified, returns an integer between 0 and a';
    if (b === undefined){
        b = a;
        a = 0;
    }
    return Math.floor(Math.random() * (b-a + 1)) + a;
}

function exchange(arr, i, j){
    var temp = [arr[i], arr[j]];
    arr[j] = temp[0];
    arr[i] = temp[1];
}

function shuffle(arr){
    arr.forEach(function(_, idx){
        exchange(arr, idx, random(arr.length - 1));
    });
    return arr;
};

// Define the boggle dice:
var default_dice = ['QHIMNU', 'AOOTTW', 'ACHOPS', 'DEILRX', 'ABEEGN', 'CMTIOU', 'WHTREV', 'EENIUS', 'WEEHNG', 'SSTIOE', 'OOBBAJ', 'IDTSYT', 'PFSFAK', 'RNHLNZ', 'LYRDEV', 'TYTREL', 'ACDORS', 'EBNITS', 'LEAMGI'];

for (var i = 0; i < default_dice.length; i++) {
  var die = default_dice[i];
  default_dice[i] = die.split('');
}

function shake(dice) {
    dice.forEach(shuffle);
    return shuffle(dice);
};

function display(board) {
  display_row(board.slice(0, 3));
  display_row(board.slice(3, 7));
  display_row(board.slice(7, 12));
  display_row(board.slice(12, 16));
  return display_row(board.slice(16, 19));
};

function display_row(row) {
  var l, sys;
  // sys = require('sys');
  l = row.length;
  if (l === 3) {
    return sys.puts(("    " + (row[0]) + "  " + (row[1]) + "  " + (row[2])));
  } else if (l === 4) {
    return sys.puts(("  " + (row[0]) + "  " + (row[1]) + "  " + (row[2]) + "  " + (row[3])));
  } else if (l === 5) {
    return sys.puts(("" + (row[0]) + "  " + (row[1]) + "  " + (row[2]) + "  " + (row[3]) + "  " + (row[4])));
  }
};
function roll() {
  var letters = [];
  var rand_dice = shake(default_dice);
  for (var i = 0; i < rand_dice.length; i++) {
    var die = rand_dice[i];
    // var letter_idx = Math.floor(Math.random() * (die.length + 1));
    letters.push(die[0]);
  }
  return letters;
};

function word(w) {
  w.find('Q') ? (w = w.replace('Q', 'QU')) : null;
  return w.toLowerCase();
};

function play() {
  var _d, _e, _f, b, board, i, solution, sys;
  // sys = require('sys');
  //  board = roll()
  board = 'USEYAOTTWHENXALOKSC'.split('');
  b = new Boggle();
  b.solve(board);
  solution = keys(b.found);
  // solution.sort();
  _e = 0; _f = board.length;
  for (_d = 0, i = _e; (_e <= _f ? i < _f : i > _f); (_e <= _f ? i += 1 : i -= 1), _d++) {
    if (board[i] === 'Q') {
      board[i] = 'Qu';
    }
  }
  return [board, solution];
};

