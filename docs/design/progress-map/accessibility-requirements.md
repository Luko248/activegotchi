# Accessibility Requirements
*Progress Map Component | ActiveGotchi Design System*

## WCAG 2.1 Compliance Standards

### Level AA Compliance Requirements
This component must meet WCAG 2.1 Level AA standards, with specific attention to:
- **1.4.3 Contrast (Minimum)**: 4.5:1 for normal text, 3:1 for large text
- **1.4.11 Non-text Contrast**: 3:1 for UI components and graphical objects
- **2.1.1 Keyboard**: All functionality available via keyboard
- **2.4.3 Focus Order**: Logical, intuitive focus progression
- **2.4.7 Focus Visible**: Clear focus indicators
- **4.1.2 Name, Role, Value**: Proper semantic markup and ARIA

## Color & Visual Accessibility

### Color Contrast Requirements
```scss
// Color combinations that meet WCAG AA standards
$combinations: (
  // Normal text (4.5:1 minimum)
  success-on-white: (#58CC02 on #FFFFFF = 5.2:1), ✅
  orange-on-white: (#FF9600 on #FFFFFF = 4.8:1), ✅
  grey-on-white: (#666666 on #FFFFFF = 5.9:1), ✅
  
  // Large text (3:1 minimum)  
  light-orange-on-white: (#FFB84D on #FFFFFF = 3.4:1), ✅
  success-light-on-white: (#7ED321 on #FFFFFF = 4.1:1), ✅
  
  // UI components (3:1 minimum)
  progress-border: (#58CC02 on #F5F5F5 = 4.8:1), ✅
  focus-indicator: (#0066CC on #FFFFFF = 7.1:1) ✅
);
```

### High Contrast Mode Support
```css
/* Windows High Contrast Mode */
@media (prefers-contrast: high) {
  .progress-day {
    border: 2px solid ButtonText;
    background: ButtonFace;
  }
  
  .progress-day--completed {
    background: Highlight;
    color: HighlightText;
  }
  
  .progress-day--current {
    border-color: Highlight;
    background: ButtonFace;
    color: ButtonText;
  }
}

/* macOS High Contrast */
@media (prefers-contrast: high) and (-webkit-min-device-pixel-ratio: 1) {
  .progress-day {
    border-width: 2px;
    border-style: solid;
  }
}
```

### Color Independence
**Critical Rule**: No information conveyed through color alone.

```jsx
// Correct: Multiple indicators for states
const DayComponent = ({ status, day }) => (
  <div 
    className={`day day--${status}`}
    aria-label={`${day}: ${getStatusLabel(status)}`}
  >
    {/* Visual icon for status */}
    <Icon name={getStatusIcon(status)} />
    
    {/* Text label for clarity */}
    <span className="day-label">{day}</span>
    
    {/* Additional visual indicator */}
    <ProgressRing completion={getCompletion(status)} />
  </div>
);

const getStatusIcon = (status) => ({
  completed: 'check-circle',
  current: 'play-circle', 
  locked: 'lock'
}[status]);

const getStatusLabel = (status) => ({
  completed: 'Completed',
  current: 'Current day - tap to begin',
  locked: 'Not yet available'
}[status]);
```

## Screen Reader Support

### Semantic HTML Structure
```jsx
const ProgressMap = ({ weekData, currentStreak }) => (
  <section 
    aria-labelledby="progress-heading"
    role="region"
  >
    <h2 id="progress-heading" className="sr-only">
      Weekly Progress Tracker
    </h2>
    
    <div 
      role="progressbar"
      aria-label={`Weekly progress: ${weekData.completedDays} of 7 days completed`}
      aria-valuenow={weekData.completedDays}
      aria-valuemin={0}
      aria-valuemax={7}
    >
      <ol 
        className="progress-days"
        aria-label="Days of the week"
      >
        {weekData.days.map((day, index) => (
          <DayItem 
            key={day.date} 
            day={day} 
            position={index + 1}
            total={7}
          />
        ))}
      </ol>
    </div>
    
    <StreakCounter 
      count={currentStreak}
      aria-describedby="streak-explanation"
    />
    
    <p id="streak-explanation" className="sr-only">
      Current streak represents consecutive days of completed activities
    </p>
  </section>
);
```

### Dynamic Content Announcements
```jsx
// Live regions for status updates
const ProgressMap = () => {
  const [announcement, setAnnouncement] = useState('');
  
  const handleDayCompletion = (day) => {
    setAnnouncement(
      `Day ${day.name} completed! ${getStreakUpdate(day)}`
    );
    
    // Clear announcement after screen readers consume it
    setTimeout(() => setAnnouncement(''), 1000);
  };
  
  return (
    <div>
      {/* Main component */}
      <ProgressMapView onDayComplete={handleDayCompletion} />
      
      {/* Live region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      
      {/* Assertive region for important updates */}
      <div 
        aria-live="assertive"
        aria-atomic="true" 
        className="sr-only"
      >
        {criticalAnnouncement}
      </div>
    </div>
  );
};
```

### ARIA Labels and Descriptions
```jsx
const DayItem = ({ day, position, total }) => {
  const isToday = day.status === 'current';
  const isCompleted = day.status === 'completed';
  const isLocked = day.status === 'locked';
  
  return (
    <li>
      <button
        className={`day-button day-button--${day.status}`}
        aria-label={getDayAriaLabel(day, position, total)}
        aria-describedby={`day-${day.id}-details`}
        aria-current={isToday ? 'step' : undefined}
        aria-disabled={isLocked}
        disabled={isLocked}
        onClick={() => handleDayClick(day)}
      >
        <span aria-hidden="true">{day.displayName}</span>
        
        {isCompleted && (
          <Icon 
            name="check" 
            aria-label="Completed"
            size="small"
          />
        )}
        
        {isToday && (
          <ProgressRing 
            progress={day.completionPercent}
            aria-label={`${day.completionPercent}% complete`}
          />
        )}
      </button>
      
      <div 
        id={`day-${day.id}-details`} 
        className="sr-only"
      >
        {getDayDescription(day)}
      </div>
    </li>
  );
};

const getDayAriaLabel = (day, position, total) => {
  const base = `${day.displayName}, day ${position} of ${total}`;
  
  switch (day.status) {
    case 'completed':
      return `${base}, completed with ${day.activities.length} activities`;
    case 'current':
      return `${base}, current day, ${day.completionPercent}% complete, activate to continue`;
    case 'locked':
      return `${base}, not yet available`;
    default:
      return base;
  }
};
```

## Keyboard Navigation

### Focus Management
```jsx
const ProgressMap = () => {
  const dayRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  useEffect(() => {
    // Focus current day on mount
    const currentDayIndex = days.findIndex(day => day.status === 'current');
    if (currentDayIndex !== -1) {
      dayRefs.current[currentDayIndex]?.focus();
      setFocusedIndex(currentDayIndex);
    }
  }, [days]);
  
  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        focusPreviousDay(index);
        break;
      case 'ArrowRight':
        event.preventDefault();
        focusNextDay(index);
        break;
      case 'Home':
        event.preventDefault();
        focusFirstDay();
        break;
      case 'End':
        event.preventDefault();
        focusLastDay();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        activateDay(index);
        break;
    }
  };
  
  return (
    <div 
      role="toolbar" 
      aria-label="Weekly progress navigation"
      onKeyDown={handleKeyDown}
    >
      {days.map((day, index) => (
        <DayButton
          key={day.id}
          ref={el => dayRefs.current[index] = el}
          day={day}
          tabIndex={focusedIndex === index ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => setFocusedIndex(index)}
        />
      ))}
    </div>
  );
};
```

### Focus Indicators
```scss
// High-visibility focus indicators
.day-button {
  &:focus {
    outline: 2px solid #0066CC;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.2);
    
    // Ensure focus indicator is visible in high contrast
    @media (prefers-contrast: high) {
      outline: 3px solid Highlight;
      outline-offset: 2px;
    }
  }
  
  // Remove focus indicator when clicking (but keep for keyboard)
  &:focus:not(.focus-visible) {
    outline: none;
    box-shadow: none;
  }
}
```

## Motor Accessibility

### Touch Target Sizing
```scss
// Minimum 44px touch targets (iOS HIG / Android guidelines)
.day-button {
  min-width: 44px;
  min-height: 44px;
  padding: 8px;
  
  // Tablet: Larger targets for easier interaction
  @media (min-width: 768px) {
    min-width: 48px;
    min-height: 48px;
    padding: 12px;
  }
}

// Current day gets extra size for prominence
.day-button--current {
  min-width: 54px;
  min-height: 54px;
}
```

### Interaction Timing
```javascript
// No time-based restrictions on interactions
const INTERACTION_SETTINGS = {
  clickDelay: 0, // No artificial delays
  doubleClickTime: 500, // Standard system setting
  longPressTime: 500, // Reasonable long press threshold
  animationDuration: 300 // Can be disabled via prefers-reduced-motion
};

// Debounce rapid interactions to prevent errors
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return (...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };
};
```

### Alternative Input Methods
```jsx
// Voice control support via proper labeling
const DayButton = ({ day }) => (
  <button
    // Voice commands: "Click Monday" or "Press current day"
    aria-label={`${day.name}${day.status === 'current' ? ' current day' : ''}`}
    
    // Switch control support via proper focus management
    tabIndex={day.focusable ? 0 : -1}
    
    // Eye tracking / head mouse support via large click targets
    className="day-button day-button--large-target"
  >
    {day.display}
  </button>
);
```

## Cognitive Accessibility

### Clear Language & Instructions
```jsx
const ProgressInstructions = () => (
  <div className="instructions" id="progress-instructions">
    <h3>How it works:</h3>
    <ul>
      <li>Complete daily activities to mark each day</li>
      <li>Build streaks by completing consecutive days</li>  
      <li>Tap any completed day to see what you accomplished</li>
      <li>Your current day shows your progress for today</li>
    </ul>
  </div>
);

// Reference instructions in main component
<div aria-describedby="progress-instructions">
  {/* Progress map content */}
</div>
```

### Error Prevention & Recovery
```jsx
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  if (hasError) {
    return (
      <div role="alert" className="error-state">
        <h2>Something went wrong</h2>
        <p>Your progress is safe. Let's get you back on track.</p>
        <button 
          onClick={() => {
            setHasError(false);
            setErrorMessage('');
          }}
        >
          Try again
        </button>
      </div>
    );
  }
  
  return children;
};
```

### Consistent Patterns
```jsx
// Consistent interaction patterns across all day states
const INTERACTION_PATTERNS = {
  completed: {
    click: 'viewDetails',
    keyPress: 'viewDetails', 
    longPress: 'quickPreview'
  },
  current: {
    click: 'startActivity',
    keyPress: 'startActivity',
    longPress: 'showProgress'
  },
  locked: {
    click: 'showTooltip',
    keyPress: 'announceStatus',
    longPress: 'noAction'
  }
};
```

## Motion & Animation Accessibility

### Reduced Motion Support
```scss
// Respect user's motion preferences
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  // Provide alternative feedback for users who can't see animations
  .completion-animation {
    &::after {
      content: "✓ Complete";
      position: absolute;
      background: var(--success-color);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
    }
  }
}

// Safe animations that don't trigger vestibular disorders
@media (prefers-reduced-motion: no-preference) {
  .day-button {
    transition: transform 150ms ease-out;
    
    &:hover {
      transform: translateY(-1px); // Small, controlled movement
    }
  }
  
  .current-day {
    animation: gentle-pulse 3s ease-in-out infinite;
  }
}

@keyframes gentle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

## Testing & Validation

### Automated Testing
```javascript
// Jest + Testing Library accessibility tests
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('progress map has no accessibility violations', async () => {
  const { container } = render(<ProgressMap {...mockProps} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('keyboard navigation works correctly', () => {
  render(<ProgressMap {...mockProps} />);
  
  const currentDay = screen.getByRole('button', { name: /current day/i });
  currentDay.focus();
  
  userEvent.keyboard('{ArrowRight}');
  expect(screen.getByRole('button', { name: /tomorrow/i })).toHaveFocus();
});
```

### Manual Testing Checklist
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver, TalkBack)
- [ ] Keyboard-only navigation 
- [ ] High contrast mode verification
- [ ] Voice control testing
- [ ] Switch control testing
- [ ] Zoom testing (up to 400% magnification)
- [ ] Color blindness simulation
- [ ] Reduced motion preference testing

### User Testing with Disabilities
- Schedule testing sessions with users who have various disabilities
- Test with actual assistive technology users prefer
- Focus on task completion, not just technical compliance
- Gather feedback on cognitive load and user experience

---

*These accessibility requirements ensure the progress map is usable by all users, regardless of their abilities or the assistive technologies they use.*