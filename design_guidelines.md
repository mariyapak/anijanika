# Design Guidelines: Nanny Hours Tracking Web App

## Design Approach
**Design System Approach**: Material Design for productivity applications
- Inspired by calendar apps (Google Calendar) and time-tracking tools (Toggl, Harvest)
- Focus on clarity, data entry efficiency, and calculation transparency
- Clean, functional interface prioritizing usability over decoration

## Core Design Elements

### Typography
- **Primary Font**: Inter or Roboto via Google Fonts
- **Headings**: 
  - Page title: text-2xl font-semibold
  - Section headers: text-lg font-medium
  - Week selector: text-xl font-semibold
- **Body Text**: text-base for labels, text-sm for helper text
- **Numbers/Data**: Use tabular-nums class for aligned digits in time entries and calculations

### Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, and 8 for consistency
- Container: max-w-4xl mx-auto px-4 md:px-6
- Section spacing: py-6 md:py-8
- Component spacing: gap-4 between major elements, gap-2 for related items
- Form field spacing: space-y-4 for vertical stacking

### Component Structure

**Week Navigation Bar**
- Horizontal layout with previous/next week arrows flanking centered current week display
- Format: "Week of [Month DD - DD, YYYY]"
- Arrow buttons with clear touch targets (min 44px)

**Weekly Schedule Table**
- 7-row table (Monday-Sunday) with columns: Day, Date, Start Time, End Time, Hours Worked, Day Rate
- Input fields: Inline time pickers (HH:MM format) with 12-hour or 24-hour toggle
- Calculated fields: Auto-update hours worked on time entry
- Visual distinction: Subtle borders between rows, slightly emphasized weekend rows
- Mobile: Stack columns vertically per day with labels

**Pay Summary Card**
- Elevated card with subtle shadow (shadow-md)
- Layout: 2-column grid on desktop, stacked on mobile
- Line items with label-value pairs:
  - Total Hours: [XX.X] hours
  - Hourly Rate: $[35.00] (editable inline with pencil icon)
  - Hourly Pay: $[XXX.XX]
  - Days Worked: [X] days
  - Gas Reimbursement: $[XX.00] (@$20/day)
  - **Total Weekly Pay**: Bold, larger text (text-xl font-semibold)

**Input Fields**
- Clean outlined inputs with focus states
- Time inputs: Native time picker on mobile, custom dropdown on desktop
- Consistent height: h-10 or h-12
- Hover and focus states with visible border emphasis

**Buttons**
- Primary action: Solid background, rounded-lg, px-6 py-2.5
- Secondary/icon buttons: Outlined or ghost style
- Clear hover/active states

### Visual Hierarchy
- Strong emphasis on Total Weekly Pay (largest, boldest)
- Secondary emphasis on daily hours worked (easy to scan)
- Tertiary: Input fields and individual calculations
- De-emphasized: Helper text and labels

### Mobile Optimization
- Stack weekly table into card-based daily views
- Fixed bottom summary bar showing total pay
- Larger touch targets for time inputs (min 48px)
- Collapsible sections to reduce scrolling

### Data Entry Experience
- Auto-save on blur for all inputs
- Immediate calculation updates (no submit button needed)
- Clear visual feedback when data changes
- Empty state guidance: "Click to enter start time"

### Images
**No hero image required** - This is a functional utility app where immediate access to the schedule is paramount. The interface should load directly into the weekly view.