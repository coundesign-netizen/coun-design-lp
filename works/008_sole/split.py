from PIL import Image
import os

src = '/Users/mutsuokaho/Desktop/mysite/works/008_sole/photos/B08BCC8B-742F-4FF7-B0DF-B0BD526241C1.PNG'
out = '/Users/mutsuokaho/Desktop/mysite/works/008_sole/photos/'

img = Image.open(src)
W, H = img.size
print(f'size: {W}x{H}')

def crop(name, x1, y1, x2, y2):
    piece = img.crop((x1, y1, x2, y2)).convert('RGB')
    piece.save(os.path.join(out, name), quality=95)
    print(f'saved {name}: {piece.size}')

# Hero (top, full width)
crop('hero.jpg',      0,    0,   W,  380)

# Space: left large / right-top / right-bottom
crop('space-1.jpg',   0,  385,  355,  755)
crop('space-2.jpg', 360,  385,   W,   570)
crop('space-3.jpg', 360,  575,   W,   755)

# Menu: 4 items across
mw = W // 4
crop('menu-1.jpg',  0,        760,  mw,      1095)
crop('menu-2.jpg',  mw,       760,  mw*2,    1095)
crop('menu-3.jpg',  mw*2,     760,  mw*3,    1095)
crop('menu-4.jpg',  mw*3,     760,  W,       1095)

# About (left) + Map placeholder (right)
crop('about.jpg',   0,       1100,  357,     1400)

print('done')
