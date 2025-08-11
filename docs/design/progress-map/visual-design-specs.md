# Visual Design Specifications
*Progress Map Component | ActiveGotchi Design System*

## Layout Architecture

### Primary Layout: Horizontal Timeline
```
[Past] [Past] [Past] [TODAY] [🔒] [🔒] [🔒]
```

**Responsive Breakpoints:**
- **Mobile (320px-767px)**: Horizontal scroll, centered current day
- **Tablet (768px-1023px)**: Full width display, larger touch targets
- **Desktop (1024px+)**: Enhanced animations, hover states

### Alternative Layout: Vertical Stack
For narrow screens or accessibility preferences:
```
[Past Day]     ✓
[Past Day]     ✓  
[Past Day]     ✓
[TODAY]        ◐ 75%
[Locked]       🔒
[Locked]       🔒
[Locked]       🔒
```

## Visual State Definitions

### 1. Completed Days (Past)
**Visual Treatment:**
- **Color**: Vibrant success green (#58CC02)
- **Icon**: Checkmark or custom success symbol
- **Background**: Subtle gradient or solid fill
- **Border**: Optional 2px success border
- **Shadow**: Soft drop shadow for depth (0 2px 8px rgba(88, 204, 2, 0.2))
- **Streak Indicator**: Small flame icon if day contributed to streak

**Micro-interactions:**
- Gentle hover scale (1.05x) on desktop
- Tap feedback with brief color intensification
- Success glow animation on completion

### 2. Current Day (Today)
**Visual Treatment:**
- **Color**: Warm action orange (#FF9600) 
- **Size**: 20% larger than other days
- **Animation**: Subtle breathing/pulsing effect (2s infinite)
- **Progress Ring**: Circular progress indicator showing completion %
- **CTA Styling**: Clear call-to-action visual treatment
- **Icon**: Pet face or activity-specific icon

**Progress Ring Specifications:**
- **Diameter**: 60px minimum for accessibility
- **Stroke Width**: 4px for clear visibility  
- **Background**: Light grey (#F5F5F5)
- **Progress Fill**: Gradient from orange to green based on completion
- **Animation**: Smooth fill animation on progress updates

### 3. Locked Days (Future)
**Visual Treatment:**
- **Color**: Neutral grey (#AFAFAF)
- **Opacity**: 40% to indicate unavailable state
- **Icon**: Lock symbol or no icon
- **Background**: Subtle pattern or solid muted color
- **No Interaction**: No hover states or tap responses

**Alternative Treatment:**
- Completely hidden until unlocked
- "Coming Soon" subtle text indicator
- Dotted outline to show upcoming structure

## Color System

### Primary Palette
```scss
// Success & Completion
$success-green: #58CC02;
$success-light: #7ED321;
$success-dark: #4AAA00;

// Current Day & Actions
$action-orange: #FF9600;
$action-light: #FFB84D;
$action-dark: #E6851A;

// Streaks & Achievements
$streak-gold: #FFC800;
$achievement-purple: #CE82FF;

// Neutral States
$neutral-grey: #AFAFAF;
$light-grey: #F5F5F5;
$dark-grey: #777777;

// Background & Text
$background-white: #FFFFFF;
$background-off-white: #FAFAFA;
$text-dark: #333333;
$text-medium: #666666;
$text-light: #999999;
```

### Accessibility Colors
All colors meet WCAG 2.1 AA contrast requirements:
- Text on light backgrounds: 4.5:1 minimum
- Text on colored backgrounds: 4.5:1 minimum
- Interactive elements: Clear focus indicators with 3:1 contrast

## Typography System

### Font Families
```scss
$font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', system-ui;
$font-numeric: 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

### Type Scale
```scss
// Day Labels
$day-label-size: 14px;
$day-label-weight: 600; // Semi-bold
$day-label-line-height: 1.2;

// Progress Text  
$progress-text-size: 12px;
$progress-text-weight: 400; // Regular
$progress-text-line-height: 1.3;

// Streak Counter
$streak-size: 18px;
$streak-weight: 700; // Bold
$streak-line-height: 1.1;

// Status Messages
$status-size: 13px;
$status-weight: 500; // Medium
$status-line-height: 1.4;
```

## Spacing & Sizing

### Component Dimensions
```scss
// Touch Targets (Mobile-first)
$touch-target-min: 44px;
$day-component-size: 60px; // Default
$current-day-size: 72px; // 20% larger

// Spacing Grid
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// Component Spacing
$day-gap: 12px; // Between day components
$section-gap: 24px; // Between major sections
$content-padding: 16px; // Internal component padding
```

### Border Radius
```scss
$radius-sm: 4px; // Small elements
$radius-md: 8px; // Standard components  
$radius-lg: 12px; // Large containers
$radius-full: 50%; // Circular elements
```

## Animation Specifications

### Timing Functions
```scss
$ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
$ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
$ease-in: cubic-bezier(0.4, 0.0, 1, 1);
```

### Duration Standards
```scss
$duration-fast: 150ms; // Quick feedback
$duration-medium: 300ms; // Standard transitions
$duration-slow: 500ms; // Complex animations
$duration-breathing: 2000ms; // Current day pulse
```

### Specific Animations

#### Current Day Breathing
```scss
@keyframes breathe {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.8;
  }
}
```

#### Completion Celebration
```scss
@keyframes celebrate {
  0% { 
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.2) rotate(5deg);
    filter: brightness(1.2);
  }
  100% { 
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
}
```

#### Loading Shimmer
```scss
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
```

## Responsive Design

### Mobile Optimization (320px-767px)
- Horizontal scroll for week view
- Current day remains centered
- Touch targets maintain 44px minimum
- Reduced spacing for screen real estate
- Simplified animations for performance

### Tablet Enhancement (768px-1023px)
- Full week fits in viewport
- Larger touch targets (48px)
- Enhanced spacing for comfort
- Additional micro-animations

### Desktop Features (1024px+)
- Hover states for all interactive elements
- Smoother, more complex animations
- Additional visual flourishes
- Keyboard navigation support

## Accessibility Considerations

### Visual Accessibility
- High contrast mode support
- No essential information communicated through color alone
- Clear visual hierarchy through size, weight, and spacing
- Sufficient whitespace between elements

### Motion Accessibility
- Respect `prefers-reduced-motion` system setting
- Provide static alternatives for all animations
- No flashing or rapidly changing content
- User control over animation preferences

## Implementation Notes

### CSS Custom Properties
Enable easy theming and customization:
```css
:root {
  --progress-success-color: #58CC02;
  --progress-current-color: #FF9600;
  --progress-neutral-color: #AFAFAF;
  /* ... additional properties */
}
```

### Performance Considerations
- Use `transform` and `opacity` for animations (hardware accelerated)
- Minimize reflows with careful layout planning
- Lazy load non-critical visual elements
- Optimize images and icons for various screen densities

---

*These specifications ensure a visually appealing, accessible, and performant progress map component that aligns with research-backed UX principles.*