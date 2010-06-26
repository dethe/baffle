'''
Script to make tiles for Baffle

Acknowledgements:
    
wood2: http://www.flickr.com/photos/bittbox/3508082241/sizes/m/in/set-72157617708336229/
dark_wood3: http://www.flickr.com/photos/matthamm/3346430996/
'''

coreimage = ximport("coreimage")

from math import sin, cos, radians, sqrt, pi

SIZE = 'small'

iphone_radius = 34 # radius of one hex
ipad_radius = 65

radius = {'large': ipad_radius, 'small': iphone_radius}[SIZE]

def midpoint_distance(radius):
    return (sqrt(3.0) * radius) / 2.0

w = midpoint_distance(ipad_radius) * 2
h = ipad_radius * 2
w2 = midpoint_distance(iphone_radius) * 2
h2 = iphone_radius * 2
size(w,h)
background(0,0,0,0)
#speed(1)
canvas = coreimage.canvas(w,h)
canvas2 = coreimage.canvas(w2,h2)
angle = pi / 3.0

def point(radius, angle):
    return sin(angle) * radius + WIDTH/2.0, cos(angle) * radius + HEIGHT/2.0
    
def points_to_path(points):
    beginpath(*points[0])
    for pt in points[1:]:
        lineto(*pt)
    return endpath(draw=False)
    
def draw_points(points):
    drawpath(points_to_path(points))
    
def hex(radius):
    draw_points(hex_points(radius))

def hex_points(radius):
    return [point(radius, t * angle) for t in range(6)]
    
def hex_path(radius):
    return points_to_path(hex_points(radius))
    
def bevel(radius, width):
    outer_points = hex_points(radius)
    inner_points = hex_points(radius - width)
    bevel1 = outer_points[2:] + list(reversed(inner_points[2:]))
    bevel2 = outer_points[5:] + outer_points[:3] + list(reversed(inner_points[5:] + inner_points[:3]))
    return bevel1, bevel2
    
def bevel_paths(radius, width):
    return [points_to_path(p) for p in bevel(radius,width)]
    
def font_path(string, font_size):
    fontsize(font_size)
    return textpath(string, 0, 0)
    
letters = list('ABCDEFGHIJKLMNoP') + ['Qu'] + list('RSTUVWXYZ')
font_sizes = [84] * len(letters)
font_sizes[14] = 140 # O
font_sizes[16] = 78 # Qu
let_sizes = zip(letters, font_sizes)
offsets = [(0,0)] * len(letters)
offsets[0] = (-2,-4) # A
offsets[15] = (3,0) # P
offsets[16] = (-3,0) # Qu
font('Essays1743')
letter_paths = [font_path(l,s) for (l,s) in let_sizes]


def draw(idx):
    canvas = coreimage.canvas(w,h)
    bevels = bevel_paths(ipad_radius, 5)

    wood = canvas.append('dark_wood3.jpg')
#    wood.brightness = 0.5
    wood.mask.append(hex_path(ipad_radius))
    b1 = canvas.append(bevels[0], fill=color(0))
    b1.y -= 16
#    b1.blend(20)
    b1.blend(70)
    b2 = canvas.append(bevels[1], fill=color(1))
    b2.y += 16
#    b2.blend(70)
    b2.blend(20)
    t = letter_paths[idx]
    brass = canvas.append('copper.jpg')
    brass.mask.append(t)
    offset = offsets[idx]
    brass.x += offset[0]
    brass.y += offset[1]
    all = canvas2.append(canvas.flatten())
    all.scale(.52)
    canvas2.export('%s_%s_selected.png' % (SIZE, letters[idx][0].upper()))
    canvas2.draw()
    

for i in range(26):
    draw(i)

#draw(0)
