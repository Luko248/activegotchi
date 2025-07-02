# ActiveGotchi - Implementation Specification

## 1. Project Overview
**Name:** ActiveGotchi  
**Type:** Mobile multiplatform application  
**Core Concept:** Activity tracking app with interactive 3D pet avatar that reacts to user's fitness achievements  
**Target Platform:** iOS and Android  
**App Architecture:** Data mirror app (no local data storage)

## 2. Data Integration Requirements
### Health Data Sources
- **Primary Sources:**
  - Google Fit (Android devices)
  - Apple HealthKit (iOS devices)
- **Tracked Metrics:**
  - Daily step count
  - Daily distance traveled
- **Data Handling:**
  - Real-time data fetching from native health apps
  - No local data storage - app mirrors external data only
  - Immediate response to goal achievements in native apps
  - Notification triggers when health goals are reached

### MVP Implementation
- Mock Apple HealthKit data for initial testing
- Focus on Google Fit integration first
- Implement real Apple HealthKit integration in later phases

## 3. User Experience Flow
### Initial Setup (Onboarding)
1. App launch
2. Request health data permissions
3. Single input field: "Enter your pet's name"
4. Proceed to main interface

### Main Interface Navigation
1. **Primary Screen:** 3D pet avatar (center focus)
2. **Secondary Screen:** Scroll down to access data carousel
3. **Interaction:** Touch controls for pet manipulation

## 4. Technical Implementation Stack
### Core Framework
- **Language:** TypeScript
- **Framework:** React with Vite (current implementation)
- **Cross-Platform:** Lynx library (future consideration for native mobile deployment)

### UI/UX Technologies
- **Styling:** Tailwind CSS v4 with glassmorphism design system
- **Design System:** Custom CSS classes for glass effects and theming
- **Theme:** System-adaptive (light/dark mode) with automatic detection
- **Transparency:** Optimized glass effects with proper contrast

### 3D Implementation
- **Primary:** React Three Fiber + Three.js (current implementation)
- **3D Engine:** Three.js with React integration
- **Features:** Interactive 3D pet with mood-based animations, touch controls
- **Fallback:** 2D emoji-based pet avatar for compatibility

### Documentation Resources
- Use Context7 or Quillopy MCP for accessing technical documentation

## 5. User Interface Specifications
### Design Principles
- **Style:** Modern, minimalist interface
- **Visual Hierarchy:** Pet-centric design with secondary data display
- **Responsive:** Adaptive to different screen sizes
- **Accessibility:** System theme preference support


## 6. 3D Pet Avatar Specifications
### Behavioral States
- **Happy State:** Triggered when daily goals are achieved
- **Sad State:** Displayed when goals are not met
- **Neutral State:** Default state during goal progress

### Interactive Features
- **Rotation:** Touch and drag to rotate pet view
- **Zoom:** Pinch gestures for zoom in/out
- **Touch Animation:** Special animation when user taps the pet
- **Real-time Response:** Pet state changes immediately upon goal achievement

### Animation Requirements
- Smooth transitions between emotional states
- Touch-responsive animations
- Goal achievement celebration animations

## 7. Data Display Components
### Fitness Data Carousel
- **Metrics Displayed:**
  - Current step count
  - Daily distance progress
- **Layout:** Horizontal scrollable cards
- **Update Frequency:** Real-time synchronization with health apps
- **Visual Design:** Glassmorphism cards with blur effects

## 8. Notification System
### Trigger Events
- Goal achievement in native health apps
- Daily milestone completions
- Pet state changes

### Implementation Requirements
- Background app refresh capabilities
- Push notification permissions
- Real-time data synchronization

## 9. Development Implementation Phases
### Phase 1: Core Setup
1. Project scaffolding with chosen framework
2. Basic UI layout implementation
3. Health data API integration (Google Fit focus)

### Phase 2: 3D Integration
1. 3D pet model creation/integration
2. Touch gesture implementation
3. Animation system setup

### Phase 3: Data Synchronization
1. Real-time data fetching
2. Pet state management based on fitness data
3. Notification system implementation

### Phase 4: Polish & Testing
1. UI/UX refinements
2. Performance optimization
3. Cross-platform testing
4. Apple HealthKit integration (replace mocked data)

## 10. Technical Considerations
### Performance Requirements
- Smooth 3D rendering on mobile devices
- Efficient real-time data fetching
- Battery optimization for background processes

### Platform-specific Implementations
- **Android:** Google Fit API integration
- **iOS:** Apple HealthKit framework integration
- **Cross-platform:** Shared UI components and business logic

### Security & Privacy
- Secure health data handling
- User privacy compliance
- Minimal data retention (mirror-only approach)

## 11. AI Implementation Guidelines
### For AI Assistants Working on This Project
- **Priority Order:** Follow development phases 1-4 sequentially
- **Key Constraints:** No local data storage, real-time mirroring only
- **Critical Features:** 3D pet responsiveness to fitness data
- **Performance Focus:** Mobile optimization and battery efficiency
- **Documentation:** Always reference Context7 or Quillopy MCP for technical docs
- **Testing Strategy:** Start with Google Fit, mock Apple HealthKit initially
