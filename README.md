# Orderly Menu - Restaurant Menu Web Application

A modern, responsive restaurant menu web application built with React, TypeScript, and TailwindCSS. The application allows customers to browse the menu, place orders, and enables restaurant staff to manage orders through an admin panel.

## Features

- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Responsive Design**: Mobile-first approach with a bottom navigation bar
- **Menu Categories**: Organized dish categories for easy navigation
- **Size Options**: Full, Half, and Quarter size options for dishes
- **Cart Management**: Add/remove items, update quantities
- **Table Number Input**: Required before order placement
- **Admin Panel**: 
  - Order management (Preparing/Delivered status)
  - Analytics dashboard
  - Peak hours tracking
  - PDF report generation
- **Real-time Updates**: Order status notifications

## Tech Stack

- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Framer Motion for animations
- React Router for navigation
- React Query for data fetching
- Supabase for backend (to be implemented)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── pages/         # Page components
├── styles/        # Global styles
└── utils/         # Utility functions
```

## Admin Access

- URL: `/admin`
- Password: `Admin@123`

## Design Guidelines

- **Colors**:
  - Background: #F7F7F7
  - Accent: #E04D09
  - Text: #050504
  - White: #FFFFFF
  - Highlight: #F5C000

- **Typography**: Inter font family
- **Components**: Rounded corners, subtle shadows, smooth animations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 