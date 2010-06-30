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
                console.log('nodes adjacent to %s are %s', idx, hex_neighbors[idx].join(', '));
                hex_neighbors[idx].forEach(function(index){
                    var hex = $('hex_' + index);
                    if (hasClass(hex, 'disabled')){
                        console.log('activating hex_' + index);
                        activate(hex);
                    }
                });
            }
        }
    };
    
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

var hexes = [];

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
}





// Wood texture from
// http://www.flickr.com/photos/mattandrewsimage/3458080999/

// Brass texture from
// http://www.flickr.com/photos/inspiredreamcreate/4138826447/

// Brass2 texture from
// http://mix.msfc.nasa.gov/IMAGES/HIGH/9901877.jpg

// Stone texture from
// http://mayang.com/textures/Stone/html/Other%20Stone/index.html

drawBoard();
scrollTo(0,1); // hide the top chrome