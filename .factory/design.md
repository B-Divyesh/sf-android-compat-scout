# Android Compat Scout — visual system

## Direction

**Blueprint drafting sheet.** The product is a careful inspection instrument for
people piecing together Android, a dongle, and local apps. It should feel like a
field technician's marked-up compatibility sheet: steady, factual, and legible
in a dim workshop rather than like a consumer phone settings screen.

## Palette

| Token | Value | Purpose |
| --- | --- | --- |
| Draft paper | `#E6E7DD` | warm technical-sheet background |
| Night ink | `#10202B` | primary text and dark panels |
| Blueprint | `#075C8A` | active controls and measured rules |
| Signal cyan | `#00A7C4` | supported/observed details |
| Safety amber | `#9B5100` | needs-attention status |
| Fault red | `#8D2737` | blocking regression |
| White pencil | `#F9F9F3` | text on dark surfaces |

The site is deliberately light-only: a physical drafting sheet is the thesis.
Dark terminal panels provide depth without becoming a second theme.

## Type, spacing, and components

The interface uses the self-hosted-browser-safe system mono stack for data,
commands, and labels, paired with the system sans stack for prose. This keeps
the installer small and makes device facts feel inspectable. The scale is
12/14/16/20/28/44px. Spacing follows an 8px grid. Rules, square corners, marker
notches, and numbered callouts replace generic rounded cards.

## Interaction and motion

Sections reveal with a 180ms opacity + 4px upward movement. Status rows change
with a short color fade. `prefers-reduced-motion` disables all transforms and
transitions. Focus is a 3px cyan outline with an offset, designed to look like a
drafting highlight.

## Original asset plan and provenance

`site/src/assets/blueprint-hero.webp` is an original generated raster
illustration: a top-down Android phone, USB cable, Wi-Fi waves, and handwritten
style inspection callouts on cyan blueprint paper. It contains no readable UI
copy, brand marks, or third-party assets. Prompt and generation metadata are
stored beside the source asset (`blueprint-hero.png.json`). It is generated with
the factory `gen-image.sh` deployment, then converted to WebP under 300 KB.
The rest of the diagrams are semantic HTML/CSS, so their labels remain readable
and accessible.
