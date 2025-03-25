# 3D Glowing Icons & Demo Data for LifeTrackPro

This extension adds beautiful 3D glowing icons and comprehensive demo data to the LifeTrackPro application.

## Features Added

### 1. 3D Glowing Icons
- Interactive, animated 3D icons for all app features
- Customizable colors, sizes, and animations
- Responsive design that works on all devices
- Integrated seamlessly with the app's theme

### 2. Icons Showcase
- Visual dashboard of all application features
- Each icon has consistent styling but unique colors
- Smooth animations on hover and page load

### 3. Comprehensive Demo Data
- Realistic habit tracking data with streaks and history
- Financial transactions across multiple categories
- Budget information with realistic spending patterns
- Chat history with AI insights
- Notifications for achievements and milestones

## How to Use

### Running with Demo Data

1. Run the PowerShell script to generate data and start the app:
```
./run-with-dummy-data.ps1
```

2. Or manually generate the data:
```
npm run generate-dummy-data
npm run dev
```

### Demo Account
The demo data includes a pre-configured user:
- Username: DemoUser
- Email: demo@example.com
- Password: (automatically authenticated in development)

## Technical Details

### GlowingIcon Component
The `GlowingIcon` component provides a reusable way to create consistent 3D icons:

```tsx
<GlowingIcon 
  type="habit" 
  size={60} 
  glowColor="#5eead4" 
  animate={true}
/>
```

Available icon types:
- habit
- finance
- streak
- goal
- reward
- activity
- compass
- trending

### Dummy Data Generation
The demo data is generated using the script at `server/scripts/generate-dummy-data.js`.

This creates:
- A demo user with streak information
- 8 habits with historical data
- 50+ expenses across various categories
- Budgets for common spending categories
- Chat conversation history with the AI assistant
- Notifications for achievements and milestones

### Integration with AI Features
The demo data is specifically designed to showcase the AI-powered insights and charts:
- Habits have realistic completion patterns
- Financial data shows spending trends
- Chat history demonstrates AI capabilities

## Customization

To modify the 3D icons:
- Edit the `GlowingIcon.tsx` component to change styles and animations
- Add additional icon types in the iconMap object

To modify the demo data:
- Edit the `generate-dummy-data.js` script
- Run `npm run generate-dummy-data` to regenerate

## File Structure

- `components/ui/GlowingIcon.tsx` - The main icon component
- `components/dashboard/IconsShowcase.tsx` - Grid display of all icons
- `server/scripts/generate-dummy-data.js` - Demo data generator
- `run-with-dummy-data.ps1` - PowerShell script to set up and run the app 