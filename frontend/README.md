# Restaurant Reservation Frontend

Modern React frontend for the Restaurant Reservation and Review Platform.

## Features

- Browse restaurants with search and filtering
- View restaurant details, available tables, and reviews
- Make table reservations
- Submit and read restaurant reviews
- Responsive design for all devices
- Modern UI with Tailwind CSS

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Axios for API calls
- Font Awesome icons
- Google Fonts (Inter & Playfair Display)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Navbar, Footer)
│   │   ├── restaurant/      # Restaurant-specific components
│   │   └── ui/             # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── config/            # Configuration files
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
└── index.html            # HTML template
```

## Setup & Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Components

### Layout Components
- `Navbar` - Main navigation bar
- `Footer` - Site footer with links and info

### UI Components
- `Button` - Reusable button component with variants
- `LoadingSpinner` - Loading indicator
- `StarRating` - Star rating display and input

### Restaurant Components
- `RestaurantCard` - Card display for restaurant listings

### Pages
- `Home` - Landing page with restaurant listings
- `RestaurantDetails` - Restaurant details and reservation
- `ThankYou` - Reservation confirmation

## Styling

The project uses Tailwind CSS with a custom configuration:

- Custom color scheme
- Custom font families (Inter & Playfair Display)
- Responsive breakpoints
- Custom component classes

### CSS Structure

- Base styles in `index.css`
- Utility classes from Tailwind
- Custom component classes
- Responsive design patterns

## API Integration

The frontend communicates with the backend API using Axios:

- Restaurant listings and details
- Table reservations
- Reviews and ratings

See `services/api.service.js` for implementation details.

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify:
- Connect to GitHub repository
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variables in Netlify dashboard

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

1. Use functional components with hooks
2. Follow consistent naming conventions
3. Keep components focused and reusable
4. Use proper TypeScript types (if added later)
5. Write meaningful component documentation
6. Follow accessibility best practices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
