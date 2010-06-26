# Just Enough of AIMA to solve Boggle with a 3x hex board, stripping # away all flexibility

sys: require('sys')

chr: (codePoint)->
  String.fromCharCode(codePoint)

ord: (str)->
  str.charCodeAt(0)
  
keys: (dict) ->
  k: []
  for key of dict
    k.push(key)
  k
  
contains: (arr, item) ->
  value: no
  for i in arr
    if i is item
      value: true
  value
  
startsWith: (str, prefix) ->
  str.indexOf(prefix) is 0

bisect_left: (list, item, lo, hi) ->
  # Return the index where to insert item x in list a, assuming a is sorted.
  #
  # The return value i is such that all e in a[:i] have e < x, and all e in
  # a[i:] have e >= x.  So if x already appears in the list, a.insert(x) will
  # insert just before the leftmost x already there.
  #
  # Optional args lo (functionault 0) and hi (functionault len(a)) bound the
  # slice of a to be searched.
  if not lo? then lo: 0
  if lo < 0
    throw ValueError('lo must be non-negative');
  if not hi?
    hi: list.length
  while lo < hi
    mid: Math.floor((lo+hi)/2)
    if list[mid] < item
      lo: mid + 1
    else 
      hi: mid
  lo # return value
  
  
bisect_right: (list, item, lo, hi) ->
  # Return the index where to insert item x in list a, assuming a is sorted.
  #
  # The return value i is such that all e in a[:i] have e <= x, and all e in
  # a[i:] have e > x.  So if x already appears in the list, a.insert(x) will
  # insert just after the rightmost x already there.
  #
  # Optional args lo (functionault 0) and hi (functionault len(a)) bound the
  # slice of a to be searched.
  if not lo? then lo: 0
  if lo < 0
    throw ValueError('lo must be non-negative')
  if not hi?
    hi: list.length
  while lo < hi
    mid: Math.floor((lo+hi)/2);
    if item < list[mid] 
      hi: mid
    else
      lo: mid+1
  lo

sum: (seq)->
  """Sum the elements seq[i].
  Ex: sum([1, 2, 3]) ==> 6 """
  s = 0
  for item in seq
    s += item
  s
  
compute_neighbors: ->
  [
    [1,3,4], [0,2,4,5], [1,5,6],
    [0,4,7,8], [0,1,3,5,8,9], [1,2,4,6,9,10],[2,5,10,11],
    [3,8,12],[3,4,7,9,12,13],[4,5,8,10,13,14],[5,6,9,11,14,15],[6,10,15],
    [7,8,13,16], [8,9,12,14,16,17],[9,10,13,15,17,18],[10,11,14,18],
    [12,13,17],[13,14,16,18],[14,15,17]
  ]
  
Array.prototype.toString: ->
    "[${this.join(', ')}]"
    
class Boggle
  # Find all the words in a Boggle board.
  # Ex: b = Boggle(); b.solve(); b.solve()
  constructor: ->
    @wordlist: new Wordlist()
    @wordlist_words: @wordlist.words
    @found: {}
 
  solve: (board) ->
    "Find all the words in the given board"
    @board: board
    @neighbors: compute_neighbors()
    @found: {}
    for i in [0...board.length]
      [lo, hi] = @wordlist.bounds[board[i].toLowerCase()]
      @find(lo, hi, i, [], "")
      
  count: ->
    "Return the number of words found on the last board."
    @found.length

  words: ->
  # Return the list of words found on the last board.
    keys(@found)

  score: ->
    sum(for w in @words then Boggle.scores[w.length])

  toString: ->
    "<Boggle: ${@count()} words, ${@score()} points>"

  # global array
  @scores = [0, 0, 0, 1, 3, 4, 5, 6, 8, 10, 12, 17, 21, 23, 28, 32, 34, 39, 43, 48]

  find: (lo, hi, i, visited, sofar) ->
    sys.puts("find($lo, $hi, $i, $visited, \"$sofar\")")
    sofar: sofar.toLowerCase()
    if not contains(visited, i)
      [prefix, word] = @lookup(sofar, lo, hi)
      if prefix
        if word
          @found[word] = 1
        visited.push(i)
        c: @board[i].toLowerCase()
        sofar += c
        for j in @neighbors[i]
          @find(prefix, hi, j, visited, sofar)
        visited.pop()
                  
  lookup: (sofar, lo, hi) ->
    sys.puts("lookup(\"$sofar\", $lo, $hi)")
    p = bisect_left(@wordlist_words, sofar, lo, hi)
    if p >= @wordlist_words.length
      [undefined, undefined]
    else
      word: @wordlist_words[p]
      if word? and word is sofar
        [p, sofar]
      else if word? and startsWith(word, sofar)
        [p, undefined]
      else
        [undefined, undefined]
  

alphabet: 'abcdefghijklmnopqrstuvwxyz'

class Wordlist
  constructor: ->
    @words: wordlist
    @bounds: {}
    for c in alphabet
      c2: chr(ord(c) + 1)
      @bounds[c]: [bisect_right(@words, c),
                bisect_right(@words, c2)]

  contains: (word)->
    bisect_right(@words, word)
    
  toString: ->
    "<Wordlist with ${@count()} words>"
    
  count: -> @words.length
  
