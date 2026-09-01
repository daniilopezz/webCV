from __future__ import annotations

import shutil
from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
PUBLIC_DIR = ROOT / "public"
TMP_DIR = Path("/private/tmp/webcv-generated-pdfs")
PROFILE_IMAGE = TMP_DIR / "cv-profile.png"

LINKEDIN_URL = "https://www.linkedin.com/in/dani-lopez-46677a382/"
PORTFOLIO_URL = "https://web-cv-blush.vercel.app/"

WIDTH, HEIGHT = A4
HEADER_H = 148
BODY_TOP = HEIGHT - HEADER_H

BLACK = colors.HexColor("#030507")
PANEL = colors.HexColor("#0d1217")
PANEL_2 = colors.HexColor("#111923")
WHITE = colors.HexColor("#f7fbff")
OFF_WHITE = colors.HexColor("#f3f6f9")
TEXT = colors.HexColor("#eaf3fb")
MUTED = colors.HexColor("#aab8c5")
SOFT = colors.HexColor("#dce7ee")
BLUE = colors.HexColor("#15a7ff")
CYAN = colors.HexColor("#74e4dd")
LINE = colors.HexColor("#d5dde3")
INK = colors.HexColor("#20242a")
GRAY = colors.HexColor("#5d6875")
CARD_LIGHT = colors.HexColor("#f7f8f5")
CARD_BLUE = colors.HexColor("#e8f3ff")
CARD_MINT = colors.HexColor("#e8fbf7")


@dataclass(frozen=True)
class CvData:
    output: str
    role: str
    location: str
    labels: dict[str, str]
    skills: list[tuple[str, str]]
    education: list[tuple[str, str, str]]
    languages: list[str]
    profile: str
    experience: list[dict[str, object]]
    projects: list[dict[str, str]]
    certificates_intro: str
    certificates_stat: str
    cert_action: str
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


def verify_url(credential_id: str) -> str:
    return f"https://academy.claude.com/verify/{credential_id}"


def ensure_profile_image() -> Path:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    if PROFILE_IMAGE.exists():
        return PROFILE_IMAGE

    source_pdf = PUBLIC_DIR / "daniel_lopez_aguirre_curriculum.pdf"
    if source_pdf.exists():
        reader = PdfReader(source_pdf)
        for page in reader.pages:
            for image in page.images:
                PROFILE_IMAGE.write_bytes(image.data)
                return PROFILE_IMAGE

    return PUBLIC_DIR / "favicon.png"


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
            current = ""

        if text_width(word, font, size) <= max_width:
            current = word
        else:
            part = ""
            for char in word:
                candidate_part = part + char
                if text_width(candidate_part, font, size) <= max_width:
                    part = candidate_part
                else:
                    if part:
                        lines.append(part)
                    part = char
            current = part

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
    size: float = 8,
    leading: float = 10,
    color=TEXT,
    max_lines: int | None = None,
) -> float:
    lines = wrap_text(text, font, size, width)
    if max_lines is not None and len(lines) > max_lines:
        lines = lines[:max_lines]
        while lines and text_width(lines[-1] + "...", font, size) > width:
            lines[-1] = lines[-1][:-1]
        if lines:
            lines[-1] += "..."

    c.setFillColor(color)
    c.setFont(font, size)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_section_header(c: canvas.Canvas, title: str, x: float, y: float, width: float) -> float:
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(BLUE)
    title_up = title.upper()
    c.drawString(x, y, title_up)
    line_x = x + text_width(title_up, "Helvetica-Bold", 8) + 7
    c.setStrokeColor(LINE)
    c.setLineWidth(1.4)
    c.line(line_x, y + 2.5, x + width, y + 2.5)
    return y - 12


def draw_round_rect(c: canvas.Canvas, x: float, y: float, w: float, h: float, fill, stroke=None, radius=5):
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(0.75)
        c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    else:
        c.roundRect(x, y, w, h, radius, fill=1, stroke=0)


def draw_button(c: canvas.Canvas, label: str, x: float, y: float, w: float, h: float, fill, stroke, url: str):
    draw_round_rect(c, x, y, w, h, fill, stroke, radius=9)
    c.setFont("Helvetica-Bold", 7)
    c.setFillColor(INK)
    c.drawCentredString(x + w / 2, y + h / 2 - 2.4, label)
    c.linkURL(url, (x, y, x + w, y + h), relative=0, thickness=0)


def draw_header(c: canvas.Canvas, data: CvData, profile_image: Path, page_title: str | None = None):
    c.setFillColor(OFF_WHITE)
    c.rect(0, BODY_TOP, WIDTH, HEADER_H, fill=1, stroke=0)
    c.setStrokeColor(colors.HexColor("#e1e6eb"))
    c.setLineWidth(1)
    c.line(0, BODY_TOP, WIDTH, BODY_TOP)

    c.saveState()
    path = c.beginPath()
    path.circle(86, HEIGHT - 87, 38)
    c.clipPath(path, stroke=0)
    c.drawImage(ImageReader(str(profile_image)), 48, HEIGHT - 125, 76, 76, mask="auto")
    c.restoreState()
    c.setStrokeColor(colors.HexColor("#d4dce2"))
    c.setLineWidth(2)
    c.circle(86, HEIGHT - 87, 39, fill=0, stroke=1)

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 27)
    c.drawString(156, HEIGHT - 70, "Daniel Lopez Aguirre")
    c.setFont("Helvetica", 11)
    c.setFillColor(GRAY)
    c.drawString(156, HEIGHT - 94, data.role)
    c.setFont("Helvetica", 7.5)
    c.setFillColor(colors.HexColor("#4f5c69"))
    c.drawString(156, HEIGHT - 116, f"lopezaguirrecoc@gmail.com | (+34) 611 44 57 59 | {data.location}")

    draw_button(c, "LinkedIn", 156, HEIGHT - 139, 104, 21, CARD_BLUE, BLUE, LINKEDIN_URL)
    draw_button(c, data.labels["portfolio"], 269, HEIGHT - 139, 120, 21, CARD_MINT, colors.HexColor("#2b9b91"), PORTFOLIO_URL)

    if page_title:
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(BLUE)
        c.drawRightString(WIDTH - 44, HEIGHT - 68, page_title.upper())


def draw_body_background(c: canvas.Canvas, *, divider: bool = True):
    c.setFillColor(BLACK)
    c.rect(0, 0, WIDTH, BODY_TOP, fill=1, stroke=0)
    if divider:
        c.setStrokeColor(SOFT)
        c.setLineWidth(1.4)
        c.line(234, 46, 234, BODY_TOP - 18)


def draw_skill_card(c: canvas.Canvas, title: str, detail: str, x: float, y: float, w: float) -> float:
    detail_lines = wrap_text(detail, "Helvetica", 6.4, w - 14)
    h = 23 + max(1, len(detail_lines)) * 8.3
    draw_round_rect(c, x, y - h, w, h, CARD_LIGHT, None, radius=5)
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 6.8)
    c.drawString(x + 8, y - 10, title)
    draw_wrapped(c, detail, x + 8, y - 20, w - 14, font="Helvetica", size=6.4, leading=8.2, color=INK)
    return y - h - 4


def draw_education_item(c: canvas.Canvas, item: tuple[str, str, str], x: float, y: float, w: float) -> float:
    title, years, school = item
    title_lines = wrap_text(title, "Helvetica-Bold", 6.9, w - 14)
    h = 21 + len(title_lines) * 8.5 + 18
    draw_round_rect(c, x, y - h, w, h, colors.HexColor("#faf8ee"), None, radius=5)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 6.9)
    line_y = y - 10
    for line in title_lines:
        c.drawString(x + 8, line_y, line)
        line_y -= 8.5
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 6.4)
    c.drawString(x + 8, line_y - 1, years)
    c.setFillColor(colors.HexColor("#3f4750"))
    c.setFont("Helvetica-Oblique", 6)
    c.drawString(x + 8, line_y - 10, school)
    return y - h - 5


def draw_language_pills(c: canvas.Canvas, languages: list[str], x: float, y: float, w: float):
    cursor_x = x
    cursor_y = y
    for language in languages:
        pill_w = text_width(language, "Helvetica", 7, ) + 18
        if cursor_x + pill_w > x + w:
            cursor_x = x
            cursor_y -= 17
        draw_round_rect(c, cursor_x, cursor_y - 13, pill_w, 13, colors.HexColor("#ecfbff"), BLUE, radius=6)
        c.setFillColor(INK)
        c.setFont("Helvetica", 7)
        c.drawString(cursor_x + 8, cursor_y - 9.5, language)
        cursor_x += pill_w + 6


def draw_sidebar(c: canvas.Canvas, data: CvData):
    x, w = 44, 176
    y = BODY_TOP - 24
    y = draw_section_header(c, data.labels["skills"], x, y, w)
    for skill in data.skills:
        y = draw_skill_card(c, skill[0], skill[1], x, y, w)

    y -= 5
    y = draw_section_header(c, data.labels["education"], x, y, w)
    for item in data.education:
        y = draw_education_item(c, item, x, y, w)

    y -= 6
    y = draw_section_header(c, data.labels["languages"], x, y, w)
    draw_language_pills(c, data.languages, x, y, w)


def draw_experience(c: canvas.Canvas, data: CvData, x: float, y: float, w: float) -> float:
    y = draw_section_header(c, data.labels["experience"], x, y, w)
    for entry in data.experience:
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 8.5)
        c.drawString(x, y, str(entry["company"]))
        c.setFont("Helvetica", 6.8)
        c.setFillColor(MUTED)
        c.drawRightString(x + w, y, str(entry["date"]))
        y -= 12
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Oblique", 7.2)
        c.drawString(x, y, str(entry["role"]))
        y -= 12
        for bullet in entry["bullets"]:
            c.setFillColor(BLUE)
            c.setFont("Helvetica-Bold", 7)
            c.drawString(x, y, "-")
            y = draw_wrapped(c, str(bullet), x + 10, y, w - 10, font="Helvetica", size=7, leading=9, color=MUTED, max_lines=2)
        y -= 7
    return y


def draw_project(c: canvas.Canvas, project: dict[str, str], x: float, y: float, w: float) -> float:
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 8.3)
    c.drawString(x, y, project["title"])

    button_w = 39
    button_h = 13
    bx = x + w - button_w
    by = y - 3
    draw_round_rect(c, bx, by, button_w, button_h, colors.HexColor("#e8f3ff"), BLUE, radius=6)
    c.setFillColor(colors.HexColor("#004c7d"))
    c.setFont("Helvetica-Bold", 5.8)
    c.drawCentredString(bx + button_w / 2, by + 4.2, "GitHub")
    c.linkURL(project["url"], (bx, by, bx + button_w, by + button_h), relative=0, thickness=0)

    y -= 12
    y = draw_wrapped(c, project["description"], x, y, w, font="Helvetica", size=7, leading=9.2, color=MUTED, max_lines=4)
    return y - 6


def draw_main_page(c: canvas.Canvas, data: CvData, profile_image: Path):
    draw_header(c, data, profile_image)
    draw_body_background(c)
    draw_sidebar(c, data)

    x, w = 250, 302
    y = BODY_TOP - 24
    y = draw_section_header(c, data.labels["profile"], x, y, w)
    y = draw_wrapped(c, data.profile, x, y, w, font="Helvetica", size=7.3, leading=9.5, color=MUTED)
    y -= 8

    y = draw_experience(c, data, x, y, w)
    y -= 2
    y = draw_section_header(c, data.labels["projects"], x, y, w)
    for project in data.projects:
        y = draw_project(c, project, x, y, w)

    c.setFillColor(SOFT)
    c.setFont("Helvetica", 5.8)
    c.drawRightString(WIDTH - 44, 28, "Daniel Lopez Aguirre - CV")


def draw_certificate_card(
    c: canvas.Canvas,
    cert: dict[str, str],
    data: CvData,
    x: float,
    y: float,
    w: float,
    h: float,
):
    draw_round_rect(c, x, y - h, w, h, PANEL_2, colors.HexColor("#273848"), radius=8)
    c.setFillColor(BLUE)
    c.roundRect(x, y - 4, w, 4, 2, fill=1, stroke=0)

    pill_w = text_width(cert["track"], "Helvetica-Bold", 6.4) + 18
    draw_round_rect(c, x + 14, y - 23, pill_w, 13, colors.HexColor("#e7f5ff"), None, radius=6)
    c.setFillColor(colors.HexColor("#004f7f"))
    c.setFont("Helvetica-Bold", 6.4)
    c.drawCentredString(x + 14 + pill_w / 2, y - 19, cert["track"])

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.5)
    c.drawRightString(x + w - 14, y - 18, f"Anthropic - {data.issued[cert['month']]}")

    title_y = y - 39
    title_y = draw_wrapped(
        c,
        cert["title"],
        x + 14,
        title_y,
        w - 28,
        font="Helvetica-Bold",
        size=8.2,
        leading=9.7,
        color=TEXT,
        max_lines=4,
    )

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 5.8)
    c.drawString(x + 14, y - h + 38, data.labels["credential_id"])
    c.setFillColor(colors.HexColor("#d4e5f3"))
    c.setFont("Courier", 5.5)
    c.drawString(x + 14, y - h + 27, cert["id"][:16] + " " + cert["id"][16:])

    url = verify_url(cert["id"])
    button_w = 64
    button_h = 16
    bx = x + w - button_w - 14
    by = y - h + 17
    draw_round_rect(c, bx, by, button_w, button_h, colors.HexColor("#e7f5ff"), BLUE, radius=7)
    c.setFillColor(colors.HexColor("#004f7f"))
    c.setFont("Helvetica-Bold", 6.2)
    c.drawCentredString(bx + button_w / 2, by + 5.1, data.cert_action)
    c.linkURL(url, (bx, by, bx + button_w, by + button_h), relative=0, thickness=0)


def draw_certificates_page(c: canvas.Canvas, data: CvData, profile_image: Path):
    draw_header(c, data, profile_image, data.labels["certificates"])
    draw_body_background(c, divider=False)

    x = 44
    y = BODY_TOP - 28
    w = WIDTH - 88
    y = draw_section_header(c, data.labels["certificates"], x, y, w)

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(x, y - 6, data.labels["courses_title"])
    y -= 33
    draw_wrapped(c, data.certificates_intro, x, y, 340, font="Helvetica", size=8.2, leading=10.5, color=MUTED, max_lines=2)

    stat_x, stat_y = WIDTH - 198, y + 6
    draw_round_rect(c, stat_x, stat_y - 42, 154, 42, PANEL, colors.HexColor("#26323d"), radius=8)
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(stat_x + 12, stat_y - 28, "8")
    c.setFillColor(SOFT)
    c.setFont("Helvetica-Bold", 7.2)
    draw_wrapped(c, data.certificates_stat, stat_x + 42, stat_y - 17, 96, font="Helvetica-Bold", size=7.2, leading=8.2, color=SOFT, max_lines=2)

    card_w = 245
    card_h = 122
    gap_x = 17
    gap_y = 12
    start_y = BODY_TOP - 118
    for index, cert in enumerate(CERTIFICATES):
        col = index % 2
        row = index // 2
        cx = x + col * (card_w + gap_x)
        cy = start_y - row * (card_h + gap_y)
        draw_certificate_card(c, cert, data, cx, cy, card_w, card_h)

    c.setFillColor(SOFT)
    c.setFont("Helvetica", 5.8)
    c.drawRightString(WIDTH - 44, 28, "Daniel Lopez Aguirre - CV")


def build_pdf(data: CvData, profile_image: Path):
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    tmp_pdf = TMP_DIR / data.output
    final_pdf = PUBLIC_DIR / data.output

    c = canvas.Canvas(str(tmp_pdf), pagesize=A4)
    c.setTitle("Daniel Lopez Aguirre - CV")
    c.setAuthor("Daniel Lopez Aguirre")
    c.setSubject("Curriculum vitae")
    c.setCreator("build_cv_pdfs.py")

    draw_main_page(c, data, profile_image)
    c.showPage()
    draw_certificates_page(c, data, profile_image)
    c.save()

    shutil.move(str(tmp_pdf), final_pdf)


SPANISH = CvData(
    output="daniel_lopez_aguirre_curriculum.pdf",
    role="Desarrollador web - Científico de datos",
    location="Almería, España",
    labels={
        "portfolio": "Portfolio web",
        "skills": "Competencias",
        "education": "Formación",
        "languages": "Idiomas",
        "profile": "Perfil",
        "experience": "Experiencia",
        "projects": "Proyectos",
        "certificates": "Certificados",
        "courses_title": "Cursos y certificados",
        "credential_id": "ID de credencial",
    },
    skills=[
        ("Lenguajes", "Python, Java, HTML, PHP, JavaScript"),
        ("Frameworks", "Laravel, Django, React, FastAPI"),
        ("Bases de datos", "MySQL, PostgreSQL, SQLite"),
        ("Herramientas", "Docker, Git, Linux, Pandas, NumPy"),
        ("Prácticas", "Código limpio, trabajo en equipo, resolución de problemas"),
    ],
    education=[
        ("Técnico Superior en Desarrollo de Aplicaciones Web", "2023 - 2025", "IES La Puebla de Vícar (Almería)"),
        ("Máster FP en Desarrollo de Aplicaciones con Python", "2025 - 2026", "IES Al-Ándalus (Almería)"),
        ("Máster FP en Inteligencia Artificial y Big Data", "2026 - Actualidad", "IES La Puebla de Vícar (Almería)"),
    ],
    languages=["Español: nativo", "Inglés: B1", "Italiano: C1"],
    profile=(
        "Desarrollador web y científico de datos en formación, con experiencia en prácticas, "
        "proyectos full-stack y manejo de Python, bases de datos, APIs y despliegues con Docker."
    ),
    experience=[
        {
            "company": "MLSoftware",
            "date": "mar. 2025 - jun. 2025",
            "role": "Prácticas de desarrollo web - Catania, Italia",
            "bullets": [
                "Desarrollo y mantenimiento de páginas web adaptables con HTML, CSS y JavaScript.",
                "Implementación de interfaces de usuario y componentes frontend.",
                "Mejora de maquetaciones web y experiencia visual.",
            ],
        },
        {
            "company": "KeyOver",
            "date": "mar. 2026 - jun. 2026",
            "role": "Prácticas en ciencia de datos - Catania, Italia",
            "bullets": [
                "Recopilación, limpieza y preparación de datos para experimentos de aprendizaje automático.",
                "Trabajo con Pandas, NumPy, Scikit-learn y Matplotlib.",
                "Uso de PostgreSQL para extraer, almacenar y analizar datos.",
            ],
        },
    ],
    projects=[
        {
            "title": "Cammay Class",
            "url": "https://github.com/daniilopezz/proyecto",
            "description": (
                "Aplicación en Laravel para una academia privada: automatiza respuestas a correos y consultas, "
                "y ayuda a gestionar alumnos, clases y horarios académicos."
            ),
        },
        {
            "title": "Machine Learning - KeyOver",
            "url": "https://github.com/daniilopezz/DataScience",
            "description": (
                "Prueba de concepto de gestor de contraseñas con aprendizaje automático integrado. "
                "Analiza inicios de sesión y actividad para detectar comportamientos inusuales."
            ),
        },
        {
            "title": "Rastreador de precios de jugadores de Sorare",
            "url": "https://github.com/daniilopezz/proyecto_sorare",
            "description": (
                "Aplicación web para supervisar precios de futbolistas en Sorare, con notificaciones de Telegram. "
                "Creada con Python, HTML, CSS, JavaScript y Docker."
            ),
        },
    ],
    certificates_intro=(
        "Formación reciente en Claude Academy sobre API, Claude Code, fluidez con IA y despliegue empresarial. "
        "Cada credencial enlaza a su verificación pública."
    ),
    certificates_stat="certificados verificados de Anthropic",
    cert_action="Ver diploma",
    issued={"aug": "ago. 2026", "sep": "sept. 2026"},
)


ENGLISH = CvData(
    output="daniel_lopez_aguirre_cv_english.pdf",
    role="Web Developer - Data Scientist",
    location="Almería, Spain",
    labels={
        "portfolio": "Portfolio web",
        "skills": "Skills",
        "education": "Education",
        "languages": "Languages",
        "profile": "Profile",
        "experience": "Experience",
        "projects": "Projects",
        "certificates": "Certificates",
        "courses_title": "Courses and certificates",
        "credential_id": "Credential ID",
    },
    skills=[
        ("Languages", "Python, Java, HTML, PHP, JavaScript"),
        ("Frameworks", "Laravel, Django, React, FastAPI"),
        ("Databases", "MySQL, PostgreSQL, SQLite"),
        ("Tools", "Docker, Git, Linux, Pandas, NumPy"),
        ("Practices", "Clean code, teamwork, problem solving"),
    ],
    education=[
        ("Higher Technician in Web Application Development", "2023 - 2025", "IES La Puebla de Vícar (Almería)"),
        ("Vocational Master's Degree in Python Application Development", "2025 - 2026", "IES Al-Ándalus (Almería)"),
        ("Vocational Master's Degree in Artificial Intelligence and Big Data", "2026 - Present", "IES La Puebla de Vícar (Almería)"),
    ],
    languages=["Spanish: Native", "English: B1", "Italian: C1"],
    profile=(
        "Web developer and data scientist in training, with internship experience, full-stack projects, "
        "and hands-on work with Python, databases, APIs, and Docker deployments."
    ),
    experience=[
        {
            "company": "MLSoftware",
            "date": "Mar 2025 - Jun 2025",
            "role": "Web Development Internship - Catania, Italy",
            "bullets": [
                "Developed and maintained responsive web pages using HTML, CSS and JavaScript.",
                "Implemented user interfaces and frontend components.",
                "Improved website layouts and visual user experience.",
            ],
        },
        {
            "company": "KeyOver",
            "date": "Mar 2026 - Jun 2026",
            "role": "Data Science Internship - Catania, Italy",
            "bullets": [
                "Collected, cleaned and prepared data for machine learning experiments.",
                "Worked with Pandas, NumPy, Scikit-learn and Matplotlib.",
                "Used PostgreSQL to extract, store and analyze data.",
            ],
        },
    ],
    projects=[
        {
            "title": "Cammay Class",
            "url": "https://github.com/daniilopezz/proyecto",
            "description": (
                "Laravel application for a private tutoring academy: automates email and inquiry responses, "
                "and helps manage students, classes and academic schedules."
            ),
        },
        {
            "title": "Machine Learning - KeyOver",
            "url": "https://github.com/daniilopezz/DataScience",
            "description": (
                "Proof-of-concept password manager with integrated machine learning. "
                "It analyzes login and activity patterns to detect unusual behavior."
            ),
        },
        {
            "title": "Sorare Player Price Tracker",
            "url": "https://github.com/daniilopezz/proyecto_sorare",
            "description": (
                "Web application for monitoring Sorare football player prices, with Telegram notifications. "
                "Built with Python, HTML, CSS, JavaScript and Docker."
            ),
        },
    ],
    certificates_intro=(
        "Recent Claude Academy training covering the API, Claude Code, AI fluency and enterprise rollout. "
        "Each credential links to its public verification."
    ),
    certificates_stat="verified Anthropic certificates",
    cert_action="View diploma",
    issued={"aug": "Aug. 2026", "sep": "Sep. 2026"},
)


ITALIAN = CvData(
    output="daniel_lopez_aguirre_cv_italiano.pdf",
    role="Sviluppatore web - Data Scientist",
    location="Almería, Spagna",
    labels={
        "portfolio": "Portfolio web",
        "skills": "Competenze",
        "education": "Formazione",
        "languages": "Lingue",
        "profile": "Profilo",
        "experience": "Esperienza",
        "projects": "Progetti",
        "certificates": "Certificati",
        "courses_title": "Corsi e certificati",
        "credential_id": "ID credenziale",
    },
    skills=[
        ("Linguaggi", "Python, Java, HTML, PHP, JavaScript"),
        ("Framework", "Laravel, Django, React, FastAPI"),
        ("Database", "MySQL, PostgreSQL, SQLite"),
        ("Strumenti", "Docker, Git, Linux, Pandas, NumPy"),
        ("Pratiche", "Codice pulito, lavoro di squadra, problem solving"),
    ],
    education=[
        ("Tecnico Superiore in Sviluppo di Applicazioni Web", "2023 - 2025", "IES La Puebla de Vícar (Almería)"),
        ("Master di Formazione Professionale in Sviluppo di Applicazioni Python", "2025 - 2026", "IES Al-Ándalus (Almería)"),
        ("Master di Formazione Professionale in Intelligenza Artificiale e Big Data", "2026 - Presente", "IES La Puebla de Vícar (Almería)"),
    ],
    languages=["Spagnolo: madrelingua", "Inglese: B1", "Italiano: C1"],
    profile=(
        "Sviluppatore web e data scientist in formazione, con esperienza in stage, progetti full-stack "
        "e lavoro pratico con Python, database, API e deployment con Docker."
    ),
    experience=[
        {
            "company": "MLSoftware",
            "date": "mar. 2025 - giu. 2025",
            "role": "Stage in sviluppo web - Catania, Italia",
            "bullets": [
                "Sviluppo e manutenzione di pagine web responsive con HTML, CSS e JavaScript.",
                "Implementazione di interfacce utente e componenti frontend.",
                "Miglioramento dei layout web e dell'esperienza visiva dell'utente.",
            ],
        },
        {
            "company": "KeyOver",
            "date": "mar. 2026 - giu. 2026",
            "role": "Stage in data science - Catania, Italia",
            "bullets": [
                "Raccolta, pulizia e preparazione dei dati per esperimenti di machine learning.",
                "Utilizzo di Pandas, NumPy, Scikit-learn e Matplotlib.",
                "Uso di PostgreSQL per estrarre, archiviare e analizzare dati.",
            ],
        },
    ],
    projects=[
        {
            "title": "Cammay Class",
            "url": "https://github.com/daniilopezz/proyecto",
            "description": (
                "Applicazione Laravel per un'accademia privata: automatizza le risposte a email e richieste, "
                "e aiuta a gestire studenti, lezioni e orari accademici."
            ),
        },
        {
            "title": "Machine Learning - KeyOver",
            "url": "https://github.com/daniilopezz/DataScience",
            "description": (
                "Proof of concept di un gestore di password con machine learning integrato. "
                "Analizza login e attività per rilevare comportamenti anomali."
            ),
        },
        {
            "title": "Sorare Player Price Tracker",
            "url": "https://github.com/daniilopezz/proyecto_sorare",
            "description": (
                "Applicazione web per monitorare i prezzi dei calciatori su Sorare, con notifiche Telegram. "
                "Realizzata con Python, HTML, CSS, JavaScript e Docker."
            ),
        },
    ],
    certificates_intro=(
        "Formazione recente su Claude Academy dedicata ad API, Claude Code, AI fluency e deployment enterprise. "
        "Ogni credenziale rimanda alla verifica pubblica."
    ),
    certificates_stat="certificati Anthropic verificati",
    cert_action="Vedi diploma",
    issued={"aug": "ago. 2026", "sep": "set. 2026"},
)


def main():
    profile_image = ensure_profile_image()
    for data in (SPANISH, ENGLISH, ITALIAN):
        build_pdf(data, profile_image)
        print(f"Wrote {PUBLIC_DIR / data.output}")


if __name__ == "__main__":
    main()
