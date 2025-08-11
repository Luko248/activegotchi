# Component Architecture Specifications  
*Progress Map Component | ActiveGotchi Design System*

## Component Hierarchy

### Primary Structure
```
ProgressMap (Container)
├── ProgressMapProvider (Context)
├── WeeklyProgressView (Layout)
│   ├── WeekHeader (Title & Navigation)
│   ├── DaysContainer (Main Content)
│   │   ├── DayComponent (×7)
│   │   │   ├── DayVisual (Icon/Animation)
│   │   │   ├── DayLabel (Text)
│   │   │   ├── ProgressIndicator (Ring/Bar)
│   │   │   └── StatusIcon (Check/Lock/Play)
│   │   └── StreakIndicator (Flame/Counter)
│   └── WeeklyStats (Summary)
├── DayDetailModal (Overlay)
│   ├── ModalHeader (Title & Close)
│   ├── ActivitySummary (Content)
│   ├── AchievementsList (Badges)
│   ├── ProgressChart (Visual Stats)
│   └── ModalNavigation (Prev/Next Day)
└── LoadingStates (Fallbacks)
    ├── SkeletonWeek (Loading)
    ├── ErrorBoundary (Errors) 
    └── EmptyState (No Data)
```

## Component Specifications

### 1. ProgressMap (Root Container)

#### Props Interface
```typescript
interface ProgressMapProps {
  // Data
  currentWeek: WeekData;
  streakCount: number;
  userId?: string;
  
  // Behavior
  onDaySelect?: (day: DayData) => void;
  onStreakTap?: () => void;
  onWeekChange?: (weekOffset: number) => void;
  
  // State
  loading?: boolean;
  error?: Error | null;
  disabled?: boolean;
  
  // Customization
  theme?: 'light' | 'dark' | 'auto';
  animate?: boolean;
  showWeeklyStats?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  announcementText?: string;
}

interface WeekData {
  weekStartDate: Date;
  weekEndDate: Date;
  days: DayData[];
  weeklyGoalProgress: number; // 0-1
  totalActivitiesCompleted: number;
  weeklyStreak: boolean;
}

interface DayData {
  id: string;
  date: Date;
  dayName: string; // "Monday", "Tuesday", etc.
  dayAbbrev: string; // "Mon", "Tue", etc.
  status: DayStatus;
  completionRate: number; // 0-1
  activities: ActivitySummary[];
  achievements: Achievement[];
  streakContribution: boolean;
  timeSpent: number; // minutes
}

type DayStatus = 'completed' | 'current' | 'locked' | 'missed';

interface ActivitySummary {
  id: string;
  type: 'feeding' | 'playing' | 'cleaning' | 'training';
  completedAt: Date;
  duration: number;
  satisfactionGained: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

#### Component Implementation
```tsx
export const ProgressMap: React.FC<ProgressMapProps> = ({
  currentWeek,
  streakCount,
  onDaySelect,
  onStreakTap,
  loading = false,
  error = null,
  animate = true,
  theme = 'auto',
  ...props
}) => {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [announcement, setAnnouncement] = useState('');
  
  const handleDayClick = useCallback((day: DayData) => {
    if (day.status === 'locked') return;
    
    setSelectedDay(day);
    onDaySelect?.(day);
    
    // Announce to screen readers
    setAnnouncement(`Opened details for ${day.dayName}`);
  }, [onDaySelect]);
  
  const contextValue = useMemo(() => ({
    currentWeek,
    streakCount,
    selectedDay,
    setSelectedDay,
    handleDayClick,
    animate,
    theme
  }), [currentWeek, streakCount, selectedDay, animate, theme]);
  
  if (loading) return <SkeletonWeek />;
  if (error) return <ErrorBoundary error={error} />;
  if (!currentWeek?.days?.length) return <EmptyState />;
  
  return (
    <ProgressMapProvider value={contextValue}>
      <div 
        className={`progress-map progress-map--${theme}`}
        data-testid="progress-map"
      >
        <WeeklyProgressView />
        
        {selectedDay && (
          <DayDetailModal
            day={selectedDay}
            onClose={() => setSelectedDay(null)}
          />
        )}
        
        {/* Live region for screen reader announcements */}
        <div 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
      </div>
    </ProgressMapProvider>
  );
};
```

### 2. DayComponent (Core Interactive Element)

#### Props Interface
```typescript
interface DayComponentProps {
  day: DayData;
  position: number; // 1-7
  isToday: boolean;
  onClick: (day: DayData) => void;
  animate?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}
```

#### Component Implementation
```tsx
export const DayComponent: React.FC<DayComponentProps> = ({
  day,
  position,
  isToday,
  onClick,
  animate = true,
  size = 'medium',
  showLabel = true
}) => {
  const { theme } = useProgressMap();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleClick = () => {
    if (day.status !== 'locked') {
      onClick(day);
    }
  };
  
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };
  
  const ariaLabel = useMemo(() => {
    const base = `${day.dayName}, day ${position} of 7`;
    
    switch (day.status) {
      case 'completed':
        return `${base}, completed with ${day.activities.length} activities`;
      case 'current':
        return `${base}, current day, ${Math.round(day.completionRate * 100)}% complete`;
      case 'locked':
        return `${base}, not available yet`;
      case 'missed':
        return `${base}, missed day`;
      default:
        return base;
    }
  }, [day, position]);
  
  return (
    <div className="day-component-wrapper">
      <button
        ref={buttonRef}
        className={cn(
          'day-component',
          `day-component--${day.status}`,
          `day-component--${size}`,
          { 'day-component--animate': animate }
        )}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        aria-label={ariaLabel}
        aria-current={isToday ? 'step' : undefined}
        disabled={day.status === 'locked'}
        data-testid={`day-${day.id}`}
      >
        <DayVisual 
          status={day.status}
          completionRate={day.completionRate}
          isToday={isToday}
          animate={animate}
        />
        
        {day.status !== 'locked' && (
          <ProgressIndicator
            progress={day.completionRate}
            status={day.status}
            size={size}
          />
        )}
        
        <StatusIcon 
          status={day.status}
          achievements={day.achievements}
        />
        
        {showLabel && (
          <DayLabel 
            text={day.dayAbbrev}
            status={day.status}
          />
        )}
        
        {day.streakContribution && (
          <StreakBadge size="small" />
        )}
      </button>
      
      <div 
        id={`day-${day.id}-description`}
        className="sr-only"
      >
        {day.status === 'completed' && 
          `Completed ${day.activities.length} activities, spent ${day.timeSpent} minutes`
        }
        {day.status === 'current' &&
          `${Math.round(day.completionRate * 100)}% complete today`
        }
      </div>
    </div>
  );
};
```

### 3. DayDetailModal (Information Overlay)

#### Props Interface
```typescript
interface DayDetailModalProps {
  day: DayData;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  showNavigation?: boolean;
}
```

#### Component Implementation
```tsx
export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  onClose,
  onNavigate,
  showNavigation = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Focus management
  useEffect(() => {
    closeButtonRef.current?.focus();
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  // Focus trap
  useFocusTrap(modalRef);
  
  return (
    <div 
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="day-detail-modal"
        data-testid="day-detail-modal"
      >
        <header className="modal-header">
          <h2 id="modal-title">
            {day.dayName} - {format(day.date, 'MMMM d')}
          </h2>
          
          <button
            ref={closeButtonRef}
            className="modal-close"
            onClick={onClose}
            aria-label="Close day details"
          >
            <Icon name="x" size="medium" />
          </button>
        </header>
        
        <div className="modal-content">
          <ActivitySummary activities={day.activities} />
          
          {day.achievements.length > 0 && (
            <AchievementsList achievements={day.achievements} />
          )}
          
          <ProgressChart 
            completionRate={day.completionRate}
            timeSpent={day.timeSpent}
            activitiesCompleted={day.activities.length}
          />
        </div>
        
        {showNavigation && (
          <ModalNavigation 
            onPrevious={() => onNavigate?.('prev')}
            onNext={() => onNavigate?.('next')}
          />
        )}
      </div>
    </div>
  );
};
```

## State Management

### Context Provider
```tsx
interface ProgressMapContextValue {
  currentWeek: WeekData;
  streakCount: number;
  selectedDay: DayData | null;
  setSelectedDay: (day: DayData | null) => void;
  handleDayClick: (day: DayData) => void;
  animate: boolean;
  theme: 'light' | 'dark' | 'auto';
}

const ProgressMapContext = createContext<ProgressMapContextValue | null>(null);

export const useProgressMap = () => {
  const context = useContext(ProgressMapContext);
  if (!context) {
    throw new Error('useProgressMap must be used within ProgressMapProvider');
  }
  return context;
};

export const ProgressMapProvider: React.FC<{
  value: ProgressMapContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <ProgressMapContext.Provider value={value}>
    {children}
  </ProgressMapContext.Provider>
);
```

### Custom Hooks

#### Progress Data Hook
```tsx
export const useProgressData = (userId?: string) => {
  const [currentWeek, setCurrentWeek] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchWeekData = useCallback(async (weekOffset = 0) => {
    try {
      setLoading(true);
      const data = await progressApi.getWeekData(userId, weekOffset);
      setCurrentWeek(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchWeekData();
  }, [fetchWeekData]);
  
  return {
    currentWeek,
    loading,
    error,
    refetch: () => fetchWeekData(),
    fetchWeek: fetchWeekData
  };
};
```

#### Animation Hook
```tsx
export const useProgressAnimations = () => {
  const [prefersReducedMotion] = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [animationsEnabled, setAnimationsEnabled] = useState(!prefersReducedMotion);
  
  useEffect(() => {
    setAnimationsEnabled(!prefersReducedMotion);
  }, [prefersReducedMotion]);
  
  const celebrate = useCallback((type: 'day' | 'streak' | 'achievement') => {
    if (!animationsEnabled) return;
    
    // Trigger appropriate celebration animation
    const celebrationConfig = {
      day: { duration: 1000, particles: 10 },
      streak: { duration: 2000, particles: 20 },
      achievement: { duration: 3000, particles: 30 }
    };
    
    triggerCelebration(celebrationConfig[type]);
  }, [animationsEnabled]);
  
  return {
    animationsEnabled,
    celebrate,
    toggleAnimations: () => setAnimationsEnabled(prev => !prev)
  };
};
```

## Performance Optimization

### Memoization Strategy
```tsx
// Memoized components for expensive renders
export const MemoizedDayComponent = React.memo(DayComponent, (prevProps, nextProps) => {
  return (
    prevProps.day.id === nextProps.day.id &&
    prevProps.day.status === nextProps.day.status &&
    prevProps.day.completionRate === nextProps.day.completionRate &&
    prevProps.isToday === nextProps.isToday
  );
});

// Memoized selectors for derived state
export const useCurrentDay = (weekData: WeekData) => useMemo(
  () => weekData.days.find(day => day.status === 'current'),
  [weekData.days]
);

export const useCompletedDaysCount = (weekData: WeekData) => useMemo(
  () => weekData.days.filter(day => day.status === 'completed').length,
  [weekData.days]
);
```

### Virtual Scrolling (Future Enhancement)
```tsx
// For extended history view
export const VirtualizedWeekList = ({ weeks }: { weeks: WeekData[] }) => {
  const {
    containerRef,
    wrapperRef,
    visibleRange,
    scrollToIndex
  } = useVirtualScroll({
    itemCount: weeks.length,
    itemHeight: 120,
    overscan: 2
  });
  
  return (
    <div ref={containerRef} className="week-list-container">
      <div ref={wrapperRef}>
        {visibleRange.map(index => (
          <WeeklyProgressView 
            key={weeks[index].weekStartDate.toISOString()}
            weekData={weeks[index]}
          />
        ))}
      </div>
    </div>
  );
};
```

## Testing Architecture

### Component Testing
```tsx
// Test utilities
export const renderProgressMap = (props: Partial<ProgressMapProps> = {}) => {
  const defaultProps: ProgressMapProps = {
    currentWeek: mockWeekData,
    streakCount: 5,
    onDaySelect: jest.fn(),
    onStreakTap: jest.fn()
  };
  
  return render(<ProgressMap {...defaultProps} {...props} />);
};

// Component tests
describe('ProgressMap', () => {
  it('renders all days correctly', () => {
    renderProgressMap();
    
    expect(screen.getAllByRole('button')).toHaveLength(7);
    expect(screen.getByLabelText(/current day/i)).toBeInTheDocument();
  });
  
  it('handles day selection', async () => {
    const onDaySelect = jest.fn();
    renderProgressMap({ onDaySelect });
    
    const completedDay = screen.getByLabelText(/completed/i);
    await userEvent.click(completedDay);
    
    expect(onDaySelect).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'completed' })
    );
  });
  
  it('respects accessibility requirements', async () => {
    const { container } = renderProgressMap();
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
```

---

*This component architecture provides a robust, scalable, and accessible foundation for the ActiveGotchi progress map system, built with React best practices and comprehensive TypeScript support.*