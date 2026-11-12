# -*- coding: utf-8 -*-
"""
Adds an Arabic AI voice-over (Microsoft Edge neural TTS via edge-tts) to the
whiteboard video. Each script line is generated separately, sped up only if it
would overrun its scene, placed at the scene start, and mixed over the music
(which is ducked while the voice speaks).

Run after make_video.py:   py add_voice.py [voice]
Default voice: ar-EG-ShakirNeural (others: ar-EG-SalmaNeural, ar-SA-HamedNeural, ar-SA-ZariyahNeural)
Outputs:
  ../../whiteboard_60s_جدد_وعتقاء.mp4            (with voice)
  ../../whiteboard_60s_جدد_وعتقاء_بدون_صوت.mp4   (music only, kept as backup)
"""
import asyncio, os, sys, wave, subprocess, shutil, math
import numpy as np
import edge_tts
import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
VIDEOS = os.path.dirname(os.path.dirname(HERE))
MP4 = os.path.join(VIDEOS, 'whiteboard_60s_جدد_وعتقاء.mp4')
MP4_NOVOICE = os.path.join(VIDEOS, 'whiteboard_60s_جدد_وعتقاء_بدون_صوت.mp4')
MUSIC = os.path.join(HERE, 'soundtrack.wav')
VDIR = os.path.join(HERE, 'voice')
FF = imageio_ffmpeg.get_ffmpeg_exe()
SR = 44100
VOICE = sys.argv[1] if len(sys.argv) > 1 else 'ar-EG-ShakirNeural'
SRT = os.path.join(VIDEOS, 'whiteboard_60s_جدد_وعتقاء.srt')

# (scene start, scene end, text as spoken) — Egyptian colloquial script.
# English names are written in Latin letters so the voice says them in English.
# (The Fusha version is kept in the output folder as *_فصحى.mp4 / .srt.)
LINES = [
    (0, 5, 'عايز تدرس آية بعمق، بس أحسن الأدوات كلها بالإنجليزي؟'),
    (5, 10, 'جدد وعتقاء: مكتبة عربي مجانية لدراسة الكتاب المقدس.'),
    (10, 17, 'دوس على رقم أي آية، تطلعلك شواهدها من الكتاب كله: أكتر من تلتمية وتمانين ألف شاهد.'),
    (17, 25, 'ودوس على أي كلمة، تعرف أصلها ومعناها، في قواميس Strong و BDB و Abbott-Smith، بالعربي لأول مرة.'),
    (25, 31, 'وفي وضع الدراسة: أرقام Strong فوق الكلمات، والترجمات جنب بعض.'),
    (31, 36, 'اكتب كلمة بالعربي، وإحنا نوصّلك لأصلها العبري واليوناني.'),
    (36, 42, 'تابع الشواهد في خريطة ذهنية، وشوف أماكن الأحداث على الخريطة.'),
    (42, 48, 'اقرا الكتاب كله بترتيب الأحداث في سنة، وتابعها على الخط الزمني.'),
    (48, 53, 'ولو بتخدم: اعرض الآيات على الشاشة كلها، أو على الـ projector.'),
    (53, 60, 'ببلاش، من غير تسجيل ولا إعلانات، وبيشتغل من غير نت. ابدأ دلوقتي على godod.app'),
]


def write_srt(starts, durs):
    def ts(x):
        ms = int(round(x * 1000))
        return '00:%02d:%02d,%03d' % (ms // 60000, ms // 1000 % 60, ms % 1000)
    with open(SRT, 'w', encoding='utf-8') as f:
        for i, (st, d, (_, _, t)) in enumerate(zip(starts, durs, LINES), 1):
            t = t.replace('جودود دوت آب', 'godod.app').replace('بي دي بي', 'BDB')
            f.write('%d\n%s --> %s\n%s\n\n' % (i, ts(st), ts(st + d), t))
LEAD = 0.25    # voice starts this long after the scene starts


def read_wav(p):
    with wave.open(p) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        return a.reshape(-1, w.getnchannels())


def tts(text, rate, out_mp3):
    asyncio.run(edge_tts.Communicate(text, VOICE, rate='%+d%%' % rate).save(out_mp3))
    wav = out_mp3[:-4] + '_r%d.wav' % rate
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', out_mp3, '-ar', str(SR), '-ac', '2', wav], check=True)
    a = read_wav(wav)
    # trim leading/trailing silence
    m = np.abs(a).max(1)
    idx = np.where(m > 0.01)[0]
    return a[max(0, idx[0] - 400): idx[-1] + 2000] if len(idx) else a


def smooth(x, k):
    c = np.cumsum(np.concatenate([[0.0], x]))
    y = (c[k:] - c[:-k]) / k
    pad = len(x) - len(y)
    return np.concatenate([np.zeros(pad // 2), y, np.zeros(pad - pad // 2)])


def schedule(durs):
    """Each line starts near its scene start (allowing a short pre-roll) or right after the previous line, whichever is later."""
    starts, prev_end = [], 0.0
    for (s, e, _), d in zip(LINES, durs):
        st = max(s + LEAD - (PREROLL if s > 0 else 0), prev_end + GAP)
        starts.append(st)
        prev_end = st + d
    return starts, prev_end


GAP = 0.25      # pause between consecutive lines
END = 59.85     # the last line must finish by here
PREROLL = 0.6   # a line may begin this much before its scene's visuals (J-cut) when the previous line is done
MAX_DRIFT = 2.6 # a line may spill this far into the next scene


def fits(durs):
    starts, last = schedule(durs)
    if last > END:
        return False
    for i, (st, d) in enumerate(zip(starts, durs)):
        if i + 1 < len(LINES) and st + d > LINES[i + 1][0] + MAX_DRIFT:
            return False
    return True


def render(rate):
    return [tts(t, rate, os.path.join(VDIR, 'line%02d.mp3' % i)) for i, (_, _, t) in enumerate(LINES, 1)]


def main():
    os.makedirs(VDIR, exist_ok=True)
    music = read_wav(MUSIC)
    N = len(music)
    clips = render(0)
    nat = [len(c) / SR for c in clips]
    rate = 0
    if not fits(nat):
        f = 1.0
        while not fits([d / f for d in nat]) and f < 1.5:
            f += 0.01
        rate = int(round((f - 1) * 100)) + 1
        while True:
            clips = render(rate)
            durs = [len(c) / SR for c in clips]
            if fits(durs) or rate >= 45:
                break
            rate += 3
    durs = [len(c) / SR for c in clips]
    starts, last = schedule(durs)
    print('voice %s, rate %+d%%, natural total %.1fs' % (VOICE, rate, sum(nat)))
    for i, (st, d, (s, e, _)) in enumerate(zip(starts, durs, LINES), 1):
        print('line %2d: scene %2d-%2ds  voice %.2f-%.2fs' % (i, s, e, st, st + d))
    write_srt(starts, durs)
    voice = np.zeros_like(music)
    for st, c in zip(starts, clips):
        i0 = int(st * SR)
        n = min(len(c), N - i0)
        voice[i0:i0 + n] += c[:n]
    voice *= 0.92 / (np.abs(voice).max() + 1e-9)
    act = (np.abs(voice).max(1) > 0.02).astype(np.float64)
    act = smooth(smooth(act, int(0.05 * SR)) > 0, int(0.3 * SR)).clip(0, 1)
    duck = 1 - 0.45 * act
    mix = music * 1.35 * duck[:, None] + voice
    mix /= max(1.0, np.abs(mix).max() / 0.97)
    out_wav = os.path.join(HERE, 'soundtrack_voice.wav')
    with wave.open(out_wav, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())
    if not os.path.exists(MP4_NOVOICE):
        shutil.copyfile(MP4, MP4_NOVOICE)
    tmp = os.path.join(HERE, 'tmp_voice.mp4')
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', MP4_NOVOICE, '-i', out_wav, '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', tmp], check=True)
    shutil.move(tmp, MP4)
    print('done')


if __name__ == '__main__':
    main()
