var _a, _b, _c, default_dice, die, display, display_row, first, play, roll, shake, shuffle, text_display, word;
//  Baffle is like Boggle with a hexagonal board:
//
//     0  1  2
//   3  4   5  6
// 7  8   9  10  11
//  12 13  14  15
//    16  17 18
// fisherYates shuffle from http://sedition.com/perl/javascript-fy.html
shuffle = function shuffle(arr) {
  var _a, i, j;
  i = arr.length;
  if ((i > 1)) {
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      _a = [arr[j], arr[i]];
      arr[i] = _a[0];
      arr[j] = _a[1];
    }
  }
  return arr;
};
// Define the boggle dice:
default_dice = ['QHIMNU', 'AOOTTW', 'ACHOPS', 'DEILRX', 'AAEEGN', 'CMTIOU', 'WHTREV', 'EENIUS', 'WEEHNG', 'SSTIOE', 'OOBBAJ', 'IDTSYT', 'PFSFAK', 'RNHLNZ', 'LYRDEV', 'TYTREL', 'ACDORS', 'EENITS', 'LEAMGI'];
_b = default_dice;
for (_a = 0, _c = _b.length; _a < _c; _a++) {
  die = _b[_a];
  die.split('');
}
shake = function shake(dice) {
  var _d, _e, _f;
  _e = dice;
  for (_d = 0, _f = _e.length; _d < _f; _d++) {
    die = _e[_d];
    shuffle(die);
  }
  return shuffle(dice);
};
first = function first(die) {
  return die[0];
};
display = function display(board) {
  display_row(board.slice(0, 3));
  display_row(board.slice(3, 7));
  display_row(board.slice(7, 12));
  display_row(board.slice(12, 16));
  return display_row(board.slice(16, 19));
};
display_row = function display_row(row) {
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
roll = function roll() {
  var _d, _e, _f, _g;
  _d = []; _f = shake(default_dice);
  for (_e = 0, _g = _f.length; _e < _g; _e++) {
    die = _f[_e];
    _d.push(die[0]);
  }
  return _d;
};
word = function word(w) {
  w.find('Q') ? (w = w.replace('Q', 'QU')) : null;
  return w.toLowerCase();
};
play = function play() {
  var _d, _e, _f, b, board, i, solution, sys;
  // sys = require('sys');
  //  board = roll()
  board = 'USEYAOTTWHENXALOKSC'.split('');
  b = new Boggle();
  b.solve(board);
  solution = keys(b.found);
  solution.sort();
  _e = 0; _f = board.length;
  for (_d = 0, i = _e; (_e <= _f ? i < _f : i > _f); (_e <= _f ? i += 1 : i -= 1), _d++) {
    if (board[i] === 'Q') {
      board[i] = 'Qu';
      //  display(board)
      //  for s in solution
      //      sys.puts(s.replace('Q', 'QU').toLowerCase())
    }
  }
  return [board, solution];
};
text_display = function text_display() {
  var _d, _e, _f, _g, _h, board, s, solution, sys;
  // sys = require('sys');
  _d = play();
  board = _d[0];
  solution = _d[1];
  display(board);
  _e = []; _g = solution;
  for (_f = 0, _h = _g.length; _f < _h; _f++) {
    s = _g[_f];
    _e.push(sys.puts(s.replace('Q', 'QU').toLowerCase()));
  }
  return _e;
};
//text_display();