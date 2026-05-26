#!/usr/bin/env python3
"""
Transcript IQ — CSM Platform Overview PDF
Design philosophy: "Lucid Signal" — Analytical Precision meets Editorial Clarity
"""

import io, base64, re
from PIL import Image, ImageDraw
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.utils import simpleSplit, ImageReader

# ─── Brand Palette ────────────────────────────────────────────────────────────
C_ACCENT       = HexColor('#10B981')
C_ACCENT_DEEP  = HexColor('#047857')
C_ACCENT_MID   = HexColor('#059669')
C_ACCENT_LIGHT = HexColor('#A7F3D0')
C_ACCENT_PALE  = HexColor('#D1FAE5')
C_INK          = HexColor('#09090B')
C_INK2         = HexColor('#27272A')
C_SLATE        = HexColor('#52525B')
C_MIST         = HexColor('#A1A1AA')
C_BORDER       = HexColor('#E4E4E7')
C_BG           = HexColor('#FAFAF9')
C_WHITE        = HexColor('#FFFFFF')
C_SURFACE2     = HexColor('#F4F4F5')

# ─── Page Geometry ────────────────────────────────────────────────────────────
W, H   = A4          # 595.27 x 841.89 pt
ML     = 52          # left margin
MR     = 48          # right margin
MT     = 52          # top margin (from top)
MB     = 44          # bottom margin (from bottom)
CW     = W - ML - MR # content width ≈ 495 pt

SPINE  = 4           # left accent bar width

def top(y_from_top):
    """Convert y measured from page top → reportlab bottom-relative y."""
    return H - y_from_top

# ─── Logo Extraction ──────────────────────────────────────────────────────────
def load_logo_mark_png():
    """Extract the geometric icon mark from the SVG's embedded PNG."""
    svg_path = '_docs/Trascript IQ - Logo Files - Black.svg'
    with open(svg_path, 'r') as f:
        content = f.read()
    matches = re.findall(r'xlink:href="data:image/png;base64,([^"]+)"', content)
    # The second (larger) PNG is the actual icon artwork
    png_bytes = base64.b64decode(matches[1])
    img = Image.open(io.BytesIO(png_bytes)).convert('RGBA')

    # Make white/near-white pixels transparent
    r_ch, g_ch, b_ch, a_ch = img.split()
    import struct
    r_data = list(r_ch.tobytes())
    g_data = list(g_ch.tobytes())
    b_data = list(b_ch.tobytes())
    new_data = []
    for r, g, b in zip(r_data, g_data, b_data):
        if r > 210 and g > 210 and b > 210:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append((r, g, b, 255))
    img.putdata(new_data)

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf

# ─── Drawing Helpers ──────────────────────────────────────────────────────────
def frect(c, x, y_top, w, h, fill, stroke_c=None, stroke_w=0.4, r=0):
    """Draw a filled rectangle using top-relative y."""
    rb = top(y_top + h)
    c.setFillColor(fill)
    if stroke_c:
        c.setStrokeColor(stroke_c)
        c.setLineWidth(stroke_w)
        if r: c.roundRect(x, rb, w, h, r, fill=1, stroke=1)
        else: c.rect(x, rb, w, h, fill=1, stroke=1)
    else:
        if r: c.roundRect(x, rb, w, h, r, fill=1, stroke=0)
        else: c.rect(x, rb, w, h, fill=1, stroke=0)

def hline(c, x1, y_top, x2, color=None, lw=0.5):
    c.setStrokeColor(color or C_BORDER)
    c.setLineWidth(lw)
    c.line(x1, top(y_top), x2, top(y_top))

def txt(c, x, y_top, text, font='Helvetica', size=10, color=C_INK, align='left'):
    c.setFont(font, size)
    c.setFillColor(color)
    y = top(y_top)
    if align == 'right':
        c.drawRightString(x, y, text)
    elif align == 'center':
        c.drawCentredString(x, y, text)
    else:
        c.drawString(x, y, text)

def txt_wrap(c, x, y_top, text, w, font='Helvetica', size=10, color=C_INK, leading=None):
    """Draw wrapped text; return next y_top after last line."""
    if leading is None:
        leading = size * 1.45
    c.setFont(font, size)
    c.setFillColor(color)
    lines = simpleSplit(text, font, size, w)
    y = y_top
    for ln in lines:
        c.drawString(x, top(y), ln)
        y += leading
    return y

def dot(c, x, y_top, r=2, color=C_ACCENT):
    c.setFillColor(color)
    c.circle(x, top(y_top) - r, r, fill=1, stroke=0)

def tag(c, x, y_top, label, font='Courier', size=6.5, fc=C_SLATE, bc=C_SURFACE2, sc=C_BORDER):
    """Draw a small rounded tag/chip."""
    tw = c.stringWidth(label, font, size)
    pw, ph, rad = tw + 10, 11, 2
    frect(c, x, y_top - 1, pw, ph, bc, stroke_c=sc, stroke_w=0.4, r=rad)
    txt(c, x + 5, y_top + 1.5, label, font=font, size=size, color=fc)
    return pw + 5   # advance x

# ─── Page 1 ───────────────────────────────────────────────────────────────────
def page1(c, logo_buf):
    # --- background ---
    c.setFillColor(C_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # --- left accent spine ---
    c.setFillColor(C_ACCENT_DEEP)
    c.rect(0, 0, SPINE, H, fill=1, stroke=0)

    # ── HEADER ──────────────────────────────────────────────────────
    HDR_TOP = MT   # 52pt from top

    # Logo mark — 36pt tall, proportional width
    logo_w, logo_h = 36 * (884/812), 36
    logo_buf.seek(0)
    logo_reader = ImageReader(logo_buf)
    c.drawImage(logo_reader, ML, top(HDR_TOP + logo_h), logo_w, logo_h,
                mask='auto', preserveAspectRatio=True)

    # Wordmark beside logo mark
    wm_x = ML + logo_w + 6
    txt(c, wm_x, HDR_TOP + 10, 'TRANSCRIPT', 'Helvetica-Bold', 13, C_INK)
    txt(c, wm_x, HDR_TOP + 25, 'IQ', 'Helvetica-Bold', 13, C_ACCENT_DEEP)

    # Tagline right-aligned
    txt(c, W - MR, HDR_TOP + 18, 'Primary Research Intelligence',
        'Helvetica', 7.5, C_MIST, align='right')

    # Header separator
    hline(c, ML, HDR_TOP + 38, W - MR, color=C_BORDER, lw=0.6)

    # ── HERO ────────────────────────────────────────────────────────
    HY = HDR_TOP + 55  # hero zone starts

    txt(c, ML, HY, 'FOR INSTITUTIONAL INVESTORS',
        'Courier-Bold', 6.5, C_ACCENT)

    HY += 16

    # Two-line headline
    txt(c, ML, HY,      'Intelligence from the',       'Helvetica-Bold', 27, C_INK)
    txt(c, ML, HY + 33, 'conversations that', 'Helvetica-Bold', 27, C_INK)
    txt(c, ML, HY + 66, 'move markets.',               'Helvetica-Bold', 27, C_ACCENT_DEEP)

    # Signature accent rule — 48pt emerald bar beneath headline
    HY += 94
    c.setFillColor(C_ACCENT)
    c.rect(ML, top(HY), 48, 3, fill=1, stroke=0)
    c.setFillColor(C_BORDER)
    c.rect(ML + 52, top(HY), CW - 52, 0.5, fill=1, stroke=0)

    HY += 14

    # Hero subtext
    hero_body = (
        'Transcript IQ gives institutional investors direct access to primary research intelligence — '
        'MNPI-screened expert conversations, structured earnings analysis, and bespoke '
        'engagements delivered with speed and precision.'
    )
    HY = txt_wrap(c, ML, HY, hero_body, CW - 60,
                  'Helvetica', 10.5, C_SLATE, leading=15.5)

    HY += 20

    # Stats band — four numbers across the full content width
    stats = [
        ('100+', 'Expert conversations\nper month'),
        ('50+',  'Sectors covered\nglobally'),
        ('<24h', 'Average delivery\nturnaround'),
        ('MNPI', 'Compliance-screened\nfor every transcript'),
    ]
    stat_w = CW / 4
    stat_left_border = ML
    # light surface behind stats
    frect(c, ML - 6, HY - 4, CW + 8, 56, C_SURFACE2, r=6)

    for i, (num, label) in enumerate(stats):
        sx = stat_left_border + i * stat_w

        # vertical divider (except before first)
        if i > 0:
            c.setStrokeColor(C_BORDER)
            c.setLineWidth(0.5)
            c.line(sx - 2, top(HY), sx - 2, top(HY + 48))

        txt(c, sx + 4, HY + 11, num, 'Helvetica-Bold', 20, C_ACCENT_DEEP)
        # label lines
        for j, ln in enumerate(label.split('\n')):
            txt(c, sx + 4, HY + 34 + j * 10, ln.upper(), 'Courier', 6, C_SLATE)

    HY += 68

    # section divider
    hline(c, ML, HY, W - MR, C_BORDER, 0.5)

    # ── THREE PRODUCTS ───────────────────────────────────────────────
    HY += 14

    txt(c, ML, HY, 'WHAT WE OFFER', 'Courier-Bold', 6.5, C_MIST)
    HY += 14

    products = [
        {
            'num': '01',
            'label': 'EXPERT TRANSCRIPTS',
            'headline': ['Expert', 'Transcripts'],
            'body': (
                'Verbatim, MNPI-screened conversations with former C-suite '
                'executives, VPs, directors, and senior practitioners. '
                'Each transcript is compliance-reviewed and instantly '
                'downloadable as a PDF — primary source intelligence '
                'for thesis-driven research.'
            ),
            'tags': ['MNPI Screened', 'C-Suite & VP', '30–90 Min', 'Instant PDF'],
        },
        {
            'num': '02',
            'label': 'EARNINGS ANALYSIS',
            'headline': ['Earnings', 'Analysis'],
            'body': (
                'Structured, analyst-quality coverage on quarterly results. '
                'EPS and revenue beats / misses, management commentary, '
                'guidance highlights, and key risks — concise and '
                'actionable for portfolio managers making real-time calls.'
            ),
            'tags': ['EPS & Revenue', 'Beat/Miss/In-Line', 'Guidance', 'Sector Coverage'],
        },
        {
            'num': '03',
            'label': 'CUSTOM TRANSCRIPTS',
            'headline': ['Custom', 'Transcripts'],
            'body': (
                'Bespoke research engagements built around your mandate. '
                'Define the expert profile, company, or sector — we source '
                'the conversation. Ideal for thematic deep-dives, '
                'channel checks, and white-labelled research.'
            ),
            'tags': ['Purpose-Built', 'Expert Sourcing', 'Confidential', 'Rapid Turnaround'],
        },
    ]

    CARD_GAP = 14
    col_w = (CW - 2 * CARD_GAP) / 3
    CARD_H = H - top(HY) - MB - 24   # fill to near bottom

    for i, p in enumerate(products):
        cx = ML + i * (col_w + CARD_GAP)
        cy_top = HY

        # Card background
        frect(c, cx, cy_top, col_w, CARD_H, C_WHITE,
              stroke_c=C_BORDER, stroke_w=0.5, r=5)

        # Emerald shoulder line at top of card
        frect(c, cx, cy_top, col_w, 3, C_ACCENT_DEEP, r=0)
        # Fix corners on shoulder (bottom of shoulder bar is inside card)
        c.setFillColor(C_ACCENT_DEEP)
        c.rect(cx, top(cy_top + 3), col_w, 3, fill=1, stroke=0)

        inner_x = cx + 10
        iy = cy_top + 16

        # Number mono label
        txt(c, inner_x, iy, p['num'], 'Courier-Bold', 7, C_ACCENT)
        txt(c, inner_x + 16, iy, p['label'], 'Courier', 6.5, C_MIST)
        iy += 22

        # Headline
        for ln in p['headline']:
            txt(c, inner_x, iy, ln, 'Helvetica-Bold', 17, C_INK)
            iy += 22

        iy += 6  # gap after headline

        # Body text
        iy = txt_wrap(c, inner_x, iy, p['body'], col_w - 18,
                      'Helvetica', 8.5, C_SLATE, leading=13)

        iy += 10  # gap before tags

        # Tags row
        tx = inner_x
        for tag_label in p['tags']:
            adv = tag(c, tx, iy, tag_label)
            tx += adv
            if tx > cx + col_w - 40:
                tx = inner_x
                iy += 14

    # ── FOOTER ──────────────────────────────────────────────────────
    hline(c, ML, H - MB - 14, W - MR, C_BORDER, 0.5)
    txt(c, ML, H - MB, 'transcript-iq.com', 'Courier', 6.5, C_MIST)
    txt(c, W - MR, H - MB,
        'Speak to your CSM · info@nextyn.com',
        'Courier', 6.5, C_MIST, align='right')


# ─── Page 2 ───────────────────────────────────────────────────────────────────
def page2(c, logo_buf):
    # --- background ---
    c.setFillColor(C_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # --- left accent spine ---
    c.setFillColor(C_ACCENT_DEEP)
    c.rect(0, 0, SPINE, H, fill=1, stroke=0)

    # ── HEADER ──────────────────────────────────────────────────────
    HDR_TOP = MT

    txt(c, ML, HDR_TOP + 14, 'TRANSCRIPT IQ', 'Helvetica-Bold', 8, C_INK)
    txt(c, W - MR, HDR_TOP + 14, 'Platform Overview',
        'Helvetica', 8, C_MIST, align='right')
    hline(c, ML, HDR_TOP + 26, W - MR, C_BORDER, 0.5)

    # ── WHY TRANSCRIPT IQ ────────────────────────────────────────────
    WY = HDR_TOP + 44

    txt(c, ML, WY, 'WHY TRANSCRIPT IQ', 'Courier-Bold', 6.5, C_ACCENT)
    WY += 18

    txt(c, ML, WY,      'Built for the way',       'Helvetica-Bold', 24, C_INK)
    txt(c, ML, WY + 30, 'institutional investors', 'Helvetica-Bold', 24, C_INK)
    txt(c, ML, WY + 60, 'actually work.',          'Helvetica-Bold', 24, C_ACCENT_DEEP)
    WY += 90

    sub = (
        "From on-the-ground channel checks to real-time earnings intelligence, "
        "Transcript IQ delivers research that's sourced, structured, and screened — "
        "so your team focuses on insight, not process."
    )
    WY = txt_wrap(c, ML, WY, sub, CW - 80, 'Helvetica', 10, C_SLATE, leading=15)
    WY += 22

    hline(c, ML, WY, W - MR, C_BORDER, 0.5)
    WY += 16

    txt(c, ML, WY, 'KEY DIFFERENTIATORS', 'Courier-Bold', 6.5, C_MIST)
    WY += 14

    # ── 2×2 DIFFERENTIATOR GRID ──────────────────────────────────────
    diffs = [
        {
            'label': 'EXPERT ACCESS',
            'title': 'People who were\nin the room.',
            'body': (
                'Former CEOs, CFOs, VPs, and directors across sectors and geographies. '
                'Profiles cover operational and strategic levels — giving you the '
                'right perspective for every investment thesis.'
            ),
        },
        {
            'label': 'COMPLIANCE-FIRST',
            'title': 'MNPI-screened,\nevery time.',
            'body': (
                'Every conversation is reviewed for material non-public information '
                'before delivery. Our compliance framework gives institutional '
                'investors confidence to act on what they read.'
            ),
        },
        {
            'label': 'SECTOR & GEO DEPTH',
            'title': 'Coverage where\nit counts.',
            'body': (
                'Technology, healthcare, financials, industrials, consumer, energy — '
                'and beyond. Transcript IQ covers the sectors and geographies '
                'that matter to buy-side teams globally.'
            ),
        },
        {
            'label': 'INSTANT DELIVERY',
            'title': 'No waiting.\nNo delays.',
            'body': (
                'Transcripts and analysis are delivered as PDFs upon purchase. '
                'For custom engagements, we target the fastest turnaround '
                'in the market without compromising quality or compliance.'
            ),
        },
    ]

    DCOL_GAP = 16
    dcol_w = (CW - DCOL_GAP) / 2
    DCARD_H = 155

    for i, d in enumerate(diffs):
        row = i // 2
        col = i % 2
        dx = ML + col * (dcol_w + DCOL_GAP)
        dy = WY + row * (DCARD_H + 12)

        # Card
        frect(c, dx, dy, dcol_w, DCARD_H, C_WHITE,
              stroke_c=C_BORDER, stroke_w=0.5, r=5)
        # Accent top shoulder
        frect(c, dx, dy, dcol_w, 3, C_ACCENT, r=0)
        c.setFillColor(C_ACCENT)
        c.rect(dx, top(dy + 3), dcol_w, 3, fill=1, stroke=0)

        inner_x = dx + 10
        iy = dy + 16

        txt(c, inner_x, iy, d['label'], 'Courier', 6.5, C_ACCENT)
        iy += 18

        for ln in d['title'].split('\n'):
            txt(c, inner_x, iy, ln, 'Helvetica-Bold', 14, C_INK)
            iy += 19

        iy += 6
        txt_wrap(c, inner_x, iy, d['body'], dcol_w - 18,
                 'Helvetica', 8.5, C_SLATE, leading=13)

    WY += 2 * (DCARD_H + 12) + 10

    # ── WHO IT'S FOR ────────────────────────────────────────────────
    hline(c, ML, WY, W - MR, C_BORDER, 0.5)
    WY += 14

    txt(c, ML, WY, 'DESIGNED FOR', 'Courier-Bold', 6.5, C_MIST)
    WY += 14

    audience = [
        'Long-only fund managers & analysts',
        'Hedge funds & alternative investment firms',
        'Private equity & venture capital teams',
        'Corporate strategy & M&A teams',
        'Sell-side research desks',
        'Sovereign wealth & family offices',
    ]

    item_col_w = CW / 3
    for i, item in enumerate(audience):
        row = i // 3
        col = i % 3
        ax = ML + col * item_col_w
        ay = WY + row * 16 + 4
        dot(c, ax + 4, ay - 2, r=1.8, color=C_ACCENT)
        txt(c, ax + 12, ay, item, 'Helvetica', 8.5, C_INK2)

    WY += 2 * 16 + 26

    # ── CONTACT / CTA BLOCK ─────────────────────────────────────────
    BOX_H = 96
    # Full-width deep emerald block
    frect(c, ML - 6, WY, CW + 8, BOX_H, C_ACCENT_DEEP, r=7)

    # Subtle accent: right-side decorative large "IQ" watermark
    c.setFont('Helvetica-Bold', 72)
    c.setFillColor(HexColor('#065F46'))
    wm_text = 'IQ'
    wm_w = c.stringWidth(wm_text, 'Helvetica-Bold', 72)
    c.drawString(W - MR - wm_w + 4, top(WY + BOX_H - 8), wm_text)

    bx = ML + 6
    by = WY + 18

    txt(c, bx, by,
        'Ready to explore Transcript IQ?',
        'Helvetica-Bold', 14, C_WHITE)

    by += 20

    txt(c, bx, by,
        'Speak to your Customer Success Manager for a personalised walkthrough',
        'Helvetica', 8.5, C_ACCENT_LIGHT)

    by += 12

    txt(c, bx, by,
        'and access to our full catalogue of transcripts and analysis.',
        'Helvetica', 8.5, C_ACCENT_LIGHT)

    by += 18

    # Three contact chips
    contacts = [
        ('VISIT',  'transcript-iq.com'),
        ('EMAIL',  'info@nextyn.com'),
        ('DIRECT', 'Contact your dedicated CSM'),
    ]
    cx2 = bx
    for label, value in contacts:
        # Small pill background
        lw = c.stringWidth(label, 'Courier-Bold', 6)
        vw = c.stringWidth(value, 'Helvetica', 8)
        pill_w = lw + vw + 16
        pill_h = 13
        c.setFillColor(HexColor('#065F46'))
        c.roundRect(cx2 - 2, top(by + 2), pill_w, pill_h, 3, fill=1, stroke=0)
        c.setFont('Courier-Bold', 6)
        c.setFillColor(C_ACCENT_LIGHT)
        c.drawString(cx2 + 2, top(by), label)
        c.setFont('Helvetica', 8)
        c.setFillColor(C_WHITE)
        c.drawString(cx2 + lw + 7, top(by), value)
        cx2 += (CW - 12) / 3

    # ── FOOTER ──────────────────────────────────────────────────────
    hline(c, ML, H - MB - 14, W - MR, C_BORDER, 0.5)
    txt(c, ML, H - MB, 'transcript-iq.com', 'Courier', 6.5, C_MIST)
    txt(c, W - MR, H - MB,
        '© 2026 Transcript IQ — A Nextyn Initiative',
        'Courier', 6.5, C_MIST, align='right')


# ─── Main ─────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    logo_buf = load_logo_mark_png()

    out = '_docs/Transcript-IQ-Platform-Overview.pdf'
    c = pdfcanvas.Canvas(out, pagesize=A4)

    page1(c, logo_buf)
    c.showPage()
    page2(c, logo_buf)
    c.save()

    print('PDF generated: ' + out)
