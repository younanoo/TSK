# -*- coding: utf-8 -*-
"""
Whiteboard explainer video for جدد وعتقاء (godod.app)
60 s · 1920x1080 · 30 fps · H.264 + AAC

Everything is drawn in code: marker strokes revealed stroke by stroke, a hand
holding a marker follows the pen tip, real screenshots slide in, and the
soundtrack (soft music + marker squeaks + whooshes) is synthesized in code.

Usage
  py make_video.py                 render the full MP4
  py make_video.py --stills 3,9,15 render PNG stills at those seconds (preview)
Needs: pip install pillow numpy imageio-ffmpeg arabic-reshaper python-bidi
"""
import math, os, sys, random, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import arabic_reshaper
from bidi.algorithm import get_display
import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.dirname(HERE)                       # .../videos/whiteboard_60s
VIDEOS = os.path.dirname(SHOTS)                     # .../videos
SITE = os.path.abspath(os.path.join(VIDEOS, '..', '..'))
BRAND = os.path.join(SITE, 'assets', 'brand')
OUT_MP4 = os.path.join(VIDEOS, 'whiteboard_60s_جدد_وعتقاء.mp4')
OUT_SRT = os.path.join(VIDEOS, 'whiteboard_60s_جدد_وعتقاء.srt')
TMP_WAV = os.path.join(HERE, 'soundtrack.wav')

W, H, FPS = 1920, 1080, 30
PAN = 0.45                       # seconds of camera pan at the start of each scene

INK = (30, 30, 34)
NAVY = (15, 51, 85)
GOLD = (201, 162, 39)
SKIN = (241, 203, 172)
PAPER = (252, 252, 250)

FB = 'C:/Windows/Fonts/segoeuib.ttf'
FR = 'C:/Windows/Fonts/segoeui.ttf'
_fonts = {}


def font(size, path=FB):
    k = (path, size)
    if k not in _fonts:
        _fonts[k] = ImageFont.truetype(path, size)
    return _fonts[k]


rnd = random.Random(11)

# ----------------------------------------------------------------------------- easing


def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def ease_io(p):
    return p * p * (3 - 2 * p)


def ease_out(p):
    return 1 - (1 - p) ** 3


def back_out(p, c=1.6):
    p -= 1
    return 1 + (c + 1) * p ** 3 + c * p ** 2


# ----------------------------------------------------------------------------- geometry


def densify(pts, step=5.0):
    out = [pts[0]]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / step))
        for i in range(1, n + 1):
            t = i / n
            out.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t))
    return out


def wobble(pts, amp=1.6, freq=0.011):
    a, b = rnd.uniform(0, 6.3), rnd.uniform(0, 6.3)
    out, s, prev = [], 0.0, pts[0]
    for x, y in pts:
        s += math.hypot(x - prev[0], y - prev[1])
        prev = (x, y)
        dx = amp * (math.sin(s * freq + a) + 0.5 * math.sin(s * freq * 2.7 + b))
        dy = amp * (math.cos(s * freq * 1.13 + b) + 0.5 * math.sin(s * freq * 2.3 + a))
        out.append((x + dx, y + dy))
    return out


def catmull(pts, n=14):
    if len(pts) < 3:
        return list(pts)
    p = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for j in range(n):
            t = j / n
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t +
                                    (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
                                    (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3) for k in range(2)))
    out.append(pts[-1])
    return out


def line(a, b, amp=1.4):
    return wobble(densify([a, b]), amp)


def poly(pts, closed=False, amp=1.6):
    pts = list(pts)
    if closed:
        x0, y0 = pts[0]
        x1, y1 = pts[1]
        pts = pts + [pts[0], (x0 + (x1 - x0) * 0.06, y0 + (y1 - y0) * 0.06)]
    return wobble(densify(pts), amp)


def rect(x, y, w, h, amp=1.8):
    return poly([(x, y), (x + w, y), (x + w, y + h), (x, y + h)], closed=True, amp=amp)


def curve(pts, amp=1.4):
    return wobble(densify(catmull(pts)), amp)


def ellipse(cx, cy, rx, ry, start=-100, sweep=375, amp=1.2):
    n = max(24, int((rx + ry) * abs(sweep) / 120))
    ph = rnd.uniform(0, 6.3)
    pts = []
    for i in range(n + 1):
        a = math.radians(start + sweep * i / n)
        k = 1 + 0.035 * math.sin(a * 2 + ph) + 0.03 * (i / n)
        pts.append((cx + rx * k * math.cos(a), cy + ry * k * math.sin(a)))
    return wobble(pts, amp)


def head_strokes(tip, prev, size=26):
    ang = math.atan2(tip[1] - prev[1], tip[0] - prev[0])
    out = []
    for s in (+1, -1):
        a = ang + math.pi - s * 0.5
        out.append(line(tip, (tip[0] + size * math.cos(a), tip[1] + size * math.sin(a)), 0.6))
    return out


def arrow(pts, head=26, amp=1.3, both=False):
    shaft = curve(pts, amp) if len(pts) > 2 else line(pts[0], pts[1], amp)
    k = max(2, min(8, len(shaft) // 4))
    strokes = [shaft] + head_strokes(shaft[-1], shaft[-k], head)
    if both:
        strokes += head_strokes(shaft[0], shaft[k - 1], head)
    return strokes


def dashed(stroke, dash=16, gap=13):
    out, cur, acc, on = [], [stroke[0]], 0.0, True
    for p, q in zip(stroke, stroke[1:]):
        acc += math.hypot(q[0] - p[0], q[1] - p[1])
        if on:
            cur.append(q)
        if on and acc >= dash:
            out.append(cur)
            on, acc, cur = False, 0.0, []
        elif not on and acc >= gap:
            on, acc, cur = True, 0.0, [q]
    if on and len(cur) > 1:
        out.append(cur)
    return out


def star4(cx, cy, r):
    return [line((cx - r, cy), (cx + r, cy), 0.5), line((cx, cy - r), (cx, cy + r), 0.5),
            line((cx - r * .45, cy - r * .45), (cx + r * .45, cy + r * .45), 0.4),
            line((cx + r * .45, cy - r * .45), (cx - r * .45, cy + r * .45), 0.4)]


def bbox_of(strokes, pad):
    xs = [p[0] for s in strokes for p in s]
    ys = [p[1] for s in strokes for p in s]
    return (int(min(xs) - pad), int(min(ys) - pad), int(max(xs) + pad) + 1, int(max(ys) + pad) + 1)


def ar(s):
    return get_display(arabic_reshaper.reshape(s))


# ----------------------------------------------------------------------------- elements


class El:
    hand = True        # does the hand follow this element while it is active?
    kind = 'draw'      # draw | slide | pop | none  (used for sound design)

    def __init__(self, t0, t1):
        self.t0, self.t1 = t0, t1

    def prog(self, t):
        return clamp((t - self.t0) / max(1e-6, self.t1 - self.t0))

    def tip(self, t):
        return None

    def draw(self, canvas, t):
        pass


class Strokes(El):
    """Marker strokes, revealed along their length."""

    def __init__(self, strokes, t0, t1, color=INK, width=5):
        super().__init__(t0, t1)
        self.strokes = [s for s in strokes if len(s) > 1]
        self.width = width
        x0, y0, x1, y1 = bbox_of(self.strokes, width + 6)
        self.ox, self.oy = x0, y0
        bw, bh = x1 - x0, y1 - y0
        big = Image.new('RGBA', (bw * 2, bh * 2), color + (0,))
        d = ImageDraw.Draw(big)
        for s in self.strokes:
            p2 = [((x - x0) * 2, (y - y0) * 2) for x, y in s]
            d.line(p2, fill=color + (255,), width=width * 2, joint='curve')
            for (x, y) in (p2[0], p2[-1]):
                d.ellipse([x - width, y - width, x + width, y + width], fill=color + (255,))
        self.layer = big.resize((bw, bh), Image.LANCZOS)
        self.alpha = self.layer.getchannel('A')
        self.lens = []
        for s in self.strokes:
            L = [0.0]
            for p, q in zip(s, s[1:]):
                L.append(L[-1] + math.hypot(q[0] - p[0], q[1] - p[1]))
            self.lens.append(L)
        self.total = sum(L[-1] for L in self.lens) or 1.0

    def _walk(self, p):
        """Return (list of partial strokes, tip point) for progress p."""
        target = p * self.total
        acc, parts, tip = 0.0, [], None
        for s, L in zip(self.strokes, self.lens):
            if acc + L[-1] <= target:
                parts.append(s)
                acc += L[-1]
                tip = s[-1]
                continue
            rem = target - acc
            i = 0
            while i < len(L) - 1 and L[i + 1] < rem:
                i += 1
            if i < len(L) - 1:
                seg = L[i + 1] - L[i] or 1
                f = (rem - L[i]) / seg
                q = (s[i][0] + (s[i + 1][0] - s[i][0]) * f, s[i][1] + (s[i + 1][1] - s[i][1]) * f)
            else:
                q = s[-1]
            parts.append(s[:i + 1] + [q])
            tip = q
            break
        return parts, tip

    def _p(self, t):
        p = self.prog(t)
        return 0.75 * p + 0.25 * ease_io(p)

    def tip(self, t):
        if not (self.t0 <= t < self.t1):
            return None
        return self._walk(self._p(t))[1]

    def draw(self, canvas, t):
        if t < self.t0:
            return
        if t >= self.t1:
            canvas.alpha_composite(self.layer, (self.ox, self.oy))
            return
        parts, _ = self._walk(self._p(t))
        mask = Image.new('L', self.layer.size, 0)
        md = ImageDraw.Draw(mask)
        w = self.width + 7
        for s in parts:
            pts = [(x - self.ox, y - self.oy) for x, y in s]
            if len(pts) > 1:
                md.line(pts, fill=255, width=w, joint='curve')
            x, y = pts[0]
            md.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=255)
        lay = self.layer.copy()
        lay.putalpha(ImageChops.multiply(self.alpha, mask))
        canvas.alpha_composite(lay, (self.ox, self.oy))


class Fill(El):
    """Translucent marker fill of a polygon, wiped in right-to-left."""

    def __init__(self, pts, t0, t1, color=GOLD, alpha=90):
        super().__init__(t0, t1)
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        self.ox, self.oy = int(min(xs)) - 2, int(min(ys)) - 2
        bw, bh = int(max(xs)) - self.ox + 3, int(max(ys)) - self.oy + 3
        big = Image.new('RGBA', (bw * 2, bh * 2), color + (0,))
        ImageDraw.Draw(big).polygon([((x - self.ox) * 2, (y - self.oy) * 2) for x, y in pts],
                                    fill=color + (alpha,))
        self.layer = big.resize((bw, bh), Image.LANCZOS)

    def tip(self, t):
        if not (self.t0 <= t < self.t1):
            return None
        p = self.prog(t)
        w, h = self.layer.size
        return (self.ox + w * (1 - p), self.oy + h * (0.5 + 0.38 * math.sin(p * 22)))

    def draw(self, canvas, t):
        if t < self.t0:
            return
        p = self.prog(t)
        w, h = self.layer.size
        cut = int(w * (1 - p))
        if cut >= w:
            return
        canvas.alpha_composite(self.layer.crop((cut, 0, w, h)), (self.ox + cut, self.oy))


def text_image(s, size, color, path=FB, rtl=True):
    t = ar(s) if rtl else s
    f = font(size, path)
    l, tp, r, b = f.getbbox(t)
    pad = 6
    im = Image.new('RGBA', (r - l + 2 * pad, b - tp + 2 * pad), color + (0,))
    ImageDraw.Draw(im).text((pad - l, pad - tp), t, font=f, fill=color + (255,))
    return im


class Text(El):
    """Text written by the hand (wipe in reading direction) or popped in."""

    def __init__(self, s, x, y, size, t0, t1, color=NAVY, anchor='r', rtl=True, mode='write', path=FB):
        super().__init__(t0, t1)
        self.img = text_image(s, size, color, path, rtl)
        w, h = self.img.size
        self.x = int(x - w if anchor == 'r' else x - w / 2 if anchor == 'c' else x)
        self.y = int(y)
        self.rtl, self.mode, self.n = rtl, mode, max(3, len(s))
        if mode == 'pop':
            self.hand, self.kind = False, 'pop'

    def tip(self, t):
        if self.mode != 'write' or not (self.t0 <= t < self.t1):
            return None
        p = self.prog(t)
        w, h = self.img.size
        x = self.x + (w * (1 - p) if self.rtl else w * p)
        return (x, self.y + h * (0.5 + 0.28 * math.sin(p * self.n * 2.1)))

    def draw(self, canvas, t):
        if t < self.t0:
            return
        p = self.prog(t)
        w, h = self.img.size
        if self.mode == 'pop':
            if p >= 1:
                canvas.alpha_composite(self.img, (self.x, self.y))
                return
            s = max(0.05, back_out(p))
            im = self.img.resize((max(1, int(w * s)), max(1, int(h * s))), Image.BILINEAR)
            canvas.alpha_composite(im, (int(self.x + (w - im.width) / 2), int(self.y + (h - im.height) / 2)))
            return
        if p >= 1:
            canvas.alpha_composite(self.img, (self.x, self.y))
            return
        if self.rtl:
            cut = int(w * (1 - p))
            canvas.alpha_composite(self.img.crop((cut, 0, w, h)), (self.x + cut, self.y))
        else:
            cut = int(w * p)
            if cut > 0:
                canvas.alpha_composite(self.img.crop((0, 0, cut, h)), (self.x, self.y))


class Pic(El):
    """An image placed on the board: slide (carried in by the hand), wipe, pop or fade."""

    def __init__(self, img, x, y, t0, t1, mode='slide', dx=520, dy=260):
        super().__init__(t0, t1)
        self.img, self.x, self.y, self.mode, self.dx, self.dy = img, int(x), int(y), mode, dx, dy
        self.kind = {'slide': 'slide', 'pop': 'pop', 'fade': 'none', 'wipe': 'draw'}[mode]
        self.hand = mode in ('slide', 'wipe')

    def _pos(self, t):
        e = ease_out(self.prog(t))
        return self.x + self.dx * (1 - e), self.y + self.dy * (1 - e)

    def tip(self, t):
        if not self.hand or not (self.t0 <= t < self.t1):
            return None
        w, h = self.img.size
        if self.mode == 'slide':
            x, y = self._pos(t)
            return (x + w * 0.86, y + h - 34)
        p = self.prog(t)
        return (self.x + w * (1 - p), self.y + h * (0.5 + 0.4 * math.sin(p * 18)))

    def draw(self, canvas, t):
        if t < self.t0:
            return
        p = self.prog(t)
        w, h = self.img.size
        if p >= 1:
            canvas.alpha_composite(self.img, (self.x, self.y))
        elif self.mode == 'slide':
            x, y = self._pos(t)
            canvas.alpha_composite(self.img, (int(x), int(y)))
        elif self.mode == 'wipe':
            cut = int(w * (1 - p))
            if cut < w:
                canvas.alpha_composite(self.img.crop((cut, 0, w, h)), (self.x + cut, self.y))
        elif self.mode == 'pop':
            s = max(0.05, 0.35 + 0.65 * back_out(p))
            a = clamp(p * 3)
            im = self.img.resize((max(1, int(w * s)), max(1, int(h * s))), Image.BILINEAR)
            if a < 1:
                im.putalpha(im.getchannel('A').point(lambda v: int(v * a)))
            canvas.alpha_composite(im, (int(self.x + (w - im.width) / 2), int(self.y + (h - im.height) / 2)))
        else:  # fade
            im = self.img.copy()
            im.putalpha(im.getchannel('A').point(lambda v: int(v * ease_io(p))))
            canvas.alpha_composite(im, (self.x, self.y))


# ----------------------------------------------------------------------------- assets


def load_shot(name, crop=None):
    im = Image.open(os.path.join(SHOTS, name + '.png')).convert('RGB')
    return im.crop(crop) if crop else im


class Shot:
    """Screenshot card: soft shadow, white border, hand-drawn outline."""
    PAD, BORDER = 26, 6

    def __init__(self, name, x, y, w, crop=None):
        src = load_shot(name, crop)
        self.cx, self.cy = (crop[0], crop[1]) if crop else (0, 0)
        self.s = w / src.width
        im = src.resize((w, round(src.height * self.s)), Image.LANCZOS)
        P, B = self.PAD, self.BORDER
        cw, ch = im.width + 2 * B, im.height + 2 * B
        card = Image.new('RGBA', (cw + 2 * P, ch + 2 * P), (0, 0, 0, 0))
        sh = Image.new('L', card.size, 0)
        ImageDraw.Draw(sh).rectangle([P + 7, P + 11, P + cw + 7, P + ch + 11], fill=70)
        sh = sh.filter(ImageFilter.GaussianBlur(9))
        card.paste((40, 40, 50, 255), (0, 0), sh)
        card.paste((255, 255, 255, 255), (P, P, P + cw, P + ch))
        card.paste(im, (P + B, P + B))
        out = Strokes([rect(P - 2, P - 2, cw + 4, ch + 4, 1.5)], 0, 1, INK, 4)
        card.alpha_composite(out.layer, (out.ox, out.oy))
        self.img = card
        self.x, self.y = int(x), int(y)
        self.w, self.h = card.size

    def pt(self, ox, oy):
        """Map a point of the original 1920x1080 screenshot to board coordinates."""
        P, B = self.PAD, self.BORDER
        return (self.x + P + B + (ox - self.cx) * self.s, self.y + P + B + (oy - self.cy) * self.s)

    def el(self, t0, t1, mode='slide', **kw):
        return Pic(self.img, self.x, self.y, t0, t1, mode, **kw)


def screen_fill(name, w, h, crop=None):
    """Screenshot cropped/scaled to exactly w x h (for device screens)."""
    src = load_shot(name, crop)
    s = max(w / src.width, h / src.height)
    im = src.resize((math.ceil(src.width * s), math.ceil(src.height * s)), Image.LANCZOS)
    l, t = (im.width - w) // 2, 0
    return im.crop((l, t, l + w, t + h)).convert('RGBA')


def brand(name, w):
    im = Image.open(os.path.join(BRAND, name)).convert('RGBA')
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


def make_paper():
    rng = np.random.default_rng(3)
    n = rng.normal(0, 1.0, (H // 2, W // 2)).astype(np.float32)
    n = np.array(Image.fromarray(((n * 18) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
                 .filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32) - 128
    yy, xx = np.mgrid[0:H, 0:W]
    vig = ((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2
    base = np.zeros((H, W, 3), np.float32) + np.array(PAPER, np.float32)
    base += n[..., None] * 0.18
    base -= (vig * 5)[..., None]
    return Image.fromarray(base.clip(0, 255).astype(np.uint8)).convert('RGBA')


def make_hand():
    """Cartoon right hand holding a marker; returns (RGBA image, tip offset)."""
    S = 2
    Wd, Hd = 640, 660
    im = Image.new('RGBA', (Wd * S, Hd * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    ang = math.radians(57)
    ux, uy = math.cos(ang), math.sin(ang)
    vx, vy = -uy, ux
    tip = (34, 30)

    def P(u, v):
        return ((tip[0] + u * ux + v * vx) * S, (tip[1] + u * uy + v * vy) * S)

    def capsule(a, b, r, fill, outline=INK, ow=4):
        for rr, col in ((r + ow, outline), (r, fill)):
            (x0, y0), (x1, y1) = P(*a), P(*b)
            d.line([(x0, y0), (x1, y1)], fill=col, width=int(rr * 2 * S))
            for x, y in ((x0, y0), (x1, y1)):
                d.ellipse([x - rr * S, y - rr * S, x + rr * S, y + rr * S], fill=col)

    capsule((360, 30), (780, 30), 98, NAVY)                 # sleeve
    capsule((345, 30), (372, 30), 101, (236, 236, 240))     # cuff
    capsule((205, 34), (305, 40), 80, SKIN)                 # palm
    capsule((30, 0), (318, 0), 19, (38, 38, 44))            # marker body
    capsule((262, 0), (322, 0), 20, (235, 235, 238))        # marker cap end
    capsule((24, 0), (44, 0), 14, (70, 70, 78))             # collar
    d.polygon([P(0, 0), P(30, -11), P(30, 11)], fill=INK)   # nib
    capsule((175, 46), (232, 62), 17, SKIN)                 # curled fingers
    capsule((205, 74), (262, 84), 17, SKIN)
    capsule((118, 26), (228, 46), 17, SKIN)                 # thumb (under the marker)
    capsule((96, -20), (222, -46), 17, SKIN)                # index finger on top
    d.ellipse([P(100, -20)[0] - 9 * S, P(100, -20)[1] - 7 * S, P(100, -20)[0] + 9 * S, P(100, -20)[1] + 7 * S],
              fill=(250, 222, 205))                         # fingernail highlight
    return im.resize((Wd, Hd), Image.LANCZOS), tip


# ----------------------------------------------------------------------------- scenes


def scene1():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    T([ellipse(1380, 400, 58, 64)], 0.25, 0.6, width=6)
    T([ellipse(1360, 395, 3, 4, amp=0.2), ellipse(1402, 395, 3, 4, amp=0.2),
       curve([(1358, 436), (1372, 428), (1386, 437), (1402, 429)], 0.4)], 0.6, 0.85, width=5)
    T([poly([(1336, 472), (1424, 472), (1470, 700), (1290, 700)], True)], 0.85, 1.25, width=6)
    T([curve([(1428, 492), (1505, 560), (1478, 470), (1442, 418)]),
       curve([(1334, 492), (1272, 585), (1258, 665)])], 1.25, 1.6, width=6)
    T([line((1342, 700), (1332, 890)), line((1418, 700), (1428, 890)),
       line((1332, 890), (1296, 896)), line((1428, 890), (1466, 896))], 1.6, 1.9, width=6)
    books = [(1560, 820, 290, 75), (1580, 745, 250, 75), (1566, 670, 270, 75), (1600, 600, 210, 70)]
    T([rect(*b) for b in books] + [line((b[0] + 22, b[1] + 6), (b[0] + 22, b[1] + b[3] - 6), 0.6) for b in books],
      1.9, 2.55, width=5)
    for i, b in enumerate(books):
        els.append(Text('English', b[0] + b[2] / 2 + 10, b[1] + 14, 36, 2.55 + i * 0.1, 2.68 + i * 0.1,
                        INK, 'c', rtl=False, path=FR))
    for i, (x, y) in enumerate([(1290, 215), (1410, 160), (1530, 230)]):
        els.append(Text('؟', x, y, 130, 2.95 + i * 0.15, 3.2 + i * 0.15, GOLD, 'c', mode='pop'))
    els.append(Text('أدوات الدراسة…', 1130, 360, 96, 3.15, 3.85))
    els.append(Text('بالإنجليزية فقط؟', 1130, 500, 96, 3.85, 4.5, GOLD))
    T([line((450, 640), (1120, 632), 1.0)], 4.5, 4.8, color=GOLD, width=8)
    return 5.0, els


def scene2():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    T([rect(800, 150, 1040, 600)], 0.45, 1.05, width=6)
    T([poly([(800, 750), (1840, 750), (1900, 805), (740, 805)], True), line((1240, 778), (1400, 778), 0.5)],
      1.05, 1.4, width=6)
    els.append(Pic(screen_fill('01_الرئيسية', 1000, 562), 820, 170, 1.4, 2.2, 'wipe'))
    T(star4(770, 130, 30) + star4(1868, 190, 24) + star4(1870, 700, 20), 2.2, 2.55, color=GOLD, width=5)
    mark = brand('mark-512.png', 170)
    els.append(Pic(mark, 455 - 85, 200, 2.5, 2.85, 'pop'))
    els.append(Text('جدد وعتقاء', 700, 400, 112, 2.85, 3.6))
    els.append(Text('مكتبة عربية مجانية', 700, 570, 66, 3.6, 4.3, GOLD))
    T([line((175, 690), (700, 684), 1.0)], 4.3, 4.6, color=GOLD, width=8)
    return 5.0, els


def scene3():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    s2 = Shot('02_صفحة_الأصحاح', 840, 90, 1000)
    els.append(s2.el(0.45, 1.1))
    cx, cy = s2.pt(1310, 388)
    T([ellipse(cx + 4, cy + 2, 27, 27, amp=0.8)], 1.3, 1.8, color=GOLD, width=7)
    T(arrow([(cx - 4, cy + 40), (cx - 30, 600), (1300, 775), (812, 700)], 30), 1.9, 2.6, color=GOLD, width=7)
    s3 = Shot('03_الشواهد', 180, 300, 560, crop=(576, 108, 1344, 972))
    els.append(s3.el(2.6, 3.1, 'pop'))
    gx, gy = s3.pt(1187, 158)
    T([ellipse(gx, gy, 84, 24, amp=0.8)], 3.3, 3.8, color=GOLD, width=6)
    els.append(Text('أكثر من ٣٨٠ ألف شاهد', 1845, 835, 86, 3.9, 5.0))
    T([line((1150, 975), (1840, 968), 1.0)], 5.0, 5.3, color=GOLD, width=8)
    return 7.0, els


def scene4():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    s4 = Shot('04_معنى_الكلمة', 840, 80, 1000, crop=(270, 500, 1345, 975))
    els.append(s4.el(0.45, 1.05))
    x, y = s4.pt(715, 546)
    T([ellipse(x, y, 50, 30, amp=0.8)], 1.15, 1.6, color=GOLD, width=7)
    x, y = s4.pt(620, 661)
    T([ellipse(x, y, 86, 28, amp=0.8)], 1.6, 2.1, color=GOLD, width=7)
    els.append(Text('لأول مرة بالعربية:', 800, 130, 78, 2.2, 3.0, GOLD))
    els.append(Text('سترونج · BDB · أبوت-سميث', 800, 250, 64, 3.0, 3.8))
    s5 = Shot('05_القواميس_سترونج_وأبوت_سميث', 60, 560, 820)
    els.append(s5.el(3.9, 4.5, dy=200))
    bx, by, r = 1420, 815, 150
    pts = [(bx + r * math.cos(a / 40 * 2 * math.pi), by + r * math.sin(a / 40 * 2 * math.pi)) for a in range(40)]
    els.append(Fill(pts, 4.6, 4.9, GOLD, 70))
    ticks = []
    for i in range(16):
        a = i / 16 * 2 * math.pi
        ticks.append(line((bx + (r + 10) * math.cos(a), by + (r + 10) * math.sin(a)),
                          (bx + (r + 28) * math.cos(a), by + (r + 28) * math.sin(a)), 0.3))
    T([ellipse(bx, by, r, r, amp=1.0), ellipse(bx, by, r - 18, r - 18, amp=0.8)] + ticks, 4.9, 5.6,
      color=GOLD, width=6)
    els.append(Text('لأول مرة', bx, by - 92, 60, 5.6, 6.0, NAVY, 'c'))
    els.append(Text('بالعربية', bx, by - 8, 60, 6.0, 6.4, NAVY, 'c'))
    return 8.0, els


def scene5():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    s6 = Shot('06_وضع_الدراسة', 880, 60, 960)
    els.append(s6.el(0.45, 1.05))
    els.append(Text('أرقام سترونج فوق الكلمات', 840, 170, 54, 1.1, 1.7))
    T(arrow([(560, 270), (700, 330), (900, 300)], 24), 1.7, 2.0, color=GOLD, width=6)
    s7 = Shot('07_مقارنة_الترجمات', 60, 640, 900, crop=(200, 430, 1720, 960))
    els.append(s7.el(2.0, 2.6, dy=220))
    cols = [s7.pt(x, 430)[0] for x in (1411, 929, 446)]
    T(arrow([(cols[0] - 10, 650), ((cols[0] + cols[1]) / 2, 590), (cols[1] + 10, 650)], 22, both=True) +
      arrow([(cols[1] - 10, 650), ((cols[1] + cols[2]) / 2, 590), (cols[2] + 10, 650)], 22, both=True),
      2.6, 3.4, color=GOLD, width=6)
    els.append(Text('فاندايك · كتاب الحياة · KJV', 860, 440, 66, 3.4, 4.4))
    T([line((160, 540), (860, 534), 1.0)], 4.4, 4.7, color=GOLD, width=8)
    return 6.0, els


def scene6():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    els.append(Text('«محبة»', 1440, 90, 150, 0.45, 1.25, NAVY, 'c'))
    T([line((1440, 320), (1440, 360), 0.5)] + arrow([(1440, 360), (1330, 400), (1200, 470)], 24) +
      arrow([(1440, 360), (1560, 400), (1690, 470)], 24), 1.25, 1.85, color=INK, width=6)
    els.append(Text('ἀγάπη', 1185, 505, 76, 1.85, 2.15, GOLD, 'c', rtl=False))
    els.append(Text(get_display('אהבה'), 1695, 505, 76, 2.15, 2.45, GOLD, 'c', rtl=False))
    sc = []
    for cx in (1185, 1695):
        x0, x1, y0, y1 = cx - 180, cx + 180, 485, 625
        sc += [line((x0, y0), (x1, y0), 1.0), line((x0, y1), (x1, y1), 1.0),
               ellipse(x0, (y0 + y1) / 2, 16, (y1 - y0) / 2, amp=0.6), ellipse(x1, (y0 + y1) / 2, 16, (y1 - y0) / 2, amp=0.6)]
    T(sc, 2.45, 3.0, width=5)
    s8 = Shot('08_البحث_بالجذر', 60, 300, 880)
    els.append(s8.el(3.0, 3.6))
    els.append(Text('اكتب كلمة عربية… واعرف أصلها', 1850, 760, 62, 3.6, 4.5))
    T([line((1060, 860), (1845, 854), 1.0)], 4.5, 4.8, color=GOLD, width=8)
    return 5.0, els


def scene7():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    s9 = Shot('09_الخريطة_الذهنية', 60, 140, 880)
    els.append(s9.el(0.45, 1.0, 'pop'))
    T([curve([(1010, 300), (1120, 330), (1200, 352), (1300, 322), (1420, 342), (1540, 330), (1640, 302), (1730, 290)]),
       curve([(1730, 290), (1760, 380), (1742, 480), (1722, 600), (1702, 720)])], 1.1, 2.0, width=5)
    T([poly([(1380, 470), (1460, 446), (1560, 430), (1622, 410), (1582, 456), (1500, 494), (1412, 502)], True)],
      2.0, 2.4, width=5)
    waves = []
    for (x, y) in [(1110, 560), (1270, 650), (1520, 620), (1620, 540), (1180, 440)]:
        waves.append(curve([(x - 30, y), (x - 15, y - 9), (x, y), (x + 15, y + 9), (x + 30, y)], 0.3))
    T(waves, 2.4, 2.7, color=NAVY, width=4)
    route = curve([(1800, 322), (1752, 356), (1680, 400), (1600, 428), (1500, 470), (1400, 490), (1320, 422),
                   (1240, 352), (1205, 302)], 0.6)
    T(dashed(route), 2.7, 3.6, color=GOLD, width=6)
    pins = []
    for (x, y) in [(1800, 322), (1500, 468), (1205, 302)]:
        pins += [ellipse(x, y - 40, 15, 15, amp=0.3), line((x - 12, y - 31), (x, y), 0.3), line((x + 12, y - 31), (x, y), 0.3)]
        els.append(Fill([(x + 9 * math.cos(a / 12 * 6.283), y - 40 + 9 * math.sin(a / 12 * 6.283)) for a in range(12)],
                        3.6, 3.65, NAVY, 255))
    T(pins, 3.62, 4.0, color=NAVY, width=5)
    els.append(Text('أنطاكية', 1800, 205, 46, 4.0, 4.2, NAVY, 'c'))
    els.append(Text('قبرس', 1500, 512, 46, 4.2, 4.4, NAVY, 'c'))
    els.append(Text('برجة', 1205, 190, 46, 4.4, 4.6, NAVY, 'c'))
    els.append(Text('خريطة ذهنية · خرائط الأماكن', 1860, 830, 72, 4.6, 5.5))
    T([line((1000, 945), (1855, 938), 1.0)], 5.5, 5.8, color=GOLD, width=8)
    return 6.0, els


def scene8():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    T([rect(1500, 130, 340, 600), line((1640, 152), (1700, 152), 0.3), ellipse(1670, 717, 8, 8, amp=0.2)],
      0.45, 1.0, width=6)
    els.append(Pic(screen_fill('10_القراءة_الزمنية', 300, 534, crop=(1000, 95, 1475, 940)), 1520, 170, 1.0, 1.6, 'wipe'))
    els.append(Text('٣٦٥ يومًا', 720, 230, 104, 1.6, 2.3, GOLD))
    T(arrow([(1860, 862), (980, 868), (70, 860)], 30), 2.4, 3.1, width=7)
    xs = [1700, 1450, 1200, 950, 700, 450, 220]
    for i, x in enumerate(xs):
        els.append(Fill([(x + 13 * math.cos(a / 14 * 6.283), 864 + 13 * math.sin(a / 14 * 6.283)) for a in range(14)],
                        3.1 + i * 0.05, 3.15 + i * 0.05, GOLD, 255))
    s11 = Shot('11_الخط_الزمني', 780, 190, 620, crop=(452, 100, 1470, 890))
    els.append(s11.el(3.5, 4.1, dy=220))
    els.append(Text('أكثر من ٤٠٠ حدث', 720, 400, 84, 4.1, 4.9))
    T([line((150, 530), (715, 524), 1.0)], 4.9, 5.2, color=GOLD, width=8)
    return 6.0, els


def scene9():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    T([rect(1000, 90, 860, 500)], 0.45, 1.0, width=6)
    T([line((975, 72), (1885, 72), 0.6), line((1060, 72), (1060, 90), 0.2), line((1800, 72), (1800, 90), 0.2)],
      1.0, 1.15, width=6)
    T([line((180, 640), (560, 640), 0.8), line((215, 640), (210, 800), 0.6), line((525, 640), (530, 800), 0.6)],
      1.15, 1.5, width=6)
    T([rect(250, 560, 230, 80), ellipse(480, 600, 24, 24, amp=0.4), line((280, 640), (280, 652), 0.2),
       line((450, 640), (450, 652), 0.2)], 1.5, 1.9, width=6)
    els.append(Fill([(500, 592), (1000, 94), (1000, 588), (500, 610)], 1.9, 2.15, GOLD, 55))
    els.append(Pic(screen_fill('12_العرض_بملء_الشاشة', 820, 460), 1020, 110, 2.1, 2.6, 'fade'))
    chairs, heads = [], []
    for row, y in enumerate((770, 935)):
        for i in range(6):
            x = 1090 + i * 144 + row * 30
            chairs += [rect(x - 38, y - 64, 76, 46, 0.8), line((x - 32, y - 18), (x - 32, y + 32), 0.3),
                       line((x + 32, y - 18), (x + 32, y + 32), 0.3)]
            if (row, i) in ((0, 1), (0, 3), (0, 4), (1, 0), (1, 2), (1, 5)):
                heads.append(ellipse(x, y - 92, 22, 25, amp=0.4))
    T(chairs, 2.6, 3.6, width=5)
    T(heads, 3.6, 3.9, width=5)
    els.append(Text('للخدام: اعرض الآيات', 760, 120, 84, 3.9, 4.7))
    return 5.0, els


def scene10():
    els = []
    T = lambda s, a, b, **k: els.append(Strokes(s, a, b, **k))
    labels = ['مجاني', 'بلا تسجيل', 'بلا إعلانات', 'يعمل دون إنترنت']
    t = 0.45
    for i, lab in enumerate(labels):
        y = 170 + i * 135
        T([curve([(1735, y + 10), (1765, y + 48), (1830, y - 30)], 0.6)], t, t + 0.33, color=GOLD, width=13)
        els.append(Text(lab, 1690, y - 34, 74, t + 0.33, t + 0.8))
        t += 0.8
    logo = brand('logo-horizontal-light-240h.png', 640)
    els.append(Pic(logo, 520 - 320, 260, 3.7, 4.1, 'pop'))
    ban = [(360, 735), (1560, 735), (1515, 822), (1560, 910), (360, 910), (405, 822)]
    els.append(Fill(ban, 4.1, 4.3, GOLD, 75))
    T([poly(ban, True, 1.2)], 4.3, 4.8, width=6)
    els.append(Text('godod.app', 960, 752, 124, 4.8, 5.5, NAVY, 'c', rtl=False))
    return 7.0, els


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8, scene9, scene10]

VO = [  # voice-over script (for the .srt and later recording)
    (0, 5, 'هل أردت أن تدرس آية بعمق، فوجدت أن أفضل أدوات الدراسة بالإنجليزية فقط؟'),
    (5, 10, 'تعرّف على «جدد وعتقاء»: مكتبة عربية مجانية لدراسة الكتاب المقدس.'),
    (10, 17, 'اضغط على رقم أي آية، فتظهر شواهدها من الكتاب كله، من أكثر من ثلاثمئة وثمانين ألف شاهد.'),
    (17, 25, 'واضغط على أي كلمة، فتعرف أصلها العبري أو اليوناني ومعناها، في قواميس سترونج و«بي دي بي» وأبوت-سميث، بالعربية لأول مرة.'),
    (25, 31, 'وفي وضع الدراسة: أرقام سترونج فوق الكلمات، ومقارنة الترجمات جنبًا إلى جنب.'),
    (31, 36, 'اكتب كلمة عربية، فنوصلك إلى الكلمات الأصلية التي تُرجمت إليها.'),
    (36, 42, 'تتبّع خيط الشواهد في خريطة ذهنية، وشاهد أماكن الأحداث على الخريطة.'),
    (42, 48, 'اقرأ الكتاب كله بترتيب الأحداث في سنة، وتابعها على الخط الزمني.'),
    (48, 53, 'وللخدام: اعرض الآيات بملء الشاشة أو على البروجكتور.'),
    (53, 60, 'مجانًا، بلا تسجيل ولا إعلانات، ويعمل دون إنترنت. ابدأ الآن على godod.app'),
]


# ----------------------------------------------------------------------------- timeline / hand


OFF = (W + 260, H + 360)


def hand_track(els, n):
    """Per-frame hand tip position (or OFF) for one scene, plus drawing activity."""
    raw = [None] * n
    kinds = [None] * n
    for f in range(n):
        t = f / FPS
        best = None
        for e in els:
            if e.hand and e.t0 <= t < e.t1:
                tp = e.tip(t)
                if tp is not None and (best is None or e.t0 >= best[0].t0):
                    best = (e, tp)
        if best:
            raw[f] = best[1]
            kinds[f] = best[0].kind
    out = list(raw)
    known = [i for i in range(n) if raw[i] is not None]
    enter = int(0.33 * FPS)
    if not known:
        return [OFF] * n, kinds
    for i in range(0, known[0]):
        k = clamp((i - (known[0] - enter)) / enter)
        out[i] = lerp(OFF, raw[known[0]], ease_io(k))
    for a, b in zip(known, known[1:]):
        if b - a <= 1:
            continue
        gap = b - a
        A, B = raw[a], raw[b]
        if gap <= int(0.9 * FPS):
            for i in range(a + 1, b):
                out[i] = lerp(A, B, ease_io((i - a) / gap))
        else:
            for i in range(a + 1, b):
                if i - a <= enter:
                    out[i] = lerp(A, OFF, ease_io((i - a) / enter))
                elif b - i <= enter:
                    out[i] = lerp(OFF, B, ease_io(1 - (b - i) / enter))
                else:
                    out[i] = OFF
    last = known[-1]
    for i in range(last + 1, n):
        out[i] = lerp(raw[last], OFF, ease_io(clamp((i - last) / enter)))
    return out, kinds


def lerp(a, b, k):
    return (a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k)


def build():
    scenes, start = [], 0.0
    for fn in SCENES:
        dur, els = fn()
        n = int(round(dur * FPS))
        track, kinds = hand_track(els, n)
        scenes.append(dict(start=start, dur=dur, n=n, els=els, track=track, kinds=kinds))
        start += dur
    return scenes


# ----------------------------------------------------------------------------- audio


SR = 44100


def synth_audio(scenes, total):
    N = int(total * SR)
    t = np.arange(N) / SR
    rng = np.random.default_rng(5)
    music = np.zeros(N)
    bpm = 80
    beat = 60 / bpm
    bar = beat * 4
    # D – A – Bm – G
    chords = [[50, 57, 62, 66, 69], [45, 52, 57, 61, 64], [47, 54, 59, 62, 66], [43, 50, 55, 59, 62]]
    mtof = lambda m: 440 * 2 ** ((m - 69) / 12)

    def pluck(start, midi, amp, dur=2.2):
        i0 = int(start * SR)
        n = min(int(dur * SR), N - i0)
        if n <= 0:
            return
        tt = np.arange(n) / SR
        f = mtof(midi)
        sig = np.zeros(n)
        for k in range(1, 7):
            sig += (1 / k ** 1.4) * np.sin(2 * np.pi * f * k * tt + k) * np.exp(-tt * (1.8 + 1.1 * k))
        sig *= np.minimum(1, tt / 0.004)
        music[i0:i0 + n] += amp * sig

    pattern = [0, 2, 3, 2, 4, 2, 3, 1]
    nbars = int(total / bar) + 1
    for b in range(nbars):
        ch = chords[b % 4]
        t0 = b * bar
        pluck(t0, ch[0] - 12, 0.55, 3.0)                         # bass
        for j, idx in enumerate(pattern):
            pluck(t0 + j * beat / 2, ch[idx], 0.20 + 0.05 * (j == 0), 1.8)
        # soft pad
        i0 = int(t0 * SR)
        n = min(int(bar * SR), N - i0)
        if n > 0:
            tt = np.arange(n) / SR
            env = np.sin(np.pi * tt / bar) ** 2
            pad = sum(np.sin(2 * np.pi * mtof(m) * tt) for m in ch[1:4]) / 3
            music[i0:i0 + n] += 0.06 * env * pad
    music /= np.max(np.abs(music)) + 1e-9
    music *= 0.16
    fade = np.minimum(1, t / 1.2) * np.minimum(1, (total - t) / 2.5)
    music *= fade

    def bandnoise(n, lo, hi):
        x = rng.normal(0, 1, n)
        X = np.fft.rfft(x)
        fr = np.fft.rfftfreq(n, 1 / SR)
        X[(fr < lo) | (fr > hi)] = 0
        y = np.fft.irfft(X, n)
        return y / (np.max(np.abs(y)) + 1e-9)

    # marker squeak / scratch driven by hand movement while drawing
    act = np.zeros(int(total * FPS) + 2)
    events = []
    for sc in scenes:
        f0 = int(round(sc['start'] * FPS))
        tr, kinds = sc['track'], sc['kinds']
        for i in range(1, sc['n']):
            if kinds[i] == 'draw' and tr[i] is not None and tr[i - 1] is not None:
                sp = math.hypot(tr[i][0] - tr[i - 1][0], tr[i][1] - tr[i - 1][1])
                act[f0 + i] = clamp(sp / 30)
        for e in sc['els']:
            if e.kind in ('slide', 'pop'):
                events.append((sc['start'] + e.t0, e.kind))
        if sc['start'] > 0:
            events.append((sc['start'], 'pan'))
    env = np.interp(t, np.arange(len(act)) / FPS, act)
    k = int(0.03 * SR)
    env = np.convolve(env, np.ones(k) / k, mode='same')
    grain = np.abs(bandnoise(N, 8, 40))
    scratch = bandnoise(N, 1800, 6500) * (0.35 + grain)
    squeak = np.sin(2 * np.pi * (2100 + 300 * np.sin(2 * np.pi * 3.1 * t)) * t) * (grain > 0.55)
    marker = (0.055 * scratch + 0.012 * squeak) * env

    fx = np.zeros(N)
    for (te, kind) in events:
        i0 = int(te * SR)
        if kind == 'pop':
            n = int(0.09 * SR)
            tt = np.arange(n) / SR
            s = np.sin(2 * np.pi * (520 + 5200 * tt) * tt) * np.exp(-tt * 45) * 0.16
        else:
            dur = 0.55 if kind == 'slide' else 0.5
            n = int(dur * SR)
            tt = np.arange(n) / SR
            lo, hi = (300, 2600) if kind == 'slide' else (120, 1400)
            s = bandnoise(n, lo, hi) * np.sin(np.pi * tt / dur) ** 2 * (0.07 if kind == 'slide' else 0.06)
        n = min(len(s), N - i0)
        if n > 0:
            fx[i0:i0 + n] += s[:n]

    mix = music + marker + fx
    left = mix + 0.02 * np.roll(fx, 200)
    right = mix + 0.02 * np.roll(music, 300)
    st = np.stack([left, right], 1)
    st /= max(1.0, np.max(np.abs(st)) / 0.95)
    data = (st * 32767).astype(np.int16)
    with wave.open(TMP_WAV, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def write_srt():
    def ts(s):
        return '00:00:%02d,000' % s if s < 60 else '00:01:00,000'
    with open(OUT_SRT, 'w', encoding='utf-8') as f:
        for i, (a, b, txt) in enumerate(VO, 1):
            f.write('%d\n%s --> %s\n%s\n\n' % (i, ts(a), ts(b), txt))


# ----------------------------------------------------------------------------- render


def compose_hand(frame, pos, hand, tip, t):
    if pos is None or pos[0] > W + 200:
        return
    jx = 1.2 * math.sin(t * 9.0)
    jy = 1.2 * math.cos(t * 7.3)
    paste_clipped(frame, hand, int(pos[0] - tip[0] + jx), int(pos[1] - tip[1] + jy))


def paste_clipped(dst, src, x, y):
    sx0, sy0 = max(0, -x), max(0, -y)
    dx0, dy0 = max(0, x), max(0, y)
    w = min(src.width - sx0, dst.width - dx0)
    h = min(src.height - sy0, dst.height - dy0)
    if w > 0 and h > 0:
        dst.alpha_composite(src.crop((sx0, sy0, sx0 + w, sy0 + h)), (dx0, dy0))


def pan_frame(prev, cur, t):
    k = ease_io(clamp(t / PAN))
    off = int(W * k)
    out = Image.new('RGBA', (W, H))
    out.paste(cur, (off - W, 0))
    out.paste(prev, (off, 0))
    return out


def scene_state(paper, sc, t):
    c = paper.copy()
    for e in sc['els']:
        e.draw(c, min(t, e.t1) if t >= e.t1 else t)
    return c


def render_stills(scenes, times, paper, hand, tip):
    outdir = os.path.join(HERE, 'stills')
    os.makedirs(outdir, exist_ok=True)
    for T in times:
        for si, sc in enumerate(scenes):
            if sc['start'] <= T < sc['start'] + sc['dur'] or si == len(scenes) - 1:
                t = T - sc['start']
                fr = scene_state(paper, sc, t)
                if si > 0 and t < PAN:
                    prev = scene_state(paper, scenes[si - 1], 99)
                    fr = pan_frame(prev, fr, t)
                f = min(sc['n'] - 1, int(t * FPS))
                compose_hand(fr, sc['track'][f], hand, tip, t)
                fr.convert('RGB').save(os.path.join(outdir, 'still_%05.1f.png' % T))
                break


def render_video(scenes, paper, hand, tip, total):
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [ff, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H),
           '-r', str(FPS), '-i', '-', '-i', TMP_WAV, '-map', '0:v', '-map', '1:a',
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
           '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUT_MP4]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    prev_final = None
    written = 0
    for si, sc in enumerate(scenes):
        base = paper.copy()
        baked = set()
        order = sorted(range(len(sc['els'])), key=lambda i: (sc['els'][i].t1, i))
        for f in range(sc['n']):
            t = f / FPS
            for i in order:
                e = sc['els'][i]
                if i not in baked and t >= e.t1:
                    e.draw(base, e.t1)
                    baked.add(i)
            fr = base.copy()
            for i, e in enumerate(sc['els']):
                if i not in baked and e.t0 <= t:
                    e.draw(fr, t)
            if prev_final is not None and t < PAN:
                fr = pan_frame(prev_final, fr, t)
            compose_hand(fr, sc['track'][f], hand, tip, sc['start'] + t)
            proc.stdin.write(fr.convert('RGB').tobytes())
            written += 1
        final = paper.copy()
        for e in sc['els']:
            e.draw(final, e.t1)
        prev_final = final
        print('scene %d/%d done (%d frames)' % (si + 1, len(scenes), written), flush=True)
    proc.stdin.close()
    proc.wait()
    return proc.returncode


def main():
    scenes = build()
    total = sum(s['dur'] for s in scenes)
    paper = make_paper()
    hand, tip = make_hand()
    if '--stills' in sys.argv:
        times = [float(x) for x in sys.argv[sys.argv.index('--stills') + 1].split(',')]
        render_stills(scenes, times, paper, hand, tip)
        return
    print('synthesizing soundtrack…', flush=True)
    synth_audio(scenes, total)
    write_srt()
    rc = render_video(scenes, paper, hand, tip, total)
    print('ffmpeg exit code', rc)


if __name__ == '__main__':
    main()
