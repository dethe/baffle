var isiPad = navigator.userAgent.match(/iPad/i) != null;
var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
var isiPod = navigator.userAgent.match(/iPod/i) != null;

function $(id){
    return document.getElementById(id);
}

function $$(sel){
    return [].slice.call(document.querySelectorAll(sel), 0);
}

var size = 'large';
if (isiPod || isiPhone){
    size = 'small';
    $('section').className = 'iphone';
    $('board').className = 'iphone';
}else{
    $('section').className = 'ipad';
    $('board').className = 'ipad';
}

var dimensions = {
    'small': {width: 58, height: 68}, // iPhone or iPod
    'large': {width: 112, height: 130} // iPad or other
};

var board = document.getElementById('board');

var supportsTouch = 'createTouch' in document;
var path_re = /\/images\/(.)_(large|small).*/;

var current_word = [];
var letters = [];
var words = [];
var hexes = [];

// Handle touches and clicks
document.body[supportsTouch ? 'ontouchend' : 'onclick'] =      
    function(event){
        var e = event.target;
        var idx = parseInt(e.id.slice(4), 10);
        if (hasClass(e, 'hex')){
            if (hasClass(e, 'normal')){
                select(e);
                // set all active hexes to disabled
                $$('.hex.normal').forEach(function(hex){
                    disable(hex);
                });
                hex_neighbors[idx].forEach(function(index){
                    var hex = $('hex_' + index);
                    if (hasClass(hex, 'disabled')){
                        activate(hex);
                    }
                });
            }
        }
    };
    
function clear(){
    $$('.hex').forEach(function(hex){
        activate(hex);
    });
    current_word = [];
}

function accept(){
    var new_word = current_word.join('').replace('q', 'qu');
    var success = false;
    words.forEach(function(word, idx){
        // console.log('"' + new_word + '" ?= "' + word + '"');
        if (new_word == word){
            var word_view = $('word_' + idx);
            word_view.innerHTML = word;
            word_view.className = 'answer';
            success = true;
        }
    });
    if (success){
        if (did_we_win()){
            //end_game();
        }
    }else{
        //alert(new_word + ' is not a word');
        //console.log(new_word + ' is not a word');
        // do something to show it failed
    }
    clear();
}

function did_we_win(){
    if ($$('.placeholder').length < 1){
        return true;
    }
    return false;
}
    
function disable(e){
    var parts = e.src.match(path_re);
    var letter = parts[1];
    var size = parts[2];
    e.className = 'hex disabled';
    e.src = 'images/' + letter + '_' + size + '_disabled.png';
}

function activate(e){
    var parts = e.src.match(path_re);
    var letter = parts[1];
    var size = parts[2];
    e.className = 'hex normal';
    e.src = 'images/' + letter + '_' + size + '.png';
}

function select(e){
    var parts = e.src.match(path_re);
    var letter = parts[1];
    var size = parts[2];
    current_word.push(letter == 'q'? 'qu': letter.toLowerCase());
    e.className = 'hex selected';
    e.src = 'images/' + letter + '_' + size + '_selected.png';
}

    
function hasClass(e, className){
    var classes = e.className.split(' '); // FIXME to split properly on whitespace
    var flag = false;
    classes.forEach(function(cls){
        if(cls === className){
            flag = true;
        }
    });
    return flag;
}

function hex(x, y, letter){
    // position a small hex centered on x,y
    //var s = small_size;
    var s = dimensions[size];
    var idx = hexes.length;
    var img = document.createElement('img');
    img.style.width = s.width + 'px';
    img.style.height = s.height + 'px';
    img.style.position = 'absolute';
    img.style.left = x - (s.width / 2) + 'px';
    img.style.top = y - (s.height / 2) + 'px';
    img.src = 'images/' + letter + '_' + size + '.png';
    img.className = 'hex normal';
    img.id = 'hex_' + idx;
    board.appendChild(img);
}

function inner_radius(radius){
    // this is the formula for the height of an equilateral triangle
    // which happens to give distance from centre to midpoint of a side
    return rd((Math.sqrt(3) * radius) / 2);
}

function radius_from_inner_radius(ir){
    return rd((ir * 2) / Math.sqrt(3));
}

function hex_points(radius, x, y, northsouth){
    var angle = northsouth? 30: 0;
    points = [];
    for (var i = 0; i < 6; i++){
        points.push(point(radius, angle, x, y));
        angle = angle + 60;
    }
    return points;
}

function sind(degrees){
    return Math.sin(radians(degrees));
}

function cosd(degrees){
    return Math.cos(radians(degrees));
}

function rd(number){
    return Math.round(number);
}

function point(radius, angle, x, y){
    return [rd(sind(angle) * radius) + x, rd(cosd(angle) * radius) + y];
}

function radians(degrees){
    return degrees * (Math.PI / 180);
}

var radius = 65;
if (size == 'small'){
    radius = 34; // radius of one hex
}
var spacing = radius + 2;

var c_x = 384;
var c_y = 320;
if (size == 'small'){
    c_x = 160; // center point
    c_y = 160; // center point
}

function hexrow(count, y, letters){
    var left_offset = c_x - inner_radius(spacing) * (count - 1);
    var increment = 2 * inner_radius(spacing);
    var x, i;
    for (i = 0; i < count; i++){
        x = i * increment + left_offset;
        hex(x, y, letters[i]);
        hexes.push([x,y]);
    }
}

function drawBoard(){
    // // ctx.fillStyle = '#000';
    // // ctx.fillRect(0,0,320,480);
    // ctx.save();
    // ctx.beginPath();
    var board = roll();
    hexrow(3, c_y - (spacing * 3), board.slice(0,3));
    hexrow(4, c_y - (spacing * 1.5), board.slice(3,7));
    hexrow(5, c_y, board.slice(7,12));
    hexrow(4, c_y + (spacing * 1.5), board.slice(12,16));
    hexrow(3, c_y + (spacing * 3), board.slice(16,19));
    return board;
}

function show_placeholders(words){
    var columns = $$('.column');
    for (var i = 0; i < words.length; i++){
        var word = document.createElement('div');
        word.className = 'placeholder';
//        word.className = 'answer';
        word.id = 'word_' + i;
        word.innerHTML = placeholder(words[i]);
//        word.innerHTML = words[i];
        columns[i % 3].appendChild(word);
    }
}

function placeholder(word){
    var value = [];
    for (var i = 0; i < word.length; i++){
        value.push('\u20E3');
    }
    return value.join('');
}

// Wood texture from
// http://www.flickr.com/photos/mattandrewsimage/3458080999/

// Brass texture from
// http://www.flickr.com/photos/inspiredreamcreate/4138826447/

// Brass2 texture from
// http://mix.msfc.nasa.gov/IMAGES/HIGH/9901877.jpg

// Stone texture from
// http://mayang.com/textures/Stone/html/Other%20Stone/index.html

function track_time(t){
    if (!t.expired()){
        $('timer').innerHTML = t;
    }else{
        $('timer').innerHTML = '0:00';
        clearInterval(t.interval);
        end_game();
    }
}

function end_game(){
    console.log('end game');
}


function new_game(){
    letters = drawBoard(); // set global var
    scrollTo(0,1); // hide the top chrome
    var b = new Boggle();
    b.solve(letters);
    words = b.words(); // set global var
    show_placeholders(words);
    var t = new Timer(180);
    $('timer').innerHTML = t;
    t.interval = setInterval(function(){track_time(t);}, 1000);
}

function Timer(seconds){
    this.total = seconds;
    this.start = new Date().getSeconds();
}
Timer.prototype.elapsed = function(){
    return new Date().getSeconds() - this.start;
};
Timer.prototype.expired = function(){
    if ((this.total - this.elapsed()) < 1){
        return true;
    }
    return false;
};
Timer.prototype.toString = function(){
    var expired = this.total - this.elapsed();
    var seconds = expired % 60;
    var minutes = (expired - seconds) / 60;
    var padding = '';
    if (seconds < 10){
        padding = '0';
    }
    return [minutes,':',padding,seconds].join('');
};

$('new_game')[supportsTouch ? 'ontouchend' : 'onclick'] = function(){
    new_game();
};

$('clear')[supportsTouch ? 'ontouchend' : 'onclick'] = function(){
    clear();
};

$('accept')[supportsTouch ? 'ontouchend' : 'onclick'] = function(){
    accept();
};

new_game();
