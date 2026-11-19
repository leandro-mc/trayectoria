#!/usr/bin/env python3
"""
WCAG contrast audit for the design tokens in src/styles/tokens.css.

Reads the palette and the semantic tokens of both themes straight from the CSS,
so the check can never drift from what ships. Exits 1 if any pair fails.

  python3 scripts/check-contrast.py
"""
import re, sys, pathlib

css = (pathlib.Path(__file__).parent.parent / "src/styles/tokens.css").read_text()

def block(selector):
    m = re.search(re.escape(selector) + r"\s*\{(.*?)\n\}", css, re.S)
    return dict(re.findall(r"--([\w-]+):\s*([^;]+);", m.group(1))) if m else {}

palette = {k: v.strip() for k, v in re.findall(r"--color-([\w-]+):\s*(#[0-9A-Fa-f]{6})", css)}
themes  = {"light": block(":root"), "dark": block(".dark")}

def hex_rgb(h): h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def resolve(theme, name, backdrop=None):
    """Token -> (r,g,b). color-mix(.. N%, transparent) is composited over `backdrop`."""
    raw = themes[theme][name].strip()
    m = re.match(r"color-mix\(in oklab, var\(--color-([\w-]+)\) (\d+)%, transparent\)", raw)
    if m:
        fg, a = hex_rgb(palette[m[1]]), int(m[2]) / 100
        return tuple(round(fg[i] * a + backdrop[i] * (1 - a)) for i in range(3))
    m = re.match(r"var\(--color-([\w-]+)\)", raw)
    if m: return hex_rgb(palette[m[1]])
    m = re.match(r"var\(--([\w-]+)\)", raw)
    if m: return resolve(theme, m[1], backdrop)
    return hex_rgb(raw)

def lum(c):
    f = lambda v: (v/255)/12.92 if v/255 <= .03928 else (((v/255)+.055)/1.055) ** 2.4
    r, g, b = map(f, c); return .2126*r + .7152*g + .0722*b

def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True); return (la + .05) / (lb + .05)

# (foreground token, background token, minimum ratio, what it is)
TEXT, UI = 4.5, 3.0
PAIRS = [
    ("foreground",         "background",  TEXT, "body text on page"),
    ("foreground",         "card",        TEXT, "body text on card"),
    ("body",               "card",        TEXT, "running text on card"),
    ("body",               "background",  TEXT, "running text on page"),
    ("muted-foreground",   "card",        TEXT, "secondary text on card"),
    ("muted-foreground",   "background",  TEXT, "secondary text on page"),
    ("muted-foreground",   "muted",       TEXT, "secondary text on muted surface"),
    ("subtle",             "card",        TEXT, "hint / placeholder on card"),
    ("subtle",             "raised",      TEXT, "placeholder inside inputs"),
    ("primary-foreground", "primary",     TEXT, "text on brand button"),
    ("brand-text",         "card",        TEXT, "brand text on card"),
    ("brand-text",         "background",  TEXT, "brand text on page"),
    ("brand-text",         "brand-tint",  TEXT, "brand text on brand tint"),
    ("accent-foreground",  "accent",      TEXT, "text on accent surface"),
    ("secondary-foreground","secondary",  TEXT, "text on secondary surface"),
    ("destructive-foreground","destructive",TEXT,"text on destructive button"),
    ("danger-text",        "card",        TEXT, "error text on card"),
    ("danger-text",        "danger-tint", TEXT, "error text on error banner"),
    ("success-text",       "card",        TEXT, "success text on card"),
    ("success-text",       "success-tint",TEXT, "success text on success tint"),
    ("warning-text",       "card",        TEXT, "warning text on card"),
    ("warning-text",       "warning-tint",TEXT, "warning text on warning tint"),
    ("ring",               "background",  UI,   "focus ring vs page"),
    ("ring",               "card",        UI,   "focus ring vs card"),
    ("input",              "raised",      UI,   "input border vs field"),
    ("input",              "card",        UI,   "input border vs card"),
]

fails = 0
for theme in themes:
    print(f"\n[{theme}]")
    bg = resolve(theme, "card")
    for fg, bgt, need, why in PAIRS:
        if fg not in themes[theme] or bgt not in themes[theme]:
            print(f"  ??    {fg} / {bgt}: token missing ({why})"); fails += 1; continue
        b = resolve(theme, bgt, backdrop=resolve(theme, "background"))
        f = resolve(theme, fg, backdrop=b)
        r = ratio(f, b); ok = r >= need; fails += not ok
        print(f"  {'ok  ' if ok else 'FAIL'}  {r:5.2f}:1 (min {need})  {fg} on {bgt}  - {why}")
print(f"\n{'All pairs pass WCAG AA.' if not fails else f'{fails} pair(s) fail.'}")
sys.exit(1 if fails else 0)
