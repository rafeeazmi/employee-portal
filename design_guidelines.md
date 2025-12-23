# Internal Employee Portal - Design Guidelines

## Design Approach

**Selected Framework:** Design System Approach - Material Design + Linear inspiration
**Rationale:** Utility-focused internal tool requiring efficiency, clarity, and data-dense displays. Drawing from Linear's modern aesthetic and Material Design's robust component patterns for enterprise applications.

## Core Design Principles

1. **Information First:** Dashboard-centric design with immediate access to critical data
2. **Quick Actions:** Prominent booking and status-check workflows
3. **Clarity Over Decoration:** Minimal visual noise, maximum information density
4. **Responsive Hierarchy:** Clear visual distinction between primary and secondary content

---

## Typography System

**Primary Font:** Inter (via Google Fonts CDN)
**Secondary Font:** JetBrains Mono (for employee IDs, room numbers)

**Hierarchy:**
- Page Headers: text-3xl font-semibold (36px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base font-normal (16px)
- Metadata/Labels: text-sm font-medium (14px)
- Captions: text-xs (12px)

---

## Layout System

**Spacing Scale:** Use Tailwind units of **4, 6, 8, 12, 16** consistently
- Component padding: p-6
- Section gaps: gap-8
- Card spacing: space-y-6
- Grid gaps: gap-6

**Container Strategy:**
- Dashboard grid: max-w-7xl mx-auto px-6
- Content cards: Full width within grid system
- Modals/Forms: max-w-2xl centered

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with app logo/title left-aligned
- User profile, notifications, quick actions right-aligned
- Height: h-16
- Search bar centered (booking rooms, finding employees)

**Side Navigation (Optional Secondary):**
- Services menu: Meeting Rooms, Employee Directory, My Schedule
- Width: w-64 on desktop, collapsible on mobile

### Dashboard Layout
**Grid System:** Two-column desktop (grid-cols-1 lg:grid-cols-2), single mobile
- Left: Meeting Room Availability widget
- Right: Employee Status widget
- Below: Recent Bookings, Upcoming Leave calendar

### Meeting Room Availability Component
**Card-Based Design:**
- Room cards showing: Room name, capacity, current status, next available slot
- Status indicators: Available (clear), Occupied (distinct treatment), Reserved (different treatment)
- Quick book button on each card
- Filter bar: Location, capacity, amenities (projector, video conf)
- Calendar view toggle option

**Booking Modal:**
- Date/time picker with visual availability grid
- Room details sidebar
- Attendee count input
- Purpose/title field
- Confirm/Cancel actions

### Employee Status Component
**Directory Table:**
- Columns: Name, Department, Status, Duration, Contact
- Status badges: On Duty, On Leave, Remote, Out of Office
- Search/filter by department, status type
- Sortable columns
- Avatar + name display

**Status Detail Card:**
- Expanded view on row click
- Leave dates, return date
- Contact information (if on duty)
- Alternative contact (if on leave)

### Data Visualization
**Occupancy Dashboard:**
- Simple bar charts for room utilization (Chart.js or Recharts)
- Team availability overview (visual calendar grid)
- Peak booking hours heatmap

---

## Icons
**Library:** Heroicons (via CDN)
**Usage:**
- Navigation: outline style at size-6
- Status indicators: solid style at size-5
- Action buttons: outline style at size-5
- Calendar: calendar icon, clock icon
- People: user-group icon, user icon
- Rooms: home-modern icon, squares icon

---

## Forms & Inputs
**Consistent Styling:**
- Input fields: border rounded-lg, h-12 padding
- Labels: text-sm font-medium mb-2
- Focus states: ring treatment
- Error states: red border treatment with text-sm message
- Date pickers: Modern calendar widget with range selection

**Button Hierarchy:**
- Primary actions: Larger size (px-6 py-3), prominent treatment
- Secondary actions: Standard size (px-4 py-2), subtle treatment
- Tertiary: Text-only buttons

---

## Responsive Behavior

**Breakpoints:**
- Mobile (< 768px): Single column, stacked cards, hamburger menu
- Tablet (768px - 1024px): Adapted two-column where suitable
- Desktop (> 1024px): Full grid layout with sidebar

**Mobile Optimizations:**
- Bottom tab navigation for core services
- Swipeable room cards
- Simplified table view (show critical columns only)

---

## Animations
**Minimal, Purposeful:**
- Card hover: Subtle lift (translate-y-1)
- Modal entry: Fade in with scale-95 to scale-100
- Status changes: Smooth badge transition
- Loading states: Simple spinner for data fetching

---

## Images

**Avatar/Profile Photos:**
- Circular avatars (rounded-full) at size-10 (40px) in directory
- Size-12 (48px) in detailed views
- Placeholder initials for employees without photos

**Meeting Room Photos:**
- Room cards: 16:9 aspect ratio thumbnail (rounded-lg)
- Room detail modal: Larger 3:2 aspect ratio hero image
- Multiple photos in gallery view for room details

**No Hero Section:** Dashboard-first design, no marketing imagery needed

---

## Accessibility
- ARIA labels for all status indicators
- Keyboard navigation for booking flows
- Screen reader announcements for status updates
- High contrast status badges
- Focus visible states on all interactive elements