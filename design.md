# David Heckhoff — Style Reference
> Warm canvas, playful 3D

**Theme:** light

This system expresses a playful, modern web developer's environment, characterized by soft, warm neutrals as a canvas for bold, single-hue accents. Typographical hierarchy is established through variable font weights and generous line heights, rather than drastic size shifts. Immersive 3D iconography sets a distinct tone, further solidified by a strong orange action color that adds an energetic, 'get-it-done' feel. Components prioritize rounded forms and minimal, subtle outlining, echoing the friendly nature of the primary visuals.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Beige | `#f5efe6` | `--color-canvas-beige` | Page backgrounds, large structural elements, subtle background for ghost buttons, footer backgrounds — provides a warm, inviting base layer |
| Mid-Tone Beige | `#e9ded0` | `--color-mid-tone-beige` | Card surfaces, subtle button borders, soft elevated elements — works as a secondary surface atop Canvas Beige, maintaining the overall warmth |
| Deep Mocha | `#2d2a24` | `--color-deep-mocha` | Primary text, strong borders, prominent text on buttons, main text elements — provides high contrast against the light beige surfaces |
| Muted Stone | `#5f5646` | `--color-muted-stone` | Secondary text, descriptive labels, subtle card text — a softer text color for less prominent information, designed to recede slightly |
| Light Linen | `#dfd2bf` | `--color-light-linen` | Tertiary card backgrounds, light button fills where a very subtle distinction is needed |
| Polar Mist | `#e1f5ff` | `--color-polar-mist` | Decorative icon accents, subtle highlight effects, supporting visual elements in the 3D illustrations — a near-gray with a cool blue tint |
| True White | `#ffffff` | `--color-true-white` | Text on dark backgrounds, small icon details, very subtle button outlines — a clean, bright accent for maximum contrast |
| Vibrant Orange | `#ff8400` | `--color-vibrant-orange` | Primary call-to-action button backgrounds — a bold, energetic accent that immediately draws attention and signifies interactivity |
| Electric Blue | `#34bfff` | `--color-electric-blue` | Blue outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Hologram Top | `linear-gradient(rgb(0, 53, 133) 0%, rgba(0, 82, 145, 0.6) 100%)` | `--color-hologram-top` | Top portion of holographic gradient effects, such as in 3D character bases |
| Hologram Bottom | `linear-gradient(rgb(0, 53, 133) 0%, rgba(0, 82, 145, 0.6) 100%)` | `--color-hologram-bottom` | Bottom portion of holographic gradient effects, seen in 3D scene elements |

## Tokens — Typography

### Urbanist — Primary typeface for all UI text, headings, body, and links. Its humanist sans-serif style contributes to the approachable and friendly tone. Letter spacing is subtly tightened for headlines for a more contained feel. · `--font-urbanist`
- **Substitute:** Inter
- **Weights:** 400, 500, 700, 800, 900
- **Sizes:** 14px, 16px, 22px, 72px, 88px
- **Line height:** 1.09, 1.11, 1.20, 1.36
- **Letter spacing:** 0.21, 0.32, 0.37
- **Role:** Primary typeface for all UI text, headings, body, and links. Its humanist sans-serif style contributes to the approachable and friendly tone. Letter spacing is subtly tightened for headlines for a more contained feel.

### ProFontWindows — Used for code snippets and specialized technical text, offering a distinctive mono-spaced character. Its inclusion highlights the developer focus of the brand. · `--font-profontwindows`
- **Substitute:** Roboto Mono
- **Weights:** 400, 700
- **Sizes:** 16px, 18px, 22px, 28px
- **Line height:** 1.20
- **Letter spacing:** 0.18, 0.24, 0.32, 0.36
- **Role:** Used for code snippets and specialized technical text, offering a distinctive mono-spaced character. Its inclusion highlights the developer focus of the brand.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 14px | 1.2 | — | `--text-body` |
| body-lg | 16px | 1.2 | 0.24px | `--text-body-lg` |
| subheading | 22px | 1.2 | 0.32px | `--text-subheading` |
| heading | 28px | 1.2 | 0.36px | `--text-heading` |
| display-sm | 72px | 1.11 | 0.32px | `--text-display-sm` |
| display | 88px | 1.09 | 0.37px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 26 | 26px | `--spacing-26` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| links | 24px |
| other | 12px |
| buttons | 100px |

### Layout

- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 18px

## Components

### Navigation Link (Ghost)
**Role:** Header and footer navigation items.

Transparent background with Deep Mocha text. `padding: 4px 0px`. No border, relying on text contrast for distinction. `border-radius: 100px` is present but visually unused due to transparent background.

### Primary Action Button
**Role:** Key calls to action.

Vibrant Orange background, True White text, `padding: 0px 26px`. Features a full `border-radius: 100px` creating a pill shape.

### Subtle Round Button
**Role:** Small, functional buttons like language selectors.

Light Linen background, Deep Mocha text, `padding: 10px`. Perfectly round with `border-radius: 50%`.

### Outlined Ghost Button
**Role:** Secondary action or navigational buttons.

Transparent background, Deep Mocha text, subtle Mid-Tone Beige border. `padding: 0px 16px`. Full `border-radius: 100px` for a pill shape.

### Feature Card
**Role:** Containers for project listings or information blocs.

Mid-Tone Beige background, `border-radius: 16px`, no visible shadow. Content is typically structured with an `elementGap` of 18px.

### Section Header
**Role:** Large, prominent titles for content sections.

Urbanist font, typically weight 800 or 900, Deep Mocha color. Sizes up to 88px, with `letterSpacing` around 0.37px.

### Accent Tag
**Role:** Small descriptive labels under headings.

Rectangle with Electric Blue border (3px solid), Deep Mocha text, `border-radius: 12px`. Used to categorize or highlight key information like 'WEB DEVELOPER'.

## Do's and Don'ts

### Do
- Prioritize Canvas Beige (#f5efe6) for page backgrounds to maintain the warm, inviting base.
- Use Vibrant Orange (#ff8400) exclusively for primary call-to-action button backgrounds to preserve its impact.
- Apply `border-radius: 100px` to all buttons for a consistent pill-shaped aesthetic.
- Employ the Urbanist font family for all primary UI text, adjusting weights to establish hierarchy rather than relying solely on size.
- Maintain an `elementGap` of 18px between elements within components for comfortable density.
- When introducing new 3D elements, integrate Electric Blue (#34bfff) or the Hologram Gradient to tie into the existing technical visual language.
- Ensure headings use a slightly condensed `letterSpacing` (e.g., 0.37px at 88px) to feel composed.

### Don't
- Avoid using saturated background colors other than Canvas Beige (#f5efe6), Mid-Tone Beige (#e9ded0), or Light Linen (#dfd2bf) for large surface areas.
- Do not introduce new border radii beyond 100px, 16px, 24px, or 12px to maintain geometric consistency.
- Refrain from using Vibrant Orange (#ff8400) for decorative purposes or secondary text; it must signal primary interaction.
- Do not use highly contrasting or dark backgrounds unless it's for a specific immersive 3D experience with its own contained color scheme.
- Avoid generic icon styles; instead, prefer the 3D illustrative style seen on the site to reinforce brand identity.
- Do not use generic system fonts; always utilize Urbanist or ProFontWindows to maintain typographical distinctiveness.
- Do not make buttons purely square or with sharp corners; always apply significant `border-radius`.

## Imagery

The site heavily features bespoke 3D illustrations, often appearing as hero elements or embedded within sections. These illustrations are volumetric, rendered with soft, diffused lighting and rounded, stylized forms, often depicting work-from-home setups or abstract representations of digital activity. Colors within the illustrations often align with the brand's accent colors (Electric Blue, Hologram gradients) and the warm neutral base. Photography is absent; the visual identity is driven purely by crafted 3D graphics. Icons are also stylized, generally outlined or subtly filled to match the illustrative aesthetic. Imagery is the primary content, often taking full width or large portions of the screen, serving a decorative and explanatory role to set a playful, high-tech atmosphere rather than product showcase.

## Layout

The page primarily uses a contained layout with a maximum width, centered on a Canvas Beige background. The hero section is visually striking, often featuring a large, immersive 3D illustration dominating the upper fold, potentially with a full-bleed effect on transitions. Sections maintain a consistent vertical rhythm, with `sectionGap` of 48px, and often alternate content Left/Right with visuals. Content is frequently arranged in centered stacks for headings and short descriptions, transitioning to multi-column grids (like a 3-column card grid for projects) for feature presentation. The navigation is a classic top bar, often sticky or revealed on scroll, featuring ghost links and a prominent Primary Action Button. The overall density feels comfortable and spaced out, allowing the detailed 3D elements to breathe.

## Agent Prompt Guide

Quick Color Reference:
text: #2d2a24
background: #f5efe6
border: #e9ded0
accent: #34bfff
primary action: #ff8400 (filled action)

Example Component Prompts:
Create a hero section headline: 'David Heckhoff' using Urbanist, weight 900, size 88px, Deep Mocha (#2d2a24), letter-spacing 0.37px, line height 1.09. Below it, an Accent Tag: 'WEB DEVELOPER', Deep Mocha text with a 3px solid Electric Blue (#34bfff) border, and 12px radius.

Create a Primary Action Button: #ff8400 background, #2d2a24 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

Design a Feature Card: Mid-Tone Beige (#e9ded0) background, 16px border-radius, with an internal element gap of 18px. Inside, place a title 'CubeWar' using Urbanist weight 700, size 22px, Deep Mocha (#2d2a24), and body text 'Multiplayer strategy game' using Urbanist weight 400, size 16px, Muted Stone (#5f5646).

Create a Navigation Link: 'Projects' with transparent background, Deep Mocha (#2d2a24) text, Urbanist weight 500, size 16px, padding 4px 0px. Ensure it has a 100px border-radius without a visible border to maintain the soft shape from interaction states.

## Similar Brands

- **Stripe** — Subtle use of color on a predominantly light/neutral canvas, with a single, highly saturated accent for key actions and illustrative elements.
- **Framer** — Emphasis on 3D elements and immersive, playful graphics as a core part of the brand identity, integrated seamlessly into the UI.
- **Linear** — Controlled use of typography with precise letter-spacing and thoughtful line heights for both readability and visual appeal, on a light neutral background.
- **Notion** — A reliance on warm, inviting neutral color palettes for surfaces and backgrounds, creating a calm and focused environment.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-beige: #f5efe6;
  --color-mid-tone-beige: #e9ded0;
  --color-deep-mocha: #2d2a24;
  --color-muted-stone: #5f5646;
  --color-light-linen: #dfd2bf;
  --color-polar-mist: #e1f5ff;
  --color-true-white: #ffffff;
  --color-vibrant-orange: #ff8400;
  --color-electric-blue: #34bfff;
  --color-hologram-top: #003585;
  --gradient-hologram-top: linear-gradient(rgb(0, 53, 133) 0%, rgba(0, 82, 145, 0.6) 100%);
  --color-hologram-bottom: #005291;
  --gradient-hologram-bottom: linear-gradient(rgb(0, 53, 133) 0%, rgba(0, 82, 145, 0.6) 100%);

  /* Typography — Font Families */
  --font-urbanist: 'Urbanist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-profontwindows: 'ProFontWindows', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.2;
  --text-body-lg: 16px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: 0.24px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.32px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: 0.36px;
  --text-display-sm: 72px;
  --leading-display-sm: 1.11;
  --tracking-display-sm: 0.32px;
  --text-display: 88px;
  --leading-display: 1.09;
  --tracking-display: 0.37px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-144: 144px;

  /* Layout */
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 18px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-links: 24px;
  --radius-other: 12px;
  --radius-buttons: 100px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-beige: #f5efe6;
  --color-mid-tone-beige: #e9ded0;
  --color-deep-mocha: #2d2a24;
  --color-muted-stone: #5f5646;
  --color-light-linen: #dfd2bf;
  --color-polar-mist: #e1f5ff;
  --color-true-white: #ffffff;
  --color-vibrant-orange: #ff8400;
  --color-electric-blue: #34bfff;
  --color-hologram-top: #003585;
  --color-hologram-bottom: #005291;

  /* Typography */
  --font-urbanist: 'Urbanist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-profontwindows: 'ProFontWindows', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.2;
  --text-body-lg: 16px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: 0.24px;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.32px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: 0.36px;
  --text-display-sm: 72px;
  --leading-display-sm: 1.11;
  --tracking-display-sm: 0.32px;
  --text-display: 88px;
  --leading-display: 1.09;
  --tracking-display: 0.37px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 100px;
}
```


HACER ESTO

  ---                                                                                                                                                            
  Opción A — Spline (recomendada)                                                                                                                                
  Spline.design es una herramienta gratuita para crear 3D en el navegador, con resultados visuales al nivel del sitio de referencia. Tú diseñas la escena (o usas
   templates de la comunidad), y yo la empotra con una sola línea. Es exactamente lo que usan muchos portfolios premium. Resultado inmediato, sin modelos        
  externos.                                                                                                                                                      
           
  Opción B — Modelo 3D real (.glb)                                                                                                                               
  Si consigues un modelo 3D en formato .glb (de Sketchfab, Mixamo, o cualquier artista), lo cargo con Three.js GLTFLoader y queda igual que la referencia. El    
  problema es que necesitas el archivo.                                                                                                                          
                                                                                                                                                                 
  Opción C — Three.js con shaders custom                                                                                                                         
  Puedo mejorar mucho el Three.js actual con shaders GLSL personalizados — formas con desplazamiento de vértices, gradientes, efectos de luz volumétrica. Sigue
  siendo procedural (sin modelos), pero queda bastante más premium que lo actual.                                                                                
   
  ---                                                                                                                                                            
  Mi recomendación es A (Spline). ¿Quieres que te explique cómo funciona el flujo para que lo tengamos listo en 20 minutos?