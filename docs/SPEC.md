# NumeroTalk — Vedic Numerology Intelligence Specification

## 1. Overview
NumeroTalk is an enterprise-grade Vedic numerology platform built on Next.js 16 and TypeScript. It computes authentic Vedic astrological numbers, energy grids, planetary yogas, dasha periods, name vibration resonance, and spatial Vastu alignments without modern syncretisms or foreign grid systems.

## 2. Core Numbers
- **Mulank (Driver / Root Number):** The reduced single-digit sum of the day of birth (1–9).
- **Bhagyank (Conductor / Destiny Number):** The reduced single-digit sum of all digits in the complete date of birth (Day + Month + Year).
- **Name Number (Namank / Destiny):** Computed using sacred Vedic phonetic sound vibration values for letters (values 1 through 8, with 9 sacred and unassigned). Function `nameNumber(name)` supports English and Devanagari transliteration.

## 3. Indian Vedic 3x3 Grid
The platform uses exclusively the Indian Vedic 3x3 grid layout:
```
3 1 9
6 7 5
2 8 4
```
- **Row 1:** 3, 1, 9 (Mental Plane / Intellectual Yoga)
- **Row 2:** 6, 7, 5 (Emotional Plane / Heart & Soul Yoga)
- **Row 3:** 2, 8, 4 (Practical Plane / Physical & Material Yoga)
- **Column 1:** 3, 6, 2 (Thought Plane / Visionary Yoga)
- **Column 2:** 1, 7, 8 (Will Power Plane / Determination Yoga)
- **Column 3:** 9, 5, 4 (Action Plane / Execution Yoga)
- **Diagonal 1:** 3, 7, 4 (Golden Raj Yoga / Prosperity Diagonal)
- **Diagonal 2:** 9, 7, 2 (Silver Raj Yoga / Property Diagonal)

## 4. Vastu Alignments
Directional recommendations are obtained strictly from `/mocks/rules/vastu-directions.json`, mapping numbers 1 through 9 to cardinal directions, elemental affiliations, and architectural room usage for homes and workplaces.

## 5. Architectural Principles
- Pure Vedic Principles · Ancient Wisdom · Modern Guidance
- Zero external foreign grid overlays or competing systems.
- Robust unit and end-to-end test coverage.
