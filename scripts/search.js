var Boggle, Wordlist, alphabet, bisect_left, bisect_right, compute_neighbors, contains, startsWith, sum; //, sys;
var __hasProp = Object.prototype.hasOwnProperty;
// Just Enough of AIMA to solve Boggle with a 3x hex board, stripping # away all flexibility
// sys = require('sys');
function chr(codePoint) {
  return String.fromCharCode(codePoint);
};
function ord(str) {
  return str.charCodeAt(0);
};
function keys(dict){
    var key;
    var wordlist = [];
    for (key in dict){
        if (__hasProp.call(dict, key)){
            wordlist.push(key);
        }
    }
    wordlist.lengthsort();
    return wordlist;
}
contains = function contains(arr, item) {
  var _a, _b, _c, i, value;
  value = false;
  _b = arr;
  for (_a = 0, _c = _b.length; _a < _c; _a++) {
    i = _b[_a];
    i === item ? (value = true) : null;
  }
  return value;
};
startsWith = function startsWith(str, prefix) {
  return str.indexOf(prefix) === 0;
};
bisect_left = function bisect_left(list, item, lo, hi) {
  var mid;
  // Return the index where to insert item x in list a, assuming a is sorted.
  // The return value i is such that all e in a[:i] have e < x, and all e in
  // a[i:] have e >= x.  So if x already appears in the list, a.insert(x) will
  // insert just before the leftmost x already there.
  // Optional args lo (functionault 0) and hi (functionault len(a)) bound the
  // slice of a to be searched.
  !(typeof lo !== "undefined" && lo !== null) ? (lo = 0) : null;
  if (lo < 0) {
    throw ValueError('lo must be non-negative');
  }
  !(typeof hi !== "undefined" && hi !== null) ? (hi = list.length) : null;
  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2);
    list[mid] < item ? (lo = mid + 1) : (hi = mid);
  }
  return lo;
  // return value
};
bisect_right = function bisect_right(list, item, lo, hi) {
  var mid;
  // Return the index where to insert item x in list a, assuming a is sorted.
  // The return value i is such that all e in a[:i] have e <= x, and all e in
  // a[i:] have e > x.  So if x already appears in the list, a.insert(x) will
  // insert just after the rightmost x already there.
  // Optional args lo (functionault 0) and hi (functionault len(a)) bound the
  // slice of a to be searched.
  !(typeof lo !== "undefined" && lo !== null) ? (lo = 0) : null;
  if (lo < 0) {
    throw ValueError('lo must be non-negative');
  }
  !(typeof hi !== "undefined" && hi !== null) ? (hi = list.length) : null;
  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2);
    item < list[mid] ? (hi = mid) : (lo = mid + 1);
  }
  return lo;
};
sum = function sum(seq) {
  var _a, _b, _c, item, s;
  "Sum the elements seq[i].\nEx: sum([1, 2, 3]) ==> 6";
  s = 0;
  _b = seq;
  for (_a = 0, _c = _b.length; _a < _c; _a++) {
    item = _b[_a];
    s += item;
  }
  return s;
};
var hex_neighbors = [[1, 3, 4], [0, 2, 4, 5], [1, 5, 6], [0, 4, 7, 8], [0, 1, 3, 5, 8, 9], [1, 2, 4, 6, 9, 10], [2, 5, 10, 11], [3, 8, 12], [3, 4, 7, 9, 12, 13], [4, 5, 8, 10, 13, 14], [5, 6, 9, 11, 14, 15], [6, 10, 15], [7, 8, 13, 16], [8, 9, 12, 14, 16, 17], [9, 10, 13, 15, 17, 18], [10, 11, 14, 18], [12, 13, 17], [13, 14, 16, 18], [14, 15, 17]];

Array.prototype.toString = function toString() {
  return "[" + (this.join(', ')) + "]";
};

Array.prototype.lengthsort = function lengthsort(){
    this.sort();
    this.sort(function(a,b){
        return a.length > b.length;
    });
};

Boggle = function Boggle() {
  this.wordlist = new Wordlist();
  this.wordlist_words = this.wordlist.words;
  this.found = {};
//  return this;
};
// Find all the words in a Boggle board.
// Ex: b = Boggle(); b.solve(); b.solve()
Boggle.prototype.solve = function solve(board) {
  var _a, _b, _c, _d, _e, hi, i, lo;
  "Find all the words in the given board";
  this.board = board;
  this.found = {};
  _a = []; _c = 0; _d = board.length;
  for (_b = 0, i = _c; (_c <= _d ? i < _d : i > _d); (_c <= _d ? i += 1 : i -= 1), _b++) {
    _a.push((function() {
      _e = this.wordlist.bounds[board[i].toLowerCase()];
      lo = _e[0];
      hi = _e[1];
      return this.find(lo, hi, i, [], "");
    }).call(this));
  }
  return _a;
};
Boggle.prototype.count = function count() {
  "Return the number of words found on the last board.";
  return this.found.length;
};
Boggle.prototype.words = function words() {
  // Return the list of words found on the last board.
  return keys(this.found);
};
Boggle.prototype.score = function score() {
  var _a, _b, _c, _d, w;
  return sum((function() {
    _a = []; _c = this.words;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      w = _c[_b];
      _a.push(Boggle.scores[w.length]);
    }
    return _a;
  }).call(this));
};
Boggle.prototype.toString = function toString() {
  return "<Boggle: " + (this.count()) + " words, " + (this.score()) + " points>";
};
// global array
Boggle.scores = [0, 0, 0, 1, 3, 4, 5, 6, 8, 10, 12, 17, 21, 23, 28, 32, 34, 39, 43, 48];
Boggle.prototype.find = function find(lo, hi, i, visited, sofar) {
  var _a, _b, _c, _d, c, j, prefix, word;
//  sys.puts(("find(" + lo + ", " + hi + ", " + i + ", " + visited + ", \"" + sofar + "\")"));
  sofar = sofar.toLowerCase();
  if (!contains(visited, i)) {
    _a = this.lookup(sofar, lo, hi);
    prefix = _a[0];
    word = _a[1];
    if (prefix) {
      word ? (this.found[word] = 1) : null;
      visited.push(i);
      c = this.board[i].toLowerCase();
      if (c == 'q'){
          c = 'qu';
      }
      sofar += c;
      _c = hex_neighbors[i];
      for (_b = 0, _d = _c.length; _b < _d; _b++) {
        j = _c[_b];
        this.find(prefix, hi, j, visited, sofar);
      }
      return visited.pop();
    }
  }
};
Boggle.prototype.lookup = function lookup(sofar, lo, hi) {
  var p, word;
//  sys.puts(("lookup(\"" + sofar + "\", " + lo + ", " + hi + ")"));
  p = bisect_left(this.wordlist_words, sofar, lo, hi);
  if (p >= this.wordlist_words.length) {
    return [undefined, undefined];
  } else {
    word = this.wordlist_words[p];
    if ((typeof word !== "undefined" && word !== null) && word === sofar) {
      return [p, sofar];
    } else if ((typeof word !== "undefined" && word !== null) && startsWith(word, sofar)) {
      return [p, undefined];
    } else {
      return [undefined, undefined];
    }
  }
};
alphabet = 'abcdefghijklmnopqrstuvwxyz';
Wordlist = function Wordlist() {
  var _a, _b, _c, c, c2;
  this.words = wordlist;
  this.bounds = {};
  _b = alphabet;
  for (_a = 0, _c = _b.length; _a < _c; _a++) {
    c = _b[_a];
    c2 = chr(ord(c) + 1);
    this.bounds[c] = [bisect_right(this.words, c), bisect_right(this.words, c2)];
  }
  return this;
};
Wordlist.prototype.contains = function contains(word) {
  return bisect_right(this.words, word);
};
Wordlist.prototype.toString = function toString() {
  return "<Wordlist with " + (this.count()) + " words>";
};
Wordlist.prototype.count = function count() {
  return this.words.length;
};