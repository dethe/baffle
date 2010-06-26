#  Baffle is like Boggle with a hexagonal board:
#  
#     0  1  2
#   3  4   5  6
# 7  8   9  10  11
#  12 13  14  15
#    16  17 18

# fisherYates shuffle from http://sedition.com/perl/javascript-fy.html   
shuffle: (arr) ->
    i: arr.length
    if ( i > 1 )
        while  --i
            j: Math.floor(Math.random() * (i + 1))
            [arr[i],arr[j]]: [arr[j], arr[i]]
    arr


# Define the boggle dice:
default_dice: [
  'QHIMNU', 'AOOTTW', 'ACHOPS', 'DEILRX',
  'AAEEGN', 'CMTIOU', 'WHTREV', 'EENIUS',
  'WEEHNG', 'SSTIOE', 'OOBBAJ', 'IDTSYT',
  'PFSFAK', 'RNHLNZ', 'LYRDEV', 'TYTREL',
  'ACDORS', 'EENITS', 'LEAMGI']
  
for die in default_dice
    die.split('');

shake: (dice)->
  for die in dice
      shuffle(die)
  shuffle(dice)

first: (die) ->
  return die[0]

display: (board) ->
  display_row(board[0...3])
  display_row(board[3...7])
  display_row(board[7...12])
  display_row(board[12...16])
  display_row(board[16...19])

display_row: (row) ->
    sys: require('sys')
    l: row.length
    if l is 3
        sys.puts("    ${row[0]}  ${row[1]}  ${row[2]}")
    else if l is 4
        sys.puts("  ${row[0]}  ${row[1]}  ${row[2]}  ${row[3]}")
    else if l is 5
        sys.puts("${row[0]}  ${row[1]}  ${row[2]}  ${row[3]}  ${row[4]}")
  
roll: ->
    for die in shake(default_dice)
        die[0]
  
word: (w) ->
  if w.find('Q')
    w = w.replace('Q', 'QU')
  w.toLowerCase()
  
play: ->
  sys: require('sys')
#  board = roll()
  board = 'USEYAOTTWHENXALOKSC'.split('')
  b = new Boggle()
  b.solve(board)
  solution = keys(b.found)
  solution.sort()
  for i in [0...board.length]
      if board[i] == 'Q'
          board[i] = 'Qu'
#  display(board)
#  for s in solution 
#      sys.puts(s.replace('Q', 'QU').toLowerCase())
  [board, solution]
  
text_display: ->
  sys: require('sys')
  [board, solution] = play()
  display(board)
  for s in solution
      sys.puts(s.replace('Q', 'QU').toLowerCase())
  

text_display()
