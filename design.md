---
name: HopeHRS Neumorphic Matrix
colors:
  surface: '#f7faf9'
  surface-dim: '#d7dbda'
  surface-bright: '#f7faf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f3'
  surface-container: '#ebeeee'
  surface-container-high: '#e6e9e8'
  surface-container-highest: '#e0e3e2'
  on-surface: '#181c1c'
  on-surface-variant: '#3f4948'
  inverse-surface: '#2d3131'
  inverse-on-surface: '#eef1f0'
  outline: '#6f7979'
  outline-variant: '#bec9c8'
  surface-tint: '#096969'
  primary: '#004c4c'
  on-primary: '#ffffff'
  primary-container: '#006666'
  on-primary-container: '#93e1e0'
  inverse-primary: '#86d4d3'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfde'
  on-secondary-container: '#636262'
  tertiary: '#6a3516'
  on-tertiary: '#ffffff'
  tertiary-container: '#874c2b'
  on-tertiary-container: '#ffc8ad'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a2f0ef'
  primary-fixed-dim: '#86d4d3'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f4f'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#6e3819'
  background: '#f7faf9'
  on-background: '#181c1c'
  surface-variant: '#e0e3e2'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-xs:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  data-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-value:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  sidebar-width: 260px
  stack-compact: 8px
  stack-default: 16px
---

## Brand & Style

This design system establishes a high-precision, tactile interface for enterprise HR management. It blends the structural logic of a "Matrix" data environment with the organic, soft-touch aesthetic of neumorphism. The personality is hyper-professional yet physically approachable, aiming to reduce the cognitive load of complex data entry through sensory-driven UI cues.

The style leverages **Neomorphism** and **Tactile** surfacing to create an environment where every interactive element feels like a physical switch or membrane. The "Matrix" influence is felt through monospaced precision and a monochromatic foundation punctuated by a singular, authoritative teal. The result is a futuristic, reliable workstation that feels engineered rather than merely drawn.

## Colors

The palette is rooted in the "Warm Grey" spectrum to provide a sophisticated, stone-like substrate for neumorphic shadows. 

- **Primary Teal (#006666):** Used sparingly for high-action focal points, active states, and critical data indicators. It represents the "Matrix" energy within the neutral field.
- **Surface (#E7E5E4):** The base canvas color. All elevations are calculated relative to this value.
- **Raised Surface (#F5F5F4):** The color for elements "extruding" toward the user.
- **Pressed Surface (#D6D3D1):** The color for inset wells, active input fields, and depressed button states.
- **Status Colors:** Use desaturated versions of standard semantic colors (Success: #15803D, Error: #B91C1C) to maintain the professional, understated atmosphere.

## Typography

This design system utilizes a dual-mono typographic strategy to reinforce its technical, matrix-inspired roots while maintaining enterprise readability.

- **Space Grotesk:** While the request specified Space Mono, Space Grotesk is utilized for primary headings and body text to ensure professional legibility at compact enterprise scales, retaining the technical "Geist" of the mono aesthetic without the horizontal spacing issues of true monospaced fonts in paragraphs.
- **JetBrains Mono:** Reserved exclusively for labels, data points, IDs, and financial figures. This creates a clear visual distinction between "human narrative" and "system data."
- **Weight Usage:** Use Medium (500) for labels to ensure they punch through the soft neumorphic shadows.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model optimized for desktop HR management.

- **Sidebar Navigation:** A fixed-width left rail (260px) that acts as the primary anchor. It uses a slightly darker surface than the main content area to provide grounding.
- **Enterprise Density:** A strict 4px grid is used. Padding inside components is kept tight (8px to 12px) to maximize information density for HR practitioners handling large datasets.
- **Grid System:** A 12-column grid within the main content area, using 16px gutters. Large data tables should span the full 12 columns, while administrative cards typically occupy 3 or 4 columns.

## Elevation & Depth

Depth is the primary communicator of hierarchy in this design system. Instead of using traditional borders or high-contrast backgrounds, use dual-source lighting.

- **Raised State (Outset):** Elements feature a top-left light shadow (`-4px -4px 8px #FFFFFF`) and a bottom-right dark shadow (`4px 4px 8px #B0ACA6`). This creates the "extruded" look.
- **Pressed State (Inset):** Elements feature a top-left inner shadow (`inset 4px 4px 8px #B0ACA6`) and a bottom-right inner shadow (`inset -4px -4px 8px #FFFFFF`). Use this for active buttons and text inputs.
- **Flat Surface:** Used for non-interactive containers to prevent visual clutter.
- **Shadow Softness:** Shadows must remain subtle. Avoid pure black; use tinted neutrals derived from the surface color to maintain the "soft depth" requirement.

## Shapes

The shape language is defined by "Soft Precision." 

- **Corner Radius:** A base radius of 8px (`rounded-md`) is used for buttons and small inputs. Larger containers and cards use 16px (`rounded-lg`) to emphasize the "molded" nature of the tactile surface.
- **Consistent Curvature:** Neumorphic effects fail if corner radii are too sharp. The 8px-16px range ensures the light and shadow wrap naturally around the forms.
- **Interactive Elements:** Checkboxes and radio buttons maintain a slight 4px radius, avoiding perfect circles for radio buttons to align with the futuristic "Matrix" aesthetic.

## Components

- **Buttons:** Primary buttons use the Teal (#006666) with white text and a subtle outset shadow. Secondary buttons are the surface color with an outset shadow, shifting to inset when clicked.
- **Inputs:** Text fields appear as "inset" wells by default. This creates a clear mental model that the field is a space to be filled. Use JetBrains Mono for input text.
- **Cards:** Cards should not have borders. They are defined solely by their soft-raised elevation.
- **Sidebar Items:** Active states use an inset shadow and a 4px teal vertical "indicator light" on the far left.
- **Data Tables:** Since neumorphism can be heavy, tables use flat rows with subtle 1px dividers. The "Table Header" can be a slightly raised surface to provide a tactile anchor for the data below.
- **Chips/Badges:** Small, pill-shaped elements with very subtle inset shadows to look like embossed labels on a physical machine.