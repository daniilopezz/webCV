from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
PUBLIC_DIR = ROOT / "public"
TMP_DIR = Path("/private/tmp/webcv-cv-builder")
PROFILE_IMAGE = TMP_DIR / "profile.png"

LINKEDIN_URL = "https://www.linkedin.com/in/dani-lopez-46677a382/"
PORTFOLIO_URL = "https://web-cv-blush.vercel.app/"
VERIFY_BASE_URL = "https://academy.claude.com/verify/"

WIDTH, HEIGHT = A4

BLUE = colors.HexColor("#0f4fa8")
ACCENT = colors.HexColor("#139cff")
TEAL = colors.HexColor("#007f78")
TEXT = colors.HexColor("#20242a")
MUTED = colors.HexColor("#5f6873")
LIGHT_TEXT = colors.HexColor("#7c8792")
PAGE_BG = colors.HexColor("#ffffff")
HEADER_BG = colors.HexColor("#f7f7f8")
LINE = colors.HexColor("#dce3e8")
CARD = colors.HexColor("#f8f9fb")
CARD_BORDER = colors.HexColor("#e3e9ee")
EDU_CARD = colors.HexColor("#eeece2")
PILL = colors.HexColor("#e7f3ff")
PILL_GREEN = colors.HexColor("#e4f7f2")


@dataclass(frozen=True)
class LocaleCopy:
    filename: str
    role: str
    location: str
    page_tag: str
    issuer_label: str
    issued_label: str
    credential_label: str
    action_label: str
    issued: dict[str, str]


CERTIFICATES = [
    {
        "title": "Claude Academy: Deploying Claude Enterprise with Confidence: The five decisions that shape your rollout",
        "track": "Enterprise",
        "id": "60d848cfe6a94e36ac15c8706e5177b6",
        "month": "sep",
    },
    {
        "title": "Claude Academy: Building with the Claude API",
        "track": "API",
        "id": "33cc0d96bfd73cdab652dc90f05040be",
        "month": "aug",
    },
    {
        "title": "Claude Academy: AI Fluency for Builders",
        "track": "AI Fluency",
        "id": "1831cc631436d3a30fb3bcc183ddb595",
        "month": "sep",
    },
    {
        "title": "Claude Academy: Teaching AI Fluency",
        "track": "AI Fluency",
        "id": "0abcc6dabc474c3b4fed7ae42e9d604e",
        "month": "sep",
    },
    {
        "title": "Claude Academy: AI Capabilities and Limitations",
        "track": "AI Fluency",
        "id": "2c3b1979844800fde77f07bbb51d8814",
        "month": "sep",
    },
    {
        "title": "Claude Academy: AI Fluency: Framework & Foundations",
        "track": "AI Fluency",
        "id": "52335e2e8db090c78faed0e55580961b",
        "month": "sep",
    },
    {
        "title": "Claude Academy: Claude Code in Action",
        "track": "Claude Code",
        "id": "05d01534026201c38130e0878365f19b",
        "month": "sep",
    },
    {
        "title": "Claude Academy: Claude Code 101",
        "track": "Claude Code",
        "id": "1d8e84f39adfb232b024386fe421c731",
        "month": "sep",
    },
]


COPIES = [
    LocaleCopy(
        filename="daniel_lopez_aguirre_curriculum.pdf",
        role="Desarrollador web · Científico de datos",
        location="Almería, España",
        page_tag="Certificados",
        issuer_label="Entidad",
        issued_label="Expedición",
        credential_label="ID de credencial",
        action_label="Ver diploma",
        issued={"aug": "ago. 2026", "sep": "sept. 2026"},
    ),
    LocaleCopy(
        filename="daniel_lopez_aguirre_cv_english.pdf",
        role="Web Developer · Data Scientist",
        location="Almería, Spain",
        page_tag="Certificates",
        issuer_label="Issuer",
        issued_label="Issued",
        credential_label="Credential ID",
        action_label="View diploma",
        issued={"aug": "Aug. 2026", "sep": "Sep. 2026"},
    ),
    LocaleCopy(
        filename="daniel_lopez_aguirre_cv_italiano.pdf",
        role="Sviluppatore web · Data Scientist",
        location="Almería, Spagna",
        page_tag="Certificati",
        issuer_label="Ente",
        issued_label="Rilascio",
        credential_label="ID credenziale",
        action_label="Vedi diploma",
        issued={"aug": "ago. 2026", "sep": "set. 2026"},
    ),
]


def verify_url(credential_id: str) -> str:
    return f"{VERIFY_BASE_URL}{credential_id}"


def text_width(text: str, font: str, size: float) -> float:
    return pdfmetrics.stringWidth(text, font, size)


def wrap_text(text: str, font: str, size: float, max_width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""

    for word in words:
        candidate = word if not current else f"{current} {word}"
        if text_width(candidate, font, size) <= max_width:
            current = candidate
            continue

        if current:
            lines.append(current)
        current = word

    if current:
        lines.append(current)
    return lines


def draw_wrapped(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    *,
    font: str = "Helvetica",
    size: float = 9,
    leading: float = 11,
    color=TEXT,
    max_lines: int | None = None,
) -> float:
    lines = wrap_text(text, font, size, width)
    if max_lines is not None and len(lines) > max_lines:
        lines = lines[:max_lines]
        while lines and text_width(f"{lines[-1]}...", font, size) > width:
            lines[-1] = lines[-1][:-1]
        lines[-1] = f"{lines[-1]}..."

    c.setFont(font, size)
    c.setFillColor(color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def rounded(c: canvas.Canvas, x: float, y: float, w: float, h: float, fill, stroke=None, radius=6):
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(0.8)
        c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    else:
        c.roundRect(x, y, w, h, radius, fill=1, stroke=0)


def draw_button(
    c: canvas.Canvas,
    label: str,
    x: float,
    y: float,
    w: float,
    h: float,
    *,
    fill,
    stroke,
    text_color,
    url: str,
):
    rounded(c, x, y, w, h, fill, stroke, radius=10)
    c.setFillColor(text_color)
    c.setFont("Helvetica-Bold", 7.3)
    c.drawCentredString(x + w / 2, y + h / 2 - 2.5, label)
    c.linkURL(url, (x, y, x + w, y + h), relative=0, thickness=0)


def extract_profile_image(source_pdf: Path) -> Path:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    if PROFILE_IMAGE.exists():
        return PROFILE_IMAGE

    reader = PdfReader(source_pdf)
    for page in reader.pages:
        for image in page.images:
            PROFILE_IMAGE.write_bytes(image.data)
            return PROFILE_IMAGE

    return PUBLIC_DIR / "favicon.png"


def draw_header(c: canvas.Canvas, copy: LocaleCopy, profile_image: Path):
    c.setFillColor(HEADER_BG)
    c.rect(0, HEIGHT - 148, WIDTH, 148, fill=1, stroke=0)

    c.saveState()
    path = c.beginPath()
    path.circle(86, HEIGHT - 86, 39)
    c.clipPath(path, stroke=0)
    c.drawImage(ImageReader(str(profile_image)), 47, HEIGHT - 125, 78, 78, mask="auto")
    c.restoreState()

    c.setStrokeColor(LINE)
    c.setLineWidth(1.1)
    c.circle(86, HEIGHT - 86, 41, fill=0, stroke=1)
    c.line(44, HEIGHT - 148, WIDTH - 44, HEIGHT - 148)

    c.setFillColor(TEXT)
    c.setFont("Helvetica", 27)
    c.drawString(156, HEIGHT - 67, "Daniel")
    c.setFont("Helvetica-Bold", 27)
    c.drawString(250, HEIGHT - 67, "Lopez Aguirre")

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 11.5)
    c.drawString(156, HEIGHT - 94, copy.role)
    c.setFont("Helvetica", 8.3)
    c.drawString(156, HEIGHT - 112, f"lopezaguirrecoc@gmail.com | (+34) 611 44 57 59 | {copy.location}")

    draw_button(
        c,
        "LinkedIn",
        156,
        HEIGHT - 140,
        104,
        22,
        fill=colors.HexColor("#e9f2ff"),
        stroke=colors.HexColor("#006fde"),
        text_color=colors.HexColor("#0058b7"),
        url=LINKEDIN_URL,
    )
    draw_button(
        c,
        "Portfolio web",
        270,
        HEIGHT - 140,
        120,
        22,
        fill=colors.HexColor("#e6f4f1"),
        stroke=TEAL,
        text_color=TEAL,
        url=PORTFOLIO_URL,
    )


def section_header(c: canvas.Canvas, title: str, x: float, y: float, w: float) -> float:
    label = title.upper()
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(BLUE)
    c.drawString(x, y, label)
    line_x = x + text_width(label, "Helvetica-Bold", 10) + 9
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.line(line_x, y + 3, x + w, y + 3)
    return y - 18


def draw_cert_card(c: canvas.Canvas, cert: dict[str, str], copy: LocaleCopy, x: float, y: float, w: float, h: float):
    rounded(c, x, y - h, w, h, CARD, CARD_BORDER, radius=6)
    c.setFillColor(ACCENT)
    c.roundRect(x, y - 4, w, 4, 2, fill=1, stroke=0)

    track_w = text_width(cert["track"], "Helvetica-Bold", 6.6) + 20
    rounded(c, x + 13, y - 24, track_w, 14, PILL, None, radius=7)
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 6.6)
    c.drawCentredString(x + 13 + track_w / 2, y - 20, cert["track"])

    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica", 6.7)
    c.drawRightString(x + w - 13, y - 18, f"Anthropic · {copy.issued[cert['month']]}")

    draw_wrapped(
        c,
        cert["title"],
        x + 13,
        y - 41,
        w - 26,
        font="Helvetica-Bold",
        size=8.6,
        leading=10.1,
        color=TEXT,
        max_lines=4,
    )

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.3)
    c.drawString(x + 13, y - h + 39, copy.credential_label)
    c.setFillColor(colors.HexColor("#4f5b66"))
    c.setFont("Courier", 5.6)
    c.drawString(x + 13, y - h + 27, f"{cert['id'][:16]} {cert['id'][16:]}")

    button_w = 66
    button_h = 16
    bx = x + w - button_w - 13
    by = y - h + 18
    draw_button(
        c,
        copy.action_label,
        bx,
        by,
        button_w,
        button_h,
        fill=colors.HexColor("#f2f8ff"),
        stroke=colors.HexColor("#006fde"),
        text_color=colors.HexColor("#0058b7"),
        url=verify_url(cert["id"]),
    )


def build_certificates_page(copy: LocaleCopy, profile_image: Path) -> Path:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    out = TMP_DIR / f"certificates-{copy.filename}"
    c = canvas.Canvas(str(out), pagesize=A4)
    c.setTitle("Daniel Lopez Aguirre - CV")
    c.setAuthor("Daniel Lopez Aguirre")
    c.setSubject("Curriculum vitae")
    c.setCreator("build_cv_pdfs.py")

    c.setFillColor(PAGE_BG)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    draw_header(c, copy, profile_image)

    x = 44
    y = HEIGHT - 178
    content_w = WIDTH - 88
    section_header(c, copy.page_tag, x, y, content_w)

    card_w = 245
    card_h = 108
    gap_x = 17
    gap_y = 11
    start_y = HEIGHT - 220
    for index, cert in enumerate(CERTIFICATES):
        col = index % 2
        row = index // 2
        cx = x + col * (card_w + gap_x)
        cy = start_y - row * (card_h + gap_y)
        draw_cert_card(c, cert, copy, cx, cy, card_w, card_h)

    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica", 6)
    c.drawRightString(WIDTH - 44, 27, "Daniel Lopez Aguirre · CV")
    c.save()
    return out


def write_pdf_with_certificates(copy: LocaleCopy):
    source = PUBLIC_DIR / copy.filename
    profile_image = extract_profile_image(source)
    cert_pdf = build_certificates_page(copy, profile_image)

    source_reader = PdfReader(source)
    cert_reader = PdfReader(cert_pdf)
    writer = PdfWriter()
    writer.add_page(source_reader.pages[0])
    writer.add_page(cert_reader.pages[0])

    tmp_output = TMP_DIR / copy.filename
    with tmp_output.open("wb") as file:
        writer.write(file)
    tmp_output.replace(source)
    print(f"Wrote {source}")


def main():
    for copy in COPIES:
        write_pdf_with_certificates(copy)


if __name__ == "__main__":
    main()
