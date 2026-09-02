from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from pypdf import PdfReader
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
GITHUB_URL = "https://github.com/daniilopezz"
EMAIL = "lopezaguirrecoc@gmail.com"
PHONE = "(+34) 611 44 57 59"
VERIFY_BASE_URL = "https://academy.claude.com/verify/"

WIDTH, HEIGHT = A4

BLUE = colors.HexColor("#0f4fa8")
ACCENT = colors.HexColor("#139cff")
ORANGE = colors.HexColor("#ff8400")
TEAL = colors.HexColor("#007f78")
TEXT = colors.HexColor("#20242a")
MUTED = colors.HexColor("#5f6873")
LIGHT_TEXT = colors.HexColor("#7c8792")
PAGE_BG = colors.HexColor("#ffffff")
HEADER_BG = colors.HexColor("#f7f7f8")
LINE = colors.HexColor("#dce3e8")
CARD = colors.HexColor("#f8f9fb")
CARD_BORDER = colors.HexColor("#e3e9ee")
PILL = colors.HexColor("#e7f3ff")
PILL_ORANGE = colors.HexColor("#fff0df")
PILL_GREEN = colors.HexColor("#e4f7f2")


@dataclass(frozen=True)
class Experience:
    title: str
    company: str
    date: str
    bullets: tuple[str, ...]


@dataclass(frozen=True)
class Education:
    title: str
    meta: str
    bullets: tuple[str, ...]


@dataclass(frozen=True)
class Project:
    title: str
    description: str
    tech: str


@dataclass(frozen=True)
class LocaleCopy:
    filename: str
    title: str
    full_name: str
    role: str
    location: str
    summary_title: str
    summary: str
    skills_title: str
    skill_groups: tuple[tuple[str, tuple[str, ...]], ...]
    experience_title: str
    experiences: tuple[Experience, ...]
    education_title: str
    education: tuple[Education, ...]
    projects_title: str
    projects: tuple[Project, ...]
    languages_title: str
    languages: tuple[str, ...]
    certificates_title: str
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
        title="Dani López - CV",
        full_name="Daniel Lopez Aguirre",
        role="Junior Web & Data Developer",
        location="Almería, España - Catania, Italia",
        summary_title="Perfil",
        summary=(
            "Junior Web & Data Developer de Almería con vínculo con Catania. "
            "Construyo proyectos web y soluciones prácticas con Python, SQL, datos y tecnologías web modernas. "
            "Busco mi primera oportunidad profesional en desarrollo web, Python, SQL y data."
        ),
        skills_title="Skills",
        skill_groups=(
            ("Core", ("Web Development", "Python", "SQL", "JavaScript", "HTML/CSS", "Databases")),
            ("Frameworks / tools", ("Git", "Docker", "Django", "Laravel", "React", "PostgreSQL", "MySQL", "SQLite")),
            ("Improving", ("Data Analysis", "Pandas", "NumPy", "Scikit-learn", "FastAPI")),
        ),
        experience_title="Experiencia práctica",
        experiences=(
            Experience(
                "Prácticas en desarrollo web",
                "MLSoftware - Catania",
                "Marzo 2025 - Junio 2025",
                (
                    "Desarrollo y mantenimiento de páginas responsive con HTML, CSS y JavaScript.",
                    "Trabajo en componentes frontend, ajustes visuales y mejoras de interfaz.",
                ),
            ),
            Experience(
                "Prácticas en datos y Python",
                "KeyOver - Catania",
                "Marzo 2026 - Junio 2026",
                (
                    "Preparación y limpieza de datos para flujos de Machine Learning con Python.",
                    "Uso de Pandas, NumPy, Scikit-learn, Matplotlib y PostgreSQL.",
                    "Participación en un proof of concept para detectar comportamientos inusuales.",
                ),
            ),
            Experience(
                "Árbitro de fútbol",
                "RFAF - Andalucía",
                "",
                (
                    "Responsabilidad directa en toma de decisiones durante partidos.",
                    "Comunicación, foco, calma, gestión de conflictos y trabajo en equipo.",
                ),
            ),
        ),
        education_title="Formación",
        education=(
            Education(
                "Grado Superior en Desarrollo de Aplicaciones Web",
                "Formación Profesional - 2023 / 2025",
                ("Frontend, backend, bases de datos y desarrollo de aplicaciones web completas.",),
            ),
            Education(
                "Máster FP en Desarrollo de Aplicaciones Python",
                "Formación Profesional - 2025 / 2026",
                ("Python, automatización, manejo de datos y estructura de proyectos.",),
            ),
            Education(
                "Máster FP en Inteligencia Artificial y Big Data",
                "Formación Profesional - 2026 / Actualidad",
                ("Formación en curso para ampliar conocimientos de datos, bases de datos y ML.",),
            ),
        ),
        projects_title="Proyectos",
        projects=(
            Project("WebCV Portfolio", "Portfolio multilingüe con estética player profile, escenas 3D, i18n y descarga de CV.", "Vite, JavaScript, Three.js, GSAP"),
            Project("Solver Poker", "Plataforma educativa con simulador, feedback post-mano, asistente y dashboard.", "JavaScript, Node.js, React, JSON"),
            Project("Sorare Price Tracker", "Aplicación Django para monitorizar precios de jugadores, histórico y alertas.", "Python, Django, PostgreSQL, Redis, Docker"),
            Project("Cammay Class", "Aplicación Laravel/PHP para gestionar alumnos, clases, horarios y consultas.", "Laravel, PHP, HTML/CSS"),
        ),
        languages_title="Idiomas",
        languages=("Español - nativo", "Italiano - C1", "Inglés - B1"),
        certificates_title="Certificados",
        issuer_label="Entidad",
        issued_label="Expedición",
        credential_label="ID de credencial",
        action_label="Ver diploma",
        issued={"aug": "ago. 2026", "sep": "sept. 2026"},
    ),
    LocaleCopy(
        filename="daniel_lopez_aguirre_cv_english.pdf",
        title="Dani López - Resume",
        full_name="Daniel Lopez Aguirre",
        role="Junior Web & Data Developer",
        location="Almería, Spain - Catania, Italy",
        summary_title="Profile",
        summary=(
            "Junior Web & Data Developer from Almería with a strong connection to Catania. "
            "I build web projects and practical solutions with Python, SQL, data and modern web technologies. "
            "I am looking for my first professional opportunity in web development, Python, SQL and data."
        ),
        skills_title="Skills",
        skill_groups=(
            ("Core", ("Web Development", "Python", "SQL", "JavaScript", "HTML/CSS", "Databases")),
            ("Frameworks / tools", ("Git", "Docker", "Django", "Laravel", "React", "PostgreSQL", "MySQL", "SQLite")),
            ("Improving", ("Data Analysis", "Pandas", "NumPy", "Scikit-learn", "FastAPI")),
        ),
        experience_title="Practical experience",
        experiences=(
            Experience(
                "Tirocinio in sviluppo web",
                "MLSoftware - Catania",
                "March 2025 - June 2025",
                (
                    "Developed and maintained responsive pages with HTML, CSS and JavaScript.",
                    "Worked on frontend components, visual adjustments and interface improvements.",
                ),
            ),
            Experience(
                "Tirocinio dati e Python",
                "KeyOver - Catania",
                "March 2026 - June 2026",
                (
                    "Prepared and cleaned data for Machine Learning workflows using Python.",
                    "Used Pandas, NumPy, Scikit-learn, Matplotlib and PostgreSQL.",
                    "Contributed to a proof of concept for identifying unusual behavior.",
                ),
            ),
            Experience(
                "Football Referee",
                "RFAF - Andalusia",
                "",
                (
                    "Direct responsibility for decision-making during matches.",
                    "Communication, focus, calm judgment, conflict management and teamwork.",
                ),
            ),
        ),
        education_title="Education",
        education=(
            Education(
                "Higher Degree in Web Application Development",
                "Vocational Training - 2023 / 2025",
                ("Frontend, backend, databases and complete web application development.",),
            ),
            Education(
                "Vocational Training Master in Python Application Development",
                "Vocational Training - 2025 / 2026",
                ("Python, automation, data handling and project structure.",),
            ),
            Education(
                "Vocational Training Master in Artificial Intelligence and Big Data",
                "Vocational Training - 2026 / Present",
                ("Ongoing training in data, databases and Machine Learning models.",),
            ),
        ),
        projects_title="Projects",
        projects=(
            Project("WebCV Portfolio", "Multilingual portfolio with player-profile style, 3D scenes, i18n and CV downloads.", "Vite, JavaScript, Three.js, GSAP"),
            Project("Solver Poker", "Educational platform with simulator, post-hand feedback, assistant and dashboard.", "JavaScript, Node.js, React, JSON"),
            Project("Sorare Price Tracker", "Django app to monitor player prices, store history and prepare alerts.", "Python, Django, PostgreSQL, Redis, Docker"),
            Project("Cammay Class", "Laravel/PHP app for managing students, classes, schedules and inquiries.", "Laravel, PHP, HTML/CSS"),
        ),
        languages_title="Languages",
        languages=("Spanish - native", "Italian - C1", "English - B1"),
        certificates_title="Certificates",
        issuer_label="Issuer",
        issued_label="Issued",
        credential_label="Credential ID",
        action_label="View diploma",
        issued={"aug": "Aug. 2026", "sep": "Sep. 2026"},
    ),
    LocaleCopy(
        filename="daniel_lopez_aguirre_cv_italiano.pdf",
        title="Dani López - CV",
        full_name="Daniel Lopez Aguirre",
        role="Junior Web & Data Developer",
        location="Almería, Spagna - Catania, Italia",
        summary_title="Profilo",
        summary=(
            "Junior Web & Data Developer di Almería con un forte legame con Catania. "
            "Realizzo progetti web e soluzioni pratiche con Python, SQL, dati e tecnologie web moderne. "
            "Cerco la mia prima opportunità professionale in sviluppo web, Python, SQL e data."
        ),
        skills_title="Skills",
        skill_groups=(
            ("Core", ("Web Development", "Python", "SQL", "JavaScript", "HTML/CSS", "Database")),
            ("Framework / strumenti", ("Git", "Docker", "Django", "Laravel", "React", "PostgreSQL", "MySQL", "SQLite")),
            ("Improving", ("Data Analysis", "Pandas", "NumPy", "Scikit-learn", "FastAPI")),
        ),
        experience_title="Esperienza pratica",
        experiences=(
            Experience(
                "Web Development Internship",
                "MLSoftware - Catania",
                "Marzo 2025 - Giugno 2025",
                (
                    "Sviluppo e manutenzione di pagine responsive con HTML, CSS e JavaScript.",
                    "Lavoro su componenti frontend, rifiniture visuali e miglioramenti di interfaccia.",
                ),
            ),
            Experience(
                "Data & Python Internship",
                "KeyOver - Catania",
                "Marzo 2026 - Giugno 2026",
                (
                    "Preparazione e pulizia dati per flussi di Machine Learning con Python.",
                    "Uso di Pandas, NumPy, Scikit-learn, Matplotlib e PostgreSQL.",
                    "Partecipazione a un proof of concept per rilevare comportamenti insoliti.",
                ),
            ),
            Experience(
                "Arbitro di calcio",
                "RFAF - Andalusia",
                "",
                (
                    "Responsabilità diretta nel prendere decisioni durante le partite.",
                    "Comunicazione, concentrazione, calma, gestione dei conflitti e lavoro in team.",
                ),
            ),
        ),
        education_title="Formazione",
        education=(
            Education(
                "Grado Superiore in Sviluppo di Applicazioni Web",
                "Formazione professionale - 2023 / 2025",
                ("Frontend, backend, database e sviluppo di applicazioni web complete.",),
            ),
            Education(
                "Master FP in Sviluppo di Applicazioni Python",
                "Formazione professionale - 2025 / 2026",
                ("Python, automazione, gestione dati e struttura dei progetti.",),
            ),
            Education(
                "Master FP in Intelligenza Artificiale e Big Data",
                "Formazione professionale - 2026 / Attuale",
                ("Percorso in corso su dati, database e modelli di Machine Learning.",),
            ),
        ),
        projects_title="Progetti",
        projects=(
            Project("WebCV Portfolio", "Portfolio multilingue con stile player profile, scene 3D, i18n e download CV.", "Vite, JavaScript, Three.js, GSAP"),
            Project("Solver Poker", "Piattaforma educativa con simulatore, feedback post-mano, assistente e dashboard.", "JavaScript, Node.js, React, JSON"),
            Project("Sorare Price Tracker", "App Django per monitorare prezzi giocatori, storico e avvisi.", "Python, Django, PostgreSQL, Redis, Docker"),
            Project("Cammay Class", "App Laravel/PHP per gestire studenti, lezioni, orari e richieste.", "Laravel, PHP, HTML/CSS"),
        ),
        languages_title="Lingue",
        languages=("Spagnolo - madrelingua", "Italiano - C1", "Inglese - B1"),
        certificates_title="Certificati",
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


def draw_pill(c: canvas.Canvas, text: str, x: float, y: float, *, fill=PILL, color=TEXT) -> float:
    w = text_width(text, "Helvetica-Bold", 6.9) + 14
    rounded(c, x, y - 12, w, 14, fill, None, radius=7)
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", 6.9)
    c.drawCentredString(x + w / 2, y - 8.2, text)
    return w


def draw_pills(c: canvas.Canvas, items: Iterable[str], x: float, y: float, max_width: float) -> float:
    cursor_x = x
    cursor_y = y
    for item in items:
        pill_width = text_width(item, "Helvetica-Bold", 6.9) + 14
        if cursor_x + pill_width > x + max_width:
            cursor_x = x
            cursor_y -= 18
        cursor_x += draw_pill(c, item, cursor_x, cursor_y) + 5
    return cursor_y - 14


def draw_bullets(c: canvas.Canvas, bullets: Iterable[str], x: float, y: float, width: float, *, size=8.1) -> float:
    for bullet in bullets:
        c.setFillColor(ORANGE)
        c.setFont("Helvetica-Bold", size)
        c.drawString(x, y, ">")
        y = draw_wrapped(c, bullet, x + 10, y, width - 10, size=size, leading=size + 2.5, color=MUTED) - 2
    return y


def section_header(c: canvas.Canvas, title: str, x: float, y: float, w: float) -> float:
    label = title.upper()
    c.setFont("Helvetica-Bold", 9.6)
    c.setFillColor(BLUE)
    c.drawString(x, y, label)
    line_x = x + text_width(label, "Helvetica-Bold", 9.6) + 8
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.line(line_x, y + 3, x + w, y + 3)
    return y - 15


def extract_profile_image() -> Path:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    if PROFILE_IMAGE.exists():
        return PROFILE_IMAGE

    for filename in (
        "daniel_lopez_aguirre_curriculum.pdf",
        "daniel_lopez_aguirre_cv_english.pdf",
        "daniel_lopez_aguirre_cv_italiano.pdf",
    ):
        source_pdf = PUBLIC_DIR / filename
        if not source_pdf.exists():
            continue
        try:
            reader = PdfReader(source_pdf)
            for page in reader.pages:
                for image in page.images:
                    PROFILE_IMAGE.write_bytes(image.data)
                    return PROFILE_IMAGE
        except Exception:
            continue

    return PUBLIC_DIR / "favicon.png"


def draw_header(c: canvas.Canvas, copy: LocaleCopy, profile_image: Path):
    c.setFillColor(HEADER_BG)
    c.rect(0, HEIGHT - 132, WIDTH, 132, fill=1, stroke=0)

    c.saveState()
    path = c.beginPath()
    path.circle(75, HEIGHT - 72, 34)
    c.clipPath(path, stroke=0)
    c.drawImage(ImageReader(str(profile_image)), 41, HEIGHT - 106, 68, 68, mask="auto")
    c.restoreState()

    c.setStrokeColor(LINE)
    c.setLineWidth(1.1)
    c.circle(75, HEIGHT - 72, 36, fill=0, stroke=1)
    c.line(38, HEIGHT - 132, WIDTH - 38, HEIGHT - 132)

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(130, HEIGHT - 54, "Dani López")
    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica", 8.4)
    c.drawString(132, HEIGHT - 68, copy.full_name)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 11.4)
    c.drawString(130, HEIGHT - 88, copy.role)
    c.setFont("Helvetica", 8)
    c.drawString(130, HEIGHT - 105, f"{EMAIL} | {PHONE} | {copy.location}")

    y = HEIGHT - 125
    draw_button(c, "LinkedIn", 130, y, 82, 19, fill=colors.HexColor("#e9f2ff"), stroke=colors.HexColor("#006fde"), text_color=colors.HexColor("#0058b7"), url=LINKEDIN_URL)
    draw_button(c, "Portfolio", 220, y, 82, 19, fill=colors.HexColor("#e6f4f1"), stroke=TEAL, text_color=TEAL, url=PORTFOLIO_URL)
    draw_button(c, "GitHub", 310, y, 72, 19, fill=colors.HexColor("#fff3e6"), stroke=ORANGE, text_color=colors.HexColor("#bd5c00"), url=GITHUB_URL)


def draw_summary(c: canvas.Canvas, copy: LocaleCopy, x: float, y: float, width: float) -> float:
    y = section_header(c, copy.summary_title, x, y, width)
    return draw_wrapped(c, copy.summary, x, y, width, size=8.8, leading=11.8, color=MUTED) - 10


def draw_skills(c: canvas.Canvas, copy: LocaleCopy, x: float, y: float, width: float) -> float:
    y = section_header(c, copy.skills_title, x, y, width)
    for group_title, items in copy.skill_groups:
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 8.2)
        c.drawString(x, y, group_title)
        y = draw_pills(c, items, x, y - 14, width) - 4
    return y - 4


def draw_languages(c: canvas.Canvas, copy: LocaleCopy, x: float, y: float, width: float) -> float:
    y = section_header(c, copy.languages_title, x, y, width)
    for lang in copy.languages:
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 8.3)
        c.drawString(x, y, lang)
        y -= 13
    return y


def draw_experience(c: canvas.Canvas, copy: LocaleCopy, x: float, y: float, width: float) -> float:
    y = section_header(c, copy.experience_title, x, y, width)
    for item in copy.experiences:
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(x, y, item.title)
        y -= 10
        c.setFillColor(ACCENT)
        c.setFont("Helvetica-Bold", 7.2)
        meta = item.company if not item.date else f"{item.company} | {item.date}"
        y = draw_wrapped(c, meta, x, y, width, font="Helvetica-Bold", size=7.2, leading=9, color=ACCENT)
        y = draw_bullets(c, item.bullets, x, y - 2, width)
        y -= 5
    return y


def draw_education(c: canvas.Canvas, copy: LocaleCopy, x: float, y: float, width: float) -> float:
    y = section_header(c, copy.education_title, x, y, width)
    for item in copy.education:
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 8.6)
        y = draw_wrapped(c, item.title, x, y, width, font="Helvetica-Bold", size=8.6, leading=10, color=TEXT)
        y = draw_wrapped(c, item.meta, x, y, width, font="Helvetica-Bold", size=7.2, leading=9, color=ACCENT)
        y = draw_bullets(c, item.bullets, x, y - 1, width, size=7.6)
        y -= 5
    return y


def draw_projects(c: canvas.Canvas, copy: LocaleCopy, x: float, y: float, width: float) -> float:
    y = section_header(c, copy.projects_title, x, y, width)
    for project in copy.projects:
        rounded(c, x, y - 44, width, 46, CARD, CARD_BORDER, radius=5)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 8.6)
        c.drawString(x + 9, y - 12, project.title)
        y2 = draw_wrapped(c, project.description, x + 9, y - 24, width - 18, size=7.2, leading=8.5, color=MUTED, max_lines=2)
        c.setFillColor(BLUE)
        c.setFont("Helvetica-Bold", 6.6)
        c.drawString(x + 9, y2 - 1, project.tech)
        y -= 53
    return y


def draw_cert_card(c: canvas.Canvas, cert: dict[str, str], copy: LocaleCopy, x: float, y: float, w: float, h: float):
    rounded(c, x, y - h, w, h, CARD, CARD_BORDER, radius=6)
    c.setFillColor(ACCENT)
    c.roundRect(x, y - 4, w, 4, 2, fill=1, stroke=0)

    track_w = text_width(cert["track"], "Helvetica-Bold", 6.6) + 20
    rounded(c, x + 13, y - 24, track_w, 14, PILL_ORANGE if cert["track"] == "Claude Code" else PILL, None, radius=7)
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 6.6)
    c.drawCentredString(x + 13 + track_w / 2, y - 20, cert["track"])

    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica", 6.7)
    c.drawRightString(x + w - 13, y - 18, f"Anthropic - {copy.issued[cert['month']]}")

    draw_wrapped(c, cert["title"], x + 13, y - 41, w - 26, font="Helvetica-Bold", size=8.6, leading=10.1, color=TEXT, max_lines=4)

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.3)
    c.drawString(x + 13, y - h + 39, copy.credential_label)
    c.setFillColor(colors.HexColor("#4f5b66"))
    c.setFont("Courier", 5.6)
    c.drawString(x + 13, y - h + 27, f"{cert['id'][:16]} {cert['id'][16:]}")

    button_w = 66
    button_h = 16
    draw_button(
        c,
        copy.action_label,
        x + w - button_w - 13,
        y - h + 18,
        button_w,
        button_h,
        fill=colors.HexColor("#f2f8ff"),
        stroke=colors.HexColor("#006fde"),
        text_color=colors.HexColor("#0058b7"),
        url=verify_url(cert["id"]),
    )


def build_pdf(copy: LocaleCopy, profile_image: Path):
    output = PUBLIC_DIR / copy.filename
    c = canvas.Canvas(str(output), pagesize=A4)
    c.setTitle(copy.title)
    c.setAuthor("Daniel Lopez Aguirre")
    c.setSubject("Junior Web & Data Developer CV")
    c.setCreator("build_cv_pdfs.py")

    c.setFillColor(PAGE_BG)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    draw_header(c, copy, profile_image)

    left_x = 38
    left_w = 190
    right_x = 252
    right_w = WIDTH - right_x - 38
    start_y = HEIGHT - 162

    left_y = draw_summary(c, copy, left_x, start_y, left_w)
    left_y = draw_skills(c, copy, left_x, left_y, left_w)
    draw_languages(c, copy, left_x, left_y, left_w)

    right_y = draw_experience(c, copy, right_x, start_y, right_w)
    right_y = draw_education(c, copy, right_x, right_y - 4, right_w)
    draw_projects(c, copy, right_x, right_y - 4, right_w)

    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica", 6.3)
    c.drawRightString(WIDTH - 38, 25, f"{copy.full_name} - CV")

    c.showPage()
    c.setFillColor(PAGE_BG)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    draw_header(c, copy, profile_image)

    x = 38
    y = HEIGHT - 162
    content_w = WIDTH - 76
    section_header(c, copy.certificates_title, x, y, content_w)

    card_w = 247
    card_h = 108
    gap_x = 25
    gap_y = 12
    start_y = HEIGHT - 205
    for index, cert in enumerate(CERTIFICATES):
        col = index % 2
        row = index // 2
        cx = x + col * (card_w + gap_x)
        cy = start_y - row * (card_h + gap_y)
        draw_cert_card(c, cert, copy, cx, cy, card_w, card_h)

    c.setFillColor(LIGHT_TEXT)
    c.setFont("Helvetica", 6.3)
    c.drawRightString(WIDTH - 38, 25, f"{copy.full_name} - CV")
    c.save()
    print(f"Wrote {output}")


def main():
    profile_image = extract_profile_image()
    for copy in COPIES:
        build_pdf(copy, profile_image)


if __name__ == "__main__":
    main()
