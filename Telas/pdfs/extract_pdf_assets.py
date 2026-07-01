import json
import math
from pathlib import Path

from PIL import Image, ImageDraw

base = Path(__file__).resolve().parent
data = json.loads((base / "extract.json").read_text(encoding="utf-8"))

text_parts = []
for page in data:
    text_parts.append(f"## PAGE {page['page']}\n")
    body = page.get("text", "").strip() or "[sem texto extraido]"
    text_parts.append(body)
    text_parts.append("")
(base / "page_text.md").write_text("\n".join(text_parts), encoding="utf-8")

pngs = sorted(base.glob("tela-*.png"))
thumb_w = 260
gap = 18
label_h = 28
cols = 4
thumbs = []
for png in pngs:
    img = Image.open(png).convert("RGB")
    scale = thumb_w / img.width
    thumb_h = int(img.height * scale)
    img = img.resize((thumb_w, thumb_h), Image.LANCZOS)
    thumbs.append((png, img))

if thumbs:
    rows = math.ceil(len(thumbs) / cols)
    cell_h = max(img.height for _, img in thumbs) + label_h
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * gap, rows * cell_h + (rows + 1) * gap), "white")
    draw = ImageDraw.Draw(sheet)
    for idx, (png, img) in enumerate(thumbs):
        row, col = divmod(idx, cols)
        x = gap + col * (thumb_w + gap)
        y = gap + row * (cell_h + gap)
        draw.text((x, y), png.stem.replace("tela-", "Pagina "), fill=(20, 20, 20))
        sheet.paste(img, (x, y + label_h))
    sheet.save(base / "contact_sheet.jpg", quality=92)

print(f"Wrote {base / 'page_text.md'}")
print(f"Wrote {base / 'contact_sheet.jpg'}")
