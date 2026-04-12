# Tinkro Robotics — Design System

## Overview
Premium global robotics ecommerce brand. Deep blue primary with electric cyan accent. Glassmorphism layering, Apple-level smooth animations, luxury tech aesthetic positioning Tinkro alongside Makeblock and LEGO Education.

## Tone & Aesthetic
Premium tech, refined minimalism, luxury robotics education. Bold blue-cyan harmony, soft gradients, subtle depth, conversion-focused storytelling.

## Color Palette

| Token | Light OKLCH | Dark OKLCH | Purpose |
|-------|-----------|----------|---------|
| Primary | 0.35 0.15 258 | 0.65 0.18 199 | Deep blue — main actions, hero, brand |
| Accent | 0.62 0.19 199 | 0.75 0.2 199 | Electric cyan — highlights, accents, hover states |
| Muted | 0.94 0 0 | 0.18 0.02 258 | Neutral backgrounds, secondary content |
| Foreground | 0.12 0 0 | 0.95 0 0 | Text, primary content |
| Background | 0.99 0 0 | 0.1 0.01 258 | Page background, light mode white, dark navy |

## Typography
**Display:** Satoshi (bold, headlines, hero)  
**Body:** PlusJakartaSans (friendly, readable, 16px base)  
**Mono:** JetBrainsMono (code, specs)  
Type scale: 12, 14, 16, 18, 20, 24, 28, 32, 40, 48px

## Structural Zones
- **Header:** Sticky navbar, `bg-white/90 dark:bg-slate-900/60` with backdrop blur, cyan accent underline on active nav item
- **Hero:** Full-width gradient background (`--gradient-primary`), floating animation elements, two CTA buttons (Shop Now → primary, Explore Labs → secondary outline)
- **Content cards:** `glass-card` — white/80 or slate-900/40 with backdrop-blur, subtle border, hover lift with increased shadow
- **Interactive elements:** Buttons use `bg-primary`, hover glow effect via `shadow-glow`, active state ring with `active-glow` utility
- **Footer:** `bg-muted/30` with `border-t border-border`, secondary content foreground

## Component Patterns
- **Buttons:** Primary (solid gradient blue-cyan), Secondary (outline with border), Tertiary (text only)
- **Cards:** `glass-card glass-hover` for interactive surfaces, `shadow-subtle` default → `shadow-elevated` on hover
- **Gradients:** Use `--gradient-primary` for hero, CTAs; `--gradient-subtle` for section backgrounds
- **Hover effects:** `hover-lift` (translate-y-[-4px] + shadow-elevated), `glass-hover` (opacity + border shift)
- **Badges:** Solid accent background with cyan foreground, rounded-full, small padding

## Motion & Animation
- **Fade-in:** 0.6s ease-in-out on page load, section reveals
- **Slide-up:** 0.6s ease-out for content entrance from bottom
- **Float:** 3s ease-in-out infinite for floating hero elements, product images
- **Pulse:** 3s ease-in-out for badge highlights, accent accents
- **Hover transitions:** All 0.3s cubic-bezier(0.4, 0, 0.2, 1) (smooth, snappy)
- **Scroll reveals:** Stagger entrance animations for card grids using delay (50ms per item)

## Signature Detail
Electric cyan glow on hero buttons and product hover states. Soft gradient text for "Build. Code. Innovate." headline. Floating orbs in hero background with low-opacity gradients. Glassmorphism borders with subtle 20% white/blue tint. No harsh shadows — all shadows use rgba(0,0,0,0.1) or less.

## Product Detail Page Specs

### Hero Section
- Full-viewport above fold: product image on left (contained, soft glow), headline + subheading on right
- Headline: product name with orange gradient highlight on key word
- Subheading: single-line benefit statement
- Backdrop: `--gradient-primary` with floating cyan orbs, parallax scroll effect
- CTA: "Add to Cart" primary button with `shadow-glow-orange`

### Storytelling Sections (Problem → Solution → Outcome)
- Three alternating sections: image left/text right, text left/image right, image left/text right
- Section backgrounds: light sections use `bg-white`, dark sections use `bg-muted/10`
- Text uses `glass-card` container with `glass-hover` effect
- Scroll-reveal animation: fade-in + slide-up with 100ms stagger between sections
- Images: `product-image-container` for consistency with homepage

### Kit Contents
- Expandable grid: 8-12 components with icons, names, quantity badges
- Expand/collapse state: `accordion` pattern with smooth height transition
- Each item: icon + label + quantity badge with accent background color

### Use Cases (3 cards)
- `glass-card glass-hover` with gradient borders (cyan for students, orange for schools)
- Icon, title, 2–3 bullet benefits, subtle badge highlight
- Stagger entrance: 50ms per card on scroll-reveal

### Reviews Carousel
- Auto-scroll carousel with 5-star rating display, customer name, quote text
- Controls: prev/next buttons, dot indicators
- Pause on hover, resume on leave
- Smooth fade between reviews

### Sticky Buy Panel
- Fixed bottom: glassmorphic `bg-card/90 backdrop-blur-md`, `border-t border-accent`
- Layout: product name (left) | price display (center) | qty selector (right) | CTA button (right)
- CTA: gradient-orange button with ripple-glow hover, quantity increments
- Mobile: stack vertically, full-width button
- Z-index: 40 (above content, below modals)

## Constraints
- No bare hex colors; all colors via OKLCH tokens
- No generic blue; always use `--primary` (0.35 0.15 258)
- No rainbow palettes; cyan accent used sparingly
- Max 2 font families (display + body)
- Animations always ease-in-out or ease-out; avoid bounce
- No cheap gradients (harsh transitions); soft multi-stop blends
- Viewport 375px (mobile) to 1920px (desktop)
